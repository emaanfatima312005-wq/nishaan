"use client";

import CursorParticleBackground from "@/components/CursorParticleBackground";

import {
  FiArrowRight,
  FiActivity,
  FiTarget,
  FiSearch,
  FiImage,
  FiMic,
  FiGlobe,
  FiEdit3,
} from "react-icons/fi";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcf7] text-[#1A1A1A]">
      <CursorParticleBackground />

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative min-h-[calc(100vh-96px)] overflow-hidden">
        {/* ================================================= */}
        {/* FULL BACKGROUND VIDEO */}
        {/* ================================================= */}

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/nishaan-animation.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* ================================================= */}
        {/* VIDEO OVERLAYS */}
        {/* ================================================= */}

        {/* Main transparent overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[#fbfcf7]/25" />

        {/* Light overlay on left so heading is readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fbfcf7]/90 via-[#fbfcf7]/55 to-transparent" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fbfcf7] to-transparent" />

        {/* ================================================= */}
        {/* BACKGROUND GLOWS */}
        {/* ================================================= */}

        <div className="pointer-events-none absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#5FAF5F]/10 blur-[140px] animate-pulse" />

        <div className="pointer-events-none absolute right-[5%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-[#2F6B2F]/10 blur-[120px]" />

        <div className="pointer-events-none absolute right-[10%] top-[15%] h-[500px] w-[500px] rounded-full bg-[#C8E6C9]/20 blur-[120px]" />

        {/* ================================================= */}
        {/* BACKGROUND GRID */}
        {/* ================================================= */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(#0D3B0D 1px, transparent 1px), linear-gradient(90deg, #0D3B0D 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* ================================================= */}
        {/* DECORATIVE CIRCLES */}
        {/* ================================================= */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5FAF5F]/5" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2F6B2F]/5" />

        {/* ================================================= */}
        {/* FLOATING COORDINATES */}
        {/* ================================================= */}

        <div className="pointer-events-none absolute left-[12%] top-[18%] text-[11px] tracking-[0.25em] text-[#2F6B2F]/40 animate-data-float">
          31.5204° N
        </div>

        <div className="pointer-events-none absolute right-[15%] top-[28%] text-[11px] tracking-[0.25em] text-[#2F6B2F]/40 animate-data-float-reverse">
          74.3587° E
        </div>

        <div className="pointer-events-none absolute left-[18%] bottom-[25%] text-[11px] tracking-[0.25em] text-[#2F6B2F]/40 animate-data-float">
          REGION SCAN
        </div>

        <div className="pointer-events-none absolute right-[20%] bottom-[18%] text-[11px] tracking-[0.25em] text-[#2F6B2F]/40 animate-data-float-reverse">
          GEO DATA
        </div>

        {/* ================================================= */}
        {/* DECORATIVE SVG */}
        {/* ================================================= */}

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <path
            d="M100 200 C300 150 500 250 700 200"
            stroke="#0D3B0D"
            fill="none"
            strokeWidth="1"
          />

          <path
            d="M80 300 C300 260 550 340 850 290"
            stroke="#0D3B0D"
            fill="none"
            strokeWidth="1"
          />

          <path
            d="M50 420 C250 390 500 470 900 420"
            stroke="#0D3B0D"
            fill="none"
            strokeWidth="1"
          />
        </svg>

        {/* ================================================= */}
        {/* HERO CONTENT */}
        {/* ================================================= */}

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-[1450px] items-center px-6 lg:px-14">
          {/* ================================================= */}
          {/* LEFT CONTENT */}
          {/* ================================================= */}

          <div
            className="relative z-20 max-w-3xl pt-12 lg:pt-0"
            data-aos="fade-right"
            data-aos-duration="1200"
          >
            <h1 className="text-5xl font-bold leading-[0.98] tracking-tight text-[#1A1A1A] sm:text-6xl lg:text-[72px] xl:text-[82px]">
              Find Any Place
              <br />
              From <span className="text-[#2F6B2F]">Any Clue.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#1A1A1A]/70 md:text-xl">
              Describe it. Upload it. Speak it.
              <br />
              Let Nishaan discover where it is.
            </p>

            {/* ================================================= */}
            {/* BUTTONS */}
            {/* ================================================= */}

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/explore"
                className="group flex items-center gap-3 rounded-full bg-[#0D3B0D] px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F6B2F]"
              >
                Start Discovering
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/how-it-works"
                className="flex items-center gap-3 rounded-full border border-[#C8E6C9] bg-white/80 px-7 py-4 font-semibold text-[#1A1A1A] shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#5FAF5F] hover:text-[#0D3B0D]"
              >
                <FiActivity />
                How It Works
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* BOTTOM FADE */}
        {/* ================================================= */}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fbfcf7] to-transparent" />
      </section>

      {/* ================================================= */}
      {/* DISCOVER NISHAAN */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-[#fbfcf7] px-6 py-28">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#C8E6C9]/30 blur-3xl" />

        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#5FAF5F]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* ================================================= */}
          {/* SECTION HEADING */}
          {/* ================================================= */}

          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5FAF5F]">
              Explore Nishaan
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-[#0D3B0D] md:text-6xl">
              More than a map.
              <br />
              <span className="text-[#2F6B2F]">
                A new way to discover places.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#1A1A1A]/65">
              Explore the idea behind Nishaan, see how the system works, and
              discover how geographic intelligence can turn uncertain clues into
              meaningful locations.
            </p>
          </div>

          {/* ================================================= */}
          {/* FEATURE CARDS */}
          {/* ================================================= */}

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* ================================================= */}
            {/* IMAGE CARD */}
            {/* ================================================= */}

            <Link
              href="/image"
              className="group relative overflow-hidden rounded-[2rem] bg-[#0D3B0D] p-8 text-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#5FAF5F]/30 transition-transform duration-700 group-hover:scale-150" />

              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#5FAF5F]/20 transition-transform duration-700 group-hover:scale-150" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5FAF5F] shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <FiImage className="text-3xl text-white" />
                  </div>

                  <FiArrowRight className="text-2xl text-[#5FAF5F] transition-transform duration-500 group-hover:translate-x-2" />
                </div>

                <p className="mt-12 text-xs font-bold uppercase tracking-[0.25em] text-[#5FAF5F]">
                  Visual Search
                </p>

                <h3 className="mt-3 text-3xl font-bold">Find With an Image</h3>

                <p className="mt-4 leading-7 text-[#C8E6C9]">
                  Upload a photo or visual clue and let Nishaan analyze it to
                  discover potential locations.
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white">
                  Explore Image Search
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* ================================================= */}
            {/* VOICE CARD */}
            {/* ================================================= */}

            <Link
              href="/voice"
              className="group relative overflow-hidden rounded-[2rem] border border-[#C8E6C9] bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:border-[#5FAF5F] hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[#C8E6C9]/30 transition-transform duration-700 group-hover:scale-125" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C8E6C9] transition-all duration-500 group-hover:bg-[#5FAF5F]">
                    <FiMic className="text-3xl text-[#0D3B0D] transition-colors duration-500 group-hover:text-white" />
                  </div>

                  <FiArrowRight className="text-2xl text-[#2F6B2F] transition-transform duration-500 group-hover:translate-x-2" />
                </div>

                <p className="mt-12 text-xs font-bold uppercase tracking-[0.25em] text-[#5FAF5F]">
                  Voice Search
                </p>

                <h3 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                  Describe It With Your Voice
                </h3>

                <p className="mt-4 leading-7 text-[#1A1A1A]/65">
                  Tell Nishaan what you remember about a place naturally and let
                  AI turn your words into location clues.
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#2F6B2F]">
                  Try Voice Search
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* ================================================= */}
            {/* TEXT CARD */}
            {/* ================================================= */}

            <Link
              href="/text"
              className="group relative overflow-hidden rounded-[2rem] border border-[#C8E6C9] bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:border-[#5FAF5F] hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#C8E6C9]/25 transition-transform duration-700 group-hover:scale-125" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3B0D] transition-transform duration-500 group-hover:scale-110">
                    <FiEdit3 className="text-3xl text-[#5FAF5F]" />
                  </div>

                  <FiArrowRight className="text-2xl text-[#2F6B2F] transition-transform duration-500 group-hover:translate-x-1" />
                </div>

                <p className="mt-12 text-xs font-bold uppercase tracking-[0.25em] text-[#5FAF5F]">
                  Text Search
                </p>

                <h3 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                  Describe What You Remember
                </h3>

                <p className="mt-4 leading-7 text-[#1A1A1A]/65">
                  Enter any details you remember about a location and let
                  Nishaan search for potential geographic matches.
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#2F6B2F]">
                  Try Text Search
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          {/* ================================================= */}
          {/* LIVE SYSTEM STRIP */}
          {/* ================================================= */}

          <div
            className="mt-8 overflow-hidden rounded-[2rem] border border-[#C8E6C9] bg-[#C8E6C9]/40"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* GEOSPATIAL */}

              <div className="flex items-center gap-5 p-7 md:border-r border-[#C8E6C9]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D3B0D]">
                  <FiTarget className="text-xl text-[#5FAF5F]" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2F6B2F]">
                    Geospatial
                  </p>

                  <p className="mt-1 font-semibold text-[#0D3B0D]">
                    Location Intelligence
                  </p>
                </div>
              </div>

              {/* DISCOVERY */}

              <div className="flex items-center gap-5 p-7 md:border-r border-[#C8E6C9]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2F6B2F]">
                  <FiSearch className="text-xl text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2F6B2F]">
                    Discovery
                  </p>

                  <p className="mt-1 font-semibold text-[#0D3B0D]">
                    Clue-Based Search
                  </p>
                </div>
              </div>

              {/* INTELLIGENCE */}

              <div className="flex items-center gap-5 p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5FAF5F]">
                  <FiGlobe className="text-xl text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2F6B2F]">
                    Intelligence
                  </p>

                  <p className="mt-1 font-semibold text-[#0D3B0D]">
                    AI + Geography
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* FINAL CTA */}
          {/* ================================================= */}

          <div className="mt-24 text-center" data-aos="fade-up">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5FAF5F]">
              Ready to discover?
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#0D3B0D] md:text-5xl">
              Start with a clue.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[#1A1A1A]/60">
              You don't need an exact address. Sometimes all you have is a
              memory, an image, or a description.
            </p>

            <Link
              href="/explore"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#0D3B0D] px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F6B2F] hover:shadow-2xl"
            >
              Explore Nishaan
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
