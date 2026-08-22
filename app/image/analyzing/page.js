"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Same key used by your Image Input page
const IMAGE_STORAGE_KEY = "nishaanImage";

// Result page
const OUTPUT_ROUTE = "/image/result";

const FINISH_DELAY_MS = 1400;

const STEPS = [
  "Image received",
  "Extracting visual clues",
  "Identifying architecture",
  "Analyzing road structure",
  "Understanding user description",
  "Searching geographic database",
  "Comparing candidate locations",
  "Finding best match",
];

const STEP_DURATIONS = [650, 900, 1100, 1000, 850, 1500, 1400];

const SEARCH_MESSAGES = [
  "Reading your clue...",
  "Reading your clue...",
  "Cross-referencing landmarks...",
  "Cross-referencing landmarks...",
  "Parsing your description...",
  "Searching OpenStreetMap...",
  "Ranking candidate locations...",
  "Narrowing to the best match...",
];

export default function AnalyzingPage() {
  const router = useRouter();

  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);

  /*
   * Check that uploaded image exists.
   * The image itself is NOT displayed on this page.
   */
  useEffect(() => {
    try {
      const storedImage = sessionStorage.getItem(IMAGE_STORAGE_KEY);

      if (!storedImage) {
        router.replace("/image");
      }
    } catch (error) {
      console.warn("Could not read uploaded image:", error);
      router.replace("/image");
    }
  }, [router]);

  /*
   * Analysis progress
   */
  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    function scheduleNext(index) {
      if (cancelled) return;

      if (index >= STEP_DURATIONS.length) {
        timeoutId = setTimeout(() => {
          if (cancelled) return;

          /*
           * Temporary result.
           * Replace this object with your actual model/API result
           * when your backend is connected.
           */
          const result = {
            location: "Islamabad",
            country: "Pakistan",
            confidence: 86,
            clues: [
              "Road structure",
              "Building architecture",
              "Urban environment",
              "Electric poles pattern",
            ],
          };

          sessionStorage.setItem("nishaanImageResult", JSON.stringify(result));

          router.push(OUTPUT_ROUTE);
        }, FINISH_DELAY_MS);

        return;
      }

      timeoutId = setTimeout(() => {
        if (cancelled) return;

        const next = index + 1;

        setActiveStep(next);
        scheduleNext(next);
      }, STEP_DURATIONS[index]);
    }

    scheduleNext(0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [router]);

  /*
   * Animated globe
   */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;

    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const rand = (
      (seed) => () =>
        (seed = (seed * 9301 + 49297) % 233280) / 233280
    )(7);

    const blobs = [];

    for (let i = 0; i < 9; i++) {
      blobs.push({
        lat: (rand() * 2 - 1) * 1.3,
        lon: rand() * Math.PI * 2,
        r: 0.5 + rand() * 0.6,
      });
    }

    function angularDist(lat1, lon1, lat2, lon2) {
      const dLat = lat1 - lat2;

      const dLon = Math.atan2(Math.sin(lon1 - lon2), Math.cos(lon1 - lon2));

      return Math.sqrt(dLat * dLat + dLon * dLon);
    }

    function landDensity(lat, lon) {
      let best = 999;

      for (const b of blobs) {
        const d = angularDist(lat, lon, b.lat, b.lon) / b.r;

        if (d < best) best = d;
      }

      return best;
    }

    const points = [];
    const TOTAL_CANDIDATES = 2600;

    for (let i = 0; i < TOTAL_CANDIDATES; i++) {
      const u = rand();
      const v = rand();

      const lon = u * Math.PI * 2;
      const lat = Math.acos(2 * v - 1) - Math.PI / 2;

      const d = landDensity(lat, lon);

      if (d < 1) {
        if (rand() < 0.9) {
          points.push({
            lat,
            lon,
            bright: rand(),
          });
        }
      } else if (rand() < 0.015) {
        points.push({
          lat,
          lon,
          bright: rand() * 0.3,
        });
      }
    }

    const target = {
      lat: 0.55,
      lon: 0.9,
    };

    let rotation = 0;

    const ROTATION_SPEED = 0.6;

    let lastT = null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let size = 0;
    let rafId;

    function resize() {
      size = wrap.clientWidth;

      canvas.width = size * dpr;
      canvas.height = size * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const ro = new ResizeObserver(resize);

    ro.observe(wrap);

    window.addEventListener("resize", resize);

    function project(lat, lon, rot, R, cx, cy) {
      const cosLat = Math.cos(lat);

      const x0 = cosLat * Math.sin(lon + rot);
      const y0 = Math.sin(lat);
      const z0 = cosLat * Math.cos(lon + rot);

      return {
        x: cx + x0 * R,
        y: cy - y0 * R,
        z: z0,
        visible: z0 > -0.08,
      };
    }

    function drawGraticule(R, cx, cy, rot) {
      ctx.strokeStyle = "rgba(70,110,85,0.35)";
      ctx.lineWidth = Math.max(0.5, size * 0.0022);

      // Meridians
      for (let m = 0; m < 8; m++) {
        const lon0 = (m / 8) * Math.PI * 2;

        ctx.beginPath();

        let started = false;

        for (let s = 0; s <= 64; s++) {
          const lat = -Math.PI / 2 + (s / 64) * Math.PI;

          const p = project(lat, lon0, rot, R, cx, cy);

          if (p.z > -0.15) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }

        ctx.stroke();
      }

      // Parallels
      for (let p2 = 1; p2 < 4; p2++) {
        const lat = -Math.PI / 2 + (p2 / 4) * Math.PI;

        ctx.beginPath();

        let started = false;

        for (let s = 0; s <= 64; s++) {
          const lon = (s / 64) * Math.PI * 2;

          const p = project(lat, lon, rot, R, cx, cy);

          if (p.z > -0.15) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }

        ctx.stroke();
      }
    }

    function frame(t) {
      if (lastT === null) lastT = t;

      const dt = (t - lastT) / 1000;

      lastT = t;

      if (!reduceMotion) {
        rotation += dt * ROTATION_SPEED;
      }

      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.46;

      ctx.clearRect(0, 0, size, size);

      const grad = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.4,
        R * 0.1,
        cx,
        cy,
        R * 1.05,
      );

      grad.addColorStop(0, "#182a1f");
      grad.addColorStop(0.55, "#0e1813");
      grad.addColorStop(1, "#060a08");

      ctx.beginPath();

      ctx.arc(cx, cy, R, 0, Math.PI * 2);

      ctx.fillStyle = grad;

      ctx.fill();

      drawGraticule(R, cx, cy, rotation);

      const projected = points
        .map((p) => {
          const proj = project(p.lat, p.lon, rotation, R, cx, cy);

          return {
            ...proj,
            bright: p.bright,
          };
        })
        .filter((p) => p.visible)
        .sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const depth = (p.z + 1) / 2;

        const rad = Math.max(0.4, size * 0.006 * (0.5 + depth));

        const alpha = 0.15 + depth * 0.65 * (0.5 + p.bright * 0.5);

        ctx.beginPath();

        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);

        ctx.fillStyle =
          p.bright > 0.82
            ? `rgba(142,230,134,${alpha.toFixed(2)})`
            : `rgba(63,107,77,${alpha.toFixed(2)})`;

        ctx.fill();
      }

      ctx.beginPath();

      ctx.arc(cx, cy, R, 0, Math.PI * 2);

      ctx.lineWidth = Math.max(1, size * 0.006);

      ctx.strokeStyle = "rgba(70,120,90,0.5)";

      ctx.stroke();

      const tp = project(target.lat, target.lon, rotation, R, cx, cy);

      if (tp.z > -0.2) {
        const depth = (tp.z + 1) / 2;

        const glowR = size * 0.045 * (0.6 + depth * 0.5);

        const pulse = 0.75 + Math.sin(t / 180) * 0.25;

        const g = ctx.createRadialGradient(
          tp.x,
          tp.y,
          0,
          tp.x,
          tp.y,
          glowR * pulse * 2.2,
        );

        g.addColorStop(0, `rgba(234,255,176,${(0.9 * depth).toFixed(2)})`);

        g.addColorStop(0.4, `rgba(185,236,122,${(0.5 * depth).toFixed(2)})`);

        g.addColorStop(1, "rgba(185,236,122,0)");

        ctx.beginPath();

        ctx.arc(tp.x, tp.y, glowR * pulse * 2.2, 0, Math.PI * 2);

        ctx.fillStyle = g;

        ctx.fill();

        ctx.beginPath();

        ctx.arc(tp.x, tp.y, glowR * 0.4 * pulse, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(240,255,210,${depth.toFixed(2)})`;

        ctx.fill();
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);

      ro.disconnect();

      cancelAnimationFrame(rafId);
    };
  }, []);

  const searchMessage =
    SEARCH_MESSAGES[activeStep] ?? SEARCH_MESSAGES[SEARCH_MESSAGES.length - 1];

  return (
    <div className="screen">
      <div className="page">
        {/* MAIN ANALYZING CARD */}
        <div className="card">
          {/* Globe */}
          <div className="visual">
            <div className="globe-wrap" ref={wrapRef}>
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="content">
            <div>
              <div className="heading">
                <span className="brand">Nishaan</span> is analyzing your clue...
              </div>

              <div className="divider"></div>
            </div>

            {/* Steps */}
            <div className="steps">
              {STEPS.map((label, i) => {
                const status =
                  i < activeStep
                    ? "done"
                    : i === activeStep
                      ? "active"
                      : "pending";

                return (
                  <div className={`step ${status}`} key={label}>
                    <span className={`icon ${status}`}>
                      {status === "done" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </span>

                    {label}
                  </div>
                );
              })}
            </div>

            {/* SEARCH MESSAGE NOW INSIDE THE CARD */}
            <div className="search-bar">
              <span className="search-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>

                  <line x1="2" y1="12" x2="22" y2="12"></line>

                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>

              <div className="search-text">
                <div className="search-title">{searchMessage}</div>

                <div className="search-sub">This may take a few moments.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html,
        body {
          height: 100%;
          margin: 0;
          background: #060a08;
        }
      `}</style>

      <style jsx>{`
        .screen {
          min-height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            140% 100% at 50% 0%,
            #0c1512 0%,
            #060a08 60%
          );
          padding: clamp(16px, 4vw, 40px);
          box-sizing: border-box;
        }

        .page {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .card {
          width: 100%;
          box-sizing: border-box;
          background: radial-gradient(
            120% 120% at 15% 20%,
            #142219 0%,
            #101a16 55%
          );
          border: 1px solid #1f3a2e;
          border-radius: clamp(14px, 3vw, 20px);
          padding: clamp(18px, 4vw, 40px);
          display: flex;
          align-items: center;
          gap: clamp(20px, 5vw, 60px);
        }

        .visual {
          flex: 0 0 auto;
          position: relative;
        }

        .globe-wrap {
          width: clamp(150px, 32vw, 400px);
          height: clamp(150px, 32vw, 400px);
          position: relative;
          border-radius: 50%;
          background: radial-gradient(
            circle at 32% 28%,
            #16261c 0%,
            #0a120e 65%,
            #060a08 100%
          );
          box-shadow:
            inset 0 0 30px rgba(0, 0, 0, 0.65),
            0 0 40px rgba(120, 220, 140, 0.08);
        }

        .globe-wrap canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        @media (prefers-reduced-motion: reduce) {
          .globe-wrap canvas {
            display: none;
          }
        }

        .content {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .heading {
          font-size: clamp(20px, 3.6vw, 34px);
          font-weight: 600;
          line-height: 1.3;
          color: #eaf3ec;
        }

        .brand {
          color: #8ee686;
        }

        .divider {
          width: 46px;
          height: 2px;
          background: #4a7a54;
          border-radius: 2px;
          margin-top: 10px;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: clamp(13px, 2.2vw, 17px);
          line-height: 1.4;
          color: #5a6c62;
          transition: color 0.3s ease;
        }

        .step.done {
          color: #eaf3ec;
        }

        .step.active {
          color: #eaf3ec;
          font-weight: 600;
        }

        .icon {
          flex: 0 0 auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: flex-start;
          margin-top: 0.1em;
        }

        .icon.done {
          background: #1a2b22;
          color: #8ee686;
        }

        .icon.done svg {
          width: 12px;
          height: 12px;
        }

        .icon.active {
          border: 2px solid #8ee686;
          position: relative;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .icon.active::after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #8ee686;
        }

        @media (prefers-reduced-motion: reduce) {
          .icon.active {
            animation: none;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(142, 230, 134, 0.35);
          }

          50% {
            box-shadow: 0 0 0 5px rgba(142, 230, 134, 0);
          }
        }

        .icon.pending {
          border: 2px solid #2a3b32;
        }

        /* SEARCH MESSAGE INSIDE ANALYZING CARD */
        .search-bar {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 14px;
          background: #0d1512;
          border: 1px solid #1f3a2e;
          border-radius: 16px;
          padding: 14px 18px;
          margin-top: 2px;
        }

        .search-icon {
          flex: 0 0 auto;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #1a2b22;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8ee686;
        }

        .search-icon svg {
          width: 18px;
          height: 18px;
        }

        .search-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .search-title {
          font-size: clamp(13px, 2.6vw, 15px);
          font-weight: 600;
          color: #eaf3ec;
        }

        .search-sub {
          font-size: clamp(11px, 2.2vw, 13px);
          color: #5a6c62;
        }

        /* TABLET */
        @media (max-width: 800px) {
          .card {
            gap: 28px;
          }

          .globe-wrap {
            width: clamp(150px, 30vw, 260px);
            height: clamp(150px, 30vw, 260px);
          }
        }

        /* MOBILE */
        @media (max-width: 640px) {
          .screen {
            align-items: flex-start;
            padding-top: 20px;
            padding-bottom: 20px;
          }

          .card {
            flex-direction: column;
            align-items: stretch;
            gap: 24px;
          }

          .visual {
            align-self: center;
          }

          .globe-wrap {
            width: min(65vw, 230px);
            height: min(65vw, 230px);
          }

          .content {
            width: 100%;
          }

          .steps {
            gap: 10px;
          }

          .search-bar {
            padding: 13px 14px;
          }
        }

        /* SMALL MOBILE */
        @media (max-width: 420px) {
          .screen {
            padding: 14px;
          }

          .card {
            padding: 16px;
            border-radius: 14px;
          }

          .globe-wrap {
            width: min(60vw, 180px);
            height: min(60vw, 180px);
          }

          .heading {
            font-size: 20px;
          }

          .step {
            font-size: 13px;
          }

          .search-bar {
            gap: 10px;
            padding: 12px;
          }

          .search-icon {
            width: 30px;
            height: 30px;
          }

          .search-icon svg {
            width: 15px;
            height: 15px;
          }
        }

        @media (max-width: 340px) {
          .globe-wrap {
            width: min(55vw, 150px);
            height: min(55vw, 150px);
          }

          .search-bar {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
