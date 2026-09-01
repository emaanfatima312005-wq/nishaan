from __future__ import annotations

import math
import re


# ============================================================
# LOCATION MATCHING SERVICE
# ============================================================

class LocationMatchingService:

    # ========================================================
    # NORMALIZE TEXT
    # ========================================================

    @staticmethod
    def normalize(
        value: str | None,
    ) -> str:
        """
        Normalize a value for simple geographic comparison.
        """

        if not value:
            return ""

        value = str(value).lower()

        value = re.sub(
            r"[^a-z0-9\s]",
            " ",
            value,
        )

        value = re.sub(
            r"\s+",
            " ",
            value,
        )

        return value.strip()

    # ========================================================
    # DISTANCE
    # ========================================================

    @staticmethod
    def distance_meters(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
    ) -> float:
        """
        Haversine distance in meters.
        """

        earth_radius = 6371000.0

        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)

        delta_lat = math.radians(
            lat2 - lat1
        )

        delta_lon = math.radians(
            lon2 - lon1
        )

        a = (
            math.sin(
                delta_lat / 2
            ) ** 2
            +
            math.cos(lat1_rad)
            *
            math.cos(lat2_rad)
            *
            math.sin(
                delta_lon / 2
            ) ** 2
        )

        c = (
            2
            * math.atan2(
                math.sqrt(a),
                math.sqrt(
                    1 - a
                ),
            )
        )

        return earth_radius * c

    # ========================================================
    # OSM COORDINATES
    # ========================================================

    @staticmethod
    def get_candidate_coordinates(
        place,
    ):
        """
        OSM nodes provide lat/lon directly.
        OSM ways may provide coordinates through center.
        """

        lat = place.get(
            "lat"
        )

        lon = place.get(
            "lon"
        )

        if (
            lat is not None
            and lon is not None
        ):

            try:
                return (
                    float(lat),
                    float(lon),
                )

            except (
                TypeError,
                ValueError,
            ):
                return None, None

        center = (
            place.get(
                "center"
            )
            or {}
        )

        lat = center.get(
            "lat"
        )

        lon = center.get(
            "lon"
        )

        if (
            lat is not None
            and lon is not None
        ):

            try:
                return (
                    float(lat),
                    float(lon),
                )

            except (
                TypeError,
                ValueError,
            ):
                return None, None

        return None, None

    # ========================================================
    # LANDMARK TYPE DETECTION
    # ========================================================

    @staticmethod
    def detect_types(
        landmarks: list[str],
    ) -> set[str]:
        """
        Convert natural-language landmark descriptions into
        broad OSM categories.
        """

        types: set[str] = set()

        for landmark in landmarks:

            text = (
                LocationMatchingService.normalize(
                    landmark
                )
            )

            if any(
                word in text
                for word in (
                    "mosque",
                    "masjid",
                    "jamia",
                )
            ):

                types.add(
                    "mosque"
                )

            if any(
                word in text
                for word in (
                    "market",
                    "bazaar",
                    "bazar",
                )
            ):

                types.add(
                    "market"
                )

            if any(
                word in text
                for word in (
                    "bank",
                    "atm",
                )
            ):

                types.add(
                    "bank"
                )

            if any(
                word in text
                for word in (
                    "school",
                    "college",
                    "university",
                )
            ):

                types.add(
                    "education"
                )

            if any(
                word in text
                for word in (
                    "hospital",
                    "clinic",
                )
            ):

                types.add(
                    "healthcare"
                )

        return types

    # ========================================================
    # LANDMARK TYPE MATCH
    # ========================================================

    @staticmethod
    def candidate_matches_type(
        place,
        required_types: set[str],
    ) -> bool:
        """
        Check whether an OSM element matches one of the
        requested landmark categories.
        """

        tags = (
            place.get(
                "tags"
            )
            or {}
        )

        amenity = (
            LocationMatchingService.normalize(
                tags.get(
                    "amenity"
                )
            )
        )

        shop = (
            LocationMatchingService.normalize(
                tags.get(
                    "shop"
                )
            )
        )

        building = (
            LocationMatchingService.normalize(
                tags.get(
                    "building"
                )
            )
        )

        name = (
            LocationMatchingService.normalize(
                tags.get(
                    "name:en"
                )
                or tags.get(
                    "name"
                )
                or ""
            )
        )

        # ----------------------------------------------------
        # Mosque
        # ----------------------------------------------------

        if "mosque" in required_types:

            if (
                amenity
                == "place_of_worship"
                and (
                    LocationMatchingService.normalize(
                        tags.get(
                            "religion"
                        )
                    )
                    == "muslim"
                    or building == "mosque"
                    or "mosque" in name
                    or "masjid" in name
                    or "jamia" in name
                )
            ):

                return True

        # ----------------------------------------------------
        # Market
        # ----------------------------------------------------

        if "market" in required_types:

            if (
                amenity
                == "marketplace"
                or shop
                in {
                    "mall",
                    "market",
                }
            ):

                return True

        # ----------------------------------------------------
        # Bank
        # ----------------------------------------------------

        if "bank" in required_types:

            if amenity == "bank":

                return True

        # ----------------------------------------------------
        # Education
        # ----------------------------------------------------

        if "education" in required_types:

            if amenity in {
                "school",
                "college",
                "university",
            }:

                return True

        # ----------------------------------------------------
        # Healthcare
        # ----------------------------------------------------

        if "healthcare" in required_types:

            if amenity in {
                "hospital",
                "clinic",
            }:

                return True

        return False

    # ========================================================
    # RANK NEARBY PLACES
    # ========================================================

    @staticmethod
    def rank_places(
        places: list,
        anchor_latitude: float,
        anchor_longitude: float,
        city: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
    ) -> list[dict]:
        """
        Rank nearby OSM places as supporting evidence.
        """

        landmarks = landmarks or []

        required_types = (
            LocationMatchingService.detect_types(
                landmarks
            )
        )

        normalized_city = (
            LocationMatchingService.normalize(
                city
            )
        )

        normalized_street = (
            LocationMatchingService.normalize(
                street
            )
        )

        ranked: list[dict] = []

        for place in places or []:

            lat, lon = (
                LocationMatchingService
                .get_candidate_coordinates(
                    place
                )
            )

            if (
                lat is None
                or lon is None
            ):
                continue

            tags = (
                place.get(
                    "tags"
                )
                or {}
            )

            score = 0

            reasons: list[str] = []

            # ------------------------------------------------
            # Distance
            # ------------------------------------------------

            distance = (
                LocationMatchingService
                .distance_meters(
                    anchor_latitude,
                    anchor_longitude,
                    lat,
                    lon,
                )
            )

            if distance <= 100:

                score += 25

                reasons.append(
                    "within 100m"
                )

            elif distance <= 250:

                score += 20

                reasons.append(
                    "within 250m"
                )

            elif distance <= 500:

                score += 15

                reasons.append(
                    "within 500m"
                )

            elif distance <= 1000:

                score += 8

                reasons.append(
                    "within 1km"
                )

            # ------------------------------------------------
            # City
            # ------------------------------------------------

            place_city = (
                LocationMatchingService
                .normalize(
                    tags.get(
                        "addr:city:en"
                    )
                    or tags.get(
                        "addr:city"
                    )
                )
            )

            if (
                normalized_city
                and normalized_city
                in place_city
            ):

                score += 25

                reasons.append(
                    "city matches"
                )

            # ------------------------------------------------
            # Street
            # ------------------------------------------------

            place_street = (
                LocationMatchingService
                .normalize(
                    tags.get(
                        "addr:street"
                    )
                )
            )

            if (
                normalized_street
                and normalized_street
                in place_street
            ):

                score += 30

                reasons.append(
                    "street matches"
                )

            # ------------------------------------------------
            # Landmark category
            # ------------------------------------------------

            if (
                required_types
                and LocationMatchingService
                .candidate_matches_type(
                    place=place,
                    required_types=required_types,
                )
            ):

                score += 35

                reasons.append(
                    "requested landmark type matches"
                )

            # ------------------------------------------------
            # Landmark name
            # ------------------------------------------------

            place_name = (
                LocationMatchingService
                .normalize(
                    tags.get(
                        "name:en"
                    )
                    or tags.get(
                        "name"
                    )
                    or ""
                )
            )

            for landmark in landmarks:

                landmark_text = (
                    LocationMatchingService
                    .normalize(
                        landmark
                    )
                )

                for word in (
                    landmark_text.split()
                ):

                    if (
                        len(word) >= 4
                        and word in place_name
                    ):

                        score += 10

                        reasons.append(
                            f"name matches '{word}'"
                        )

                        break

            # ------------------------------------------------
            # Output
            # ------------------------------------------------

            ranked.append(
                {
                    "score": min(
                        score,
                        100,
                    ),

                    "distance_meters": round(
                        distance,
                        2,
                    ),

                    "name": (
                        tags.get(
                            "name:en"
                        )
                        or tags.get(
                            "name"
                        )
                        or "Unnamed place"
                    ),

                    "type": (
                        tags.get(
                            "amenity"
                        )
                        or tags.get(
                            "shop"
                        )
                        or tags.get(
                            "tourism"
                        )
                        or tags.get(
                            "building"
                        )
                        or "place"
                    ),

                    "latitude": lat,

                    "longitude": lon,

                    "reasons": reasons,

                    "tags": tags,
                }
            )

        ranked.sort(
            key=lambda item: (
                -item["score"],
                item["distance_meters"],
            )
        )

        return ranked[:10]