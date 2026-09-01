from __future__ import annotations

from typing import Any

import httpx


# ============================================================
# OVERPASS
# ============================================================

OVERPASS_URL = (
    "https://overpass-api.de/api/interpreter"
)


HEADERS = {
    "User-Agent": (
        "Nishaan/1.0 "
        "(AI location research project)"
    )
}


# ============================================================
# OSM PLACES SERVICE
# ============================================================

class OSMPlacesService:

    # ========================================================
    # LOW-LEVEL OVERPASS SEARCH
    # ========================================================

    @staticmethod
    async def _search(
        client: httpx.AsyncClient,
        query: str,
    ) -> list[dict[str, Any]]:

        response = await client.post(
            OVERPASS_URL,
            data=query,
        )

        response.raise_for_status()

        data = response.json()

        if not isinstance(
            data,
            dict,
        ):
            return []

        elements = data.get(
            "elements",
            [],
        )

        if not isinstance(
            elements,
            list,
        ):
            return []

        return elements

    # ========================================================
    # NEARBY PLACES
    # ========================================================

    @staticmethod
    async def nearby_places(
        latitude: float,
        longitude: float,
        radius_meters: int = 500,
    ) -> list[dict[str, Any]]:
        """
        Return useful nearby OSM places.

        This is supporting geographic evidence only.
        It does not determine the final location by itself.
        """

        radius_meters = min(
            max(
                int(radius_meters),
                50,
            ),
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

  node(
    around:{radius_meters},{latitude},{longitude}
  )["amenity"="hospital"];

  way(
    around:{radius_meters},{latitude},{longitude}
  )["amenity"="hospital"];
);

out center tags;
"""

        try:

            print(
                "OVERPASS SEARCH:",
                latitude,
                longitude,
                "radius=",
                radius_meters,
            )

            async with httpx.AsyncClient(
                timeout=25.0,
                headers=HEADERS,
            ) as client:

                return await (
                    OSMPlacesService._search(
                        client,
                        query,
                    )
                )

        except (
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as exc:

            print(
                "OVERPASS ERROR:",
                type(exc).__name__,
                str(exc),
            )

            return []

        except Exception as exc:

            print(
                "OVERPASS UNEXPECTED ERROR:",
                type(exc).__name__,
                str(exc),
            )

            return []