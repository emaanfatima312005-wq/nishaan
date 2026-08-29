import httpx


NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

HEADERS = {
    "User-Agent": "Nishaan/1.0 (AI location research project)"
}


class GeocodingService:

    @staticmethod
    async def _search(client, params):
        response = await client.get(
            NOMINATIM_URL,
            params=params,
        )

        response.raise_for_status()

        return response.json()

    @staticmethod
    async def search(
        province: str | None = None,
        city: str | None = None,
        town: str | None = None,
        area: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
    ):
        """
        Resolve a location using progressively broader
        OpenStreetMap / Nominatim searches.
        """

        queries = []

        # 1. Street + city
        if street and city:
            queries.append(
                f"{street}, {city}, Pakistan"
            )

        # 2. Street + town + city
        if street and town and city:
            queries.append(
                f"{street}, {town}, {city}, Pakistan"
            )

        # 3. Street + area + city
        if street and area and city:
            queries.append(
                f"{street}, {area}, {city}, Pakistan"
            )

        # 4. Area + city
        if area and city:
            queries.append(
                f"{area}, {city}, Pakistan"
            )

        # 5. Town + city
        if town and city:
            queries.append(
                f"{town}, {city}, Pakistan"
            )

        # 6. City + province
        if city and province:
            queries.append(
                f"{city}, {province}, Pakistan"
            )

        # 7. City
        if city:
            queries.append(
                f"{city}, Pakistan"
            )

        # 8. Full hierarchy
        full_parts = []

        if street:
            full_parts.append(street)

        if area:
            full_parts.append(area)

        if town:
            full_parts.append(town)

        if city:
            full_parts.append(city)

        if province:
            full_parts.append(province)

        full_parts.append("Pakistan")

        full_query = ", ".join(full_parts)

        if full_query and full_query not in queries:
            queries.append(full_query)

        async with httpx.AsyncClient(
            timeout=15.0,
            headers=HEADERS,
        ) as client:

            for query in queries:

                if not query:
                    continue

                params = {
                    "q": query,
                    "format": "jsonv2",
                    "addressdetails": 1,
                    "namedetails": 1,
                    "accept-language": "en",
                    "limit": 5,
                    "countrycodes": "pk",
                }

                print(f"OSM SEARCH: {query}")

                results = await GeocodingService._search(
                    client,
                    params,
                )

                if results:
                    print(
                        f"OSM MATCH FOUND: {query}"
                    )

                    return results

        print("OSM SEARCH: no results found")

        return []