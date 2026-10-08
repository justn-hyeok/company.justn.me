"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Gentle pull toward the pointer for a single CTA (a few pixels, mouse only).
 * Used on two buttons in total, never globally.
 */
export function Magnetic({ children, strength = 0.18, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
    el.style.transition = "transform 120ms linear";
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 420ms var(--ease-spring)";
    el.style.transform = "translate(0, 0)";
  };

  return (
    <div ref={ref} className={`inline-block ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
