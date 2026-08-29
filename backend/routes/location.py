from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.database import LocationRequestDB, LocationResultDB
from models.location import LocationRequest, LocationResponse
from services.ai.location_analyzer import LocationAnalyzer


router = APIRouter(
    prefix="/api/location",
    tags=["Location"],
)


analyzer = LocationAnalyzer()


@router.post("/analyze", response_model=LocationResponse)
async def analyze_location(
    request: LocationRequest,
    db: Session = Depends(get_db),
):

    try:

        # ====================================================
        # 1. SAVE USER REQUEST
        # ====================================================

        location_request = LocationRequestDB(
            input_type="text",
            input_text=request.clue,
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=2),
        )

        db.add(location_request)
        db.commit()
        db.refresh(location_request)

        # ====================================================
        # 2. SEND CLUE TO GROQ
        # ====================================================

        result = await analyzer.analyze_text(request.clue)

        # ====================================================
        # 3. SAVE AI RESULT
        # ====================================================

        location_result = LocationResultDB(
            request_id=location_request.id,

            province=result.get("province"),
            city=result.get("city"),
            town=result.get("town"),
            area=result.get("area"),
            street=result.get("street"),

            # AI currently doesn't provide coordinates.
            # We'll add geocoding later.
            latitude=None,
            longitude=None,

            confidence=result.get("confidence"),
        )

        db.add(location_result)
        db.commit()
        db.refresh(location_result)

        # ====================================================
        # 4. RETURN RESULT TO FRONTEND
        # ====================================================

        return LocationResponse(
            status="success",

            province=result.get("province"),
            city=result.get("city"),
            town=result.get("town"),
            area=result.get("area"),
            street=result.get("street"),

            latitude=None,
            longitude=None,

            confidence=result.get("confidence"),
        )

    except Exception as e:

        db.rollback()

        print("LOCATION ANALYSIS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze location.",
        )