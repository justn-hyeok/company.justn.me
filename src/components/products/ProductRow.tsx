"use client";

import { productById, type ProductId } from "@/content/products";
import type { Dictionary } from "@/i18n/dictionaries";
import { TiltCard } from "@/components/fx/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import { ProductDemo } from "./ProductDemo";

interface ProductRowProps {
  id: ProductId;
  dict: Dictionary;
  locale: string;
  /** Alternate the visual side so the list reads as a sequence, not a grid. */
  flip?: boolean;
  flagship?: boolean;
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 2.5h5.5V8M9.5 2.5 2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** One product, fully readable: name, role, summary, description, facts,
 *  links, and its own visual. Nothing is truncated or hidden behind a click. */
export function ProductRow({ id, dict, locale, flip = false, flagship = false }: ProductRowProps) {
  const facts = productById[id];
  const copy = dict.products.items[id];
  const d = dict.products.detail;
  const dateFmt = new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", { year: "numeric", month: "short", day: "numeric" });

  const text = (
    <div className={`col-span-12 flex flex-col gap-5 lg:col-span-5 ${flip ? "lg:col-start-8" : ""}`}>
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {flagship && <span className="chip chip-accent">{dict.products.flagship}</span>}
          <span className="chip">
            <span className="status-dot" data-live={facts.live} aria-hidden="true" />
            {copy.status}
          </span>
        </div>
        <h3 className="flex flex-wrap items-baseline gap-x-3 text-[30px] font-[560] leading-none tracking-[-0.03em] text-text md:text-[36px]">
          {facts.name}
          {facts.latinName && <span className="mono text-[13px] font-normal text-text-3">{facts.latinName}</span>}
        </h3>
        <p className="text-[18px] leading-snug text-text-2">{copy.role}</p>
      </header>

      <p className="text-[16px] leading-[1.7] text-text">{copy.summary}</p>
      <p className="text-[15px] leading-[1.7] text-text-2">{copy.description}</p>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-4 text-[13px]">
        <div className="col-span-2 sm:col-span-1">
          <dt className="index mb-1">{d.stack}</dt>
          <dd className="text-text-2">{copy.form}</dd>
          <dd className="mt-1.5 flex flex-wrap gap-1">
            {facts.stack.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </dd>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <dt className="index mb-1">{d.since}</dt>
            <dd className="mono text-text-2">{dateFmt.format(new Date(facts.since))}</dd>
          </div>
          {facts.release && (
            <div>
              <dt className="index mb-1">{d.release}</dt>
              <dd className="mono text-text-2">
                <a href={facts.release.url} target="_blank" rel="noopener noreferrer" className="link-ul">
                  {facts.release.tag} · {facts.release.date}
                </a>
              </dd>
            </div>
          )}
        </div>
      </dl>

      <footer className="flex flex-wrap items-center gap-2">
        <a href={facts.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary !h-10 text-[14px]">
          {d.visit}
          <ExternalIcon />
        </a>
        {facts.install && (
          <a href={facts.install.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !h-10 text-[14px]">
            {d.install} · {facts.install.label}
            <ExternalIcon />
          </a>
        )}
        {facts.repo && (
          <a href={facts.repo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !h-10 text-[14px]">
            {d.repo}
            <ExternalIcon />
          </a>
        )}
        {!facts.live && facts.ownership === "cobuilt" && <span className="mono text-[11.5px] text-text-3">{d.pendingUrl}</span>}
        {!facts.live && facts.id === "rapi" && <span className="mono text-[11.5px] text-text-3">{d.pendingUrl}</span>}
      </footer>
    </div>
  );

  const visual = (
    <div className={`col-span-12 lg:col-span-6 ${flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"} ${flagship ? "" : "lg:pt-2"}`}>
      <TiltCard className="rounded-[var(--radius-card)]" max={2.5}>
        <ProductDemo id={id} dict={dict} />
      </TiltCard>
    </div>
  );

  return (
    <Reveal as="article" id={`product-${id}`} className="grid-12 scroll-mt-24 gap-y-8 border-t border-border py-12 md:py-16">
      {text}
      {visual}
    </Reveal>
  );
}
