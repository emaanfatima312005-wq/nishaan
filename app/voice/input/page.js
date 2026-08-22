"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMic,
  FiUpload,
  FiArrowRight,
  FiStopCircle,
  FiVolume2,
  FiActivity,
} from "react-icons/fi";

export default function VoiceInputPage() {
  const router = useRouter();

  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [time, setTime] = useState(0);

  const timerRef = useRef(null);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [recording]);

  /* ================= RECORD ================= */

  const startRecording = () => {
    setRecording(true);
    setAudioFile(null);
    setTime(0);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  /* ================= UPLOAD ================= */

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setAudioFile(file);
      setRecording(false);
      setTime(0);
    }
  };

  /* ================= TIME FORMAT ================= */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${mins}:${secs}`;
  };

  /* ================= CONTINUE ================= */

  const continueToAnalysis = () => {
    router.push("/voice/analyzing");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfcf7] text-[#1A1A1A]">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Glow */}

        <div className="absolute left-[10%] top-[15%] h-[400px] w-[400px] rounded-full bg-[#C8E6C9]/40 blur-[120px]" />

        <div className="absolute right-[5%] bottom-[10%] h-[450px] w-[450px] rounded-full bg-[#5FAF5F]/10 blur-[120px]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#0D3B0D 1px, transparent 1px), linear-gradient(90deg, #0D3B0D 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

      </div>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-20">

        <div className="w-full">


          {/* ================================================= */}
          {/* TOP LABEL */}
          {/* ================================================= */}

          <div
            className="mb-8 text-center"
            data-aos="fade-down"
            data-aos-duration="900"
          >

            <div className="inline-flex items-center gap-3 rounded-full border border-[#C8E6C9] bg-white/80 px-5 py-2 shadow-sm backdrop-blur-md">

              <span className="flex h-2.5 w-2.5 rounded-full bg-[#5FAF5F] animate-pulse" />

              <span className="text-xs font-bold tracking-[0.25em] text-[#2F6B2F]">
                VOICE INPUT
              </span>

            </div>

          </div>


          {/* ================================================= */}
          {/* HEADING */}
          {/* ================================================= */}

          <div
            className="mx-auto max-w-3xl text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
          >

            <h1 className="text-5xl font-bold tracking-tight text-[#0D3B0D] md:text-7xl">

              Tell Nishaan

              <br />

              <span className="text-[#2F6B2F]">
                what you remember.
              </span>

            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#1A1A1A]/65 md:text-xl">

              Describe the place using your voice.
              Mention anything you remember — landmarks,
              surroundings, sounds, buildings or scenery.

            </p>

          </div>


          {/* ================================================= */}
          {/* VOICE CONSOLE */}
          {/* ================================================= */}

          <div
            className="mx-auto mt-14 max-w-4xl"
            data-aos="zoom-in"
            data-aos-duration="1200"
          >

            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#C8E6C9] bg-white p-8 shadow-2xl md:p-12">


              {/* Decorative circles */}

              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#5FAF5F]/20" />

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#5FAF5F]/15" />


              {/* ================================================= */}
              {/* STATUS */}
              {/* ================================================= */}

              <div className="relative z-10 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8E6C9]">

                    <FiActivity className="text-xl text-[#0D3B0D]" />

                  </div>

                  <div>

                    <p className="text-xs font-bold tracking-[0.2em] text-[#2F6B2F]">
                      AUDIO SYSTEM
                    </p>

                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {recording
                        ? "Listening..."
                        : audioFile
                        ? "Audio ready"
                        : "Waiting for input"}
                    </p>

                  </div>

                </div>


                <div className="rounded-full bg-[#fbfcf7] px-4 py-2">

                  <span className="font-mono text-sm font-semibold text-[#2F6B2F]">
                    {formatTime(time)}
                  </span>

                </div>

              </div>


              {/* ================================================= */}
              {/* WAVEFORM */}
              {/* ================================================= */}

              <div className="relative mt-12 flex h-40 items-center justify-center overflow-hidden rounded-3xl bg-[#0D3B0D]">

                {/* Glow */}

                <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5FAF5F]/20 blur-[60px]" />


                {/* Center line */}

                <div className="absolute left-0 right-0 h-px bg-[#5FAF5F]/20" />


                {/* Frequency bars */}

                <div className="relative flex h-28 items-center justify-center gap-[4px]">

                  {Array.from({ length: 55 }).map((_, index) => (

                    <span
                      key={index}
                      className={`w-[3px] rounded-full bg-[#5FAF5F] transition-all duration-300 ${
                        recording
                          ? "animate-frequency"
                          : "opacity-40"
                      }`}
                      style={{
                        height: recording
                          ? `${20 + ((index * 17) % 70)}%`
                          : "8px",
                        animationDelay: `${index * 35}ms`,
                      }}
                    />

                  ))}

                </div>


                {/* Microphone */}

                <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#5FAF5F]/40 bg-[#0D3B0D] shadow-[0_0_35px_rgba(95,175,95,0.25)]">

                  <FiVolume2
                    className={`text-3xl text-[#5FAF5F] ${
                      recording ? "animate-pulse" : ""
                    }`}
                  />

                </div>

              </div>


              {/* ================================================= */}
              {/* RECORD BUTTON */}
              {/* ================================================= */}

              <div className="mt-10 flex flex-col items-center">

                {!recording ? (

                  <button
                    onClick={startRecording}
                    className="group flex items-center gap-4 rounded-full bg-[#0D3B0D] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F6B2F] hover:shadow-xl"
                  >

                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5FAF5F]">

                      <FiMic className="text-xl" />

                    </span>

                    Start Recording

                  </button>

                ) : (

                  <button
                    onClick={stopRecording}
                    className="group flex items-center gap-4 rounded-full bg-[#0D3B0D] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F6B2F]"
                  >

                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5FAF5F]">

                      <FiStopCircle className="text-xl" />

                    </span>

                    Stop Recording

                  </button>

                )}


                <p className="mt-4 text-xs text-[#1A1A1A]/50">
                  {recording
                    ? "Nishaan is listening to your description"
                    : "Speak naturally — you don't need to be precise"}
                </p>

              </div>


              {/* ================================================= */}
              {/* DIVIDER */}
              {/* ================================================= */}

              <div className="my-10 flex items-center gap-4">

                <div className="h-px flex-1 bg-[#C8E6C9]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                  OR
                </span>

                <div className="h-px flex-1 bg-[#C8E6C9]" />

              </div>


              {/* ================================================= */}
              {/* UPLOAD */}
              {/* ================================================= */}

              <label className="group flex cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed border-[#C8E6C9] bg-[#fbfcf7] p-5 transition-all duration-300 hover:border-[#5FAF5F] hover:bg-[#C8E6C9]/20">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C8E6C9] transition-all duration-300 group-hover:bg-[#5FAF5F]">

                    <FiUpload className="text-xl text-[#0D3B0D] group-hover:text-white" />

                  </div>

                  <div>

                    <p className="font-semibold text-[#0D3B0D]">

                      {audioFile
                        ? audioFile.name
                        : "Upload a voice recording"}

                    </p>

                    <p className="mt-1 text-xs text-[#1A1A1A]/50">
                      MP3, WAV, M4A supported
                    </p>

                  </div>

                </div>

                <FiArrowRight className="text-xl text-[#2F6B2F] transition-transform duration-300 group-hover:translate-x-1" />

                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleUpload}
                  className="hidden"
                />

              </label>


              {/* ================================================= */}
              {/* CONTINUE */}
              {/* ================================================= */}

              {(recording === false && (time > 0 || audioFile)) && (

                <button
                  onClick={continueToAnalysis}
                  className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2F6B2F] py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#0D3B0D]"
                >

                  Continue to Analysis

                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

                </button>

              )}

            </div>

          </div>


          {/* ================================================= */}
          {/* BOTTOM INFO */}
          {/* ================================================= */}

          <div
            className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-[#1A1A1A]/45"
            data-aos="fade-up"
            data-aos-delay="300"
          >

            <span>🎙️ Natural language</span>

            <span>•</span>

            <span>🔊 Audio analysis</span>

            <span>•</span>

            <span>🌍 Geospatial intelligence</span>

          </div>

        </div>

      </section>

    </main>
  );
}