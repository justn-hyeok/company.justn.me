"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

interface RecordingProps {
  src: string;
  width: number;
  height: number;
  label: string;
  note: string;
  className?: string;
  /** Show the recording in a box of this aspect ratio, cropping from the
   *  left, so very wide terminal captures stay legible. */
  displayAspect?: number;
  /** Render only the video; the caller supplies the frame and caption. */
  frameless?: boolean;
  /** Seconds to skip at the start (and to loop back to), so the first thing a
   *  visitor sees is the product doing its job, not a terminal booting. */
  startAt?: number;
}

/** Real product recording. Plays only while visible; never autoplays under
 *  reduced motion (controls are shown instead). */
export function Recording({ src, width, height, label, note, className = "", displayAspect, frameless = false, startAt = 0 }: RecordingProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const start = () => {
      if (startAt && video.currentTime < startAt) video.currentTime = startAt;
      video.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    const onEnded = () => {
      video.currentTime = startAt;
      video.play().catch(() => {});
    };
    const onVisibility = () => {
      if (document.visibilityState !== "visible") video.pause();
    };
    video.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, startAt]);

  const video = (
    <video
      ref={ref}
      src={src}
      width={width}
      height={height}
      muted
      loop={!startAt}
      playsInline
      preload="none"
      poster={src.replace(/\.mp4$/, ".jpg")}
      controls={reduced}
      className="block h-full w-full object-cover object-left"
      aria-label={label}
    />
  );

  if (frameless) {
    return <div style={{ aspectRatio: displayAspect ? `${displayAspect} / 1` : `${width} / ${height}` }}>{video}</div>;
  }

  return (
    <figure className={`m-0 ${className}`}>
      <div className="term overflow-hidden" style={{ aspectRatio: displayAspect ? `${displayAspect} / 1` : `${width} / ${height}` }}>
        {video}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="chip">{label}</span>
        <span className="mono text-[11px] text-text-3">{note}</span>
      </figcaption>
    </figure>
  );
}
