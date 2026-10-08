"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { DotGrid } from "@/components/fx/DotGrid";
import { Magnetic } from "@/components/fx/Magnetic";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/motion/gsap";

export function Contact({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-contact] > *",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, clearProps: "transform", scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } },
      );
    },
    { scope: ref },
  );

  useEffect(() => {
    if (copied === "idle") return;
    const t = window.setTimeout(() => setCopied("idle"), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };

  return (
    <section ref={ref} id="contact" className="relative scroll-mt-16 overflow-hidden border-t border-border" aria-labelledby="contact-title">
      <DotGrid className="absolute inset-0" gap={28} proximity={160} />
      <div className="container relative section">
        <div data-contact className="grid-12 gap-y-8">
          <p className="index col-span-12">{dict.sections.contact.index}</p>
          <h2 id="contact-title" className="h-statement pre-line col-span-12 max-w-[20ch] text-text lg:col-span-7">
            {dict.contact.headline}
          </h2>
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="max-w-[46ch] text-[16px] leading-[1.7] text-text-2">{dict.contact.body}</p>
            <div>
              <p className="index mb-2">{dict.contact.inquiriesLabel}</p>
              <ul className="m-0 flex flex-wrap gap-x-4 gap-y-1 list-none p-0 text-[14px] text-text-2">
                {dict.contact.inquiries.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="mono mt-2 text-[12px] text-text-3">{dict.contact.responseTime}</p>
            </div>
          </div>

          <div className="col-span-12 mt-4 flex flex-col gap-5 border-t border-border pt-8">
            <a
              href={`mailto:${site.email}`}
              className="wave group inline-flex w-fit items-baseline gap-3 text-[clamp(28px,6.2vw,76px)] font-[560] leading-none tracking-[-0.04em] text-text"
              aria-label={site.email}
            >
              <span aria-hidden="true">
                {site.email.split("").map((ch, i) => (
                  <span key={i} className="wave-char" style={{ ["--i" as string]: i }}>
                    {ch}
                  </span>
                ))}
              </span>
              <span aria-hidden="true" className="text-[0.45em] text-text-3 transition-transform group-hover:translate-x-1 group-hover:text-accent" style={{ transitionDuration: "var(--t-feedback)" }}>
                ↗
              </span>
            </a>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href={`mailto:${site.email}`} className="btn btn-primary">
                  {dict.contact.mail}
                </a>
              </Magnetic>
              <button type="button" onClick={copy} className="btn btn-secondary" aria-live="polite">
                {copied === "ok" ? (
                  <>
                    <span className="text-accent" aria-hidden="true">✓</span> {dict.contact.copied}
                  </>
                ) : copied === "fail" ? (
                  dict.contact.copyFailed
                ) : (
                  dict.contact.copy
                )}
              </button>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                {dict.contact.github} · {site.githubHandle} ↗
              </a>
            </div>
          </div>

          <div className="col-span-12 grid gap-3 border-t border-border pt-6 lg:col-span-8">
            <p className="index">{dict.contact.policyTitle}</p>
            <p className="max-w-[62ch] text-[14.5px] leading-relaxed text-text-2">{dict.contact.policyBody}</p>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent(dict.contact.securityLabel)}`} className="link-ul mono w-fit text-[13px] text-text-2">
              {dict.contact.securityLabel} · {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
