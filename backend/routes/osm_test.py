from fastapi import APIRouter, HTTPException

from services.osm_places_service import OSMPlacesService


router = APIRouter(
    prefix="/api/osm",
    tags=["OSM Test"],
)


@router.get("/nearby")
async def nearby_places(
    latitude: float,
    longitude: float,
    radius: int = 1000,
):
    try:

        places = await OSMPlacesService.nearby_places(
            latitude=latitude,
            longitude=longitude,
            radius_meters=radius,
        )

        return {
            "status": "success",
            "count": len(places),
            "places": places,
        }

    except Exception as e:

        print("OSM ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )