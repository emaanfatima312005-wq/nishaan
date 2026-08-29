from PIL import Image
import torch
import torch.nn.functional as F


class PakistanGeoCLIP:

    def __init__(self, model):
        self.model = model

        # Pakistan bounding box (broad safety bounds).
        self.min_lat = 23.5
        self.max_lat = 37.5
        self.min_lon = 60.5
        self.max_lon = 77.5

    def filter_gallery(self):
        """
        Return only GPS gallery points inside Pakistan's
        broad geographic bounds.
        """

        gallery = self.model.gps_gallery

        mask = (
            (gallery[:, 0] >= self.min_lat)
            & (gallery[:, 0] <= self.max_lat)
            & (gallery[:, 1] >= self.min_lon)
            & (gallery[:, 1] <= self.max_lon)
        )

        return gallery[mask]

    def predict(
        self,
        image_path: str,
        top_k: int = 5,
    ):
        """
        Run GeoCLIP against Pakistan-only GPS candidates.
        """

        image = self.model.image_encoder.preprocess_image(
            Image.open(image_path)
        )

        image = image.to(self.model.device)

        pakistan_gallery = self.filter_gallery()
        pakistan_gallery = pakistan_gallery.to(
            self.model.device
        )

        logits = self.model.forward(
            image,
            pakistan_gallery,
        )

        probabilities = (
            F.softmax(logits, dim=-1)
            .cpu()
        )

        top = torch.topk(
            probabilities,
            min(top_k, pakistan_gallery.shape[0]),
            dim=1,
        )

        gps = pakistan_gallery[
            top.indices[0]
        ]

        probs = top.values[0]

        predictions = []

        for i in range(len(gps)):

            predictions.append(
                {
                    "rank": i + 1,
                    "latitude": float(
                        gps[i][0]
                    ),
                    "longitude": float(
                        gps[i][1]
                    ),
                    "probability": float(
                        probs[i]
                    ),
                }
            )

        return predictions