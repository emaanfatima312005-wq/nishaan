"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiMapPin,
  FiNavigation,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import "leaflet/dist/leaflet.css";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[500px] items-center justify-center bg-[#C8E6C9]">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#5FAF5F] border-t-[#0D3B0D]" />

        <p className="text-sm font-semibold text-[#0D3B0D]">Loading map...</p>
      </div>
    </div>
  ),
});

// No hardcoded location data.
// Real API results only.

const aiSteps = [
  {
    title: "Read location clues",
    description:
      "Nishaan analyzed the landmarks and details provided in your description.",
  },
  {
    title: "Identified province",
    description: "The clues were matched with locations in Punjab.",
  },
  {
    title: "Narrowed down the city",
    description:
      "Nearby cities and landmarks were compared to find the strongest match.",
  },
  {
    title: "Matched the area",
    description:
      "The surrounding area was compared with the landmarks mentioned in your clue.",
  },
  {
    title: "Matched the street",
    description:
      "Street-level information was checked to identify the most likely destination.",
  },
];

export default function ResultPage() {
  const router = useRouter();

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [apiError, setApiError] = useState(null);

  // =========================================================
  // READ REAL API RESULT FROM SESSION STORAGE
  // =========================================================

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nishaan_text_result");

      if (!stored) {
        setApiError("No text analysis result was found.");
        return;
      }

      const result = JSON.parse(stored);

      if (result.status === "error") {
        setApiError(result.message || "Text analysis failed.");
        return;
      }

      setLocationData({
        province: result.province || "",
        city: result.city || "",
        town: result.town || "",
        area: result.area || "",
        street: result.street || "",
        latitude: Number(result.latitude),
        longitude: Number(result.longitude),
        confidence: Math.max(0, Math.min(100, Number(result.confidence ?? 0))),
        landmarks: result.landmarks || [],
        place_names: result.place_names || [],
      });
    } catch (error) {
      console.error("Could not read text result:", error);
      setApiError("Could not read analysis result.");
    }
  }, []);

  // =========================================================
  // GET USER'S CURRENT LOCATION
  // =========================================================

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location access is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationError("");
      },
      () => {
        setLocationError(
          "Your current location could not be accessed. You can still open the destination in Google Maps.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);

  // =========================================================
  // SEARCH AGAIN
  // =========================================================

  const handleSearchAgain = () => {
    sessionStorage.removeItem("nishaan_text_result");
    router.push("/text");
  };

  // =========================================================
  // GET DIRECTIONS
  // =========================================================

  const handleDirections = () => {
    if (
      !locationData ||
      !Number.isFinite(locationData.latitude) ||
      !Number.isFinite(locationData.longitude)
    ) {
      return;
    }

    // If user's location is available,
    // open directions from current location to destination.
    if (userLocation) {
      const url =
        `https://www.google.com/maps/dir/` +
        `${userLocation.latitude},${userLocation.longitude}/` +
        `${locationData.latitude},${locationData.longitude}`;

      window.open(url, "_blank", "noopener,noreferrer");

      return;
    }

    // If user's location is unavailable,
    // open the destination directly in Google Maps.
    const destinationUrl =
      `https://www.google.com/maps/search/?api=1&query=` +
      `${locationData.latitude},${locationData.longitude}`;

    window.open(destinationUrl, "_blank", "noopener,noreferrer");
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (locationData === null && apiError === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfcf7] px-5">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#C8E6C9] border-t-[#0D3B0D]" />

          <p className="mt-4 text-sm text-[#1A1A1A]/60">Loading result...</p>
        </div>
      </main>
    );
  }

  // =========================================================
  // API ERROR
  // =========================================================

  if (apiError) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-[#fbfcf7] px-5">
        <div className="pointer-events-none absolute left-[-150px] top-[15%] h-[500px] w-[500px] rounded-full bg-[#5FAF5F]/10 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-[10%] right-[-150px] h-[500px] w-[500px] rounded-full bg-[#2F6B2F]/10 blur-[120px]" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3B0D]">
            <FiMapPin size={25} className="text-[#5FAF5F]" />
          </div>

          <p className="mt-6 text-lg font-semibold text-[#0D3B0D]">
            Text analysis failed.
          </p>

          <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/60">{apiError}</p>

          <button
            onClick={handleSearchAgain}
            className="mt-6 flex items-center gap-2 rounded-xl border border-[#2F6B2F] bg-[#fbfcf7] px-5 py-3 text-sm font-bold text-[#0D3B0D] transition hover:bg-[#C8E6C9]/40"
          >
            <FiRefreshCw size={17} />
            Search Again
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // INVALID COORDINATES
  // =========================================================

  if (
    !Number.isFinite(locationData.latitude) ||
    !Number.isFinite(locationData.longitude)
  ) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-[#fbfcf7] px-5">
        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3B0D]">
            <FiMapPin size={25} className="text-[#5FAF5F]" />
          </div>

          <p className="mt-6 text-lg font-semibold text-[#0D3B0D]">
            Location could not be verified.
          </p>

          <p className="mt-3 text-sm text-[#1A1A1A]/60">
            Nishaan could not find geographic coordinates for this description.
          </p>

          <button
            onClick={handleSearchAgain}
            className="mt-6 flex items-center gap-2 rounded-xl border border-[#2F6B2F] bg-[#fbfcf7] px-5 py-3 text-sm font-bold text-[#0D3B0D] transition hover:bg-[#C8E6C9]/40"
          >
            <FiRefreshCw size={17} />
            Search Again
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN RESULT PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#C8E6C9] bg-[#fbfcf7]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Back */}

          <button
            onClick={() => router.push("/text")}
            className="flex items-center gap-2 text-sm font-semibold text-[#2F6B2F] transition hover:text-[#0D3B0D]"
          >
            <FiArrowLeft size={17} />
            Back
          </button>

          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D3B0D] text-[#fbfcf7]">
              <FiMapPin size={19} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#0D3B0D]">Nishaan</h1>

              <p className="text-[10px] text-[#2F6B2F]">AI Location Finder</p>
            </div>
          </div>

          {/* Status */}

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#5FAF5F]" />

            <span className="hidden text-xs font-semibold text-[#2F6B2F] sm:block">
              Location Found
            </span>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-7 md:px-6">
        {/* SUCCESS HEADING */}

        <div className="mb-7">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C8E6C9] text-[#0D3B0D]">
              <FiCheck size={18} />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#2F6B2F]">
              Search Complete
            </span>
          </div>

          <h2 className="text-3xl font-bold text-[#0D3B0D] md:text-4xl">
            We found your location
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#1A1A1A]/60">
            Nishaan followed your clues and identified the location that best
            matches your description.
          </p>
        </div>

        {/* =====================================================
            MAP + RESULT
        ===================================================== */}

        <div className="grid overflow-hidden rounded-3xl border border-[#C8E6C9] bg-[#fbfcf7] shadow-xl lg:grid-cols-[1.15fr_0.85fr]">
          {/* =================================================
              LEFT — ACTUAL MAP
          ================================================= */}

          <div className="relative min-h-[550px] lg:min-h-[680px]">
            <MapView
              destination={{
                latitude: locationData.latitude,
                longitude: locationData.longitude,
              }}
              userLocation={userLocation}
              locationInfo={{
                area: locationData.area,
                city: locationData.city,
                street: locationData.street,
              }}
            />

            {/* MAP BADGE */}

            <div className="absolute left-5 top-5 z-[500] flex items-center gap-2 rounded-full border border-[#C8E6C9] bg-[#fbfcf7]/95 px-4 py-2 shadow-lg backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#5FAF5F]" />

              <span className="text-xs font-bold text-[#0D3B0D]">
                OpenStreetMap
              </span>
            </div>
          </div>

          {/* =================================================
              RIGHT — INFORMATION
          ================================================= */}

          <div className="flex flex-col p-6 md:p-8">
            {/* LOCATION FOUND */}

            <div className="rounded-2xl bg-[#0D3B0D] p-5 text-[#fbfcf7]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5FAF5F]">
                    Destination Found
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {locationData.street || "Location identified"}
                  </h3>

                  <p className="mt-1 text-sm text-[#C8E6C9]">
                    {[locationData.area, locationData.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2F6B2F]">
                  <FiMapPin size={19} />
                </div>
              </div>

              {/* CONFIDENCE */}

              <div className="mt-5 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2F6B2F]">
                  <div
                    className="h-full rounded-full bg-[#5FAF5F] transition-all duration-1000"
                    style={{
                      width: `${locationData.confidence}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-[#C8E6C9]">
                  {locationData.confidence}%
                </span>
              </div>

              <p className="mt-2 text-[10px] text-[#C8E6C9]/70">
                Match confidence
              </p>
            </div>

            {/* =================================================
                LOCATION DETAILS
            ================================================= */}

            <div className="mt-6">
              <h3 className="text-sm font-bold text-[#0D3B0D]">
                Location details
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <LocationDetail
                  label="Province"
                  value={locationData.province}
                />

                <LocationDetail label="City" value={locationData.city} />

                <LocationDetail label="Town" value={locationData.town} />

                <LocationDetail label="Area" value={locationData.area} />

                <div className="col-span-2">
                  <LocationDetail label="Street" value={locationData.street} />
                </div>
              </div>
            </div>

            {/* =================================================
                AI SEARCH JOURNEY
            ================================================= */}

            <div className="mt-7">
              <h3 className="text-sm font-bold text-[#0D3B0D]">
                How Nishaan found it
              </h3>

              <div className="mt-4 space-y-4">
                {aiSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="relative flex shrink-0 flex-col items-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2F6B2F] text-[#fbfcf7]">
                        <FiCheck size={13} />
                      </div>

                      {index !== aiSteps.length - 1 && (
                        <div className="mt-1 h-full w-px bg-[#C8E6C9]" />
                      )}
                    </div>

                    <div className="pb-2">
                      <p className="text-xs font-bold text-[#0D3B0D]">
                        {step.title}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-[#1A1A1A]/55">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                LANDMARK CLUE
            ================================================= */}

            <div className="mt-5 rounded-xl border border-[#5FAF5F]/20 bg-[#C8E6C9]/30 p-4">
              <div className="flex gap-3">
                <FiSearch
                  className="mt-0.5 shrink-0 text-[#2F6B2F]"
                  size={16}
                />

                <div>
                  <p className="text-xs font-bold text-[#0D3B0D]">Clues used</p>

                  <p className="mt-1 text-[11px] leading-5 text-[#2F6B2F]">
                    Nishaan used landmarks and location details from your
                    original description to narrow down this area.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-auto pt-7">
              {locationError && (
                <p className="mb-3 text-xs leading-5 text-amber-700">
                  {locationError}
                </p>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* SEARCH AGAIN */}

                <button
                  onClick={handleSearchAgain}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#2F6B2F]
                    bg-[#fbfcf7]
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-[#0D3B0D]
                    transition
                    hover:bg-[#C8E6C9]/40
                  "
                >
                  <FiRefreshCw size={17} />
                  Search Again
                </button>

                {/* DIRECTIONS */}

                <button
                  onClick={handleDirections}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#0D3B0D]
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-[#fbfcf7]
                    transition
                    hover:bg-[#2F6B2F]
                    hover:shadow-lg
                  "
                >
                  <FiNavigation size={17} />

                  {userLocation ? "Get Directions" : "Open in Maps"}

                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================================
   LOCATION DETAIL COMPONENT
============================================================= */

function LocationDetail({ label, value }) {
  return (
    <div className="rounded-xl border border-[#C8E6C9] bg-[#fbfcf7] p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-[#5FAF5F]">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-[#0D3B0D]">
        {value || "Not available"}
      </p>
    </div>
  );
}
