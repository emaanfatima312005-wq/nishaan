import os

from dotenv import load_dotenv
from groq import Groq


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY"
)

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is not set in .env"
    )


# ============================================================
# GROQ CLIENT
# ============================================================

client = Groq(
    api_key=GROQ_API_KEY
)


# ============================================================
# AUDIO -> URDU TEXT
# ============================================================

async def transcribe_audio(
    audio_data,
):
    """
    Convert Urdu speech into text using Whisper.

    Returns the original transcription so we can keep
    the native Urdu text for debugging and display.
    """

    filename, audio_bytes, content_type = (
        audio_data
    )

    if not audio_bytes:
        raise ValueError(
            "Audio data is empty."
        )

    result = client.audio.transcriptions.create(
        file=(
            filename or "voice.wav",
            audio_bytes,
        ),

        model="whisper-large-v3",

        # Tell Whisper the spoken language.
        language="ur",

        temperature=0.0,

        response_format="json",
    )

    text = getattr(
        result,
        "text",
        None,
    )

    if not text:
        raise ValueError(
            "Whisper returned empty transcription."
        )

    return text.strip()


# ============================================================
# URDU -> ROMAN URDU
# ============================================================


async def urdu_to_roman_urdu(urdu_text: str) -> str:
    """
    Convert native Urdu transcription into Pakistani Roman Urdu.
    This is transliteration, not translation.
    """

    if not urdu_text or not urdu_text.strip():
        raise ValueError("Urdu transcription is empty.")

    prompt = f"""
Convert the following Urdu transcription into natural Pakistani
Roman Urdu. Transliterate; do not translate into English.

Preserve all spoken meaning and geographic names, including
city, town, area, street, gali, chowk, mohalla, mosque and
market names. Do not invent, omit, or add information.

Examples:
راولپنڈی -> Rawalpindi
صادق آباد -> Sadiqabad
مسلم ٹاؤن -> Muslim Town
لال کرتی -> Lal Kurti
ہاجی چوک -> Haji Chowk
پانچ نمبر والی گلی -> paanch number wali gali
گلی نمبر پانچ -> gali number paanch
مکان نمبر 27 -> makan number 27

Return ONLY the Roman Urdu transcription, without explanations.

Urdu transcription:
{urdu_text}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": (
                    "Transliterate Urdu into Pakistani Roman Urdu. "
                    "Do not translate or explain. Return only the "
                    "transliterated text."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0,
        max_completion_tokens=2048,
        reasoning_effort="low",
        include_reasoning=False,
    )

    choice = response.choices[0] if response.choices else None
    roman_text = choice.message.content if choice else None

    if not roman_text or not roman_text.strip():
        finish_reason = choice.finish_reason if choice else "no_choice"
        raise ValueError(
            "Roman Urdu conversion returned empty text. "
            f"finish_reason={finish_reason}"
        )

    return roman_text.strip()