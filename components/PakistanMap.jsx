"use client";

import { useEffect, useState } from "react";
import { FiMapPin } from "react-icons/fi";

export default function PakistanMap() {
  const [scan, setScan] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScan(true);

      setTimeout(() => {
        setScan(false);
      }, 2200);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      {/* ================================================= */}
      {/* ATMOSPHERIC GLOW */}
      {/* ================================================= */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[65%]
          h-[65%]
          rounded-full
          bg-[#5FAF5F]/25
          blur-[100px]
          animate-pulse
        "
      />

      {/* ================================================= */}
      {/* PARTICLES */}
      {/* ================================================= */}

      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute left-[18%] top-[25%] w-1.5 h-1.5 rounded-full bg-[#5FAF5F] animate-ping" />

        <span
          className="absolute left-[30%] top-[18%] w-1 h-1 rounded-full bg-[#5FAF5F]"
          style={{ animation: "pulse 2.5s infinite" }}
        />

        <span className="absolute left-[70%] top-[20%] w-1.5 h-1.5 rounded-full bg-[#5FAF5F] animate-ping" />

        <span
          className="absolute right-[18%] top-[38%] w-1 h-1 rounded-full bg-[#5FAF5F]"
          style={{ animation: "pulse 3s infinite" }}
        />

        <span className="absolute left-[15%] bottom-[30%] w-1 h-1 rounded-full bg-[#5FAF5F] animate-ping" />

        <span className="absolute right-[25%] bottom-[22%] w-1.5 h-1.5 rounded-full bg-[#5FAF5F] animate-ping" />
      </div>

      {/* ================================================= */}
      {/* MAP CONTAINER */}
      {/* ================================================= */}

      <div className="relative flex items-center justify-center">
        {/* Map glow */}
        <div
          className="
            absolute
            inset-[8%]
            bg-[#5FAF5F]/20
            blur-2xl
            rounded-full
          "
        />

        {/* ================================================= */}
        {/* GEOSPATIAL GRID */}
        {/* ================================================= */}

        <div
          className="
            absolute
            inset-[8%]
            pointer-events-none
            opacity-30
          "
          style={{
            backgroundImage: `
              linear-gradient(rgba(95,175,95,0.35) 1px, transparent 1px),
              linear-gradient(90deg, rgba(95,175,95,0.35) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            maskImage: "url('/images/map.png')",
            WebkitMaskImage: "url('/images/map.png')",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />

        {/* ================================================= */}
        {/* PAKISTAN */}
        {/* ================================================= */}

        <img
          src="/images/map.png"
          alt="Pakistan"
          className="
            relative
            z-10
            w-full
            h-auto
            object-contain
            drop-shadow-[0_0_12px_rgba(95,175,95,0.65)]
            animate-mapFloat
          "
        />

        {/* ================================================= */}
        {/* NETWORK NODES */}
        {/* ================================================= */}

        <div className="absolute inset-0 z-20 pointer-events-none">
          <Node left="57%" top="55%" delay="0.5s" />
          <Node left="48%" top="61%" delay="1.8s" />
          <Node left="38%" top="57%" delay="1s" />
          <Node left="62%" top="47%" delay="2s" />
        </div>

        {/* ================================================= */}
        {/* LOCATION PIN */}
        {/* ================================================= */}

        <div
          className="
            absolute
            z-30
            left-[51%]
            top-[55%]
            -translate-x-1/2
            -translate-y-1/2
          "
        >
          {/* Scan rings */}

          <div
            className={`
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-[#5FAF5F]
              transition-all
              duration-[2200ms]
              ${scan ? "w-[300px] h-[300px] opacity-0" : "w-16 h-16 opacity-20"}
            `}
          />

          <div
            className={`
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-[#5FAF5F]
              transition-all
              duration-[1800ms]
              ${scan ? "w-[220px] h-[220px] opacity-0" : "w-10 h-10 opacity-30"}
            `}
          />

          {/* Pin glow */}

          <div
            className="
              absolute
              -inset-4
              rounded-full
              bg-[#5FAF5F]/30
              blur-xl
              animate-pulse
            "
          />

          {/* Pin */}

          <div
            className="
              relative
              w-14
              h-14
              rounded-full
              bg-[#0D3B0D]
              border-2
              border-[#5FAF5F]
              flex
              items-center
              justify-center
              shadow-[0_0_30px_rgba(95,175,95,0.8)]
              animate-pinFloat
            "
          >
            <FiMapPin className="text-[#5FAF5F] text-2xl" />
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCANNING LINE */}
      {/* ================================================= */}

      {scan && (
        <div
          className="
            absolute
            left-[20%]
            right-[20%]
            top-[52%]
            h-[2px]
            bg-[#5FAF5F]
            shadow-[0_0_15px_#5FAF5F]
            z-40
            animate-scanLine
          "
        />
      )}

      {/* ================================================= */}
      {/* STATUS */}
      {/* ================================================= */}

      <div
        className="
          absolute
          bottom-3
          left-1/2
          -translate-x-1/2
          bg-[#fbfcf7]/90
          backdrop-blur-md
          border
          border-[#C8E6C9]
          rounded-full
          px-5
          py-2
          shadow-lg
          flex
          items-center
          gap-2
          whitespace-nowrap
        "
      >
        <span className="w-2 h-2 rounded-full bg-[#5FAF5F] animate-pulse" />

        <span className="text-xs font-semibold tracking-wider text-[#0D3B0D]">
          GEOSPATIAL SYSTEM ACTIVE
        </span>
      </div>
    </div>
  );
}

/* ================================================= */
/* NETWORK NODE */
/* ================================================= */

function Node({ left, top, delay }) {
  return (
    <span
      className="
        absolute
        w-2.5
        h-2.5
        rounded-full
        bg-[#5FAF5F]
        shadow-[0_0_12px_rgba(95,175,95,0.9)]
        animate-nodePulse
      "
      style={{
        left,
        top,
        animationDelay: delay,
      }}
    />
  );
}
