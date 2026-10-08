"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "./gsap";

interface SplitHeadingProps {
  text: string;
  tag?: "h1" | "h2" | "p" | "span";
  className?: string;
  style?: CSSProperties;
  /** ms between characters (25–45 by spec). */
  stagger?: number;
  duration?: number;
  delay?: number;
  /** Animate on mount instead of on scroll. Used in the hero. */
  immediate?: boolean;
  /** Keep the character spans after the entrance so CSS can react to hover. */
  keepChars?: boolean;
  id?: string;
}

/**
 * Character entrance for short Latin titles only. Adapted from React Bits'
 * Split Text: same GSAP SplitText approach, without the per-prop re-splitting,
 * with brand timing and a reduced-motion bypass. Never used on Korean body copy.
 */
export function SplitHeading({
  text,
  tag = "h2",
  className,
  style,
  stagger = 32,
  duration = 0.8,
  delay = 0,
  immediate = false,
  keepChars = false,
  id,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !fontsReady) return;
      const reduced = prefersReducedMotion();
      if (reduced && !keepChars) return;

      const split = new SplitText(el, { type: "chars", charsClass: "split-char", aria: "hidden" });
      if (reduced) return () => split.revert();

      const tween = gsap.fromTo(
        split.chars,
        { yPercent: 60, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration,
          delay,
          ease: "power3.out",
          stagger: stagger / 1000,
          force3D: true,
          clearProps: keepChars ? "transform,opacity,visibility" : undefined,
          ...(immediate ? {} : { scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
          onComplete: () => {
            if (!keepChars) split.revert();
          },
        },
      );

      return () => {
        tween.kill();
        split.revert();
      };
    },
    { dependencies: [fontsReady], scope: ref },
  );

  const Tag = tag;
  return (
    <Tag ref={ref as never} className={className} style={{ ...style, display: "block" }} id={id} aria-label={text}>
      {text}
    </Tag>
  );
}
