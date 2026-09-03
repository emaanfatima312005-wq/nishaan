"use client";

import {
  FiImage,
  FiMic,
  FiEdit3,
  FiCpu,
  FiGlobe,
  FiMap,
  FiSearch,
  FiCheckCircle,
} from "react-icons/fi";

export default function About() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfcf7] text-[#1A1A1A]">
      {/* ================================================= */}
      {/* FULL PAGE BACKGROUND IMAGE */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <img
          src="/images/download.png"
          alt=""
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
            object-cover
          "
        />

        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/25" />

        {/* Readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/45" />
      </div>

      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <div className="relative z-10">
        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="flex min-h-[70vh] items-center justify-center px-6 py-24">
          <div
            className="mx-auto max-w-4xl text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <p
              className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#2F6B2F] md:text-base"
              data-aos="fade-down"
              data-aos-duration="800"
            >
              About Nishaan
            </p>

            <h1
              className="text-5xl font-bold leading-tight text-[#0D3B0D] md:text-7xl"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Find Any Place.
              <br />
              <span className="text-[#2F6B2F]">From Any Clue.</span>
            </h1>

            <p
              className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#1A1A1A] md:text-xl"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Nishaan is an AI-powered geospatial assistance system designed to
              make location discovery simpler, smarter, and more intuitive.
            </p>

            <p
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#1A1A1A]/70"
              data-aos="fade-up"
              data-aos-delay="450"
            >
              Instead of requiring an exact place name, address, or coordinates,
              Nishaan allows you to describe what you know about a location and
              helps identify potential matches.
            </p>
          </div>
        </section>

        {/* ================================================= */}
        {/* WHAT IS NISHAAN */}
        {/* ================================================= */}

        <section className="bg-white/65 px-6 py-24 backdrop-blur-[3px]">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* LEFT */}

              <div data-aos="fade-right" data-aos-duration="1000">
                <p
                  className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  Our Platform
                </p>

                <h2
                  className="mb-6 text-4xl font-bold text-[#0D3B0D] md:text-5xl"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  What is Nishaan?
                </h2>

                <p
                  className="text-lg leading-8 text-[#1A1A1A]"
                  data-aos="fade-right"
                  data-aos-delay="300"
                >
                  Nishaan combines artificial intelligence, geographic data, and
                  spatial search to help users identify and locate real-world
                  places and landmarks.
                </p>

                <p
                  className="mt-5 leading-7 text-[#1A1A1A]/70"
                  data-aos="fade-right"
                  data-aos-delay="400"
                >
                  You don't always need to know the exact name of a place. You
                  can provide the clues you remember and let Nishaan help turn
                  those clues into potential locations.
                </p>
              </div>

              {/* RIGHT — INPUT TYPES */}

              <div
                className="rounded-3xl bg-[#0D3B0D]/90 p-8 shadow-xl backdrop-blur-sm md:p-10"
                data-aos="fade-left"
                data-aos-duration="1000"
              >
                <h3
                  className="mb-8 text-2xl font-bold text-white"
                  data-aos="fade-down"
                  data-aos-delay="200"
                >
                  Give Nishaan a clue
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* IMAGE */}

                  <div
                    className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
                    data-aos="zoom-in"
                    data-aos-delay="300"
                  >
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#5FAF5F]">
                      <FiImage className="text-2xl text-white" />
                    </div>

                    <h4 className="font-semibold text-white">Image</h4>

                    <p className="mt-2 text-sm text-[#C8E6C9]">
                      Upload visual clues
                    </p>
                  </div>

                  {/* VOICE */}

                  <div
                    className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
                    data-aos="zoom-in"
                    data-aos-delay="450"
                  >
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#5FAF5F]">
                      <FiMic className="text-2xl text-white" />
                    </div>

                    <h4 className="font-semibold text-white">Voice</h4>

                    <p className="mt-2 text-sm text-[#C8E6C9]">
                      Describe naturally
                    </p>
                  </div>

                  {/* TEXT */}

                  <div
                    className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
                    data-aos="zoom-in"
                    data-aos-delay="600"
                  >
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#5FAF5F]">
                      <FiEdit3 className="text-2xl text-white" />
                    </div>

                    <h4 className="font-semibold text-white">Text</h4>

                    <p className="mt-2 text-sm text-[#C8E6C9]">
                      Enter location clues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* HOW NISHAAN WORKS */}
        {/* ================================================= */}

        <section className="bg-white/40 px-6 py-24 backdrop-blur-[2px]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center" data-aos="fade-up">
              <p
                className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]"
                data-aos="fade-down"
              >
                The Process
              </p>

              <h2
                className="text-4xl font-bold text-[#0D3B0D] md:text-5xl"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                From Your Clues to a Location
              </h2>

              <p
                className="mx-auto mt-5 max-w-2xl leading-7 text-[#1A1A1A]/70"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Nishaan transforms the information you provide into potential
                geographic matches.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {/* STEP 1 */}

              <div
                className="rounded-2xl border border-[#C8E6C9] bg-white/75 p-7 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0D3B0D] font-bold text-white">
                  01
                </div>

                <h3 className="mt-5 font-bold text-[#0D3B0D]">Your Input</h3>

                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/70">
                  Provide an image, voice description, or text.
                </p>
              </div>

              {/* STEP 2 */}

              <div
                className="rounded-2xl border border-[#C8E6C9] bg-white/75 p-7 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F6B2F] text-white">
                  <FiCpu className="text-xl" />
                </div>

                <h3 className="mt-5 font-bold text-[#0D3B0D]">AI Analysis</h3>

                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/70">
                  AI interprets the information you provide.
                </p>
              </div>

              {/* STEP 3 */}

              <div
                className="rounded-2xl border border-[#C8E6C9] bg-white/75 p-7 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5FAF5F] text-white">
                  <FiSearch className="text-xl" />
                </div>

                <h3 className="mt-5 font-bold text-[#0D3B0D]">
                  Location Clues
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/70">
                  Useful geographic clues are extracted.
                </p>
              </div>

              {/* STEP 4 */}

              <div
                className="rounded-2xl border border-[#C8E6C9] bg-white/75 p-7 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F6B2F] text-white">
                  <FiGlobe className="text-xl" />
                </div>

                <h3 className="mt-5 font-bold text-[#0D3B0D]">
                  Geographic Search
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/70">
                  Geographic data is searched for potential matches.
                </p>
              </div>

              {/* STEP 5 */}

              <div
                className="rounded-2xl border border-[#C8E6C9] bg-white/75 p-7 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0D3B0D] text-white">
                  <FiMap className="text-xl" />
                </div>

                <h3 className="mt-5 font-bold text-[#0D3B0D]">
                  Interactive Map
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/70">
                  Potential locations can be explored visually.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* WHY NISHAAN */}
        {/* ================================================= */}

        <section className="bg-[#C8E6C9]/35 px-6 py-24 backdrop-blur-[3px]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center" data-aos="fade-up">
              <p
                className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#2F6B2F]"
                data-aos="fade-down"
              >
                Why Nishaan
              </p>

              <h2
                className="text-4xl font-bold text-[#0D3B0D] md:text-5xl"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                Built for Smarter Discovery
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* AI */}

              <div
                className="rounded-3xl border border-[#C8E6C9] bg-white/80 p-9 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-3"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div
                  className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3B0D] text-white"
                  data-aos="zoom-in"
                  data-aos-delay="250"
                >
                  <FiCpu className="text-3xl" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-[#0D3B0D]">
                  AI-Powered
                </h3>

                <p className="leading-7 text-[#1A1A1A]/70">
                  Nishaan uses AI to interpret descriptions, spoken information,
                  and images to extract useful location-related clues.
                </p>
              </div>

              {/* GEOSPATIAL */}

              <div
                className="rounded-3xl border border-[#C8E6C9] bg-white/80 p-9 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-3"
                data-aos="fade-up"
                data-aos-delay="250"
              >
                <div
                  className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2F6B2F] text-white"
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  <FiGlobe className="text-3xl" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-[#0D3B0D]">
                  Geospatial Intelligence
                </h3>

                <p className="leading-7 text-[#1A1A1A]/70">
                  Location clues are combined with geographic and spatial search
                  to identify potentially relevant places.
                </p>
              </div>

              {/* MAP */}

              <div
                className="rounded-3xl border border-[#C8E6C9] bg-white/80 p-9 shadow-md backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-3"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div
                  className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5FAF5F] text-white"
                  data-aos="zoom-in"
                  data-aos-delay="550"
                >
                  <FiMap className="text-3xl" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-[#0D3B0D]">
                  Interactive Discovery
                </h3>

                <p className="leading-7 text-[#1A1A1A]/70">
                  Potential locations can be explored visually through an
                  interactive map and geographic results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* PAKISTAN */}
        {/* ================================================= */}

        <section className="bg-white/65 px-6 py-24 backdrop-blur-[3px]">
          <div
            className="mx-auto max-w-4xl text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div
              className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C8E6C9] text-[#0D3B0D]"
              data-aos="zoom-in"
            >
              <FiGlobe className="text-3xl" />
            </div>

            <p
              className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]"
              data-aos="fade-down"
              data-aos-delay="150"
            >
              Made With Pakistan in Mind
            </p>

            <h2
              className="text-4xl font-bold text-[#0D3B0D] md:text-5xl"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              Location Discovery That Understands Local Clues
            </h2>

            <p
              className="mt-7 text-lg leading-8 text-[#1A1A1A]/70"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Nishaan is designed around the Pakistani geographic context,
              supporting location clues such as landmarks, roads, markets,
              public buildings, educational institutions, religious places, and
              other recognizable locations.
            </p>
          </div>
        </section>

        {/* ================================================= */}
        {/* TRUST SECTION */}
        {/* ================================================= */}

        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div
              className="rounded-[2rem] bg-[#0D3B0D]/90 px-8 py-16 text-center shadow-xl backdrop-blur-sm md:px-16"
              data-aos="zoom-in"
              data-aos-duration="1000"
            >
              <div
                className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5FAF5F] text-white"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <FiCheckCircle className="text-3xl" />
              </div>

              <p
                className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]"
                data-aos="fade-down"
                data-aos-delay="300"
              >
                Built With Trust in Mind
              </p>

              <h2
                className="text-4xl font-bold leading-tight text-white md:text-5xl"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                AI Helps Interpret.
                <br />
                <span className="text-[#5FAF5F]">Geography Helps Verify.</span>
              </h2>

              <p
                className="mx-auto mt-7 max-w-2xl leading-8 text-[#C8E6C9]"
                data-aos="fade-up"
                data-aos-delay="550"
              >
                Nishaan treats AI-generated information as an interpretation of
                your clues. Geographic matching helps identify potential
                locations rather than presenting AI output as geographic truth.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
