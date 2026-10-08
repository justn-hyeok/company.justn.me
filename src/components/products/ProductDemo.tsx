"use client";

import type { ProductId } from "@/content/products";
import { productById } from "@/content/products";
import type { Dictionary } from "@/i18n/dictionaries";
import { Recording } from "./Recording";
import { EditorDemo } from "./demos/EditorDemo";
import { MeetupDemo } from "./demos/MeetupDemo";
import { PipelineDemo } from "./demos/PipelineDemo";
import { SajuDemo } from "./demos/SajuDemo";

/** One visual per product. Recordings are real; demos are labelled as demos. */
export function ProductDemo({ id, dict }: { id: ProductId; dict: Dictionary }) {
  const facts = productById[id];
  const d = dict.products.detail;

  if (facts.recording) {
    return <Recording {...facts.recording} label={d.recordingLabel} note={d.recordingNote} />;
  }

  let body: React.ReactNode;
  switch (id) {
    case "rapi":
      body = <PipelineDemo copy={dict.products.demo.pipeline} />;
      break;
    case "justn-me":
      body = <EditorDemo copy={dict.products.demo.editor} />;
      break;
    case "sajurium":
      body = <SajuDemo copy={dict.products.demo.saju} />;
      break;
    case "bungae":
      body = <MeetupDemo copy={dict.products.demo.meetup} />;
      break;
    default:
      body = null;
  }

  return (
    <figure className="m-0">
      {body}
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="chip">{d.demoLabel}</span>
        <span className="mono text-[11px] text-text-3">{d.demoNote}</span>
      </figcaption>
    </figure>
  );
}
