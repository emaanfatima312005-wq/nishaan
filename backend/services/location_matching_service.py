import math
import re


class LocationMatchingService:

    @staticmethod
    def normalize(value: str | None) -> str:
        if not value:
            return ""

        value = value.lower()
        value = re.sub(r"[^a-z0-9\s]", " ", value)
        value = re.sub(r"\s+", " ", value)

        return value.strip()

    @staticmethod
    def distance_meters(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
    ) -> float:

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
            )

            if any(
                word in text
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

    @staticmethod
    def rank_places(
        places: list,
        anchor_latitude: float,
        anchor_longitude: float,
        city: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
    ):
        """
        Rank nearby OSM places against the AI-extracted clues.
        """

        landmarks = landmarks or []

        required_types = (
            LocationMatchingService.detect_types(
                landmarks
            )
        )

        normalized_city = (
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

            # ---------------------------------------------
            # City
            # ---------------------------------------------

            place_city = LocationMatchingService.normalize(
                tags.get("addr:city:en")
                or tags.get("addr:city")
            )

            if (
                normalized_city
                and normalized_city in place_city
            ):
                score += 25
                reasons.append(
                    "city matches"
                )

            # ---------------------------------------------
            # Street
            # ---------------------------------------------

            place_street = LocationMatchingService.normalize(
                tags.get("addr:street")
            )

            if (
                normalized_street
                and normalized_street in place_street
            ):
                score += 30
                reasons.append(
                    "street matches"
                )

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

                reasons.append(
                    "requested landmark type matches"
                )

            # ---------------------------------------------
            # Name match
            # ---------------------------------------------

            place_name = LocationMatchingService.normalize(
                tags.get("name:en")
                or tags.get("name")
                or ""
            )

            for landmark in landmarks:

                landmark_text = (
                    LocationMatchingService
                    .normalize(landmark)
                )

                words = landmark_text.split()

                for word in words:

                    if (
                        len(word) >= 4
                        and word in place_name
                    ):
                        score += 10

                        reasons.append(
                            f"name matches '{word}'"
                        )

                        break

            ranked.append(
                {
                    "score": min(score, 100),
                    "distance_meters": round(
                        distance,
                        2,
                    ),
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