import {
  FiFileText,
  FiUser,
  FiShield,
  FiAlertCircle,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";

export default function termsAndConditions() {
  return (
<<<<<<< HEAD
    <main className="relative min-h-screen text-[#1A1A1A] overflow-hidden">
      {/* ================================================= */}
      {/* FULL PAGE BACKGROUND IMAGE */}
      {/* ================================================= */}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src="/images/download.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.25]"
        />
      </div>

=======
    <main className="min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">
>>>>>>> 850d413663328ed8eb29506bcbc60f7503ca4889
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="bg-[#0D3B0D] text-white px-6 py-20">
        <div className="max-w-5xl mx-auto" data-aos="fade-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#5FAF5F] flex items-center justify-center">
              <FiFileText className="text-2xl" />
            </div>

            <p className="text-sm uppercase tracking-[0.25em] text-[#C8E6C9]">
              Legal
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold">Terms & Conditions</h1>

          <p className="mt-5 max-w-2xl text-[#C8E6C9] leading-7">
            Please read these terms carefully before using Nishaan and its
            location discovery services.
          </p>

          <p className="mt-4 text-sm text-[#C8E6C9]/70">
            Last updated: August 2026
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}

          <div className="bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0D3B0D] mb-4">
              1. Introduction
            </h2>

            <p className="leading-8 text-[#1A1A1A]/70">
              Nishaan is an AI-powered geospatial assistance system designed to
              help users explore and identify potential locations using images,
              voice descriptions, text, and geographic information.
            </p>

            <p className="mt-4 leading-8 text-[#1A1A1A]/70">
              By accessing or using Nishaan, you agree to comply with these
              Terms & Conditions. If you do not agree with these terms, please
              do not use the service.
            </p>
          </div>

          {/* Acceptance */}

          <div
            className="mt-8 bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#C8E6C9] flex items-center justify-center text-[#0D3B0D]">
                <FiCheckCircle />
              </div>

              <h2 className="text-2xl font-bold text-[#0D3B0D]">
                2. Acceptance of Terms
              </h2>
            </div>

            <p className="leading-8 text-[#1A1A1A]/70">
              By using Nishaan, you acknowledge that you have read, understood,
              and agreed to these terms. Continued use of the website
              constitutes acceptance of any updated terms.
            </p>
          </div>

          {/* Use of Service */}

          <div
            className="mt-8 bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#C8E6C9] flex items-center justify-center text-[#0D3B0D]">
                <FiUser />
              </div>

              <h2 className="text-2xl font-bold text-[#0D3B0D]">
                3. Use of the Service
              </h2>
            </div>

            <p className="leading-8 text-[#1A1A1A]/70">
              Users are expected to use Nishaan responsibly and only for lawful
              purposes. You should not attempt to misuse, disrupt, damage, or
              interfere with the operation of the website or its services.
            </p>

            <ul className="mt-5 space-y-3 text-[#1A1A1A]/70">
              <li className="flex gap-3">
                <span className="text-[#5FAF5F]">•</span>
                Use the service for legitimate location discovery.
              </li>

              <li className="flex gap-3">
                <span className="text-[#5FAF5F]">•</span>
                Do not intentionally provide harmful or misleading content.
              </li>

              <li className="flex gap-3">
                <span className="text-[#5FAF5F]">•</span>
              </li>
            </ul>
          </div>

          {/* AI Results */}

          <div
            className="mt-8 bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#C8E6C9] flex items-center justify-center text-[#0D3B0D]">
                <FiMapPin />
              </div>

              <h2 className="text-2xl font-bold text-[#0D3B0D]">
                4. AI-Generated Results
              </h2>
            </div>

            <p className="leading-8 text-[#1A1A1A]/70">
              Nishaan uses artificial intelligence to interpret user-provided
              clues and generate potential geographic matches.
            </p>

            <div className="mt-6 rounded-2xl bg-[#C8E6C9]/30 border border-[#C8E6C9] p-5">
              <p className="font-semibold text-[#0D3B0D]">Important:</p>

              <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/70">
                AI-generated results are suggestions and should not
                automatically be considered accurate or authoritative geographic
                information. Users should independently verify important
                location information.
              </p>
            </div>
          </div>

          {/* User Content */}

          <div
            className="mt-8 bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm"
            data-aos="fade-up"
          >
            <h2 className="text-2xl font-bold text-[#0D3B0D] mb-4">
              5. User-Provided Content
            </h2>

            <p className="leading-8 text-[#1A1A1A]/70">
              Users may provide images, voice recordings, text, or other
              information when interacting with Nishaan. Users are responsible
              for ensuring that the content they provide does not violate
              applicable laws or the rights of others.
            </p>
          </div>

          {/* Privacy */}

          <div
            className="mt-8 bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#C8E6C9] flex items-center justify-center text-[#0D3B0D]">
                <FiShield />
              </div>

              <h2 className="text-2xl font-bold text-[#0D3B0D]">6. Privacy</h2>
            </div>

            <p className="leading-8 text-[#1A1A1A]/70">
              Your use of Nishaan may involve the processing of information
              submitted through the service. Please review our Privacy Policy
              for information about how user data is handled and protected.
            </p>
          </div>

          {/* Disclaimer */}

          <div
            className="mt-8 bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#C8E6C9] flex items-center justify-center text-[#0D3B0D]">
                <FiAlertCircle />
              </div>

              <h2 className="text-2xl font-bold text-[#0D3B0D]">
                7. Disclaimer
              </h2>
            </div>

            <p className="leading-8 text-[#1A1A1A]/70">
              Nishaan is provided as a location assistance and exploration tool.
              We do not guarantee that every location identified by the system
              will be correct, complete, current, or suitable for a particular
              purpose.
            </p>
          </div>

          {/* Changes */}

          <div
            className="mt-8 bg-white rounded-3xl border border-[#C8E6C9] p-8 md:p-10 shadow-sm"
            data-aos="fade-up"
          >
            <h2 className="text-2xl font-bold text-[#0D3B0D] mb-4">
              8. Changes to These Terms
            </h2>

            <p className="leading-8 text-[#1A1A1A]/70">
              These Terms & Conditions may be updated from time to time. Any
              changes will be reflected on this page with an updated revision
              date.
            </p>
          </div>

          {/* Contact */}

          <div
            className="mt-10 rounded-3xl bg-[#0D3B0D] p-8 md:p-10 text-center"
            data-aos="fade-up"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Questions about these terms?
            </h2>

            <p className="mt-4 text-[#C8E6C9] leading-7">
              If you have any questions about Nishaan or these Terms &
              Conditions, please contact the Nishaan team.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
