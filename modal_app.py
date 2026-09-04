"""
Nishaan — Modal deployment for the AI backend.

The FastAPI backend (text / voice / image location analysis
with the GeoCLIP and StreetCLIP models) runs on Modal.
The Next.js frontend runs on Vercel and calls this API.

One-time setup (run from the repository root):

1. Create a free account: https://modal.com/signup
2. Create a secret named "Nishaan" in the Modal
   dashboard with:
       GROQ_API_KEY=...
       DATABASE_URL=...            (Neon Postgres with PostGIS)
       MAPILLARY_ACCESS_TOKEN=...
       ALLOWED_ORIGINS=https://your-app.vercel.app
3. Authenticate:    modal token new
4. Deploy:          modal deploy modal_app.py

The API is then served at the URL printed by the deploy
command (https://<workspace>--nishaan-api.modal.run).

The first request after a deploy loads the models (a few
minutes); later cold starts restore from a memory snapshot
in seconds.
"""

import sys

import modal

# Backend code is mounted here inside the container.
BACKEND_DIR = "/root/Nishaan"

# Files/directories inside backend/ that must not be
# uploaded (virtualenv, secrets, local test artifacts).
IGNORE_BACKEND = [
    "venv",
    "venv/**",
    "**/__pycache__",
    "**/__pycache__/**",
    ".env",
    ".env.*",
    "*.pyc",
    "uploads/**",
    "test_images/**",
    "static/**",
    "data/PK.zip",
    "test_*.py",
    "requirements*.txt",
]

image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("libgomp1")
    # CPU-only torch wheels — several GB smaller than the
    # default PyPI wheels, which bundle CUDA.
    .run_commands(
        "pip install --no-cache-dir torch==2.13.0"
        " torchvision==0.28.0"
        " --index-url https://download.pytorch.org/whl/cpu"
    )
    .pip_install_from_requirements(
        "backend/requirements-modal.txt"
    )
    # Bake the CLIP models into the image so containers
    # never download them at runtime.
    .env({"HF_HOME": "/root/.cache/huggingface"})
    .add_local_file(
        "download_models.py",
        "/root/download_models.py",
        # copy=True bakes the file into the image so the
        # model-download step below can run during build.
        copy=True,
    )
    .run_commands("python /root/download_models.py")
    # Backend code is mounted last so code changes do not
    # invalidate the heavy dependency / model layers.
    .add_local_dir(
        "backend",
        BACKEND_DIR,
        ignore=IGNORE_BACKEND,
    )
)

app = modal.App("nishaan")


@app.cls(
    image=image,
    secrets=[
        modal.Secret.from_name("Nishaan")
    ],
    cpu=2,
    memory=8192,
    timeout=600,
    # Keep a container warm for 5 minutes after the last
    # request so browsing sessions stay responsive.
    scaledown_window=300,
    # Capture the loaded models in a memory snapshot so
    # cold starts restore in seconds instead of minutes.
    enable_memory_snapshot=True,
)
@modal.concurrent(max_inputs=100)
class NishaanAPI:

    @modal.enter(snap=True)
    def load(self):
        """
        Heavy initialization, captured in the memory
        snapshot: import the API (torch etc.), load the
        GeoNames place database and both CLIP models.
        """

        from main import app as fastapi_app

        from services.geoclip_service import (
            GeoCLIPService,
        )

        from services.pakistan_place_recognizer import (
            PakistanPlaceRecognizer,
        )

        from services.streetclip_service import (
            StreetCLIPService,
        )

        PakistanPlaceRecognizer.load_places()
        GeoCLIPService.get_pakistan_model()
        StreetCLIPService._load_model()

        self.fastapi_app = fastapi_app

    @modal.asgi_app()
    def api(self):
        return self.fastapi_app


# Backend modules live in BACKEND_DIR (see add_local_dir).
sys.path.insert(0, BACKEND_DIR)
