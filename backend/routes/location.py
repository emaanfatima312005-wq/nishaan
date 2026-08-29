from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement

from database.connection import get_db

from models.database import (
    LocationRequestDB,
    LocationResultDB,
)

from models.location import (
    LocationRequest,
    LocationResponse,
)

from services.ai.location_analyzer import LocationAnalyzer
from services.location_resolver import LocationResolver
from services.geocoding_service import GeocodingService
from services.osm_places_service import OSMPlacesService
from services.candidate_ranking_service import CandidateRankingService


router = APIRouter(
    prefix="/api/location",
    tags=["Location"],
)


analyzer = LocationAnalyzer()


@router.post(
    "/analyze",
    response_model=LocationResponse,
)
async def analyze_location(
    request: LocationRequest,
    db: Session = Depends(get_db),
):

    try:
        # ====================================================
        # 1. SAVE USER REQUEST
        # ====================================================

        now = datetime.utcnow()

        location_request = LocationRequestDB(
            input_type="text",
            input_text=request.clue,
            created_at=now,
            expires_at=now + timedelta(hours=2),
        )

        db.add(location_request)
        db.commit()
        db.refresh(location_request)

        # ====================================================
        # 2. SEND CLUE TO GROQ
        # ====================================================

        ai_result = await analyzer.analyze_text(
            request.clue
        )

        print("=" * 60)
        print("AI RESULT")
        print(ai_result)
        print("=" * 60)

        # ====================================================
        # 3. GET AI-EXTRACTED INFORMATION
        # ====================================================

        province = ai_result.get("province")
        city = ai_result.get("city")
        town = ai_result.get("town")
        area = ai_result.get("area")
        street = ai_result.get("street")

        landmarks = ai_result.get(
            "landmarks"
        ) or []

        confidence = ai_result.get(
            "confidence"
        )

        latitude = None
        longitude = None
        spatial_location = None

        ranked_candidates = []

        # ====================================================
        # 4. SEARCH NISHAAN DATABASE
        # ====================================================

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

            # Fill missing information from database
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

            # Create PostGIS point
            if (
                latitude is not None
                and longitude is not None
            ):

                spatial_location = WKTElement(
                    f"POINT({longitude} {latitude})",
                    srid=4326,
                )

        # ====================================================
        # 5. FALL BACK TO NOMINATIM
        # ====================================================

        if (
            latitude is None
            or longitude is None
        ):

            osm_results = await GeocodingService.search(
                province=province,
                city=city,
                town=town,
                area=area,
                street=street,
                landmarks=landmarks,
            )

            if osm_results:

                best_osm = osm_results[0]

                # ------------------------------------------------
                # Coordinates
                # ------------------------------------------------

                osm_latitude = best_osm.get(
                    "lat"
                )

                osm_longitude = best_osm.get(
                    "lon"
                )

                if osm_latitude is not None:
                    latitude = float(
                        osm_latitude
                    )

                if osm_longitude is not None:
                    longitude = float(
                        osm_longitude
                    )

                # ------------------------------------------------
                # Address information
                # ------------------------------------------------

                osm_address = (
                    best_osm.get(
                        "address",
                        {}
                    )
                )

                if not province:
                    province = (
                        osm_address.get(
                            "state"
                        )
                        or osm_address.get(
                            "state_district"
                        )
                    )

                if not city:
                    city = (
                        osm_address.get(
                            "city"
                        )
                        or osm_address.get(
                            "municipality"
                        )
                        or osm_address.get(
                            "county"
                        )
                    )

                if not town:
                    town = (
                        osm_address.get(
                            "town"
                        )
                        or osm_address.get(
                            "village"
                        )
                    )

                if not area:
                    area = (
                        osm_address.get(
                            "suburb"
                        )
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

                # ------------------------------------------------
                # PostGIS point
                # ------------------------------------------------

                if (
                    latitude is not None
                    and longitude is not None
                ):

                    spatial_location = WKTElement(
                        f"POINT({longitude} {latitude})",
                        srid=4326,
                    )

                print("=" * 60)
                print("OSM GEOCODING RESULT")
                print(best_osm)
                print("=" * 60)

        # ====================================================
        # 6. FIND NEARBY OSM PLACES
        # ====================================================

        if (
            latitude is not None
            and longitude is not None
        ):

            osm_places = (
                await OSMPlacesService.nearby_places(
                    latitude=latitude,
                    longitude=longitude,
                    radius_meters=1000,
                )
            )

            print("=" * 60)
            print(
                "OSM NEARBY PLACES:",
                len(osm_places),
            )
            print("=" * 60)

            # =================================================
            # 7. RANK CANDIDATES
            # =================================================

            ranked_candidates = (
                CandidateRankingService.rank_candidates(
                    candidates=osm_places,
                    latitude=latitude,
                    longitude=longitude,
                    city=city,
                    street=street,
                    landmarks=landmarks,
                )
            )

            print("=" * 60)
            print("TOP LOCATION CANDIDATES")

            for candidate in ranked_candidates[:5]:

                print(
                    candidate["score"],
                    candidate["name"],
                    candidate["distance_meters"],
                    candidate["reasons"],
                )

            print("=" * 60)

        # ====================================================
        # 8. SAVE LOCATION RESULT
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
        # 9. RETURN FINAL RESULT
        # ====================================================

        return LocationResponse(
            status="success",

            province=province,
            city=city,
            town=town,
            area=area,
            street=street,

            latitude=latitude,
            longitude=longitude,

            confidence=confidence,
        )

    except Exception as e:

        db.rollback()

        print("=" * 60)
        print("LOCATION ANALYSIS ERROR")
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        print("=" * 60)

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze location.",
        )