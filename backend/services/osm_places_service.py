import httpx


OVERPASS_URL = "https://overpass-api.de/api/interpreter"

HEADERS = {
    "User-Agent": "Nishaan/1.0 (AI location research project)"
}


class OSMPlacesService:

    @staticmethod
    async def nearby_places(
        latitude: float,
        longitude: float,
        radius_meters: int = 1000,
    ):
        """
        Get nearby relevant places from OpenStreetMap
        using the Overpass API.
        """

        query = f"""
        [out:json][timeout:25];

        (
          node(around:{radius_meters},{latitude},{longitude})
            ["amenity"];

          way(around:{radius_meters},{latitude},{longitude})
            ["amenity"];

          relation(around:{radius_meters},{latitude},{longitude})
            ["amenity"];

          node(around:{radius_meters},{latitude},{longitude})
            ["shop"];

          way(around:{radius_meters},{latitude},{longitude})
            ["shop"];

          node(around:{radius_meters},{latitude},{longitude})
            ["tourism"];

          way(around:{radius_meters},{latitude},{longitude})
            ["tourism"];
        );

        out center tags;
        """

        async with httpx.AsyncClient(
            timeout=30.0,
            headers=HEADERS,
        ) as client:

            response = await client.post(
                OVERPASS_URL,
                data=query,
            )

            response.raise_for_status()

            return response.json().get(
                "elements",
                []
            )