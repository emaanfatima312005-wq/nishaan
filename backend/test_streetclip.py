from pathlib import Path

from services.streetclip_service import (
    StreetCLIPService,
)


IMAGE_PATH = Path(
    "test_images/test_loc.jpeg"
)


with open(
    IMAGE_PATH,
    "rb",
) as file:

    image_bytes = file.read()


print()
print("=" * 60)
print("STREETCLIP COUNTRY")
print("=" * 60)

country_results = (
    StreetCLIPService.classify_country(
        image_bytes
    )
)

for result in country_results:
    print(result)


print()
print("=" * 60)
print("STREETCLIP PAKISTAN REGION")
print("=" * 60)

region_results = (
    StreetCLIPService.classify_pakistan_region(
        image_bytes
    )
)

for result in region_results:
    print(result)


print()
print("=" * 60)
print("STREETCLIP PAKISTAN CITY")
print("=" * 60)

city_results = (
    StreetCLIPService.classify_pakistan_city(
        image_bytes
    )
)

for result in city_results:
    print(result)