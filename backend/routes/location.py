from fastapi import APIRouter

from models.location import LocationRequest, LocationResponse


router = APIRouter(
    prefix="/api/location",
    tags=["Location"]
)


@router.post("/analyze", response_model=LocationResponse)
async def analyze_location(request: LocationRequest):

    print("Received clue:")
    print(request.clue)

    # TEMPORARY DATA
    # Later this will come from our AI + geocoding pipeline.

    return LocationResponse(
        status="success",
        province="Punjab",
        city="Rawalpindi",
        town="Rawalpindi",
        area="Saddar",
        street="Bank Road",
        latitude=33.6007,
        longitude=73.0679,
        confidence=92,
    )