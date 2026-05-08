"use client";

import { useEffect, useRef } from "react";

interface Orb {
  cx: number; cy: number;
  ax: number; ay: number;
  fx: number; fy: number;
  phase: number;
  r: number; g: number; b: number;
  a: number; sz: number;
}

const ORBS: Orb[] = [
  { cx: 0.25, cy: 0.40, ax: 0.20, ay: 0.18, fx: 0.52, fy: 0.68, phase: 0,    r: 16,  g: 185, b: 129, a: 0.38, sz: 0.70 },
  { cx: 0.78, cy: 0.58, ax: 0.18, ay: 0.22, fx: 0.44, fy: 0.73, phase: 2.09, r: 5,   g: 150, b: 105, a: 0.30, sz: 0.60 },
  { cx: 0.52, cy: 0.15, ax: 0.26, ay: 0.18, fx: 0.77, fy: 0.58, phase: 4.19, r: 52,  g: 211, b: 153, a: 0.25, sz: 0.55 },
  { cx: 0.14, cy: 0.72, ax: 0.16, ay: 0.23, fx: 0.63, fy: 0.49, phase: 1.05, r: 20,  g: 184, b: 166, a: 0.20, sz: 0.45 },
];

const COLORS: readonly [number, number, number][] = [
  [163, 230,  53],  // lime-400
  [ 52, 211, 153],  // emerald-400
  [ 16, 185, 129],  // emerald-500
  [ 74, 222, 128],  // green-400
  [134, 239, 172],  // green-300
  [ 20, 184, 166],  // teal-500
  [217, 249, 157],  // lime-200 (occasional pale flash)
];

const FF_COUNT = 85;

interface Firefly {
  x: number; y: number;
  vx: number; vy: number;
  col: readonly [number, number, number];
  size: number;
  phase: number;
  freq: number;
  baseAlpha: number;
}

function makeFirefly(W: number, H: number): Firefly {
  const angle = Math.random() * Math.PI * 2;
  const spd   = 0.06 + Math.random() * 0.18;
  return {
    x:         Math.random() * W,
    y:         Math.random() * H,
    vx:        Math.cos(angle) * spd,
    vy:        Math.sin(angle) * spd,
    col:       COLORS[Math.floor(Math.random() * COLORS.length)],
    size:      1.0 + Math.random() * 2.2,
    phase:     Math.random() * Math.PI * 2,
    freq:      1.0 + Math.random() * 2.0,   // pulse period 3–9 s at 60 fps
    baseAlpha: 0.45 + Math.random() * 0.55,
  };
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ts = reduced ? 0 : 1; // time-scale: 0 freezes everything

    let raf: number;
    let t = 0;

    const onResize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    const ffs: Firefly[] = Array.from(
      { length: FF_COUNT },
      () => makeFirefly(canvas.width, canvas.height),
    );

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }

      // ── background ──────────────────────────────────────────────────────────
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#030a06";
      ctx.fillRect(0, 0, W, H);

      // ── aurora blobs ─────────────────────────────────────────────────────────
      ctx.globalCompositeOperation = "screen";
      for (const o of ORBS) {
        const x  = (o.cx + Math.sin(t * o.fx + o.phase) * o.ax) * W;
        const y  = (o.cy + Math.cos(t * o.fy + o.phase) * o.ay) * H;
        const sz = o.sz * (1 + 0.06 * Math.sin(t * 0.25 + o.phase));
        const R  = sz * Math.min(W, H);
        const g  = ctx.createRadialGradient(x, y, 0, x, y, R);
        g.addColorStop(0,    `rgba(${o.r},${o.g},${o.b},${o.a})`);
        g.addColorStop(0.45, `rgba(${o.r},${o.g},${o.b},${+(o.a * 0.22).toFixed(3)})`);
        g.addColorStop(1,    `rgba(${o.r},${o.g},${o.b},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── fireflies ────────────────────────────────────────────────────────────
      for (const ff of ffs) {
        // drift + brownian wobble
        ff.x  += ff.vx * ts;
        ff.y  += ff.vy * ts;
        ff.vx += (Math.random() - 0.5) * 0.010 * ts;
        ff.vy += (Math.random() - 0.5) * 0.010 * ts;
        // keep speed bounded
        const spd = Math.sqrt(ff.vx * ff.vx + ff.vy * ff.vy);
        if (spd > 0.28) { ff.vx = (ff.vx / spd) * 0.28; ff.vy = (ff.vy / spd) * 0.28; }
        // wrap edges
        if (ff.x < -30) ff.x = W + 30;
        else if (ff.x > W + 30) ff.x = -30;
        if (ff.y < -30) ff.y = H + 30;
        else if (ff.y > H + 30) ff.y = -30;

        // pulse opacity
        const pulse = 0.5 + 0.5 * Math.sin(t * ff.freq + ff.phase);
        const a = ff.baseAlpha * pulse;
        if (a < 0.03) continue;

        const [r, g, b] = ff.col;

        // soft glow
        const glowR = ff.size * 14;
        const grd   = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, glowR);
        grd.addColorStop(0,   `rgba(${r},${g},${b},${(a * 0.85).toFixed(3)})`);
        grd.addColorStop(0.3, `rgba(${r},${g},${b},${(a * 0.25).toFixed(3)})`);
        grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // bright core
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a * 1.6, 1).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── vignette ─────────────────────────────────────────────────────────────
      ctx.globalCompositeOperation = "source-over";
      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
      vig.addColorStop(0,    "rgba(3,10,6,0)");
      vig.addColorStop(0.55, "rgba(3,10,6,0.12)");
      vig.addColorStop(1,    "rgba(3,10,6,0.88)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t += 0.018 * ts;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 w-screen h-screen z-[1]"
    />
  );
}
