import os
import json
import base64

from dotenv import load_dotenv
from groq import Groq


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is not set in the .env file"
    )


# ============================================================
# GROQ CLIENT
# ============================================================

client = Groq(api_key=GROQ_API_KEY)


# ============================================================
# LOCATION ANALYZER
# ============================================================

class LocationAnalyzer:

    # ========================================================
    # TEXT ANALYSIS
    # ========================================================

    async def analyze_text(self, clue: str):
        """
        Analyze a Roman Urdu / Urdu / English location clue.
        """

        prompt = f"""
You are Nishaan, an AI location assistant for Pakistan.

The user describes a location using natural language, local
landmarks, roads, areas, towns, cities, or other clues.

The input may be written in Roman Urdu, Urdu, English,
or a mixture of these.

The user does NOT need to mention every administrative level.

Example:

"Rawalpindi Saddar mein Bank Road ke paas aik bari masjid hai"

may identify:
- city = Rawalpindi
- town/area = Saddar
- street = Bank Road
- landmark = large mosque

The user does not need to say Punjab.

A geographic resolver will determine missing parent
administrative information later.

Return ONLY valid JSON:

{{
    "province": null,
    "city": null,
    "town": null,
    "area": null,
    "street": null,
    "landmarks": [],
    "confidence": 0
}}

Rules:

1. Extract information explicitly supported by the clue.

2. Do not invent a specific city, street, town, area,
   or landmark.

3. If a city is explicitly stated, return it.

4. If a province is explicitly stated, return it.

5. If province is not stated, return null.

6. If an area, town, or street is explicitly stated,
   return it.

7. landmarks must contain only clues supported by the user.

8. Translate simple Roman Urdu landmark descriptions into
   concise English when useful.

9. Do not turn generic descriptions into exact named places.

10. confidence must be an integer from 0 to 100.

User clue:
{clue}
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You extract structured Pakistani location "
                        "information from user clues."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0,
            response_format={
                "type": "json_object"
            },
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError(
                "Groq returned an empty text analysis."
            )

        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            raise ValueError(
                f"Groq returned invalid JSON: {content}"
            )

        confidence = result.get("confidence")

        if isinstance(confidence, float) and 0 <= confidence <= 1:
            result["confidence"] = round(
                confidence * 100
            )

        elif isinstance(confidence, int) and 0 <= confidence <= 1:
            result["confidence"] = confidence * 100

        return result


    # ========================================================
    # IMAGE ANALYSIS
    # ========================================================

    async def analyze_image(
        self,
        image_bytes: bytes,
        content_type: str,
    ):
        """
        Analyze an image for geographic and location clues.
        """

        if not content_type.startswith("image/"):
            raise ValueError(
                "Uploaded file must be an image."
            )

        max_size = 20 * 1024 * 1024

        if len(image_bytes) > max_size:
            raise ValueError(
                "Image must be smaller than 20 MB."
            )

        base64_image = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        image_url = (
            f"data:{content_type};base64,{base64_image}"
        )

        prompt = """
You are Nishaan, an AI geographic clue extraction system
for difficult location identification in Pakistan.

Analyze the image carefully for every location-bearing clue.

Prioritize:

- readable signs
- road names
- shop names
- mosque names
- school names
- building names
- market names
- street names
- Urdu text
- English text
- phone numbers
- distinctive landmarks
- bridges
- mountains
- coastlines
- unique architecture
- vehicle/company markings
- other geographic clues

OCR is extremely important.

Try to read visible text exactly.

Do NOT invent:
- province
- city
- town
- area
- street
- landmark name
- coordinates

A generic Pakistani-looking street is not enough to identify
an exact location.

Return ONLY valid JSON:

{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "landmarks": [],
  "visible_text": [],
  "visual_clues": [],
  "description": "",
  "confidence": 0
}

Rules:

- Fill geographic fields only when strongly supported.
- Generic observations go into visual_clues.
- Exact readable names go into visible_text.
- landmarks should contain useful geographic clues.
- Maximum 8 landmarks.
- Maximum 10 visible_text items.
- Maximum 8 visual_clues.
- description must be one concise sentence.
- confidence must be an integer from 0 to 100.
- Never invent missing information.

Confidence guide:

0-20   = almost no useful geographic evidence
21-50  = generic location clues
51-70  = several useful geographic clues
71-90  = strong geographic evidence
91-100 = highly distinctive evidence such as a readable
         place name or unique landmark
"""

        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You extract geographic clues from images. "
                        "Be accurate and never invent locations."
                    ),
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url
                            },
                        },
                    ],
                },
            ],
            temperature=0.2,
            max_completion_tokens=2048,
            reasoning_effort="none",
            response_format={
                "type": "json_object"
            },
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError(
                "Groq returned an empty image analysis."
            )

        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            raise ValueError(
                f"Groq returned invalid image JSON: {content}"
            )

        confidence = result.get("confidence")

        if isinstance(confidence, float) and 0 <= confidence <= 1:
            result["confidence"] = round(
                confidence * 100
            )

        elif isinstance(confidence, int) and 0 <= confidence <= 1:
            result["confidence"] = confidence * 100

        return result


    # ========================================================
    # VOICE ANALYSIS
    # ========================================================

    async def analyze_voice(self, voice: str):
        """
        Analyze a Whisper transcription using the same
        location-analysis pipeline as text.
        """

        if not voice or not voice.strip():
            raise ValueError(
                "Voice transcription is empty."
            )

        return await self.analyze_text(
            voice.strip()
        )


    # ========================================================
    # COMBINED ANALYSIS
    # ========================================================

    async def analyze_combined(
        self,
        text: str | None = None,
        image: tuple[bytes, str] | None = None,
        voice: str | None = None,
    ):
        """
        Combine textual, voice, and image evidence.

        Text and voice are converted into textual evidence.
        Image contributes visual/OCR evidence.
        """

        if not text and not image and not voice:
            raise ValueError(
                "At least one input is required."
            )

        evidence_text = []

        if text and text.strip():
            evidence_text.append(
                f"USER TEXT:\n{text.strip()}"
            )

        if voice and voice.strip():
            evidence_text.append(
                f"VOICE TRANSCRIPTION:\n{voice.strip()}"
            )

        combined_text = "\n\n".join(
            evidence_text
        )

        # ----------------------------------------------------
        # TEXT / VOICE ONLY
        # ----------------------------------------------------

        if image is None:

            response = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are Nishaan, an AI geographic "
                            "reasoning system for Pakistan."
                        ),
                    },
                    {
                        "role": "user",
                        "content": f"""
Analyze the location evidence below.

{combined_text}

Return ONLY JSON:

{{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "landmarks": [],
  "visual_clues": [],
  "reasoning_evidence": [],
  "confidence": 0
}}

Rules:
- Use only evidence supported by the input.
- Do not invent exact locations.
- Missing fields must be null.
- confidence must be between 0 and 100.
- reasoning_evidence should contain the strongest clues.
""",
                    },
                ],
                temperature=0,
                response_format={
                    "type": "json_object"
                },
            )

        # ----------------------------------------------------
        # TEXT + IMAGE
        # ----------------------------------------------------

        else:

            image_bytes, content_type = image

            max_size = 20 * 1024 * 1024

            if len(image_bytes) > max_size:
                raise ValueError(
                    "Image must be smaller than 20 MB."
                )

            if not content_type.startswith("image/"):
                raise ValueError(
                    "Combined input must contain an image."
                )

            base64_image = base64.b64encode(
                image_bytes
            ).decode("utf-8")

            image_url = (
                f"data:{content_type};base64,{base64_image}"
            )

            combined_prompt = f"""
You are Nishaan, an AI geographic reasoning system
for difficult location identification in Pakistan.

Use BOTH the textual and visual evidence.

TEXT / VOICE EVIDENCE:

{combined_text if combined_text else "No text was provided."}

IMAGE:
Analyze the uploaded image carefully.

Look for:
- signs
- Urdu text
- English text
- road names
- shop names
- mosque names
- market names
- buildings
- landmarks
- distinctive architecture
- geographic features

Use the text to establish geographic context and the image
to confirm or add visual evidence.

IMPORTANT:

Do not invent a city, province, street, landmark,
or coordinate.

A generic street image alone is not enough to identify
an exact location.

Return ONLY valid JSON:

{{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "landmarks": [],
  "visible_text": [],
  "visual_clues": [],
  "reasoning_evidence": [],
  "confidence": 0
}}

Rules:

- Combine evidence from both sources.
- Prefer explicit place names.
- Preserve visible sign text.
- Do not hallucinate coordinates.
- Maximum 8 landmarks.
- Maximum 10 visible_text items.
- Maximum 8 visual_clues.
- reasoning_evidence should list the strongest supporting clues.
- confidence must be between 0 and 100.
"""

            response = client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You combine text and visual "
                            "geographic evidence. "
                            "Never invent a location."
                        ),
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": combined_prompt,
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_url
                                },
                            },
                        ],
                    },
                ],
                temperature=0.1,
                max_completion_tokens=2048,
                reasoning_effort="none",
                response_format={
                    "type": "json_object"
                },
            )

        content = response.choices[0].message.content

        if not content:
            raise ValueError(
                "Groq returned an empty combined analysis."
            )

        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            raise ValueError(
                f"Groq returned invalid combined JSON: {content}"
            )

        confidence = result.get("confidence")

        if isinstance(confidence, float) and 0 <= confidence <= 1:
            result["confidence"] = round(
                confidence * 100
            )

        elif isinstance(confidence, int) and 0 <= confidence <= 1:
            result["confidence"] = confidence * 100

        return result