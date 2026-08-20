"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 text-white transition-all duration-500 ${
        scrolled
          ? "bg-[#0D3B0D]/95 backdrop-blur-md shadow-lg"
          : "bg-[#0D3B0D] shadow-md"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-16" : "h-24"
          }`}
        >

          {/* ================= LOGO ================= */}
          <Link
            href="/"
            className="flex items-center gap-4 group"
          >
            <Image
              src="/images/logo.png"
              alt="Nishaan Logo"
              width={scrolled ? 48 : 62}
              height={scrolled ? 48 : 62}
              priority
              className="object-contain transition-all duration-500"
            />

            <div className="leading-tight">
              <span
                className={`block font-bold tracking-widest transition-all duration-500 ${
                  scrolled ? "text-xl" : "text-2xl"
                }`}
              >
                NISHAAN
              </span>

              <span
                className={`block text-[#C8E6C9] transition-all duration-500 ${
                  scrolled
                    ? "text-[8px]"
                    : "text-[10px]"
                }`}
              >
                AI-Powered Geospatial Verification
              </span>
            </div>
          </Link>

          {/* ================= NAVIGATION ================= */}
          <div className="hidden md:flex items-center gap-10">

            <Link
              href="/"
              className="relative text-sm font-medium py-2 transition-colors duration-300 hover:text-[#5FAF5F] group"
            >
              Home

              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#5FAF5F] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/how-it-works"
              className="relative text-sm font-medium py-2 transition-colors duration-300 hover:text-[#5FAF5F] group"
            >
              How It Works

              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#5FAF5F] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/explore"
              className="relative text-sm font-medium py-2 transition-colors duration-300 hover:text-[#5FAF5F] group"
            >
              Explore

              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#5FAF5F] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              href="/about"
              className="relative text-sm font-medium py-2 transition-colors duration-300 hover:text-[#5FAF5F] group"
            >
              About

              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#5FAF5F] transition-all duration-300 group-hover:w-full" />
            </Link>

          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            className="md:hidden text-2xl text-white"
            aria-label="Open menu"
          >
            ☰
          </button>

        </div>
      </div>
    </nav>
  );
}