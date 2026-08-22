from fastapi import APIRouter, UploadFile, File, HTTPException

from services.voice_service import transcribe_audio


router = APIRouter(
    prefix="/api/analyze",
    tags=["Voice Analysis"],
)


@router.post("/voice")
async def analyze_voice(
    audio: UploadFile = File(...)
):

    try:

        # Read uploaded audio
        audio_bytes = await audio.read()

        if not audio_bytes:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty.",
            )

        # Send audio to Groq Whisper
        transcription = await transcribe_audio(
            (
                audio.filename,
                audio_bytes,
                audio.content_type,
            )
        )

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
        )