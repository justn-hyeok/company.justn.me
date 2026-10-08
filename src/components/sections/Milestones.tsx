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
          <div className="col-span-12 lg:col-span-4">
            <SectionHeading index={dict.sections.milestones.index} title={dict.sections.milestones.title} titleId="milestones-title" />
            <p className="mt-5 max-w-[30ch] text-[14.5px] leading-relaxed text-text-2">{dict.milestones.lede}</p>
          </div>

          <div ref={ref} className="relative col-span-12 lg:col-span-8">
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-border" aria-hidden="true" />
            <div data-progress className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent" aria-hidden="true" />

            <ol className="flex flex-col">
              {milestones.map((m) => {
                const copy = dict.milestones.items[m.id];
                const isActive = active === m.id;
                const productName = m.product === "studio" ? "justn" : productById[m.product].name;
                return (
                  <li key={m.id} data-row>
                    <button
                      type="button"
                      onClick={() => setActive(m.id)}
                      onFocus={() => setActive(m.id)}
                      onMouseEnter={() => setActive(m.id)}
                      aria-pressed={isActive}
                      className="ms-row group grid w-full grid-cols-[16px_1fr] gap-x-4 py-4 text-left md:grid-cols-[16px_120px_1fr] md:gap-x-6"
                    >
                      <span className="relative mt-[7px] flex h-[15px] items-center justify-center" aria-hidden="true">
                        <span
                          className="ms-dot h-[9px] w-[9px] rounded-full border transition-colors"
                          data-active={isActive}
                          style={{
                            transitionDuration: "var(--t-feedback)",
                            background: isActive ? "var(--accent)" : "var(--bg)",
                            borderColor: isActive ? "var(--accent)" : "var(--border-strong)",
                          }}
                        />
                      </span>
                      <span className={`mono text-[12.5px] tabular-nums transition-colors md:pt-[5px] ${isActive ? "text-accent" : "text-text-3"}`} style={{ transitionDuration: "var(--t-feedback)" }}>
                        <time dateTime={m.date}>{dateFmt.format(new Date(m.date))}</time>
                      </span>
                      <span className="col-start-2 md:col-start-3">
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className={`text-[17px] font-[540] tracking-[-0.01em] transition-colors ${isActive ? "text-text" : "text-text-2 group-hover:text-text"}`} style={{ transitionDuration: "var(--t-feedback)" }}>
                            {copy.title}
                          </span>
                          <span className="mono text-[11px] text-text-3">{productName}</span>
                        </span>
                        <span
                          className="mt-1 block max-w-[60ch] text-[14.5px] leading-relaxed text-text-2 transition-opacity"
                          style={{ opacity: isActive ? 1 : 0.7, transitionDuration: "var(--t-feedback)" }}
                        >
                          {copy.body}
                        </span>
                      </span>
                    </button>
                    <div className="grid grid-cols-[16px_1fr] gap-x-4 md:grid-cols-[16px_120px_1fr] md:gap-x-6">
                      <a
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`col-start-2 mb-4 mono inline-flex w-fit items-center gap-1 text-[11.5px] transition-colors md:col-start-3 ${isActive ? "text-accent" : "text-text-3 hover:text-text-2"}`}
                        style={{ transitionDuration: "var(--t-feedback)" }}
                      >
                        {dict.milestones.evidence} ↗ <span className="text-text-3">{m.href.replace(/^https:\/\/(www\.)?/, "")}</span>
                      </a>
                    </div>
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
