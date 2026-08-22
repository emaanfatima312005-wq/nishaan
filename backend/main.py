from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.location import router as location_router
from routes.voice import router as voice_router


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

    allow_origins=[
        "http://localhost:3000",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(location_router)
app.include_router(voice_router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
async def root():

    return {
        "message": "Nishaan API is running",
        "status": "online",
    }