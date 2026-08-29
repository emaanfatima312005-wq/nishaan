from pathlib import Path
import tempfile

from geoclip import GeoCLIP


class GeoCLIPService:

    _model = None

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