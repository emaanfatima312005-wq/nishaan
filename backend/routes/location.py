from datetime import datetime, timedelta

<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
=======
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
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

<<<<<<< HEAD
from services.ai.location_analyzer import LocationAnalyzer
from services.location_resolver import LocationResolver
from services.geocoding_service import GeocodingService
from services.osm_places_service import OSMPlacesService
from services.location_matching_service import (
    LocationMatchingService,
)
=======
from services.ai.location_analyzer import (
    LocationAnalyzer,
)

from services.location_resolver import (
    LocationResolver,
)

from services.geocoding_service import (
    GeocodingService,
)

from services.osm_places_service import (
    OSMPlacesService,
)

from services.location_matching_service import (
    LocationMatchingService,
)

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
from services.locality_resolver import (
    LocalityResolver,
)


<<<<<<< HEAD
=======
# ============================================================
# ROUTER
# ============================================================

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
router = APIRouter(
    prefix="/api/location",
    tags=["Location"],
)

<<<<<<< HEAD
analyzer = LocationAnalyzer()


=======

analyzer = LocationAnalyzer()


# ============================================================
# TEXT LOCATION ANALYSIS
# ============================================================

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
@router.post(
    "/analyze",
    response_model=LocationResponse,
)
async def analyze_location(
    request: LocationRequest,
    db: Session = Depends(get_db),
):
<<<<<<< HEAD
    location_request = None

    try:
        # ====================================================
        # 1. SAVE USER REQUEST
=======
    """
    Analyze a text location clue.

    Pipeline:

        User clue
            ↓
        Groq location extraction
            ↓
        Locality resolution
            ↓
        OSM verification
            ↓
        Nearby landmark evidence
            ↓
        Database save
            ↓
        Structured response
    """

    location_request = None

    try:

        # ====================================================
        # 1. VALIDATE INPUT
        # ====================================================

        if (
            not request.clue
            or not request.clue.strip()
        ):

            raise HTTPException(
                status_code=400,
                detail="Location clue cannot be empty.",
            )

        clue = request.clue.strip()

        # ====================================================
        # 2. SAVE USER REQUEST
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        # ====================================================

        now = datetime.utcnow()

        location_request = LocationRequestDB(
            input_type="text",
<<<<<<< HEAD
            input_text=request.clue,
=======
            input_text=clue,
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            created_at=now,
            expires_at=now + timedelta(hours=2),
        )

<<<<<<< HEAD
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

        ai_town = ai_result.get("town")
        ai_area = ai_result.get("area")
        ai_street = ai_result.get("street")
=======
        db.add(
            location_request
        )

        db.commit()

        db.refresh(
            location_request
        )

        # ====================================================
        # 3. AI ANALYSIS
        # ====================================================

        ai_result = await (
            analyzer.analyze_text(
                clue
            )
        )

        print(
            "=" * 60
        )
        print(
            "AI RESULT"
        )
        print(
            ai_result
        )
        print(
            "=" * 60
        )

        if not ai_result:

            raise HTTPException(
                status_code=500,
                detail="Location AI returned no result.",
            )

        # ====================================================
        # 4. EXTRACT AI INFORMATION
        # ====================================================

        province = ai_result.get(
            "province"
        )

        city = ai_result.get(
            "city"
        )

        ai_town = ai_result.get(
            "town"
        )

        ai_area = ai_result.get(
            "area"
        )

        ai_street = ai_result.get(
            "street"
        )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

        house_number = ai_result.get(
            "house_number"
        )

        place_names = (
<<<<<<< HEAD
            ai_result.get("place_names")
=======
            ai_result.get(
                "place_names"
            )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            or []
        )

        landmarks = (
<<<<<<< HEAD
            ai_result.get("landmarks")
=======
            ai_result.get(
                "landmarks"
            )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            or []
        )

        confidence = ai_result.get(
<<<<<<< HEAD
            "confidence"
        )

        # Final values
=======
            "confidence",
            0,
        )

        if not isinstance(
            place_names,
            list,
        ):
            place_names = []

        if not isinstance(
            landmarks,
            list,
        ):
            landmarks = []

        place_names = [
            str(
                value
            ).strip()
            for value in place_names
            if str(
                value
            ).strip()
        ]

        landmarks = [
            str(
                value
            ).strip()
            for value in landmarks
            if str(
                value
            ).strip()
        ]

        # Remove duplicates.
        place_names = list(
            dict.fromkeys(
                place_names
            )
        )

        landmarks = list(
            dict.fromkeys(
                landmarks
            )
        )

        # ====================================================
        # 5. INITIAL VALUES
        # ====================================================

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        town = None
        area = None
        street = ai_street

        latitude = None
        longitude = None

        spatial_location = None

        ranked_places = []

        # ====================================================
<<<<<<< HEAD
        # 4. BUILD LOCALITY CANDIDATES
=======
        # 6. INTERNAL DATABASE MATCH
        # ====================================================

        try:

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

        except Exception as exc:

            print(
                "DATABASE LOCATION MATCH ERROR:",
                type(exc).__name__,
                str(exc),
            )

            database_matches = []

        if database_matches:

            best_match = (
                database_matches[0]
            )

            latitude = (
                best_match.latitude
            )

            longitude = (
                best_match.longitude
            )

            if not province:
                province = (
                    best_match.province
                )

            if not city:
                city = (
                    best_match.city
                )

            if not ai_town:
                ai_town = (
                    best_match.town
                )

            if not ai_area:
                ai_area = (
                    best_match.area
                )

            if not street:
                street = (
                    best_match.street
                )

        # ====================================================
        # 7. BUILD LOCALITY NAMES
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        # ====================================================

        locality_names = []

        if ai_town:
<<<<<<< HEAD
            locality_names.append(ai_town)

        if ai_area:
            locality_names.append(ai_area)
=======
            locality_names.append(
                ai_town
            )

        if ai_area:
            locality_names.append(
                ai_area
            )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

        locality_names.extend(
            place_names
        )

<<<<<<< HEAD
        # Remove duplicates
=======
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        locality_names = list(
            dict.fromkeys(
                name.strip()
                for name in locality_names
<<<<<<< HEAD
                if isinstance(name, str)
=======
                if isinstance(
                    name,
                    str,
                )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                and name.strip()
            )
        )

<<<<<<< HEAD
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
=======
        print(
            "=" * 60
        )
        print(
            "LOCALITY NAMES"
        )
        print(
            locality_names
        )
        print(
            "=" * 60
        )

        # ====================================================
        # 8. RESOLVE NAMED LOCALITIES
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        # ====================================================

        resolved_localities = []

        for locality_name in locality_names:

            try:
<<<<<<< HEAD
                results = (
                    await LocalityResolver.resolve(
=======

                results = await (
                    LocalityResolver.resolve(
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                        name=locality_name,
                        city=city,
                    )
                )

<<<<<<< HEAD
                for result in results:

                    address = result.get(
                        "address",
                        {}
=======
                for result in results or []:

                    address = (
                        result.get(
                            "address"
                        )
                        or {}
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                    )

                    resolved_localities.append(
                        {
<<<<<<< HEAD
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
=======
                            "searched_name": (
                                locality_name
                            ),

                            "display_name": (
                                result.get(
                                    "display_name"
                                )
                            ),

                            "type": (
                                result.get(
                                    "type"
                                )
                            ),

                            "addresstype": (
                                result.get(
                                    "addresstype"
                                )
                            ),

                            "city": (
                                address.get(
                                    "city"
                                )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                                or address.get(
                                    "municipality"
                                )
                            ),
<<<<<<< HEAD
                            "town": (
                                address.get("town")
=======

                            "town": (
                                address.get(
                                    "town"
                                )
                                or address.get(
                                    "village"
                                )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                                or address.get(
                                    "municipality"
                                )
                            ),
<<<<<<< HEAD
                            "area": (
                                address.get("suburb")
=======

                            "area": (
                                address.get(
                                    "suburb"
                                )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                                or address.get(
                                    "neighbourhood"
                                )
                                or address.get(
                                    "locality"
                                )
                            ),
<<<<<<< HEAD
                            "street": address.get(
                                "road"
=======

                            "street": (
                                address.get(
                                    "road"
                                )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                            ),
                        }
                    )

<<<<<<< HEAD
            except Exception as e:
=======
            except Exception as exc:
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

                print(
                    "LOCALITY RESOLUTION ERROR:",
                    locality_name,
<<<<<<< HEAD
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
=======
                    type(exc).__name__,
                    str(exc),
                )

        # ====================================================
        # 9. APPLY LOCALITY HIERARCHY
        # ====================================================

        for locality in resolved_localities:

            resolved_city = (
                locality.get(
                    "city"
                )
            )

            resolved_town = (
                locality.get(
                    "town"
                )
            )

            resolved_area = (
                locality.get(
                    "area"
                )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            )

            if (
                resolved_city
                and not city
            ):
<<<<<<< HEAD
=======

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                city = resolved_city

            if (
                resolved_town
                and not town
            ):
<<<<<<< HEAD
=======

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                town = resolved_town

            if (
                resolved_area
                and not area
            ):
<<<<<<< HEAD
                area = resolved_area

        # ====================================================
        # 8. NOMINATIM STREET / LOCATION SEARCH
=======

                area = resolved_area

        # ====================================================
        # 10. OSM GEOCODING
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        # ====================================================

        if (
            latitude is None
            or longitude is None
        ):

<<<<<<< HEAD
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

=======
            try:

                osm_results = await (
                    GeocodingService.search(
                        province=province,
                        city=city,
                        town=town or ai_town,
                        area=area or ai_area,
                        street=street,
                        landmarks=landmarks,
                    )
                )

            except Exception as exc:

                print(
                    "OSM GEOCODING ERROR:",
                    type(exc).__name__,
                    str(exc),
                )

                osm_results = []

            if osm_results:

                # Prefer precise geographic objects.
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
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
<<<<<<< HEAD
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
=======
                    "locality",
                    "neighbourhood",
                    "suburb",
                }

                best_osm = None

                for candidate in osm_results:

                    if (
                        candidate.get(
                            "addresstype"
                        )
                        in usable_osm_types
                    ):

                        best_osm = candidate
                        break

                if best_osm is None:

                    best_osm = osm_results[0]

                osm_latitude = (
                    best_osm.get(
                        "lat"
                    )
                )

                osm_longitude = (
                    best_osm.get(
                        "lon"
                    )
                )

                osm_address = (
                    best_osm.get(
                        "address"
                    )
                    or {}
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
                # Fill geographic hierarchy only when missing.
                # ------------------------------------------------

                if not province:

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                    province = (
                        osm_address.get(
                            "state"
                        )
                        or osm_address.get(
                            "state_district"
                        )
                    )

                if not city:
<<<<<<< HEAD
=======

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
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

<<<<<<< HEAD
                # Only use these if locality resolver
                # has not already provided them.
                if not town:
=======
                if not town:

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
                    town = (
                        osm_address.get(
                            "town"
                        )
                        or osm_address.get(
                            "village"
                        )
                    )

                if not area:
<<<<<<< HEAD
=======

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
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
<<<<<<< HEAD
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
=======

                    street = (
                        osm_address.get(
                            "road"
                        )
                    )

                if not house_number:

                    house_number = (
                        osm_address.get(
                            "house_number"
                        )
                    )

                print(
                    "=" * 60
                )
                print(
                    "OSM GEOCODING RESULT"
                )
                print(
                    best_osm
                )
                print(
                    "=" * 60
                )

        # ====================================================
        # 11. POSTGIS POINT
        # ====================================================

        if (
            latitude is not None
            and longitude is not None
        ):

            spatial_location = (
                WKTElement(
                    f"POINT({longitude} {latitude})",
                    srid=4326,
                )
            )

        # ====================================================
        # 12. NEARBY OSM PLACES
        # ====================================================

        if (
            latitude is not None
            and longitude is not None
        ):

            try:

                osm_places = await (
                    OSMPlacesService.nearby_places(
                        latitude=latitude,
                        longitude=longitude,
                        radius_meters=500,
                    )
                )

                print(
                    "=" * 60
                )
                print(
                    "OSM NEARBY PLACES:",
                    len(osm_places),
                )
                print(
                    "=" * 60
                )

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

                print(
                    "=" * 60
                )
                print(
                    "RANKED LOCATION EVIDENCE"
                )
                print(
                    "=" * 60
                )

                for place in ranked_places[:5]:

                    print(
                        place.get(
                            "score"
                        ),
                        place.get(
                            "name"
                        ),
                        place.get(
                            "distance_meters"
                        ),
                        place.get(
                            "reasons"
                        ),
                    )

                print(
                    "=" * 60
                )

            except Exception as exc:

                print(
                    "NEARBY OSM ERROR:",
                    type(exc).__name__,
                    str(exc),
                )

        # ====================================================
        # 13. FINAL STATUS
        # ====================================================

        status = (
            "success"
            if (
                latitude is not None
                and longitude is not None
            )
            else "not_verified"
        )

        if status == "not_verified":

            confidence = min(
                int(
                    confidence or 0
                ),
                30,
            )

        # ====================================================
        # 14. SAVE RESULT
        # ====================================================

        location_result = LocationResultDB(
            request_id=(
                location_request.id
            ),

            province=province,

            city=city,

            town=town,

            area=area,

            street=street,

            latitude=latitude,

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            longitude=longitude,

            location=spatial_location,

<<<<<<< HEAD
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

    house_number=house_number,

    place_names=place_names,
    landmarks=landmarks,

    latitude=latitude,
    longitude=longitude,

    confidence=confidence,
)
=======
            confidence=int(
                confidence or 0
            ),
        )

        db.add(
            location_result
        )

        db.commit()

        db.refresh(
            location_result
        )

        # ====================================================
        # 15. RESPONSE
        # ====================================================

        return LocationResponse(
            status=status,

            province=province,

            city=city,

            town=town,

            area=area,

            street=street,

            house_number=house_number,

            place_names=place_names,

            landmarks=landmarks,

            latitude=latitude,

            longitude=longitude,

            confidence=int(
                confidence or 0
            ),
        )
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

    except HTTPException:
        raise

<<<<<<< HEAD
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
=======
    except Exception as exc:

        db.rollback()

        print(
            "=" * 60
        )
        print(
            "LOCATION ANALYSIS ERROR"
        )
        print(
            "ERROR TYPE:",
            type(exc).__name__,
        )
        print(
            "ERROR:",
            str(exc),
        )
        print(
            "=" * 60
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        )