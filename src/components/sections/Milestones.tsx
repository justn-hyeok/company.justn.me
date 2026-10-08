"use client";

import { useRef, useState } from "react";
import { milestones } from "@/content/milestones";
import { productById } from "@/content/products";
import type { Dictionary } from "@/i18n/dictionaries";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/motion/gsap";
import { SectionHeading } from "@/components/layout/SectionHeading";

export function Milestones({ dict, locale }: { dict: Dictionary; locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(milestones[0].id);
  const dateFmt = new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });

  // Progress line scrubs with scroll; rows enter once with a small lift.
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-progress]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 60%", scrub: 0.4 } },
      );
      gsap.fromTo(
        "[data-row]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, clearProps: "transform", scrollTrigger: { trigger: root, start: "top 80%", once: true } },
      );
    },
    { scope: ref },
  );

  return (
    <section id="milestones" className="section scroll-mt-16 border-t border-border" aria-labelledby="milestones-title">
      <div className="container">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <SectionHeading index={dict.sections.milestones.index} title={dict.sections.milestones.title} titleId="milestones-title" />
            <p className="mt-5 max-w-[62ch] text-[14.5px] leading-relaxed text-text-2">{dict.milestones.lede}</p>
          </div>

          <div ref={ref} className="relative col-span-12 border-t border-border-strong">
            <div data-progress className="pointer-events-none absolute bottom-0 left-0 top-0 w-px origin-top bg-accent-dim" aria-hidden="true" />

            <ol className="flex flex-col">
              {milestones.map((m) => {
                const copy = dict.milestones.items[m.id];
                const isActive = active === m.id;
                const productName = m.product === "studio" ? "Justn" : productById[m.product].name;
                return (
                  <li key={m.id} data-row data-active={isActive} className="ms-row" onMouseEnter={() => setActive(m.id)}>
                    <button
                      type="button"
                      onClick={() => setActive(m.id)}
                      onFocus={() => setActive(m.id)}
                      aria-pressed={isActive}
                      className="ms-entry w-full items-start text-left"
                    >
                      <span className={`mono text-[12.5px] leading-6 tabular-nums transition-colors ${isActive ? "text-accent" : "text-text-2"}`} style={{ transitionDuration: "var(--t-feedback)" }}>
                        <time dateTime={m.date}>{dateFmt.format(new Date(m.date))}</time>
                      </span>
                      <span className="mono text-[12px] leading-6 text-text-2 [overflow-wrap:anywhere]">{productName}</span>
                      <span className="min-w-0">
                        <span className="block text-[16px] font-[540] leading-6 tracking-[-0.01em] text-text">
                          {copy.title}
                        </span>
                        <span className="mt-2 block max-w-[60ch] text-[14.5px] leading-[1.75] text-text-2">
                          {copy.body}
                        </span>
                      </span>
                    </button>
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onFocus={() => setActive(m.id)}
                      className="ms-evidence mono block min-w-0 self-start text-[11.5px] leading-6 text-text-2 hover:text-accent"
                      style={{ transitionDuration: "var(--t-feedback)" }}
                    >
                      <span className="text-accent">{dict.milestones.evidence} ↗</span> <span className="block">{m.href.replace(/^https:\/\/(www\.)?/, "")}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
