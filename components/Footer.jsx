import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0D3B0D] text-white">

      {/* MAIN FOOTER CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* COLUMN 1 — NISHAAN */}
          <div>

            <div className="flex items-center gap-3 mb-4">

              <Image
                src="/images/logo.png"
                alt="Nishaan Logo"
                width={60}
                height={60}
                priority
                className="object-contain"
              />

              <div>
                <h2 className="text-2xl font-bold tracking-wide">
                  NISHAAN
                </h2>

                <p className="text-[10px] text-[#C8E6C9] leading-4">
                  AI-Powered Geospatial Verification
                  <br />
                  and Location Assistance System
                </p>
              </div>

            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-2 mb-4">

              <div className="h-[2px] w-40 bg-[#5FAF5F]" />

              <div className="w-3 h-3 rotate-45 bg-[#5FAF5F]" />

              <div className="h-[2px] w-5 bg-[#5FAF5F]" />

            </div>

            <p className="text-[#C8E6C9] text-sm leading-6 max-w-sm">
              Bridging technology and exploration — helping you find
              any place, from any clue.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-5">

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-[#5FAF5F]
                flex items-center justify-center
                text-[#C8E6C9] font-bold text-sm
                hover:bg-[#5FAF5F] hover:text-white
                transition-all duration-300"
              >
                f
              </a>

              {/* X */}
              <a
                href="#"
                aria-label="X"
                className="w-9 h-9 rounded-full border border-[#5FAF5F]
                flex items-center justify-center
                text-[#C8E6C9] font-bold text-sm
                hover:bg-[#5FAF5F] hover:text-white
                transition-all duration-300"
              >
                x
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-[#5FAF5F]
                flex items-center justify-center
                text-[#C8E6C9] font-bold text-sm
                hover:bg-[#5FAF5F] hover:text-white
                transition-all duration-300"
              >
                in
              </a>

              {/* Instagram */}
              <a
                href="YOUR_INSTAGRAM_URL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-[#5FAF5F]
                flex items-center justify-center
                text-[#C8E6C9]
                hover:bg-[#5FAF5F] hover:text-white
                transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

            </div>

          </div>


          {/* COLUMN 2 — QUICK LINKS */}
          <div>

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-full border border-[#5FAF5F]
                flex items-center justify-center text-[#5FAF5F] text-lg">
                ◈
              </div>

              <h3 className="text-lg font-semibold">
                Quick Links
              </h3>

            </div>

            <div className="h-[1px] bg-[#5FAF5F]/50 mb-5" />

            <div className="flex flex-col gap-3">

              <Link
                href="/"
                className="flex items-center gap-3 text-[#C8E6C9]
                hover:text-white hover:translate-x-2
                transition-all duration-300"
              >
                <span className="text-[#5FAF5F] text-lg">→</span>
                Home
              </Link>

              <Link
                href="/how-it-works"
                className="flex items-center gap-3 text-[#C8E6C9]
                hover:text-white hover:translate-x-2
                transition-all duration-300"
              >
                <span className="text-[#5FAF5F] text-lg">→</span>
                How It Works
              </Link>

              <Link
                href="/explore"
                className="flex items-center gap-3 text-[#C8E6C9]
                hover:text-white hover:translate-x-2
                transition-all duration-300"
              >
                <span className="text-[#5FAF5F] text-lg">→</span>
                Explore
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-3 text-[#C8E6C9]
                hover:text-white hover:translate-x-2
                transition-all duration-300"
              >
                <span className="text-[#5FAF5F] text-lg">→</span>
                About
              </Link>

              <Link
                href="/voice"
                className="flex items-center gap-3 text-[#C8E6C9]
                hover:text-white hover:translate-x-2
                transition-all duration-300"
              >
                <span className="text-[#5FAF5F] text-lg">→</span>
                Voice Assistant
              </Link>

            </div>

          </div>


          {/* COLUMN 3 — RESOURCES */}
          <div>

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-full border border-[#5FAF5F]
                flex items-center justify-center text-[#5FAF5F] text-lg">
                ▣
              </div>

              <h3 className="text-lg font-semibold">
                Resources
              </h3>

            </div>

            <div className="h-[1px] bg-[#5FAF5F]/50 mb-5" />

            <div className="flex flex-col gap-3">

              <Link
                href="/privacy"
                className="flex items-center gap-3 text-[#C8E6C9]
                hover:text-white hover:translate-x-2
                transition-all duration-300"
              >
                <span className="text-[#5FAF5F] text-lg">→</span>
                Privacy Policy
              </Link>

              <Link
  href="/terms-and-conditions"
  className="flex items-center gap-3 text-[#C8E6C9] hover:text-white hover:translate-x-2 transition-all duration-300"
>
  <span className="text-[#5FAF5F] text-lg">→</span>
  Terms & Conditions
  </Link>

             <Link
             href="#"
              className="flex items-center gap-3 text-[#C8E6C9] hover:text-white hover:translate-x-2 transition-all duration-300"
>

                <span className="text-[#5FAF5F] text-lg">→</span>
                FAQs
              </Link>

            </div>

          </div>

        </div>

      </div>


     {/* ===================================================== */}
      {/* MOSQUE BACKGROUND */}
      {/* ===================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/footer-image.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-10"
        />
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-20 border-t border-[#5FAF5F]/40 bg-[#0D3B0D]/95">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">

          <div className="flex flex-col md:flex-row
            items-center justify-between
            gap-3 text-xs text-[#C8E6C9]">

            {/* Left */}
            <div className="flex items-center gap-2">

              <span className="text-[#5FAF5F] text-lg">
                ●
              </span>

              <span>Powered by AI</span>

              <span>•</span>

              <span>Trusted by Explorers</span>

            </div>


            {/* Center */}
            <div className="flex items-center gap-3">

              <span className="hidden md:block w-12 h-px bg-[#5FAF5F]/50" />

              <span>
                © 2026 Nishaan. All rights reserved.
              </span>

              <span className="hidden md:block w-12 h-px bg-[#5FAF5F]/50" />

            </div>


            {/* Right */}
            <div className="flex items-center gap-2">

              <span className="text-[#5FAF5F] text-lg">
                ♥
              </span>

              <span>
                Built for a smarter, connected world.
              </span>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}

