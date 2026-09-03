<<<<<<< HEAD
=======
from __future__ import annotations

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
import math
import re


<<<<<<< HEAD
class LocationMatchingService:

    @staticmethod
    def normalize(value: str | None) -> str:
        if not value:
            return ""

        value = value.lower()
        value = re.sub(r"[^a-z0-9\s]", " ", value)
        value = re.sub(r"\s+", " ", value)

        return value.strip()

=======
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

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
    @staticmethod
    def distance_meters(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
    ) -> float:
<<<<<<< HEAD

        radius = 6371000

        p1 = math.radians(lat1)
        p2 = math.radians(lat2)

        dp = math.radians(lat2 - lat1)
        dl = math.radians(lon2 - lon1)

        a = (
            math.sin(dp / 2) ** 2
            + math.cos(p1)
            * math.cos(p2)
            * math.sin(dl / 2) ** 2
        )

        return radius * (
            2 * math.atan2(
                math.sqrt(a),
                math.sqrt(1 - a),
            )
        )

    @staticmethod
    def get_candidate_coordinates(place):
        """
        OSM nodes use lat/lon.
        OSM ways/relations returned by Overpass use center.
        """

        lat = place.get("lat")
        lon = place.get("lon")

        if lat is not None and lon is not None:
            return float(lat), float(lon)

        center = place.get("center", {})

        lat = center.get("lat")
        lon = center.get("lon")

        if lat is not None and lon is not None:
            return float(lat), float(lon)

        return None, None

    @staticmethod
    def detect_types(landmarks: list[str]):
        """
        Convert natural-language landmark descriptions
        into categories.
        """

        types = set()

        for landmark in landmarks:

            text = LocationMatchingService.normalize(
                landmark
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            )

            if any(
                word in text
<<<<<<< HEAD
                for word in [
                    "mosque",
                    "masjid",
                    "jamia",
                ]
            ):
                types.add("mosque")

            if any(
                word in text
                for word in [
                    "market",
                    "bazaar",
                    "bazar",
                ]
            ):
                types.add("market")

            if any(
                word in text
                for word in [
                    "bank",
                    "atm",
                ]
            ):
                types.add("bank")

            if any(
                word in text
                for word in [
                    "school",
                    "college",
                    "university",
                ]
            ):
                types.add("education")

            if any(
                word in text
                for word in [
                    "hospital",
                    "clinic",
                ]
            ):
                types.add("healthcare")

        return types

    @staticmethod
    def candidate_matches_type(
        place,
        required_types,
    ):
        tags = place.get("tags", {})

        amenity = LocationMatchingService.normalize(
            tags.get("amenity")
        )

        shop = LocationMatchingService.normalize(
            tags.get("shop")
        )

        if (
            "mosque" in required_types
            and amenity == "place_of_worship"
            and (
                tags.get("religion") == "muslim"
                or tags.get("building") == "mosque"
                or "mosque" in LocationMatchingService.normalize(
                    tags.get("name:en")
                    or tags.get("name")
                )
            )
        ):
            return True

        if (
            "market" in required_types
            and (
                amenity == "marketplace"
                or shop == "mall"
            )
        ):
            return True

        if (
            "bank" in required_types
            and amenity == "bank"
        ):
            return True

        if (
            "education" in required_types
            and amenity in {
                "school",
                "college",
                "university",
            }
        ):
            return True

        if (
            "healthcare" in required_types
            and amenity in {
                "hospital",
                "clinic",
            }
        ):
            return True

        return False

=======
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

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
    @staticmethod
    def rank_places(
        places: list,
        anchor_latitude: float,
        anchor_longitude: float,
        city: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
<<<<<<< HEAD
    ):
        """
        Rank nearby OSM places against the AI-extracted clues.
=======
    ) -> list[dict]:
        """
        Rank nearby OSM places as supporting evidence.
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        """

        landmarks = landmarks or []

        required_types = (
            LocationMatchingService.detect_types(
                landmarks
            )
        )

        normalized_city = (
<<<<<<< HEAD
            LocationMatchingService.normalize(city)
        )

        normalized_street = (
            LocationMatchingService.normalize(street)
        )

        ranked = []

        for place in places:

            lat, lon = (
                LocationMatchingService
                .get_candidate_coordinates(place)
            )

            if lat is None or lon is None:
                continue

            tags = place.get("tags", {})

            score = 0
            reasons = []

            # ---------------------------------------------
            # Distance
            # ---------------------------------------------
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

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
<<<<<<< HEAD
                score += 25
=======

                score += 25

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                reasons.append(
                    "within 100m"
                )

            elif distance <= 250:
<<<<<<< HEAD
                score += 20
=======

                score += 20

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                reasons.append(
                    "within 250m"
                )

            elif distance <= 500:
<<<<<<< HEAD
                score += 15
=======

                score += 15

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                reasons.append(
                    "within 500m"
                )

            elif distance <= 1000:
<<<<<<< HEAD
                score += 8
=======

                score += 8

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                reasons.append(
                    "within 1km"
                )

<<<<<<< HEAD
            # ---------------------------------------------
            # City
            # ---------------------------------------------

            place_city = LocationMatchingService.normalize(
                tags.get("addr:city:en")
                or tags.get("addr:city")
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            )

            if (
                normalized_city
<<<<<<< HEAD
                and normalized_city in place_city
            ):
                score += 25
=======
                and normalized_city
                in place_city
            ):

                score += 25

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                reasons.append(
                    "city matches"
                )

<<<<<<< HEAD
            # ---------------------------------------------
            # Street
            # ---------------------------------------------

            place_street = LocationMatchingService.normalize(
                tags.get("addr:street")
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            )

            if (
                normalized_street
<<<<<<< HEAD
                and normalized_street in place_street
            ):
                score += 30
=======
                and normalized_street
                in place_street
            ):

                score += 30

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                reasons.append(
                    "street matches"
                )

<<<<<<< HEAD
            # ---------------------------------------------
            # Landmark category
            # ---------------------------------------------

                if (
                required_types
                and LocationMatchingService.candidate_matches_type(
                    place,
                    required_types,
                )
            ):
                    score += 35
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

                reasons.append(
                    "requested landmark type matches"
                )

<<<<<<< HEAD
            # ---------------------------------------------
            # Name match
            # ---------------------------------------------

            place_name = LocationMatchingService.normalize(
                tags.get("name:en")
                or tags.get("name")
                or ""
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            )

            for landmark in landmarks:

                landmark_text = (
                    LocationMatchingService
<<<<<<< HEAD
                    .normalize(landmark)
                )

                words = landmark_text.split()

                for word in words:
=======
                    .normalize(
                        landmark
                    )
                )

                for word in (
                    landmark_text.split()
                ):
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

                    if (
                        len(word) >= 4
                        and word in place_name
                    ):
<<<<<<< HEAD
=======

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                        score += 10

                        reasons.append(
                            f"name matches '{word}'"
                        )

                        break

<<<<<<< HEAD
            ranked.append(
                {
                    "score": min(score, 100),
=======
            # ------------------------------------------------
            # Output
            # ------------------------------------------------

            ranked.append(
                {
                    "score": min(
                        score,
                        100,
                    ),

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                    "distance_meters": round(
                        distance,
                        2,
                    ),
<<<<<<< HEAD
                    "name": (
                        tags.get("name:en")
                        or tags.get("name")
                        or "Unnamed place"
                    ),
                    "type": (
                        tags.get("amenity")
                        or tags.get("shop")
                        or tags.get("tourism")
                        or tags.get("building")
                        or "place"
                    ),
                    "latitude": lat,
                    "longitude": lon,
                    "reasons": reasons,
=======

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

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
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