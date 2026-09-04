"use client";

import { useEffect, useRef, useState } from "react";
import worldAtlas from "world-atlas/countries-50m.json";

import {
  FiImage,
  FiMic,
  FiEdit3,
  FiCpu,
  FiSearch,
  FiMapPin,
  FiCheckCircle,
  FiMap,
} from "react-icons/fi";

/* ========================================================= */
/* ACCURATE PAKISTAN SVG GEOMETRY */
/* ========================================================= */

function decodeTopoArc(topology, arcIndex) {
  const reversed = arcIndex < 0;
  const actualIndex = reversed ? ~arcIndex : arcIndex;
  const arc = topology.arcs[actualIndex];
  const transform = topology.transform;

  let x = 0;
  let y = 0;

  const points = arc.map(([dx, dy]) => {
    x += dx;
    y += dy;

    if (!transform) {
      return [x, y];
    }

    return [
      x * transform.scale[0] + transform.translate[0],
      y * transform.scale[1] + transform.translate[1],
    ];
  });

  if (reversed) {
    points.reverse();
  }

  return points;
}

function stitchRing(topology, arcIndexes) {
  const ring = [];

  arcIndexes.forEach((arcIndex, index) => {
    const arc = decodeTopoArc(topology, arcIndex);

    ring.push(...(index === 0 ? arc : arc.slice(1)));
  });

  return ring;
}

function createPakistanMap(topology) {
  const countries = topology.objects.countries.geometries;

  const pakistan = countries.find(
    (country) => String(country.id).padStart(3, "0") === "586"
  );

  if (!pakistan) {
    throw new Error("Pakistan could not be found in world-atlas.");
  }

  const polygons =
    pakistan.type === "Polygon" ? [pakistan.arcs] : pakistan.arcs;

  const geoPolygons = polygons.map((polygon) =>
    polygon.map((ring) => stitchRing(topology, ring))
  );

  const allPoints = geoPolygons.flat(2);

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  allPoints.forEach(([lon, lat]) => {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });

  const centerLon = (minLon + maxLon) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const correction = Math.cos((centerLat * Math.PI) / 180);

  const VIEW_WIDTH = 520;
  const VIEW_HEIGHT = 650;
  const PADDING = 55;

  function rawProject(lon, lat) {
    return [(lon - centerLon) * correction, lat - centerLat];
  }

  const projected = allPoints.map(([lon, lat]) => rawProject(lon, lat));

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  projected.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  const scale = Math.min(
    (VIEW_WIDTH - PADDING * 2) / (maxX - minX),
    (VIEW_HEIGHT - PADDING * 2) / (maxY - minY)
  );

  function project(lon, lat) {
    const [x, y] = rawProject(lon, lat);

    return [
      VIEW_WIDTH / 2 + x * scale,
      VIEW_HEIGHT / 2 - y * scale,
    ];
  }

  const path = geoPolygons
    .map((polygon) =>
      polygon
        .map((ring) => {
          if (!ring.length) return "";

          const points = ring.map(([lon, lat]) => project(lon, lat));

          return (
            `M ${points[0][0]} ${points[0][1]} ` +
            points
              .slice(1)
              .map(([x, y]) => `L ${x} ${y}`)
              .join(" ") +
            " Z"
          );
        })
        .join(" ")
    )
    .join(" ");

  return {
    path,
    project,
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
  };
}

const PAKISTAN_MAP = createPakistanMap(worldAtlas);

const MAP_CITIES = [
  {
    name: "Karachi",
    coords: PAKISTAN_MAP.project(67.0011, 24.8607),
  },
  {
    name: "Quetta",
    coords: PAKISTAN_MAP.project(66.975, 30.1798),
  },
  {
    name: "Multan",
    coords: PAKISTAN_MAP.project(71.4753, 30.1575),
  },
  {
    name: "Lahore",
    coords: PAKISTAN_MAP.project(74.3587, 31.5204),
  },
  {
    name: "Peshawar",
    coords: PAKISTAN_MAP.project(71.5249, 34.0151),
  },
  {
    name: "Islamabad",
    coords: PAKISTAN_MAP.project(73.0479, 33.6844),
  },
];

const ISLAMABAD = PAKISTAN_MAP.project(73.0479, 33.6844);

/* ========================================================= */
/* JOURNEY STAGE */
/* ========================================================= */

function JourneyStage({
  step,
  label,
  title,
  description,
  active,
  stageRef,
  aos,
  side = "left",
  children,
}) {
  const isRight = side === "right";

  return (
    <div
      ref={stageRef}
      data-aos={aos}
      className="
        relative
        grid
        md:grid-cols-2
        items-center
        min-h-[320px]
        md:min-h-[420px]
        py-8
        md:py-12
      "
    >
      <div
        className={`
          relative
          z-20
          ${
            isRight
              ? "md:col-start-2 md:pl-10 lg:pl-16"
              : "md:col-start-1 md:pr-10 lg:pr-16"
          }
        `}
      >
        <div
          className={`
            rounded-[28px]
            p-5
            sm:p-6
            md:p-7
            border
            backdrop-blur-[14px]
            transition-all
            duration-500
            ${
              active
                ? "bg-[#fbfcf7]/94 border-[#C8E6C9] shadow-[0_18px_55px_rgba(13,59,13,0.10)]"
                : "bg-[#fbfcf7]/82 border-[#C8E6C9]/50 shadow-[0_8px_30px_rgba(13,59,13,0.04)]"
            }
          `}
        >
          <div
            className={`
              flex
              flex-col
              sm:flex-row
              items-start
              sm:items-center
              gap-5
              md:gap-7
              ${
                isRight
                  ? "md:flex-row-reverse md:text-right"
                  : ""
              }
            `}
          >
            {/* STEP NUMBER */}

            <div className="relative shrink-0">
              {active && (
                <div className="absolute inset-0 rounded-full bg-[#5FAF5F]/20 scale-[1.22]" />
              )}

              <div
                className={`
                  relative
                  w-20
                  h-20
                  md:w-24
                  md:h-24
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-500
                  ${
                    active
                      ? "bg-[#0D3B0D] text-white shadow-[0_12px_32px_rgba(13,59,13,0.20)] scale-105"
                      : "bg-[#C8E6C9]/70 text-[#0D3B0D]"
                  }
                `}
              >
                <div className="text-center">
                  <span
                    className={`
                      block
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      font-semibold
                      ${
                        active
                          ? "text-[#5FAF5F]"
                          : "text-[#2F6B2F]"
                      }
                    `}
                  >
                    Step
                  </span>

                  <span className="block text-2xl md:text-3xl font-bold mt-0.5">
                    {String(step).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTENT */}

            <div className="flex-1 min-w-0">
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#5FAF5F]">
                {label}
              </p>

              <h3 className="mt-2 text-2xl md:text-3xl font-bold text-[#0D3B0D] leading-tight">
                {title}
              </h3>

              <p
                className={`
                  mt-4
                  text-sm
                  md:text-[15px]
                  leading-7
                  text-[#1A1A1A]/65
                  max-w-lg
                  ${isRight ? "md:ml-auto" : ""}
                `}
              >
                {description}
              </p>

              <div
                className={
                  isRight
                    ? "md:flex md:justify-end"
                    : ""
                }
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* CENTRAL GEOSPATIAL VISUAL */
/* ========================================================= */

function JourneyMap({ activeStep }) {
  const islamabadX = ISLAMABAD[0];
  const islamabadY = ISLAMABAD[1];

  const searchNodes =
    activeStep >= 4
      ? [
          [islamabadX - 46, islamabadY + 28],
          [islamabadX + 42, islamabadY + 18],
          [islamabadX - 22, islamabadY - 42],
          [islamabadX + 58, islamabadY - 34],
        ]
      : [];

  const spine = [
    { step: 1, icon: <FiImage /> },
    { step: 2, icon: <FiCpu /> },
    { step: 3, icon: <FiMap /> },
    { step: 4, icon: <FiSearch /> },
    { step: 5, icon: <FiMapPin /> },
  ];

  return (
    <div className="relative w-full h-full nishaan-map-float">
      {/* GLOW */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 w-[78%] h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5FAF5F]/16 blur-[85px]" />

        <div className="absolute left-1/2 top-1/2 w-[58%] h-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8E6C9]/32 blur-[65px]" />
      </div>

      <div className="relative w-full h-full">
        <svg
          viewBox={`0 0 ${PAKISTAN_MAP.width} ${PAKISTAN_MAP.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full overflow-visible"
          aria-label="Pakistan geospatial search visualization"
        >
          <defs>
            <linearGradient
              id="pakistanFill"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#C8E6C9"
                stopOpacity="0.86"
              />

              <stop
                offset="100%"
                stopColor="#5FAF5F"
                stopOpacity="0.38"
              />
            </linearGradient>

            <linearGradient id="radarBeam">
              <stop
                offset="0%"
                stopColor="#5FAF5F"
                stopOpacity="0"
              />

              <stop
                offset="50%"
                stopColor="#5FAF5F"
                stopOpacity="0.30"
              />

              <stop
                offset="100%"
                stopColor="#5FAF5F"
                stopOpacity="0"
              />
            </linearGradient>

            <filter
              id="softGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="9" result="blur" />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="pakistanClip">
              <path
                d={PAKISTAN_MAP.path}
                fillRule="evenodd"
              />
            </clipPath>
          </defs>

          {/* LARGE RADAR RINGS */}

          {[95, 150, 205, 260, 310].map((radius, index) => (
            <circle
              key={radius}
              cx="260"
              cy="325"
              r={radius}
              fill="none"
              stroke="#2F6B2F"
              strokeOpacity={0.045 + index * 0.015}
              strokeWidth="1"
              strokeDasharray={
                index % 2 === 0
                  ? "4 8"
                  : undefined
              }
            />
          ))}

          {/* AXIS */}

          <line
            x1="-80"
            x2="600"
            y1="325"
            y2="325"
            stroke="#2F6B2F"
            strokeOpacity="0.07"
          />

          <line
            x1="260"
            x2="260"
            y1="-50"
            y2="700"
            stroke="#2F6B2F"
            strokeOpacity="0.07"
          />

          {/* PAKISTAN GLOW */}

          <path
            d={PAKISTAN_MAP.path}
            fill="#5FAF5F"
            fillOpacity="0.16"
            stroke="#5FAF5F"
            strokeWidth="5"
            strokeOpacity="0.12"
            filter="url(#softGlow)"
          />

          {/* PAKISTAN */}

          <path
            d={PAKISTAN_MAP.path}
            fill="url(#pakistanFill)"
            fillRule="evenodd"
            stroke="#2F6B2F"
            strokeWidth="1.8"
            strokeOpacity="0.65"
            className="nishaan-map-outline"
          />

          {/* GEOGRAPHIC GRID */}

          <g clipPath="url(#pakistanClip)" opacity="0.18">
            {Array.from({ length: 11 }).map((_, index) => (
              <line
                key={`h-${index}`}
                x1="-20"
                x2="550"
                y1={115 + index * 42}
                y2={90 + index * 46}
                stroke="#2F6B2F"
                strokeWidth="0.75"
              />
            ))}

            {Array.from({ length: 9 }).map((_, index) => (
              <line
                key={`v-${index}`}
                x1={70 + index * 48}
                x2={95 + index * 44}
                y1="40"
                y2="650"
                stroke="#2F6B2F"
                strokeWidth="0.7"
              />
            ))}
          </g>

          {/* NETWORK */}

          {activeStep >= 2 && (
            <g>
              <polyline
                points={MAP_CITIES.map(
                  (city) =>
                    `${city.coords[0]},${city.coords[1]}`
                ).join(" ")}
                fill="none"
                stroke="#5FAF5F"
                strokeWidth="1.6"
                strokeOpacity="0.56"
                strokeDasharray="4 7"
                className="nishaan-route-line"
              />

              {MAP_CITIES.map((city, index) => (
                <g key={city.name}>
                  <circle
                    cx={city.coords[0]}
                    cy={city.coords[1]}
                    r={index === 5 ? 5 : 3.5}
                    fill="#5FAF5F"
                    opacity={index === 5 ? 1 : 0.8}
                    className="nishaan-node"
                    style={{
                      animationDelay: `${index * 180}ms`,
                    }}
                  />

                  <circle
                    cx={city.coords[0]}
                    cy={city.coords[1]}
                    r={index === 5 ? 11 : 7}
                    fill="none"
                    stroke="#5FAF5F"
                    strokeOpacity="0.26"
                  />
                </g>
              ))}
            </g>
          )}

          {/* RADAR */}

          {activeStep >= 2 && (
            <g
              className="nishaan-radar-sweep"
              style={{
                transformOrigin: "260px 325px",
              }}
            >
              <path
                d="M260 325 L260 70 A255 255 0 0 1 395 112 Z"
                fill="url(#radarBeam)"
              />
            </g>
          )}

          {/* CLUE SIGNALS */}

          {activeStep >= 3 && (
            <g>
              {[
                [190, 250],
                [330, 220],
                [218, 390],
                [350, 355],
              ].map(([x, y], index) => (
                <g
                  key={`${x}-${y}`}
                  className="nishaan-clue-node"
                  style={{
                    animationDelay: `${index * 180}ms`,
                  }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#0D3B0D"
                  />

                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke="#5FAF5F"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                </g>
              ))}
            </g>
          )}

          {/* SEARCH CANDIDATES */}

          {activeStep >= 4 &&
            searchNodes.map(([x, y], index) => (
              <g
                key={index}
                className={
                  activeStep === 5
                    ? "nishaan-candidate-fade"
                    : "nishaan-candidate"
                }
              >
                <line
                  x1={islamabadX}
                  y1={islamabadY}
                  x2={x}
                  y2={y}
                  stroke="#5FAF5F"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  strokeDasharray="3 6"
                />

                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#fbfcf7"
                  stroke="#5FAF5F"
                  strokeWidth="2"
                />
              </g>
            ))}

          {/* FINAL LOCATION */}

          {activeStep >= 4 && (
            <>
              {[18, 30, 44].map((radius, index) => (
                <circle
                  key={radius}
                  cx={islamabadX}
                  cy={islamabadY}
                  r={radius}
                  fill="none"
                  stroke="#5FAF5F"
                  strokeWidth="1.2"
                  className="nishaan-pulse-ring"
                  style={{
                    animationDelay: `${index * 650}ms`,
                  }}
                />
              ))}

              <circle
                cx={islamabadX}
                cy={islamabadY}
                r={activeStep === 5 ? 10 : 7}
                fill="#0D3B0D"
                stroke="#C8E6C9"
                strokeWidth="4"
              />
            </>
          )}
        </svg>

        {/* PROCESS SPINE */}

        <div className="pointer-events-none absolute left-1/2 top-[8%] bottom-[9%] -translate-x-1/2 flex flex-col items-center justify-between">
          <div className="absolute top-5 bottom-5 w-px bg-[#2F6B2F]/16" />

          {spine.map((item) => {
            const completed = activeStep >= item.step;
            const current = activeStep === item.step;

            return (
              <div
                key={item.step}
                className={`
                  relative
                  z-10
                  w-11
                  h-11
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-lg
                  transition-all
                  duration-500
                  border
                  ${
                    completed
                      ? "bg-[#fbfcf7]/94 border-[#5FAF5F] text-[#0D3B0D] shadow-[0_6px_24px_rgba(47,107,47,0.16)]"
                      : "bg-[#fbfcf7]/82 border-[#C8E6C9] text-[#2F6B2F]/40"
                  }
                  ${current ? "scale-110" : ""}
                `}
              >
                {item.icon}
              </div>
            );
          })}
        </div>

        {/* FINAL DESTINATION */}

        <div
          className={`
            pointer-events-none
            absolute
            left-1/2
            bottom-[3%]
            -translate-x-1/2
            transition-all
            duration-700
            ${
              activeStep === 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }
          `}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full border border-[#5FAF5F]/35 nishaan-location-ring" />

            <div
              className="absolute w-16 h-16 rounded-full border border-[#5FAF5F]/50 nishaan-location-ring"
              style={{
                animationDelay: "700ms",
              }}
            />

            <div className="relative w-14 h-14 rounded-full bg-[#0D3B0D] text-white flex items-center justify-center shadow-[0_12px_30px_rgba(13,59,13,0.22)] nishaan-target-breathe">
              <FiMapPin className="text-2xl text-[#C8E6C9]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* PAGE */
/* ========================================================= */

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  const stageRefs = useRef([]);

  useEffect(() => {
    const observers = [];

    stageRefs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(index + 1);
          }
        },
        {
          threshold: 0.4,
          rootMargin: "-20% 0px -35% 0px",
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#fbfcf7] text-[#1A1A1A]">

      {/* ================================================= */}
      {/* HOW IT WORKS HERO WITH VIDEO */}
      {/* ================================================= */}

      <section className="relative z-10 min-h-[70vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden text-white">
        
        {/* VIDEO BACKGROUND - HERO ONLY */}

        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
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
              scale-[1.25]
              object-cover
            "
          >
            <source
              src="/videos/Video%20Project.mp4"
              type="video/mp4"
            />

            Your browser does not support the video tag.
          </video>

          {/* Main dark green overlay */}

          <div className="absolute inset-0 bg-[#0D3B0D]/85" />
        </div>

        {/* Hero Content */}

        <div
          className="relative z-10 max-w-5xl mx-auto text-center px-6 py-24"
          data-aos="fade-up"
        >
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            How Nishaan
            <br />

            <span className="text-[#5FAF5F]">
              Finds a Place
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto mt-7 text-lg md:text-xl text-[#C8E6C9] leading-8"
            data-aos="fade-up"
            data-aos-delay="350"
          >
            You provide the clue. Nishaan understands it. Geography helps narrow
            it down.
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* THE JOURNEY */}
      {/* ================================================= */}

      <section className="relative z-10 bg-[#fbfcf7] py-24 md:py-32">

        {/* TITLE */}

        <div
          className="relative z-30 text-center px-6 mb-14 md:mb-16"
          data-aos="fade-up"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#5FAF5F]">
            The Journey
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0D3B0D]">
            One clue. Five stages.
          </h2>
        </div>

        {/* ================================================= */}
        {/* MAP + STEPS WRAPPER */}
        {/* ================================================= */}

        <div className="relative">

          {/* ================================================= */}
          {/* REAL STICKY FULL SCREEN BACKGROUND */}
          {/* ================================================= */}

          <div
            className="
              sticky
              top-0
              z-0
              h-screen
              w-full
              overflow-hidden
              pointer-events-none
            "
          >
            {/* BASE BACKGROUND */}

            <div className="absolute inset-0 bg-[#fbfcf7]" />

            {/* LARGE GLOWS */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                w-[90vw]
                h-[90vw]
                max-w-[1500px]
                max-h-[1500px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#C8E6C9]/25
                blur-[120px]
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-1/2
                w-[65vw]
                h-[65vw]
                max-w-[1100px]
                max-h-[1100px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#5FAF5F]/10
                blur-[90px]
              "
            />

            {/* ================================================= */}
            {/* DECORATIVE NETWORK ACROSS WHOLE SCREEN */}
            {/* ================================================= */}

            <svg
              viewBox="0 0 1600 900"
              preserveAspectRatio="none"
              className="
                absolute
                inset-0
                w-full
                h-full
                opacity-[0.26]
                nishaan-network-background
              "
            >
              <g
                fill="none"
                stroke="#5FAF5F"
                strokeWidth="1"
                strokeOpacity="0.42"
              >
                <path d="M-20 110 L90 160 L175 105 L285 170" />
                <path d="M5 360 L105 315 L220 375 L330 330" />
                <path d="M-20 680 L115 625 L230 700 L360 650" />

                <path d="M1230 100 L1340 150 L1455 95 L1620 165" />
                <path d="M1260 360 L1370 300 L1470 370 L1620 320" />
                <path d="M1200 690 L1320 620 L1435 700 L1620 650" />

                <path d="M380 40 L470 80 L535 48" />
                <path d="M1050 55 L1140 105 L1210 60" />

                <path d="M340 820 L455 760 L560 820" />
                <path d="M1040 820 L1145 760 L1255 820" />
              </g>

              {[
                [90, 160],
                [175, 105],
                [285, 170],

                [105, 315],
                [220, 375],
                [330, 330],

                [115, 625],
                [230, 700],
                [360, 650],

                [1230, 100],
                [1340, 150],
                [1455, 95],

                [1260, 360],
                [1370, 300],
                [1470, 370],

                [1200, 690],
                [1320, 620],
                [1435, 700],

                [470, 80],
                [535, 48],

                [1140, 105],
                [1210, 60],

                [455, 760],
                [560, 820],

                [1145, 760],
                [1255, 820],
              ].map(([x, y], index) => (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#5FAF5F"
                  opacity="0.8"
                  className="nishaan-background-dot"
                  style={{
                    animationDelay: `${index * 180}ms`,
                  }}
                />
              ))}
            </svg>

            {/* ================================================= */}
            {/* MAP POSITIONER */}
            {/* IMPORTANT: THIS DOES NOT ANIMATE */}
            {/* ================================================= */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[86vw]
                h-[115vh]
                max-w-[1550px]
                pointer-events-none
              "
            >
              {/* INNER ELEMENT ANIMATES */}
              {/* THIS PREVENTS THE CENTERING TRANSFORM FROM BREAKING */}

              <div className="w-full h-full nishaan-background-drift">
                <JourneyMap activeStep={activeStep} />
              </div>
            </div>

            {/* SOFT EDGE BLENDS */}

            <div
              className="
                absolute
                inset-y-0
                left-0
                w-[5vw]
                bg-gradient-to-r
                from-[#fbfcf7]
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-y-0
                right-0
                w-[5vw]
                bg-gradient-to-l
                from-[#fbfcf7]
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-x-0
                top-0
                h-20
                bg-gradient-to-b
                from-[#fbfcf7]
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-20
                bg-gradient-to-t
                from-[#fbfcf7]
                to-transparent
              "
            />
          </div>

          {/* ================================================= */}
          {/* SCROLLING STEPS */}
          {/* ================================================= */}

          <div
            className="
              relative
              z-20
              -mt-[100vh]
              max-w-7xl
              mx-auto
              px-5
              sm:px-6
              pb-[12vh]
            "
          >
            {/* ================================================= */}
            {/* STEP 01 — LEFT */}
            {/* ================================================= */}

            <JourneyStage
              step={1}
              label="Input"
              title="Start With Any Clue"
              description="You don't need an exact address or place name. Give Nishaan whatever information you remember."
              active={activeStep === 1}
              side="left"
              stageRef={(element) => {
                stageRefs.current[0] = element;
              }}
              aos="fade-right"
            >
              <div className="flex flex-wrap gap-2 mt-5">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-[#C8E6C9] shadow-sm">
                  <FiImage className="text-[#2F6B2F]" />

                  <span className="text-xs font-medium">
                    Image
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-[#C8E6C9] shadow-sm">
                  <FiMic className="text-[#2F6B2F]" />

                  <span className="text-xs font-medium">
                    Voice
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-[#C8E6C9] shadow-sm">
                  <FiEdit3 className="text-[#2F6B2F]" />

                  <span className="text-xs font-medium">
                    Text
                  </span>
                </div>
              </div>
            </JourneyStage>

            {/* ================================================= */}
            {/* STEP 02 — RIGHT */}
            {/* ================================================= */}

            <JourneyStage
              step={2}
              label="Understanding"
              title="AI Understands Your Clue"
              description="Nishaan analyzes the information you provide and identifies meaningful details that could help describe the location."
              active={activeStep === 2}
              side="right"
              stageRef={(element) => {
                stageRefs.current[1] = element;
              }}
              aos="fade-left"
            >
              <div className="mt-5">
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#C8E6C9]/70 border border-[#C8E6C9]">
                  <FiCpu className="text-[#0D3B0D]" />

                  <span className="text-sm font-semibold text-[#0D3B0D]">
                    AI Analysis
                  </span>
                </div>
              </div>
            </JourneyStage>

            {/* ================================================= */}
            {/* STEP 03 — LEFT */}
            {/* ================================================= */}

            <JourneyStage
              step={3}
              label="Extraction"
              title="Location Clues Are Extracted"
              description="Important geographic information is separated from the rest of the description to help narrow down the possibilities."
              active={activeStep === 3}
              side="left"
              stageRef={(element) => {
                stageRefs.current[2] = element;
              }}
              aos="fade-right"
            >
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  "Landmarks",
                  "Roads",
                  "Buildings",
                  "Markets",
                  "Nearby Places",
                ].map((item, index) => (
                  <span
                    key={item}
                    className="
                      px-3
                      py-1.5
                      rounded-full
                      bg-white/90
                      border
                      border-[#C8E6C9]
                      text-xs
                      text-[#2F6B2F]
                      shadow-sm
                    "
                    data-aos="zoom-in"
                    data-aos-delay={index * 80}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </JourneyStage>

            {/* ================================================= */}
            {/* STEP 04 — RIGHT */}
            {/* ================================================= */}

            <JourneyStage
              step={4}
              label="Geospatial Search"
              title="Geography Narrows It Down"
              description="The extracted clues are used alongside geographic information to identify places that could match what you described."
              active={activeStep === 4}
              side="right"
              stageRef={(element) => {
                stageRefs.current[3] = element;
              }}
              aos="fade-left"
            >
              <div className="mt-5">
                <div className="relative w-[220px] h-20 rounded-xl bg-[#0D3B0D] overflow-hidden shadow-md">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-0 right-0 border-t border-white rotate-6" />

                    <div className="absolute top-10 left-0 right-0 border-t border-white -rotate-6" />

                    <div className="absolute left-14 top-0 bottom-0 border-l border-white rotate-12" />

                    <div className="absolute left-36 top-0 bottom-0 border-l border-white -rotate-12" />
                  </div>

                  <FiSearch className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-[#5FAF5F]" />
                </div>
              </div>
            </JourneyStage>

            {/* ================================================= */}
            {/* STEP 05 — LEFT */}
            {/* ================================================= */}

            <JourneyStage
              step={5}
              label="Discovery"
              title="Explore Potential Locations"
              description="Nishaan presents potential locations that you can explore visually and compare."
              active={activeStep === 5}
              side="left"
              stageRef={(element) => {
                stageRefs.current[4] = element;
              }}
              aos="fade-right"
            >
              <div className="mt-5 bg-white/90 rounded-xl border border-[#C8E6C9] shadow-sm p-3 max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C8E6C9] flex items-center justify-center">
                    <FiMapPin className="text-[#0D3B0D]" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[11px] text-[#1A1A1A]/45">
                      Potential Match
                    </p>

                    <p className="text-sm font-bold text-[#0D3B0D]">
                      Location identified
                    </p>
                  </div>

                  <FiCheckCircle className="text-[#5FAF5F]" />
                </div>
              </div>
            </JourneyStage>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* ANIMATION CSS */}
      {/* ================================================= */}

      <style>{`
        @keyframes nishaanBackgroundDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          25% {
            transform: translate3d(8px, -5px, 0) scale(1.006);
          }

          50% {
            transform: translate3d(-6px, -10px, 0) scale(1.014);
          }

          75% {
            transform: translate3d(-9px, -3px, 0) scale(1.007);
          }
        }

        @keyframes nishaanMapFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes nishaanNetworkDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -6px, 0);
          }
        }

        @keyframes nishaanBackgroundDot {
          0%,
          100% {
            opacity: 0.35;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes nishaanRoute {
          from {
            stroke-dashoffset: 100;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes nishaanRadarRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes nishaanNodePulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.9);
          }

          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        @keyframes nishaanClueAppear {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }

          70% {
            opacity: 1;
            transform: scale(1.12);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes nishaanRadarPulse {
          0% {
            opacity: 0.5;
            transform: scale(0.55);
          }

          100% {
            opacity: 0;
            transform: scale(1.55);
          }
        }

        @keyframes nishaanLocationPulse {
          0% {
            opacity: 0.55;
            transform: scale(0.75);
          }

          100% {
            opacity: 0;
            transform: scale(1.55);
          }
        }

        @keyframes nishaanBreathe {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes nishaanMapDraw {
          from {
            stroke-dashoffset: 1500;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes nishaanGlowPulse {
          0%,
          100% {
            filter: drop-shadow(
              0 0 4px rgba(95, 175, 95, 0.08)
            );
          }

          50% {
            filter: drop-shadow(
              0 0 22px rgba(95, 175, 95, 0.30)
            );
          }
        }

        .nishaan-background-drift {
          animation: nishaanBackgroundDrift 15s ease-in-out infinite;
        }

        .nishaan-map-float {
          animation: nishaanMapFloat 8s ease-in-out infinite;
        }

        .nishaan-network-background {
          animation: nishaanNetworkDrift 12s ease-in-out infinite;
        }

        .nishaan-background-dot {
          animation: nishaanBackgroundDot 3.5s ease-in-out infinite;
        }

        .nishaan-map-outline {
          stroke-dasharray: 1500;
          stroke-dashoffset: 1500;
          animation:
            nishaanMapDraw 2.4s ease forwards,
            nishaanGlowPulse 5s ease-in-out infinite;
        }

        .nishaan-route-line {
          stroke-dasharray: 8 9;
          animation: nishaanRoute 7s linear infinite;
        }

        .nishaan-radar-sweep {
          transform-box: view-box;
          transform-origin: center;
          animation: nishaanRadarRotate 10s linear infinite;
        }

        .nishaan-node {
          transform-box: fill-box;
          transform-origin: center;
          animation: nishaanNodePulse 2.8s ease-in-out infinite;
        }

        .nishaan-clue-node {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: nishaanClueAppear 0.7s ease forwards;
        }

        .nishaan-candidate {
          transform-box: fill-box;
          transform-origin: center;
          animation: nishaanNodePulse 2.6s ease-in-out infinite;
        }

        .nishaan-candidate-fade {
          opacity: 0.14;
          transition: opacity 0.7s ease;
        }

        .nishaan-pulse-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: nishaanRadarPulse 2.4s ease-out infinite;
        }

        .nishaan-location-ring {
          animation: nishaanLocationPulse 2.5s ease-out infinite;
        }

        .nishaan-target-breathe {
          animation: nishaanBreathe 3.4s ease-in-out infinite;
        }

        @media (max-width: 767px) {
          .nishaan-background-drift {
            opacity: 0.48;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nishaan-background-drift,
          .nishaan-map-float,
          .nishaan-network-background,
          .nishaan-background-dot,
          .nishaan-map-outline,
          .nishaan-route-line,
          .nishaan-radar-sweep,
          .nishaan-node,
          .nishaan-clue-node,
          .nishaan-candidate,
          .nishaan-pulse-ring,
          .nishaan-location-ring,
          .nishaan-target-breathe {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}