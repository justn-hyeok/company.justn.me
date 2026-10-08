"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** True when the visitor asked for reduced motion. False during SSR. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

const TOUCH = "(hover: none), (pointer: coarse)";

function subscribeTouch(callback: () => void) {
  const mql = window.matchMedia(TOUCH);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** True on devices without hover (touch screens). False during SSR. */
export function useTouchDevice(): boolean {
  return useSyncExternalStore(
    subscribeTouch,
    () => window.matchMedia(TOUCH).matches,
    () => false,
  );
}
