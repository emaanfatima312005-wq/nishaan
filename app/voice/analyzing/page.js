"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeVoice } from "../../lib/api";
import {
  FiMic,
  FiCheck,
  FiRadio,
  FiMapPin,
  FiSearch,
  FiActivity,
  FiCpu,
} from "react-icons/fi";

export default function VoiceAnalyzingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const apiDoneRef = useRef(false);

  // ===============================
  // CALL VOICE API IMMEDIATELY
  // ===============================

  useEffect(() => {
    const stored = sessionStorage.getItem("nishaan_voice_audio");
    if (!stored) {
      // No audio data — redirect back to the voice input page
      router.replace("/voice");
      return;
    }

    try {
      const audioData = JSON.parse(stored);
      const binary = atob(audioData.data.split(",")[1]);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: audioData.type });
      const file = new File([blob], audioData.name, { type: audioData.type });

      analyzeVoice(file)
        .then((result) => {
          sessionStorage.setItem(
            "nishaan_voice_result",
            JSON.stringify(result)
          );
          apiDoneRef.current = true;
        })
        .catch((error) => {
          console.error("[Nishaan] Voice analysis error:", error);
          sessionStorage.setItem(
            "nishaan_voice_result",
            JSON.stringify({ status: "error", message: error.message })
          );
          apiDoneRef.current = true;
        });
    } catch (error) {
      console.error("[Nishaan] Voice audio parsing error:", error);
      sessionStorage.setItem(
        "nishaan_voice_result",
        JSON.stringify({ status: "error", message: "Could not process recorded audio." })
      );
      apiDoneRef.current = true;
    }
  }, []);

  // ===============================
  // STEP REFERENCES
  // ===============================

  const stepRefs = useRef([]);

  const steps = [
    {
      title: "Receiving voice signal",
      icon: FiRadio,
    },
    {
      title: "Converting speech to clues",
      icon: FiMic,
    },
    {
      title: "Extracting location details",
      icon: FiMapPin,
    },
    {
      title: "Understanding your description",
      icon: FiCpu,
    },
    {
      title: "Searching geographic patterns",
      icon: FiSearch,
    },
    {
      title: "Matching possible locations",
      icon: FiMapPin,
    },
    {
      title: "Finding strongest match",
      icon: FiActivity,
    },
  ];

  // ===============================
  // ANALYSIS PROGRESS
  // ===============================

  useEffect(() => {
    let pollId;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }

        clearInterval(interval);

        // Animation done — wait for API
        const waitAndNavigate = () => {
          if (apiDoneRef.current) {
            router.push("/voice/output");
          } else {
            pollId = setInterval(() => {
              if (apiDoneRef.current) {
                clearInterval(pollId);
                router.push("/voice/output");
              }
            }, 500);
          }
        };

        setTimeout(waitAndNavigate, 1000);

        return prev;
      });
    }, 1400);

    return () => {
      clearInterval(interval);
      if (pollId) clearInterval(pollId);
    };
  }, [router]);

  // ===============================
  // AUTOMATIC SCROLL
  // ===============================

  useEffect(() => {
    const activeStep = stepRefs.current[currentStep];

    if (activeStep) {
      activeStep.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  return (
    <main className="min-h-screen bg-[#03170d] text-white">

      {/* ================================================= */}
      {/* ANALYZING AREA */}
      {/* ================================================= */}

      <section className="relative overflow-hidden px-6 py-16 md:px-10 md:py-20">

        {/* ================================================= */}
        {/* BACKGROUND GRID */}
        {/* ================================================= */}

        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(95,175,95,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(95,175,95,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
        />

        {/* Ambient glow */}

        <div className="pointer-events-none absolute left-[10%] top-[10%] h-[450px] w-[450px] rounded-full bg-[#0D3B0D]/60 blur-[140px]" />

        <div className="pointer-events-none absolute right-[5%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#2F6B2F]/20 blur-[130px]" />


        {/* ================================================= */}
        {/* MAIN CONTAINER */}
        {/* ================================================= */}

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">


            {/* ================================================= */}
            {/* LEFT — VOICE SIGNAL VISUAL */}
            {/* ================================================= */}

            <div className="flex flex-col items-center justify-center">

              <div className="relative flex h-[420px] w-[420px] items-center justify-center md:h-[500px] md:w-[500px]">

                {/* Outer rings */}

                <div className="absolute inset-4 rounded-full border border-[#5FAF5F]/20" />

                <div className="absolute inset-12 rounded-full border border-[#5FAF5F]/20" />

                <div className="absolute inset-20 rounded-full border border-[#5FAF5F]/30" />

                <div className="absolute inset-28 rounded-full border border-[#5FAF5F]/20" />


                {/* Rotating ring */}

                <div className="absolute inset-6 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-[#5FAF5F]/30" />


                {/* Pulsing glow */}

                <div className="absolute h-48 w-48 rounded-full bg-[#0D3B0D] opacity-60 blur-3xl animate-pulse" />


                {/* Center */}

                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#5FAF5F]/40 bg-[#062b14] shadow-[0_0_70px_rgba(95,175,95,0.25)]">

                  <div className="absolute inset-4 rounded-full border border-[#5FAF5F]/20 animate-ping" />

                  <FiMic className="relative z-10 text-5xl text-[#5FAF5F]" />

                </div>


                {/* Orbit points */}

                <span className="absolute left-[17%] top-[24%] h-3 w-3 rounded-full bg-[#5FAF5F] shadow-[0_0_15px_#5FAF5F]" />

                <span className="absolute right-[17%] top-[35%] h-2 w-2 rounded-full bg-[#5FAF5F] shadow-[0_0_15px_#5FAF5F]" />

                <span className="absolute bottom-[22%] left-[30%] h-2 w-2 rounded-full bg-[#5FAF5F]" />

                <span className="absolute bottom-[28%] right-[24%] h-3 w-3 rounded-full bg-[#5FAF5F] shadow-[0_0_15px_#5FAF5F]" />

              </div>


              {/* Signal label */}

              <div className="mt-[-25px] flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#5FAF5F]">

                <span className="h-2 w-2 animate-pulse rounded-full bg-[#5FAF5F]" />

                Audio signal active

              </div>


              {/* Frequency bars */}

              <div className="mt-8 flex h-16 items-end gap-[4px]">

                {Array.from({ length: 42 }).map((_, index) => {

                  const heights = [
                    20, 35, 50, 28, 70,
                    45, 80, 35, 60, 90,
                    45, 75, 30, 65, 85,
                    40, 70, 50, 90, 35,
                    60, 80, 45, 70, 30,
                    85, 55, 75, 40, 65,
                    90, 45, 60, 80, 35,
                    70, 50, 85, 40, 65,
                    75, 45,
                  ];

                  return (
                    <span
                      key={index}
                      className="w-[4px] rounded-full bg-[#5FAF5F] animate-voice-wave"
                      style={{
                        height: `${heights[index]}%`,
                        animationDelay: `${index * 45}ms`,
                      }}
                    />
                  );

                })}

              </div>

            </div>


            {/* ================================================= */}
            {/* RIGHT — ANALYSIS CHECKLIST */}
            {/* ================================================= */}

            <div>

              {/* Small label */}

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#5FAF5F]">
                Nishaan Intelligence Engine
              </p>


              {/* Heading */}

              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">

                Nishaan is{" "}

                <span className="text-[#5FAF5F]">
                  analyzing
                </span>{" "}

                your voice clue.

              </h1>


              <p className="mt-5 max-w-xl leading-7 text-white/55">
                Your description is being transformed into geographic
                clues and compared against spatial patterns.
              </p>


              {/* ================================================= */}
              {/* CHECKLIST */}
              {/* ================================================= */}

              <div className="mt-10 space-y-3">

                {steps.map((step, index) => {

                  const Icon = step.icon;

                  const completed = index < currentStep;

                  const active = index === currentStep;

                  return (
                    <div
                      key={step.title}

                      // Automatically scroll to the currently
                      // processing step
                      ref={(el) => {
                        stepRefs.current[index] = el;
                      }}

                      className={`flex items-center gap-5 rounded-2xl border px-5 py-4 transition-all duration-700
                      
                      ${
                        completed
                          ? "border-[#5FAF5F]/30 bg-[#0D3B0D]/60"
                          : active
                          ? "border-[#5FAF5F]/50 bg-[#0D3B0D]/80 shadow-[0_0_30px_rgba(95,175,95,0.08)]"
                          : "border-white/5 bg-white/[0.02]"
                      }`}
                    >

                      {/* Icon */}

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500
                        
                        ${
                          completed
                            ? "border-[#5FAF5F] bg-[#0D3B0D] text-[#5FAF5F]"
                            : active
                            ? "border-[#5FAF5F] bg-[#0D3B0D] text-[#5FAF5F] shadow-[0_0_20px_rgba(95,175,95,0.25)]"
                            : "border-white/10 text-white/25"
                        }`}
                      >

                        {completed ? (
                          <FiCheck className="text-lg" />
                        ) : (
                          <Icon className="text-lg" />
                        )}

                      </div>


                      {/* Text */}

                      <div className="flex-1">

                        <p
                          className={`font-semibold transition-colors duration-500
                          
                          ${
                            completed
                              ? "text-white"
                              : active
                              ? "text-[#5FAF5F]"
                              : "text-white/25"
                          }`}
                        >
                          {step.title}
                        </p>

                      </div>


                      {/* Processing indicator */}

                      {active && (

                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5FAF5F]">

                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#5FAF5F]" />

                          Processing

                        </div>

                      )}

                    </div>
                  );

                })}

              </div>


              {/* ================================================= */}
              {/* CURRENT OPERATION */}
              {/* ================================================= */}

              <div className="mt-6 rounded-2xl border border-[#5FAF5F]/20 bg-[#061f12]/80 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D3B0D]">

                    <FiActivity className="text-xl text-[#5FAF5F] animate-pulse" />

                  </div>

                  <div>

                    <p className="font-semibold text-white">
                      {steps[currentStep]?.title}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      Processing spatial intelligence...
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* BOTTOM SPACE BEFORE FOOTER */}
      {/* ================================================= */}

      <div className="h-20 bg-[#03170d]" />

    </main>
  );
}