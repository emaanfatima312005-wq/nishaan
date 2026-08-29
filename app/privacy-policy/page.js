import {
  FiShield,
  FiLock,
  FiDatabase,
  FiImage,
  FiMapPin,
  FiMic,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";

export default function PrivacyPolicy() {
  const sections = [
    { id: "overview", title: "Overview" },
    { id: "collection", title: "Information We Collect" },
    { id: "usage", title: "How We Use Information" },
    { id: "ai", title: "AI & Location Processing" },
    { id: "sharing", title: "Information Sharing" },
    { id: "security", title: "Data Security" },
    { id: "retention", title: "Data Retention" },
    { id: "rights", title: "Your Choices" },
  ];

  return (
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-[#0D3B0D] text-white">
        {/* Decorative shapes */}

        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2F6B2F]/40" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[#5FAF5F]/10" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div
            className="grid md:grid-cols-[1fr_320px] gap-12 items-center"
            data-aos="fade-up"
          >
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                <FiShield className="text-[#5FAF5F]" />

                <span className="text-sm text-[#C8E6C9]">
                  Your Privacy Matters
                </span>
              </div>

              <h1 className="mt-7 text-5xl md:text-7xl font-bold tracking-tight">
                Privacy
                <span className="block text-[#5FAF5F]">Policy</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#C8E6C9]">
                A simple explanation of how Nishaan handles the information you
                provide while discovering and identifying locations.
              </p>

              <p className="mt-6 text-sm text-[#C8E6C9]/70">
                Last updated · August 2026
              </p>
            </div>

            {/* Privacy visual */}

            <div className="hidden md:flex justify-center">
              <div className="relative w-64 h-64 rounded-[3rem] bg-[#C8E6C9]/10 border border-[#C8E6C9]/20 backdrop-blur-sm items-center justify-center flex">
                <div className="w-40 h-40 rounded-full bg-[#5FAF5F]/20 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-[#5FAF5F] flex items-center justify-center shadow-2xl">
                    <FiShield className="text-white text-6xl" />
                  </div>
                </div>

                <div className="absolute top-5 right-8 w-3 h-3 rounded-full bg-[#5FAF5F]" />
                <div className="absolute bottom-10 left-7 w-2 h-2 rounded-full bg-[#C8E6C9]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* PRIVACY HIGHLIGHTS */}
      {/* ================================================= */}

      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-4" data-aos="fade-up">
          <div className="bg-white rounded-2xl border border-[#C8E6C9] p-6 shadow-lg">
            <FiLock className="text-[#2F6B2F] text-2xl mb-4" />

            <h3 className="font-bold text-[#0D3B0D]">Privacy First</h3>

            <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
              We aim to handle submitted information responsibly.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#C8E6C9] p-6 shadow-lg">
            <FiDatabase className="text-[#2F6B2F] text-2xl mb-4" />

            <h3 className="font-bold text-[#0D3B0D]">Purpose Driven</h3>

            <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
              Information is processed to provide Nishaan's core features.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#C8E6C9] p-6 shadow-lg">
            <FiTrash2 className="text-[#2F6B2F] text-2xl mb-4" />

            <h3 className="font-bold text-[#0D3B0D]">Your Choices</h3>

            <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
              You can contact us about information associated with your use.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[230px_1fr] gap-12">
          {/* SIDE NAVIGATION */}

          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#2F6B2F] mb-5">
                On this page
              </p>

              <nav className="space-y-1">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#1A1A1A]/60 hover:bg-[#C8E6C9]/40 hover:text-[#0D3B0D] transition"
                  >
                    <span>
                      <span className="text-[#5FAF5F] mr-2">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {section.title}
                    </span>

                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENT */}

          <div className="max-w-3xl">
            {/* OVERVIEW */}

            <section id="overview" className="scroll-mt-10 mb-20">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                01 — OVERVIEW
              </span>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#0D3B0D]">
                We believe privacy should be easy to understand.
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#1A1A1A]/65">
                Nishaan is an AI-powered geospatial assistance system designed
                to help users discover and identify potential locations using
                images, voice descriptions, text, and geographic information.
              </p>

              <p className="mt-4 leading-8 text-[#1A1A1A]/65">
                This Privacy Policy explains what information may be processed
                when you use Nishaan, why it may be processed, and how we aim to
                protect it.
              </p>
            </section>

            {/* COLLECTION */}

            <section id="collection" className="scroll-mt-10 mb-20">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                02 — INFORMATION
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                What information may we collect?
              </h2>

              <div className="mt-8 space-y-4">
                <div className="flex gap-5 p-5 rounded-2xl bg-white border border-[#C8E6C9]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#C8E6C9] flex items-center justify-center">
                    <FiImage className="text-[#0D3B0D] text-xl" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0D3B0D]">Images</h3>

                    <p className="mt-1 text-sm leading-6 text-[#1A1A1A]/60">
                      Images you voluntarily submit for location analysis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 p-5 rounded-2xl bg-white border border-[#C8E6C9]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#C8E6C9] flex items-center justify-center">
                    <FiMic className="text-[#0D3B0D] text-xl" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0D3B0D]">Voice & Text</h3>

                    <p className="mt-1 text-sm leading-6 text-[#1A1A1A]/60">
                      Voice descriptions, written clues, and other information
                      you provide.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 p-5 rounded-2xl bg-white border border-[#C8E6C9]">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#C8E6C9] flex items-center justify-center">
                    <FiMapPin className="text-[#0D3B0D] text-xl" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0D3B0D]">
                      Location Information
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#1A1A1A]/60">
                      Geographic information when required to provide
                      location-related functionality.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* USAGE */}

            <section id="usage" className="scroll-mt-10 mb-20">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                03 — PURPOSE
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                How do we use information?
              </h2>

              <p className="mt-6 leading-8 text-[#1A1A1A]/65">
                Information submitted through Nishaan may be processed to
                operate the platform and provide the location discovery
                experience.
              </p>

              <div className="mt-7 grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#0D3B0D] text-white">
                  <h3 className="font-bold">Analyze</h3>

                  <p className="mt-2 text-sm leading-6 text-[#C8E6C9]">
                    Analyze images, descriptions, and clues.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#C8E6C9]/50">
                  <h3 className="font-bold text-[#0D3B0D]">Discover</h3>

                  <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                    Generate potential geographic matches.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#C8E6C9]/50">
                  <h3 className="font-bold text-[#0D3B0D]">Improve</h3>

                  <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                    Improve platform functionality and reliability.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0D3B0D] text-white">
                  <h3 className="font-bold">Protect</h3>

                  <p className="mt-2 text-sm leading-6 text-[#C8E6C9]">
                    Maintain security and prevent misuse.
                  </p>
                </div>
              </div>
            </section>

            {/* AI */}

            <section id="ai" className="scroll-mt-10 mb-20">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                04 — AI & LOCATION
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                How Nishaan processes your information
              </h2>

              <div className="mt-7 p-7 rounded-3xl bg-[#0D3B0D] text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#5FAF5F] flex items-center justify-center">
                    <FiShield className="text-xl" />
                  </div>

                  <h3 className="text-xl font-bold">
                    AI-assisted location discovery
                  </h3>
                </div>

                <p className="mt-5 leading-8 text-[#C8E6C9]">
                  Nishaan may use artificial intelligence and geospatial
                  technologies to interpret visual features, text clues, voice
                  descriptions, and geographic information in order to generate
                  potential location results.
                </p>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm leading-7 text-[#C8E6C9]/80">
                    AI-generated results are suggestions and should not be
                    treated as guaranteed or authoritative geographic
                    information.
                  </p>
                </div>
              </div>
            </section>

            {/* SHARING */}

            <section id="sharing" className="scroll-mt-10 mb-20">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                05 — SHARING
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                Do we share your information?
              </h2>

              <p className="mt-6 leading-8 text-[#1A1A1A]/65">
                Nishaan does not intend to sell users' personal information.
                Information may be processed or shared when necessary to operate
                requested features, support technical functionality, maintain
                security, or comply with applicable legal requirements.
              </p>
            </section>

            {/* SECURITY */}

            <section id="security" className="scroll-mt-10 mb-20">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                06 — SECURITY
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                Keeping information protected
              </h2>

              <div className="mt-7 flex gap-5 p-6 rounded-2xl bg-white border border-[#C8E6C9]">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#C8E6C9] flex items-center justify-center">
                  <FiLock className="text-[#0D3B0D] text-xl" />
                </div>

                <p className="text-sm leading-7 text-[#1A1A1A]/65">
                  We take reasonable measures to help protect information
                  processed through Nishaan from unauthorized access, misuse,
                  alteration, or disclosure. However, no internet-based service
                  can guarantee complete security.
                </p>
              </div>
            </section>

            {/* RETENTION */}

            <section id="retention" className="scroll-mt-10 mb-20">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                07 — RETENTION
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                How long is information kept?
              </h2>

              <p className="mt-6 leading-8 text-[#1A1A1A]/65">
                Information may be retained only for as long as reasonably
                necessary to provide requested services, maintain platform
                functionality, support security, improve the service, or meet
                applicable obligations.
              </p>
            </section>

            {/* RIGHTS */}

            <section id="rights" className="scroll-mt-10 mb-10">
              <span className="text-sm font-semibold text-[#5FAF5F]">
                08 — YOUR CHOICES
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#0D3B0D]">
                You have choices
              </h2>

              <p className="mt-6 leading-8 text-[#1A1A1A]/65">
                If you have questions about information submitted through
                Nishaan or would like to request deletion of applicable data,
                you can contact the Nishaan team.
              </p>

              <div className="mt-7 p-6 rounded-2xl bg-[#C8E6C9]/40 border border-[#C8E6C9]">
                <div className="flex items-start gap-4">
                  <FiTrash2 className="text-[#2F6B2F] text-xl mt-1" />

                  <div>
                    <h3 className="font-bold text-[#0D3B0D]">
                      Request data deletion
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                      Contact the Nishaan team if you have a question about
                      information associated with your use of the service.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* CONTACT */}
      {/* ================================================= */}

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-[#0D3B0D] px-8 py-14 md:px-16 text-center"
          data-aos="fade-up"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#5FAF5F]/20" />

          <div className="relative">
            <FiShield className="mx-auto text-[#5FAF5F] text-4xl" />

            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-white">
              Questions about your privacy?
            </h2>

            <p className="mt-4 max-w-xl mx-auto text-[#C8E6C9] leading-7">
              If you have questions about this Privacy Policy or how Nishaan
              handles information, please contact the Nishaan team.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
