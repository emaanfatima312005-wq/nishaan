"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheck, FiMapPin, FiRefreshCw, FiArrowRight } from "react-icons/fi";

export default function ImageResultPage() {
  const router = useRouter();

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    try {
      const storedImage = sessionStorage.getItem("nishaanImage");
      const storedResult = sessionStorage.getItem("nishaanImageResult");

      if (!storedImage || !storedResult) {
        router.replace("/image");
        return;
      }

      setImage(JSON.parse(storedImage));
      setResult(JSON.parse(storedResult));
    } catch (error) {
      console.error("Could not load image result:", error);
      router.replace("/image");
    }
  }, [router]);

  if (!image || !result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfcf7] px-5">
        <p className="text-sm text-[#1A1A1A]/60">Loading result...</p>
      </main>
    );
  }

  // Handle API error gracefully
  if (result.status === "error") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fbfcf7] px-5">
        <p className="text-lg font-semibold text-[#0D3B0D]">
          Image analysis failed.
        </p>
        <p className="max-w-md text-center text-sm text-[#1A1A1A]/60">
          {result.message || "The analysis could not be completed. Please try again."}
        </p>
        <Link
          href="/image"
          onClick={() => {
            sessionStorage.removeItem("nishaanImage");
            sessionStorage.removeItem("nishaanImageResult");
          }}
          className="mt-2 flex items-center gap-2 rounded-lg border-2 border-[#2F6B2F] px-5 py-2.5 text-sm font-semibold text-[#2F6B2F] transition hover:bg-[#C8E6C9]"
        >
          <FiRefreshCw />
          Try Again
        </Link>
      </main>
    );
  }

  // Build location display from raw API fields
  const locationParts = [
    result.city,
    result.province,
  ].filter(Boolean);

  const location =
    result.location ||
    locationParts.join(", ") ||
    result.prediction ||
    "Unknown Location";

  const country = result.country || "Pakistan";

  const confidence = Number(
    result.confidence ?? result.confidence_score ?? result.probability ?? 0,
  );

  // Build clues from raw API evidence fields
  const apiClues = [
    ...(result.visual_clues || []),
    ...(result.visible_text || []),
    ...(result.place_names || []),
    ...(result.landmarks || []),
  ];

  const clues =
    result.clues ||
    (apiClues.length > 0 ? apiClues : null) ||
    result.detected_clues ||
    [];

  const safeConfidence = Math.min(Math.max(confidence, 0), 100);

  const mapQuery =
    result.latitude && result.longitude
      ? `${result.latitude},${result.longitude}`
      : `${location}, ${country}`;

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#fbfcf7]
        text-[#1A1A1A]
      "
    >
      {/* =====================================================
          BACKGROUND VIDEO
      ===================================================== */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden
          bg-[#fbfcf7]
        "
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="
            absolute
            left-1/2
            top-1/2
            h-full
            w-full
            min-h-full
            min-w-full
            -translate-x-1/2
            -translate-y-1/2
            scale-[1.25]
            object-cover
            animate-video-fade
          "
        >
          <source src="/videos/Historic_mosque.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Light overlay */}
        <div
          className="
            absolute
            inset-0
            bg-[#fbfcf7]/35
          "
        />

        {/* Gradient for readability */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#fbfcf7]/45
            via-[#fbfcf7]/10
            to-[#fbfcf7]/55
          "
        />
      </div>

      {/* =====================================================
          DECORATIVE MINAR
      ===================================================== */}
      <img
        src="/images/minar.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          left-[-100px]
          top-[100px]
          z-[1]
          hidden
          h-[calc(100vh-100px)]
          w-auto
          max-w-none
          select-none
          opacity-[0.10]
          lg:block
        "
      />

      {/* =====================================================
          DECORATIVE MAP
      ===================================================== */}
      <img
        src="/images/map.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          right-[-80px]
          top-[200px]
          z-[1]
          hidden
          w-[500px]
          select-none
          opacity-[0.07]
          lg:block
        "
      />

      {/* =====================================================
          PROGRESS
      ===================================================== */}
      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-5xl
          px-4
          pt-6
          sm:px-6
          sm:pt-8
          lg:px-8
        "
      >
        <div className="flex items-start">
          <Step number="1" label="Input" complete />

          <Line />

          <Step number="2" label="Analyzing" complete />

          <Line />

          <Step number="3" label="Output" active />
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-6xl
          px-4
          py-8
          sm:px-6
          sm:py-10
          lg:px-8
          lg:py-14
        "
      >
        <h1
          className="
            mb-7
            text-center
            text-2xl
            font-semibold
            text-[#0D3B0D]
            sm:mb-9
            sm:text-3xl
            lg:text-4xl
          "
        >
          Image Analysis Result
        </h1>

        <div
          className="
            grid
            gap-5
            sm:gap-6
            lg:grid-cols-[1.2fr_0.9fr]
            lg:items-stretch
          "
        >
          {/* =================================================
              IMAGE CARD
          ================================================= */}
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[#C8E6C9]
              bg-white/90
              p-3
              shadow-sm
              backdrop-blur-sm
              sm:p-4
            "
          >
            <div
              className="
                flex
                min-h-[280px]
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-[#C8E6C9]
                sm:min-h-[380px]
                lg:min-h-[560px]
              "
            >
              <img
                src={image.data}
                alt="Analyzed image"
                className="
                  max-h-[600px]
                  w-full
                  object-contain
                "
              />
            </div>
          </div>

          {/* =================================================
              RESULT CARD
          ================================================= */}
          <div
            className="
              flex
              flex-col
              rounded-2xl
              border
              border-[#C8E6C9]
              bg-white/95
              p-5
              shadow-sm
              backdrop-blur-sm
              sm:p-7
              lg:p-8
            "
          >
            {/* Location */}
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-[#1A1A1A]/50
                  "
                >
                  Most likely location
                </p>

                <h2
                  className="
                    mt-2
                    break-words
                    text-2xl
                    font-bold
                    text-[#0D3B0D]
                    sm:text-3xl
                  "
                >
                  {location}
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#1A1A1A]/60
                  "
                >
                  {country}
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#C8E6C9]
                  sm:h-12
                  sm:w-12
                "
              >
                <FiMapPin
                  className="
                    text-xl
                    text-[#2F6B2F]
                    sm:text-2xl
                  "
                />
              </div>
            </div>

            {/* =================================================
                CONFIDENCE
            ================================================= */}
            <div
              className="
                mt-7
                border-t
                border-[#C8E6C9]
                pt-6
                sm:mt-8
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                    text-[#1A1A1A]
                  "
                >
                  Confidence
                </span>

                <span
                  className="
                    text-xl
                    font-bold
                    text-[#2F6B2F]
                  "
                >
                  {safeConfidence}%
                </span>
              </div>

              <div
                className="
                  mt-3
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-[#C8E6C9]
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#5FAF5F]
                    transition-all
                  "
                  style={{
                    width: `${safeConfidence}%`,
                  }}
                />
              </div>

              <p
                className="
                  mt-2
                  text-xs
                  text-[#1A1A1A]/50
                "
              >
                Visual match with similar places
              </p>
            </div>

            {/* =================================================
                CLUES
            ================================================= */}
            <div
              className="
                mt-7
                border-t
                border-[#C8E6C9]
                pt-6
                sm:mt-8
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  text-[#1A1A1A]
                "
              >
                Detected Clues
              </h3>

              <div className="mt-4 space-y-3">
                {Array.isArray(clues) &&
                  clues.map((clue, index) => (
                    <div
                      key={`${clue}-${index}`}
                      className="
                        flex
                        items-start
                        gap-3
                        text-sm
                        leading-5
                        text-[#1A1A1A]/80
                      "
                    >
                      <span
                        className="
                          mt-0.5
                          flex
                          h-6
                          w-6
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#C8E6C9]
                        "
                      >
                        <FiCheck
                          className="
                            text-xs
                            text-[#2F6B2F]
                          "
                        />
                      </span>

                      <span>{clue}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}
            <div
              className="
                mt-8
                flex
                flex-col
                gap-3
                sm:flex-row
                lg:mt-auto
                lg:pt-8
              "
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  mapQuery,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  min-h-[46px]
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#0D3B0D]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#2F6B2F]
                  active:scale-[0.99]
                "
              >
                View on Map
                <FiArrowRight />
              </a>

              {result.latitude && result.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/${result.latitude},${result.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#2F6B2F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0D3B0D] active:scale-[0.99]"
                >
                  Get Directions
                  <FiArrowRight />
                </a>
              )}

              <Link
                href="/image"
                onClick={() => {
                  sessionStorage.removeItem("nishaanImage");

                  sessionStorage.removeItem("nishaanImageResult");
                }}
                className="
                  flex
                  min-h-[46px]
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border-2
                  border-[#2F6B2F]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-[#2F6B2F]
                  transition
                  hover:bg-[#C8E6C9]
                  active:scale-[0.99]
                "
              >
                <FiRefreshCw />
                New Search
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   STEP
========================================================= */

function Step({ number, label, active, complete }) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        items-center
      "
    >
      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          text-xs
          font-bold
          sm:h-9
          sm:w-9
          ${
            active || complete
              ? "bg-[#0D3B0D] text-white"
              : "bg-[#C8E6C9] text-[#2F6B2F]"
          }
        `}
      >
        {complete && !active ? "✓" : number}
      </div>

      <span
        className={`
          mt-2
          whitespace-nowrap
          text-[10px]
          sm:text-xs
          ${active || complete ? "text-[#0D3B0D]" : "text-[#1A1A1A]/60"}
        `}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   PROGRESS LINE
========================================================= */

function Line() {
  return (
    <div
      className="
        mx-2
        mt-4
        h-[2px]
        flex-1
        bg-[#2F6B2F]
        sm:mx-4
      "
    />
  );
}
