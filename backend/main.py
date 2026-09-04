import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from database.connection import Base, engine

from routes.location import router as location_router
from routes.voice import router as voice_router
from routes.image import router as image_router
from routes.combined import router as combined_router
from routes.osm_test import router as osm_test_router
from routes.mapillary import router as mapillary_router


# ============================================================
# DATABASE
# ============================================================

def init_database():
    """
    Create the PostGIS extension (needed by the geometry
    columns) and all application tables.

    A database failure must not stop the API from booting,
    so errors are logged instead of raised.
    """

    if engine is None:
        print(
            "WARNING: DATABASE_URL is not set — "
            "database features are disabled."
        )
        return

    try:
        with engine.connect() as connection:
            connection.execute(
                text(
                    "CREATE EXTENSION IF NOT EXISTS postgis"
                )
            )

            connection.commit()

        Base.metadata.create_all(
            bind=engine
        )

        print("DATABASE READY")

    except Exception as error:
        print("=" * 60)
        print("DATABASE INITIALIZATION FAILED")
        print(error)
        print("=" * 60)


init_database()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Nishaan API",
    description="AI-powered location discovery backend",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================
# Only needed when the frontend and backend run on separate
# origins (local development). In production the backend
# serves the frontend itself, so no CORS is required.

_default_origins = "http://localhost:3000"

allow_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        _default_origins,
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(
    location_router
)

app.include_router(
    voice_router
)

app.include_router(
    image_router
)

app.include_router(
    combined_router
)

app.include_router(
    osm_test_router
)

app.include_router(
    mapillary_router
)


# ============================================================
# ROOT
# ============================================================

# Health check for monitoring / load balancers.
# The root path "/" is served by the frontend (below).
@app.get("/api/health")
async def health():
    return {
        "message": "Nishaan API is running",
        "status": "online",
    }


# ============================================================
# FRONTEND
# ============================================================
# Serve the exported Next.js frontend when it is present
# (the Docker image copies it to backend/static). Mounted
# after the API routes so /api/* always wins.

STATIC_DIR = (
    Path(__file__).resolve().parent / "static"
)

if STATIC_DIR.is_dir():
    app.mount(
        "/",
        StaticFiles(
            directory=str(STATIC_DIR),
            html=True,
        ),
        name="frontend",
    )