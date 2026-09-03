from __future__ import annotations

from typing import Any

from services.geocoding_service import GeocodingService
from services.osm_places_service import OSMPlacesService
from services.location_matching_service import (
    LocationMatchingService,
)
from services.reverse_geocoding_service import (
    ReverseGeocodingService,
)


class LocationCandidateService:

    # ========================================================
    # HELPERS
    # ========================================================

    @staticmethod
    def normalize(value: str | None) -> str:
        if not value:
            return ""

        return (
            value.lower()
            .replace(",", " ")
            .replace("-", " ")
            .strip()
        )

    @staticmethod
    def extract_city_from_label(
        label: str | None,
    ) -> str | None:

        if not label:
            return None

        parts = [
            part.strip()
            for part in label.split(",")
            if part.strip()
        ]

        return parts[0] if parts else None

    @staticmethod
    def probability_score(
        probability: float,
        maximum: float,
    ) -> float:

        if probability <= 0:
            return 0

        if maximum <= 0:
            return 0

        score = (
            probability / maximum
        ) * 100

        return min(
            100,
            score,
        )

    @staticmethod
    def result_is_pakistan(
        reverse_result: dict,
    ) -> bool:

        address = reverse_result.get(
            "address",
            {},
        )

        country_code = (
            address.get("country_code")
            or ""
        ).lower()

        return country_code == "pk"

    # ========================================================
    # REVERSE GEOCODE GEOCLIP CANDIDATES
    # ========================================================

    @classmethod
    async def reverse_geoclip_candidates(
        cls,
        geoclip_predictions: list[dict],
        maximum: int = 3,
    ):

        verified = []

        for prediction in geoclip_predictions[:maximum]:

            latitude = prediction.get(
                "latitude"
            )

            longitude = prediction.get(
                "longitude"
            )

            if (
                latitude is None
                or longitude is None
            ):
                continue

            try:

                reverse_result = (
                    await ReverseGeocodingService.reverse(
                        latitude=float(latitude),
                        longitude=float(longitude),
                    )
                )

            except Exception as e:

                print(
                    "REVERSE GEOCODING ERROR:",
                    str(e),
                )

                continue

            if not cls.result_is_pakistan(
                reverse_result
            ):
                print(
                    "REJECTING NON-PAKISTAN GEOCLIP:",
                    latitude,
                    longitude,
                )
                continue

            address = reverse_result.get(
                "address",
                {},
            )

            verified.append(
                {
                    "latitude": float(latitude),
                    "longitude": float(longitude),
                    "probability": float(
                        prediction.get(
                            "probability",
                            0,
                        )
                    ),
                    "display_name": (
                        reverse_result.get(
                            "display_name"
                        )
                    ),
                    "province": (
                        address.get("state")
                    ),
                    "city": (
                        address.get("city")
                        or address.get("municipality")
                        or address.get("county")
                    ),
                    "town": (
                        address.get("town")
                        or address.get("village")
                    ),
                    "area": (
                        address.get("suburb")
                        or address.get("neighbourhood")
                        or address.get("locality")
                    ),
                    "street": address.get(
                        "road"
                    ),
                }
            )

        return verified

    # ========================================================
    # TEXT / OSM CANDIDATES
    # ========================================================

    @classmethod
    async def search_text_candidates(
        cls,
        province: str | None = None,
        city: str | None = None,
        town: str | None = None,
        area: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
        place_names: list[str] | None = None,
        house_number: str | None = None,
        visible_text: list[str] | None = None,
    ):

        landmarks = landmarks or []
        place_names = place_names or []
        visible_text = visible_text or []

        candidates = []

        # ----------------------------------------------------
        # 1. OCR TEXT — FREE-FORM NOMINATIM SEARCH
        # ----------------------------------------------------
        # Each visible text item is searched as an
        # exact_query against Nominatim.  This is a
        # free-form search across all of Pakistan,
        # not constrained by city or street context.
        # This is the PRIMARY search strategy because
        # real text read from the image is the most
        # reliable evidence.

        ocr_queries = []

        for text_item in visible_text[:10]:

            if not text_item or not text_item.strip():
                continue

            cleaned = text_item.strip()

            if len(cleaned) < 3:
                continue

            # Skip pure numbers (phone numbers without
            # names, plot numbers, etc.)
            if cleaned.replace("-", "").replace(
                " ", ""
            ).isdigit():
                continue

            ocr_queries.append(cleaned)

        for query in ocr_queries:

            try:

                results = await (
                    GeocodingService.search(
                        exact_query=query,
                    )
                )

                for result in results:

                    latitude = result.get("lat")
                    longitude = result.get("lon")

                    if (
                        latitude is None
                        or longitude is None
                    ):
                        continue

                    candidates.append(
                        {
                            "latitude": float(
                                latitude
                            ),
                            "longitude": float(
                                longitude
                            ),
                            "display_name": result.get(
                                "display_name"
                            ),
                            "province": (
                                result.get(
                                    "address", {},
                                ).get("state")
                            ),
                            "city": (
                                result.get(
                                    "address", {},
                                ).get("city")
                            ),
                            "town": (
                                result.get(
                                    "address", {},
                                ).get("town")
                            ),
                            "area": (
                                result.get(
                                    "address", {},
                                ).get("suburb")
                            ),
                            "street": (
                                result.get(
                                    "address", {},
                                ).get("road")
                            ),
                            "search_query": query,
                            "source": "ocr_exact",
                        }
                    )

            except Exception as e:

                print(
                    "OCR SEARCH ERROR:",
                    query,
                    str(e),
                )

        # ----------------------------------------------------
        # 2. STRUCTURED SEARCHES (secondary strategy)
        # ----------------------------------------------------

        searches = []

        if street and city:
            query = street

            if house_number:
                query = (
                    f"{house_number}, {street}"
                )

            searches.append(
                f"{query}, {city}, Pakistan"
            )

        for name in place_names:

            if city:
                searches.append(
                    f"{name}, {city}, Pakistan"
                )

            else:
                searches.append(
                    f"{name}, Pakistan"
                )

        if city and landmarks:

            for landmark in landmarks:

                searches.append(
                    f"{landmark}, {city}, Pakistan"
                )

        # ----------------------------------------------------
        # 3. OCR WITH CITY CONTEXT (fallback)
        # ----------------------------------------------------
        # For OCR items that didn't match via exact_query,
        # try again with city context to narrow results.

        for text_item in visible_text[:5]:

            if not text_item or not text_item.strip():
                continue

            cleaned = text_item.strip()

            if len(cleaned) < 3:
                continue

            if city:
                searches.append(
                    f"{cleaned}, {city}, Pakistan"
                )

        # ----------------------------------------------------
        # 4. EXECUTE STRUCTURED SEARCHES
        # ----------------------------------------------------

        for query in searches[:10]:

            try:

                results = await (
                    GeocodingService.search(
                        city=city,
                        street=street,
                        landmarks=[query],
                    )
                )

                for result in results:

                    latitude = result.get(
                        "lat"
                    )

                    longitude = result.get(
                        "lon"
                    )

                    if (
                        latitude is None
                        or longitude is None
                    ):
                        continue

                    candidates.append(
                        {
                            "latitude": float(
                                latitude
                            ),
                            "longitude": float(
                                longitude
                            ),
                            "display_name": result.get(
                                "display_name"
                            ),
                            "province": (
                                result.get(
                                    "address",
                                    {},
                                ).get(
                                    "state"
                                )
                            ),
                            "city": (
                                result.get(
                                    "address",
                                    {},
                                ).get(
                                    "city"
                                )
                            ),
                            "town": (
                                result.get(
                                    "address",
                                    {},
                                ).get(
                                    "town"
                                )
                            ),
                            "area": (
                                result.get(
                                    "address",
                                    {},
                                ).get(
                                    "suburb"
                                )
                            ),
                            "street": (
                                result.get(
                                    "address",
                                    {},
                                ).get(
                                    "road"
                                )
                            ),
                            "search_query": query,
                        }
                    )

            except Exception as e:

                print(
                    "TEXT CANDIDATE ERROR:",
                    query,
                    str(e),
                )

        return candidates

    # ========================================================
    # RANK OSM EVIDENCE
    # ========================================================

    @classmethod
    async def nearby_evidence(
        cls,
        candidate: dict,
        city: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
    ):

        landmarks = landmarks or []

        try:

            places = await (
                OSMPlacesService.nearby_places(
                    latitude=candidate[
                        "latitude"
                    ],
                    longitude=candidate[
                        "longitude"
                    ],
                    radius_meters=500,
                )
            )

        except Exception as e:

            print(
                "OSM EVIDENCE ERROR:",
                str(e),
            )

            return []

        return LocationMatchingService.rank_places(
            places=places,
            anchor_latitude=candidate[
                "latitude"
            ],
            anchor_longitude=candidate[
                "longitude"
            ],
            city=city,
            street=street,
            landmarks=landmarks,
        )

    # ========================================================
    # FINAL IMAGE RESOLUTION
    # ========================================================

    @classmethod
    async def resolve_image(
        cls,
        vision_result: dict,
        geoclip_predictions: list[dict],
        streetclip: dict,
    ):

        city = vision_result.get(
            "city"
        )

        province = vision_result.get(
            "province"
        )

        town = vision_result.get(
            "town"
        )

        area = vision_result.get(
            "area"
        )

        street = vision_result.get(
            "street"
        )

        house_number = vision_result.get(
            "house_number"
        )

        place_names = (
            vision_result.get(
                "place_names"
            )
            or []
        )

        landmarks = (
            vision_result.get(
                "landmarks"
            )
            or []
        )

        visible_text = (
            vision_result.get(
                "visible_text"
            )
            or []
        )

        # Check whether the vision result has
        # actual text evidence or high enough
        # confidence to trust its city/street.
        # This prevents hallucinated city names
        # from triggering OSM text searches that
        # would validate the hallucination.
        _text_evidence_or_high_conf = bool(
            visible_text
        ) or (
            vision_result.get("confidence", 0)
            or 0
        ) >= 50

        # ====================================================
        # 1. STREETCLIP SIGNALS
        # ====================================================

        country_predictions = (
            streetclip.get("country")
            or []
        )

        region_predictions = (
            streetclip.get("region")
            or []
        )

        city_predictions = (
            streetclip.get("city")
            or []
        )

        pakistan_probability = 0.0

        for prediction in country_predictions:

            if (
                prediction.get("label")
                == "Pakistan"
            ):
                pakistan_probability = float(
                    prediction.get(
                        "probability",
                        0,
                    )
                )

                break

        top_region = (
            region_predictions[0]
            if region_predictions
            else None
        )

        top_city = (
            city_predictions[0]
            if city_predictions
            else None
        )

        streetclip_city = None

        if top_city:
            streetclip_city = (
                cls.extract_city_from_label(
                    top_city.get("label")
                )
            )

        # ====================================================
        # 2. FILTER GEOCLIP THROUGH PAKISTAN
        # ====================================================

        verified_geoclip = (
            await cls.reverse_geoclip_candidates(
                geoclip_predictions,
                maximum=3,
            )
        )

        # ====================================================
        # 3. SCORE GEOCLIP CANDIDATES
        # ====================================================

        scored_candidates = []

        for candidate in verified_geoclip:

            score = 0.0
            reasons = []

            # -----------------------------------------------
            # Pakistan signal
            # -----------------------------------------------

            if pakistan_probability >= 0.80:

                score += 25

                reasons.append(
                    "StreetCLIP strongly identifies Pakistan"
                )

            elif pakistan_probability >= 0.50:

                score += 15

                reasons.append(
                    "StreetCLIP supports Pakistan"
                )

            # -----------------------------------------------
            # Region signal
            # -----------------------------------------------

            candidate_province = (
                candidate.get(
                    "province"
                )
                or ""
            )

            region_label = (
                top_region.get("label")
                if top_region
                else ""
            )

            if (
                candidate_province
                and region_label
                and cls.normalize(
                    candidate_province
                )
                in cls.normalize(
                    region_label
                )
            ):

                score += 25

                reasons.append(
                    "province agrees with StreetCLIP"
                )

            # -----------------------------------------------
            # City signal
            # -----------------------------------------------

            candidate_city = (
                candidate.get("city")
                or ""
            )

            if (
                streetclip_city
                and candidate_city
                and (
                    cls.normalize(
                        streetclip_city
                    )
                    in cls.normalize(
                        candidate_city
                    )
                    or cls.normalize(
                        candidate_city
                    )
                    in cls.normalize(
                        streetclip_city
                    )
                )
            ):

                score += 25

                reasons.append(
                    "city agrees with StreetCLIP"
                )

            # -----------------------------------------------
            # GeoCLIP probability
            # -----------------------------------------------

            geoclip_probability = (
                candidate.get(
                    "probability",
                    0,
                )
            )

            if geoclip_probability >= 0.10:

                score += 25

                reasons.append(
                    "strong GeoCLIP candidate"
                )

            elif geoclip_probability >= 0.03:

                score += 18

                reasons.append(
                    "moderate GeoCLIP candidate"
                )

            else:

                score += 8

                reasons.append(
                    "weak GeoCLIP candidate"
                )

            scored_candidates.append(
                {
                    **candidate,
                    "score": score,
                    "reasons": reasons,
                }
            )

        # ====================================================
        # 4. SELECT BEST GEOGRAPHIC ANCHOR
        # ====================================================

        scored_candidates.sort(
            key=lambda item: item[
                "score"
            ],
            reverse=True,
        )

        best_candidate = (
            scored_candidates[0]
            if scored_candidates
            else None
        )

        supporting_places = []

        # ====================================================
        # 5. OSM EVIDENCE
        # ====================================================

        if best_candidate:

            supporting_places = (
                await cls.nearby_evidence(
                    candidate=best_candidate,
                    city=(
                        city
                        or best_candidate.get(
                            "city"
                        )
                    ),
                    street=(
                        street
                        if _text_evidence_or_high_conf
                        else None
                    ),
                    landmarks=landmarks,
                )
            )

            # Add strongest OSM evidence.
            if supporting_places:

                best_place = (
                    supporting_places[0]
                )

                # -------------------------------------------
                # Landmark evidence
                # -------------------------------------------

                if best_place["score"] >= 30:

                    best_candidate["score"] += 15

                    best_candidate[
                        "reasons"
                    ].append(
                        "OSM has relevant nearby evidence"
                    )

        # ====================================================
        # 6. TEXT SEARCH
        # ====================================================

        text_candidates = []

        if (
            visible_text
            or (
                _text_evidence_or_high_conf
                and (
                    city
                    or street
                    or place_names
                    or landmarks
                )
            )
        ):

            text_candidates = (
                await cls.search_text_candidates(
                    province=province,
                    city=city,
                    town=town,
                    area=area,
                    street=street,
                    landmarks=landmarks,
                    place_names=place_names,
                    house_number=house_number,
                    visible_text=visible_text,
                )
            )

        # ====================================================
        # 7. TEXT CANDIDATE MATCHING
        # ====================================================

        for text_candidate in text_candidates:

            candidate_score = 0.0
            reasons = []

            candidate_city = (
                text_candidate.get(
                    "city"
                )
                or ""
            )

            candidate_street = (
                text_candidate.get(
                    "street"
                )
                or ""
            )

            # City
            if city and candidate_city:

                if (
                    cls.normalize(city)
                    in cls.normalize(
                        candidate_city
                    )
                    or cls.normalize(
                        candidate_city
                    )
                    in cls.normalize(city)
                ):

                    candidate_score += 25

                    reasons.append(
                        "city matches user evidence"
                    )

            # Street
            if street and candidate_street:

                if (
                    cls.normalize(street)
                    in cls.normalize(
                        candidate_street
                    )
                    or cls.normalize(
                        candidate_street
                    )
                    in cls.normalize(street)
                ):

                    candidate_score += 55

                    reasons.append(
                        "street matches user evidence"
                    )

            if place_names:

                display_name = cls.normalize(
                    text_candidate.get(
                        "display_name"
                    )
                    or ""
                )

                for name in place_names:

                    normalized_name = (
                        cls.normalize(name)
                    )

                    if (
                        normalized_name
                        and normalized_name
                        in display_name
                    ):

                        candidate_score += 30

                        reasons.append(
                            f"locality matches: {name}"
                        )

                        break

            # Visible text (OCR evidence from image)
            if visible_text:

                display_name = cls.normalize(
                    text_candidate.get(
                        "display_name"
                    )
                    or ""
                )

                for text_item in visible_text:

                    normalized_text = (
                        cls.normalize(text_item)
                    )

                    if (
                        normalized_text
                        and len(normalized_text) >= 3
                        and normalized_text
                        in display_name
                    ):

                        candidate_score += 35

                        reasons.append(
                            f"visible text matches: "
                            f"{text_item}"
                        )

                        break

            if house_number:

                display_name = cls.normalize(
                    text_candidate.get(
                        "display_name"
                    )
                    or ""
                )

                if (
                    cls.normalize(
                        house_number
                    )
                    in display_name
                ):

                    candidate_score += 45

                    reasons.append(
                        "house number appears in address"
                    )

            text_candidate[
                "score"
            ] = candidate_score

            text_candidate[
                "reasons"
            ] = reasons

        # ====================================================
        # 8. MERGE TEXT AND GEOGRAPHIC CANDIDATES
        # ====================================================

        all_candidates = (
            scored_candidates
            + text_candidates
        )

        # ====================================================
        # 8b. CROSS-EVIDENCE BONUS
        # ====================================================
        # When independent evidence sources agree on a
        # city or province, boost both candidates.

        if len(all_candidates) >= 2:

            for i, c1 in enumerate(all_candidates):

                for j, c2 in enumerate(all_candidates):

                    if i >= j:
                        continue

                    c1_city = cls.normalize(
                        c1.get("city") or ""
                    )

                    c2_city = cls.normalize(
                        c2.get("city") or ""
                    )

                    if (
                        c1_city
                        and c2_city
                        and len(c1_city) >= 3
                        and len(c2_city) >= 3
                        and (
                            c1_city in c2_city
                            or c2_city in c1_city
                        )
                    ):

                        c1["score"] = (
                            c1.get("score", 0) + 20
                        )

                        c2["score"] = (
                            c2.get("score", 0) + 20
                        )

                        c1.setdefault(
                            "reasons", []
                        ).append(
                            "cross-evidence: city "
                            "confirmed by multiple "
                            "sources"
                        )

                        c2.setdefault(
                            "reasons", []
                        ).append(
                            "cross-evidence: city "
                            "confirmed by multiple "
                            "sources"
                        )

        # ====================================================
        # 8c. STREETCLIP CITY BOOST
        # ====================================================
        # If StreetCLIP independently identified a city
        # and a candidate is in that city, give it an
        # additional boost.

        if streetclip_city:

            normalized_sc_city = cls.normalize(
                streetclip_city
            )

            for candidate in all_candidates:

                candidate_city = cls.normalize(
                    candidate.get("city") or ""
                )

                if (
                    candidate_city
                    and normalized_sc_city
                    and len(normalized_sc_city) >= 3
                    and (
                        normalized_sc_city
                        in candidate_city
                        or candidate_city
                        in normalized_sc_city
                    )
                ):

                    candidate["score"] = (
                        candidate.get("score", 0) + 15
                    )

                    candidate.setdefault(
                        "reasons", []
                    ).append(
                        "StreetCLIP city confirmation"
                    )

        all_candidates.sort(
            key=lambda item: item.get(
                "score",
                0,
            ),
            reverse=True,
        )

        final_candidate = (
            all_candidates[0]
            if all_candidates
            else None
        )

        # ====================================================
        # 9. FINAL RESULT
        # ====================================================

        if not final_candidate:

            return {
                "status": "unresolved",
                "province": province,
                "city": city,
                "town": town,
                "area": area,
                "street": street,
                "house_number": house_number,
                "latitude": None,
                "longitude": None,
                "confidence": 0,
                "evidence": [],
                "supporting_places": [],
            }

        # Cap at 75: this service is one evidence
        # source.  The evidence fusion step produces
        # the actual final confidence.
        final_score = min(
            75,
            round(
                final_candidate.get(
                    "score",
                    0,
                )
            ),
        )

        final_province = (
            province
            or final_candidate.get(
                "province"
            )
        )

        final_city = (
            city
            or final_candidate.get(
                "city"
            )
        )

        final_town = (
            town
            or final_candidate.get(
                "town"
            )
        )

        final_area = (
            area
            or final_candidate.get(
                "area"
            )
        )

        final_street = (
            street
            or final_candidate.get(
                "street"
            )
        )

        return {
            "status": "success",

            "province": final_province,

            "city": final_city,

            "town": final_town,

            "area": final_area,

            "street": final_street,

            "house_number": house_number,

            "latitude": final_candidate.get(
                "latitude"
            ),

            "longitude": final_candidate.get(
                "longitude"
            ),

            "confidence": final_score,

            "evidence": (
                final_candidate.get(
                    "reasons",
                    [],
                )
                + visible_text[:5]
            ),

            "supporting_places": (
                supporting_places[:5]
            ),

            "candidate_display_name": (
                final_candidate.get(
                    "display_name"
                )
            ),
        }