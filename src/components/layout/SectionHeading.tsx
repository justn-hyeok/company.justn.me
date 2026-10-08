import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string;
  title: string;
  /** Optional lede rendered to the right on desktop. */
  lede?: string;
  align?: "left" | "split";
  children?: ReactNode;
  titleId?: string;
}

/** Monospace index above the title: "01 / PRODUCTS". Left-aligned by default,
 *  never centred, so sections do not repeat the same silhouette. */
export function SectionHeading({ index, title, lede, align = "left", children, titleId }: SectionHeadingProps) {
  return (
    <div className={align === "split" ? "grid-12 items-end gap-y-6" : ""}>
      <div className={align === "split" ? "col-span-12 lg:col-span-6" : ""}>
        <p className="index mb-4">{index}</p>
        <h2 id={titleId} className="h-section">
          {title}
        </h2>
      </div>
      {lede && (
        <p className={`lede pre-line ${align === "split" ? "col-span-12 lg:col-span-5 lg:col-start-8" : "mt-5"}`}>{lede}</p>
      )}
      {children}
    </div>
  );
}
