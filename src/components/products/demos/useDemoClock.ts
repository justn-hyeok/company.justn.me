"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/**
 * A tick counter that only advances while the element is on screen, the tab
 * is visible, and the visitor has not asked for reduced motion. Demos use it
 * so nothing animates off screen.
 */
export function useDemoClock<T extends HTMLElement>(intervalMs: number, paused = false) {
  const ref = useRef<T>(null);
  const [tick, setTick] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || paused) return;
    let timer: number | undefined;
    let visible = false;

    const start = () => {
      if (timer === undefined && visible && document.visibilityState === "visible") {
        timer = window.setInterval(() => setTick((t) => t + 1), intervalMs);
      }
    };
    const stop = () => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(el);
    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, paused, reduced]);

  return { ref, tick, reduced };
}
