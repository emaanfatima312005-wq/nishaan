# ============================================================
# NISHAAN — single-container deployment
#
# Frontend (Next.js static export) + Backend (FastAPI + ML
# models) served from one origin by Uvicorn.
# ============================================================

# ------------------------------------------------------------
# Stage 1 — build the Next.js frontend
# ------------------------------------------------------------
FROM node:22-slim AS frontend

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY app ./app
COPY components ./components
COPY public ./public
COPY next.config.mjs postcss.config.mjs tsconfig.json eslint.config.mjs ./

ENV NEXT_TELEMETRY_DISABLED=1

# Production build: the backend serves the frontend itself,
# so API calls use relative paths.
ENV NEXT_PUBLIC_API_URL=""

RUN npm run build

# ------------------------------------------------------------
# Stage 2 — FastAPI backend + ML models
# ------------------------------------------------------------
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# libgomp1 is required by torch on CPU
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/requirements.txt ./requirements.txt

# CPU-only torch keeps the image several GB smaller than the
# default PyPI wheels (which bundle CUDA).
RUN pip install torch==2.13.0 torchvision==0.28.0 \
        --index-url https://download.pytorch.org/whl/cpu \
    && pip install -r requirements.txt

COPY backend/ .

# The exported frontend is served by FastAPI at /
COPY --from=frontend /build/out ./static

# Pre-download the ML models (GeoCLIP + StreetCLIP) so the
# first request does not wait for a multi-GB download.
RUN python -c "\
from services.geoclip_service import GeoCLIPService; \
from services.streetclip_service import StreetCLIPService; \
GeoCLIPService.get_pakistan_model(); \
StreetCLIPService._load_model()"

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
