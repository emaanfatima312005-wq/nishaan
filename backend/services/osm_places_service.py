import httpx


OVERPASS_URL = "https://overpass-api.de/api/interpreter"

HEADERS = {
    "User-Agent": "Nishaan/1.0 (AI location research project)"
}


class OSMPlacesService:

    @staticmethod
    async def _search(
        client: httpx.AsyncClient,
        query: str,
    ):
        response = await client.post(
            OVERPASS_URL,
            data=query,
        )

        response.raise_for_status()

        return response.json().get(
            "elements",
            []
        )

    @staticmethod
    async def nearby_places(
        latitude: float,
        longitude: float,
        radius_meters: int = 500,
    ):
        """
        Get relevant nearby OSM places.

        We intentionally query only useful categories instead of
        requesting every amenity/shop/tourism object in the area.
        This reduces Overpass load and avoids frequent 504 errors.
        """

        # Keep radius reasonable for a street-level search.
        radius_meters = min(
            radius_meters,
            750,
        )

        query = f"""
        [out:json][timeout:15];

        (
          node(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="place_of_worship"];

          way(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="place_of_worship"];

          node(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="marketplace"];

          way(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="marketplace"];

          node(
            around:{radius_meters},{latitude},{longitude}
          )["shop"]["name"];

          way(
            around:{radius_meters},{latitude},{longitude}
          )["shop"]["name"];

          node(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="bank"];

          way(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="bank"];

          node(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="school"];

          way(
            around:{radius_meters},{latitude},{longitude}
          )["amenity"="school"];
        );

        out center tags;
        """

        try:

            async with httpx.AsyncClient(
                timeout=25.0,
                headers=HEADERS,
            ) as client:

                print(
                    "OVERPASS SEARCH:",
                    latitude,
                    longitude,
                    "radius=",
                    radius_meters,
                )

                return await OSMPlacesService._search(
                    client,
                    query,
                )

        except (
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as e:

            print(
                "OVERPASS ERROR:",
                type(e).__name__,
                str(e),
            )

            # OSM is supporting evidence.
            # It should never destroy the whole location request.
            return []

        except Exception as e:

            print(
                "OVERPASS UNEXPECTED ERROR:",
                type(e).__name__,
                str(e),
            )

            return []