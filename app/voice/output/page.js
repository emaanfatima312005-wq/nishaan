"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FiArrowLeft,
  FiMapPin,
  FiNavigation,
  FiCheck,
  FiSearch,
  FiCompass,
  FiRefreshCw,
} from "react-icons/fi";

// Leaflet must load on the client
const NishaanMap = dynamic(() => import("./NishaanMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#e8f0e5]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#C8E6C9] border-t-[#0D3B0D]" />
        <p className="mt-4 text-sm font-medium text-[#0D3B0D]">
          Loading map...
        </p>
      </div>
    </div>
  ),
});

// No hardcoded location — real API results only.

export default function VoiceOutputPage() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Read real voice API result from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nishaan_voice_result");
      if (!stored) return;

      const result = JSON.parse(stored);

      if (result.status === "error") {
        setApiError(result.message || "Voice analysis failed.");
        return;
      }

      const city = result.city || "";
      const province = result.province || "";
      const name = [city, province].filter(Boolean).join(", ");

      setLocation({
        name: name || "",
        latitude: result.latitude,
        longitude: result.longitude,
        confidence: result.confidence ?? 0,
      });
    } catch (e) {
      console.error("Could not read voice result:", e);
      setApiError("Could not read analysis result.");
    }
  }, []);

  // Show loading state
  if (location === null && apiError === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfcf7] px-5">
        <p className="text-sm text-[#1A1A1A]/60">Loading result...</p>
      </main>
    );
  }

  // Show API error
  if (apiError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fbfcf7] px-5">
        <p className="text-lg font-semibold text-[#0D3B0D]">
          Voice analysis failed.
        </p>
        <p className="max-w-md text-center text-sm text-[#1A1A1A]/60">
          {apiError}
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem("nishaan_voice_result");
            sessionStorage.removeItem("nishaan_voice_audio");
            router.push("/voice");
          }}
          className="mt-2 flex items-center gap-2 rounded-xl border border-[#2F6B2F] bg-[#fbfcf7] px-5 py-3 text-sm font-bold text-[#0D3B0D] transition hover:bg-[#C8E6C9]/40"
        >
          <FiRefreshCw size={17} />
          Record Again
        </button>
      </main>
    );
  }

  // Show error if API returned no coordinates
  if (!location.latitude || !location.longitude) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fbfcf7] px-5">
        <p className="text-lg font-semibold text-[#0D3B0D]">
          Voice analysis could not identify a location.
        </p>
        <p className="text-sm text-[#1A1A1A]/60">
          Try recording again with clearer location descriptions.
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem("nishaan_voice_result");
            sessionStorage.removeItem("nishaan_voice_audio");
            router.push("/voice");
          }}
          className="mt-2 flex items-center gap-2 rounded-xl border border-[#2F6B2F] bg-[#fbfcf7] px-5 py-3 text-sm font-bold text-[#0D3B0D] transition hover:bg-[#C8E6C9]/40"
        >
          <FiRefreshCw size={17} />
          Record Again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">

      {/* ================================================= */}
      {/* TOP PROGRESS */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pt-10 md:px-10">

        <div className="flex items-start">

          {/* INPUT */}

          <div className="flex flex-1 flex-col items-center">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0D3B0D] text-sm font-bold text-white shadow-lg">
              <FiCheck />
            </div>

            <p className="mt-3 text-sm font-medium text-[#2F6B2F]">
              Input
            </p>

          </div>

          <div className="mt-5 h-[2px] flex-1 bg-[#0D3B0D]" />


          {/* ANALYZING */}

          <div className="flex flex-1 flex-col items-center">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0D3B0D] text-sm font-bold text-white shadow-lg">
              <FiCheck />
            </div>

            <p className="mt-3 text-sm font-medium text-[#2F6B2F]">
              Analyzing
            </p>

          </div>

          <div className="mt-5 h-[2px] flex-1 bg-[#0D3B0D]" />


          {/* OUTPUT */}

          <div className="flex flex-1 flex-col items-center">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0D3B0D] text-sm font-bold text-white shadow-[0_0_25px_rgba(95,175,95,0.35)]">
              3
            </div>

            <p className="mt-3 text-sm font-semibold text-[#0D3B0D]">
              Output
            </p>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* HEADING */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-10">

        <div data-aos="fade-up">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]">
            Nishaan Result
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0D3B0D] md:text-6xl">
            We found your location.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#1A1A1A]/60">
            Based on the clues in your voice description, Nishaan identified
            the location that best matches your description.
          </p>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAIN RESULT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">

        <div className="grid overflow-hidden rounded-[2rem] border border-[#C8E6C9] bg-white shadow-[0_20px_70px_rgba(13,59,13,0.10)] lg:grid-cols-[1.25fr_0.75fr]">


          {/* ================================================= */}
          {/* REAL MAP */}
          {/* ================================================= */}

          <div
            className="relative h-[500px] overflow-hidden lg:h-[650px]"
            data-aos="fade-right"
          >

            <NishaanMap
              latitude={location.latitude}
              longitude={location.longitude}
              locationName={location.name}
            />


            {/* MAP LABEL */}

            <div className="pointer-events-none absolute left-5 top-5 z-[500]">

              <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D3B0D]">

                  <FiCompass className="text-lg text-[#5FAF5F]" />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5FAF5F]">
                    Nishaan
                  </p>

                  <p className="text-sm font-semibold text-[#0D3B0D]">
                    Location detected
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* RESULT INFORMATION */}
          {/* ================================================= */}

          <div
            className="relative flex flex-col justify-center overflow-hidden p-8 md:p-12 lg:p-14"
            data-aos="fade-left"
          >

            {/* Decorative glow */}

            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#C8E6C9]/50 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[#5FAF5F]/10 blur-3xl" />


            <div className="relative z-10">

              {/* Result badge */}

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#5FAF5F]">

                <span className="h-2 w-2 animate-pulse rounded-full bg-[#5FAF5F]" />

                Strongest Match

              </div>


              {/* Location */}

              <div className="mt-8 flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0D3B0D] shadow-lg">

                  <FiMapPin className="text-2xl text-[#5FAF5F]" />

                </div>

                <div>

                  <p className="text-sm text-[#1A1A1A]/45">
                    Detected location
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-[#0D3B0D]">
                    {location.name}
                  </h2>

                </div>

              </div>


              {/* Confidence */}

              <div className="mt-10 rounded-2xl border border-[#C8E6C9] bg-[#fbfcf7] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6B2F]">
                      Match Confidence
                    </p>

                    <p className="mt-2 text-sm text-[#1A1A1A]/50">
                      Nishaan's geographic analysis
                    </p>

                  </div>

                  <p className="text-3xl font-bold text-[#0D3B0D]">
                    {location.confidence}%
                  </p>

                </div>


                {/* Confidence bar */}

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#C8E6C9]">

                  <div
                    className="h-full rounded-full bg-[#5FAF5F]"
                    style={{
                      width: `${location.confidence}%`,
                    }}
                  />

                </div>

              </div>


              {/* Coordinates */}

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-[#C8E6C9] bg-white p-4">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
                    Latitude
                  </p>

                  <p className="mt-2 font-mono text-sm font-semibold text-[#0D3B0D]">
                    {location.latitude}° N
                  </p>

                </div>

                <div className="rounded-xl border border-[#C8E6C9] bg-white p-4">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
                    Longitude
                  </p>

                  <p className="mt-2 font-mono text-sm font-semibold text-[#0D3B0D]">
                    {location.longitude}° E
                  </p>

                </div>

              </div>


              {/* Description */}

              <div className="mt-6">

                <p className="text-sm leading-7 text-[#1A1A1A]/60">
                  The geographic clues extracted from your voice description
                  closely match this region. Explore the map to investigate
                  the surrounding area.
                </p>

              </div>


              {/* Buttons */}

              <div className="mt-8 flex flex-wrap gap-3">

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-full bg-[#0D3B0D] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F6B2F]"
                >

                  <FiNavigation />

                  Open in Google Maps

                </a>


                <Link
                  href="/voice"
                  className="flex items-center gap-3 rounded-full border border-[#C8E6C9] bg-white px-6 py-3.5 text-sm font-semibold text-[#0D3B0D] transition-all duration-300 hover:-translate-y-1 hover:border-[#5FAF5F]"
                >

                  <FiSearch />

                  Try Again

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}