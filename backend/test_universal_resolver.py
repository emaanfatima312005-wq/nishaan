import asyncio

from services.universal_location_resolver import (
    UniversalLocationResolver,
)


async def main():

    result = await (
        UniversalLocationResolver.resolve(
            province="Punjab",
            city="Rawalpindi",
            town=None,
            area="Sadiqabad",
            street="Street No 5",
            house_number=None,
            place_names=[
                "Sadiqabad",
            ],
            landmarks=[],
        )
    )

    print()
    print("=" * 70)
    print("TEST RESULT")
    print("=" * 70)
    print(result)


if __name__ == "__main__":
    asyncio.run(main())