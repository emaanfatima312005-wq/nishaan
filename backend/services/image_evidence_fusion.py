"""
Image Evidence Fusion Service

Combines independent evidence signals from the image
analysis pipeline into one final confidence score
with explicit status levels and contradiction handling.

EVIDENCE SIGNALS AND MAXIMUM WEIGHTS
====================================
EXIF GPS ............. 100  (strongest, ground truth)
OCR text verified ....  20  (text confirmed in OSM)
OSM resolver city ....  18  (resolver found city in OSM)
Vision city ..........   8  (vision model identified city)
Vision landmarks ....   5  (vision identified landmarks)
GeoCLIP top ..........  12  (best GeoCLIP candidate prob)
StreetCLIP city ......  14  (city classification)
StreetCLIP region ....   5  (region/province agreement)
OSM nearby evidence ..  10  (Overpass nearby places)

BONUSES (small additional signals)
====================================
Cross-evidence .......   8  (3+ strong signals agree)
OCR text present .....   5  (text exists even if not
                              verified against OSM)
Landmark match .......   5  (vision landmark matches
                              known place)

Theoretical maximum with all evidence: ~100

CONTRADICTION PENALTIES
=======================
City mismatch between any two sources: -12 each
Country mismatch (StreetCLIP says not
  Pakistan):                           -20

CONFIDENCE CAPS (independent of raw score)
==========================================
0 independent strong signals → cap 65
1 independent strong signal  → cap 79
2 independent strong signals → cap 89
3+ strong signals            → no cap

STATUS LEVELS
=============
verified   ≥ 85 and 3+ sources agree
likely     ≥ 65
candidate  ≥ 40
uncertain  < 40 or contradictions

FIELD RESTRICTIONS
==================
- Below confidence 50 or uncertain: street, area,
  town, house_number are set to null.
- Exact street requires strong verification from
  EXIF GPS, OCR + OSM, or resolver match.
"""


class ImageEvidenceFusion:

    # --------------------------------------------------
    # Maximum weight per evidence source
    # --------------------------------------------------
    WEIGHTS = {
        "exif":            100,
        "ocr_verified":    20,
        "resolver_city":   18,
        "vision_city":     8,
        "geoclip":         12,
        "streetclip_city": 14,
        "streetclip_region": 5,
        "osm_nearby":      10,
        "cross_evidence":  8,
        "ocr_text":        5,
        "landmark_match":  5,
    }

    @staticmethod
    def _normalize_confidence(raw):
        """Ensure confidence is int 0-100."""
        if raw is None:
            return 0
        if isinstance(raw, float) and raw <= 1.0:
            return int(round(raw * 100))
        return int(round(raw))

    @staticmethod
    def _extract_city(location_string):
        """Pull first meaningful token from a
        location string for comparison."""
        if not location_string:
            return ""
        return str(location_string).split(",")[0].strip()

    @staticmethod
    def _cities_agree(city_a, city_b):
        """Case-insensitive substring city comparison."""
        if not city_a or not city_b:
            return False
        a = city_a.strip().lower()
        b = city_b.strip().lower()
        if not a or not b:
            return False
        if len(a) < 3 or len(b) < 3:
            return False
        return a in b or b in a

    # --------------------------------------------------
    # MAIN FUSION METHOD
    # --------------------------------------------------

    @classmethod
    def fuse(
        cls,
        *,
        exif_gps,
        vision_result,
        geoclip_predictions,
        streetclip_country,
        streetclip_region,
        streetclip_city,
        candidate_result,
        precise_location,
        resolver_city,
    ):
        """
        Combine evidence from all pipeline stages into
        a single location result with evidence-based
        confidence and status.

        Parameters
        ----------
        exif_gps : dict or None
            {"latitude": float, "longitude": float}
            if EXIF GPS metadata was found.

        vision_result : dict
            Output from LocationAnalyzer.analyze_image().
            Contains city, province, visible_text,
            landmarks, place_names, confidence, etc.

        geoclip_predictions : list[dict]
            Top-k Pakistan-filtered GeoCLIP predictions.

        streetclip_country : list[dict]
            StreetCLIP country classifications.
        streetclip_region : list[dict]
            StreetCLIP region classifications.
        streetclip_city : list[dict]
            StreetCLIP city classifications.

        candidate_result : dict or None
            Output from LocationCandidateService
            .resolve_image().

        precise_location : dict or None
            Output from UniversalLocationResolver.

        resolver_city : str or None
            City returned by the resolver BEFORE
            final_location was overwritten.  Used to
            detect OSM city verification.

        Returns
        -------
        dict with keys:
            latitude, longitude, gps_source,
            confidence, location_status,
            contradictions, evidence_count,
            province, city, town, area, street,
            house_number, evidence
        """

        scores = {}
        contradictions = []
        evidence_signals = []

        # ----------------------------------------------
        # EXTRACT CITY SIGNALS FROM EACH SOURCE
        # ----------------------------------------------
        # We collect the "city opinion" from each
        # independent source to detect agreement
        # or contradiction.

        vision_city = vision_result.get("city") or ""

        resolver_city_str = resolver_city or ""

        # Best GeoCLIP city (reverse-geocode not done
        # here; we rely on candidate_result for the
        # GeoCLIP city opinion)
        geoclip_city = ""
        if candidate_result:
            geoclip_city = (
                candidate_result.get("city") or ""
            )

        # Best StreetCLIP city
        sc_city = ""
        if streetclip_city:
            top_sc = (
                max(
                    streetclip_city,
                    key=lambda x: x.get(
                        "probability", 0
                    ),
                )
                if streetclip_city
                else None
            )
            if top_sc:
                sc_city = (
                    top_sc.get("label", "") or ""
                )

        # Determine the most-supported city.
        # Priority: resolver (OSM verified) >
        # vision > candidate_result
        top_city = (
            resolver_city_str
            or vision_city
            or geoclip_city
        )

        # ----------------------------------------------
        # SCORE EACH EVIDENCE SOURCE
        # ----------------------------------------------

        # --- EXIF GPS (strongest: weight 100) ---
        if exif_gps:
            scores["exif"] = cls.WEIGHTS["exif"]
            evidence_signals.append(
                "EXIF GPS metadata present"
            )

        # --- Vision city (max 8) ---
        vision_conf = cls._normalize_confidence(
            vision_result.get("confidence", 0)
        )
        if vision_city:
            if cls._cities_agree(
                vision_city, top_city
            ):
                scores["vision_city"] = (
                    cls.WEIGHTS["vision_city"]
                )
                evidence_signals.append(
                    f"Vision: {vision_city}"
                )
            else:
                scores["vision_city"] = 2
                evidence_signals.append(
                    f"Vision: {vision_city} "
                    f"(disagrees with top city)"
                )

            # Penalize vision city when no visible
            # text supports it (hallucination risk).
            _vt = (
                vision_result.get("visible_text")
                or []
            )
            if not _vt:
                scores["vision_city"] = max(
                    0,
                    scores.get("vision_city", 0) - 5,
                )
                evidence_signals.append(
                    "Vision city has no OCR "
                    "support (hallucination risk)"
                )

        # --- StreetCLIP city (max 14) ---
        if sc_city:
            if cls._cities_agree(sc_city, top_city):
                scores["streetclip_city"] = (
                    cls.WEIGHTS["streetclip_city"]
                )
                evidence_signals.append(
                    f"StreetCLIP city: {sc_city}"
                )
            else:
                scores["streetclip_city"] = 3
                evidence_signals.append(
                    f"StreetCLIP city: {sc_city} "
                    f"(disagrees)"
                )

        # --- StreetCLIP region (max 5) ---
        sc_region = ""
        if streetclip_region:
            top_region = (
                max(
                    streetclip_region,
                    key=lambda x: x.get(
                        "probability", 0
                    ),
                )
                if streetclip_region
                else None
            )
            if top_region:
                sc_region = (
                    top_region.get("label", "") or ""
                )

        resolver_province = ""
        if candidate_result:
            resolver_province = (
                candidate_result.get("province") or ""
            )

        if sc_region and resolver_province:
            if cls._cities_agree(
                sc_region, resolver_province
            ):
                scores["streetclip_region"] = (
                    cls.WEIGHTS["streetclip_region"]
                )

        # --- GeoCLIP (max 12) ---
        if geoclip_predictions:
            best_prob = (
                geoclip_predictions[0].get(
                    "probability", 0
                )
            )
            scores["geoclip"] = min(
                cls.WEIGHTS["geoclip"],
                round(
                    best_prob
                    * cls.WEIGHTS["geoclip"]
                    * 5
                ),
            )
            evidence_signals.append(
                f"GeoCLIP top prob: "
                f"{best_prob:.2f}"
            )

        # --- Resolver / OSM verification (max 18) ---
        if resolver_city_str:
            if cls._cities_agree(
                resolver_city_str, top_city
            ):
                scores["resolver_city"] = (
                    cls.WEIGHTS["resolver_city"]
                )
                evidence_signals.append(
                    f"OSM verified: "
                    f"{resolver_city_str}"
                )
            else:
                scores["resolver_city"] = 5
                evidence_signals.append(
                    f"OSM: {resolver_city_str} "
                    f"(disagrees)"
                )
        elif precise_location:
            scores["resolver_city"] = 3
            evidence_signals.append(
                "OSM resolver ran but no city"
            )

        # --- OSM nearby evidence (max 10) ---
        if candidate_result:
            supporting = (
                candidate_result.get(
                    "supporting_places", []
                )
                or []
            )
            if supporting:
                scores["osm_nearby"] = min(
                    cls.WEIGHTS["osm_nearby"],
                    len(supporting) * 3,
                )
                evidence_signals.append(
                    f"{len(supporting)} nearby OSM "
                    f"places found"
                )

        # --- Visible text / OCR (max 20 if OSM
        #     verified, max 5 if just present) ---
        visible_text = (
            vision_result.get("visible_text")
            or []
        )
        if visible_text:
            candidate_evidence = (
                candidate_result.get("evidence", [])
                if candidate_result
                else []
            )
            ocr_matched = any(
                "visible text matches" in str(e)
                or "text match" in str(e)
                for e in candidate_evidence
            )
            if ocr_matched:
                scores["ocr_verified"] = (
                    cls.WEIGHTS["ocr_verified"]
                )
                evidence_signals.append(
                    f"OCR verified: "
                    f"{visible_text[:3]}"
                )
            else:
                scores["ocr_text"] = (
                    cls.WEIGHTS["ocr_text"]
                )
                evidence_signals.append(
                    f"OCR text found: "
                    f"{visible_text[:3]}"
                )

        # --- Landmark match (max 5) ---
        vision_landmarks = (
            vision_result.get("landmarks") or []
        )
        if vision_landmarks:
            candidate_evidence = (
                candidate_result.get("evidence", [])
                if candidate_result
                else []
            )
            landmark_matched = any(
                "landmark" in str(e).lower()
                for e in candidate_evidence
            )
            if landmark_matched:
                scores["landmark_match"] = (
                    cls.WEIGHTS["landmark_match"]
                )
                evidence_signals.append(
                    "Landmark match confirmed"
                )

        # --- Cross-evidence bonus (max 8) ---
        # Awarded when 3+ strong signals agree
        # on the same city.
        strong_agree = sum([
            bool(
                scores.get("vision_city", 0)
                >= cls.WEIGHTS["vision_city"]
            ),
            bool(
                scores.get("streetclip_city", 0)
                >= cls.WEIGHTS["streetclip_city"]
            ),
            bool(
                scores.get("ocr_verified", 0)
                > 0
            ),
            bool(
                scores.get("resolver_city", 0)
                >= cls.WEIGHTS["resolver_city"]
            ),
        ])

        if strong_agree >= 3:
            scores["cross_evidence"] = (
                cls.WEIGHTS["cross_evidence"]
            )
            evidence_signals.append(
                f"Cross-evidence: {strong_agree} "
                f"sources agree on {top_city}"
            )

        # ----------------------------------------------
        # SUM SCORES
        # ----------------------------------------------
        raw_score = sum(scores.values())

        # ----------------------------------------------
        # CONTRADICTION DETECTION AND PENALTIES
        # ----------------------------------------------

        # City contradictions
        city_sources = {
            "GeoCLIP/candidate": geoclip_city,
            "StreetCLIP": sc_city,
            "Vision": vision_city,
        }

        for source, source_city in city_sources.items():
            if (
                source_city
                and top_city
                and not cls._cities_agree(
                    source_city, top_city
                )
                and len(source_city) >= 3
            ):
                raw_score -= 12
                contradictions.append(
                    f"{source} suggests "
                    f"{source_city}, expected "
                    f"{top_city}"
                )

        # Country contradiction
        if streetclip_country:
            top_country = (
                max(
                    streetclip_country,
                    key=lambda x: x.get(
                        "probability", 0
                    ),
                )
                if streetclip_country
                else None
            )
            if top_country:
                top_label = (
                    top_country.get("label", "")
                    or ""
                ).lower()
                if (
                    "pakistan" not in top_label
                    and top_country.get(
                        "probability", 0
                    )
                    > 0.4
                ):
                    raw_score -= 20
                    contradictions.append(
                        f"StreetCLIP country: "
                        f"{top_label} (expected "
                        f"Pakistan)"
                    )

        # ----------------------------------------------
        # MULTI-SOURCE AGREEMENT COUNT AND CAPS
        # ----------------------------------------------
        # "Independent strong signals" that agree on
        # the top city.

        strong_signals = 0

        if scores.get("exif", 0) > 0:
            strong_signals += 1

        if (
            scores.get("resolver_city", 0)
            >= cls.WEIGHTS["resolver_city"]
        ):
            strong_signals += 1

        if (
            scores.get("ocr_verified", 0)
            > 0
        ):
            strong_signals += 1

        if (
            scores.get("vision_city", 0)
            >= cls.WEIGHTS["vision_city"]
        ):
            strong_signals += 1

        if (
            scores.get("streetclip_city", 0)
            >= cls.WEIGHTS["streetclip_city"]
        ):
            strong_signals += 1

        # Apply confidence caps based on agreement.
        # NEVER return confidence >= 90 unless
        # multiple independent evidence sources agree.
        if strong_signals >= 3:
            pass  # No cap — multiple sources agree
        elif strong_signals == 2:
            raw_score = min(raw_score, 89)
        elif strong_signals == 1:
            raw_score = min(raw_score, 79)
        else:
            raw_score = min(raw_score, 65)

        # ----------------------------------------------
        # FLOOR AND CLAMP
        # ----------------------------------------------
        confidence = max(
            0,
            min(100, round(raw_score)),
        )

        # ----------------------------------------------
        # STATUS LEVEL
        # ----------------------------------------------
        if (
            strong_signals >= 3
            and confidence >= 85
        ):
            status = "verified"
        elif confidence >= 65:
            status = "likely"
        elif confidence >= 40:
            status = "candidate"
        else:
            status = "uncertain"

        # ----------------------------------------------
        # FIELD RESTRICTIONS
        # ----------------------------------------------
        # Exact street-level results require strong
        # verification.  If evidence is weak, only
        # return city/province.

        street_strong = (
            exif_gps is not None
            or (
                precise_location is not None
                and precise_location.get(
                    "latitude"
                )
                is not None
            )
            or (
                confidence >= 65
                and strong_signals >= 2
            )
        )

        # Source fields
        fl = candidate_result or {}
        vl = vision_result or {}

        final_city = (
            fl.get("city")
            or vl.get("city")
            or None
        )
        final_province = (
            fl.get("province")
            or vl.get("province")
            or None
        )

        # Street-level fields: only when evidence
        # is strong enough.
        final_street = (
            (
                fl.get("street")
                or vl.get("street")
                or None
            )
            if street_strong
            else None
        )

        final_house_number = (
            (
                fl.get("house_number")
                or vl.get("house_number")
                or None
            )
            if street_strong
            else None
        )

        final_town = (
            (
                fl.get("town")
                or vl.get("town")
                or None
            )
            if street_strong
            else None
        )

        final_area = (
            (
                fl.get("area")
                or vl.get("area")
                or None
            )
            if street_strong
            else None
        )

        # ----------------------------------------------
        # CHOOSE COORDINATES
        # ----------------------------------------------
        # Priority: EXIF > UniversalLocationResolver >
        # LocationCandidateService

        latitude = None
        longitude = None
        gps_source = None

        if exif_gps:
            latitude = exif_gps.get("latitude")
            longitude = exif_gps.get("longitude")
            gps_source = "exif"

        elif (
            precise_location
            and precise_location.get("latitude")
            is not None
            and precise_location.get("longitude")
            is not None
        ):
            latitude = precise_location.get(
                "latitude"
            )
            longitude = precise_location.get(
                "longitude"
            )
            gps_source = "universal_resolver"

        elif (
            candidate_result
            and candidate_result.get("latitude")
            is not None
        ):
            latitude = candidate_result.get(
                "latitude"
            )
            longitude = candidate_result.get(
                "longitude"
            )
            gps_source = "candidate_resolver"

        # ----------------------------------------------
        # COMBINE EVIDENCE LISTS
        # ----------------------------------------------
        candidate_evidence = (
            candidate_result.get("evidence", [])
            if candidate_result
            else []
        )
        resolver_evidence = (
            precise_location.get("evidence", [])
            if precise_location
            else []
        )

        all_evidence = list(set(
            candidate_evidence + resolver_evidence
        ))

        return {
            "latitude": latitude,
            "longitude": longitude,
            "gps_source": gps_source,
            "confidence": confidence,
            "location_status": status,
            "contradictions": contradictions,
            "evidence_count": len(evidence_signals),
            "evidence_signals": evidence_signals,
            "province": final_province,
            "city": final_city,
            "town": final_town,
            "area": final_area,
            "street": final_street,
            "house_number": final_house_number,
            "evidence": all_evidence,
        }
