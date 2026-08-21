"use client";

import {
  FiImage,
  FiMic,
  FiEdit3,
  FiCpu,
  FiSearch,
  FiMapPin,
  FiArrowDown,
  FiCheckCircle,
  FiMap,
  FiZap,
} from "react-icons/fi";

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">

{/* ================================================= */}
{/* HOW IT WORKS HERO */}
{/* ================================================= */}

<section
  className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#0D3B0D] text-white"
  style={{
    backgroundImage: "url('/images/hero.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>

  {/* Dark Green Overlay */}

 <div className="absolute inset-0 bg-[#0D3B0D]/30" />

  {/* Hero Content */}

  <div
    className="relative z-10 max-w-5xl mx-auto text-center px-6 py-24"
    data-aos="fade-up"
  >

    {/* Heading */}

    <h1
      className="text-5xl md:text-7xl font-bold leading-tight"
      data-aos="fade-up"
      data-aos-delay="200"
    >

      How Nishaan

      <br />

      <span className="text-[#5FAF5F]">
        Finds a Place
      </span>

    </h1>


    {/* Description */}

    <p
      className="max-w-2xl mx-auto mt-7 text-lg md:text-xl text-[#C8E6C9] leading-8"
      data-aos="fade-up"
      data-aos-delay="350"
    >
      You provide the clue.
      Nishaan understands it.
      Geography helps narrow it down.
    </p>

  </div>

</section>
      {/* ================================================= */}
      {/* MAIN VISUAL FLOW */}
      {/* ================================================= */}

      <section className="px-6 py-24 md:py-32">

        <div className="max-w-6xl mx-auto">

          {/* SECTION TITLE */}

          <div
            className="text-center mb-20"
            data-aos="fade-up"
          >

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5FAF5F]">
              The Journey
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0D3B0D]">
              One clue. Five stages.
            </h2>

          </div>


          {/* ================================================= */}
          {/* STAGE 01 */}
          {/* ================================================= */}

          <div
            className="relative flex flex-col md:flex-row items-center gap-10 md:gap-20"
            data-aos="fade-right"
          >

            {/* NUMBER */}

            <div className="relative shrink-0">

              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#0D3B0D] text-white flex items-center justify-center">

                <div className="text-center">

                  <span className="block text-sm text-[#5FAF5F]">
                    STEP
                  </span>

                  <span className="text-4xl font-bold">
                    01
                  </span>

                </div>

              </div>

            </div>


            {/* CONTENT */}

            <div className="flex-1">

              <p className="text-[#5FAF5F] font-semibold uppercase tracking-wider text-sm">
                Input
              </p>

              <h3 className="text-3xl md:text-4xl font-bold text-[#0D3B0D] mt-2">
                Start With Any Clue
              </h3>

              <p className="mt-4 max-w-xl text-lg leading-8 text-[#1A1A1A]/70">
                You don't need an exact address or place name.
                Give Nishaan whatever information you remember.
              </p>


              {/* INPUT TYPES */}

              <div className="flex flex-wrap gap-3 mt-7">

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#C8E6C9] shadow-sm">
                  <FiImage className="text-[#2F6B2F]" />
                  <span className="text-sm font-medium">
                    Image
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#C8E6C9] shadow-sm">
                  <FiMic className="text-[#2F6B2F]" />
                  <span className="text-sm font-medium">
                    Voice
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#C8E6C9] shadow-sm">
                  <FiEdit3 className="text-[#2F6B2F]" />
                  <span className="text-sm font-medium">
                    Text
                  </span>
                </div>

              </div>

            </div>

          </div>


          {/* CONNECTOR */}

          <div className="flex justify-center py-10">

            <div
              className="h-20 border-l-2 border-dashed border-[#5FAF5F]"
              data-aos="fade-down"
            />

          </div>


          {/* ================================================= */}
          {/* STAGE 02 */}
          {/* ================================================= */}

          <div
            className="relative flex flex-col md:flex-row-reverse items-center gap-10 md:gap-20"
            data-aos="fade-left"
          >

            <div className="shrink-0">

              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#2F6B2F] text-white flex items-center justify-center">

                <div className="text-center">

                  <span className="block text-sm text-[#C8E6C9]">
                    STEP
                  </span>

                  <span className="text-4xl font-bold">
                    02
                  </span>

                </div>

              </div>

            </div>


            <div className="flex-1 md:text-right">

              <p className="text-[#5FAF5F] font-semibold uppercase tracking-wider text-sm">
                Understanding
              </p>

              <h3 className="text-3xl md:text-4xl font-bold text-[#0D3B0D] mt-2">
                AI Understands Your Clue
              </h3>

              <p className="mt-4 max-w-xl md:ml-auto text-lg leading-8 text-[#1A1A1A]/70">
                Nishaan analyzes the information you provide and
                identifies meaningful details that could help
                describe the location.
              </p>

              <div className="mt-7 flex md:justify-end">

                <div className="inline-flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#C8E6C9]/40 border border-[#C8E6C9]">

                  <FiCpu className="text-2xl text-[#0D3B0D]" />

                  <span className="font-semibold text-[#0D3B0D]">
                    AI Analysis
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* CONNECTOR */}

          <div className="flex justify-center py-10">

            <div
              className="h-20 border-l-2 border-dashed border-[#5FAF5F]"
              data-aos="fade-down"
            />

          </div>


          {/* ================================================= */}
          {/* STAGE 03 */}
          {/* ================================================= */}

          <div
            className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
            data-aos="fade-right"
          >

            <div className="shrink-0">

              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#5FAF5F] text-white flex items-center justify-center">

                <div className="text-center">

                  <span className="block text-sm text-white/80">
                    STEP
                  </span>

                  <span className="text-4xl font-bold">
                    03
                  </span>

                </div>

              </div>

            </div>


            <div className="flex-1">

              <p className="text-[#5FAF5F] font-semibold uppercase tracking-wider text-sm">
                Extraction
              </p>

              <h3 className="text-3xl md:text-4xl font-bold text-[#0D3B0D] mt-2">
                Location Clues Are Extracted
              </h3>

              <p className="mt-4 max-w-xl text-lg leading-8 text-[#1A1A1A]/70">
                Important geographic information is separated
                from the rest of the description to help narrow
                down the possibilities.
              </p>


              {/* CLUE TAGS */}

              <div className="flex flex-wrap gap-3 mt-7">

                {[
                  "Landmarks",
                  "Roads",
                  "Buildings",
                  "Markets",
                  "Nearby Places",
                ].map((item, index) => (

                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-white border border-[#C8E6C9] text-sm text-[#2F6B2F]"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    {item}
                  </span>

                ))}

              </div>

            </div>

          </div>


          {/* CONNECTOR */}

          <div className="flex justify-center py-10">

            <div
              className="h-20 border-l-2 border-dashed border-[#5FAF5F]"
              data-aos="fade-down"
            />

          </div>


          {/* ================================================= */}
          {/* STAGE 04 */}
          {/* ================================================= */}

          <div
            className="relative flex flex-col md:flex-row-reverse items-center gap-10 md:gap-20"
            data-aos="fade-left"
          >

            <div className="shrink-0">

              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#0D3B0D] text-white flex items-center justify-center">

                <div className="text-center">

                  <span className="block text-sm text-[#5FAF5F]">
                    STEP
                  </span>

                  <span className="text-4xl font-bold">
                    04
                  </span>

                </div>

              </div>

            </div>


            <div className="flex-1 md:text-right">

              <p className="text-[#5FAF5F] font-semibold uppercase tracking-wider text-sm">
                Geospatial Search
              </p>

              <h3 className="text-3xl md:text-4xl font-bold text-[#0D3B0D] mt-2">
                Geography Narrows It Down
              </h3>

              <p className="mt-4 max-w-xl md:ml-auto text-lg leading-8 text-[#1A1A1A]/70">
                The extracted clues are used alongside geographic
                information to identify places that could match
                what you described.
              </p>


              {/* SEARCH VISUAL */}

              <div className="mt-7 flex md:justify-end">

                <div className="relative w-full max-w-sm h-28 rounded-2xl bg-[#0D3B0D] overflow-hidden">

                  {/* Map-like lines */}

                  <div className="absolute inset-0 opacity-20">

                    <div className="absolute top-5 left-0 right-0 border-t border-white rotate-6" />
                    <div className="absolute top-14 left-0 right-0 border-t border-white -rotate-6" />
                    <div className="absolute left-20 top-0 bottom-0 border-l border-white rotate-12" />
                    <div className="absolute left-48 top-0 bottom-0 border-l border-white -rotate-12" />

                  </div>

                  <FiSearch className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-[#5FAF5F]" />

                </div>

              </div>

            </div>

          </div>


          {/* CONNECTOR */}

          <div className="flex justify-center py-10">

            <div
              className="h-20 border-l-2 border-dashed border-[#5FAF5F]"
              data-aos="fade-down"
            />

          </div>


          {/* ================================================= */}
          {/* STAGE 05 */}
          {/* ================================================= */}

          <div
            className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
            data-aos="fade-right"
          >

            <div className="shrink-0">

              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#5FAF5F] text-white flex items-center justify-center shadow-xl shadow-[#5FAF5F]/30">

                <div className="text-center">

                  <span className="block text-sm text-white/80">
                    STEP
                  </span>

                  <span className="text-4xl font-bold">
                    05
                  </span>

                </div>

              </div>

            </div>


            <div className="flex-1">

              <p className="text-[#5FAF5F] font-semibold uppercase tracking-wider text-sm">
                Discovery
              </p>

              <h3 className="text-3xl md:text-4xl font-bold text-[#0D3B0D] mt-2">
                Explore Potential Locations
              </h3>

              <p className="mt-4 max-w-xl text-lg leading-8 text-[#1A1A1A]/70">
                Nishaan presents potential locations that you
                can explore visually and compare.
              </p>


              {/* RESULT PREVIEW */}

              <div className="mt-8 bg-white rounded-2xl border border-[#C8E6C9] shadow-lg p-5 max-w-md">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-[#C8E6C9] flex items-center justify-center">
                    <FiMapPin className="text-xl text-[#0D3B0D]" />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm text-[#1A1A1A]/50">
                      Potential Match
                    </p>

                    <p className="font-bold text-[#0D3B0D]">
                      Location identified
                    </p>

                  </div>

                  <FiCheckCircle className="text-xl text-[#5FAF5F]" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

{/* ================================================= */}
{/* BIG FINAL VISUAL */}
{/* ================================================= */}

<section className="px-6 py-28 bg-[#fbfcf7] overflow-hidden">

  <div
    className="max-w-5xl mx-auto text-center text-[#1A1A1A]"
    data-aos="zoom-in"
  >

    {/* Map Icon */}

    <div
      className="relative mx-auto w-28 h-28 rounded-full bg-[#0D3B0D] flex items-center justify-center mb-10"
      data-aos="zoom-in"
      data-aos-delay="200"
    >

      <FiMap className="text-5xl text-white" />

      <div className="absolute inset-0 rounded-full border-2 border-[#5FAF5F] animate-ping opacity-30" />

    </div>


    {/* Label */}

    <p className="text-sm uppercase tracking-[0.3em] text-[#2F6B2F] font-semibold">

      The Result

    </p>


    {/* Heading */}

    <h2 className="mt-5 text-4xl md:text-6xl font-bold text-[#0D3B0D]">

      From something you remember

      <br />

      <span className="text-[#2F6B2F]">

        to somewhere you can find.

      </span>

    </h2>


    {/* Description */}

    <p className="max-w-2xl mx-auto mt-7 text-[#1A1A1A]/70 text-lg leading-8">

      Nishaan brings together AI interpretation and
      geographic intelligence to help turn uncertain clues
      into potential places.

    </p>

  </div>

</section>
    </main>
  );
}