import os

from groq import Groq
from dotenv import load_dotenv


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in the .env file")


client = Groq(api_key=GROQ_API_KEY)


async def transcribe_audio(audio_file):
    """
    Transcribe uploaded audio using Groq Whisper Turbo.
    """

    transcription = client.audio.transcriptions.create(
        file=audio_file,
        model="whisper-large-v3-turbo",
        response_format="json",
    )

    return transcription.text