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

client = Groq(
    api_key=GROQ_API_KEY
)


# ============================================================
# LOCATION ANALYZER
# ============================================================

class LocationAnalyzer:

    # ========================================================
    # TEXT ANALYSIS
    # ========================================================

    async def analyze_text(
        self,
        clue: str,
    ):
        """
        Extract location clues from Roman Urdu, Urdu,
        English, or mixed-language descriptions.

        Important:
        Groq extracts what the user said.
        It does NOT decide the official administrative
        hierarchy of ambiguous localities.
        """

        if not clue or not clue.strip():
            raise ValueError(
                "Location clue cannot be empty."
            )

        prompt = f"""
You are Nishaan, an AI location clue extraction system
for Pakistan.

The user describes a location using:
- cities
- towns
- areas
- neighbourhoods
- suburbs
- streets
- roads
- gali
- chowk
- bazaars
- markets
- mosques
- shops
- other landmarks

The input may be:
- Roman Urdu
- Urdu
- English
- mixed language

Your job is to EXTRACT what the user said.

You are NOT responsible for deciding the official
administrative hierarchy of ambiguous place names.

A geographic resolver will verify that later using
OpenStreetMap and geographic data.

Return ONLY valid JSON in exactly this structure:

{{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "place_names": [],
  "landmarks": [],
  "confidence": 0
}}

RULES:

1. Extract a city only when the user explicitly names it.

2. Extract a province only when the user explicitly names it.

3. Extract a street/road/gali when the wording clearly
   identifies it as a street, road, or gali.

4. Do NOT decide that a locality is a town or area
   merely from its name.

5. If a named locality could be a town, area, suburb,
   neighbourhood, or locality, put it in "place_names".

6. Examples of potentially ambiguous locality names:
   - Saddar
   - Sadiqabad
   - Muslim Town
   - Chaklala
   - Satellite Town

7. Do NOT convert Sadiqabad into a street.

8. Do NOT convert Muslim Town into a street.

9. Do NOT convert Saddar into a street unless the user
   explicitly describes it as a street.

10. Preserve named geographic localities in "place_names"
    when their administrative level is unclear.

11. "place_names" must contain names actually mentioned
    by the user, not guesses.

12. "landmarks" should contain reference landmarks such as:
    - mosque
    - market
    - school
    - bank
    - shop
    - hospital

13. Translate simple descriptive Roman Urdu into concise
    English when useful.

14. Preserve actual proper names instead of translating
    them unnecessarily.

15. Do not invent locations.

16. Do not infer a city from a locality.

17. Do not infer a province from a city unless the province
    was explicitly stated.

18. confidence must be an integer from 0 to 100.

USER CLUE:

{clue.strip()}
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You extract structured Pakistani "
                        "location clues. "
                        "Do not invent locations. "
                        "Return only valid JSON."
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

            include_reasoning=False,
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

        # Guarantee expected arrays exist.
        if not isinstance(
            result.get("place_names"),
            list,
        ):
            result["place_names"] = []

        if not isinstance(
            result.get("landmarks"),
            list,
        ):
            result["landmarks"] = []

        result["confidence"] = (
            self._normalize_confidence(
                result.get("confidence")
            )
        )

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
        Analyze an image for geographic evidence.

        This extracts:
        - visible text
        - named landmarks
        - visual clues

        It does not invent exact coordinates.
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

        if not image_bytes:
            raise ValueError(
                "Image data is empty."
            )

        base64_image = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        image_url = (
            f"data:{content_type};base64,{base64_image}"
        )

        prompt = """
You are Nishaan, an AI geographic clue extraction
system for Pakistan.

Analyze the uploaded image carefully.

Look for:

- road signs
- street names
- road names
- Urdu text
- English text
- shop names
- mosque names
- school names
- market names
- building names
- landmarks
- phone numbers
- vehicle markings
- distinctive architecture
- mountains
- coastline
- other useful geographic evidence

OCR is important.

Try to read visible text exactly.

Do NOT invent:
- city
- province
- town
- area
- street
- landmark names
- coordinates

A generic Pakistani-looking street is NOT enough
to identify an exact city or street.

Return ONLY valid JSON:

{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "place_names": [],
  "landmarks": [],
  "visible_text": [],
  "visual_clues": [],
  "description": "",
  "confidence": 0
}

Rules:

- Exact visible names go into visible_text.
- Named localities whose administrative level is unclear
  go into place_names.
- Useful physical/reference landmarks go into landmarks.
- Generic visual observations go into visual_clues.
- Do not guess missing geographic fields.
- Maximum 8 place_names.
- Maximum 8 landmarks.
- Maximum 10 visible_text items.
- Maximum 8 visual_clues.
- description must be one concise sentence.
- confidence must be an integer from 0 to 100.
"""

        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You extract geographic clues from "
                        "images. "
                        "Be accurate and never invent "
                        "specific locations."
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

        # Guarantee expected arrays.
        for field in [
            "place_names",
            "landmarks",
            "visible_text",
            "visual_clues",
        ]:
            if not isinstance(
                result.get(field),
                list,
            ):
                result[field] = []

        result["confidence"] = (
            self._normalize_confidence(
                result.get("confidence")
            )
        )

        return result


    # ========================================================
    # VOICE ANALYSIS
    # ========================================================

    async def analyze_voice(
        self,
        voice: str,
    ):
        """
        Analyze a Whisper transcription using the same
        text location extraction pipeline.
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
        Analyze text/voice and image together.

        Text and voice provide linguistic geographic clues.
        Image provides OCR and visual geographic clues.
        """

        if not text and not image and not voice:
            raise ValueError(
                "At least one input is required."
            )

        evidence_parts = []

        if text and text.strip():
            evidence_parts.append(
                f"USER TEXT:\n{text.strip()}"
            )

        if voice and voice.strip():
            evidence_parts.append(
                f"VOICE TRANSCRIPTION:\n{voice.strip()}"
            )

        combined_text = "\n\n".join(
            evidence_parts
        )

        # ====================================================
        # TEXT / VOICE ONLY
        # ====================================================

        if image is None:

            response = client.chat.completions.create(
                model="openai/gpt-oss-20b",

                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are Nishaan, an AI geographic "
                            "clue extraction system for Pakistan. "
                            "Return only valid JSON."
                        ),
                    },
                    {
                        "role": "user",
                        "content": f"""
Analyze this evidence:

{combined_text}

Return ONLY JSON:

{{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "place_names": [],
  "landmarks": [],
  "visual_clues": [],
  "reasoning_evidence": [],
  "confidence": 0
}}

Rules:

- Extract explicit information.
- Do not invent locations.
- Ambiguous named localities go into place_names.
- Do not force ambiguous localities into town or area.
- confidence must be 0-100.
- reasoning_evidence must contain only useful evidence.
""",
                    },
                ],

                temperature=0,

                response_format={
                    "type": "json_object"
                },

                include_reasoning=False,
            )

        # ====================================================
        # TEXT + IMAGE
        # ====================================================

        else:

            image_bytes, content_type = image

            if not content_type.startswith("image/"):
                raise ValueError(
                    "Combined input must contain an image."
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

            combined_prompt = f"""
You are Nishaan, an AI geographic reasoning system
for difficult location identification in Pakistan.

Use BOTH sources:

TEXT / VOICE:

{combined_text if combined_text else "No text was provided."}

IMAGE:

Analyze the image carefully.

Extract:

- explicit city names
- explicit province names
- named localities
- street names
- road names
- gali names
- mosque names
- market names
- shop names
- school names
- other landmarks
- visible Urdu/English text
- useful visual clues

IMPORTANT:

The user does NOT need to provide every administrative
level.

If a locality is mentioned but its administrative level
is ambiguous, preserve it in place_names instead of
guessing town or area.

For example:

Sadiqabad
Muslim Town
Saddar
Chaklala

may be named geographic localities.

Do not automatically label them as town or area.

Return ONLY valid JSON:

{{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "place_names": [],
  "landmarks": [],
  "visible_text": [],
  "visual_clues": [],
  "reasoning_evidence": [],
  "confidence": 0
}}

Rules:

- Use only supported evidence.
- Do not invent cities.
- Do not invent streets.
- Do not invent coordinates.
- Preserve proper names.
- Generic appearance is not an exact location.
- Maximum 8 place_names.
- Maximum 8 landmarks.
- Maximum 10 visible_text items.
- Maximum 8 visual_clues.
- Maximum 6 reasoning_evidence items.
- confidence must be 0-100.
"""

            response = client.chat.completions.create(
                model="qwen/qwen3.8-27b",

                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are Nishaan. "
                            "Combine textual and visual "
                            "geographic evidence for Pakistan. "
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
                                    "url": image_url,
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

        # ====================================================
        # PARSE RESULT
        # ====================================================

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

        for field in [
            "place_names",
            "landmarks",
            "visual_clues",
            "reasoning_evidence",
        ]:
            if not isinstance(
                result.get(field),
                list,
            ):
                result[field] = []

        result["confidence"] = (
            self._normalize_confidence(
                result.get("confidence")
            )
        )

        return result


    # ========================================================
    # CONFIDENCE
    # ========================================================

    @staticmethod
    def _normalize_confidence(
        confidence,
    ) -> int:
        """
        Normalize confidence to integer 0-100.
        """

        if confidence is None:
            return 0

        try:
            value = float(
                confidence
            )

        except (
            TypeError,
            ValueError,
        ):
            return 0

        if 0 <= value <= 1:
            value *= 100

        return max(
            0,
            min(
                100,
                round(value)
            )
        )