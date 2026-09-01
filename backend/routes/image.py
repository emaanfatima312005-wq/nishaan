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
from services.streetclip_service import StreetCLIPService
from services.location_candidate_service import (
    LocationCandidateService,
)


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
    Analyze an uploaded image using:

    1. Groq Vision
    2. EXIF GPS
    3. GeoCLIP
    4. StreetCLIP
    5. Location Candidate Resolver

    EXIF GPS is trusted when available.

    Otherwise, model predictions are treated as evidence and
    passed through the candidate resolver rather than being
    blindly accepted as the final destination.
    """

    location_request = None

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
        # 6. INITIALIZE
        # ====================================================

        latitude = None
        longitude = None

        gps_source = None

        # ====================================================
        # 7. EXIF GPS
        # ====================================================

        try:

            exif_location = (
                ExifService.extract_gps(
                    image_bytes
                )
            )

            if exif_location:

                latitude = exif_location[
                    "latitude"
                ]

                longitude = exif_location[
                    "longitude"
                ]

                gps_source = "exif"

                print("=" * 60)
                print("EXIF GPS FOUND")
                print(
                    "Latitude:",
                    latitude,
                )
                print(
                    "Longitude:",
                    longitude,
                )
                print("=" * 60)

            else:

                print("=" * 60)
                print("NO EXIF GPS FOUND")
                print("=" * 60)

        except Exception as exif_error:

            print("=" * 60)
            print("EXIF ERROR")
            print(
                "ERROR TYPE:",
                type(exif_error).__name__,
            )
            print(
                "ERROR:",
                str(exif_error),
            )
            print("=" * 60)

        # ====================================================
        # 8. STREETCLIP
        # ====================================================

        streetclip_country = []
        streetclip_region = []
        streetclip_city = []

        try:

            streetclip_country = (
                StreetCLIPService.classify_country(
                    image_bytes
                )
            )

            streetclip_region = (
                StreetCLIPService.classify_pakistan_region(
                    image_bytes
                )
            )

            streetclip_city = (
                StreetCLIPService.classify_pakistan_city(
                    image_bytes
                )
            )

            print("=" * 60)
            print("STREETCLIP COUNTRY")
            print(
                streetclip_country
            )

            print("STREETCLIP REGION")
            print(
                streetclip_region
            )

            print("STREETCLIP CITY")
            print(
                streetclip_city
            )
            print("=" * 60)

        except Exception as streetclip_error:

            print("=" * 60)
            print("STREETCLIP ERROR")
            print(
                "ERROR TYPE:",
                type(streetclip_error).__name__,
            )
            print(
                "ERROR:",
                str(streetclip_error),
            )
            print("=" * 60)

        # ====================================================
        # 9. GEOCLIP
        # ====================================================

        geoclip_predictions = []

        try:

            geoclip_predictions = (
                GeoCLIPService.predict(
                    image_bytes=image_bytes,
                    filename=(
                        image.filename
                        or "image.jpg"
                    ),
                    top_k=5,
                )
            )

            print("=" * 60)
            print("GEOCLIP PREDICTIONS")
            print(
                geoclip_predictions
            )
            print("=" * 60)

        except Exception as geoclip_error:

            print("=" * 60)
            print("GEOCLIP ERROR")
            print(
                "ERROR TYPE:",
                type(geoclip_error).__name__,
            )
            print(
                "ERROR:",
                str(geoclip_error),
            )
            print("=" * 60)

        # ====================================================
        # 10. GEOCLIP BEST CANDIDATE
        # ====================================================

        geoclip_coordinates = None

        if geoclip_predictions:

            best_prediction = (
                geoclip_predictions[0]
            )

            geoclip_coordinates = {
                "latitude": (
                    best_prediction.get(
                        "latitude"
                    )
                ),
                "longitude": (
                    best_prediction.get(
                        "longitude"
                    )
                ),
                "probability": (
                    best_prediction.get(
                        "probability",
                        0,
                    )
                ),
            }

        # ====================================================
        # 11. FINAL LOCATION RESOLUTION
        # ====================================================

        final_location = None

        try:

            final_location = (
                await LocationCandidateService.resolve_image(
                    vision_result=vision_result,
                    geoclip_predictions=(
                        geoclip_predictions
                    ),
                    streetclip={
                        "country": (
                            streetclip_country
                        ),
                        "region": (
                            streetclip_region
                        ),
                        "city": (
                            streetclip_city
                        ),
                    },
                )
            )

            print("=" * 60)
            print("FINAL LOCATION RESOLUTION")
            print(
                final_location
            )
            print("=" * 60)

        except Exception as resolver_error:

            print("=" * 60)
            print("LOCATION CANDIDATE ERROR")
            print(
                "ERROR TYPE:",
                type(resolver_error).__name__,
            )
            print(
                "ERROR:",
                str(resolver_error),
            )
            print("=" * 60)

        # ====================================================
        # 12. CHOOSE FINAL COORDINATES
        # ====================================================

        # EXIF always wins because it is actual metadata
        # attached to the photograph.

        if (
            latitude is not None
            and longitude is not None
        ):

            gps_source = "exif"

        elif final_location:

            resolved_latitude = (
                final_location.get(
                    "latitude"
                )
            )

            resolved_longitude = (
                final_location.get(
                    "longitude"
                )
            )

            if (
                resolved_latitude is not None
                and resolved_longitude is not None
            ):

                latitude = (
                    resolved_latitude
                )

                longitude = (
                    resolved_longitude
                )

                gps_source = (
                    "candidate_resolver"
                )

        # ====================================================
        # 13. FINAL LOCATION FIELDS
        # ====================================================

        final_province = (
            final_location.get(
                "province"
            )
            if final_location
            else vision_result.get(
                "province"
            )
        )

        final_city = (
            final_location.get(
                "city"
            )
            if final_location
            else vision_result.get(
                "city"
            )
        )

        final_town = (
            final_location.get(
                "town"
            )
            if final_location
            else vision_result.get(
                "town"
            )
        )

        final_area = (
            final_location.get(
                "area"
            )
            if final_location
            else vision_result.get(
                "area"
            )
        )

        final_street = (
            final_location.get(
                "street"
            )
            if final_location
            else vision_result.get(
                "street"
            )
        )

        final_house_number = (
            final_location.get(
                "house_number"
            )
            if final_location
            else vision_result.get(
                "house_number"
            )
        )

        final_confidence = (
            final_location.get(
                "confidence"
            )
            if final_location
            else vision_result.get(
                "confidence",
                0,
            )
        )

        # ====================================================
        # 14. RETURN FINAL RESULT
        # ====================================================

        return {

            "status": "success",

            "request_id": (
                location_request.id
            ),

            "filename": image.filename,

            # =================================================
            # FINAL LOCATION
            # =================================================

            "province": final_province,

            "city": final_city,

            "town": final_town,

            "area": final_area,

            "street": final_street,

            "house_number": final_house_number,

            "latitude": latitude,

            "longitude": longitude,

            "gps_source": gps_source,

            "confidence": final_confidence,

            # =================================================
            # USER / IMAGE EVIDENCE
            # =================================================

            "place_names": (
                vision_result.get(
                    "place_names",
                    [],
                )
            ),

            "landmarks": (
                vision_result.get(
                    "landmarks",
                    [],
                )
            ),

            "visible_text": (
                vision_result.get(
                    "visible_text",
                    [],
                )
            ),

            "visual_clues": (
                vision_result.get(
                    "visual_clues",
                    [],
                )
            ),

            "description": (
                vision_result.get(
                    "description",
                    "",
                )
            ),

            # =================================================
            # FINAL RESOLVER
            # =================================================

            "final_location": (
                final_location
            ),

            # =================================================
            # GEOCLIP
            # =================================================

            "geoclip_coordinates": (
                geoclip_coordinates
            ),

            "geoclip_predictions": (
                geoclip_predictions
            ),

            # =================================================
            # STREETCLIP
            # =================================================

            "streetclip": {

                "country": (
                    streetclip_country
                ),

                "region": (
                    streetclip_region
                ),

                "city": (
                    streetclip_city
                ),
            },
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        print("=" * 60)
        print("IMAGE ANALYSIS ERROR")
        print(
            "ERROR TYPE:",
            type(e).__name__,
        )
        print(
            "ERROR:",
            str(e),
        )
        print("=" * 60)

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )