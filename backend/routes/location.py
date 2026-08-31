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
from services.location_matching_service import (
    LocationMatchingService,
)
from services.locality_resolver import (
    LocalityResolver,
)


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
    location_request = None

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
        # 2. GROQ ANALYSIS
        # ====================================================

        ai_result = await analyzer.analyze_text(
            request.clue
        )

        print("=" * 60)
        print("AI RESULT")
        print(ai_result)
        print("=" * 60)

        # ====================================================
        # 3. EXTRACT AI INFORMATION
        # ====================================================

        province = ai_result.get("province")
        city = ai_result.get("city")

        # Keep AI hierarchy as hints only.
        ai_town = ai_result.get("town")
        ai_area = ai_result.get("area")
        ai_street = ai_result.get("street")

        place_names = (
            ai_result.get("place_names")
            or []
        )

        landmarks = (
            ai_result.get("landmarks")
            or []
        )

        confidence = ai_result.get(
            "confidence"
        )

        # Final values
        town = None
        area = None
        street = ai_street

        latitude = None
        longitude = None

        spatial_location = None

        ranked_places = []

        # ====================================================
        # 4. BUILD LOCALITY CANDIDATES
        # ====================================================

        locality_names = []

        if ai_town:
            locality_names.append(ai_town)

        if ai_area:
            locality_names.append(ai_area)

        locality_names.extend(
            place_names
        )

        # Remove duplicates
        locality_names = list(
            dict.fromkeys(
                name.strip()
                for name in locality_names
                if isinstance(name, str)
                and name.strip()
            )
        )

        print("=" * 60)
        print("LOCALITY NAMES")
        print(locality_names)
        print("=" * 60)

        # ====================================================
        # 5. SEARCH NISHAAN DATABASE
        # ====================================================

        database_matches = (
            LocationResolver.find_database_matches(
                db=db,
                province=province,
                city=city,
                town=ai_town,
                area=ai_area,
                street=ai_street,
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

            if not ai_town:
                ai_town = best_match.town

            if not ai_area:
                ai_area = best_match.area

            if not street:
                street = best_match.street

        # ====================================================
        # 6. RESOLVE NAMED LOCALITIES USING OSM
        # ====================================================

        resolved_localities = []

        for locality_name in locality_names:

            try:
                results = (
                    await LocalityResolver.resolve(
                        name=locality_name,
                        city=city,
                    )
                )

                for result in results:

                    address = result.get(
                        "address",
                        {}
                    )

                    resolved_localities.append(
                        {
                            "searched_name": locality_name,
                            "display_name": result.get(
                                "display_name"
                            ),
                            "type": result.get(
                                "type"
                            ),
                            "addresstype": result.get(
                                "addresstype"
                            ),
                            "city": (
                                address.get("city")
                                or address.get(
                                    "municipality"
                                )
                            ),
                            "town": (
                                address.get("town")
                                or address.get(
                                    "municipality"
                                )
                            ),
                            "area": (
                                address.get("suburb")
                                or address.get(
                                    "neighbourhood"
                                )
                                or address.get(
                                    "locality"
                                )
                            ),
                            "street": address.get(
                                "road"
                            ),
                        }
                    )

            except Exception as e:

                print(
                    "LOCALITY RESOLUTION ERROR:",
                    locality_name,
                    str(e),
                )

        print("=" * 60)
        print("RESOLVED LOCALITIES")

        for locality in resolved_localities:
            print(locality)

        print("=" * 60)

        # ====================================================
        # 7. APPLY OSM HIERARCHY
        # ====================================================

        # First prefer explicitly returned OSM hierarchy.
        for locality in resolved_localities:

            resolved_city = locality.get(
                "city"
            )

            resolved_town = locality.get(
                "town"
            )

            resolved_area = locality.get(
                "area"
            )

            if (
                resolved_city
                and not city
            ):
                city = resolved_city

            if (
                resolved_town
                and not town
            ):
                town = resolved_town

            if (
                resolved_area
                and not area
            ):
                area = resolved_area

        # ====================================================
        # 8. NOMINATIM STREET / LOCATION SEARCH
        # ====================================================

        if (
            latitude is None
            or longitude is None
        ):

            # Include the strongest locality context.
            geocode_town = town or ai_town
            geocode_area = area or ai_area

            osm_results = (
                await GeocodingService.search(
                    province=province,
                    city=city,
                    town=geocode_town,
                    area=geocode_area,
                    street=street,
                    landmarks=landmarks,
                )
            )

            if osm_results:

                best_osm = osm_results[0]

                osm_latitude = best_osm.get(
                    "lat"
                )

                osm_longitude = best_osm.get(
                    "lon"
                )

                osm_address = best_osm.get(
                    "address",
                    {}
                )

                addresstype = best_osm.get(
                    "addresstype"
                )

                # --------------------------------------------
                # Only accept reasonably precise results
                # --------------------------------------------

                usable_osm_types = {
                    "road",
                    "street",
                    "path",
                    "pedestrian",
                    "residential",
                    "house",
                    "building",
                    "amenity",
                    "shop",
                    "place",
                }

                if (
                    addresstype
                    in usable_osm_types
                ):

                    if osm_latitude is not None:
                        latitude = float(
                            osm_latitude
                        )

                    if osm_longitude is not None:
                        longitude = float(
                            osm_longitude
                        )

                else:

                    print(
                        "OSM RESULT TOO BROAD:",
                        addresstype,
                        best_osm.get(
                            "display_name"
                        ),
                    )

                # --------------------------------------------
                # Geographic hierarchy
                # --------------------------------------------

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

                # Only use these if locality resolver
                # has not already provided them.
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

                print("=" * 60)
                print("OSM GEOCODING RESULT")
                print(best_osm)
                print("=" * 60)

        # ====================================================
        # 9. POSTGIS POINT
        # ====================================================

        if (
            latitude is not None
            and longitude is not None
        ):

            spatial_location = WKTElement(
                f"POINT({longitude} {latitude})",
                srid=4326,
            )

        # ====================================================
        # 10. FIND NEARBY OSM PLACES
        # ====================================================

        if (
            latitude is not None
            and longitude is not None
        ):

            osm_places = (
                await OSMPlacesService.nearby_places(
                    latitude=latitude,
                    longitude=longitude,
                    radius_meters=500,
                )
            )

            print("=" * 60)
            print(
                "OSM NEARBY PLACES:",
                len(osm_places),
            )
            print("=" * 60)

            # =================================================
            # 11. RANK SUPPORTING LANDMARKS
            # =================================================

            ranked_places = (
                LocationMatchingService.rank_places(
                    places=osm_places,
                    anchor_latitude=latitude,
                    anchor_longitude=longitude,
                    city=city,
                    street=street,
                    landmarks=landmarks,
                )
            )

            print("=" * 60)
            print("RANKED LOCATION EVIDENCE")

            for place in ranked_places[:5]:

                print(
                    place["score"],
                    place["name"],
                    place["distance_meters"],
                    place["reasons"],
                )

            print("=" * 60)

        # ====================================================
        # 12. SAVE RESULT
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
        # 13. FINAL RESPONSE
        # ====================================================

        return LocationResponse(
            status="success",

            province=province,
            city=city,
            town=town,
            area=area,
            street=street,

            place_names=place_names,

            landmarks=landmarks,

            latitude=latitude,
            longitude=longitude,

            confidence=confidence,
        )

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        print("=" * 60)
        print("LOCATION ANALYSIS ERROR")
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