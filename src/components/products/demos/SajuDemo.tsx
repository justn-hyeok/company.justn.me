"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Copy = Dictionary["products"]["demo"]["saju"];

// Sample chart characters. Illustrative only; not a real calculation.
const STEMS = ["甲", "丙", "庚", "壬"];
const BRANCHES = ["子", "寅", "午", "申"];

/** Sajurium: the four-pillar chart with the three flows built on top of it. */
export function SajuDemo({ copy }: { copy: Copy }) {
  const tabs = [copy.report, copy.relation, copy.consult];
  const [tab, setTab] = useState(0);
  const [pillar, setPillar] = useState<number | null>(1);

  return (
    <div className="panel-elevated p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="index">{copy.title}</span>
        <div role="tablist" className="flex gap-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === i}
              type="button"
              onClick={() => setTab(i)}
              className={`chip transition-colors ${tab === i ? "chip-accent" : ""}`}
              style={{ transitionDuration: "var(--t-feedback)" }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5" role="group" aria-label={copy.title}>
        {copy.pillars.map((p, i) => (
          <button
            key={p}
            type="button"
            onClick={() => setPillar(i)}
            aria-pressed={pillar === i}
            className={`rounded-md border p-2 text-center transition-colors ${pillar === i ? "border-accent bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]" : "border-border hover:border-border-strong"}`}
            style={{ transitionDuration: "var(--t-feedback)" }}
          >
            <span className="mono block text-[10.5px] text-text-3">{p}</span>
            <span className="block text-[22px] leading-tight text-text">{STEMS[i]}</span>
            <span className={`block text-[22px] leading-tight ${pillar === i ? "text-accent" : "text-text-2"}`}>{BRANCHES[i]}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 term p-2.5" aria-live="polite">
        <span className="t-dim">{tabs[tab]} · </span>
        <span className="t-text">
          {pillar !== null ? `${copy.pillars[pillar]} ${STEMS[pillar]}${BRANCHES[pillar]}` : "—"}
        </span>
        <span className="t-dim"> · {tab === 0 ? "free" : tab === 1 ? "pair" : "answer"}</span>
      </div>
    </div>
  );
}
