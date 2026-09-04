"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  // Static export serves URLs with a trailing slash
  // ("/about/"), while link hrefs don't have one
  // ("/about") — normalize before comparing.
  const activePath =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close the menu if the viewport grows past the
  // mobile breakpoint (prevents a stuck scroll lock).
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const handleChange = (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  // While the menu is open: lock body scroll and close on Escape.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      {/* ================================================= */}
      {/* BACKDROP — tapping outside closes the menu       */}
      {/* ================================================= */}

      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-[#0D3B0D]/25
            backdrop-blur-[2px]
            md:hidden
          "
        />
      )}

      <header className="sticky top-0 z-50">
        <nav
          className={`
            text-[#1A1A1A]
            transition-all duration-500
            border-b border-white/60
            ${menuOpen ? "" : "rounded-br-[22px]"}
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
            className="
              flex
              items-center
              gap-2.5
              group
              min-w-0
              md:gap-3
              md:min-w-[260px]
            "
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
                  max-[400px]:hidden
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
          {/* MOBILE MENU TOGGLE                               */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="
              md:hidden
              flex
              h-11
              w-11
              -mr-2
              items-center
              justify-center
              rounded-xl
              text-[#083B25]
              transition-colors
              hover:bg-[#C8E6C9]/40
              active:bg-[#C8E6C9]/60
            "
          >
            <span className="relative block h-[18px] w-6">
              <span
                className={`
                  absolute
                  left-0
                  top-0
                  h-[2px]
                  w-full
                  rounded
                  bg-current
                  transition-all
                  duration-300
                  ${menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""}
                `}
              />

              <span
                className={`
                  absolute
                  left-0
                  top-1/2
                  h-[2px]
                  w-full
                  -translate-y-1/2
                  rounded
                  bg-current
                  transition-all
                  duration-300
                  ${menuOpen ? "opacity-0" : "opacity-100"}
                `}
              />

              <span
                className={`
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-full
                  rounded
                  bg-current
                  transition-all
                  duration-300
                  ${menuOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}
                `}
              />
            </span>
          </button>
        </div>
      </div>
        </nav>

        {/* ================================================= */}
        {/* MOBILE DROPDOWN MENU                             */}
        {/* ================================================= */}

        <div
          id="mobile-menu"
          className={`
            md:hidden
            overflow-hidden
            bg-[#fbfcf7]/95
            backdrop-blur-md
            transition-all
            duration-300
            ease-in-out
            ${
              menuOpen
                ? "max-h-[480px] border-b border-[#C8E6C9]/60 opacity-100 shadow-[0_18px_40px_rgba(13,59,13,0.10)]"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 px-4 pb-5 pt-3"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/explore", label: "Explore" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={
                  activePath === link.href ? "page" : undefined
                }
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3.5
                  text-[15px]
                  font-semibold
                  transition-colors
                  duration-200
                  ${
                    activePath === link.href
                      ? "bg-[#C8E6C9]/50 text-[#18823F]"
                      : "text-[#111827] hover:bg-[#C8E6C9]/30"
                  }
                `}
              >
                {link.label}

                <span className="text-[#5FAF5F]">→</span>
              </Link>
            ))}

            {/* EXPLORE MAP BUTTON */}

            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-gradient-to-br
                from-[#12683A]
                to-[#07512D]
                px-6
                py-[14px]
                text-white
                text-[14px]
                font-semibold
                shadow-[0_7px_18px_rgba(7,81,45,0.22)]
                transition-all
                duration-300
              "
            >
              <span>Explore Nishaan</span>

              <span
                className="
                  text-[20px]
                  leading-none
                "
              >
                →
              </span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
