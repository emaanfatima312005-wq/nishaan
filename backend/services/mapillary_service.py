import os
from typing import Any

import httpx
from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

MAPILLARY_ACCESS_TOKEN = os.getenv(
    "MAPILLARY_ACCESS_TOKEN"
)

MAPILLARY_IMAGES_URL = (
    "https://graph.mapillary.com/images"
)

HEADERS = {
    "User-Agent": "Nishaan/1.0"
}


# ============================================================
# MAPILLARY SERVICE
# ============================================================

class MapillaryService:

    @staticmethod
    def _get_token() -> str:

        if not MAPILLARY_ACCESS_TOKEN:

            raise RuntimeError(
                "MAPILLARY_ACCESS_TOKEN is not set "
                "in backend/.env"
            )

        return MAPILLARY_ACCESS_TOKEN


    @staticmethod
    async def nearby_images(
        latitude: float,
        longitude: float,
        radius_meters: int = 500,
        limit: int = 20,
    ) -> list[dict[str, Any]]:
        """
        Find Mapillary street-level images around a
        coordinate.

        Returns image metadata and coordinates.
        """

        token = (
            MapillaryService._get_token()
        )

        # Approximate bounding box around the point.
        #
        # 1 degree latitude is approximately 111 km.
        # Longitude changes with latitude.

        lat_delta = (
            radius_meters / 111_000
        )

        import math

        lon_delta = (
            radius_meters
            / (
                111_000
                * max(
                    math.cos(
                        math.radians(latitude)
                    ),
                    0.01,
                )
            )
        )

        min_lon = longitude - lon_delta
        min_lat = latitude - lat_delta
        max_lon = longitude + lon_delta
        max_lat = latitude + lat_delta

        params = {
            "access_token": token,

            "bbox": (
                f"{min_lon},"
                f"{min_lat},"
                f"{max_lon},"
                f"{max_lat}"
            ),

            "fields": (
                "id,"
                "computed_geometry,"
                "thumb_1024_url,"
                "captured_at,"
                "sequence"
            ),

            "limit": min(
                max(limit, 1),
                50,
            ),
        }

        try:

            async with httpx.AsyncClient(
                timeout=20.0,
                headers=HEADERS,
            ) as client:

                response = await client.get(
                    MAPILLARY_IMAGES_URL,
                    params=params,
                )

                response.raise_for_status()

                data = response.json()

        except httpx.HTTPStatusError as e:

            print(
                "MAPILLARY HTTP ERROR:",
                e.response.status_code,
                e.response.text,
            )

            raise

        except httpx.RequestError as e:

            print(
                "MAPILLARY CONNECTION ERROR:",
                str(e),
            )

            raise

        images = data.get(
            "data",
            []
        )

        results = []

        for image in images:

            geometry = image.get(
                "computed_geometry"
            )

            coordinates = (
                geometry.get("coordinates")
                if geometry
                else None
            )

            if not coordinates:
                continue

            results.append(
                {
                    "id": image.get("id"),

                    "longitude": float(
                        coordinates[0]
                    ),

                    "latitude": float(
                        coordinates[1]
                    ),

                    "thumbnail_url": image.get(
                        "thumb_1024_url"
                    ),

                    "captured_at": image.get(
                        "captured_at"
                    ),

                    "sequence": image.get(
                        "sequence"
                    ),
                }
            )

        return results