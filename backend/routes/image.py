import asyncio
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

from services.universal_location_resolver import (
    UniversalLocationResolver,
)

from services.image_evidence_fusion import (
    ImageEvidenceFusion,
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
        # 5. VISION + EXIF (concurrent)
        # ====================================================
        # Vision (Groq API call) and EXIF (local byte
        # parsing) are independent and can run at the
        # same time.

        async def _run_vision():
            return await analyzer.analyze_image(
                image_bytes=image_bytes,
                content_type=image.content_type,
            )

        async def _run_exif():
            try:
                return (
                    ExifService.extract_gps(
                        image_bytes
                    )
                )
            except Exception:
                return None

        _vision_exif = await asyncio.gather(
            _run_vision(),
            _run_exif(),
            return_exceptions=True,
        )

        _v_res = _vision_exif[0]
        _e_res = _vision_exif[1]

        if isinstance(_v_res, Exception):
            raise _v_res
        vision_result = _v_res

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
        exif_location = None

        # ====================================================
        # 7. EXIF GPS (already ran concurrently above)
        # ====================================================

        if (
            _e_res
            and not isinstance(_e_res, Exception)
        ):
            exif_location = _e_res

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

        # ====================================================
        # 7b. FAST PATH CHECK
        # ====================================================
        # When the vision model found strong readable
        # clues (business name, sign, landmark),
        # skip the heavy CLIP models and use only
        # the OCR-based pipeline.

        _business = (
            vision_result.get("business_names") or []
        )
        _searchable = (
            vision_result.get("searchable_clues") or []
        )
        _street_names = (
            vision_result.get("street_names") or []
        )
        _vision_conf = (
            vision_result.get("confidence") or 0
        )

        _has_strong_clues = bool(
            _business
            or _searchable
            or _street_names
        ) and _vision_conf >= 40

        # Initialize fallback values for the case
        # where CLIP models are skipped.
        streetclip_country = []
        streetclip_region = []
        streetclip_city = []
        geoclip_predictions = []

        if _has_strong_clues:
            print("=" * 60)
            print(
                "FAST PATH: strong clues found — "
                "skipping GeoCLIP/StreetCLIP"
            )
            print(
                "Business:", _business
            )
            print(
                "Searchable:", _searchable
            )
            print("=" * 60)

        else:

            # ========================================
            # 8 + 9. STREETCLIP + GEOCLIP (concurrent)
            # ========================================
            # Both models are independent and can
            # run at the same time.

            async def _run_streetclip():
                try:
                    c = (
                        StreetCLIPService
                        .classify_country(
                            image_bytes
                        )
                    )
                    r = (
                        StreetCLIPService
                        .classify_pakistan_region(
                            image_bytes
                        )
                    )
                    ci = (
                        StreetCLIPService
                        .classify_pakistan_city(
                            image_bytes
                        )
                    )
                    return c, r, ci
                except Exception:
                    return [], [], []

            async def _run_geoclip():
                try:
                    return (
                        GeoCLIPService
                        .predict_pakistan(
                            image_bytes=image_bytes,
                            filename=(
                                image.filename
                                or "image.jpg"
                            ),
                            top_k=10,
                        )
                    )
                except Exception:
                    return []

            _sc_res, _gc_res = (
                await asyncio.gather(
                    _run_streetclip(),
                    _run_geoclip(),
                    return_exceptions=True,
                )
            )

            if (
                not isinstance(
                    _sc_res, Exception
                )
                and isinstance(_sc_res, tuple)
            ):
                streetclip_country = (
                    _sc_res[0] or []
                )
                streetclip_region = (
                    _sc_res[1] or []
                )
                streetclip_city = (
                    _sc_res[2] or []
                )

            if (
                not isinstance(
                    _gc_res, Exception
                )
                and isinstance(_gc_res, list)
            ):
                geoclip_predictions = _gc_res

            print("=" * 60)
            print("STREETCLIP COUNTRY")
            print(streetclip_country)
            print("STREETCLIP REGION")
            print(streetclip_region)
            print("STREETCLIP CITY")
            print(streetclip_city)
            print("GEOCLIP PREDICTIONS")
            print(geoclip_predictions)
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
        # 11b. UNIVERSAL RESOLVER — PRECISION PASS
        # ====================================================

        # LocationCandidateService finds the best geographic
        # area using GeoCLIP + StreetCLIP + vision evidence,
        # but its coordinates come from GeoCLIP gallery
        # points which are approximate.
        #
        # UniversalLocationResolver takes the combined
        # evidence (city, area, street, landmarks, place
        # names) and performs precise OSM-based geocoding
        # to find exact street-level coordinates.

        precise_location = None
        resolver_city = None

        if final_location and gps_source is None:

            try:

                resolver_province = (
                    final_location.get("province")
                    or vision_result.get("province")
                )

                resolver_city = (
                    final_location.get("city")
                    or vision_result.get("city")
                )

                resolver_town = (
                    final_location.get("town")
                    or vision_result.get("town")
                )

                resolver_area = (
                    final_location.get("area")
                    or vision_result.get("area")
                )

                resolver_street = (
                    final_location.get("street")
                    or vision_result.get("street")
                )

                resolver_house_number = (
                    final_location.get("house_number")
                    or vision_result.get("house_number")
                )

                resolver_place_names = list(set(
                    (vision_result.get("place_names", []) or [])
                    + (final_location.get("place_names", []) or [])
                ))

                resolver_landmarks = list(set(
                    (vision_result.get("landmarks", []) or [])
                    + (final_location.get("landmarks", []) or [])
                ))

                precise_location = (
                    await UniversalLocationResolver.resolve(
                        province=resolver_province,
                        city=resolver_city,
                        town=resolver_town,
                        area=resolver_area,
                        street=resolver_street,
                        house_number=(
                            resolver_house_number
                        ),
                        place_names=(
                            resolver_place_names
                        ),
                        landmarks=(
                            resolver_landmarks
                        ),
                    )
                )

                print("=" * 60)
                print(
                    "UNIVERSAL RESOLVER PRECISION PASS"
                )
                print(precise_location)
                print("=" * 60)

                # Use resolver's precise coordinates
                # when it succeeds.

                precise_lat = (
                    precise_location.get("latitude")
                )

                precise_lon = (
                    precise_location.get("longitude")
                )

                if (
                    precise_lat is not None
                    and precise_lon is not None
                ):

                    latitude = precise_lat
                    longitude = precise_lon
                    gps_source = "universal_resolver"

                # Capture resolver city BEFORE the
                # final_location overwrite below.
                # Used for contradiction detection in
                # the evidence fusion step.
                resolver_city = (
                    precise_location.get("city")
                )

                # Overwrite final_location with
                # resolver's more accurate fields.

                final_location = {
                    **final_location,
                    "province": (
                        precise_location.get(
                            "province"
                        )
                        or final_location.get(
                            "province"
                        )
                    ),
                    "city": (
                        precise_location.get(
                            "city"
                        )
                        or final_location.get(
                            "city"
                        )
                    ),
                    "town": (
                        precise_location.get(
                            "town"
                        )
                        or final_location.get(
                            "town"
                        )
                    ),
                    "area": (
                        precise_location.get(
                            "area"
                        )
                        or final_location.get(
                            "area"
                        )
                    ),
                    "street": (
                        precise_location.get(
                            "street"
                        )
                        or final_location.get(
                            "street"
                        )
                    ),
                    "house_number": (
                        precise_location.get(
                            "house_number"
                        )
                        or final_location.get(
                            "house_number"
                        )
                    ),
                    "latitude": (
                        precise_lat
                        or final_location.get(
                            "latitude"
                        )
                    ),
                    "longitude": (
                        precise_lon
                        or final_location.get(
                            "longitude"
                        )
                    ),
                    "confidence": max(
                        final_location.get(
                            "confidence", 0
                        ),
                        precise_location.get(
                            "confidence", 0
                        ),
                    ),
                    "evidence": (
                        final_location.get(
                            "evidence", []
                        )
                        + precise_location.get(
                            "evidence", []
                        )
                    ),
                    "supporting_places": (
                        precise_location.get(
                            "supporting_places", []
                        )
                        or final_location.get(
                            "supporting_places", []
                        )
                    ),
                    "candidate_display_name": (
                        precise_location.get(
                            "candidate_display_name"
                        )
                        or final_location.get(
                            "candidate_display_name"
                        )
                    ),
                }

            except Exception as resolver_error:

                print("=" * 60)
                print(
                    "UNIVERSAL RESOLVER ERROR"
                )
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
        # 12. EVIDENCE FUSION
        # ====================================================
        #
        # Combine all evidence signals into one final
        # confidence score using the evidence fusion
        # system.  This replaces the old max-of-sources
        # approach with proper contradiction detection
        # and multi-source agreement requirements.
        #
        # Evidence sources:
        #   EXIF GPS, Groq Vision, GeoCLIP, StreetCLIP,
        #   LocationCandidateService, UniversalLocationResolver
        #
        # Status levels:
        #   verified  - high confidence, 3+ sources agree
        #   likely    - good confidence, some support
        #   candidate - partial evidence
        #   uncertain - weak evidence or contradictions

        fused = ImageEvidenceFusion.fuse(
            exif_gps=(
                exif_location
                if gps_source == "exif"
                else None
            ),
            vision_result=vision_result,
            geoclip_predictions=geoclip_predictions,
            streetclip_country=streetclip_country,
            streetclip_region=streetclip_region,
            streetclip_city=streetclip_city,
            candidate_result=final_location,
            precise_location=precise_location,
            resolver_city=resolver_city,
        )

        latitude = fused["latitude"]
        longitude = fused["longitude"]
        gps_source = fused["gps_source"]
        final_confidence = fused["confidence"]
        location_status = fused["location_status"]
        contradictions = fused["contradictions"]
        evidence_count = fused["evidence_count"]

        final_province = fused["province"]
        final_city = fused["city"]
        final_town = fused["town"]
        final_area = fused["area"]
        final_street = fused["street"]
        final_house_number = fused["house_number"]

        print("=" * 60)
        print("EVIDENCE FUSION RESULT")
        print("Confidence:", final_confidence)
        print("Status:", location_status)
        print("Contradictions:", contradictions)
        print("Evidence signals:", evidence_count)
        print("=" * 60)

        # ====================================================
        # 13. RETURN FINAL RESULT
        # ====================================================

        return {
            "status": "success",
            "location_status": location_status,
            "request_id": location_request.id,
            "filename": image.filename,

            # --- FINAL LOCATION ---
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
            "contradictions": contradictions,
            "evidence_count": evidence_count,

            # --- VISION EVIDENCE ---
            "place_names": vision_result.get(
                "place_names", []
            ),
            "landmarks": vision_result.get(
                "landmarks", []
            ),
            "visible_text": vision_result.get(
                "visible_text", []
            ),
            "visual_clues": vision_result.get(
                "visual_clues", []
            ),
            "description": vision_result.get(
                "description", ""
            ),

            # --- RESOLVER ---
            "final_location": final_location,

            # --- GEOCLIP ---
            "geoclip_coordinates": geoclip_coordinates,
            "geoclip_predictions": geoclip_predictions,

            # --- STREETCLIP ---
            "streetclip": {
                "country": streetclip_country,
                "region": streetclip_region,
                "city": streetclip_city,
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