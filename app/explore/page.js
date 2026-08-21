"use client";

import {
  FiMapPin,
  FiCamera,
  FiMessageCircle,
  FiNavigation,
  FiSearch,
  FiCompass,
  FiHome,
  FiBookOpen,
  FiShoppingBag,
  FiMap,
  FiArrowRight,
  FiImage,
} from "react-icons/fi";

export default function Explore() {
  const categories = [
    {
      icon: FiHome,
      title: "Religious Places",
      description:
        "Explore mosques, shrines, churches, temples, and other recognizable religious locations.",
    },
    {
      icon: FiBookOpen,
      title: "Educational Places",
      description:
        "Identify universities, schools, colleges, libraries, and other educational locations.",
    },
    {
      icon: FiMapPin,
      title: "Landmarks",
      description:
        "Discover recognizable landmarks from the details you remember about them.",
    },
    {
      icon: FiNavigation,
      title: "Roads & Streets",
      description:
        "Use surrounding roads, intersections, and geographic clues to narrow down a place.",
    },
    {
      icon: FiShoppingBag,
      title: "Markets & Shops",
      description:
        "Explore commercial areas and locations based on memorable surroundings.",
    },
    {
      icon: FiMap,
      title: "Public Places",
      description:
        "Discover parks, public buildings, transport areas, and other everyday locations.",
    },
  ];

  const scenarios = [
    {
      icon: FiCamera,
      number: "01",
      title: "A forgotten photograph",
      text: "You have a picture of a place but cannot remember where it was taken.",
    },
    {
      icon: FiMessageCircle,
      number: "02",
      title: "A place you remember",
      text: "You remember what was around a location, but not its name or exact address.",
    },
    {
      icon: FiCompass,
      number: "03",
      title: "A vague direction",
      text: "You remember a road, landmark, market, or building that was somewhere nearby.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">

      {/* ================================================= */}
{/* EXPLORE HERO */}
{/* ================================================= */}

<section className="relative min-h-[75vh] overflow-hidden bg-[#0D3B0D] text-white">

  {/* ================= MAP GRID TEXTURE ================= */}

  <div
    className="absolute inset-0 opacity-[0.10]"
    style={{
      backgroundImage: `
        linear-gradient(#C8E6C9 1px, transparent 1px),
        linear-gradient(90deg, #C8E6C9 1px, transparent 1px)
      `,
      backgroundSize: "70px 70px",
    }}
  />


  {/* ================= LARGE MAP CIRCLES ================= */}

  <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-[#5FAF5F]/20" />

  <div className="absolute -top-24 -right-24 w-[430px] h-[430px] rounded-full border border-[#5FAF5F]/20" />

  <div className="absolute -top-8 -right-8 w-[260px] h-[260px] rounded-full border border-[#5FAF5F]/20" />


  {/* ================= GREEN GLOW ================= */}

  <div className="absolute top-1/2 right-[-150px] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5FAF5F]/20 blur-[120px]" />

  <div className="absolute bottom-[-200px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[#2F6B2F]/40 blur-[100px]" />


  {/* ================= DECORATIVE ROUTE ================= */}

  <svg
    className="absolute right-[8%] top-[15%] w-[420px] h-[420px] opacity-30 hidden lg:block"
    viewBox="0 0 420 420"
    fill="none"
  >

    <path
      d="M40 350 C100 270, 130 320, 180 230 C230 140, 270 190, 320 100 C350 60, 370 70, 390 40"
      stroke="#5FAF5F"
      strokeWidth="3"
      strokeDasharray="8 10"
    />

    <circle
      cx="40"
      cy="350"
      r="7"
      fill="#5FAF5F"
    />

    <circle
      cx="180"
      cy="230"
      r="7"
      fill="#5FAF5F"
    />

    <circle
      cx="320"
      cy="100"
      r="7"
      fill="#5FAF5F"
    />

  </svg>


  {/* ================= FLOATING LOCATION MARKERS ================= */}

  <div
    className="absolute top-[20%] left-[10%] hidden md:block animate-bounce"
    style={{ animationDuration: "3s" }}
  >

    <div className="w-12 h-12 rounded-full bg-[#5FAF5F]/20 border border-[#5FAF5F]/40 backdrop-blur-sm flex items-center justify-center">

      <FiMapPin className="text-[#5FAF5F] text-xl" />

    </div>

  </div>


  <div
    className="absolute bottom-[20%] left-[17%] hidden md:block animate-bounce"
    style={{ animationDuration: "4s" }}
  >

    <div className="w-10 h-10 rounded-full bg-white/5 border border-[#C8E6C9]/20 backdrop-blur-sm flex items-center justify-center">

      <FiMapPin className="text-[#C8E6C9]" />

    </div>

  </div>


  <div
    className="absolute top-[30%] right-[12%] hidden lg:block animate-pulse"
  >

    <div className="relative">

      <div className="absolute inset-0 rounded-full bg-[#5FAF5F] animate-ping opacity-30" />

      <div className="relative w-4 h-4 rounded-full bg-[#5FAF5F]" />

    </div>

  </div>


  {/* ================= HERO CONTENT ================= */}

  <div
    className="relative z-10 min-h-[75vh] max-w-7xl mx-auto px-6 flex items-center"
  >

    <div className="max-w-4xl">

      {/* Heading */}

      <h1
        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05]"
        data-aos="fade-up"
        data-aos-delay="150"
      >

        There is more

        <br />

        to a place

        <br />

        <span className="text-[#5FAF5F]">
          than its name.
        </span>

      </h1>


      {/* Description */}

      <p
        className="max-w-2xl mt-8 text-lg md:text-xl text-[#C8E6C9] leading-8"
        data-aos="fade-up"
        data-aos-delay="300"
      >

        Explore places through the clues you remember,
        the things you have seen, and the details that make
        every location unique.

      </p>

      </div>

    </div>

</section>

      {/* ================================================= */}
      {/* WHAT CAN YOU EXPLORE */}
      {/* ================================================= */}

      <section className="px-6 py-24">

        <div className="max-w-7xl mx-auto">

          <div
            className="max-w-3xl mb-14"
            data-aos="fade-up"
          >

            <p className="text-sm uppercase tracking-[0.25em] text-[#5FAF5F] font-semibold mb-4">
              Discover Possibilities
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0D3B0D]">
              What can Nishaan help you explore?
            </h2>

            <p className="mt-5 text-lg text-[#1A1A1A]/70 leading-8">
              Places do not always come with perfect descriptions.
              Sometimes a few recognizable details are enough to
              start exploring.
            </p>

          </div>


          {/* Category Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {categories.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group bg-white rounded-3xl p-8 border border-[#C8E6C9] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >

                  <div className="w-14 h-14 rounded-2xl bg-[#C8E6C9]/60 text-[#0D3B0D] flex items-center justify-center mb-7 group-hover:bg-[#0D3B0D] group-hover:text-white transition-all duration-300">

                    <Icon className="text-2xl" />

                  </div>

                  <h3 className="text-xl font-bold text-[#0D3B0D]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[#1A1A1A]/70 leading-7">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* IMAGINE THIS */}
      {/* ================================================= */}

      <section className="px-6 py-24 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}

            <div
              data-aos="fade-right"
              data-aos-duration="1000"
            >

              <p className="text-sm uppercase tracking-[0.25em] text-[#5FAF5F] font-semibold mb-4">
                Imagine This
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-[#0D3B0D] leading-tight">
                You remember the place.
                <br />

                <span className="text-[#2F6B2F]">
                  Just not the name.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#1A1A1A]/70">
                Maybe you remember a green mosque beside a busy
                market. Maybe there was a university near a large
                roundabout. Or maybe you simply have a photograph
                with no location attached.
              </p>

              <p className="mt-5 leading-7 text-[#1A1A1A]/60">
                These details can become clues to explore instead
                of memories that lead nowhere.
              </p>

            </div>


            {/* Right — Example Clue */}

            <div
              className="relative"
              data-aos="fade-left"
              data-aos-duration="1000"
            >

              <div className="rounded-[2rem] bg-[#0D3B0D] p-8 md:p-10 shadow-2xl">

                <div className="flex items-center gap-4 mb-8">

                  <div className="w-12 h-12 rounded-xl bg-[#5FAF5F] flex items-center justify-center text-white">

                    <FiMessageCircle className="text-xl" />

                  </div>

                  <div>

                    <p className="text-sm text-[#C8E6C9]">
                      Example clue
                    </p>

                    <p className="font-semibold text-white">
                      Something you remember
                    </p>

                  </div>

                </div>


                <div className="rounded-2xl bg-white/10 border border-white/10 p-6">

                  <p className="text-lg md:text-xl text-white leading-8">

                    "I remember a large mosque with a green
                    dome, close to a busy market and a wide road."

                  </p>

                </div>


                <div className="mt-7 flex items-center gap-3 text-[#C8E6C9]">

                  <FiSearch />

                  <span className="text-sm">
                    A clue becomes something you can explore.
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* REAL WORLD SCENARIOS */}
      {/* ================================================= */}

      <section className="px-6 py-24 bg-[#C8E6C9]/20">

        <div className="max-w-7xl mx-auto">

          <div
            className="text-center max-w-3xl mx-auto mb-16"
            data-aos="fade-up"
          >

            <p className="text-sm uppercase tracking-[0.25em] text-[#2F6B2F] font-semibold mb-4">
              Real-World Discovery
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0D3B0D]">
              When Nishaan becomes useful
            </h2>

            <p className="mt-5 text-[#1A1A1A]/70 leading-7">
              Not every location search starts with an address.
              Sometimes it starts with a memory.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

            {scenarios.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="relative bg-white rounded-3xl p-8 border border-[#C8E6C9] shadow-sm"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >

                  <span className="absolute top-7 right-8 text-5xl font-bold text-[#C8E6C9]">
                    {item.number}
                  </span>

                  <div className="w-14 h-14 rounded-2xl bg-[#0D3B0D] text-white flex items-center justify-center">

                    <Icon className="text-2xl" />

                  </div>

                  <h3 className="mt-7 text-xl font-bold text-[#0D3B0D]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-[#1A1A1A]/70 leading-7">
                    {item.text}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* EXPLORE PAKISTAN */}
      {/* ================================================= */}

      <section className="px-6 py-28 bg-white overflow-hidden">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Pakistan Visual */}

            <div
              className="relative order-2 lg:order-1"
              data-aos="fade-right"
            >

              <div className="relative rounded-[2rem] bg-[#0D3B0D] min-h-[420px] overflow-hidden flex items-center justify-center">

                {/* Decorative grid */}

                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(#C8E6C9 1px, transparent 1px), linear-gradient(90deg, #C8E6C9 1px, transparent 1px)",
                    backgroundSize: "45px 45px",
                  }}
                />

                <div className="relative z-10 text-center">

                  <FiMap
                    className="text-[#5FAF5F] text-8xl mx-auto mb-6"
                  />

                  <h3 className="text-3xl font-bold text-white">
                    Explore Pakistan
                  </h3>

                  <p className="mt-3 text-[#C8E6C9]">
                    One country. Countless clues.
                  </p>

                </div>

                {/* Location dots */}

                <div className="absolute top-24 left-24 w-3 h-3 bg-[#5FAF5F] rounded-full animate-pulse" />

                <div className="absolute top-40 right-32 w-3 h-3 bg-[#5FAF5F] rounded-full animate-pulse" />

                <div className="absolute bottom-28 left-40 w-3 h-3 bg-[#5FAF5F] rounded-full animate-pulse" />

                <div className="absolute bottom-20 right-24 w-3 h-3 bg-[#5FAF5F] rounded-full animate-pulse" />

              </div>

            </div>


            {/* Text */}

            <div
              className="order-1 lg:order-2"
              data-aos="fade-left"
            >

              <p className="text-sm uppercase tracking-[0.25em] text-[#5FAF5F] font-semibold mb-4">
                Geographic Discovery
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-[#0D3B0D] leading-tight">
                Explore places through
                <br />

                <span className="text-[#2F6B2F]">
                  local clues.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#1A1A1A]/70">
                From recognizable landmarks to busy markets,
                educational institutions, roads, religious places,
                and public spaces, locations can leave behind
                countless clues.
              </p>

              <p className="mt-5 leading-7 text-[#1A1A1A]/60">
                Nishaan is designed to make those clues useful
                when searching for places within the Pakistani
                geographic context.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* FINAL DISCOVERY */}
      {/* ================================================= */}

      <section className="px-6 py-28 bg-[#fbfcf7]">

        <div
          className="max-w-6xl mx-auto"
          data-aos="zoom-in"
        >

          <div className="rounded-[2rem] bg-[#0D3B0D] px-8 py-16 md:px-16 text-center relative overflow-hidden">

            {/* Background glow */}

            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#5FAF5F]/20 blur-3xl" />

            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#2F6B2F]/30 blur-3xl" />


            <div className="relative z-10">

              <div
                className="w-16 h-16 mx-auto rounded-2xl bg-[#5FAF5F] text-white flex items-center justify-center mb-7"
                data-aos="zoom-in"
                data-aos-delay="200"
              >

                <FiCompass className="text-3xl" />

              </div>


              <p className="text-sm uppercase tracking-[0.3em] text-[#5FAF5F] font-semibold">
                Start Exploring
              </p>


              <h2 className="mt-5 text-4xl md:text-6xl font-bold text-white leading-tight">

                Your next clue could
                <br />

                <span className="text-[#5FAF5F]">
                  lead somewhere.
                </span>

              </h2>


              <p className="max-w-2xl mx-auto mt-7 text-[#C8E6C9] text-lg leading-8">
                Explore a place through what you see, what you
                remember, or what you can describe.
              </p>


              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

                <a
                  href="/"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#5FAF5F] text-white font-semibold hover:bg-[#2F6B2F] transition-all duration-300 hover:scale-105"
                >

                  Try Nishaan

                  <FiArrowRight />

                </a>


                <a
                  href="/how-it-works"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-[#C8E6C9]/30 text-[#C8E6C9] font-semibold hover:bg-white/10 transition-all duration-300"
                >

                  See How It Works

                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}