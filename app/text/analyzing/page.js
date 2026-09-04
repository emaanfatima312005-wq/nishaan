"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeText } from "../../lib/api";
import {
  FiCheck,
  FiMapPin,
  FiSearch,
  FiTarget,
} from "react-icons/fi";

function buildStages(province, city, town, street) {
  return [
    {
      title: "Reading your clues",
      description:
        "Nishaan is understanding the landmarks, buildings and details you described.",
      location: "Pakistan",
    },
    {
      title: "Searching across Pakistan",
      description:
        "Your clues are being compared with possible locations across the country.",
      location: "Pakistan",
    },
    {
      title: "Narrowing down the province",
      description:
        "The clues are pointing toward a specific region.",
      location: province || "Finding province...",
    },
    {
      title: "Finding the town",
      description:
        "Nishaan is checking nearby cities and towns for a stronger match.",
      location: city || "Finding city...",
    },
    {
      title: "Searching the streets",
      description:
        "Roads, landmarks and nearby places are being compared.",
      location: town || street || city || "Searching streets...",
    },
    {
      title: "Location found",
      description:
        "Nishaan has identified the strongest matching destination.",
      location:
        [street, town, city].filter(Boolean).join(", ") || "Location found",
    },
  ];
}

function PakistanMap({ stage, province, city }) {
  const provinceFound = stage >= 2;
  const cityFound = stage >= 3;
  const streetFound = stage >= 4;
  const destinationFound = stage >= 5;

  return (
    <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-3xl bg-[#0D3B0D]">

      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5FAF5F]/10 blur-3xl" />

      {/* Small decorative dots */}
      <div className="absolute left-[15%] top-[25%] h-1.5 w-1.5 rounded-full bg-[#5FAF5F] opacity-60" />
      <div className="absolute right-[18%] top-[35%] h-1 w-1 rounded-full bg-[#C8E6C9] opacity-50" />
      <div className="absolute left-[22%] bottom-[25%] h-1 w-1 rounded-full bg-[#5FAF5F] opacity-60" />
      <div className="absolute right-[25%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-[#C8E6C9] opacity-40" />

      {/* Status */}
      <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-[#5FAF5F]/30 bg-[#0D3B0D]/80 px-4 py-2 backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#5FAF5F]" />

        <span className="text-xs font-semibold text-[#C8E6C9]">
          AI Location Search
        </span>
      </div>

      {/* MAP */}
      <div className="relative z-10 w-[68%] max-w-[430px]">

        <img
          src="/maps/pakistan.svg"
          alt="Pakistan map"
          className="w-full opacity-80 brightness-75 contrast-125 grayscale"
        />

        {/* Soft green glow */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[#0D3B0D]/10" />

        {/* Province scanning */}
        {provinceFound && (
          <div className="absolute left-[48%] top-[36%]">
            <div className="province-ring" />

            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8E6C9] shadow-[0_0_18px_6px_#5FAF5F]" />
          </div>
        )}

        {/* Province label */}
        {provinceFound && (
          <div className="absolute left-[52%] top-[27%] rounded-lg border border-[#5FAF5F]/40 bg-[#0D3B0D]/90 px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#C8E6C9]">
            {province || "SEARCHING"}
          </div>
        )}

        {/* City */}
        {cityFound && (
          <div className="absolute left-[53%] top-[44%]">

            <div className="city-ring" />

            <div className="relative h-3 w-3 rounded-full bg-[#fbfcf7] shadow-[0_0_15px_5px_#5FAF5F]" />

            <div className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#fbfcf7] px-3 py-1.5 text-[10px] font-bold text-[#0D3B0D] shadow-lg">
              {city || "Finding city..."}
            </div>

          </div>
        )}

        {/* Street route */}
        {streetFound && (
          <div className="absolute left-[53%] top-[45%] h-20 w-16 border-b-2 border-l-2 border-dashed border-[#5FAF5F] route-line" />
        )}

        {/* Destination */}
        {destinationFound && (
          <div className="absolute left-[47%] top-[61%]">

            <div className="destination-ring" />

            <div className="relative h-4 w-4 rounded-full bg-[#fbfcf7] shadow-[0_0_20px_7px_#5FAF5F]" />

            <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-[#5FAF5F]/30 bg-[#fbfcf7] px-3 py-2 text-[10px] font-bold text-[#0D3B0D] shadow-xl">
              Destination found
            </div>

          </div>
        )}
      </div>

      {/* Current location */}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="rounded-2xl border border-[#5FAF5F]/30 bg-[#0D3B0D]/90 px-6 py-3 text-center backdrop-blur-md">

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5FAF5F]">
            Currently searching
          </p>

          <p className="mt-1 text-sm font-bold text-[#fbfcf7]">
            {buildStages(province, city)[stage]?.location || "Pakistan"}
          </p>

        </div>
      </div>

      <style jsx>{`
        .province-ring {
          width: 70px;
          height: 70px;
          border: 2px solid #5faf5f;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          animation: provincePulse 1.8s ease-out infinite;
        }

        .city-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 35px;
          height: 35px;
          border: 2px solid #5faf5f;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          animation: cityPulse 1.4s ease-out infinite;
        }

        .route-line {
          animation: routeAppear 1.5s ease-out forwards;
        }

        .destination-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 45px;
          height: 45px;
          border: 2px solid #5faf5f;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          animation: destinationPulse 1.5s ease-out infinite;
        }

        @keyframes provincePulse {
          0% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(0.5);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        @keyframes cityPulse {
          0% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(0.6);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.8);
          }
        }

        @keyframes routeAppear {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes destinationPulse {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.8);
          }
        }
      `}</style>
    </div>
  );
}

export default function AnalyzingPage() {
  const router = useRouter();

  const [stage, setStage] = useState(0);
  const [locationResult, setLocationResult] = useState(null);
  const apiDoneRef = useRef(false);

  const stages = buildStages(
    locationResult?.province,
    locationResult?.city,
    locationResult?.town,
    locationResult?.street
  );

  // Start API call immediately
  useEffect(() => {
    const clue = sessionStorage.getItem("nishaan_text_clue");

    if (!clue) return;

    analyzeText(clue)
      .then((result) => {
        setLocationResult(result);

        sessionStorage.setItem(
          "nishaan_text_result",
          JSON.stringify(result)
        );

        apiDoneRef.current = true;
      })
      .catch((error) => {
        console.error("[Nishaan] Text analysis error:", error);

        sessionStorage.setItem(
          "nishaan_text_result",
          JSON.stringify({
            status: "error",
            message: error.message,
          })
        );

        apiDoneRef.current = true;
      });
  }, []);

  // Animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStage((current) => {
        if (current >= stages.length - 1) {
          clearInterval(timer);
          return current;
        }

        return current + 1;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [stages.length]);

  // When animation finishes, wait for API then navigate
  useEffect(() => {
    if (stage !== stages.length - 1) return;

    let pollId;

    const timeoutId = setTimeout(() => {
      if (apiDoneRef.current) {
        router.push("/text/result");
        return;
      }

      pollId = setInterval(() => {
        if (apiDoneRef.current) {
          clearInterval(pollId);
          router.push("/text/result");
        }
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(timeoutId);

      if (pollId) {
        clearInterval(pollId);
      }
    };
  }, [stage, router, stages.length]);

  const progress = (stage / (stages.length - 1)) * 100;

  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">

      {/* Header */}
      <header className="border-b border-[#C8E6C9] bg-[#fbfcf7]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D3B0D] text-white">
              <FiMapPin size={19} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#0D3B0D]">
                Nishaan
              </h1>

              <p className="text-[10px] text-[#2F6B2F]">
                AI Location Finder
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#5FAF5F]" />

            <span className="text-xs font-semibold text-[#2F6B2F]">
              AI Analysis in Progress
            </span>
          </div>

        </div>

      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid min-h-[620px] grid-cols-1 gap-8 lg:grid-cols-2">

          {/* LEFT MAP */}
          <PakistanMap
            stage={stage}
            province={locationResult?.province}
            city={locationResult?.city}
          />

          {/* RIGHT CONTENT */}
          <div className="flex flex-col justify-center">

            <div className="mb-7">

              <div className="mb-4 inline-flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8E6C9] text-[#0D3B0D]">
                  <FiSearch size={16} />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-[#2F6B2F]">
                  Nishaan AI
                </span>

              </div>

              <h2 className="text-3xl font-bold text-[#0D3B0D] md:text-4xl">
                Finding your location
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#1A1A1A]/60">
                Nishaan is turning your memory into location clues and
                narrowing down the most likely destination.
              </p>

            </div>

            {/* Current AI action */}
            <div className="mb-7 rounded-2xl border border-[#5FAF5F]/30 bg-[#C8E6C9]/40 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0D3B0D] text-white">

                  {stage === stages.length - 1 ? (
                    <FiTarget size={20} />
                  ) : (
                    <FiSearch size={20} className="animate-pulse" />
                  )}

                </div>

                <div>

                  <p className="text-xs font-semibold text-[#2F6B2F]">
                    CURRENTLY SEARCHING
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#0D3B0D]">
                    {stages[stage].title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#1A1A1A]/65">
                    {stages[stage].description}
                  </p>

                </div>

              </div>

            </div>

            {/* Progress */}
            <div className="mb-7">

              <div className="mb-2 flex justify-between">

                <span className="text-xs font-bold text-[#0D3B0D]">
                  Location search progress
                </span>

                <span className="text-xs font-bold text-[#2F6B2F]">
                  {Math.round(progress)}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-[#C8E6C9]">

                <div
                  className="h-full rounded-full bg-[#2F6B2F] transition-all duration-1000"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            {/* Timeline */}
            <div className="space-y-4">

              {stages.map((item, index) => {
                const completed = index < stage;
                const active = index === stage;

                return (
                  <div
                    key={item.title}
                    className={`flex items-start gap-4 transition-all duration-500 ${
                      active
                        ? "opacity-100"
                        : completed
                        ? "opacity-65"
                        : "opacity-30"
                    }`}
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        completed
                          ? "border-[#2F6B2F] bg-[#2F6B2F]"
                          : active
                          ? "border-[#2F6B2F] bg-[#fbfcf7]"
                          : "border-[#C8E6C9]"
                      }`}
                    >

                      {completed ? (
                        <FiCheck size={15} className="text-white" />
                      ) : active ? (
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#5FAF5F]" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-[#C8E6C9]" />
                      )}

                    </div>

                    <div className="pt-1">

                      <p className="text-sm font-semibold text-[#0D3B0D]">
                        {item.title}
                      </p>

                      {active && (
                        <p className="mt-1 text-xs leading-5 text-[#1A1A1A]/55">
                          {item.description}
                        </p>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

            {/* Finished */}
            {stage === stages.length - 1 && (

              <div className="mt-7 flex items-center gap-3 rounded-xl bg-[#0D3B0D] px-5 py-4 text-white">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5FAF5F]">
                  <FiCheck size={17} />
                </div>

                <div>

                  <p className="text-sm font-bold">
                    Location found
                  </p>

                  <p className="text-xs text-[#C8E6C9]">
                    Preparing your result...
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}