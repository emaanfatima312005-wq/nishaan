import asyncio

from services.locality_candidate_service import (
    LocalityCandidateService,
)


async def main():

    print("=" * 60)
    print("NISHAAN LOCALITY CANDIDATE TEST")
    print("=" * 60)

    noisy_locality = "saath ka baad"
    city = "Rawalpindi"
    province = "Punjab"

    known_candidates = [
        "Sadiqabad",
        "Muslim Town",
        "Lal Kurti",
        "Chah Sultan",
        "Satellite Town",
        "Saddar",
        "Dhok Hassu",
        "Dhok Kala Khan",
        "Raja Bazaar",
        "Gawalmandi",
    ]

    print("Noisy phrase:", noisy_locality)
    print("City:", city)
    print("Province:", province)

    print()
    print("Candidates:")
    for candidate in known_candidates:
        print(" -", candidate)

    print()
    print("Calling AI...")
    print("=" * 60)

    result = await (
        LocalityCandidateService.rank_candidates(
            noisy_locality=noisy_locality,
            city=city,
            province=province,
            known_candidates=known_candidates,
        )
    )

    print()
    print("=" * 60)
    print("RESULT")
    print("=" * 60)

    if not result:
        print("NO MATCHES RETURNED")
    else:
        for item in result:
            print(
                "Name:",
                item.get("name"),
                "| Confidence:",
                item.get("confidence"),
            )

    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())