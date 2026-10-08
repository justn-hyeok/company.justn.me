"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDemoClock } from "./useDemoClock";

type Copy = Dictionary["products"]["demo"]["meetup"];

type MeetupState = "idle" | "joined" | "checked";

/** Bungae: a meetup card on a phone-width shell, closing within 24 hours.
 *  Tap the button to move through join → check-in. */
export function MeetupDemo({ copy }: { copy: Copy }) {
  const [state, setState] = useState<MeetupState>("idle");
  const { ref, tick } = useDemoClock<HTMLDivElement>(1000);
  const seconds = Math.max(0, 5 * 3600 + 12 * 60 + 40 - tick);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  const next = () => setState((st) => (st === "idle" ? "joined" : st === "joined" ? "checked" : "idle"));
  const label = state === "idle" ? copy.join : state === "joined" ? copy.checkin : copy.waitlist;

  return (
    <div ref={ref} className="mx-auto w-full max-w-[280px] rounded-[18px] border border-border bg-elevated p-3">
      <div className="flex items-center justify-between">
        <span className="mono text-[10.5px] text-text-3">{copy.countdown}</span>
        <span className="mono tabular-nums text-[13px] text-accent">{h}:{m}:{s}</span>
      </div>
      <p className="mt-2 text-[14px] font-[540] leading-snug text-text">{copy.title}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="flex -space-x-1.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-5 w-5 rounded-full border border-elevated"
              style={{ background: i < 3 || state !== "idle" ? "var(--text-2)" : "var(--border)" }}
            />
          ))}
        </span>
        <span className="mono text-[11.5px] text-text-2">{state === "idle" ? copy.members : "4 / 4"}</span>
      </div>
      <button
        type="button"
        onClick={next}
        className={`btn mt-3 !h-10 w-full justify-center text-[13.5px] ${state === "checked" ? "btn-secondary" : "btn-primary"}`}
      >
        {state === "checked" ? "✓ " + copy.checkin : label}
      </button>
    </div>
  );
}
