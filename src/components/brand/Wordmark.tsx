interface WordmarkProps {
  className?: string;
  /** Height of the symbol in px. The word scales with it. */
  size?: number;
  withSymbol?: boolean;
}

/**
 * Symbol: a node (dot) joined by a thin connector to the hook of a "j".
 * Built from the brand language (node + connection line), legible at 16px.
 */
export function Symbol({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M15 8.5v8a4 4 0 0 1-4 4H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="15" cy="4.5" r="2.5" fill="var(--accent)" />
    </svg>
  );
}

export function Wordmark({ className = "", size = 20, withSymbol = true }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} style={{ lineHeight: 1 }}>
      {withSymbol && <Symbol size={size} />}
      <span
        className="font-sans tracking-[-0.04em]"
        style={{ fontSize: size * 0.95, fontWeight: 600, transform: "translateY(-0.5px)" }}
      >
        Justn
      </span>
    </span>
  );
}
