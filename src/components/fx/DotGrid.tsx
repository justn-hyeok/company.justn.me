"use client";

import { useEffect, useRef } from "react";

interface DotGridProps {
  className?: string;
  gap?: number;
  dotSize?: number;
  /** Radius around the pointer where dots brighten. */
  proximity?: number;
  baseColor?: string;
  activeColor?: string;
  maxAlpha?: number;
  /** Click/tap sends a ring outward that pushes dots and springs them back. */
  ripple?: boolean;
}

interface Dot {
  x: number;
  y: number;
  a: number;
  ox: number; // offset from rest
  oy: number;
  vx: number;
  vy: number;
}

/**
 * Low-contrast pointer-reactive dot grid with a tap ripple. Adapted from
 * React Bits' Dot Grid: proximity brightening kept, the inertia plugin
 * replaced by a tiny spring so there is no extra dependency, and drawing only
 * while something is moving. Decorative: hidden from assistive tech.
 */
export function DotGrid({
  className,
  gap = 26,
  dotSize = 1.6,
  proximity = 140,
  baseColor = "#132a20",
  activeColor = "#2ef2a8",
  maxAlpha = 0.9,
  ripple = true,
}: DotGridProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let raf = 0;
    let visible = true;
    let last = 0;
    const pointer = { x: -9999, y: -9999, inside: false };
    const proxSq = proximity * proximity;

    const build = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const next: Dot[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) next.push({ x: c * gap, y: r * gap, a: 0, ox: 0, oy: 0, vx: 0, vy: 0 });
      }
      dots = next;
    };

    const draw = (now: number) => {
      raf = 0;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      let moving = false;

      for (const d of dots) {
        // spring back to rest
        if (d.ox || d.oy || d.vx || d.vy) {
          const k = 60;
          const damp = 7;
          d.vx += (-k * d.ox - damp * d.vx) * dt;
          d.vy += (-k * d.oy - damp * d.vy) * dt;
          d.ox += d.vx * dt;
          d.oy += d.vy * dt;
          if (Math.abs(d.ox) < 0.05 && Math.abs(d.oy) < 0.05 && Math.abs(d.vx) < 0.5 && Math.abs(d.vy) < 0.5) {
            d.ox = d.oy = d.vx = d.vy = 0;
          } else moving = true;
        }
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dsq = dx * dx + dy * dy;
        const target = pointer.inside && dsq < proxSq && !reduced ? (1 - Math.sqrt(dsq) / proximity) * maxAlpha : 0;
        d.a += (target - d.a) * 0.18;
        if (Math.abs(target - d.a) > 0.005) moving = true;

        ctx.beginPath();
        ctx.arc(d.x + d.ox, d.y + d.oy, dotSize, 0, Math.PI * 2);
        const lit = Math.max(d.a, Math.min(1, Math.hypot(d.ox, d.oy) / 10));
        if (lit > 0.01) {
          ctx.fillStyle = activeColor;
          ctx.globalAlpha = 0.25 + lit * 0.75;
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = baseColor;
          ctx.fill();
        }
      }
      if (moving && visible) raf = requestAnimationFrame(draw);
      else last = 0;
    };

    const schedule = () => {
      if (!raf && visible) raf = requestAnimationFrame(draw);
    };

    build();
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      build();
      schedule();
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    io.observe(wrap);

    const local = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.inside = true;
      schedule();
    };
    const onLeave = () => {
      pointer.inside = false;
      schedule();
    };
    const onDown = (e: PointerEvent) => {
      if (!ripple || reduced) return;
      const p = local(e);
      const radius = 220;
      for (const d of dots) {
        const dx = d.x - p.x;
        const dy = d.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < radius) {
          const f = (1 - dist / radius) * 260;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }
      }
      schedule();
    };
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) schedule();
    };

    // Listen on the parent section so interactive children keep working
    // while the whole area still ripples on tap.
    const host = wrap.parentElement ?? wrap;
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [activeColor, baseColor, dotSize, gap, maxAlpha, proximity, ripple]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
    </div>
  );
}
