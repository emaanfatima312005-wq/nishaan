from pathlib import Path
import tempfile

import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel


class StreetCLIPService:

    _model = None
    _processor = None
    _device = None

    # ========================================================
    # MODEL LOADING
    # ========================================================

    @classmethod
    def _load_model(cls):
        if cls._model is not None:
            return

        print("=" * 60)
        print("LOADING STREETCLIP")
        print("=" * 60)

        cls._device = (
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        print(
            "StreetCLIP device:",
            cls._device,
        )

        cls._processor = (
            CLIPProcessor.from_pretrained(
                "geolocal/StreetCLIP"
            )
        )

        cls._model = CLIPModel.from_pretrained(
            "geolocal/StreetCLIP"
        )

        cls._model.to(cls._device)
        cls._model.eval()

        print("StreetCLIP loaded.")

    # ========================================================
    # CLASSIFICATION
    # ========================================================

    @classmethod
    def classify(
        cls,
        image_bytes: bytes,
        labels: list[str],
        top_k: int = 5,
    ):
        """
        Zero-shot geographic classification.

        labels should be geographic choices such as:
        [
            "Lahore, Pakistan",
            "Rawalpindi, Pakistan",
            "Karachi, Pakistan"
        ]
        """

        if not image_bytes:
            raise ValueError(
                "Image data is empty."
            )

        if not labels:
            raise ValueError(
                "No classification labels supplied."
            )

        cls._load_model()

        with tempfile.NamedTemporaryFile(
            suffix=".jpg",
            delete=False,
        ) as temp_file:

            temp_file.write(image_bytes)
            temp_path = temp_file.name

        try:

            image = Image.open(
                temp_path
            ).convert("RGB")

            # Use a geographic sentence rather than
            # bare city names.
            prompts = [
                f"A street-level photo in {label}"
                for label in labels
            ]

            inputs = cls._processor(
                text=prompts,
                images=image,
                return_tensors="pt",
                padding=True,
            )

            inputs = {
                key: value.to(cls._device)
                for key, value in inputs.items()
            }

            with torch.no_grad():

                outputs = cls._model(
                    **inputs
                )

                logits = (
                    outputs.logits_per_image
                )

                probabilities = (
                    torch.softmax(
                        logits,
                        dim=1,
                    )[0]
                )

            top_k = min(
                top_k,
                len(labels),
            )

            values, indices = torch.topk(
                probabilities,
                k=top_k,
            )

            predictions = []

            for rank, (
                probability,
                index,
            ) in enumerate(
                zip(values, indices),
                start=1,
            ):

                predictions.append(
                    {
                        "rank": rank,
                        "label": labels[
                            int(index)
                        ],
                        "probability": float(
                            probability
                        ),
                    }
                )

            return predictions

        finally:

            try:
                Path(temp_path).unlink()
            except OSError:
                pass

    # ========================================================
    # COUNTRY
    # ========================================================

    @classmethod
    def classify_country(
        cls,
        image_bytes: bytes,
    ):
        countries = [
            "Pakistan",
            "India",
            "Bangladesh",
            "Nepal",
            "Sri Lanka",
            "Afghanistan",
            "United Arab Emirates",
            "Turkey",
            "United Kingdom",
            "United States",
        ]

        return cls.classify(
            image_bytes=image_bytes,
            labels=countries,
            top_k=5,
        )

    # ========================================================
    # PAKISTAN PROVINCE / REGION
    # ========================================================

    @classmethod
    def classify_pakistan_region(
        cls,
        image_bytes: bytes,
    ):
        regions = [
            "Punjab, Pakistan",
            "Sindh, Pakistan",
            "Khyber Pakhtunkhwa, Pakistan",
            "Balochistan, Pakistan",
            "Islamabad Capital Territory, Pakistan",
            "Azad Kashmir, Pakistan",
            "Gilgit-Baltistan, Pakistan",
        ]

        return cls.classify(
            image_bytes=image_bytes,
            labels=regions,
            top_k=7,
        )

    # ========================================================
    # PAKISTAN CITIES
    # ========================================================

    @classmethod
    def classify_pakistan_city(
        cls,
        image_bytes: bytes,
    ):
        cities = [
            "Lahore, Punjab, Pakistan",
            "Rawalpindi, Punjab, Pakistan",
            "Islamabad, Pakistan",
            "Faisalabad, Punjab, Pakistan",
            "Multan, Punjab, Pakistan",
            "Gujranwala, Punjab, Pakistan",
            "Sialkot, Punjab, Pakistan",
            "Karachi, Sindh, Pakistan",
            "Hyderabad, Sindh, Pakistan",
            "Peshawar, Khyber Pakhtunkhwa, Pakistan",
            "Quetta, Balochistan, Pakistan",
            "Abbottabad, Khyber Pakhtunkhwa, Pakistan",
            "Murree, Punjab, Pakistan",
        ]

        return cls.classify(
            image_bytes=image_bytes,
            labels=cities,
            top_k=8,
        )