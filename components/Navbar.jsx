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
      className={`
        sticky top-0 z-50
        text-[#1A1A1A]
        transition-all duration-500
        border-b border-white/60
        rounded-br-[22px]
        overflow-hidden
        ${
          scrolled
            ? "bg-[#fbfcf7]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
            : "bg-[#fbfcf7]/95 backdrop-blur-md shadow-[0_5px_20px_rgba(0,0,0,0.07)]"
        }
      `}
    >
      <div className="w-full px-5 lg:px-6">
        <div
          className={`
            flex items-center justify-between
            transition-all duration-500
            ${scrolled ? "h-20" : "h-24"}
          `}
        >
          {/* ================================================= */}
          {/* LOGO + BRAND */}
          {/* ================================================= */}

          <Link
            href="/"
            className="flex items-center gap-3 group min-w-[260px]"
          >
            {/* Logo */}
            <Image
              src="/images/logo.png"
              alt="Nishaan Logo"
              width={scrolled ? 48 : 52}
              height={scrolled ? 48 : 52}
              priority
              className="
                object-contain
                transition-all
                duration-500
              "
            />

            {/* Brand Information */}
            <div className="flex flex-col leading-none">
              {/* NISHAAN */}
              <span
                className={`
                  font-bold
                  tracking-[2px]
                  text-[#083B25]
                  transition-all duration-500
                  ${scrolled ? "text-[20px]" : "text-[21px]"}
                `}
              >
                NISHAAN
              </span>

              {/* Tagline */}
              <span
                className={`
                  mt-[4px]
                  font-medium
                  text-[#17202A]
                  whitespace-nowrap
                  transition-all duration-500
                  ${scrolled ? "text-[9px]" : "text-[10px]"}
                `}
              >
                AI-Powered Geospatial Verification
              </span>

              {/* SYSTEM ONLINE */}
              <span
                className="
                  flex items-center gap-1.5
                  mt-[7px]
                  text-[10px]
                  font-semibold
                  tracking-wide
                  text-[#218344]
                "
              >
                <span
                  className="
                    h-[7px]
                    w-[7px]
                    rounded-full
                    bg-[#28A84A]
                  "
                />
                SYSTEM ONLINE
              </span>
            </div>
          </Link>

          {/* ================================================= */}
          {/* NAVIGATION */}
          {/* ================================================= */}

          <div className="hidden md:flex items-center gap-10 lg:gap-[42px]">
            {/* HOME */}
            <Link
              href="/"
              className="
    relative
    py-2
    text-[15px]
    font-semibold
    text-[#111827]
    transition-all
    duration-300
    hover:text-[#18823F]
    group
  "
            >
              Home
              <span
                className="
      absolute
      bottom-0
      left-0
      h-[2px]
      w-0
      rounded-full
      bg-[#18823F]
      transition-all
      duration-300
      group-hover:w-full
    "
              />
            </Link>

            {/* HOW IT WORKS */}
            <Link
              href="/how-it-works"
              className="
                relative
                py-2
                text-[15px]
                font-semibold
                text-[#111827]
                transition-all
                duration-300
                hover:text-[#18823F]
                group
              "
            >
              How It Works
              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  rounded-full
                  bg-[#18823F]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>

            {/* EXPLORE */}
            <Link
              href="/explore"
              className="
                relative
                py-2
                text-[15px]
                font-semibold
                text-[#111827]
                transition-all
                duration-300
                hover:text-[#18823F]
                group
              "
            >
              Explore
              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  rounded-full
                  bg-[#18823F]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>

            {/* ABOUT */}
            <Link
              href="/about"
              className="
                relative
                py-2
                text-[15px]
                font-semibold
                text-[#111827]
                transition-all
                duration-300
                hover:text-[#18823F]
                group
              "
            >
              About
              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  rounded-full
                  bg-[#18823F]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>
          </div>

          {/* ================================================= */}
          {/* EXPLORE MAP BUTTON */}
          {/* ================================================= */}

          <Link
            href="/explore"
            className="
              hidden
              md:flex
              items-center
              justify-center
              gap-3

              min-w-[149px]

              px-6
              py-[14px]

              rounded-[16px]

              bg-gradient-to-br
              from-[#12683A]
              to-[#07512D]

              text-white
              text-[14px]
              font-semibold

              shadow-[0_7px_18px_rgba(7,81,45,0.22)]

              transition-all
              duration-300

              hover:-translate-y-[1px]
              hover:shadow-[0_10px_25px_rgba(7,81,45,0.30)]

              group
            "
          >
            <span>Explore Nishaan</span>

            <span
              className="
                text-[20px]
                leading-none
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>

          {/* ================================================= */}
          {/* MOBILE MENU */}
          {/* ================================================= */}

          <button
            className="
              md:hidden
              text-2xl
              text-[#083B25]
              hover:text-[#18823F]
              transition
            "
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}
