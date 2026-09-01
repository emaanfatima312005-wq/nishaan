import re


CITY_ALIASES = {

    # Rawalpindi
    "راولپنڈی": "Rawalpindi",
    "راول پنڈی": "Rawalpindi",
    "راولپندی": "Rawalpindi",
    "راولپندی": "Rawalpindi",
    "راوپنڈی": "Rawalpindi",
    "راول پنڈی": "Rawalpindi",
    "والپنڈی": "Rawalpindi",

    # Lahore
    "لاہور": "Lahore",
    "لہور": "Lahore",

    # Islamabad
    "اسلام آباد": "Islamabad",
    "اسلام اباد": "Islamabad",
    "اسلاماباد": "Islamabad",

    # Karachi
    "کراچی": "Karachi",

    # Peshawar
    "پشاور": "Peshawar",

    # Multan
    "ملتان": "Multan",

    # Faisalabad
    "فیصل آباد": "Faisalabad",
    "فیصل اباد": "Faisalabad",

    # Gujranwala
    "گوجرانوالہ": "Gujranwala",

    # Sialkot
    "سیالکوٹ": "Sialkot",

    # Quetta
    "کوئٹہ": "Quetta",
}


def normalize_location_text(
    text: str,
) -> str:

    if not text:
        return text

    normalized = text

    # Longest strings first so multi-word names are
    # replaced before shorter fragments.
    aliases = sorted(
        CITY_ALIASES.items(),
        key=lambda item: len(item[0]),
        reverse=True,
    )

    for source, target in aliases:
        normalized = normalized.replace(
            source,
            target,
        )

    # Clean repeated whitespace.
    normalized = re.sub(
        r"\s+",
        " ",
        normalized,
    ).strip()

    return normalized