import json
import os
import re
from typing import Any

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
        "GROQ_API_KEY is not set in the .env file"
    )


# ============================================================
# GROQ CLIENT
# ============================================================

client = Groq(
    api_key=GROQ_API_KEY
)


# ============================================================
# HELPERS
# ============================================================

def normalize_candidate(
    value: str,
) -> str:
    """
    Normalize a candidate name for comparison.
    """

    value = value.strip().lower()

    value = re.sub(
        r"\s+",
        " ",
        value,
    )

    return value


def clean_json_text(
    text: str,
) -> str:
    """
    Remove Markdown code fences if the model returns them.
    """

    text = text.strip()

    text = re.sub(
        r"^```json\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"^```\s*",
        "",
        text,
    )

    text = re.sub(
        r"\s*```$",
        "",
        text,
    )

    return text.strip()


# ============================================================
# LOCALITY CANDIDATE SERVICE
# ============================================================

class LocalityCandidateService:

    @staticmethod
    async def rank_candidates(
        noisy_locality: str,
        city: str,
        province: str | None,
        known_candidates: list[str],
    ) -> list[dict[str, Any]]:
        """
        Rank real locality candidates against a noisy
        Roman Urdu / ASR phrase.

        The model can ONLY choose from known_candidates.
        """

        # ====================================================
        # VALIDATION
        # ====================================================

        if (
            not noisy_locality
            or not noisy_locality.strip()
        ):
            return []

        if (
            not city
            or not city.strip()
        ):
            return []

        if not known_candidates:
            return []

        # ====================================================
        # CLEAN CANDIDATES
        # ====================================================

        cleaned_candidates = []

        seen = set()

        for candidate in known_candidates:

            if candidate is None:
                continue

            candidate = str(
                candidate
            ).strip()

            if not candidate:
                continue

            normalized = normalize_candidate(
                candidate
            )

            if normalized in seen:
                continue

            seen.add(
                normalized
            )

            cleaned_candidates.append(
                candidate
            )

        if not cleaned_candidates:
            return []

        # Keep prompt manageable.
        cleaned_candidates = (
            cleaned_candidates[:100]
        )

        candidate_text = "\n".join(
            f"{index + 1}. {candidate}"
            for index, candidate
            in enumerate(
                cleaned_candidates
            )
        )

        # ====================================================
        # PROMPT
        # ====================================================

        prompt = f"""
You are Nishaan's Pakistani locality recognition system.

KNOWN CITY:
{city}

KNOWN PROVINCE:
{province or "unknown"}

NOISY ROMAN URDU SPEECH:
"{noisy_locality}"

REAL LOCALITY CANDIDATES:
{candidate_text}

The noisy phrase came from Pakistani speech recognition
and may contain:

- Urdu speech recognition errors
- Roman Urdu spelling differences
- phonetic distortion
- merged words
- separated words
- missing sounds
- extra sounds

Your task is to determine whether the noisy phrase
refers to one of the REAL LOCALITY CANDIDATES.

CRITICAL RULES:

1. You may ONLY choose from the supplied candidates.

2. NEVER invent a locality.

3. NEVER create a new spelling.

4. NEVER modify a candidate name.

5. Consider Pakistani pronunciation.

6. Consider Roman Urdu phonetics.

7. Consider common Urdu speech-recognition errors.

8. Use the known city as geographic context.

9. Do not choose a candidate just because one short
   word happens to look similar.

10. If none is plausible, return an empty list.

11. Return at most 3 candidates.

12. Confidence must be an integer from 0 to 100.

Return ONLY valid JSON.

Example:

{{
  "candidates": [
    {{
      "name": "Sadiqabad",
      "confidence": 85
    }}
  ]
}}

Or:

{{
  "candidates": []
}}
"""

        # ====================================================
        # GROQ REQUEST
        # ====================================================

        try:

            response = client.chat.completions.create(
                model="openai/gpt-oss-20b",

                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a Pakistani locality "
                            "matching system. "
                            "Choose ONLY from the supplied "
                            "candidate names. "
                            "Never invent names. "
                            "Return only JSON."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],

                temperature=0,

                max_completion_tokens=400,

                include_reasoning=False,
            )

        except Exception as exc:

            print("=" * 60)
            print("LOCALITY AI ERROR")
            print(
                "ERROR TYPE:",
                type(exc).__name__,
            )
            print(
                "ERROR:",
                str(exc),
            )
            print("=" * 60)

            return []

        # ====================================================
        # READ RESPONSE
        # ====================================================

        content = (
            response.choices[0]
            .message.content
        )

        print("=" * 60)
        print("RAW LOCALITY AI RESPONSE")
        print(repr(content))
        print("=" * 60)

        if not content:

            print(
                "LOCALITY AI RETURNED EMPTY CONTENT"
            )

            return []

        # ====================================================
        # CLEAN RESPONSE
        # ====================================================

        content = clean_json_text(
            content
        )

        print("=" * 60)
        print("CLEANED LOCALITY AI RESPONSE")
        print(repr(content))
        print("=" * 60)

        # ====================================================
        # PARSE JSON
        # ====================================================

        try:

            result = json.loads(
                content
            )

        except json.JSONDecodeError as exc:

            print("=" * 60)
            print("LOCALITY JSON PARSE ERROR")
            print(
                "ERROR:",
                str(exc),
            )
            print(
                "CONTENT:",
                content,
            )
            print("=" * 60)

            return []

        # ====================================================
        # GET CANDIDATES
        # ====================================================

        ai_candidates = result.get(
            "candidates",
            [],
        )

        print("=" * 60)
        print("AI CANDIDATES")
        print(ai_candidates)
        print("=" * 60)

        if not isinstance(
            ai_candidates,
            list,
        ):
            return []

        # ====================================================
        # VALIDATE AGAINST PROVIDED LIST
        # ====================================================

        allowed = {
            normalize_candidate(candidate): candidate
            for candidate
            in cleaned_candidates
        }

        valid = []

        for item in ai_candidates:

            if not isinstance(
                item,
                dict,
            ):
                continue

            name = str(
                item.get(
                    "name",
                    "",
                )
            ).strip()

            if not name:
                continue

            normalized_name = (
                normalize_candidate(
                    name
                )
            )

            # AI is only allowed to return
            # names we actually supplied.
            if normalized_name not in allowed:

                print(
                    "AI RETURNED UNKNOWN CANDIDATE:",
                    name,
                )

                continue

            try:

                confidence = int(
                    item.get(
                        "confidence",
                        0,
                    )
                )

            except (
                TypeError,
                ValueError,
            ):

                confidence = 0

            confidence = max(
                0,
                min(
                    100,
                    confidence,
                ),
            )

            valid.append(
                {
                    "name": allowed[
                        normalized_name
                    ],
                    "confidence": confidence,
                }
            )

        # ====================================================
        # SORT
        # ====================================================

        valid.sort(
            key=lambda item: item[
                "confidence"
            ],
            reverse=True,
        )

        print("=" * 60)
        print("VALID LOCALITY RESULTS")
        print(valid)
        print("=" * 60)

        return valid[:3]