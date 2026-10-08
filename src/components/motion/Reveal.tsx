"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "./gsap";

interface RevealProps {
  children: ReactNode;
  as?: "div" | "section" | "li" | "article" | "span";
  className?: string;
  style?: CSSProperties;
  /** Distance in px the element travels in (12–24 by spec). */
  y?: number;
  /** Seconds. Section entries are 0.5–0.8s by spec. */
  duration?: number;
  delay?: number;
  /** Selector for children to stagger instead of animating the wrapper. */
  stagger?: string;
  staggerEach?: number;
  start?: string;
  id?: string;
}

/**
 * Scroll-triggered entrance. The content is rendered visible in the DOM and
 * only hidden by GSAP right before it animates in, so it stays readable if
 * JavaScript never runs. Runs once per element.
 */
export function Reveal({
  children,
  as = "div",
  className,
  style,
  y = 18,
  duration = 0.65,
  delay = 0,
  stagger,
  staggerEach = 0.07,
  start = "top 85%",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const targets = stagger ? Array.from(el.querySelectorAll<HTMLElement>(stagger)) : [el];
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger ? staggerEach : 0,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    },
    { scope: ref },
  );

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className} style={style} data-reveal id={id}>
      {children}
    </Tag>
  );
}
