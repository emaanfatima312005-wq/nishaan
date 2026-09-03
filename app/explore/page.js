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
    <main className="relative min-h-screen overflow-hidden bg-transparent text-[#1A1A1A]">
      {/* ================================================= */}
      {/* FULL SCREEN IMAGE BACKGROUND                      */}
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

        {/* Very light overlay for readability */}
        <div className="absolute inset-0 bg-white/15" />
      </div>

      {/* ================================================= */}
      {/* ALL PAGE CONTENT                                   */}
      {/* ================================================= */}

      <div className="relative z-10">
        {/* ================================================= */}
        {/* EXPLORE HERO                                      */}
        {/* ================================================= */}

        <section className="relative min-h-[75vh] overflow-hidden bg-[#0D3B0D]/75 text-white">
          {/* MAP GRID TEXTURE */}

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

          {/* LARGE MAP CIRCLES */}

          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full border border-[#5FAF5F]/20" />

          <div className="absolute -top-24 -right-24 h-[430px] w-[430px] rounded-full border border-[#5FAF5F]/20" />

          <div className="absolute -top-8 -right-8 h-[260px] w-[260px] rounded-full border border-[#5FAF5F]/20" />

          {/* GREEN GLOW */}

          <div className="absolute top-1/2 right-[-150px] h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#5FAF5F]/20 blur-[120px]" />

          <div className="absolute bottom-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-[#2F6B2F]/40 blur-[100px]" />

          {/* DECORATIVE ROUTE */}

          <svg
            className="absolute right-[8%] top-[15%] hidden h-[420px] w-[420px] opacity-30 lg:block"
            viewBox="0 0 420 420"
            fill="none"
          >
            <path
              d="M40 350 C100 270, 130 320, 180 230 C230 140, 270 190, 320 100 C350 60, 370 70, 390 40"
              stroke="#5FAF5F"
              strokeWidth="3"
              strokeDasharray="8 10"
            />

            <circle cx="40" cy="350" r="7" fill="#5FAF5F" />
            <circle cx="180" cy="230" r="7" fill="#5FAF5F" />
            <circle cx="320" cy="100" r="7" fill="#5FAF5F" />
          </svg>

          {/* FLOATING LOCATION MARKER */}

          <div
            className="absolute left-[10%] top-[20%] hidden animate-bounce md:block"
            style={{ animationDuration: "3s" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#5FAF5F]/40 bg-[#5FAF5F]/20 backdrop-blur-sm">
              <FiMapPin className="text-xl text-[#5FAF5F]" />
            </div>
          </div>

          <div
            className="absolute bottom-[20%] left-[17%] hidden animate-bounce md:block"
            style={{ animationDuration: "4s" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C8E6C9]/20 bg-white/5 backdrop-blur-sm">
              <FiMapPin className="text-[#C8E6C9]" />
            </div>
          </div>

          <div className="absolute right-[12%] top-[30%] hidden animate-pulse lg:block">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-[#5FAF5F] opacity-30" />

              <div className="relative h-4 w-4 rounded-full bg-[#5FAF5F]" />
            </div>
          </div>

          {/* HERO CONTENT */}

          <div className="relative z-10 mx-auto flex min-h-[75vh] max-w-7xl items-center px-6">
            <div className="max-w-4xl">
              <h1
                className="text-5xl font-bold leading-[1.05] md:text-7xl lg:text-8xl"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                There is more
                <br />
                to a place
                <br />
                <span className="text-[#5FAF5F]">than its name.</span>
              </h1>

              <p
                className="mt-8 max-w-2xl text-lg leading-8 text-[#C8E6C9] md:text-xl"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Explore places through the clues you remember, the things you
                have seen, and the details that make every location unique.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* WHAT CAN YOU EXPLORE                              */}
        {/* ================================================= */}

        <section className="bg-transparent px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-3xl" data-aos="fade-up">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]">
                Discover Possibilities
              </p>

              <h2 className="text-4xl font-bold text-[#0D3B0D] md:text-5xl">
                What can Nishaan help you explore?
              </h2>

              <p className="mt-5 text-lg leading-8 text-[#1A1A1A]/70">
                Places do not always come with perfect descriptions. Sometimes a
                few recognizable details are enough to start exploring.
              </p>
            </div>

            {/* CATEGORY GRID */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      group
                      rounded-3xl
                      border
                      border-[#C8E6C9]
                      bg-white/75
                      p-8
                      shadow-sm
                      backdrop-blur-[3px]
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:bg-white/90
                      hover:shadow-xl
                    "
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8E6C9]/70 text-[#0D3B0D] transition-all duration-300 group-hover:bg-[#0D3B0D] group-hover:text-white">
                      <Icon className="text-2xl" />
                    </div>

                    <h3 className="text-xl font-bold text-[#0D3B0D]">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-[#1A1A1A]/70">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* IMAGINE THIS                                      */}
        {/* ================================================= */}

        <section className="bg-transparent px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* LEFT */}

              <div data-aos="fade-right" data-aos-duration="1000">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F]">
                  Imagine This
                </p>

                <h2 className="text-4xl font-bold leading-tight text-[#0D3B0D] md:text-5xl">
                  You remember the place.
                  <br />
                  <span className="text-[#2F6B2F]">Just not the name.</span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-[#1A1A1A]/70">
                  Maybe you remember a green mosque beside a busy market. Maybe
                  there was a university near a large roundabout. Or maybe you
                  simply have a photograph with no location attached.
                </p>

                <p className="mt-5 leading-7 text-[#1A1A1A]/60">
                  These details can become clues to explore instead of memories
                  that lead nowhere.
                </p>
              </div>

              {/* RIGHT — EXAMPLE CLUE */}

              <div
                className="relative"
                data-aos="fade-left"
                data-aos-duration="1000"
              >
                <div className="rounded-[2rem] bg-[#0D3B0D] p-8 shadow-2xl md:p-10">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5FAF5F] text-white">
                      <FiMessageCircle className="text-xl" />
                    </div>

                    <div>
                      <p className="text-sm text-[#C8E6C9]">Example clue</p>

                      <p className="font-semibold text-white">
                        Something you remember
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                    <p className="text-lg leading-8 text-white md:text-xl">
                      "I remember a large mosque with a green dome, close to a
                      busy market and a wide road."
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
        {/* REAL WORLD SCENARIOS                              */}
        {/* ================================================= */}

        <section className="bg-transparent px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div
              className="mx-auto mb-16 max-w-3xl text-center"
              data-aos="fade-up"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#2F6B2F]">
                Real-World Discovery
              </p>

              <h2 className="text-4xl font-bold text-[#0D3B0D] md:text-5xl">
                When Nishaan becomes useful
              </h2>

              <p className="mt-5 leading-7 text-[#1A1A1A]/70">
                Not every location search starts with an address. Sometimes it
                starts with a memory.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              {scenarios.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="
                      relative
                      rounded-3xl
                      border
                      border-[#C8E6C9]
                      bg-white/75
                      p-8
                      shadow-sm
                      backdrop-blur-[3px]
                    "
                    data-aos="fade-up"
                    data-aos-delay={index * 150}
                  >
                    <span className="absolute right-8 top-7 text-5xl font-bold text-[#C8E6C9]">
                      {item.number}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D3B0D] text-white">
                      <Icon className="text-2xl" />
                    </div>

                    <h3 className="mt-7 text-xl font-bold text-[#0D3B0D]">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-7 text-[#1A1A1A]/70">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* EXPLORE PAKISTAN                                  */}
        {/* ================================================= */}

        <section className="bg-transparent overflow-hidden px-6 py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* PAKISTAN VISUAL */}

              <div
                className="relative order-2 lg:order-1"
                data-aos="fade-right"
              >
                <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#0D3B0D]">
                  {/* Decorative grid */}

                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(#C8E6C9 1px, transparent 1px), linear-gradient(90deg, #C8E6C9 1px, transparent 1px)",
                      backgroundSize: "45px 45px",
                    }}
                  />

                  <div className="relative z-10 text-center">
                    <FiMap className="mx-auto mb-6 text-8xl text-[#5FAF5F]" />

                    <h3 className="text-3xl font-bold text-white">
                      Explore Pakistan
                    </h3>

                    <p className="mt-3 text-[#C8E6C9]">
                      One country. Countless clues.
                    </p>
                  </div>

                  {/* LOCATION DOTS */}

                  <div className="absolute left-24 top-24 h-3 w-3 animate-pulse rounded-full bg-[#5FAF5F]" />

                  <div className="absolute right-32 top-40 h-3 w-3 animate-pulse rounded-full bg-[#5FAF5F]" />

                  <div className="absolute bottom-28 left-40 h-3 w-3 animate-pulse rounded-full bg-[#5FAF5F]" />

                  <div className="absolute bottom-20 right-24 h-3 w-3 animate-pulse rounded-full bg-[#5FAF5F]" />
                </div>
              </div>

              {/* ================================================= */}
              {/* GEOGRAPHIC DISCOVERY TEXT                         */}
              {/* ================================================= */}

              <div className="order-1 lg:order-2" data-aos="fade-left">
                {/* WHITE FADED CONTENT PANEL */}

                <div
                  className="
                    rounded-[2rem]
                    border
                    border-white/60
                    bg-white/75
                    p-8
                    shadow-xl
                    backdrop-blur-md
                    md:p-10
                  "
                >
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#2F6B2F]">
                    Geographic Discovery
                  </p>

                  <h2 className="text-4xl font-bold leading-tight text-[#0D3B0D] md:text-5xl">
                    Explore places through
                    <br />
                    <span className="text-[#2F6B2F]">local clues.</span>
                  </h2>

                  {/* SMALL GREEN DIVIDER */}

                  <div className="mt-6 h-1 w-14 rounded-full bg-[#2F6B2F]" />

                  <p className="mt-7 text-lg leading-8 text-[#1A1A1A]/80">
                    From recognizable landmarks to busy markets, educational
                    institutions, roads, religious places, and public spaces,
                    locations can leave behind countless clues.
                  </p>

                  <p className="mt-5 leading-7 text-[#1A1A1A]/70">
                    Nishaan is designed to make those clues useful when
                    searching for places within the Pakistani geographic
                    context.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* FINAL DISCOVERY                                   */}
        {/* ================================================= */}

        <section className="bg-transparent px-6 py-28">
          <div className="mx-auto max-w-6xl" data-aos="zoom-in">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0D3B0D] px-8 py-16 text-center md:px-16">
              {/* BACKGROUND GLOW */}

              <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#5FAF5F]/20 blur-3xl" />

              <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#2F6B2F]/30 blur-3xl" />

              <div className="relative z-10">
                <div
                  className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5FAF5F] text-white"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  <FiCompass className="text-3xl" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#5FAF5F]">
                  Start Exploring
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-tight text-white md:text-6xl">
                  Your next clue could
                  <br />
                  <span className="text-[#5FAF5F]">lead somewhere.</span>
                </h2>

                <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#C8E6C9]">
                  Explore a place through what you see, what you remember, or
                  what you can describe.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="/"
                    className="
                      inline-flex
                      items-center
                      gap-3
                      rounded-full
                      bg-[#5FAF5F]
                      px-7
                      py-4
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:bg-[#2F6B2F]
                    "
                  >
                    Try Nishaan
                    <FiArrowRight />
                  </a>

                  <a
                    href="/how-it-works"
                    className="
                      inline-flex
                      items-center
                      gap-3
                      rounded-full
                      border
                      border-[#C8E6C9]/30
                      px-7
                      py-4
                      font-semibold
                      text-[#C8E6C9]
                      transition-all
                      duration-300
                      hover:bg-white/10
                    "
                  >
                    See How It Works
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
