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

async def urdu_to_roman_urdu(
    urdu_text: str,
) -> str:
    """
    Convert native Urdu transcription into Roman Urdu.

    This is transliteration, NOT translation.

    Geographic names must be preserved.
    """

    if not urdu_text or not urdu_text.strip():
        raise ValueError(
            "Urdu transcription is empty."
        )

    prompt = f"""
You are Nishaan's Pakistani Roman Urdu transliteration system.

Convert the Urdu transcription below into NATURAL ROMAN URDU.

THIS IS TRANSLITERATION, NOT TRANSLATION.

You must preserve the spoken meaning and geographic names.

IMPORTANT RULES:

1. Do NOT translate Urdu into English.

2. Write Urdu words using familiar Pakistani Roman Urdu.

3. Preserve Pakistani:
   - city names
   - locality names
   - area names
   - town names
   - street names
   - gali names
   - chowk names
   - mohalla names
   - mosque names
   - market names
   - house numbers

4. Do not invent a place.

5. Do not add information.

6. Do not remove information.

7. Keep numbers as numbers when they are already numeric.

8. Urdu number words should remain meaningful in Roman Urdu.

Examples:

راولپنڈی
-> Rawalpindi

صادق آباد
-> Sadiqabad

مسلم ٹاؤن
-> Muslim Town

لال کرتی
-> Lal Kurti

ہاجی چوک
-> Haji Chowk

ہاتھی چوک
-> Hathi Chowk

پانچ نمبر والی گلی
-> paanch number wali gali

گلی نمبر پانچ
-> gali number paanch

مکان نمبر 27
-> makan number 27

Do not explain anything.

Return ONLY the Roman Urdu transcription.

URDU TRANSCRIPTION:

{urdu_text}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a Pakistani Roman Urdu "
                    "transliteration system. "
                    "Transliterate only. "
                    "Do not translate. "
                    "Return only Roman Urdu."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],

        temperature=0,

        max_completion_tokens=512,

        include_reasoning=False,
    )

    roman_text = (
        response.choices[0].message.content
    )

    if not roman_text:
        raise ValueError(
            "Roman Urdu conversion returned empty text."
        )

    return roman_text.strip()