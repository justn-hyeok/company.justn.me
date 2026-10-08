"use client";

import { useRef } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { ownProducts, productById } from "@/content/products";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/motion/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Magnetic } from "@/components/fx/Magnetic";
import { Recording } from "@/components/products/Recording";

interface HeroProps {
  dict: Dictionary;
  locale: string;
}

/**
 * First screen: who, what (with product names), where to go, how to reach.
 * The right side is evidence, not decoration: the flagship's real recording,
 * framed as a terminal window, plus the three things you can install today.
 */
export function Hero({ dict, locale }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { hero } = dict;
  const brgr = productById.brgr;
  const available = ownProducts.filter((p) => p.release);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("[data-hero-label]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.05)
        .fromTo("[data-hero-copy] > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.55)
        .fromTo("[data-hero-cta] > *", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0.9)
        .fromTo("[data-hero-evidence]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.45)
        .fromTo("[data-hero-available] > *", { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.08 }, 1.0);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-border" aria-labelledby="hero-title">
      <div className="hero-light" aria-hidden="true" />
      <div className="container relative grid-12 items-end gap-y-12 pb-14 pt-14 md:pb-20 md:pt-20 lg:items-center lg:py-20">
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <p data-hero-label className="index mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {hero.label}
          </p>

          <SplitHeading tag="h1" id="hero-title" text={hero.title} className="hero-title text-text" immediate delay={0.15} stagger={38} keepChars />

          <div data-hero-copy className="mt-8 flex max-w-[32rem] flex-col gap-4">
            <p className="pre-line text-[20px] leading-[1.38] tracking-[-0.012em] text-text md:text-[23px]">{hero.description}</p>
            <p className="text-[15.5px] leading-[1.65] text-text-2 md:text-[16px]">{hero.support}</p>
          </div>

          <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={brgr.repo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {hero.primary}
                <Arrow />
              </a>
            </Magnetic>
            <a href={`/${locale}#contact`} className="btn btn-secondary">
              {hero.secondary}
            </a>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:pl-8">
          <figure data-hero-evidence className="m-0">
            <div className="term evidence-frame overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                </span>
                <span className="mono truncate text-[11.5px] text-text-2">{hero.evidence.title}</span>
                <span className="chip chip-accent ml-auto hidden sm:inline-flex">{brgr.release?.tag}</span>
              </div>
              {brgr.recording && (
                <Recording {...brgr.recording} label={dict.products.detail.recordingLabel} note={hero.evidence.note} frameless />
              )}
            </div>
            <figcaption className="mono mt-2 text-[11.5px] text-text-3">
              {dict.products.detail.recordingLabel} · {hero.evidence.note}
            </figcaption>
          </figure>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="index">{hero.evidence.links}</span>
            <ul data-hero-available className="flex flex-wrap gap-x-5 gap-y-2 m-0 list-none p-0">
              {available.map((p) => (
                <li key={p.id}>
                  <a href={p.release!.url} target="_blank" rel="noopener noreferrer" className="link-ul mono text-[12.5px] text-text-2">
                    {p.name} {p.release!.tag} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
