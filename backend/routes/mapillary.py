from fastapi import APIRouter, HTTPException

from services.mapillary_service import (
    MapillaryService,
)


router = APIRouter(
    prefix="/api/mapillary",
    tags=["Mapillary"],
)


@router.get("/nearby")
async def nearby_mapillary_images(
    latitude: float,
    longitude: float,
    radius: int = 500,
):

    try:

        images = (
            await MapillaryService.nearby_images(
                latitude=latitude,
                longitude=longitude,
                radius_meters=radius,
                limit=20,
            )
        )

        return {
            "status": "success",
            "count": len(images),
            "images": images,
        }

    except Exception as e:

        print(
            "MAPILLARY ROUTE ERROR:",
            type(e).__name__,
            str(e),
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )