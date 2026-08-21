"use client";

import {
  FiSearch,
  FiImage,
  FiMic,
  FiEdit3,
  FiMapPin,
  FiMap,
  FiCompass,
  FiArrowRight,
} from "react-icons/fi";

export default function Explore() {
  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="px-6 py-24 md:py-32">

        <div
          className="max-w-5xl mx-auto text-center"
          data-aos="fade-up"
        >

          <p
            className="text-sm md:text-base font-semibold uppercase tracking-[0.3em] text-[#5FAF5F] mb-5"
            data-aos="fade-down"
          >
            Explore with Nishaan
          </p>

          <h1
            className="text-5xl md:text-7xl font-bold leading-tight text-[#0D3B0D]"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Discover Places
            <br />

            <span className="text-[#2F6B2F]">
              From Your Clues.
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto mt-7 text-lg md:text-xl leading-8 text-[#1A1A1A]/70"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Give Nishaan an image, voice description, or text clue
            and explore potential locations that match what you
            know.
          </p>

        </div>


        {/* ================================================= */}
        {/* SEARCH PANEL */}
        {/* ================================================= */}

        <div
          className="max-w-5xl mx-auto mt-14"
          data-aos="zoom-in"
          data-aos-delay="400"
        >

          <div className="bg-white rounded-[2rem] shadow-xl border border-[#C8E6C9] p-6 md:p-10">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-12 h-12 rounded-xl bg-[#0D3B0D] text-white flex items-center justify-center">
                <FiCompass className="text-xl" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0D3B0D]">
                  What do you know about the place?
                </h2>

                <p className="text-sm text-[#1A1A1A]/60">
                  Choose a way to give Nishaan your clue.
                </p>
              </div>

            </div>


            {/* INPUT OPTIONS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* IMAGE */}

              <button
                className="group rounded-2xl border border-[#C8E6C9] p-6 text-left hover:bg-[#C8E6C9]/30 hover:-translate-y-2 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay="500"
              >

                <div className="w-14 h-14 rounded-xl bg-[#0D3B0D] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiImage className="text-2xl" />
                </div>

                <h3 className="text-lg font-bold text-[#0D3B0D]">
                  Search by Image
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                  Upload a photo or visual clue to find
                  potential locations.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#2F6B2F]">
                  Upload Image
                  <FiArrowRight />
                </div>

              </button>


              {/* VOICE */}

              <button
                className="group rounded-2xl border border-[#C8E6C9] p-6 text-left hover:bg-[#C8E6C9]/30 hover:-translate-y-2 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay="650"
              >

                <div className="w-14 h-14 rounded-xl bg-[#2F6B2F] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiMic className="text-2xl" />
                </div>

                <h3 className="text-lg font-bold text-[#0D3B0D]">
                  Search by Voice
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                  Describe the place naturally using your
                  voice.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#2F6B2F]">
                  Record Voice
                  <FiArrowRight />
                </div>

              </button>


              {/* TEXT */}

              <button
                className="group rounded-2xl border border-[#C8E6C9] p-6 text-left hover:bg-[#C8E6C9]/30 hover:-translate-y-2 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay="800"
              >

                <div className="w-14 h-14 rounded-xl bg-[#5FAF5F] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiEdit3 className="text-2xl" />
                </div>

                <h3 className="text-lg font-bold text-[#0D3B0D]">
                  Search by Text
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                  Enter whatever details you remember about
                  the location.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#2F6B2F]">
                  Enter Clue
                  <FiArrowRight />
                </div>

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* EXAMPLE CLUES */}
      {/* ================================================= */}

      <section className="px-6 py-24 bg-white">

        <div className="max-w-7xl mx-auto">

          <div
            className="text-center mb-14"
            data-aos="fade-up"
          >

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F] mb-4">
              Start With a Clue
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0D3B0D]">
              You Don't Need the Exact Name
            </h2>

            <p className="max-w-2xl mx-auto mt-5 text-[#1A1A1A]/70 leading-7">
              Even small details can help narrow down a potential
              location.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* LANDMARK */}

            <div
              className="rounded-3xl bg-[#fbfcf7] border border-[#C8E6C9] p-8 hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >

              <div className="w-14 h-14 rounded-2xl bg-[#C8E6C9] text-[#0D3B0D] flex items-center justify-center mb-6">
                <FiMapPin className="text-2xl" />
              </div>

              <h3 className="text-xl font-bold text-[#0D3B0D]">
                A Landmark
              </h3>

              <p className="mt-3 text-[#1A1A1A]/70 leading-7">
                "There is a large mosque near the market and
                a main road."
              </p>

            </div>


            {/* ROAD */}

            <div
              className="rounded-3xl bg-[#fbfcf7] border border-[#C8E6C9] p-8 hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="250"
            >

              <div className="w-14 h-14 rounded-2xl bg-[#C8E6C9] text-[#0D3B0D] flex items-center justify-center mb-6">
                <FiMap className="text-2xl" />
              </div>

              <h3 className="text-xl font-bold text-[#0D3B0D]">
                Geographic Details
              </h3>

              <p className="mt-3 text-[#1A1A1A]/70 leading-7">
                "The place is beside a river and close to a
                university."
              </p>

            </div>


            {/* DESCRIPTION */}

            <div
              className="rounded-3xl bg-[#fbfcf7] border border-[#C8E6C9] p-8 hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >

              <div className="w-14 h-14 rounded-2xl bg-[#C8E6C9] text-[#0D3B0D] flex items-center justify-center mb-6">
                <FiSearch className="text-2xl" />
              </div>

              <h3 className="text-xl font-bold text-[#0D3B0D]">
                A Description
              </h3>

              <p className="mt-3 text-[#1A1A1A]/70 leading-7">
                "I remember a busy street with shops and a
                distinctive building."
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAP PREVIEW */}
      {/* ================================================= */}

      <section className="px-6 py-24">

        <div className="max-w-6xl mx-auto">

          <div
            className="rounded-[2rem] bg-[#0D3B0D] p-8 md:p-14 overflow-hidden"
            data-aos="zoom-in"
          >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* TEXT */}

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F] mb-5">
                  Explore Results
                </p>

                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Explore Potential Locations
                </h2>

                <p className="mt-6 text-[#C8E6C9] leading-8">
                  Once Nishaan processes your clues, potential
                  locations can be explored through geographic
                  results and an interactive map.
                </p>

                <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#5FAF5F] px-7 py-3.5 text-white font-semibold hover:bg-[#2F6B2F] transition">
                  Start Exploring
                  <FiArrowRight />
                </button>

              </div>


              {/* MAP PLACEHOLDER */}

              <div
                className="h-[300px] md:h-[350px] rounded-3xl bg-[#C8E6C9]/20 border border-white/10 flex items-center justify-center"
                data-aos="fade-left"
                data-aos-delay="300"
              >

                <div className="text-center text-white">

                  <FiMap
                    className="text-6xl mx-auto mb-5 text-[#5FAF5F]"
                  />

                  <h3 className="text-xl font-semibold">
                    Interactive Map
                  </h3>

                  <p className="mt-2 text-sm text-[#C8E6C9]">
                    Location results will appear here
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}

      <section className="px-6 py-24 bg-[#C8E6C9]/30">

        <div
          className="max-w-4xl mx-auto text-center"
          data-aos="fade-up"
        >

          <div
            className="w-16 h-16 mx-auto rounded-2xl bg-[#0D3B0D] text-white flex items-center justify-center mb-7"
            data-aos="zoom-in"
          >
            <FiCompass className="text-3xl" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0D3B0D]">
            Have a Place in Mind?
          </h2>

          <p className="max-w-2xl mx-auto mt-5 text-lg leading-8 text-[#1A1A1A]/70">
            Give Nishaan the clues you remember and start
            discovering potential locations.
          </p>

          <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#0D3B0D] px-8 py-4 text-white font-semibold hover:bg-[#2F6B2F] transition-all duration-300 hover:-translate-y-1">
            Explore with Nishaan
            <FiArrowRight />
          </button>

        </div>

      </section>

    </main>
  );
}