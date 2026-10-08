"use client";

import { useRef } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/motion/gsap";
import { Reveal } from "@/components/motion/Reveal";

/** Deliberately quiet: wide margins, one large statement, one paragraph,
 *  hairlines. The only motion is the paragraph brightening word by word as
 *  the reader scrolls through it. Words are plain spans in the HTML. */
export function Philosophy({ dict }: { dict: Dictionary }) {
  const { approach, sections } = dict;
  const ref = useRef<HTMLDivElement>(null);
  const words = approach.body.split(" ");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".scrub-word",
        { opacity: 0.45 },
        { opacity: 1, ease: "none", stagger: 0.02, scrollTrigger: { trigger: "[data-scrub]", start: "top 78%", end: "bottom 45%", scrub: 0.5 } },
      );
    },
    { scope: ref },
  );

  return (
    <section id="approach" className="section scroll-mt-16 border-t border-border" aria-labelledby="approach-title">
      <div ref={ref} className="container">
        <Reveal className="grid-12 gap-y-10">
          <p className="index col-span-12 lg:col-span-2">{sections.approach.index}</p>
          <div className="col-span-12 lg:col-span-9 lg:col-start-3">
            <h2 id="approach-title" className="h-statement pre-line max-w-[22ch] text-text">
              {approach.headline}
            </h2>
            <p data-scrub className="mt-10 max-w-[62ch] text-[17px] leading-[1.75] text-text md:mt-14 md:text-[19px]">
              {words.map((w, i) => (
                <span key={i} className="scrub-word">
                  {w}{" "}
                </span>
              ))}
            </p>
            <ol className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6 md:mt-16">
              {approach.principles.map((p, i) => (
                <li key={p} className="group flex items-baseline gap-3">
                  <span className="mono text-[12px] text-text-3 transition-colors group-hover:text-accent" style={{ transitionDuration: "var(--t-feedback)" }}>0{i + 1}</span>
                  <span className="link-ul text-[16px] text-text">{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
