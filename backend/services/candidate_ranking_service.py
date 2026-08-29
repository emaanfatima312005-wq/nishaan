import math
import re


class CandidateRankingService:

    # ============================================================
    # DISTANCE
    # ============================================================

    @staticmethod
    def distance_meters(
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float,
    ) -> float:
        """
        Haversine distance in meters.

        Used for initial candidate ranking.
        """

        earth_radius = 6371000

        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)

        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = (
            math.sin(delta_phi / 2) ** 2
            + math.cos(phi1)
            * math.cos(phi2)
            * math.sin(delta_lambda / 2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a),
        )

        return earth_radius * c


    # ============================================================
    # NORMALIZE TEXT
    # ============================================================

    @staticmethod
    def normalize(text: str | None) -> str:
        if not text:
            return ""

        text = text.lower()

        text = re.sub(
            r"[^a-z0-9\s]",
            " ",
            text,
        )

        text = re.sub(
            r"\s+",
            " ",
            text,
        )

        return text.strip()


    # ============================================================
    # EXTRACT SEARCH TERMS
    # ============================================================

    @staticmethod
    def get_landmark_terms(
        landmarks: list[str],
    ):
        """
        Convert AI landmark descriptions into useful
        generic search categories.
        """

        terms = set()

        for landmark in landmarks:

            value = CandidateRankingService.normalize(
                landmark
            )

            if any(
                word in value
                for word in [
                    "mosque",
                    "masjid",
                    "jamia",
                ]
            ):
                terms.add("mosque")

            if any(
                word in value
                for word in [
                    "market",
                    "bazaar",
                    "bazar",
                ]
            ):
                terms.add("market")

            if any(
                word in value
                for word in [
                    "bank",
                    "atm",
                ]
            ):
                terms.add("bank")

            if any(
                word in value
                for word in [
                    "school",
                    "college",
                    "university",
                ]
            ):
                terms.add("education")

            if any(
                word in value
                for word in [
                    "hospital",
                    "clinic",
                ]
            ):
                terms.add("healthcare")

            if any(
                word in value
                for word in [
                    "shop",
                    "store",
                    "mall",
                    "plaza",
                ]
            ):
                terms.add("shop")

        return terms


    # ============================================================
    # CATEGORY MATCH
    # ============================================================

    @staticmethod
    def category_matches(
        tags: dict,
        landmark_terms: set,
    ) -> bool:

        amenity = CandidateRankingService.normalize(
            tags.get("amenity")
        )

        shop = CandidateRankingService.normalize(
            tags.get("shop")
        )

        tourism = CandidateRankingService.normalize(
            tags.get("tourism")
        )

        building = CandidateRankingService.normalize(
            tags.get("building")
        )

        if (
            "mosque" in landmark_terms
            and amenity == "place_of_worship"
        ):
            return True

        if (
            "market" in landmark_terms
            and (
                amenity == "marketplace"
                or shop in {
                    "mall",
                    "supermarket",
                    "convenience",
                }
            )
        ):
            return True

        if (
            "bank" in landmark_terms
            and amenity == "bank"
        ):
            return True

        if (
            "education" in landmark_terms
            and amenity in {
                "school",
                "college",
                "university",
            }
        ):
            return True

        if (
            "healthcare" in landmark_terms
            and amenity in {
                "hospital",
                "clinic",
            }
        ):
            return True

        if (
            "shop" in landmark_terms
            and shop
        ):
            return True

        return False


    # ============================================================
    # SCORE CANDIDATE
    # ============================================================

    @staticmethod
    def score_candidate(
        candidate: dict,
        latitude: float,
        longitude: float,
        city: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
    ):

        landmarks = landmarks or []

        tags = candidate.get(
            "tags",
            {}
        )

        candidate_lat = candidate.get(
            "lat"
        )

        candidate_lon = candidate.get(
            "lon"
        )

        # Ways and relations have "center"
        if candidate_lat is None:

            center = candidate.get(
                "center",
                {}
            )

            candidate_lat = center.get(
                "lat"
            )

            candidate_lon = center.get(
                "lon"
            )

        if candidate_lat is None or candidate_lon is None:
            return None

        score = 0

        reasons = []

        normalized_city = CandidateRankingService.normalize(
            city
        )

        normalized_street = CandidateRankingService.normalize(
            street
        )

        candidate_city = CandidateRankingService.normalize(
            tags.get("addr:city:en")
            or tags.get("addr:city")
        )

        candidate_street = CandidateRankingService.normalize(
            tags.get("addr:street")
        )

        # --------------------------------------------------------
        # CITY MATCH
        # --------------------------------------------------------

        if (
            normalized_city
            and normalized_city in candidate_city
        ):
            score += 30

            reasons.append(
                "city matches"
            )

        # --------------------------------------------------------
        # STREET MATCH
        # --------------------------------------------------------

        if (
            normalized_street
            and normalized_street in candidate_street
        ):
            score += 35

            reasons.append(
                "street matches"
            )

        # --------------------------------------------------------
        # LANDMARK CATEGORY
        # --------------------------------------------------------

        landmark_terms = (
            CandidateRankingService.get_landmark_terms(
                landmarks
            )
        )

        if CandidateRankingService.category_matches(
            tags,
            landmark_terms,
        ):
            score += 20

            reasons.append(
                "landmark type matches"
            )

        # --------------------------------------------------------
        # DISTANCE
        # --------------------------------------------------------

        distance = CandidateRankingService.distance_meters(
            latitude,
            longitude,
            float(candidate_lat),
            float(candidate_lon),
        )

        # Closer places get a stronger score.
        if distance <= 100:
            score += 15
        elif distance <= 250:
            score += 12
        elif distance <= 500:
            score += 8
        elif distance <= 1000:
            score += 4

        # --------------------------------------------------------
        # NAME MATCH
        # --------------------------------------------------------

        name = CandidateRankingService.normalize(
            tags.get("name:en")
            or tags.get("name")
            or ""
        )

        for landmark in landmarks:

            landmark_words = (
                CandidateRankingService.normalize(
                    landmark
                ).split()
            )

            for word in landmark_words:

                if len(word) >= 4 and word in name:
                    score += 10

                    reasons.append(
                        f"name contains '{word}'"
                    )

                    break

        return {
            "score": min(score, 100),
            "distance_meters": round(
                distance,
                2,
            ),
            "reasons": reasons,
            "latitude": float(
                candidate_lat
            ),
            "longitude": float(
                candidate_lon
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
            "tags": tags,
        }


    # ============================================================
    # RANK
    # ============================================================

    @staticmethod
    def rank_candidates(
        candidates: list[dict],
        latitude: float,
        longitude: float,
        city: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
    ):

        ranked = []

        for candidate in candidates:

            result = CandidateRankingService.score_candidate(
                candidate=candidate,
                latitude=latitude,
                longitude=longitude,
                city=city,
                street=street,
                landmarks=landmarks,
            )

            if result:
                ranked.append(result)

        ranked.sort(
            key=lambda item: (
                -item["score"],
                item["distance_meters"],
            )
        )

        return ranked[:10]