<<<<<<< HEAD
from fastapi import APIRouter, UploadFile, File, HTTPException

from services.voice_service import transcribe_audio
=======
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)

from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database.connection import get_db

from models.database import (
    LocationRequestDB,
)

from services.voice_service import (
    transcribe_audio,
    urdu_to_roman_urdu,
)

from services.ai.location_analyzer import (
    LocationAnalyzer,
)

from services.universal_location_resolver import (
    UniversalLocationResolver,
)
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889


router = APIRouter(
    prefix="/api/analyze",
    tags=["Voice Analysis"],
)


<<<<<<< HEAD
@router.post("/voice")
async def analyze_voice(
    audio: UploadFile = File(...)
):

    try:

        # Read uploaded audio
        audio_bytes = await audio.read()

        if not audio_bytes:
=======
analyzer = LocationAnalyzer()


# ============================================================
# VOICE ANALYSIS
# ============================================================

@router.post("/voice")
async def analyze_voice(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Voice pipeline:

    Urdu / Roman Urdu speech
        ↓
    Whisper
        ↓
    Urdu transcription
        ↓
    Roman Urdu conversion
        ↓
    Nishaan AI extraction
        ↓
    Universal geographic resolver
        ↓
    Final verified location
    """

    location_request = None

    try:

        # ====================================================
        # 1. CHECK AUDIO
        # ====================================================

        if not audio.content_type:

            raise HTTPException(
                status_code=400,
                detail="Audio content type is missing.",
            )

        # ====================================================
        # 2. READ AUDIO
        # ====================================================

        audio_bytes = await audio.read()

        if not audio_bytes:

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty.",
            )

<<<<<<< HEAD
        # Send audio to Groq Whisper
=======
        # ====================================================
        # 3. SAVE REQUEST
        # ====================================================

        now = datetime.utcnow()

        location_request = LocationRequestDB(
            input_type="voice",
            input_text=None,
            file_path=audio.filename,
            created_at=now,
            expires_at=now + timedelta(hours=2),
        )

        db.add(location_request)
        db.commit()
        db.refresh(location_request)

        # ====================================================
        # 4. WHISPER
        # ====================================================

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        transcription = await transcribe_audio(
            (
                audio.filename,
                audio_bytes,
                audio.content_type,
            )
        )

<<<<<<< HEAD
        return {
            "status": "success",
            "filename": audio.filename,
            "transcription": transcription,
        }

    except Exception as e:

        print("VOICE ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to transcribe audio.",
=======
        if (
            not transcription
            or not transcription.strip()
        ):

            raise HTTPException(
                status_code=400,
                detail="Could not understand the audio.",
            )

        transcription = transcription.strip()

        print("=" * 60)
        print("URDU / RAW TRANSCRIPTION")
        print(transcription)
        print("=" * 60)

        # ====================================================
        # 5. URDU -> ROMAN URDU
        # ====================================================

        roman_transcription = (
            await urdu_to_roman_urdu(
                transcription
            )
        )

        if (
            not roman_transcription
            or not roman_transcription.strip()
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Could not convert transcription "
                    "to Roman Urdu."
                ),
            )

        roman_transcription = (
            roman_transcription.strip()
        )

        print("=" * 60)
        print("ROMAN URDU TRANSCRIPTION")
        print(roman_transcription)
        print("=" * 60)

        # Save usable transcription in DB.
        location_request.input_text = (
            roman_transcription
        )

        db.commit()

        # ====================================================
        # 6. AI LOCATION EXTRACTION
        # ====================================================

        ai_result = (
            await analyzer.analyze_voice(
                roman_transcription
            )
        )

        print("=" * 60)
        print("AI VOICE LOCATION RESULT")
        print(ai_result)
        print("=" * 60)

        # ====================================================
        # 7. UNIVERSAL LOCATION RESOLUTION
        # ====================================================

        final_location = (
            await UniversalLocationResolver.resolve(
                province=ai_result.get(
                    "province"
                ),

                city=ai_result.get(
                    "city"
                ),

                town=ai_result.get(
                    "town"
                ),

                area=ai_result.get(
                    "area"
                ),

                street=ai_result.get(
                    "street"
                ),

                house_number=ai_result.get(
                    "house_number"
                ),

                place_names=(
                    ai_result.get(
                        "place_names",
                        [],
                    )
                    or []
                ),

                landmarks=(
                    ai_result.get(
                        "landmarks",
                        [],
                    )
                    or []
                ),
            )
        )

        print("=" * 60)
        print("FINAL VOICE LOCATION")
        print(final_location)
        print("=" * 60)

        return {
            "status": "success",

            "resolver_status": (
                final_location.get(
                    "status"
                )
            ),

            "request_id": (
                location_request.id
            ),

            "filename": audio.filename,

            # Original speech
            "transcription_urdu": (
                transcription
            ),

            # Roman Urdu used by Nishaan
            "transcription_roman_urdu": (
                roman_transcription
            ),

            # AI extraction
            "ai_location": ai_result,

            # Final resolved location
            "final_location": final_location,

            # Convenient fields for frontend
            "province": (
                final_location.get(
                    "province"
                )
            ),

            "city": (
                final_location.get(
                    "city"
                )
            ),

            "town": (
                final_location.get(
                    "town"
                )
            ),

            "area": (
                final_location.get(
                    "area"
                )
            ),

            "street": (
                final_location.get(
                    "street"
                )
            ),

            "house_number": (
                final_location.get(
                    "house_number"
                )
            ),

            "place_names": (
                ai_result.get(
                    "place_names",
                    [],
                )
                or []
            ),

            "landmarks": (
                ai_result.get(
                    "landmarks",
                    [],
                )
                or []
            ),

            "latitude": (
                final_location.get(
                    "latitude"
                )
            ),

            "longitude": (
                final_location.get(
                    "longitude"
                )
            ),

            "confidence": (
                final_location.get(
                    "confidence",
                    0,
                )
            ),

            "evidence": (
                final_location.get(
                    "evidence",
                    [],
                )
            ),

            "supporting_places": (
                final_location.get(
                    "supporting_places",
                    [],
                )
            ),

            "candidate_display_name": (
                final_location.get(
                    "candidate_display_name"
                )
            ),
        }

    except HTTPException:
        raise

    except Exception as exc:

        if location_request is not None:
            db.rollback()

        print("=" * 60)
        print("VOICE ANALYSIS ERROR")
        print(
            "ERROR TYPE:",
            type(exc).__name__,
        )
        print(
            "ERROR:",
            str(exc),
        )
        print("=" * 60)

        raise HTTPException(
            status_code=500,
            detail=str(exc),
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
        )