from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from database.connection import Base, engine
from models.database import (
    LocationRequestDB,
    LocationResultDB,
    LandmarkDB,
)
=======

from database.connection import Base, engine
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

from routes.location import router as location_router
from routes.voice import router as voice_router
from routes.image import router as image_router
from routes.combined import router as combined_router
from routes.osm_test import router as osm_test_router
<<<<<<< HEAD
from routes.mapillary import (
    router as mapillary_router,
)
Base.metadata.create_all(bind=engine)
=======
from routes.mapillary import router as mapillary_router


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889

app = FastAPI(
    title="Nishaan API",
    description="AI-powered location discovery backend",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD

    allow_origins=[
        "http://localhost:3000",
    ],

    allow_credentials=True,

    allow_methods=["*"],

=======
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

<<<<<<< HEAD
app.include_router(location_router)
app.include_router(voice_router)
app.include_router(image_router)
app.include_router(combined_router)
app.include_router(osm_test_router)
=======
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

>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
app.include_router(
    mapillary_router
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
async def root():
<<<<<<< HEAD

=======
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
    return {
        "message": "Nishaan API is running",
        "status": "online",
    }