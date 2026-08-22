"use client";

import { useState } from "react";
import {
  FiMic,
  FiArrowRight,
  FiActivity,
  FiCpu,
  FiMapPin,
  FiCheckCircle,
  FiSearch,
  FiVolume2,
  FiRefreshCw,
} from "react-icons/fi";

export default function VoicePage() {
  const [stage, setStage] = useState("input");
  const [isRecording, setIsRecording] = useState(false);

  const startAnalysis = () => {
    setIsRecording(false);
    setStage("analysing");

    setTimeout(() => {
      setStage("output");
    }, 4500);
  };

  const resetDemo = () => {
    setStage("input");
    setIsRecording(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcf7] text-[#1A1A1A]">


      {/* ================================================= */}
      {/* FLOW INDICATOR */}
      {/* ================================================= */}

      <section className="px-6 pt-16">

        <div className="mx-auto max-w-5xl">

          <div className="flex items-center justify-center">

            {/* INPUT */}

            <div className="flex items-center">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all duration-500 ${
                  stage === "input"
                    ? "bg-[#0D3B0D] text-white shadow-lg shadow-[#0D3B0D]/20"
                    : "bg-[#C8E6C9] text-[#0D3B0D]"
                }`}
              >
                01
              </div>

              <span
                className={`ml-3 hidden font-semibold sm:block ${
                  stage === "input"
                    ? "text-[#0D3B0D]"
                    : "text-[#1A1A1A]/50"
                }`}
              >
                Input
              </span>

            </div>


            <div className="mx-4 h-[2px] w-12 bg-[#C8E6C9] sm:mx-8 sm:w-24" />


            {/* ANALYSING */}

            <div className="flex items-center">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all duration-500 ${
                  stage === "analysing"
                    ? "bg-[#2F6B2F] text-white shadow-lg"
                    : stage === "output"
                    ? "bg-[#C8E6C9] text-[#0D3B0D]"
                    : "bg-white border border-[#C8E6C9] text-[#1A1A1A]/40"
                }`}
              >
                02
              </div>

              <span
                className={`ml-3 hidden font-semibold sm:block ${
                  stage === "analysing"
                    ? "text-[#2F6B2F]"
                    : "text-[#1A1A1A]/50"
                }`}
              >
                Analysing
              </span>

            </div>


            <div className="mx-4 h-[2px] w-12 bg-[#C8E6C9] sm:mx-8 sm:w-24" />


            {/* OUTPUT */}

            <div className="flex items-center">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all duration-500 ${
                  stage === "output"
                    ? "bg-[#5FAF5F] text-white shadow-lg shadow-[#5FAF5F]/30"
                    : "bg-white border border-[#C8E6C9] text-[#1A1A1A]/40"
                }`}
              >
                03
              </div>

              <span
                className={`ml-3 hidden font-semibold sm:block ${
                  stage === "output"
                    ? "text-[#2F6B2F]"
                    : "text-[#1A1A1A]/50"
                }`}
              >
                Output
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAIN EXPERIENCE */}
      {/* ================================================= */}

      <section className="px-6 py-16 md:py-24">

        <div className="mx-auto max-w-6xl">


          {/* ================================================= */}
          {/* STEP 1 — INPUT */}
          {/* ================================================= */}

          {stage === "input" && (

            <div
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
              data-aos="fade-up"
            >

              {/* LEFT */}

              <div>

                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5FAF5F]">
                  Step 01 · Input
                </p>

                <h2 className="mt-4 text-4xl font-bold text-[#0D3B0D] md:text-5xl">
                  Speak your clue.
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-[#1A1A1A]/65">
                  You don't need the exact name of a place.
                  Simply describe what you remember.
                </p>

                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8E6C9]">
                      <FiCheckCircle className="text-[#2F6B2F]" />
                    </div>

                    <span className="text-[#1A1A1A]/70">
                      Speak naturally
                    </span>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8E6C9]">
                      <FiCheckCircle className="text-[#2F6B2F]" />
                    </div>

                    <span className="text-[#1A1A1A]/70">
                      Mention landmarks or surroundings
                    </span>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8E6C9]">
                      <FiCheckCircle className="text-[#2F6B2F]" />
                    </div>

                    <span className="text-[#1A1A1A]/70">
                      Don't worry about exact addresses
                    </span>

                  </div>

                </div>

              </div>


              {/* VOICE INPUT UI */}

              <div className="relative">

                <div className="rounded-[2rem] bg-[#0D3B0D] p-8 shadow-2xl md:p-12">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5FAF5F]">
                        Voice Input
                      </p>

                      <p className="mt-2 text-sm text-[#C8E6C9]">
                        Ready to listen
                      </p>

                    </div>

                    <FiActivity className="text-2xl text-[#5FAF5F]" />

                  </div>


                  {/* Waveform */}

                  <div className="my-14 flex h-24 items-center justify-center gap-1">

                    {[...Array(32)].map((_, index) => (

                      <span
                        key={index}
                        className={`w-1 rounded-full bg-[#5FAF5F] transition-all duration-300 ${
                          isRecording
                            ? "animate-wave"
                            : ""
                        }`}
                        style={{
                          height: `${12 + ((index * 17) % 55)}px`,
                          animationDelay: `${index * 40}ms`,
                        }}
                      />

                    ))}

                  </div>


                  {/* Microphone */}

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 ${
                      isRecording
                        ? "bg-[#5FAF5F] shadow-[0_0_50px_rgba(95,175,95,0.7)] scale-110"
                        : "bg-[#2F6B2F] hover:bg-[#5FAF5F]"
                    }`}
                  >

                    <FiMic
                      className={`text-4xl text-white ${
                        isRecording ? "animate-pulse" : ""
                      }`}
                    />

                  </button>


                  <p className="mt-6 text-center text-sm text-[#C8E6C9]">

                    {isRecording
                      ? "Listening..."
                      : "Tap the microphone to begin"}

                  </p>


                  {/* Demo button */}

                  <button
                    onClick={startAnalysis}
                    className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#5FAF5F] px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#2F6B2F]"
                  >

                    Analyse Voice

                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

                  </button>

                </div>

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* STEP 2 — ANALYSING */}
          {/* ================================================= */}

          {stage === "analysing" && (

            <div
              className="mx-auto max-w-5xl"
              data-aos="zoom-in"
            >

              <div className="rounded-[2rem] bg-[#0D3B0D] p-8 text-white shadow-2xl md:p-14">

                <div className="text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2F6B2F]">

                    <FiCpu className="text-4xl text-[#5FAF5F] animate-pulse" />

                  </div>

                  <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-[#5FAF5F]">
                    Step 02 · Analysing
                  </p>

                  <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                    Understanding your clue...
                  </h2>

                  <p className="mx-auto mt-5 max-w-xl leading-7 text-[#C8E6C9]">
                    Nishaan is interpreting the information from
                    your voice and identifying useful geographic clues.
                  </p>

                </div>


                {/* Analysis pipeline */}

                <div className="mx-auto mt-14 max-w-3xl space-y-4">

                  <AnalysisRow
                    icon={<FiVolume2 />}
                    title="Voice received"
                    status="Complete"
                  />

                  <AnalysisRow
                    icon={<FiActivity />}
                    title="Speech information interpreted"
                    status="Processing"
                    active
                  />

                  <AnalysisRow
                    icon={<FiSearch />}
                    title="Location clues extracted"
                    status="Searching"
                  />

                  <AnalysisRow
                    icon={<FiMapPin />}
                    title="Potential geographic matches"
                    status="Waiting"
                  />

                </div>


                {/* Loading bar */}

                <div className="mx-auto mt-12 max-w-3xl">

                  <div className="mb-3 flex justify-between text-xs text-[#C8E6C9]">

                    <span>
                      GEOSPATIAL ANALYSIS
                    </span>

                    <span>
                      PROCESSING
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">

                    <div className="h-full w-[68%] rounded-full bg-[#5FAF5F] animate-analysis-progress" />

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* STEP 3 — OUTPUT */}
          {/* ================================================= */}

          {stage === "output" && (

            <div
              data-aos="fade-up"
            >

              <div className="mb-10 text-center">

                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#5FAF5F]">
                  Step 03 · Output
                </p>

                <h2 className="mt-4 text-4xl font-bold text-[#0D3B0D] md:text-5xl">
                  Potential location found.
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#1A1A1A]/65">
                  Your voice clue has been transformed into
                  a geographic result that you can explore.
                </p>

              </div>


              {/* Result */}

              <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-[#0D3B0D] shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">


                {/* MAP VISUAL */}

                <div className="relative min-h-[450px] overflow-hidden bg-[#0D3B0D]">

                  {/* Grid */}

                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(#5FAF5F 1px, transparent 1px), linear-gradient(90deg, #5FAF5F 1px, transparent 1px)",
                      backgroundSize: "45px 45px",
                    }}
                  />

                  {/* Glow */}

                  <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5FAF5F]/20 blur-[80px]" />

                  {/* Coordinates */}

                  <div className="absolute left-8 top-8 text-xs tracking-[0.2em] text-[#C8E6C9]">
                    GEOLOCATION RESULT
                  </div>

                  {/* Pin */}

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

                    <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5FAF5F]/30 animate-location-pulse" />

                    <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5FAF5F]/15 animate-location-pulse-delay" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#5FAF5F] shadow-[0_0_50px_rgba(95,175,95,0.7)]">

                      <FiMapPin className="text-4xl text-white" />

                    </div>

                  </div>


                  {/* Bottom label */}

                  <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">

                    <div>

                      <p className="text-xs text-[#C8E6C9]">
                        CONFIDENCE
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        94.7%
                      </p>

                    </div>

                    <div className="rounded-full bg-[#5FAF5F]/20 px-4 py-2 text-xs font-semibold text-[#5FAF5F]">
                      MATCH DETECTED
                    </div>

                  </div>

                </div>


                {/* RESULT DETAILS */}

                <div className="bg-white p-8 md:p-12">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C8E6C9]">

                      <FiCheckCircle className="text-2xl text-[#2F6B2F]" />

                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5FAF5F]">
                        Potential Match
                      </p>

                      <p className="font-semibold text-[#0D3B0D]">
                        Geographic result
                      </p>

                    </div>

                  </div>


                  <h3 className="mt-10 text-3xl font-bold text-[#0D3B0D]">
                    Location Identified
                  </h3>

                  <p className="mt-4 leading-7 text-[#1A1A1A]/65">
                    Nishaan has identified a potential location
                    based on the clues provided through your voice.
                  </p>


                  {/* Data */}

                  <div className="mt-8 space-y-3">

                    <ResultData
                      label="Input"
                      value="Voice description"
                    />

                    <ResultData
                      label="Analysis"
                      value="Geospatial matching"
                    />

                    <ResultData
                      label="Confidence"
                      value="94.7%"
                    />

                  </div>


                  {/* Buttons */}

                  <div className="mt-10 flex flex-wrap gap-3">

                    <button
                      onClick={resetDemo}
                      className="flex items-center gap-2 rounded-xl bg-[#0D3B0D] px-5 py-3 font-semibold text-white transition-all hover:bg-[#2F6B2F]"
                    >

                      <FiRefreshCw />

                      Try Again

                    </button>

                    <button
                      className="flex items-center gap-2 rounded-xl border border-[#C8E6C9] px-5 py-3 font-semibold text-[#2F6B2F] transition-all hover:border-[#5FAF5F]"
                    >

                      Explore Result

                      <FiArrowRight />

                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ================================================= */}
      {/* BOTTOM MESSAGE */}
      {/* ================================================= */}

      <section className="px-6 pb-24">

        <div
          className="mx-auto max-w-4xl text-center"
          data-aos="fade-up"
        >

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2F6B2F]">
            Nishaan Voice
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#0D3B0D] md:text-4xl">
            You provide the clue.
            <br />
            <span className="text-[#5FAF5F]">
              Nishaan searches for the place.
            </span>
          </h2>

        </div>

      </section>

    </main>
  );
}


/* ================================================= */
/* ANALYSIS ROW */
/* ================================================= */

function AnalysisRow({ icon, title, status, active }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-[#5FAF5F] text-white"
            : "bg-[#2F6B2F] text-[#5FAF5F]"
        }`}
      >
        {active ? (
          <span className="animate-pulse">
            {icon}
          </span>
        ) : (
          icon
        )}
      </div>

      <div className="flex-1">

        <p className="font-semibold text-white">
          {title}
        </p>

      </div>

      <span
        className={`text-xs font-semibold ${
          active
            ? "text-[#5FAF5F]"
            : "text-[#C8E6C9]/60"
        }`}
      >
        {status}
      </span>

    </div>
  );
}


/* ================================================= */
/* RESULT DATA */
/* ================================================= */

function ResultData({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#fbfcf7] px-4 py-3">

      <span className="text-sm text-[#1A1A1A]/50">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#0D3B0D]">
        {value}
      </span>

    </div>
  );
}