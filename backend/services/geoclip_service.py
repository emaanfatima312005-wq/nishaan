from pathlib import Path
import tempfile

from geoclip import GeoCLIP

from services.pakistan_geoclip import PakistanGeoCLIP


class GeoCLIPService:

    _model = None
    _pakistan_model = None

    @classmethod
    def get_model(cls):
        """
        Load GeoCLIP once and reuse it.
        """

        if cls._model is None:
            print("Loading GeoCLIP model...")

            cls._model = GeoCLIP()
            cls._model.eval()

            print("GeoCLIP model loaded.")

        return cls._model

    @classmethod
    def get_pakistan_model(cls):
        """
        Load Pakistan-filtered GeoCLIP once and reuse it.
        """

        if cls._pakistan_model is None:
            print(
                "Loading Pakistan GeoCLIP model..."
            )

            cls._pakistan_model = PakistanGeoCLIP(
                cls.get_model()
            )

            print(
                "Pakistan GeoCLIP model loaded."
            )

        return cls._pakistan_model

    @classmethod
    def predict_pakistan(
        cls,
        image_bytes: bytes,
        filename: str = "image.jpg",
        top_k: int = 10,
    ):
        """
        Predict top geographic candidates filtered
        to Pakistan only.

        Uses PakistanGeoCLIP to restrict predictions
        within Pakistan's geographic bounds.
        """

        suffix = Path(filename).suffix.lower()

        if not suffix:
            suffix = ".jpg"

        temp_path = None

        try:
            with tempfile.NamedTemporaryFile(
                suffix=suffix,
                delete=False,
            ) as temp_file:

                temp_file.write(image_bytes)
                temp_path = temp_file.name

            pakistan_model = (
                cls.get_pakistan_model()
            )

            return pakistan_model.predict(
                temp_path,
                top_k=top_k,
            )

        finally:

            if temp_path:

                try:
                    Path(temp_path).unlink()
                except OSError:
                    pass

    @classmethod
    def predict(
        cls,
        image_bytes: bytes,
        filename: str = "image.jpg",
        top_k: int = 5,
    ):
        """
        Predict top geographic candidates for an image.

        Returns a list of:
        {
            "latitude": ...,
            "longitude": ...,
            "probability": ...
        }
        """

        suffix = Path(filename).suffix.lower()

        if not suffix:
            suffix = ".jpg"

        temp_path = None

        try:
            with tempfile.NamedTemporaryFile(
                suffix=suffix,
                delete=False,
            ) as temp_file:

                temp_file.write(image_bytes)
                temp_path = temp_file.name

            model = cls.get_model()

            top_pred_gps, top_pred_prob = model.predict(
                temp_path,
                top_k=top_k,
            )

            predictions = []

            for i in range(top_k):

                latitude = float(
                    top_pred_gps[i][0]
                )

                longitude = float(
                    top_pred_gps[i][1]
                )

                probability = float(
                    top_pred_prob[i]
                )

                predictions.append(
                    {
                        "rank": i + 1,
                        "latitude": latitude,
                        "longitude": longitude,
                        "probability": probability,
                    }
                )

            return predictions

        finally:

            if temp_path:

                try:
                    Path(temp_path).unlink()
                except OSError:
                    pass