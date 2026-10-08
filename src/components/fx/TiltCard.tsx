"use client";

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max tilt in degrees. Keep small: this is feedback, not a carousel. */
  max?: number;
  /** Spotlight colour; a faint mint by default. */
  spotlight?: string;
}

/**
 * Pointer tilt plus a following spotlight. Both are pure feedback: they stop
 * the moment the pointer leaves, keyboard focus gives a steady centred light,
 * and reduced motion disables the tilt via CSS.
 */
export function TiltCard({ children, className = "", style, max = 4, spotlight = "rgba(46, 242, 168, 0.12)" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [vars, setVars] = useState<CSSProperties>({});
  const [on, setOn] = useState(false);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || e.pointerType !== "mouse") return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setVars({
      ["--rx" as string]: `${((0.5 - py) * max * 2).toFixed(2)}deg`,
      ["--ry" as string]: `${((px - 0.5) * max * 2).toFixed(2)}deg`,
      ["--sx" as string]: `${(px * 100).toFixed(1)}%`,
      ["--sy" as string]: `${(py * 100).toFixed(1)}%`,
    });
  };
  const leave = () => {
    setOn(false);
    setVars({ ["--sx" as string]: "50%", ["--sy" as string]: "50%" });
  };

  return (
    <div
      ref={ref}
      className={`tilt relative overflow-hidden ${className}`}
      style={{ ...style, ...vars }}
      data-hover={on}
      onPointerMove={move}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOn(true)}
      onPointerLeave={leave}
      onFocusCapture={() => {
        setVars({ ["--sx" as string]: "50%", ["--sy" as string]: "50%" });
        setOn(true);
      }}
      onBlurCapture={leave}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity"
        style={{
          opacity: on ? 1 : 0,
          transitionDuration: "var(--t-card)",
          background: `radial-gradient(360px circle at var(--sx, 50%) var(--sy, 50%), ${spotlight}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
