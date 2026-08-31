import httpx


NOMINATIM_REVERSE_URL = (
    "https://nominatim.openstreetmap.org/reverse"
)

HEADERS = {
    "User-Agent": "Nishaan/1.0 (AI location research project)"
}


class ReverseGeocodingService:

    @staticmethod
    async def reverse(
        latitude: float,
        longitude: float,
    ):
        params = {
            "lat": latitude,
            "lon": longitude,
            "format": "jsonv2",
            "addressdetails": 1,
            "zoom": 18,
        }

        async with httpx.AsyncClient(
            timeout=15.0,
            headers=HEADERS,
        ) as client:

            response = await client.get(
                NOMINATIM_REVERSE_URL,
                params=params,
            )

            response.raise_for_status()

            return response.json()