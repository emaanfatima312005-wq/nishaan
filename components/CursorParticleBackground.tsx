"use client";

import { useEffect, useRef } from "react";

/**
 * CursorParticleBackground
 * -------------------------------------------------------------------------
 * Full-viewport, subtle, cursor-reactive particle/network background
 * for the Nishaan site.
 *
 * Features:
 * - Floating green particles
 * - Connecting network lines
 * - Cursor magnetic interaction
 * - Cursor glow
 * - Traveling data packets
 * - Responsive particle count
 * - Touch-device optimization
 * - Reduced-motion support
 * - No external dependencies
 */

// -------------------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------------------

const COLOR_PARTICLE = "16, 122, 71";
const COLOR_LINE = "16, 122, 71";
const COLOR_CURSOR_GLOW = "16, 122, 71";

const BASE_PARTICLE_AREA = 22000;
const MOBILE_PARTICLE_AREA = 38000;

const MAX_PARTICLES_DESKTOP = 140;
const MAX_PARTICLES_MOBILE = 60;

const CONNECT_DIST = 120;
const CONNECT_DIST_MOBILE = 90;

const CURSOR_RADIUS = 160;
const CURSOR_FORCE = 0.055;
const RETURN_FORCE = 0.02;
const DAMPING = 0.9;
const DRIFT_SPEED = 0.15;

const PACKET_SPAWN_CHANCE = 0.01;
const MAX_PACKETS = 4;

// -------------------------------------------------------------------------
// TYPES
// -------------------------------------------------------------------------

interface Particle {
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
  t: number;
  speed: number;
}

// -------------------------------------------------------------------------
// COMPONENT
// -------------------------------------------------------------------------

export default function CursorParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    // ---------------------------------------------------------------------
    // SETTINGS
    // ---------------------------------------------------------------------

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // ---------------------------------------------------------------------
    // CANVAS STATE
    // ---------------------------------------------------------------------

    let width = 0;
    let height = 0;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: Particle[] = [];
    let packets: DataPacket[] = [];

    // ---------------------------------------------------------------------
    // CURSOR STATE
    // ---------------------------------------------------------------------

    const cursor = {
      x: -9999,
      y: -9999,

      active: false,

      // Smoothed cursor position for the glow
      glowX: -9999,
      glowY: -9999,

      glowAlpha: 0,
    };

    // ---------------------------------------------------------------------
    // RESPONSIVE HELPERS
    // ---------------------------------------------------------------------

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

    // ---------------------------------------------------------------------
    // CREATE PARTICLE
    // ---------------------------------------------------------------------

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

    // ---------------------------------------------------------------------
    // BUILD PARTICLES
    // ---------------------------------------------------------------------

    function buildParticles() {
      const count = particleBudget();

      particles = Array.from({ length: count }, makeParticle);

      packets = [];
    }

    // ---------------------------------------------------------------------
    // RESIZE CANVAS
    // ---------------------------------------------------------------------

    function resize() {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildParticles();
    }

    // ---------------------------------------------------------------------
    // POINTER EVENTS
    // ---------------------------------------------------------------------

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

    // ---------------------------------------------------------------------
    // STATIC DRAWING
    // ---------------------------------------------------------------------

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = `rgba(${COLOR_PARTICLE}, 0.18)`;

      for (const particle of particles) {
        ctx.beginPath();

        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        ctx.fill();
      }
    }

    // ---------------------------------------------------------------------
    // EVENT LISTENERS
    // ---------------------------------------------------------------------

    if (!isTouchDevice) {
      window.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });

      window.addEventListener("pointerleave", onPointerLeave, {
        passive: true,
      });

      window.addEventListener("blur", onPointerLeave);
    }

    window.addEventListener("resize", resize);

    // Initial setup
    resize();

    // ---------------------------------------------------------------------
    // REDUCED MOTION
    // ---------------------------------------------------------------------

    if (prefersReducedMotion) {
      drawStatic();

      return () => {
        window.removeEventListener("resize", resize);

        if (!isTouchDevice) {
          window.removeEventListener("pointermove", onPointerMove);

          window.removeEventListener("pointerleave", onPointerLeave);

          window.removeEventListener("blur", onPointerLeave);
        }
      };
    }

    // ---------------------------------------------------------------------
    // ANIMATION LOOP
    // ---------------------------------------------------------------------

    let rafId = 0;

    let lastTime = performance.now();

    function step(now: number) {
      const dt = Math.min(32, now - lastTime) / 16.67;

      lastTime = now;

      const connectDist = isMobileViewport()
        ? CONNECT_DIST_MOBILE
        : CONNECT_DIST;

      const cursorActive = cursor.active && !isTouchDevice;

      // ---------------------------------------------------------------
      // CURSOR GLOW
      // ---------------------------------------------------------------

      cursor.glowX += (cursor.x - cursor.glowX) * 0.15;

      cursor.glowY += (cursor.y - cursor.glowY) * 0.15;

      cursor.glowAlpha += ((cursorActive ? 1 : 0) - cursor.glowAlpha) * 0.08;

      // ---------------------------------------------------------------
      // CLEAR CANVAS
      // ---------------------------------------------------------------

      ctx.clearRect(0, 0, width, height);

      // ---------------------------------------------------------------
      // UPDATE PARTICLES
      // ---------------------------------------------------------------

      for (const particle of particles) {
        // Ambient movement
        particle.driftAngle += 0.002 * dt * (0.5 + Math.random() * 0.5);

        particle.homeX +=
          Math.cos(particle.driftAngle) * particle.driftSpeed * dt;

        particle.homeY +=
          Math.sin(particle.driftAngle) * particle.driftSpeed * dt;

        // Wrap horizontal position
        if (particle.homeX < -20) {
          particle.homeX = width + 20;
        }

        if (particle.homeX > width + 20) {
          particle.homeX = -20;
        }

        // Wrap vertical position
        if (particle.homeY < -20) {
          particle.homeY = height + 20;
        }

        if (particle.homeY > height + 20) {
          particle.homeY = -20;
        }

        // -------------------------------------------------------------
        // RETURN FORCE
        // -------------------------------------------------------------

        particle.vx += (particle.homeX - particle.x) * RETURN_FORCE * dt;

        particle.vy += (particle.homeY - particle.y) * RETURN_FORCE * dt;

        // -------------------------------------------------------------
        // CURSOR MAGNETIC FORCE
        // -------------------------------------------------------------

        if (cursorActive) {
          const dx = cursor.x - particle.x;

          const dy = cursor.y - particle.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CURSOR_RADIUS && distance > 0.01) {
            const strength = (1 - distance / CURSOR_RADIUS) ** 2 * CURSOR_FORCE;

            particle.vx += dx * strength * dt;

            particle.vy += dy * strength * dt;
          }
        }

        // -------------------------------------------------------------
        // DAMPING
        // -------------------------------------------------------------

        particle.vx *= DAMPING;
        particle.vy *= DAMPING;

        // -------------------------------------------------------------
        // MOVE PARTICLE
        // -------------------------------------------------------------

        particle.x += particle.vx * dt;

        particle.y += particle.vy * dt;
      }

      // -----------------------------------------------------------------
      // DRAW CONNECTIONS
      // -----------------------------------------------------------------

      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];

          const dx = a.x - b.x;

          const dy = a.y - b.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectDist) {
            let alpha = (1 - distance / connectDist) * 0.16;

            // Boost connections near cursor
            if (cursorActive) {
              const midX = (a.x + b.x) / 2;

              const midY = (a.y + b.y) / 2;

              const cursorDx = cursor.x - midX;

              const cursorDy = cursor.y - midY;

              const cursorDistance = Math.sqrt(
                cursorDx * cursorDx + cursorDy * cursorDy,
              );

              if (cursorDistance < CURSOR_RADIUS) {
                alpha += (1 - cursorDistance / CURSOR_RADIUS) * 0.16;
              }
            }

            // Draw line
            ctx.strokeStyle = `rgba(${COLOR_LINE}, ${Math.min(alpha, 0.32)})`;

            ctx.beginPath();

            ctx.moveTo(a.x, a.y);

            ctx.lineTo(b.x, b.y);

            ctx.stroke();

            // ---------------------------------------------------------
            // SPAWN DATA PACKET
            // ---------------------------------------------------------

            if (
              cursorActive &&
              packets.length < MAX_PACKETS &&
              Math.random() < PACKET_SPAWN_CHANCE
            ) {
              const midX = (a.x + b.x) / 2;

              const midY = (a.y + b.y) / 2;

              const cursorDx = cursor.x - midX;

              const cursorDy = cursor.y - midY;

              const cursorDistance = Math.sqrt(
                cursorDx * cursorDx + cursorDy * cursorDy,
              );

              if (cursorDistance < CURSOR_RADIUS) {
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

      // -----------------------------------------------------------------
      // DRAW PARTICLES
      // -----------------------------------------------------------------

      for (const particle of particles) {
        ctx.beginPath();

        ctx.fillStyle = `rgba(${COLOR_PARTICLE}, 0.45)`;

        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        ctx.fill();
      }

      // -----------------------------------------------------------------
      // DRAW DATA PACKETS
      // -----------------------------------------------------------------

      packets = packets.filter((packet) => packet.t < 1);

      for (const packet of packets) {
        const a = particles[packet.fromIndex];

        const b = particles[packet.toIndex];

        if (!a || !b) {
          packet.t = 1;
          continue;
        }

        packet.t += packet.speed * dt;

        const x = a.x + (b.x - a.x) * packet.t;

        const y = a.y + (b.y - a.y) * packet.t;

        const fade = Math.sin(Math.PI * packet.t);

        ctx.beginPath();

        ctx.fillStyle = `rgba(${COLOR_PARTICLE}, ${0.5 * fade})`;

        ctx.arc(x, y, 1.3, 0, Math.PI * 2);

        ctx.fill();
      }

      // -----------------------------------------------------------------
      // CURSOR GLOW
      // -----------------------------------------------------------------

      if (cursor.glowAlpha > 0.01) {
        const gradient = ctx.createRadialGradient(
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

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(cursor.glowX, cursor.glowY, CURSOR_RADIUS, 0, Math.PI * 2);

        ctx.fill();
      }

      // -----------------------------------------------------------------
      // NEXT FRAME
      // -----------------------------------------------------------------

      rafId = requestAnimationFrame(step);
    }

    // Start animation
    rafId = requestAnimationFrame(step);

    // ---------------------------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------------------------

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

  // -----------------------------------------------------------------------
  // CANVAS
  // -----------------------------------------------------------------------

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] h-screen w-screen"
      style={{
        display: "block",
      }}
    />
  );
}
