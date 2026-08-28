import os
import json

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in the .env file")


client = Groq(api_key=GROQ_API_KEY)


class LocationAnalyzer:

    async def analyze_text(self, clue: str):
        """
        Analyze a Roman Urdu location clue using Groq.
        """

        prompt = f"""
You are Nishaan, an AI location assistant for Pakistan.

The user describes a location using local landmarks, roads,
areas, towns, cities, or other clues.

The input may be written in Roman Urdu.

Analyze the clue and extract ONLY information that is explicitly
supported by the user's text.

Do NOT invent or guess a location.

Return ONLY valid JSON in exactly this format:

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

- ONLY extract information explicitly stated in the user's clue.
- NEVER infer a city from a neighborhood, street, landmark, or common association.
- NEVER infer a province from a city or landmark.
- NEVER infer a city from "Saddar".
- NEVER assume that a street belongs to a particular city.
- If the city is not explicitly mentioned, return null.
- If the province is not explicitly mentioned, return null.
- If an area, town, or street is not explicitly mentioned, return null.
- landmarks must contain only landmarks explicitly mentioned.
- Translate simple Roman Urdu landmark descriptions into English if useful.
- confidence must represent how clearly the provided text identifies the extracted information.
- Do not invent, assume, or complete missing location information.
- confidence must be a number between 0 and 100.

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
        )

        content = response.choices[0].message.content

        try:
            result = json.loads(content)

            confidence = result.get("confidence")

            # Groq sometimes returns confidence as 0.9
            # Convert it to our database format: 90
            if isinstance(confidence, float) and 0 <= confidence <= 1:
                result["confidence"] = round(confidence * 100)

            elif isinstance(confidence, int) and 0 <= confidence <= 1:
                result["confidence"] = confidence * 100

            return result

        except json.JSONDecodeError:
            raise ValueError(
                f"Groq returned invalid JSON: {content}"
            )

    async def analyze_image(self, image):
        ...

    async def analyze_voice(self, voice):
        ...

    async def analyze_combined(
        self,
        text=None,
        image=None,
        voice=None
    ):
        ...