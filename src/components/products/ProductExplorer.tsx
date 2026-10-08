"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cobuiltProducts, ownProducts, products, type ProductId } from "@/content/products";
import type { Dictionary } from "@/i18n/dictionaries";
import { ProductMap } from "./ProductMap";
import { ProductRow } from "./ProductRow";

interface ProductExplorerProps {
  dict: Dictionary;
  locale: string;
}

/**
 * Map as a table of contents, then one fully readable row per product.
 * The map tracks which row is in view and jumps to a row on click; on small
 * screens the same jump list is a row of chips. Nothing depends on the map.
 */
export function ProductExplorer({ dict, locale }: ProductExplorerProps) {
  const [active, setActive] = useState<ProductId | null>(null);
  const [entered, setEntered] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Which product row is in view.
  useEffect(() => {
    const rows = products.map((p) => document.getElementById(`product-${p.id}`)).filter((r): r is HTMLElement => !!r);
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActive(best.target.id.replace("product-", "") as ProductId);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  const jump = useCallback((id: ProductId) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`product-${id}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <div>
      {/* Map: desktop table of contents. */}
      <div ref={mapRef} className="hidden lg:block">
        <ProductMap dict={dict} active={active} onSelect={jump} entered={entered} className="h-[300px] w-full" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="mono text-[11.5px] text-text-3">{dict.products.mapHint}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 mono text-[11px] text-text-3">
            <li className="flex items-center gap-2">
              <span className="inline-block h-px w-5 bg-border-strong" aria-hidden="true" /> {dict.products.legend.own}
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-px w-5 border-t border-dashed border-border-strong" aria-hidden="true" /> {dict.products.legend.cobuilt}
            </li>
          </ul>
        </div>
      </div>

      {/* Chips: the same jump list for touch and small screens. */}
      <nav aria-label={dict.products.listAria} className="flex flex-wrap gap-2 lg:hidden">
        {products.map((p) => (
          <a
            key={p.id}
            href={`#product-${p.id}`}
            className={`btn btn-secondary !h-9 px-3 text-[13.5px] ${active === p.id ? "!border-accent !text-accent" : ""}`}
            aria-current={active === p.id ? "true" : undefined}
          >
            <span className="status-dot" data-live={p.live} aria-hidden="true" />
            {p.name}
          </a>
        ))}
      </nav>

      <div className="mt-10 md:mt-14">
        <h3 className="index mb-2">{dict.products.groups.own}</h3>
        {ownProducts.map((p, i) => (
          <ProductRow key={p.id} id={p.id} dict={dict} locale={locale} flip={i % 2 === 1} flagship={!!p.flagship} />
        ))}
      </div>

      <div className="mt-16 md:mt-24">
        <h3 className="index mb-1">{dict.products.groups.cobuilt}</h3>
        <p className="mb-2 text-[14px] text-text-2">{dict.products.cobuiltNote}</p>
        {cobuiltProducts.map((p, i) => (
          <ProductRow key={p.id} id={p.id} dict={dict} locale={locale} flip={i % 2 === 0} />
        ))}
      </div>
    </div>
  );
}
