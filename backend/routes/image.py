from datetime import datetime, timedelta

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
)

from sqlalchemy.orm import Session

from database.connection import get_db

from models.database import LocationRequestDB

from services.ai.location_analyzer import LocationAnalyzer
from services.exif_service import ExifService
from services.geoclip_service import GeoCLIPService


router = APIRouter(
    prefix="/api/analyze",
    tags=["Image Analysis"],
)


analyzer = LocationAnalyzer()


ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}


@router.post("/image")
async def analyze_image(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload an image and analyze it with:

    1. Groq Vision
    2. EXIF GPS
    3. GeoCLIP image geolocation

    GeoCLIP provides candidate coordinates.
    EXIF GPS takes priority when available.
    """

    try:

        # ====================================================
        # 1. CHECK IMAGE TYPE
        # ====================================================

        if image.content_type not in ALLOWED_IMAGE_TYPES:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported image type. "
                    "Please use JPEG, PNG, WEBP, or GIF."
                ),
            )


        # ====================================================
        # 2. READ IMAGE
        # ====================================================

        image_bytes = await image.read()

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Image file is empty.",
            )


        # ====================================================
        # 3. CHECK IMAGE SIZE
        # ====================================================

        max_size = 20 * 1024 * 1024

        if len(image_bytes) > max_size:

            raise HTTPException(
                status_code=400,
                detail="Image must be smaller than 20 MB.",
            )


        # ====================================================
        # 4. SAVE REQUEST
        # ====================================================

        now = datetime.utcnow()

        location_request = LocationRequestDB(
            input_type="image",
            input_text=None,
            file_path=image.filename,
            created_at=now,
            expires_at=now + timedelta(hours=2),
        )

        db.add(location_request)
        db.commit()
        db.refresh(location_request)


        # ====================================================
        # 5. GROQ VISION
        # ====================================================

        vision_result = await analyzer.analyze_image(
            image_bytes=image_bytes,
            content_type=image.content_type,
        )

        print("=" * 60)
        print("IMAGE AI RESULT")
        print(vision_result)
        print("=" * 60)


        # ====================================================
        # 6. EXIF GPS
        # ====================================================

        exif_location = ExifService.extract_gps(
            image_bytes
        )

        latitude = None
        longitude = None

        if exif_location:

            latitude = exif_location["latitude"]
            longitude = exif_location["longitude"]

            print("=" * 60)
            print("EXIF GPS FOUND")
            print("Latitude:", latitude)
            print("Longitude:", longitude)
            print("=" * 60)

        else:

            print("=" * 60)
            print("NO EXIF GPS FOUND")
            print("=" * 60)


        # ====================================================
        # 7. GEOCLIP
        # ====================================================

        geoclip_predictions = []

        try:

            geoclip_predictions = (
                GeoCLIPService.predict(
                    image_bytes=image_bytes,
                    filename=image.filename or "image.jpg",
                    top_k=5,
                )
            )

            print("=" * 60)
            print("GEOCLIP PREDICTIONS")
            print(geoclip_predictions)
            print("=" * 60)

        except Exception as geoclip_error:

            # GeoCLIP is an additional signal.
            # Do not fail the entire image request if it fails.

            print("=" * 60)
            print("GEOCLIP ERROR")
            print(
                type(geoclip_error).__name__
            )
            print(
                str(geoclip_error)
            )
            print("=" * 60)


        # ====================================================
        # 8. CHOOSE PRIMARY COORDINATES
        # ====================================================

        gps_source = None

        if latitude is not None and longitude is not None:

            gps_source = "exif"

        elif geoclip_predictions:

            best_prediction = (
                geoclip_predictions[0]
            )

            latitude = best_prediction[
                "latitude"
            ]

            longitude = best_prediction[
                "longitude"
            ]

            gps_source = "geoclip"


        # ====================================================
        # 9. RETURN RESULT
        # ====================================================

        return {

            "status": "success",

            "request_id": location_request.id,

            "filename": image.filename,

            # ------------------------------------------------
            # AI visual analysis
            # ------------------------------------------------

            "province": vision_result.get(
                "province"
            ),

            "city": vision_result.get(
                "city"
            ),

            "town": vision_result.get(
                "town"
            ),

            "area": vision_result.get(
                "area"
            ),

            "street": vision_result.get(
                "street"
            ),

            "landmarks": vision_result.get(
                "landmarks",
                [],
            ),

            "visible_text": vision_result.get(
                "visible_text",
                [],
            ),

            "visual_clues": vision_result.get(
                "visual_clues",
                [],
            ),

            "description": vision_result.get(
                "description",
                "",
            ),

            "confidence": vision_result.get(
                "confidence",
                0,
            ),

            # ------------------------------------------------
            # Coordinates
            # ------------------------------------------------

            "latitude": latitude,

            "longitude": longitude,

            "gps_source": gps_source,

            # ------------------------------------------------
            # GeoCLIP candidates
            # ------------------------------------------------

            "geoclip_predictions": (
                geoclip_predictions
            ),
        }


    except HTTPException:
        raise


    except Exception as e:

        db.rollback()

        print("=" * 60)
        print("IMAGE ANALYSIS ERROR")
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        print("=" * 60)

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )