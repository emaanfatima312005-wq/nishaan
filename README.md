# Nishaan 🇵🇰

### AI-Powered Local Location Discovery for Pakistan

> **Google Maps expects an address. Nishaan understands how people actually give directions.**

Nishaan is an AI-powered geographic location discovery system designed for Pakistan.

People do not always describe a location using formal addresses. Instead, they often use **local landmarks, neighbourhood names, gali numbers, roads, bazaars, mosques, schools, shops, and conversational directions**.

For example:

> “Rawalpindi mein Sadiqabad ke paas Street No 5, bari masjid ke qareeb.”

Traditional address-based systems may struggle with descriptions like this.

Nishaan converts these human-described clues into structured geographic information and attempts to verify the resulting location using geographic datasets and OpenStreetMap.

---

## 🚀 What Nishaan Does

Nishaan accepts location clues through multiple input types:

* 📝 Text
* 🎙️ Voice
* 📷 Images
* 🔀 Combined text + image evidence

The system extracts geographic clues such as:

* Province
* City
* Town
* Area
* Street / Road
* House number
* Named localities
* Landmarks

It then uses geographic verification to determine the most plausible real-world location.

### Core idea

```text
Human description
        ↓
AI geographic clue extraction
        ↓
Locality / place recognition
        ↓
Geographic context resolution
        ↓
OpenStreetMap verification
        ↓
Nearby landmark evidence
        ↓
Coordinates + structured location
```

---

# 🎯 Problem

Pakistan has many locations that are difficult to describe using conventional postal addresses.

A person may identify a place using something like:

> “Saddar se andar jao, Sadiqabad wali gali mein, masjid ke paas.”

The description may contain:

* informal locality names
* Roman Urdu
* Urdu
* speech-to-text errors
* ambiguous neighbourhood names
* incomplete street information
* landmarks instead of addresses

These descriptions are meaningful to humans but difficult for traditional geocoding systems.

Nishaan is designed around **how people actually describe places** rather than forcing them to provide a formal address.

---

# 💡 Solution

Nishaan separates the problem into two major stages.

## 1. Understand the human description

An AI model extracts useful geographic clues from the user's description.

For example:

```json
{
  "province": "Punjab",
  "city": "Rawalpindi",
  "town": "Saddar",
  "area": "Sadiqabad",
  "street": "Street No 5",
  "house_number": null,
  "place_names": [
    "Sadiqabad"
  ],
  "landmarks": [
    "mosque"
  ],
  "confidence": 85
}
```

The AI is intentionally **not responsible for blindly deciding geographic truth**.

It extracts what the user said.

---

## 2. Verify it geographically

The extracted information is then passed through geographic resolution.

Nishaan uses:

* GeoNames Pakistan place data
* OpenStreetMap
* Nominatim
* Overpass API
* geographic context
* locality matching
* nearby landmark evidence

The system tries to establish:

```text
Is this actually in the requested city?

Does the area exist there?

Does the street exist inside that area?

Do nearby landmarks support the result?

Do the geographic coordinates make sense?
```

This helps prevent a generic location with a similar name from being incorrectly selected.

---

# 🧠 Roman Urdu Support

Nishaan is designed for **Roman Urdu and conversational Pakistani speech**.

Examples include:

```text
Rawalpindi mein Saddar ke paas aik masjid hai
```

or:

```text
sadiqabad wali gali mein ghar hai
```

Voice input can be transcribed and converted into a form suitable for geographic analysis.

This allows users to describe locations naturally instead of learning a formal address format.

---

# 🎙️ Voice Pipeline

The voice pipeline works approximately as follows:

```text
Audio
  ↓
Whisper speech recognition
  ↓
Urdu transcription
  ↓
Roman Urdu conversion
  ↓
AI location extraction
  ↓
Geographic resolution
  ↓
Verified coordinates
```

The API preserves the original transcription as well as the Roman Urdu version used by the location-analysis pipeline.

---

# 📷 Image Analysis

Nishaan can also analyze geographic information contained in images.

It looks for evidence such as:

* road signs
* street names
* shop names
* mosque names
* school names
* market names
* building names
* visible house numbers
* Urdu text
* English text
* other geographic clues

The image-analysis pipeline attempts to distinguish meaningful geographic evidence from irrelevant numbers such as phone numbers, shop numbers, or plot numbers.

---

# 🔀 Combined Analysis

Nishaan can combine multiple forms of evidence.

For example:

```text
User text
     +
Image
     ↓
Combined geographic reasoning
     ↓
Location candidate
```

This is useful when the text provides context while the image provides a visible street sign, house number, shop name, or landmark.

---

# 🗺️ Geographic Resolution

One of Nishaan's key components is its universal geographic resolver.

The system does not hard-code a particular city.

Instead, it uses the geographic information extracted from the user's input:

```text
Province
   ↓
City
   ↓
Town / Area
   ↓
Street
   ↓
Landmarks
   ↓
OSM verification
```

For locations containing an area and street, Nishaan can first identify the area and then use that geographic context when searching for the street.

This reduces the chance of matching a similarly named street somewhere else.

---

# 🔎 Place Recognition

Nishaan includes a Pakistan place-recognition system backed by a large GeoNames Pakistan dataset.

The system currently works with approximately:

```text
229,000+ Pakistani geographic records
```

It uses fuzzy matching to handle:

* spelling differences
* Roman Urdu variations
* partial similarity
* noisy speech recognition
* similar locality names

The system also uses geographic context such as province and district when ranking candidates.

---

# 📍 Landmark Evidence

Location identification can become stronger when nearby geographic evidence supports a candidate.

Nishaan can query nearby OpenStreetMap objects such as:

* Mosques
* Schools
* Banks
* Markets
* Shops
* Hospitals

Nearby evidence is treated as **supporting evidence**, rather than blindly determining the location.

Example:

```text
Candidate location
       ↓
Search nearby OSM objects
       ↓
Compare against requested landmark
       ↓
Add supporting evidence
```

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │   Nishaan UI     │
                         │    Next.js       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    FastAPI       │
                         │     Backend      │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
          Text Analysis      Voice Analysis   Image Analysis
                 │                │                │
                 │          Whisper / ASR          │
                 │                │                │
                 └────────────────┼────────────────┘
                                  ▼
                         ┌──────────────────┐
                         │ LocationAnalyzer │
                         │      (Groq)      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Locality / Place │
                         │   Recognition    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Universal        │
                         │ Location Resolver│
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
               GeoNames        Nominatim     Overpass
               Pakistan          OSM           OSM
                    │             │             │
                    └─────────────┼─────────────┘
                                  ▼
                         ┌──────────────────┐
                         │ Final Geographic │
                         │ Result + Evidence│
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   PostgreSQL     │
                         └──────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React
* Tailwind CSS
* React Icons
* AOS

## Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* PostgreSQL
* GeoAlchemy

## AI / Speech

* Groq API
* Large language models
* Whisper
* Vision-capable AI models

## Geographic Data

* GeoNames
* OpenStreetMap
* Nominatim
* Overpass API
* Mapillary

## Matching

* RapidFuzz
* Geographic distance calculations
* Context-aware locality matching

---

# 📡 API Endpoints

### Text Analysis

```http
POST /api/location/analyze
```

Accepts a textual location clue and returns structured geographic information.

---

### Voice Analysis

```http
POST /api/analyze/voice
```

Accepts an audio recording, transcribes it, and analyzes the resulting location description.

---

### Image Analysis

```http
POST /api/analyze/image
```

Accepts an image and extracts geographic clues.

---

### Combined Analysis

```http
POST /api/analyze/combined
```

Combines textual / voice evidence with image evidence.

---

### Nearby OSM Places

```http
GET /api/osm/nearby
```

Returns nearby OpenStreetMap places that can be used as supporting geographic evidence.

---

### Mapillary

```http
GET /api/mapillary/nearby
```

Retrieves nearby Mapillary imagery where available.

---

# 🗄️ Database

Nishaan uses PostgreSQL for storing location requests and results.

The backend includes tables for concepts such as:

```text
landmarks
location_requests
location_results
```

Temporary uploaded request data can be associated with expiration timestamps so that temporary data does not remain indefinitely.

---

# ⚙️ Setup

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd nishaan
```

---

## 2. Create the Python environment

```bash
cd backend

python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure environment variables

Create:

```text
backend/.env
```

Example:

```env
GROQ_API_KEY=your_groq_api_key

DATABASE_URL=postgresql://username:password@localhost:5432/nishaan
```

Use your own PostgreSQL credentials and API key.

---

# ▶️ Running the Backend

From the `backend` directory:

```powershell
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

OpenAPI specification:

```text
http://127.0.0.1:8000/openapi.json
```

---

# ▶️ Running the Frontend

From the frontend directory:

```bash
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

# 🚢 Deployment (Docker)

Nishaan ships as a **single Docker container**: the
Next.js frontend is exported to static files and served by
the FastAPI backend from the same origin, alongside the
GeoCLIP and StreetCLIP image-geolocation models.

## Build the image

```bash
docker build -t nishaan .
```

## Run it

```bash
docker run --rm -p 7860:7860 \
  -e GROQ_API_KEY=your_groq_key \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e MAPILLARY_ACCESS_TOKEN=your_token \
  nishaan
```

The full application (frontend + API) is then available at:

```text
http://localhost:7860
```

## Required environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | Groq API key for AI analysis and transcription |
| `DATABASE_URL` | Yes | PostgreSQL connection string with PostGIS (e.g. [Neon](https://neon.tech)) — the extension is enabled automatically at startup |
| `MAPILLARY_ACCESS_TOKEN` | Optional | Enables nearby Mapillary imagery |
| `ALLOWED_ORIGINS` | Optional | Comma-separated CORS origins (only needed when frontend and backend run on separate origins) |

See [backend/.env.example](backend/.env.example) for details.

## Deploying to Modal (backend) + Vercel (frontend)

The recommended free deployment runs the AI backend on
[Modal](https://modal.com) (Starter plan: $30/month of free
compute credits, no credit card) and the frontend on
[Vercel](https://vercel.com) (free tier, always-on CDN).

### Backend — Modal

1. Create a free [Modal](https://modal.com/signup) account.
2. In the Modal dashboard create a secret named
   `nishaan-secrets` containing `GROQ_API_KEY`,
   `DATABASE_URL`, `MAPILLARY_ACCESS_TOKEN` and
   `ALLOWED_ORIGINS` (the frontend URL, e.g.
   `https://your-app.vercel.app`).
3. Authenticate and deploy from the repository root:

```bash
pip install modal
modal token new
modal deploy modal_app.py
```

The API is served at the URL printed by the deploy command
(`https://<workspace>--nishaan-api.modal.run`). The first
request after a deploy loads the AI models (a few minutes);
later cold starts restore from a memory snapshot in seconds.

### Frontend — Vercel

Import the repository into Vercel and set the
`NEXT_PUBLIC_API_URL` environment variable to the Modal API
URL before the first build, so the frontend calls the right
backend.

---

# 🧪 Testing

Nishaan contains dedicated tests for important components of the geographic pipeline.

Examples include:

```text
test_place_recognizer.py
test_locality_candidates.py
test_universal_resolver.py
```

Example place-recognition tests can include:

```text
Rawalpindi
Sadiqabad
Muslim Town
Lal Kurti
Kuri
Haji Chowk
Hathi Chowk
Dera Ismail Khan
```

The purpose is to evaluate how the geographic system behaves with exact names, ambiguous names, and noisy speech.

---

# 🔐 Design Principles

### Extract first, verify later

The AI should extract what the user said rather than inventing geographic truth.

### Geographic context matters

A name like "Sadiqabad" can exist in multiple places. Nishaan therefore uses city, province, locality, and geographic context when possible.

### Never trust one signal blindly

A fuzzy name match alone is not enough.

Nishaan combines:

```text
AI extraction
+
place recognition
+
geographic context
+
OSM verification
+
nearby evidence
```

### Universal, not city-specific

The system is intended to work across Pakistani cities rather than relying on city-specific hard-coded rules.

---

# 🌟 Why Nishaan?

Traditional map systems are built around structured addresses.

Nishaan is built around **human descriptions**.

Instead of asking:

> "What is the exact street address?"

Nishaan asks:

> "What clues did this person give me, and where could those clues actually point?"

That makes Nishaan particularly relevant for places where people commonly navigate using:

* local neighbourhoods
* landmarks
* informal street names
* gali numbers
* bazaars
* mosques
* schools
* shops
* conversational directions

---

# 🚧 Current Limitations

Nishaan is an experimental geographic discovery system and geographic coverage depends on available mapping data.

Some streets, informal localities, landmarks, and house-level addresses may not exist in OpenStreetMap or other geographic datasets.

Voice transcription can also introduce errors, particularly with:

* uncommon locality names
* Urdu names
* similar-sounding words
* numbers
* mixed Urdu / English speech

For this reason, Nishaan returns confidence and supporting evidence rather than pretending that every result is certain.

---

# 🔮 Future Improvements

Possible future improvements include:

* Better Roman Urdu phonetic matching
* More robust Urdu ↔ Roman Urdu normalization
* Improved house-level resolution
* Stronger landmark-to-location reasoning
* More mapping providers
* Richer Mapillary integration
* Turn-by-turn navigation
* User feedback for correcting incorrect results
* Learning from successful location resolutions
* Better handling of highly ambiguous localities

---

# 🏆 Hackathon Vision

Nishaan is more than another geocoder.

It is an attempt to bridge the gap between:

```text
HOW PEOPLE DESCRIBE A PLACE
              ↓
        AI UNDERSTANDING
              ↓
HOW COMPUTERS MAP THAT PLACE
```

### Nishaan's core proposition:

> **Google Maps expects an address. Nishaan understands how people actually give directions.**

---

## 👩‍💻 Project

**Nishaan**

AI-powered location discovery for Pakistan.

Built with:

```text
Next.js
React
FastAPI
Python
PostgreSQL
Groq
Whisper
GeoNames
OpenStreetMap
Nominatim
Overpass
Mapillary
RapidFuzz
```

---

## 📄 License

Add your chosen project license here, for example:

```text
MIT License
```

or replace this section with your institution / hackathon project's licensing terms.
