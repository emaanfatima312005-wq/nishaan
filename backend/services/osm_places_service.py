<<<<<<< HEAD
import httpx


OVERPASS_URL = "https://overpass-api.de/api/interpreter"

HEADERS = {
    "User-Agent": "Nishaan/1.0 (AI location research project)"
}


class OSMPlacesService:

=======
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

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
    @staticmethod
    async def _search(
        client: httpx.AsyncClient,
        query: str,
<<<<<<< HEAD
    ):
=======
    ) -> list[dict[str, Any]]:

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        response = await client.post(
            OVERPASS_URL,
            data=query,
        )

        response.raise_for_status()

<<<<<<< HEAD
        return response.json().get(
            "elements",
            []
        )

=======
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

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
    @staticmethod
    async def nearby_places(
        latitude: float,
        longitude: float,
        radius_meters: int = 500,
<<<<<<< HEAD
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
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            750,
        )

        query = f"""
<<<<<<< HEAD
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

=======
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

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            async with httpx.AsyncClient(
                timeout=25.0,
                headers=HEADERS,
            ) as client:

<<<<<<< HEAD
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
=======
                return await (
                    OSMPlacesService._search(
                        client,
                        query,
                    )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                )

        except (
            httpx.TimeoutException,
            httpx.HTTPStatusError,
<<<<<<< HEAD
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
=======
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
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            )

            return []