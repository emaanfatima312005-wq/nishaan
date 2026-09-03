from __future__ import annotations

import math
import re
from pathlib import Path
from typing import Any

from rapidfuzz import fuzz


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

PLACE_FILE = DATA_DIR / "PK.txt"
ADMIN1_FILE = DATA_DIR / "admin1CodesASCII.txt"
ADMIN2_FILE = DATA_DIR / "admin2Codes.txt"


# ============================================================
# NORMALIZATION
# ============================================================

CHARACTER_REPLACEMENTS = {
    "ي": "ی",
    "ى": "ی",
    "ئ": "ی",
    "ك": "ک",
    "ۀ": "ہ",
    "ة": "ہ",
    "ؤ": "و",
    "أ": "ا",
    "إ": "ا",
    "ٱ": "ا",
}

URDU_DIGITS = str.maketrans(
    "۰۱۲۳۴۵۶۷۸۹",
    "0123456789",
)


def normalize_text(
    text: str | None,
) -> str:
    """
    Normalize Urdu / Roman Urdu / English text
    before geographic matching.
    """

    if not text:
        return ""

    text = text.strip().lower()

    text = text.translate(
        URDU_DIGITS
    )

    for source, target in CHARACTER_REPLACEMENTS.items():
        text = text.replace(
            source,
            target,
        )

    text = re.sub(
        r"[،۔,:;!?()[\]{}\"'`]+",
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
# FEATURE FILTER
# ============================================================

USEFUL_FEATURE_CLASSES = {
    "P",
    "A",
    "L",
}

USEFUL_FEATURE_CODES = {
    "PPL",
    "PPLA",
    "PPLA2",
    "PPLA3",
    "PPLA4",
    "PPLC",
    "PPLX",
    "ADM1",
    "ADM2",
    "ADM3",
    "ADM4",
    "AREA",
    "LCTY",
}


# ============================================================
# RECOGNIZER
# ============================================================

class PakistanPlaceRecognizer:

    _places: list[dict[str, Any]] | None = None

    _admin1: dict[
        str,
        dict[str, str],
    ] | None = None

    _admin2: dict[
        str,
        dict[str, str],
    ] | None = None

    # ========================================================
    # ADMIN 1
    # ========================================================

    @classmethod
    def load_admin1(
        cls,
    ) -> dict[str, dict[str, str]]:

        if cls._admin1 is not None:
            return cls._admin1

        cls._admin1 = {}

        if not ADMIN1_FILE.exists():

            print(
                "WARNING: admin1CodesASCII.txt not found"
            )

            return cls._admin1

        with ADMIN1_FILE.open(
            "r",
            encoding="utf-8",
        ) as file:

            for line in file:

                fields = line.rstrip(
                    "\n"
                ).split("\t")

                if len(fields) < 3:
                    continue

                code = fields[0]
                name = fields[1]
                ascii_name = fields[2]

                cls._admin1[code] = {
                    "name": name,
                    "ascii_name": ascii_name,
                }

        return cls._admin1

    # ========================================================
    # ADMIN 2
    # ========================================================

    @classmethod
    def load_admin2(
        cls,
    ) -> dict[str, dict[str, str]]:

        if cls._admin2 is not None:
            return cls._admin2

        cls._admin2 = {}

        if not ADMIN2_FILE.exists():

            print(
                "WARNING: admin2Codes.txt not found"
            )

            return cls._admin2

        with ADMIN2_FILE.open(
            "r",
            encoding="utf-8",
        ) as file:

            for line in file:

                fields = line.rstrip(
                    "\n"
                ).split("\t")

                if len(fields) < 3:
                    continue

                code = fields[0]
                name = fields[1]
                ascii_name = fields[2]

                cls._admin2[code] = {
                    "name": name,
                    "ascii_name": ascii_name,
                }

        return cls._admin2

    # ========================================================
    # LOAD PLACES
    # ========================================================

    @classmethod
    def load_places(
        cls,
    ) -> list[dict[str, Any]]:

        if cls._places is not None:
            return cls._places

        if not PLACE_FILE.exists():

            raise FileNotFoundError(
                f"Missing Pakistan place database: "
                f"{PLACE_FILE}"
            )

        admin1 = cls.load_admin1()
        admin2 = cls.load_admin2()

        places: list[dict[str, Any]] = []

        with PLACE_FILE.open(
            "r",
            encoding="utf-8",
        ) as file:

            for line in file:

                fields = line.rstrip(
                    "\n"
                ).split("\t")

                if len(fields) < 15:
                    continue

                try:

                    geoname_id = int(
                        fields[0]
                    )

                    name = fields[1]
                    ascii_name = fields[2]

                    latitude = float(
                        fields[4]
                    )

                    longitude = float(
                        fields[5]
                    )

                    feature_class = fields[6]
                    feature_code = fields[7]

                    country_code = fields[8]

                    admin1_code = fields[10]
                    admin2_code = fields[11]
                    admin3_code = fields[12]
                    admin4_code = fields[13]

                    population = int(
                        fields[14] or 0
                    )

                except (
                    ValueError,
                    IndexError,
                ):
                    continue

                if country_code != "PK":
                    continue

                if (
                    feature_class
                    not in USEFUL_FEATURE_CLASSES
                    and feature_code
                    not in USEFUL_FEATURE_CODES
                ):
                    continue

                admin1_key = (
                    f"PK.{admin1_code}"
                    if admin1_code
                    else ""
                )

                admin2_key = (
                    f"PK.{admin1_code}.{admin2_code}"
                    if admin1_code and admin2_code
                    else ""
                )

                admin1_info = admin1.get(
                    admin1_key,
                    {},
                )

                admin2_info = admin2.get(
                    admin2_key,
                    {},
                )

                places.append(
                    {
                        "geoname_id": geoname_id,
                        "name": name,
                        "ascii_name": ascii_name,
                        "name_normalized": normalize_text(
                            name
                        ),
                        "ascii_normalized": normalize_text(
                            ascii_name
                        ),
                        "latitude": latitude,
                        "longitude": longitude,
                        "feature_class": feature_class,
                        "feature_code": feature_code,
                        "admin1_code": admin1_code,
                        "admin2_code": admin2_code,
                        "admin3_code": admin3_code,
                        "admin4_code": admin4_code,
                        "province": (
                            admin1_info.get("ascii_name")
                            or admin1_info.get("name")
                        ),
                        "district": (
                            admin2_info.get("ascii_name")
                            or admin2_info.get("name")
                        ),
                        "population": population,
                    }
                )

        cls._places = places

        print("=" * 60)
        print("PAKISTAN PLACE DATABASE LOADED")
        print("Places:", len(places))
        print("File:", PLACE_FILE)
        print("=" * 60)

        return cls._places

    # ========================================================
    # NAME SCORE
    # ========================================================

    @staticmethod
    def score_name(
        query: str,
        candidate: str,
    ) -> float:

        q = normalize_text(query)
        c = normalize_text(candidate)

        if not q or not c:
            return 0.0

        # Exact match
        if q == c:
            return 100.0

        ratio = fuzz.ratio(
            q,
            c,
        )

        token_ratio = fuzz.token_sort_ratio(
            q,
            c,
        )

        partial = 0.0

        # Only allow partial matching when the two
        # strings are reasonably close in length.
        if (
            len(q) >= 5
            and len(c) >= 5
            and (
                min(len(q), len(c))
                / max(len(q), len(c))
                >= 0.60
            )
        ):

            partial = fuzz.partial_ratio(
                q,
                c,
            )

        return max(
            ratio,
            token_ratio,
            partial,
        )

    # ========================================================
    # BASIC SEARCH
    # ========================================================

    @classmethod
    def search(
        cls,
        query: str,
        top_k: int = 10,
        minimum_score: float = 70.0,
    ) -> list[dict[str, Any]]:

        places = cls.load_places()

        q = normalize_text(
            query
        )

        if not q:
            return []

        results = []

        for place in places:

            score = max(
                cls.score_name(
                    q,
                    place["name"],
                ),
                cls.score_name(
                    q,
                    place["ascii_name"],
                ),
            )

            # Do not let tiny names such as "Kur"
            # match a long query.
            if (
                len(q) >= 5
                and len(
                    normalize_text(
                        place["name"]
                    )
                ) <= 4
                and normalize_text(
                    place["name"]
                ) != q
            ):
                continue

            if score < minimum_score:
                continue

            results.append(
                {
                    **place,
                    "match_score": round(
                        score,
                        2,
                    ),
                }
            )

        results.sort(
            key=lambda item: (
                item["match_score"],
                item["population"],
            ),
            reverse=True,
        )

        return results[:top_k]

    # ========================================================
    # FIND CITY ANCHOR
    # ========================================================

    @classmethod
    def find_city_anchor(
        cls,
        city: str,
        province: str | None = None,
    ) -> dict[str, Any] | None:

        places = cls.load_places()

        city_normalized = normalize_text(
            city
        )

        province_normalized = normalize_text(
            province
        )

        candidates = []

        for place in places:

            if place["feature_code"] not in {
                "PPLA",
                "PPLA2",
                "PPLA3",
                "PPLA4",
                "PPLC",
            }:
                continue

            score = max(
                cls.score_name(
                    city_normalized,
                    place["name"],
                ),
                cls.score_name(
                    city_normalized,
                    place["ascii_name"],
                ),
            )

            if score < 90:
                continue

            final_score = score

            if province_normalized:

                candidate_province = normalize_text(
                    place.get(
                        "province"
                    ) or ""
                )

                if candidate_province:

                    province_score = fuzz.ratio(
                        province_normalized,
                        candidate_province,
                    )

                    if province_score >= 80:
                        final_score += 10

            candidates.append(
                {
                    **place,
                    "anchor_score": min(
                        final_score,
                        100,
                    ),
                }
            )

        if not candidates:
            return None

        candidates.sort(
            key=lambda item: (
                item["anchor_score"],
                item["population"],
            ),
            reverse=True,
        )

        return candidates[0]

    # ========================================================
    # CITY-CONTEXT SEARCH
    # ========================================================

    @classmethod
    def search_in_city(
        cls,
        place_name: str,
        city: str,
        province: str | None = None,
        top_k: int = 10,
        radius_km: float = 30.0,
    ) -> list[dict[str, Any]]:

        query = normalize_text(
            place_name
        )

        # Never search tiny words.
        if len(query) < 5:
            return []

        anchor = cls.find_city_anchor(
            city=city,
            province=province,
        )

        if anchor is None:
            return []

        places = cls.load_places()

        results = []

        for place in places:

            # Do not return the city itself.
            if (
                place["geoname_id"]
                == anchor["geoname_id"]
            ):
                continue

            # --------------------------------------------
            # Province restriction
            # --------------------------------------------

            if province:

                requested_province = normalize_text(
                    province
                )

                candidate_province = normalize_text(
                    place.get(
                        "province"
                    ) or ""
                )

                if (
                    candidate_province
                    and requested_province
                    and fuzz.ratio(
                        requested_province,
                        candidate_province,
                    ) < 75
                ):
                    continue

            # --------------------------------------------
            # Distance restriction
            # --------------------------------------------

            distance = cls.distance_km(
                anchor["latitude"],
                anchor["longitude"],
                place["latitude"],
                place["longitude"],
            )

            if distance > radius_km:
                continue

            # --------------------------------------------
            # Name similarity
            # --------------------------------------------

            score = max(
                cls.score_name(
                    query,
                    place["name"],
                ),
                cls.score_name(
                    query,
                    place["ascii_name"],
                ),
            )

            if score < 65:
                continue

            # --------------------------------------------
            # Prefer locality/place records
            # --------------------------------------------

            feature_bonus = 0

            if place["feature_code"] in {
                "PPL",
                "PPLX",
                "PPLA3",
                "PPLA4",
                "LCTY",
                "AREA",
            }:

                feature_bonus = 5

            # --------------------------------------------
            # Nearby bonus
            # --------------------------------------------

            distance_bonus = max(
                0.0,
                10.0
                - (
                    distance
                    / radius_km
                )
                * 10.0,
            )

            final_score = min(
                100.0,
                score
                + feature_bonus
                + distance_bonus,
            )

            results.append(
                {
                    **place,
                    "match_score": round(
                        score,
                        2,
                    ),
                    "distance_km": round(
                        distance,
                        2,
                    ),
                    "context_score": round(
                        final_score,
                        2,
                    ),
                    "city_anchor": anchor[
                        "name"
                    ],
                }
            )

        results.sort(
            key=lambda item: (
                item["context_score"],
                item["match_score"],
                -item["distance_km"],
                item["population"],
            ),
            reverse=True,
        )

        return results[:top_k]

    # ========================================================
    # CANDIDATE CHUNKS
    # ========================================================

    @staticmethod
    def extract_candidate_chunks(
        text: str,
        city: str | None = None,
    ) -> list[str]:

        normalized = normalize_text(
            text
        )

        if not normalized:
            return []

        tokens = normalized.split()

        # --------------------------------------------
        # Remove the known city.
        # --------------------------------------------

        if city:

            city_tokens = normalize_text(
                city
            ).split()

            filtered = []

            i = 0

            while i < len(tokens):

                if (
                    tokens[
                        i:i + len(city_tokens)
                    ]
                    == city_tokens
                ):

                    i += len(city_tokens)

                else:

                    filtered.append(
                        tokens[i]
                    )

                    i += 1

            tokens = filtered

        # --------------------------------------------
        # Words that are not locality names.
        # --------------------------------------------

        stop_words = {
            "mein",
            "main",
            "me",
            "hai",
            "he",
            "ka",
            "ki",
            "ke",
            "ko",
            "se",
            "par",
            "paas",
            "near",
            "with",
            "and",
            "the",
            "mein",
            "mujhe",
            "mera",
            "meri",
            "mere",
            "ghar",
            "house",
            "number",
            "no",
            "gali",
            "street",
            "road",
            "wali",
            "wala",
            "wale",
            "paanch",
            "paach",
            "five",
            "ek",
            "do",
            "teen",
            "char",
            "chaar",
            "che",
            "chhe",
            "saat",
            "saath",
            "aath",
            "nau",
            "das",
        }

        meaningful_tokens = [
            token
            for token in tokens
            if token not in stop_words
            and len(token) >= 5
        ]

        if not meaningful_tokens:
            return []

        chunks = []

        # --------------------------------------------
        # Multi-word locality names.
        # --------------------------------------------

        for size in range(
            min(
                3,
                len(meaningful_tokens),
            ),
            1,
            -1,
        ):

            for start in range(
                len(meaningful_tokens)
                - size
                + 1
            ):

                chunk = " ".join(
                    meaningful_tokens[
                        start:start + size
                    ]
                )

                if len(chunk) >= 5:
                    chunks.append(
                        chunk
                    )

        # --------------------------------------------
        # Single useful words.
        # --------------------------------------------

        for token in meaningful_tokens:

            if token not in chunks:
                chunks.append(
                    token
                )

        # --------------------------------------------
        # Deduplicate.
        # --------------------------------------------

        seen = set()
        result = []

        for chunk in chunks:

            if chunk in seen:
                continue

            seen.add(chunk)
            result.append(chunk)

        return result

    # ========================================================
    # SENTENCE SEARCH
    # ========================================================

    @classmethod
    def search_sentence_with_city(
        cls,
        text: str,
        city: str,
        province: str | None = None,
        top_k: int = 15,
    ) -> list[dict[str, Any]]:

        chunks = cls.extract_candidate_chunks(
            text=text,
            city=city,
        )

        print()
        print("=" * 60)
        print("CITY-FIRST LOCATION SEARCH")
        print("CITY:", city)
        print("=" * 60)

        print(
            "CANDIDATE CHUNKS:"
        )

        if not chunks:
            print(
                "No locality candidates found."
            )
            print("=" * 60)
            return []

        for chunk in chunks:
            print(
                " -",
                chunk,
            )

        print("=" * 60)

        merged: dict[
            int,
            dict[str, Any],
        ] = {}

        for chunk in chunks:

            results = cls.search_in_city(
                place_name=chunk,
                city=city,
                province=province,
                top_k=5,
            )

            for result in results:

                place_id = result[
                    "geoname_id"
                ]

                existing = merged.get(
                    place_id
                )

                if (
                    existing is None
                    or result[
                        "context_score"
                    ]
                    > existing[
                        "context_score"
                    ]
                ):

                    result[
                        "matched_text"
                    ] = chunk

                    merged[
                        place_id
                    ] = result

        final_results = list(
            merged.values()
        )

        # Never return the known city itself.
        normalized_city = normalize_text(
            city
        )

        final_results = [
            result
            for result in final_results
            if normalize_text(
                result["name"]
            )
            != normalized_city
        ]

        final_results.sort(
            key=lambda item: (
                item["context_score"],
                item["match_score"],
                -item["distance_km"],
                item["population"],
            ),
            reverse=True,
        )

        return final_results[:top_k]