from datetime import datetime, timedelta

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement

from database.connection import get_db

from models.database import (
    LocationRequestDB,
    LocationResultDB,
)

from services.ai.location_analyzer import LocationAnalyzer
from services.location_resolver import LocationResolver
from services.geocoding_service import GeocodingService
from services.exif_service import ExifService


router = APIRouter(
    prefix="/api/analyze",
    tags=["Combined Analysis"],
)


analyzer = LocationAnalyzer()


@router.post("/combined")
async def analyze_combined(
    text: str | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    """
    Combine text and image evidence into one location analysis.
    """

    if not text and not image:
        raise HTTPException(
            status_code=400,
            detail="Provide text, image, or both.",
        )

    try:

        # ====================================================
        # 1. SAVE REQUEST
        # ====================================================

        now = datetime.utcnow()

        location_request = LocationRequestDB(
            input_type="combined",
            input_text=text,
            file_path=(
                image.filename
                if image
                else None
            ),
            created_at=now,
            expires_at=now + timedelta(hours=2),
        )

        db.add(location_request)
        db.commit()
        db.refresh(location_request)


        # ====================================================
        # 2. TEXT ANALYSIS
        # ====================================================

        text_result = None

        if text and text.strip():

            text_result = await analyzer.analyze_text(
                text.strip()
            )

            print("COMBINED TEXT RESULT:")
            print(text_result)


        # ====================================================
        # 3. IMAGE ANALYSIS
        # ====================================================

        image_result = None
        image_bytes = None
        exif_location = None

        if image:

            image_bytes = await image.read()

            if not image_bytes:
                raise HTTPException(
                    status_code=400,
                    detail="Image file is empty.",
                )

            if image.content_type not in {
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
            }:

                raise HTTPException(
                    status_code=400,
                    detail="Unsupported image type.",
                )

            image_result = await analyzer.analyze_image(
                image_bytes=image_bytes,
                content_type=image.content_type,
            )

            exif_location = (
                ExifService.extract_gps(
                    image_bytes
                )
            )

            print("COMBINED IMAGE RESULT:")
            print(image_result)

            if exif_location:
                print(
                    "COMBINED EXIF GPS:",
                    exif_location,
                )


        # ====================================================
        # 4. MERGE AI EVIDENCE
        # ====================================================

        def get_text_value(key):
            if text_result:
                return text_result.get(key)
            return None


        def get_image_value(key):
            if image_result:
                return image_result.get(key)
            return None


        province = (
            get_text_value("province")
            or get_image_value("province")
        )

        city = (
            get_text_value("city")
            or get_image_value("city")
        )

        town = (
            get_text_value("town")
            or get_image_value("town")
        )

        area = (
            get_text_value("area")
            or get_image_value("area")
        )

        street = (
            get_text_value("street")
            or get_image_value("street")
        )


        text_landmarks = (
            get_text_value("landmarks")
            or []
        )

        image_landmarks = (
            get_image_value("landmarks")
            or []
        )

        landmarks = list(
            dict.fromkeys(
                text_landmarks
                + image_landmarks
            )
        )


        visible_text = (
            get_image_value("visible_text")
            or []
        )

        visual_clues = (
            get_image_value("visual_clues")
            or []
        )


        # ====================================================
        # 5. COORDINATES
        # ====================================================

        latitude = None
        longitude = None
        spatial_location = None

        gps_source = None


        # EXIF GPS has highest priority.

        if exif_location:

            latitude = exif_location[
                "latitude"
            ]

            longitude = exif_location[
                "longitude"
            ]

            gps_source = "exif"


        # ====================================================
        # 6. SEARCH OUR DATABASE
        # ====================================================

        if latitude is None:

            database_matches = (
                LocationResolver.find_database_matches(
                    db=db,
                    province=province,
                    city=city,
                    town=town,
                    area=area,
                    street=street,
                    landmarks=landmarks,
                )
            )

            if database_matches:

                best_match = database_matches[0]

                latitude = best_match.latitude
                longitude = best_match.longitude

                if not province:
                    province = best_match.province

                if not city:
                    city = best_match.city

                if not town:
                    town = best_match.town

                if not area:
                    area = best_match.area

                if not street:
                    street = best_match.street

                gps_source = "database"


        # ====================================================
        # 7. FALL BACK TO OSM
        # ====================================================

        if latitude is None:

            osm_results = (
                await GeocodingService.search(
                    province=province,
                    city=city,
                    town=town,
                    area=area,
                    street=street,
                    landmarks=landmarks,
                )
            )

            if osm_results:

                best_osm = osm_results[0]

                latitude = float(
                    best_osm["lat"]
                )

                longitude = float(
                    best_osm["lon"]
                )

                osm_address = (
                    best_osm.get(
                        "address",
                        {}
                    )
                )

                if not province:
                    province = (
                        osm_address.get("state")
                        or osm_address.get(
                            "state_district"
                        )
                    )

                if not city:
                    city = (
                        osm_address.get("city")
                        or osm_address.get(
                            "municipality"
                        )
                        or osm_address.get(
                            "county"
                        )
                    )

                if not town:
                    town = (
                        osm_address.get("town")
                        or osm_address.get("village")
                    )

                if not area:
                    area = (
                        osm_address.get("suburb")
                        or osm_address.get(
                            "neighbourhood"
                        )
                        or osm_address.get(
                            "locality"
                        )
                    )

                if not street:
                    street = osm_address.get(
                        "road"
                    )

                gps_source = "osm"


        # ====================================================
        # 8. CREATE POSTGIS POINT
        # ====================================================

        if latitude is not None and longitude is not None:

            spatial_location = WKTElement(
                f"POINT({longitude} {latitude})",
                srid=4326,
            )


        # ====================================================
        # 9. CALCULATE COMBINED CONFIDENCE
        # ====================================================

        text_confidence = (
            get_text_value("confidence")
            or 0
        )

        image_confidence = (
            get_image_value("confidence")
            or 0
        )

        if text_result and image_result:

            confidence = round(
                (text_confidence * 0.6)
                + (image_confidence * 0.4)
            )

        elif text_result:

            confidence = text_confidence

        else:

            confidence = image_confidence


        # ====================================================
        # 10. SAVE LOCATION RESULT
        # ====================================================

        location_result = LocationResultDB(
            request_id=location_request.id,

            province=province,
            city=city,
            town=town,
            area=area,
            street=street,

            latitude=latitude,
            longitude=longitude,

            location=spatial_location,

            confidence=confidence,
        )

        db.add(location_result)
        db.commit()
        db.refresh(location_result)


        # ====================================================
        # 11. RETURN UNIFIED RESULT
        # ====================================================

        return {
            "status": "success",

            "request_id": location_request.id,

            "location": {
                "province": province,
                "city": city,
                "town": town,
                "area": area,
                "street": street,
            },

            "coordinates": {
                "latitude": latitude,
                "longitude": longitude,
            },

            "confidence": confidence,

            "gps_source": gps_source,

            "landmarks": landmarks,

            "visible_text": visible_text,

            "visual_clues": visual_clues,

            "text_analysis": text_result,

            "image_analysis": image_result,
        }


    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        print("=" * 60)
        print("COMBINED ANALYSIS ERROR")
        print(type(e).__name__)
        print(str(e))
        print("=" * 60)

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )