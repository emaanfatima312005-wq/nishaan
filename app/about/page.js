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
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="min-h-[70vh] flex items-center justify-center px-6 py-24">

        <div
          className="max-w-4xl mx-auto text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >

          <p
            className="text-sm md:text-base font-semibold uppercase tracking-[0.3em] text-[#2F6B2F] mb-5"
            data-aos="fade-down"
            data-aos-duration="800"
          >
            About Nishaan
          </p>

          <h1
            className="text-5xl md:text-7xl font-bold leading-tight text-[#0D3B0D]"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Find Any Place.
            <br />

            <span className="text-[#2F6B2F]">
              From Any Clue.
            </span>
          </h1>

          <p
            className="max-w-3xl mx-auto mt-8 text-lg md:text-xl leading-8 text-[#1A1A1A]"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Nishaan is an AI-powered geospatial assistance system
            designed to make location discovery simpler, smarter,
            and more intuitive.
          </p>

          <p
            className="max-w-2xl mx-auto mt-5 text-base leading-7 text-[#1A1A1A]/70"
            data-aos="fade-up"
            data-aos-delay="450"
          >
            Instead of requiring an exact place name, address, or
            coordinates, Nishaan allows you to describe what you
            know about a location and helps identify potential
            matches.
          </p>

        </div>

      </section>


      {/* ================================================= */}
      {/* WHAT IS NISHAAN */}
      {/* ================================================= */}

      <section className="px-6 py-24 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}

            <div
              data-aos="fade-right"
              data-aos-duration="1000"
            >

              <p
                className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F] mb-4"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                Our Platform
              </p>

              <h2
                className="text-4xl md:text-5xl font-bold text-[#0D3B0D] mb-6"
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
                Nishaan combines artificial intelligence, geographic
                data, and spatial search to help users identify and
                locate real-world places and landmarks.
              </p>

              <p
                className="mt-5 leading-7 text-[#1A1A1A]/70"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                You don't always need to know the exact name of a
                place. You can provide the clues you remember and
                let Nishaan help turn those clues into potential
                locations.
              </p>

            </div>


            {/* RIGHT — INPUT TYPES */}

            <div
              className="rounded-3xl bg-[#0D3B0D] p-8 md:p-10 shadow-xl"
              data-aos="fade-left"
              data-aos-duration="1000"
            >

              <h3
                className="text-2xl font-bold text-white mb-8"
                data-aos="fade-down"
                data-aos-delay="200"
              >
                Give Nishaan a clue
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* IMAGE */}

                <div
                  className="rounded-2xl bg-white/10 border border-white/10 p-6 text-center hover:bg-white/15 hover:-translate-y-2 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >

                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#5FAF5F] flex items-center justify-center mb-5">
                    <FiImage className="text-2xl text-white" />
                  </div>

                  <h4 className="font-semibold text-white">
                    Image
                  </h4>

                  <p className="text-sm text-[#C8E6C9] mt-2">
                    Upload visual clues
                  </p>

                </div>


                {/* VOICE */}

                <div
                  className="rounded-2xl bg-white/10 border border-white/10 p-6 text-center hover:bg-white/15 hover:-translate-y-2 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-delay="450"
                >

                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#5FAF5F] flex items-center justify-center mb-5">
                    <FiMic className="text-2xl text-white" />
                  </div>

                  <h4 className="font-semibold text-white">
                    Voice
                  </h4>

                  <p className="text-sm text-[#C8E6C9] mt-2">
                    Describe naturally
                  </p>

                </div>


                {/* TEXT */}

                <div
                  className="rounded-2xl bg-white/10 border border-white/10 p-6 text-center hover:bg-white/15 hover:-translate-y-2 transition-all duration-300"
                  data-aos="zoom-in"
                  data-aos-delay="600"
                >

                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#5FAF5F] flex items-center justify-center mb-5">
                    <FiEdit3 className="text-2xl text-white" />
                  </div>

                  <h4 className="font-semibold text-white">
                    Text
                  </h4>

                  <p className="text-sm text-[#C8E6C9] mt-2">
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

      <section className="px-6 py-24">

        <div className="max-w-7xl mx-auto">

          <div
            className="text-center mb-16"
            data-aos="fade-up"
          >

            <p
              className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F] mb-4"
              data-aos="fade-down"
            >
              The Process
            </p>

            <h2
              className="text-4xl md:text-5xl font-bold text-[#0D3B0D]"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              From Your Clues to a Location
            </h2>

            <p
              className="max-w-2xl mx-auto mt-5 text-[#1A1A1A]/70 leading-7"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Nishaan transforms the information you provide into
              potential geographic matches.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

            {/* STEP 1 */}

            <div
              className="bg-white rounded-2xl p-7 shadow-md border border-[#C8E6C9] hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >

              <div className="w-12 h-12 rounded-full bg-[#0D3B0D] text-white flex items-center justify-center font-bold">
                01
              </div>

              <h3 className="mt-5 font-bold text-[#0D3B0D]">
                Your Input
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/70">
                Provide an image, voice description, or text.
              </p>

            </div>


            {/* STEP 2 */}

            <div
              className="bg-white rounded-2xl p-7 shadow-md border border-[#C8E6C9] hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >

              <div className="w-12 h-12 rounded-full bg-[#2F6B2F] text-white flex items-center justify-center">
                <FiCpu className="text-xl" />
              </div>

              <h3 className="mt-5 font-bold text-[#0D3B0D]">
                AI Analysis
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/70">
                AI interprets the information you provide.
              </p>

            </div>


            {/* STEP 3 */}

            <div
              className="bg-white rounded-2xl p-7 shadow-md border border-[#C8E6C9] hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >

              <div className="w-12 h-12 rounded-full bg-[#5FAF5F] text-white flex items-center justify-center">
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
              className="bg-white rounded-2xl p-7 shadow-md border border-[#C8E6C9] hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >

              <div className="w-12 h-12 rounded-full bg-[#2F6B2F] text-white flex items-center justify-center">
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
              className="bg-white rounded-2xl p-7 shadow-md border border-[#C8E6C9] hover:-translate-y-2 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="500"
            >

              <div className="w-12 h-12 rounded-full bg-[#0D3B0D] text-white flex items-center justify-center">
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

      <section className="px-6 py-24 bg-[#C8E6C9]/30">

        <div className="max-w-7xl mx-auto">

          <div
            className="text-center mb-14"
            data-aos="fade-up"
          >

            <p
              className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2F6B2F] mb-4"
              data-aos="fade-down"
            >
              Why Nishaan
            </p>

            <h2
              className="text-4xl md:text-5xl font-bold text-[#0D3B0D]"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Built for Smarter Discovery
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* AI */}

            <div
              className="bg-white rounded-3xl p-9 shadow-md border border-[#C8E6C9] hover:-translate-y-3 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >

              <div
                className="w-16 h-16 rounded-2xl bg-[#0D3B0D] text-white flex items-center justify-center mb-7"
                data-aos="zoom-in"
                data-aos-delay="250"
              >
                <FiCpu className="text-3xl" />
              </div>

              <h3 className="text-2xl font-bold text-[#0D3B0D] mb-4">
                AI-Powered
              </h3>

              <p className="leading-7 text-[#1A1A1A]/70">
                Nishaan uses AI to interpret descriptions,
                spoken information, and images to extract
                useful location-related clues.
              </p>

            </div>


            {/* GEOSPATIAL */}

            <div
              className="bg-white rounded-3xl p-9 shadow-md border border-[#C8E6C9] hover:-translate-y-3 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="250"
            >

              <div
                className="w-16 h-16 rounded-2xl bg-[#2F6B2F] text-white flex items-center justify-center mb-7"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <FiGlobe className="text-3xl" />
              </div>

              <h3 className="text-2xl font-bold text-[#0D3B0D] mb-4">
                Geospatial Intelligence
              </h3>

              <p className="leading-7 text-[#1A1A1A]/70">
                Location clues are combined with geographic
                and spatial search to identify potentially
                relevant places.
              </p>

            </div>


            {/* MAP */}

            <div
              className="bg-white rounded-3xl p-9 shadow-md border border-[#C8E6C9] hover:-translate-y-3 transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >

              <div
                className="w-16 h-16 rounded-2xl bg-[#5FAF5F] text-white flex items-center justify-center mb-7"
                data-aos="zoom-in"
                data-aos-delay="550"
              >
                <FiMap className="text-3xl" />
              </div>

              <h3 className="text-2xl font-bold text-[#0D3B0D] mb-4">
                Interactive Discovery
              </h3>

              <p className="leading-7 text-[#1A1A1A]/70">
                Potential locations can be explored visually
                through an interactive map and geographic
                results.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* PAKISTAN */}
      {/* ================================================= */}

      <section className="px-6 py-24 bg-white">

        <div
          className="max-w-4xl mx-auto text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >

          <div
            className="w-16 h-16 mx-auto rounded-2xl bg-[#C8E6C9] text-[#0D3B0D] flex items-center justify-center mb-7"
            data-aos="zoom-in"
          >
            <FiGlobe className="text-3xl" />
          </div>

          <p
            className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F] mb-4"
            data-aos="fade-down"
            data-aos-delay="150"
          >
            Made With Pakistan in Mind
          </p>

          <h2
            className="text-4xl md:text-5xl font-bold text-[#0D3B0D]"
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
            Nishaan is designed around the Pakistani geographic
            context, supporting location clues such as landmarks,
            roads, markets, public buildings, educational
            institutions, religious places, and other recognizable
            locations.
          </p>

        </div>

      </section>


      {/* ================================================= */}
      {/* TRUST SECTION */}
      {/* ================================================= */}

      <section className="px-6 py-24">

        <div className="max-w-5xl mx-auto">

          <div
            className="rounded-[2rem] bg-[#0D3B0D] px-8 py-16 md:px-16 text-center shadow-xl"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >

            <div
              className="w-16 h-16 mx-auto rounded-2xl bg-[#5FAF5F] text-white flex items-center justify-center mb-7"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <FiCheckCircle className="text-3xl" />
            </div>

            <p
              className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5FAF5F] mb-6"
              data-aos="fade-down"
              data-aos-delay="300"
            >
              Built With Trust in Mind
            </p>

            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              AI Helps Interpret.
              <br />

              <span className="text-[#5FAF5F]">
                Geography Helps Verify.
              </span>
            </h2>

            <p
              className="max-w-2xl mx-auto mt-7 text-[#C8E6C9] leading-8"
              data-aos="fade-up"
              data-aos-delay="550"
            >
              Nishaan treats AI-generated information as an
              interpretation of your clues. Geographic matching
              helps identify potential locations rather than
              presenting AI output as geographic truth.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}