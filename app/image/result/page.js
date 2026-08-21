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

  const location =
    result.location || result.prediction || result.city || "Unknown Location";

  const country = result.country || "Pakistan";

  const confidence = Number(
    result.confidence ?? result.confidence_score ?? result.probability ?? 86,
  );

  const clues = result.clues ||
    result.detected_clues || [
      "Road structure",
      "Building architecture",
      "Urban environment",
      "Electric poles pattern",
    ];

  const safeConfidence = Math.min(Math.max(confidence, 0), 100);

  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">
      {/* Progress */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="flex items-start">
          <Step number="1" label="Input" complete />

          <Line />

          <Step number="2" label="Analyzing" complete />

          <Line />

          <Step number="3" label="Output" active />
        </div>
      </div>

      {/* Main */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <h1 className="mb-7 text-center text-2xl font-semibold text-[#0D3B0D] sm:mb-9 sm:text-3xl lg:text-4xl">
          Image Analysis Result
        </h1>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.2fr_0.9fr] lg:items-stretch">
          {/* Image Card */}
          <div className="overflow-hidden rounded-2xl border border-[#C8E6C9] bg-white p-3 shadow-sm sm:p-4">
            <div className="flex min-h-[280px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#C8E6C9] sm:min-h-[380px] lg:min-h-[560px]">
              <img
                src={image.data}
                alt="Analyzed image"
                className="max-h-[600px] w-full object-contain"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="flex flex-col rounded-2xl border border-[#C8E6C9] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            {/* Location */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-[#1A1A1A]/50">
                  Most likely location
                </p>

                <h2 className="mt-2 break-words text-2xl font-bold text-[#0D3B0D] sm:text-3xl">
                  {location}
                </h2>

                <p className="mt-1 text-sm text-[#1A1A1A]/60">{country}</p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C8E6C9] sm:h-12 sm:w-12">
                <FiMapPin className="text-xl text-[#2F6B2F] sm:text-2xl" />
              </div>
            </div>

            {/* Confidence */}
            <div className="mt-7 border-t border-[#C8E6C9] pt-6 sm:mt-8">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  Confidence
                </span>

                <span className="text-xl font-bold text-[#2F6B2F]">
                  {safeConfidence}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#C8E6C9]">
                <div
                  className="h-full rounded-full bg-[#5FAF5F] transition-all"
                  style={{
                    width: `${safeConfidence}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-[#1A1A1A]/50">
                Visual match with similar places
              </p>
            </div>

            {/* Clues */}
            <div className="mt-7 border-t border-[#C8E6C9] pt-6 sm:mt-8">
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                Detected Clues
              </h3>

              <div className="mt-4 space-y-3">
                {Array.isArray(clues) &&
                  clues.map((clue, index) => (
                    <div
                      key={`${clue}-${index}`}
                      className="flex items-start gap-3 text-sm leading-5 text-[#1A1A1A]/80"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C8E6C9]">
                        <FiCheck className="text-xs text-[#2F6B2F]" />
                      </span>

                      <span>{clue}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-8">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${location}, ${country}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#0D3B0D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2F6B2F] active:scale-[0.99]"
              >
                View on Map
                <FiArrowRight />
              </a>

              <Link
                href="/image"
                onClick={() => {
                  sessionStorage.removeItem("nishaanImage");

                  sessionStorage.removeItem("nishaanImageResult");
                }}
                className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#2F6B2F] px-4 py-3 text-sm font-semibold text-[#2F6B2F] transition hover:bg-[#C8E6C9] active:scale-[0.99]"
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

/* Step */
function Step({ number, label, active, complete }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 ${
          active || complete
            ? "bg-[#0D3B0D] text-white"
            : "bg-[#C8E6C9] text-[#2F6B2F]"
        }`}
      >
        {complete && !active ? "✓" : number}
      </div>

      <span
        className={`mt-2 whitespace-nowrap text-[10px] sm:text-xs ${
          active || complete ? "text-[#0D3B0D]" : "text-[#1A1A1A]/60"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* Line */
function Line() {
  return <div className="mx-2 mt-4 h-[2px] flex-1 bg-[#2F6B2F] sm:mx-4" />;
}
