"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDemoClock } from "./useDemoClock";

type Copy = Dictionary["products"]["demo"]["pipeline"];

/** Rapi: collect → normalise → classify/summarise → deliver.
 *  Click a source to run an item through; otherwise it cycles on its own. */
export function PipelineDemo({ copy }: { copy: Copy }) {
  const [origin, setOrigin] = useState(0);
  const [manualStart, setManualStart] = useState<number | null>(null);
  const { ref, tick } = useDemoClock<HTMLDivElement>(900);
  const base = manualStart ?? 0;
  const step = (tick - base) % (copy.stages.length + 1); // last beat: idle
  const stage = step < copy.stages.length ? step : -1;

  const run = (i: number) => {
    setOrigin(i);
    setManualStart(tick);
  };

  return (
    <div ref={ref} className="term p-3">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div className="flex flex-col gap-1.5" role="group" aria-label={copy.stages[0]}>
          {copy.sources.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => run(i)}
              className={`rounded-md border px-2 py-1 text-left text-[11.5px] transition-colors ${
                origin === i && stage >= 0 ? "border-accent text-accent" : "border-border text-text-2 hover:text-text"
              }`}
              style={{ transitionDuration: "var(--t-feedback)" }}
            >
              {s}
            </button>
          ))}
        </div>

        <ol className="flex flex-col gap-1.5" aria-label="pipeline">
          {copy.stages.map((name, i) => {
            const lit = stage >= i;
            const now = stage === i;
            return (
              <li key={name} className="flex items-center gap-2">
                <span
                  className="h-px flex-1 transition-colors"
                  style={{ background: lit ? "var(--accent)" : "var(--border)", transitionDuration: "var(--t-card)" }}
                />
                <span
                  className={`rounded-md border px-2 py-1 text-[11.5px] transition-colors ${
                    now ? "border-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-accent" : lit ? "border-border-strong text-text" : "border-border text-text-3"
                  }`}
                  style={{ transitionDuration: "var(--t-card)" }}
                >
                  {name}
                </span>
                <span
                  className="h-px flex-1 transition-colors"
                  style={{ background: stage > i ? "var(--accent)" : "var(--border)", transitionDuration: "var(--t-card)" }}
                />
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-1.5">
          {copy.outputs.map((o, i) => (
            <span
              key={o}
              className={`rounded-md border px-2 py-1 text-[11.5px] transition-colors ${
                stage === copy.stages.length - 1 && i < 2 ? "border-accent text-accent" : "border-border text-text-3"
              }`}
              style={{ transitionDuration: "var(--t-card)" }}
            >
              {o}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
