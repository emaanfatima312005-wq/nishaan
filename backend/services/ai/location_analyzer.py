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
  "house_number": null,
  "place_names": [],
  "landmarks": [],
  "confidence": 0
}}

RULES:

1. Extract a city only when the user explicitly names it.

2. Extract a province only when the user explicitly names it.

3. Extract a street, road, or gali when the wording clearly
   identifies it as a street, road, or gali.

4. Do NOT decide that a locality is a town or area merely
   from its name.

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

13. Translate simple descriptive Roman Urdu landmark
    phrases into concise English when useful.

14. Preserve actual proper names instead of translating
    them unnecessarily.

15. Extract a house number when the user explicitly
    provides one.

16. Preserve the house number exactly as written.

Examples:
- "house 27" -> "27"
- "ghar no 27" -> "27"
- "makaan number 27-B" -> "27-B"
- "house #14" -> "14"

17. Never invent a house number.

18. Do not infer a city from a locality.

19. Do not infer a province from a city unless the
    province was explicitly stated.

20. Do not invent missing location information.

21. confidence must be an integer from 0 to 100.

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

        # Guarantee expected fields.
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

        if not isinstance(
            result.get("house_number"),
            (str, type(None)),
        ):
            result["house_number"] = str(
                result["house_number"]
            )

        result["confidence"] = (
            self._normalize_confidence(
                result.get("confidence")
            )
        )

        return result


    # ========================================================
    # IMAGE ANALYSIS
    # ========================================================

    @staticmethod
    def _combine_ocr(result: dict):
        """
        Combine adjacent short OCR text fragments into
        likely business or place names and add them to
        searchable_clues and business_names.

        E.g. visible_text = ["SHAHEEN",
                             "CHEMIST & GROCERS"]
        -> searchable_clues += ["Shaheen Chemist &
                                 Grocers"]
        """
        vt = result.get("visible_text") or []
        sc = list(
            result.get("searchable_clues") or []
        )
        bn = list(
            result.get("business_names") or []
        )

        i = 0
        while i < len(vt):
            item = (vt[i] or "").strip()

            if not item:
                i += 1
                continue

            # Try combining with the next fragment
            # when the current one is short (likely
            # part of a multi-line business sign).
            if (
                i + 1 < len(vt)
                and len(item) <= 15
                and not item[0].isdigit()
            ):
                next_item = (
                    vt[i + 1] or ""
                ).strip()

                if (
                    next_item
                    and len(next_item) >= 3
                ):
                    combined = (
                        f"{item} {next_item}"
                    ).title()

                    if (
                        combined not in sc
                        and len(combined) <= 60
                    ):
                        sc.append(combined)

                        # If it looks like a business
                        # name, also add to
                        # business_names.
                        lower = combined.lower()
                        biz_words = [
                            "store", "shop",
                            "chemist", "medical",
                            "electronics", "plaza",
                            "centre", "center",
                            "hotel", "restaurant",
                            "pharmacy", "clinic",
                            "school", "college",
                            "academy", "mosque",
                            "masjid", "market",
                            "traders", "general",
                            "&", "and",
                        ]
                        if any(
                            w in lower
                            for w in biz_words
                        ):
                            if combined not in bn:
                                bn.append(combined)

                    i += 2
                    continue

            # Single item: add to searchable_clues
            # if it looks like a proper name (not
            # just a number or generic word).
            if (
                len(item) >= 3
                and not item.isdigit()
                and item not in sc
            ):
                sc.append(item)

            i += 1

        result["searchable_clues"] = sc[:10]
        result["business_names"] = bn[:10]

    async def analyze_image(
        self,
        image_bytes: bytes,
        content_type: str,
    ):
        """
        Analyze an image for geographic evidence.
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
You are Nishaan, an expert AI geographic clue extraction
system specialized in Pakistan.

Analyze the uploaded image carefully and systematically.

STEP 1: First, scan the entire image for ALL visible text:
- road signs and milestones
- street name plates
- shop signboards and banners
- mosque name boards
- school / college name boards
- building name plates
- vehicle number plates
- Urdu text on walls, signs, banners
- English text on signs, shop fronts
- phone numbers, addresses on signboards
- any other readable text
- House number

OCR is extremely important. Read every visible text item
exactly as it appears, preserving Urdu and English.

EVERY readable text is a location clue:
- A shop name like "Al-Madina Store" or "Karim
  Electronics" can be searched on maps.
- A phone number like "042-35761234" has area code
  042 which means Lahore. Common Pakistan area codes:
  021=Karachi, 042=Lahore, 051=Islamabad/Rawalpindi,
  041=Faisalabad, 061=Multan, 091=Peshawar,
  081=Quetta, 052=Sialkot, 044=Sahiwal.
- A building name like "Panorama Centre" or
  "Centaurus Mall" can be found on maps.
- A mosque name like "Masjid-e-Bilal" can be
  searched geographically.
- A school/college name is often unique to one
  locality.
- Advertisements often mention the locality name.
- Urdu business names and banners frequently
  include the area name.
- Even partial text like "...Road" or "...Chowk"
  is a valuable clue.

Extract ALL readable text. Do not skip any sign,
banner, board, or text just because it seems
generic. Each piece of text will be searched
against map data to find a match.

STEP 2: Identify geographic evidence:
- distinctive architecture style
  (Mughal, British colonial, modern Pakistani, etc.)
- vegetation type
  (palm trees, pine trees, barren, agricultural)
- mountain or terrain profile
- road characteristics
  (motorway, GT Road, narrow gali, boulevard)
- vehicle types and license plate patterns
- utility infrastructure
  (WAPDA poles, Sui Gas meters, PTCL boxes)
- construction style
  (brick, concrete, marble, tile work)

STEP 3: Determine location based on evidence:
- If visible text names a specific city, area, or street,
  extract it confidently.
- If a shop sign shows an address like
  "Shop 5, Main Bazaar, Saddar", extract each part.
- If a milestone or kilometer stone is visible,
  extract the distance and destination.
- If architectural or environmental features strongly
  suggest a specific region, note them in visual_clues.

HOUSE NUMBERS ARE IMPORTANT.

If a house number is clearly visible on:
- a gate
- wall
- door
- plaque
- building entrance

extract it exactly into "house_number".

Do NOT confuse:
- shop numbers
- phone numbers
- plot numbers
- street numbers

with a house number unless the image clearly identifies
it as a house number.

Do NOT invent:
- city
- province
- town
- area
- street
- landmark names
- coordinates

However, when you see clear evidence such as:
- a road sign naming a city
- a shop signboard with an address
- a milestone indicating a nearby town
- a recognizable landmark building

you MUST extract that evidence into the correct fields.
Being cautious is good, but ignoring clear visible text
or signs defeats the purpose of analysis.

A generic Pakistani-looking street without specific
text evidence is NOT enough to identify a city.
But if you can read text that names a place, USE IT.

CRITICAL ANTI-HALLUCINATION RULES:
These override everything above.

- NEVER output a city, area, town, or street name
  based solely on what the scenery looks like.
- ONLY output city/area/town/street/province when:
  (a) You can READ that exact name in visible text
      (sign, board, milestone, shop name, etc.), OR
  (b) The image contains a universally recognized
      landmark (Badshahi Mosque, Faisal Mosque,
      Minar-e-Pakistan, Mazar-e-Quaid, etc.)
- Generic Pakistani features (brick buildings, narrow
  streets, rickshaws, trucks, Urdu fonts, bazaar
  scenes, concrete houses, electricity poles) are NOT
  evidence of ANY specific city or area.
- When in doubt, leave city, town, area, street, and
  province as null. Put your observations in
  visual_clues instead.
- It is FAR better to return null fields with an honest
  low confidence than to guess a wrong city name.
- If you output a city name, your reasoning field MUST
  quote the exact visible text or name the universally
  recognized landmark that proves it.
- A wrong city name is MUCH worse than no city name.

Return ONLY valid JSON:

{
  "reasoning": "explain what you observe and why you filled each field",
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "house_number": null,
  "business_names": [],
  "searchable_clues": [],
  "street_names": [],
  "landmark_names": [],
  "place_names": [],
  "landmarks": [],
  "visible_text": [],
  "visual_clues": [],
  "description": "",
  "confidence": 0
}

Rules:

- reasoning must explain what visual evidence led to
  each geographic field you filled. If a field is null,
  explain why you could not determine it.
- Exact visible names go into visible_text.
- Complete business or shop names (e.g. "Shaheen
  Chemist & Grocers", "Karim Electronics", "Al-Madina
  Store") go into business_names.
- Any text that can be searched on a map (business
  name, building name, mosque name, school name,
  road name) goes into searchable_clues.
- Named roads, streets, or boulevards visible on
  signs go into street_names.
- Named buildings, monuments, mosques, schools,
  hospitals, or markets go into landmark_names.
- Named localities whose administrative level is unclear
  go into place_names.
- Generic visual observations go into visual_clues.
- Include regional indicators in visual_clues
  (e.g. "Mughal-era architecture", "Punjabi-style truck
  art", "Karachi-style high-rise", "northern mountain
  terrain").
- Do not guess missing geographic fields without
  visible evidence.
- Maximum 10 business_names.
- Maximum 10 searchable_clues.
- Maximum 5 street_names.
- Maximum 8 landmark_names.
- Maximum 8 place_names.
- Maximum 8 landmarks.
- Maximum 15 visible_text items.
- Maximum 8 visual_clues.
- description must be one concise sentence.
- confidence must be an integer from 0 to 100.
  Rate confidence based on:
  - 80-100: Clear text or signs naming the exact location
  - 50-79: Strong evidence narrowing to a city or area
  - 20-49: Some evidence but not enough for exact location
  - 0-19: No useful geographic evidence found
"""

        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert geographic "
                        "image analyst for Pakistan. "
                        "Read ALL visible text carefully. "
                        "Extract every piece of geographic "
                        "evidence from the image. "
                        "Be thorough but never invent "
                        "locations without visual evidence."
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

            temperature=0.1,

            # Stay below the Groq free-tier OTPM
            # limit (1000 output tokens/minute) and
            # skip the model's internal chain-of-thought
            # so the whole budget goes to the JSON answer.
            max_completion_tokens=700,

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

        for field in [
            "place_names",
            "landmarks",
            "visible_text",
            "visual_clues",
            "business_names",
            "searchable_clues",
            "street_names",
            "landmark_names",
        ]:
            if not isinstance(
                result.get(field),
                list,
            ):
                result[field] = []

        if not isinstance(
            result.get("house_number"),
            (str, type(None)),
        ):
            result["house_number"] = str(
                result["house_number"]
            )

        result["confidence"] = (
            self._normalize_confidence(
                result.get("confidence")
            )
        )

        # ------------------------------------------
        # COMBINE OCR FRAGMENTS
        # ------------------------------------------
        # Adjacent short text fragments that likely
        # form a single business or place name are
        # combined into searchable_clues.
        # E.g. "SHAHEEN" + "CHEMIST & GROCERS"
        #   -> "Shaheen Chemist & Grocers"

        self._combine_ocr(result)

        # ------------------------------------------
        # ANTI-HALLUCINATION: confidence gating
        # ------------------------------------------
        # The vision model sometimes hallucinates specific
        # city/area/street names from generic Pakistani
        # scenery.  When there is NO visible text in
        # the image, geographic fields are unreliable
        # and must be cleared.
        # visible_text items are always preserved because
        # they represent actual OCR output.

        _has_text_evidence = bool(
            result.get("visible_text")
            or result.get("business_names")
            or result.get("searchable_clues")
            or result.get("landmark_names")
        )

        _vision_conf = result.get("confidence", 0) or 0

        if (
            not _has_text_evidence
            and _vision_conf < 50
        ):
            result["city"] = None
            result["province"] = None
            result["town"] = None
            result["area"] = None
            result["street"] = None
            result["house_number"] = None
            result["place_names"] = []
            result["landmarks"] = []
            result["confidence"] = max(
                _vision_conf, 10
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
        Combine text, voice, and image evidence.
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
  "house_number": null,
  "place_names": [],
  "landmarks": [],
  "visual_clues": [],
  "reasoning_evidence": [],
  "confidence": 0
}}

Rules:

- Extract explicit information.
- Do not invent locations.
- Extract house numbers when explicitly provided.
- Preserve house numbers exactly.
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

Use BOTH textual and visual evidence.

TEXT / VOICE:

{combined_text if combined_text else "No text was provided."}

IMAGE:

Analyze the image carefully.

Look for:

- house numbers
- road names
- street names
- gali names
- signs
- Urdu text
- English text
- shop names
- mosque names
- market names
- school names
- building names
- other landmarks

HOUSE NUMBERS ARE IMPORTANT.

If a house number is explicitly mentioned in text
or clearly visible in the image, preserve it exactly.

Do not confuse house numbers with:
- phone numbers
- shop numbers
- plot numbers
- street numbers

Use textual evidence to establish location context.

Use the image to confirm or add evidence.

If a locality is mentioned but its administrative
level is ambiguous, put it in place_names.

Do not invent:
- cities
- provinces
- streets
- landmarks
- coordinates
- house numbers

Return ONLY valid JSON:

{{
  "province": null,
  "city": null,
  "town": null,
  "area": null,
  "street": null,
  "house_number": null,
  "place_names": [],
  "landmarks": [],
  "visible_text": [],
  "visual_clues": [],
  "reasoning_evidence": [],
  "confidence": 0
}}

Rules:

- Use only supported evidence.
- Preserve proper names.
- Preserve house numbers exactly.
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

        if not isinstance(
            result.get("house_number"),
            (str, type(None)),
        ):
            result["house_number"] = str(
                result["house_number"]
            )

        result["confidence"] = (
            self._normalize_confidence(
                result.get("confidence")
            )
        )

        return result


    # ========================================================
    # CONFIDENCE NORMALIZER
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