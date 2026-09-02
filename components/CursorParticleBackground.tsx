"use client";

import { useEffect, useRef } from "react";

/**
 * CursorParticleBackground
 * -------------------------------------------------------------------------
 * Full-viewport, subtle, cursor-reactive particle/network background for
 * the Nishaan site. Pure Canvas + rAF, no external dependencies.
 *
 * Usage:
 *   <main>
 *     <CursorParticleBackground />
 *     <div className="relative z-10"> ...existing site... </div>
 *   </main>
 *
 * Notes:
 * - Renders behind content via position: fixed + pointer-events: none.
 * - Respects prefers-reduced-motion (renders a static, faint node field).
 * - Particle count / connection distance scale down on small screens.
 * - No React state updates in the animation loop (all mutable refs),
 *   so this never triggers component re-renders.
 */

// ---- Tunables --------------------------------------------------------
const COLOR_PARTICLE = "16, 122, 71"; // Nishaan green, as an RGB triplet
const COLOR_LINE = "16, 122, 71";
const COLOR_CURSOR_GLOW = "16, 122, 71";

const BASE_PARTICLE_AREA = 22000; // 1 particle per N px^2 of viewport (desktop)
const MOBILE_PARTICLE_AREA = 38000; // sparser on small screens
const MAX_PARTICLES_DESKTOP = 140;
const MAX_PARTICLES_MOBILE = 60;

const CONNECT_DIST = 120; // px, base max distance to draw a connection
const CONNECT_DIST_MOBILE = 90;

const CURSOR_RADIUS = 160; // px, radius of magnetic + glow influence
const CURSOR_FORCE = 0.055; // attraction strength toward cursor
const RETURN_FORCE = 0.02; // strength pulling particles back to drift path
const DAMPING = 0.9; // velocity damping each frame
const DRIFT_SPEED = 0.15; // base ambient drift speed

const PACKET_SPAWN_CHANCE = 0.01; // per-frame chance to spawn a data packet near cursor
const MAX_PACKETS = 4;

// -----------------------------------------------------------------------

interface Particle {
  // "home" is the ambient drift anchor; x/y is actual rendered position
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  driftAngle: number;
  driftSpeed: number;
  radius: number;
}

interface DataPacket {
  fromIndex: number;
  toIndex: number;
  t: number; // 0..1 progress along the line
  speed: number;
}

export default function CursorParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: Particle[] = [];
    let packets: DataPacket[] = [];

    // Cursor state. Off-screen initially so nothing reacts until moved.
    const cursor = {
      x: -9999,
      y: -9999,
      active: false,
      // eased/lagged glow position for a softer feel
      glowX: -9999,
      glowY: -9999,
      glowAlpha: 0,
    };

    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    function isMobileViewport() {
      return width < 768;
    }

    function particleBudget() {
      const mobile = isMobileViewport();
      const area = width * height;
      const perArea = mobile ? MOBILE_PARTICLE_AREA : BASE_PARTICLE_AREA;
      const max = mobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
      return Math.max(20, Math.min(max, Math.floor(area / perArea)));
    }

    function makeParticle(): Particle {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        homeX: x,
        homeY: y,
        x,
        y,
        vx: 0,
        vy: 0,
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: DRIFT_SPEED * (0.5 + Math.random()),
        radius: 1 + Math.random() * 1.2,
      };
    }

    function buildParticles() {
      const count = particleBudget();
      particles = Array.from({ length: count }, makeParticle);
      packets = [];
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function onPointerMove(e: PointerEvent) {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.active = true;
    }

    function onPointerLeave() {
      cursor.active = false;
      cursor.x = -9999;
      cursor.y = -9999;
    }

    // On touch devices we intentionally do NOT wire up magnetic drag —
    // spec calls for cursor interaction to be disabled/replaced on mobile.
    if (!isTouchDevice) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, {
        passive: true,
      });
      window.addEventListener("blur", onPointerLeave);
    }

    window.addEventListener("resize", resize);
    resize();

    // --- Reduced motion: draw a single static, faint frame and stop. ----
    if (prefersReducedMotion) {
      drawStatic();
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = `rgba(${COLOR_PARTICLE}, 0.18)`;
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // --- Animation loop ---------------------------------------------------
    let rafId = 0;
    let lastTime = performance.now();

    function step(now: number) {
      const dt = Math.min(32, now - lastTime) / 16.67; // normalize to ~60fps units
      lastTime = now;

      const connectDist = isMobileViewport()
        ? CONNECT_DIST_MOBILE
        : CONNECT_DIST;
      const cursorActive = cursor.active && !isTouchDevice;

      // Ease the visual glow position toward the real cursor for smoothness.
      cursor.glowX += (cursor.x - cursor.glowX) * 0.15;
      cursor.glowY += (cursor.y - cursor.glowY) * 0.15;
      cursor.glowAlpha += ((cursorActive ? 1 : 0) - cursor.glowAlpha) * 0.08;

      ctx!.clearRect(0, 0, width, height);

      // Update particles
      for (const p of particles) {
        // Ambient drift: home point wanders slowly.
        p.driftAngle += 0.002 * dt * (0.5 + Math.random() * 0.5);
        p.homeX += Math.cos(p.driftAngle) * p.driftSpeed * dt;
        p.homeY += Math.sin(p.driftAngle) * p.driftSpeed * dt;

        // Wrap home position within viewport with margin.
        if (p.homeX < -20) p.homeX = width + 20;
        if (p.homeX > width + 20) p.homeX = -20;
        if (p.homeY < -20) p.homeY = height + 20;
        if (p.homeY > height + 20) p.homeY = -20;

        // Return force toward home (ambient path).
        p.vx += (p.homeX - p.x) * RETURN_FORCE * dt;
        p.vy += (p.homeY - p.y) * RETURN_FORCE * dt;

        // Cursor magnetic attraction, falls off with distance.
        if (cursorActive) {
          const dx = cursor.x - p.x;
          const dy = cursor.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS && dist > 0.01) {
            const strength = (1 - dist / CURSOR_RADIUS) ** 2 * CURSOR_FORCE;
            p.vx += dx * strength * dt;
            p.vy += dy * strength * dt;
          }
        }

        // Damping + integrate.
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      // Connections between nearby particles.
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            let alpha = (1 - dist / connectDist) * 0.16;

            // Slight boost near an active cursor.
            if (cursorActive) {
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const cdx = cursor.x - midX;
              const cdy = cursor.y - midY;
              const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
              if (cdist < CURSOR_RADIUS) {
                alpha += (1 - cdist / CURSOR_RADIUS) * 0.16;
              }
            }

            ctx!.strokeStyle = `rgba(${COLOR_LINE}, ${Math.min(alpha, 0.32)})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();

            // Occasionally spawn a subtle data packet on a connection near the cursor.
            if (
              cursorActive &&
              packets.length < MAX_PACKETS &&
              Math.random() < PACKET_SPAWN_CHANCE
            ) {
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const cdx = cursor.x - midX;
              const cdy = cursor.y - midY;
              const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
              if (cdist < CURSOR_RADIUS) {
                packets.push({
                  fromIndex: i,
                  toIndex: j,
                  t: 0,
                  speed: 0.012 + Math.random() * 0.01,
                });
              }
            }
          }
        }
      }

      // Draw particles.
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${COLOR_PARTICLE}, 0.45)`;
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Draw + advance data packets (tiny dots traveling along connections).
      packets = packets.filter((pk) => pk.t < 1);
      for (const pk of packets) {
        const a = particles[pk.fromIndex];
        const b = particles[pk.toIndex];
        if (!a || !b) {
          pk.t = 1;
          continue;
        }
        pk.t += pk.speed * dt;
        const x = a.x + (b.x - a.x) * pk.t;
        const y = a.y + (b.y - a.y) * pk.t;
        const fade = Math.sin(Math.PI * pk.t); // fade in/out along path
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${COLOR_PARTICLE}, ${0.5 * fade})`;
        ctx!.arc(x, y, 1.3, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Faint cursor influence glow.
      if (cursor.glowAlpha > 0.01) {
        const gradient = ctx!.createRadialGradient(
          cursor.glowX,
          cursor.glowY,
          0,
          cursor.glowX,
          cursor.glowY,
          CURSOR_RADIUS,
        );
        gradient.addColorStop(
          0,
          `rgba(${COLOR_CURSOR_GLOW}, ${0.05 * cursor.glowAlpha})`,
        );
        gradient.addColorStop(1, `rgba(${COLOR_CURSOR_GLOW}, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(cursor.glowX, cursor.glowY, CURSOR_RADIUS, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (!isTouchDevice) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("blur", onPointerLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] h-screen w-screen"
      style={{ display: "block" }}
    />
  );
}
