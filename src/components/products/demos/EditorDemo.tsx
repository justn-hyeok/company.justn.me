"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDemoClock } from "./useDemoClock";

type Copy = Dictionary["products"]["demo"]["editor"];

/** justn.me: a document edited by field path, with per-company copies.
 *  Pick a copy to see the base document and its variant side by side. */
export function EditorDemo({ copy }: { copy: Copy }) {
  const [active, setActive] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const { ref, tick } = useDemoClock<HTMLDivElement>(400, !exporting);
  const progress = exporting ? Math.min(100, (tick % 8) * 14) : 0;
  const id = active === null ? copy.title : `${copy.title}${copy.copies[active]}`;

  return (
    <div ref={ref} className="term p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="t-accent truncate">{id}</span>
        <span className="t-dim">version 68fd…</span>
      </div>
      <div className="mt-2 grid grid-cols-[1fr_auto] gap-3">
        <ul className="space-y-1">
          {copy.fields.map((f, i) => (
            <li key={f} className="flex gap-2">
              <span className="t-dim">sections.{i}.title</span>
              <span className="t-dim">=</span>
              <span className="t-text">{f}</span>
              {active !== null && i === 1 && <span className="t-accent ml-auto">edited</span>}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={`rounded border px-2 py-0.5 text-left text-[11px] ${active === null ? "border-accent text-accent" : "border-border text-text-2"}`}
          >
            base
          </button>
          {copy.copies.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded border px-2 py-0.5 text-left text-[11px] ${active === i ? "border-accent text-accent" : "border-border text-text-2"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExporting(true)}
          className="rounded border border-border px-2 py-0.5 text-[11px] text-text hover:border-accent hover:text-accent"
        >
          {copy.export}
        </button>
        {exporting && (
          <span className="flex flex-1 items-center gap-2">
            <span className="h-1 flex-1 rounded bg-border">
              <span className="block h-1 rounded bg-accent transition-[width]" style={{ width: `${progress}%`, transitionDuration: "var(--t-card)" }} />
            </span>
            <span className="t-dim tabular-nums">{progress}%</span>
          </span>
        )}
      </div>
    </div>
  );
}
