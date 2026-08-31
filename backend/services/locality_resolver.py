import httpx


NOMINATIM_URL = (
    "https://nominatim.openstreetmap.org/search"
)

HEADERS = {
    "User-Agent": "Nishaan/1.0 (AI location research project)"
}


class LocalityResolver:

    @staticmethod
    async def resolve(
        name: str,
        city: str | None = None,
    ):
        """
        Resolve a named locality and inspect the geographic
        hierarchy returned by Nominatim.
        """

        query_parts = [name]

        if city:
            query_parts.append(city)

        query_parts.append("Pakistan")

        query = ", ".join(query_parts)

        params = {
            "q": query,
            "format": "jsonv2",
            "addressdetails": 1,
            "limit": 5,
            "countrycodes": "pk",
        }

        async with httpx.AsyncClient(
            timeout=15,
            headers=HEADERS,
        ) as client:

            response = await client.get(
                NOMINATIM_URL,
                params=params,
            )

            response.raise_for_status()

            results = response.json()

            return results