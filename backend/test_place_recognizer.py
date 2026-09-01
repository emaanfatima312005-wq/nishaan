from services.pakistan_place_recognizer import (
    PakistanPlaceRecognizer,
)


# ============================================================
# BASIC TESTS
# ============================================================

tests = [
    "Rawalpindi",
    "Sadiqabad",
    "Muslim Town",
    "Lal Kurti",
    "Kuri",
    "Haji Chowk",
    "Hathi Chowk",
    "Dera Ismail Khan",
]


for query in tests:

    print()
    print("=" * 60)
    print("QUERY:", query)
    print("=" * 60)

    results = (
        PakistanPlaceRecognizer.search(
            query=query,
            top_k=5,
            minimum_score=70,
        )
    )

    for result in results:

        print(
            {
                "name": result["name"],
                "score": result["match_score"],
                "lat": result["latitude"],
                "lon": result["longitude"],
                "feature": result["feature_code"],
                "province": result["province"],
                "district": result["district"],
                "population": result["population"],
            }
        )


# ============================================================
# RAW VOICE TEST
# ============================================================

voice_text = (
    "Rawalpindi saath ka baad mein "
    "paanch number wali gali"
)


print()
print("=" * 60)
print("CITY-FIRST VOICE TEST")
print("=" * 60)

print(
    "INPUT:",
    voice_text,
)


results = (
    PakistanPlaceRecognizer.search_sentence_with_city(
        text=voice_text,
        city="Rawalpindi",
        province="Punjab",
        top_k=15,
    )
)


if not results:

    print(
        "NO CITY-CONTEXT MATCHES"
    )

else:

    for result in results:

        print(
            {
                "name": result["name"],
                "matched_text": result.get(
                    "matched_text"
                ),
                "match_score": result[
                    "match_score"
                ],
                "context_score": result[
                    "context_score"
                ],
                "province": result[
                    "province"
                ],
                "district": result[
                    "district"
                ],
                "lat": result[
                    "latitude"
                ],
                "lon": result[
                    "longitude"
                ],
            }
        )