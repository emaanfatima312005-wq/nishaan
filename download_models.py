"""
Pre-download the CLIP models used by GeoCLIP and StreetCLIP
into the Hugging Face cache so they are baked into the
deployment image.

Used by the Modal image build — see modal_app.py.
"""

from transformers import (
    AutoProcessor,
    CLIPModel,
    CLIPProcessor,
)

# GeoCLIP image-encoder backbone
CLIPModel.from_pretrained("openai/clip-vit-large-patch14")
AutoProcessor.from_pretrained("openai/clip-vit-large-patch14")

# StreetCLIP
CLIPModel.from_pretrained("geolocal/StreetCLIP")
CLIPProcessor.from_pretrained("geolocal/StreetCLIP")

print("Models cached.")
