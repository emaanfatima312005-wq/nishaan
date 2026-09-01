from __future__ import annotations

from typing import Any

import re
import httpx


# ============================================================
# NOMINATIM
# ============================================================

NOMINATIM_URL = (
    "https://nominatim.openstreetmap.org/search"
)


HEADERS = {
    "User-Agent": (
        "Nishaan/1.0 "
        "(AI location research project)"
    )
}


class GeocodingService:

    # ========================================================
    # LOW-LEVEL SEARCH
    # ========================================================

    @staticmethod
    async def _search(
        client: httpx.AsyncClient,
        params: dict[str, Any],
    ) -> list[dict[str, Any]]:

        response = await client.get(
            NOMINATIM_URL,
            params=params,
        )

        response.raise_for_status()

        data = response.json()

        if not isinstance(
            data,
            list,
        ):
            return []

        return data

    # ========================================================
    # SEARCH SPECIFIC QUERY
    # ========================================================

    @staticmethod
    async def search_query(
        query: str,
        limit: int = 5,
        viewbox: str | None = None,
        bounded: int | None = None,
    ) -> list[dict[str, Any]]:

        if not query or not query.strip():
            return []

        params: dict[str, Any] = {
            "q": query.strip(),
            "format": "jsonv2",
            "addressdetails": 1,
            "namedetails": 1,
            "accept-language": "en",
            "limit": limit,
            "countrycodes": "pk",
        }

        if viewbox:
            params["viewbox"] = viewbox

        if bounded is not None:
            params["bounded"] = bounded

        print(
            f"OSM SEARCH QUERY: {query}"
        )

        if viewbox:

            print(
                "OSM VIEWBOX:",
                viewbox,
            )

        async with httpx.AsyncClient(
            timeout=20.0,
            headers=HEADERS,
        ) as client:

            results = await (
                GeocodingService._search(
                    client,
                    params,
                )
            )

        if results:

            print(
                f"OSM MATCH FOUND: {query}"
            )

        else:

            print(
                f"OSM NO MATCH: {query}"
            )

        return results

    # ========================================================
    # STREET QUERY VARIANTS
    # ========================================================

    @staticmethod
    def _street_variants(
        street: str,
    ) -> list[str]:

        if not street:
            return []

        original = street.strip()

        if not original:
            return []

        variants = [
            original
        ]

        normalized = re.sub(
            r"\s+",
            " ",
            original.lower(),
        ).strip()

        # ----------------------------------------------------
        # Street number forms
        # ----------------------------------------------------

        match = re.fullmatch(
            r"(?:street|street no|street number|"
            r"street #|street num|no)\s*#?\s*(\d+)",
            normalized,
        )

        if match:

            number = match.group(1)

            variants.extend(
                [
                    f"Street #{number}",
                    f"Street # {number}",
                    f"Street {number}",
                    f"Street No {number}",
                ]
            )

        # ----------------------------------------------------
        # Gali number forms
        # ----------------------------------------------------

        gali_match = re.fullmatch(
            r"(?:gali|gali no|gali number|gali #)"
            r"\s*#?\s*(\d+)",
            normalized,
        )

        if gali_match:

            number = gali_match.group(1)

            variants.extend(
                [
                    f"Gali #{number}",
                    f"Gali # {number}",
                    f"Gali {number}",
                    f"Gali No {number}",
                ]
            )

        # ----------------------------------------------------
        # Remove duplicates
        # ----------------------------------------------------

        final = []

        seen = set()

        for variant in variants:

            key = (
                variant
                .strip()
                .lower()
            )

            if key in seen:
                continue

            seen.add(
                key
            )

            final.append(
                variant.strip()
            )

        return final

    # ========================================================
    # AREA SEARCH
    # ========================================================

    @staticmethod
    async def search_area(
        area: str,
        city: str | None = None,
        province: str | None = None,
        limit: int = 5,
    ) -> list[dict[str, Any]]:

        if not area or not area.strip():
            return []

        parts = [
            area,
            city,
            province,
            "Pakistan",
        ]

        parts = [
            str(part).strip()
            for part in parts
            if part
        ]

        query = ", ".join(
            parts
        )

        print()
        print("=" * 60)
        print("OSM AREA SEARCH")
        print(query)
        print("=" * 60)

        return await (
            GeocodingService.search_query(
                query=query,
                limit=limit,
            )
        )

    # ========================================================
    # STREET INSIDE AREA
    # ========================================================

    @staticmethod
    async def search_street_in_area(
        street: str,
        area: str,
        city: str,
        province: str | None = None,
        limit: int = 10,
    ) -> list[dict[str, Any]]:

        if not street or not street.strip():
            return []

        if not area or not area.strip():
            return []

        if not city or not city.strip():
            return []

        # ====================================================
        # 1. FIND AREA
        # ====================================================

        area_results = await (
            GeocodingService.search_area(
                area=area,
                city=city,
                province=province,
                limit=5,
            )
        )

        if not area_results:

            print(
                "AREA NOT FOUND:",
                area,
            )

            return []

        # ====================================================
        # 2. SELECT AREA
        # ====================================================

        area_result = (
            GeocodingService._choose_best_area(
                area_results=area_results,
                area=area,
                city=city,
            )
        )

        if not area_result:

            print(
                "NO USABLE AREA RESULT:",
                area,
            )

            return []

        print()
        print("AREA FOUND:")
        print(
            area_result.get(
                "display_name"
            )
        )

        # ====================================================
        # 3. AREA BOUNDING BOX
        # ====================================================

        bbox = area_result.get(
            "boundingbox"
        )

        if (
            not bbox
            or not isinstance(
                bbox,
                list,
            )
            or len(bbox) != 4
        ):

            print(
                "AREA HAS NO USABLE BOUNDING BOX"
            )

            return []

        try:

            south = float(
                bbox[0]
            )

            north = float(
                bbox[1]
            )

            west = float(
                bbox[2]
            )

            east = float(
                bbox[3]
            )

        except (
            TypeError,
            ValueError,
        ):

            print(
                "INVALID AREA BOUNDING BOX"
            )

            return []

        viewbox = (
            f"{west},"
            f"{north},"
            f"{east},"
            f"{south}"
        )

        # ====================================================
        # 4. STREET VARIANTS
        # ====================================================

        street_variants = (
            GeocodingService._street_variants(
                street
            )
        )

        if not street_variants:

            street_variants = [
                street
            ]

        # ====================================================
        # 5. SEARCH STREET INSIDE AREA
        # ====================================================

        all_results = []

        for street_variant in street_variants:

            street_query = (
                f"{street_variant}, "
                f"{area}, "
                f"{city}, "
                f"{province or ''}, "
                f"Pakistan"
            )

            results = await (
                GeocodingService.search_query(
                    query=street_query,
                    limit=limit,
                    viewbox=viewbox,
                    bounded=1,
                )
            )

            all_results.extend(
                results
            )

        # ====================================================
        # 6. DEDUPLICATE
        # ====================================================

        unique_results = []

        seen = set()

        for result in all_results:

            key = (
                result.get(
                    "osm_type"
                ),
                result.get(
                    "osm_id"
                ),
                result.get(
                    "lat"
                ),
                result.get(
                    "lon"
                ),
            )

            if key in seen:
                continue

            seen.add(
                key
            )

            unique_results.append(
                result
            )

        # ====================================================
        # 7. FILTER TO AREA
        # ====================================================

        filtered = []

        requested_area = (
            area.strip().lower()
        )

        for result in unique_results:

            display_name = (
                str(
                    result.get(
                        "display_name"
                    )
                    or ""
                )
                .lower()
            )

            address = (
                result.get(
                    "address"
                )
                or {}
            )

            result_area = " ".join(
                [
                    str(
                        address.get(
                            "suburb"
                        )
                        or ""
                    ),

                    str(
                        address.get(
                            "neighbourhood"
                        )
                        or ""
                    ),

                    str(
                        address.get(
                            "locality"
                        )
                        or ""
                    ),
                ]
            ).lower()

            if (
                requested_area in display_name
                or requested_area in result_area
            ):

                filtered.append(
                    result
                )

        print()
        print(
            "STREET RESULTS INSIDE AREA:",
            len(filtered),
        )

        return filtered

    # ========================================================
    # CHOOSE BEST AREA
    # ========================================================

    @staticmethod
    def _choose_best_area(
        area_results: list[dict[str, Any]],
        area: str,
        city: str,
    ) -> dict[str, Any] | None:

        requested = (
            area.strip().lower()
        )

        city_normalized = (
            city.strip().lower()
        )

        scored = []

        for result in area_results:

            address = (
                result.get(
                    "address"
                )
                or {}
            )

            display_name = (
                str(
                    result.get(
                        "display_name"
                    )
                    or ""
                )
                .strip()
                .lower()
            )

            name = (
                str(
                    result.get(
                        "name"
                    )
                        or ""
                )
                .strip()
                .lower()
            )

            result_area_values = [
                str(
                    address.get(
                        "suburb"
                    )
                    or ""
                ).strip().lower(),

                str(
                    address.get(
                        "neighbourhood"
                    )
                    or ""
                ).strip().lower(),

                str(
                    address.get(
                        "locality"
                    )
                    or ""
                ).strip().lower(),

                name,
            ]

            score = 0

            if requested in result_area_values:
                score += 100

            if requested in display_name:
                score += 50

            if city_normalized in display_name:
                score += 30

            if address.get(
                "suburb"
            ):
                score += 10

            if address.get(
                "neighbourhood"
            ):
                score += 10

            if address.get(
                "locality"
            ):
                score += 10

            scored.append(
                (
                    score,
                    result,
                )
            )

        if not scored:
            return None

        scored.sort(
            key=lambda item: item[0],
            reverse=True,
        )

        return scored[0][1]

    # ========================================================
    # STRUCTURED LOCATION SEARCH
    # ========================================================

    @staticmethod
    async def search(
        province: str | None = None,
        city: str | None = None,
        town: str | None = None,
        area: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
        exact_query: str | None = None,
    ) -> list[dict]:

        landmarks = landmarks or []

        # ====================================================
        # EXACT QUERY MODE
        # ====================================================

        if exact_query:

            return await (
                GeocodingService.search_query(
                    query=exact_query,
                    limit=5,
                )
            )

        # ====================================================
        # AREA + STREET SEARCH
        # ====================================================

        if (
            street
            and area
            and city
        ):

            try:

                results = await (
                    GeocodingService.search_street_in_area(
                        street=street,
                        area=area,
                        city=city,
                        province=province,
                        limit=10,
                    )
                )

                if results:

                    return results

            except Exception as exc:

                print(
                    "AREA-STREET SEARCH ERROR:",
                    type(exc).__name__,
                    str(exc),
                )

        # ====================================================
        # PROGRESSIVE SEARCH
        # ====================================================

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

        if (
            street
            and area
            and city
        ):

            queries.append(
                f"{street}, "
                f"{area}, "
                f"{city}, Pakistan"
            )

        if (
            street
            and town
            and city
        ):

            queries.append(
                f"{street}, "
                f"{town}, "
                f"{city}, Pakistan"
            )

        if street and city:

            queries.append(
                f"{street}, "
                f"{city}, Pakistan"
            )

        if area and city:

            queries.append(
                f"{area}, "
                f"{city}, Pakistan"
            )

        if town and city:

            queries.append(
                f"{town}, "
                f"{city}, Pakistan"
            )

        for landmark in landmarks:

            if not landmark:
                continue

            if area and city:

                queries.append(
                    f"{landmark}, "
                    f"{area}, "
                    f"{city}, Pakistan"
                )

            elif city:

                queries.append(
                    f"{landmark}, "
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

        # ====================================================
        # DEDUPLICATE
        # ====================================================

        unique_queries = []

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

            unique_queries.append(
                query
            )

        # ====================================================
        # EXECUTE
        # ====================================================

        for query in unique_queries:

            results = await (
                GeocodingService.search_query(
                    query=query,
                    limit=5,
                )
            )

            if results:

                return results

        print(
            "OSM SEARCH: no results found"
        )

        return []