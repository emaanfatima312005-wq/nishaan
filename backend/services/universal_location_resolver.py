from __future__ import annotations

from typing import Any

from services.geocoding_service import (
    GeocodingService,
)

from services.osm_places_service import (
    OSMPlacesService,
)

from services.location_matching_service import (
    LocationMatchingService,
)


# ============================================================
# UNIVERSAL LOCATION RESOLVER
# ============================================================

class UniversalLocationResolver:
    """
    Universal geographic resolver for Nishaan.

    Pipeline:

        AI extracted clues
                ↓
        structured geographic search
                ↓
        area-first OSM verification
                ↓
        city consistency check
                ↓
        candidate ranking
                ↓
        requested-detail verification
                ↓
        nearby landmark evidence
                ↓
        final location

    No Pakistani city or locality is hard-coded.
    """

    # ========================================================
    # MAIN RESOLVER
    # ========================================================

    @classmethod
    async def resolve(
        cls,
        province: str | None = None,
        city: str | None = None,
        town: str | None = None,
        area: str | None = None,
        street: str | None = None,
        house_number: str | None = None,
        place_names: list[str] | None = None,
        landmarks: list[str] | None = None,
    ) -> dict[str, Any]:

        place_names = place_names or []
        landmarks = landmarks or []

        print()
        print("=" * 70)
        print("NISHAAN UNIVERSAL LOCATION RESOLVER")
        print("=" * 70)

        print("Province:", province)
        print("City:", city)
        print("Town:", town)
        print("Area:", area)
        print("Street:", street)
        print("House:", house_number)
        print("Place names:", place_names)
        print("Landmarks:", landmarks)

        # ====================================================
        # 1. CHECK LOCATION EVIDENCE
        # ====================================================

        if not any(
            [
                province,
                city,
                town,
                area,
                street,
                house_number,
                place_names,
                landmarks,
            ]
        ):

            return cls._not_verified_result(
                province=None,
                city=None,
                town=None,
                area=None,
                street=None,
                house_number=house_number,
                evidence=[
                    "No location evidence was provided."
                ],
            )

        # ====================================================
        # 2. SHOW DEBUG QUERIES
        # ====================================================

        debug_queries = cls._build_queries(
            province=province,
            city=city,
            town=town,
            area=area,
            street=street,
            place_names=place_names,
            landmarks=landmarks,
        )

        print()
        print(
            "GEOGRAPHIC SEARCH QUERIES:"
        )

        for query in debug_queries:
            print(
                " -",
                query,
            )

        # ====================================================
        # 3. SEARCH OSM
        # ====================================================

        try:

            osm_candidates = await (
                cls._search_osm(
                    province=province,
                    city=city,
                    town=town,
                    area=area,
                    street=street,
                    landmarks=landmarks,
                    place_names=place_names,
                )
            )

        except Exception as exc:

            print()
            print(
                "OSM SEARCH ERROR:",
                type(exc).__name__,
                str(exc),
            )

            return cls._not_verified_result(
                province=province,
                city=city,
                town=town,
                area=area,
                street=street,
                house_number=house_number,
                evidence=[
                    "OSM search failed."
                ],
            )

        # ====================================================
        # 4. DEDUPLICATE
        # ====================================================

        osm_candidates = (
            cls._deduplicate_candidates(
                osm_candidates
            )
        )

        print()
        print(
            "OSM CANDIDATES BEFORE FILTER:",
            len(osm_candidates),
        )

        # ====================================================
        # 5. CITY FILTER
        # ====================================================

        if city:

            city_candidates = []

            for candidate in osm_candidates:

                if cls._city_matches(
                    candidate=candidate,
                    requested_city=city,
                ):

                    city_candidates.append(
                        candidate
                    )

                else:

                    print()
                    print(
                        "REJECTING CITY CONFLICT"
                    )

                    print(
                        "Candidate:",
                        candidate.get(
                            "display_name"
                        ),
                    )

                    print(
                        "Candidate city:",
                        candidate.get(
                            "city"
                        ),
                    )

                    print(
                        "Requested city:",
                        city,
                    )

            osm_candidates = (
                city_candidates
            )

        print()
        print(
            "OSM CANDIDATES AFTER CITY FILTER:",
            len(osm_candidates),
        )

        # ====================================================
        # 6. NOTHING FOUND
        # ====================================================

        if not osm_candidates:

            return cls._not_verified_result(
                province=province,
                city=city,
                town=town,
                area=area,
                street=street,
                house_number=house_number,
                evidence=[
                    (
                        "No geographically consistent "
                        "OSM location was found."
                    )
                ],
            )

        # ====================================================
        # 7. SCORE CANDIDATES
        # ====================================================

        ranked = []

        for candidate in osm_candidates:

            score, reasons = (
                cls._score_candidate(
                    candidate=candidate,
                    province=province,
                    city=city,
                    town=town,
                    area=area,
                    street=street,
                    place_names=place_names,
                    landmarks=landmarks,
                )
            )

            ranked.append(
                {
                    **candidate,
                    "score": score,
                    "reasons": reasons,
                }
            )

        # ====================================================
        # 8. SORT
        # ====================================================

        ranked.sort(
            key=lambda item: (
                item.get(
                    "score",
                    0,
                ),
                cls._specificity_score(
                    item
                ),
            ),
            reverse=True,
        )

        print()
        print("=" * 70)
        print("RANKED OSM CANDIDATES")
        print("=" * 70)

        for candidate in ranked[:10]:

            print(
                {
                    "score": candidate.get(
                        "score"
                    ),
                    "name": candidate.get(
                        "name"
                    ),
                    "area": candidate.get(
                        "area"
                    ),
                    "town": candidate.get(
                        "town"
                    ),
                    "city": candidate.get(
                        "city"
                    ),
                    "road": candidate.get(
                        "road"
                    ),
                    "type": candidate.get(
                        "addresstype"
                    ),
                    "display_name": candidate.get(
                        "display_name"
                    ),
                }
            )

        # ====================================================
        # 9. VERIFY CANDIDATES
        # ====================================================

        verified = []

        for candidate in ranked:

            verification = (
                cls._verify_requested_detail(
                    candidate=candidate,
                    city=city,
                    town=town,
                    area=area,
                    street=street,
                    house_number=house_number,
                    place_names=place_names,
                )
            )

            if verification["verified"]:

                verified.append(
                    candidate
                )

        # ====================================================
        # 10. NO FULLY VERIFIED CANDIDATE
        # ====================================================

        if not verified:

            best = ranked[0]

            verification = (
                cls._verify_requested_detail(
                    candidate=best,
                    city=city,
                    town=town,
                    area=area,
                    street=street,
                    house_number=house_number,
                    place_names=place_names,
                )
            )

            print()
            print("=" * 70)
            print(
                "DETAILED LOCATION NOT VERIFIED"
            )
            print("=" * 70)

            for reason in verification[
                "reasons"
            ]:

                print(
                    " -",
                    reason,
                )

            print("=" * 70)

            return cls._not_verified_result(
                province=province,
                city=city,
                town=town,
                area=area,
                street=street,
                house_number=house_number,
                evidence=verification[
                    "reasons"
                ],
                candidate_display_name=(
                    best.get(
                        "display_name"
                    )
                ),
            )

        # ====================================================
        # 11. BEST VERIFIED CANDIDATE
        # ====================================================

        best = verified[0]

        # ====================================================
        # 12. NEARBY OSM EVIDENCE
        # ====================================================

        supporting_places = []

        latitude = best.get(
            "latitude"
        )

        longitude = best.get(
            "longitude"
        )

        if (
            latitude is not None
            and longitude is not None
        ):

            try:

                nearby = (
                    await OSMPlacesService.nearby_places(
                        latitude=latitude,
                        longitude=longitude,
                        radius_meters=750,
                    )
                )

                supporting_places = (
                    LocationMatchingService.rank_places(
                        places=nearby,
                        anchor_latitude=latitude,
                        anchor_longitude=longitude,
                        city=city,
                        street=street,
                        landmarks=landmarks,
                    )
                )

            except Exception as exc:

                print(
                    "NEARBY PLACE ERROR:",
                    type(exc).__name__,
                    str(exc),
                )

        # ====================================================
        # 13. LANDMARK BONUS
        # ====================================================

        landmark_bonus = 0

        strong_support = [
            place
            for place in supporting_places
            if place.get(
                "score",
                0,
            ) >= 50
        ]

        if strong_support:

            landmark_bonus = min(
                20,
                len(
                    strong_support
                ) * 5,
            )

            best["score"] = min(
                100,
                best.get(
                    "score",
                    0,
                )
                + landmark_bonus,
            )

        # ====================================================
        # 14. CONFIDENCE
        # ====================================================

        exact_fields = (
            cls._exact_field_count(
                best=best,
                city=city,
                area=area,
                street=street,
            )
        )

        confidence = (
            cls._calculate_confidence(
                score=best.get(
                    "score",
                    0,
                ),
                candidate_count=len(
                    verified
                ),
                exact_fields=exact_fields,
            )
        )

        evidence = list(
            best.get(
                "reasons",
                [],
            )
        )

        if landmark_bonus:

            evidence.append(
                "Nearby mapped places support the location."
            )

        # ====================================================
        # 15. FINAL RESULT
        # ====================================================

        result = {
            "status": "success",

            "province": (
                best.get(
                    "province"
                )
                or province
            ),

            "city": (
                city
                or best.get(
                    "city"
                )
            ),

            "town": (
                best.get(
                    "town"
                )
                or town
            ),

            "area": (
                best.get(
                    "area"
                )
                or area
            ),

            "street": (
                best.get(
                    "road"
                )
                or best.get(
                    "street"
                )
                or street
            ),

            "house_number": (
                best.get(
                    "house_number"
                )
                or house_number
            ),

            "latitude": latitude,

            "longitude": longitude,

            "confidence": confidence,

            "evidence": evidence,

            "supporting_places": (
                supporting_places[:5]
            ),

            "candidate_display_name": (
                best.get(
                    "display_name"
                )
            ),
        }

        print()
        print("=" * 70)
        print("FINAL VERIFIED LOCATION")
        print("=" * 70)
        print(result)
        print("=" * 70)

        return result

    # ========================================================
    # NOT VERIFIED RESULT
    # ========================================================

    @staticmethod
    def _not_verified_result(
        province: str | None,
        city: str | None,
        town: str | None,
        area: str | None,
        street: str | None,
        house_number: str | None,
        evidence: list[str],
        candidate_display_name: str | None = None,
    ) -> dict[str, Any]:

        return {
            "status": "not_verified",

            "province": province,

            "city": city,

            "town": town,

            "area": area,

            "street": street,

            "house_number": house_number,

            "latitude": None,

            "longitude": None,

            "confidence": 0,

            "evidence": evidence,

            "supporting_places": [],

            "candidate_display_name": (
                candidate_display_name
            ),
        }

    # ========================================================
    # BUILD DEBUG QUERIES
    # ========================================================

    @staticmethod
    def _build_queries(
        province: str | None,
        city: str | None,
        town: str | None,
        area: str | None,
        street: str | None,
        place_names: list[str],
        landmarks: list[str],
    ) -> list[str]:

        queries = []

        if (
            street
            and area
            and town
            and city
        ):

            queries.append(
                f"{street}, "
                f"{area}, "
                f"{town}, "
                f"{city}, Pakistan"
            )

        if street and area and city:

            queries.append(
                f"{street}, "
                f"{area}, "
                f"{city}, Pakistan"
            )

        if area and town and city:

            queries.append(
                f"{area}, "
                f"{town}, "
                f"{city}, Pakistan"
            )

        if area and city:

            queries.append(
                f"{area}, "
                f"{city}, Pakistan"
            )

        for place_name in place_names:

            if not place_name:
                continue

            parts = [
                place_name,
                area,
                town,
                city,
                province,
                "Pakistan",
            ]

            parts = [
                str(part).strip()
                for part in parts
                if part
            ]

            if parts:

                queries.append(
                    ", ".join(parts)
                )

        for landmark in landmarks:

            if not landmark:
                continue

            parts = [
                landmark,
                area,
                town,
                city,
                province,
                "Pakistan",
            ]

            parts = [
                str(part).strip()
                for part in parts
                if part
            ]

            if parts:

                queries.append(
                    ", ".join(parts)
                )

        if street and city:

            queries.append(
                f"{street}, "
                f"{city}, Pakistan"
            )

        if town and city:

            queries.append(
                f"{town}, "
                f"{city}, Pakistan"
            )

        if city and province:

            queries.append(
                f"{city}, "
                f"{province}, Pakistan"
            )

        if city:

            queries.append(
                f"{city}, Pakistan"
            )

        final = []

        seen = set()

        for query in queries:

            normalized = (
                query.strip().lower()
            )

            if not normalized:
                continue

            if normalized in seen:
                continue

            seen.add(
                normalized
            )

            final.append(
                query
            )

        return final

    # ========================================================
    # OSM SEARCH
    # ========================================================

    @staticmethod
    async def _search_osm(
        province: str | None,
        city: str | None,
        town: str | None,
        area: str | None,
        street: str | None,
        landmarks: list[str],
        place_names: list[str],
    ) -> list[dict[str, Any]]:

        # ----------------------------------------------------
        # A named place can act as area context when AI didn't
        # assign it an administrative level.
        # ----------------------------------------------------

        effective_area = area

        if (
            not effective_area
            and place_names
        ):

            effective_area = (
                place_names[0]
            )

        print()
        print(
            "STRUCTURED OSM SEARCH"
        )

        print(
            "Province:",
            province,
        )

        print(
            "City:",
            city,
        )

        print(
            "Town:",
            town,
        )

        print(
            "Area:",
            effective_area,
        )

        print(
            "Street:",
            street,
        )

        # ----------------------------------------------------
        # Let GeocodingService perform the area-first search.
        # ----------------------------------------------------

        results = await (
            GeocodingService.search(
                province=province,
                city=city,
                town=town,
                area=effective_area,
                street=street,
                landmarks=landmarks,
            )
        )

        normalized = []

        for item in results or []:

            latitude = item.get(
                "lat"
            )

            longitude = item.get(
                "lon"
            )

            if latitude is None:
                continue

            if longitude is None:
                continue

            try:

                latitude = float(
                    latitude
                )

                longitude = float(
                    longitude
                )

            except (
                TypeError,
                ValueError,
            ):

                continue

            address = (
                item.get(
                    "address"
                )
                or {}
            )

            normalized.append(
                {
                    "latitude": latitude,

                    "longitude": longitude,

                    "display_name": (
                        item.get(
                            "display_name"
                        )
                    ),

                    "name": (
                        item.get(
                            "name"
                        )
                    ),

                    "type": (
                        item.get(
                            "type"
                        )
                    ),

                    "category": (
                        item.get(
                            "category"
                        )
                    ),

                    "addresstype": (
                        item.get(
                            "addresstype"
                        )
                    ),

                    "province": (
                        address.get(
                            "state"
                        )
                        or address.get(
                            "state_district"
                        )
                    ),

                    "city": (
                        address.get(
                            "city"
                        )
                        or address.get(
                            "municipality"
                        )
                        or address.get(
                            "county"
                        )
                    ),

                    "town": (
                        address.get(
                            "town"
                        )
                        or address.get(
                            "village"
                        )
                    ),

                    "area": (
                        address.get(
                            "suburb"
                        )
                        or address.get(
                            "neighbourhood"
                        )
                        or address.get(
                            "locality"
                        )
                    ),

                    "road": (
                        address.get(
                            "road"
                        )
                        or item.get(
                            "name"
                        )
                    ),

                    "house_number": (
                        address.get(
                            "house_number"
                        )
                    ),
                }
            )

        return normalized

    # ========================================================
    # CITY MATCH
    # ========================================================

    @staticmethod
    def _city_matches(
        candidate: dict[str, Any],
        requested_city: str | None,
    ) -> bool:

        if not requested_city:
            return True

        requested = (
            str(
                requested_city
            )
            .strip()
            .lower()
        )

        if not requested:
            return True

        candidate_city = (
            str(
                candidate.get(
                    "city"
                )
                or ""
            )
            .strip()
            .lower()
        )

        display_name = (
            str(
                candidate.get(
                    "display_name"
                )
                or ""
            )
            .strip()
            .lower()
        )

        candidate_town = (
            str(
                candidate.get(
                    "town"
                )
                or ""
            )
            .strip()
            .lower()
        )

        candidate_area = (
            str(
                candidate.get(
                    "area"
                )
                or ""
            )
            .strip()
            .lower()
        )

        if candidate_city == requested:
            return True

        # Handles:
        # Metropolitan Corporation Rawalpindi

        if requested in candidate_city:
            return True

        if requested in display_name:
            return True

        if requested in candidate_town:
            return True

        if requested in candidate_area:
            return True

        return False

    # ========================================================
    # DEDUPLICATION
    # ========================================================

    @staticmethod
    def _deduplicate_candidates(
        candidates: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:

        seen = set()

        result = []

        for candidate in candidates:

            key = (
                round(
                    candidate[
                        "latitude"
                    ],
                    6,
                ),

                round(
                    candidate[
                        "longitude"
                    ],
                    6,
                ),

                (
                    candidate.get(
                        "name"
                    )
                    or ""
                ).lower(),
            )

            if key in seen:
                continue

            seen.add(key)

            result.append(
                candidate
            )

        return result

    # ========================================================
    # SCORE CANDIDATE
    # ========================================================

    @classmethod
    def _score_candidate(
        cls,
        candidate: dict[str, Any],
        province: str | None,
        city: str | None,
        town: str | None,
        area: str | None,
        street: str | None,
        place_names: list[str],
        landmarks: list[str],
    ) -> tuple[float, list[str]]:

        score = 0.0

        reasons = []

        # ----------------------------------------------------
        # Province
        # ----------------------------------------------------

        if province:

            if normalize_text_compare(
                province,
                candidate.get(
                    "province"
                )
                or "",
            ):

                score += 15

                reasons.append(
                    "province matches"
                )

        # ----------------------------------------------------
        # City
        # ----------------------------------------------------

        if city:

            if cls._city_matches(
                candidate,
                city,
            ):

                score += 30

                reasons.append(
                    "city matches"
                )

        # ----------------------------------------------------
        # Town
        # ----------------------------------------------------

        if town:

            if cls._contains_match(
                town,
                [
                    candidate.get(
                        "town"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                score += 20

                reasons.append(
                    "town matches"
                )

        # ----------------------------------------------------
        # Area
        # ----------------------------------------------------

        if area:

            if cls._contains_match(
                area,
                [
                    candidate.get(
                        "area"
                    ),
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                score += 35

                reasons.append(
                    "area matches"
                )

        # ----------------------------------------------------
        # Street
        # ----------------------------------------------------

        if street:

            if cls._contains_match(
                street,
                [
                    candidate.get(
                        "road"
                    ),
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                score += 35

                reasons.append(
                    "street matches"
                )

        # ----------------------------------------------------
        # Place names
        # ----------------------------------------------------

        for place_name in place_names:

            if cls._contains_match(
                place_name,
                [
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "area"
                    ),
                    candidate.get(
                        "town"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                score += 20

                reasons.append(
                    f"place matches: {place_name}"
                )

                break

        # ----------------------------------------------------
        # Landmarks
        # ----------------------------------------------------

        for landmark in landmarks:

            if cls._contains_match(
                landmark,
                [
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                score += 15

                reasons.append(
                    f"landmark matches: {landmark}"
                )

                break

        # ----------------------------------------------------
        # Prefer specific geographic objects
        # ----------------------------------------------------

        if candidate.get(
            "addresstype"
        ) in {
            "house",
            "building",
            "road",
            "street",
            "residential",
            "pedestrian",
            "path",
            "amenity",
            "shop",
            "neighbourhood",
            "suburb",
            "locality",
        }:

            score += 5

        # ----------------------------------------------------
        # Penalize broad results
        # ----------------------------------------------------

        if candidate.get(
            "addresstype"
        ) in {
            "country",
            "state",
            "region",
            "county",
            "city",
            "town",
        }:

            score -= 40

            reasons.append(
                "broad administrative result"
            )

        # ----------------------------------------------------
        # Missing requested area
        # ----------------------------------------------------

        if area:

            if not cls._contains_match(
                area,
                [
                    candidate.get(
                        "area"
                    ),
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                score -= 25

                reasons.append(
                    "requested area not matched"
                )

        # ----------------------------------------------------
        # Missing requested street
        # ----------------------------------------------------

        if street:

            if not cls._contains_match(
                street,
                [
                    candidate.get(
                        "road"
                    ),
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                score -= 30

                reasons.append(
                    "requested street not matched"
                )

        return (
            max(
                0.0,
                min(
                    100.0,
                    score,
                ),
            ),
            reasons,
        )

    # ========================================================
    # VERIFY REQUESTED DETAILS
    # ========================================================

    @classmethod
    def _verify_requested_detail(
        cls,
        candidate: dict[str, Any],
        city: str | None,
        town: str | None,
        area: str | None,
        street: str | None,
        house_number: str | None,
        place_names: list[str],
    ) -> dict[str, Any]:

        reasons = []

        # ----------------------------------------------------
        # City
        # ----------------------------------------------------

        if city:

            if not cls._city_matches(
                candidate,
                city,
            ):

                reasons.append(
                    "Requested city was not verified."
                )

        # ----------------------------------------------------
        # Town
        # ----------------------------------------------------

        if town:

            if not cls._contains_match(
                town,
                [
                    candidate.get(
                        "town"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                reasons.append(
                    "Requested town was not verified."
                )

        # ----------------------------------------------------
        # Area
        # ----------------------------------------------------

        if area:

            if not cls._contains_match(
                area,
                [
                    candidate.get(
                        "area"
                    ),
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                reasons.append(
                    "Requested area was not verified."
                )

        # ----------------------------------------------------
        # Street
        # ----------------------------------------------------

        if street:

            if not cls._contains_match(
                street,
                [
                    candidate.get(
                        "road"
                    ),
                    candidate.get(
                        "name"
                    ),
                    candidate.get(
                        "display_name"
                    ),
                ],
            ):

                reasons.append(
                    "Requested street was not verified."
                )

        # ----------------------------------------------------
        # Place names
        # ----------------------------------------------------

        if place_names:

            place_match = False

            for place_name in place_names:

                if cls._contains_match(
                    place_name,
                    [
                        candidate.get(
                            "name"
                        ),
                        candidate.get(
                            "area"
                        ),
                        candidate.get(
                            "town"
                        ),
                        candidate.get(
                            "display_name"
                        ),
                    ],
                ):

                    place_match = True
                    break

            if not place_match:

                reasons.append(
                    "Named locality was not verified."
                )

        # ----------------------------------------------------
        # House number
        # ----------------------------------------------------

        if house_number:

            requested_house = (
                str(
                    house_number
                )
                .strip()
                .lower()
            )

            candidate_house = (
                str(
                    candidate.get(
                        "house_number"
                    )
                    or ""
                )
                .strip()
                .lower()
            )

            if (
                not candidate_house
                or candidate_house
                != requested_house
            ):

                reasons.append(
                    "Requested house number was not verified."
                )

        return {
            "verified": not reasons,
            "reasons": reasons,
        }

    # ========================================================
    # SPECIFICITY
    # ========================================================

    @staticmethod
    def _specificity_score(
        candidate: dict[str, Any],
    ) -> int:

        priorities = {
            "house": 100,
            "building": 95,
            "road": 90,
            "street": 90,
            "residential": 85,
            "pedestrian": 80,
            "neighbourhood": 70,
            "suburb": 65,
            "locality": 60,
            "town": 30,
            "city": 20,
            "county": 10,
            "state": 5,
            "region": 5,
        }

        return priorities.get(
            candidate.get(
                "addresstype"
            ),
            0,
        )

    # ========================================================
    # EXACT FIELD COUNT
    # ========================================================

    @staticmethod
    def _exact_field_count(
        best: dict[str, Any],
        city: str | None,
        area: str | None,
        street: str | None,
    ) -> int:

        count = 0

        if city:

            candidate_city = (
                str(
                    best.get(
                        "city"
                    )
                    or ""
                )
                .strip()
                .lower()
            )

            # Because OSM may use an administrative label,
            # use the same city matching logic here.
            if UniversalLocationResolver._city_matches(
                best,
                city,
            ):

                count += 1

        if area:

            if UniversalLocationResolver._contains_match(
                area,
                [
                    best.get(
                        "area"
                    ),
                    best.get(
                        "name"
                    ),
                    best.get(
                        "display_name"
                    ),
                ],
            ):

                count += 1

        if street:

            if UniversalLocationResolver._contains_match(
                street,
                [
                    best.get(
                        "road"
                    ),
                    best.get(
                        "name"
                    ),
                    best.get(
                        "display_name"
                    ),
                ],
            ):

                count += 1

        return count

    # ========================================================
    # CONFIDENCE
    # ========================================================

    @staticmethod
    def _calculate_confidence(
        score: float,
        candidate_count: int,
        exact_fields: int,
    ) -> int:

        confidence = score

        if exact_fields >= 1:
            confidence += 5

        if exact_fields >= 2:
            confidence += 10

        if exact_fields >= 3:
            confidence += 10

        if candidate_count == 1:
            confidence += 5

        elif candidate_count > 5:
            confidence -= 10

        return max(
            0,
            min(
                100,
                round(
                    confidence
                ),
            ),
        )

    # ========================================================
    # CONTAINS MATCH
    # ========================================================

    @staticmethod
    def _contains_match(
        query: str,
        values: list[Any],
    ) -> bool:

        q = (
            str(
                query
            )
            .strip()
            .lower()
        )

        if not q:
            return False

        for value in values:

            if value is None:
                continue

            text = (
                str(
                    value
                )
                .strip()
                .lower()
            )

            if not text:
                continue

            if q == text:
                return True

            if q in text:
                return True

        return False


# ============================================================
# TEXT COMPARISON
# ============================================================

def normalize_text_compare(
    first: str,
    second: str,
) -> bool:

    first = (
        str(
            first
        )
        .strip()
        .lower()
    )

    second = (
        str(
            second
        )
        .strip()
        .lower()
    )

    if not first or not second:
        return False

    if first == second:
        return True

    return (
        first in second
        or second in first
    )