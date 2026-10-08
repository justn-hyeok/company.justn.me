import type { ProductId } from "./products";

/** Release-log entries. Every date comes from a GitHub release, the first
 *  commit, or a dated record in the repository. Text per language lives in
 *  the dictionaries under `milestones.items[id]`. Repository creation dates
 *  are not milestones and are left out. */
export interface Milestone {
  id: string;
  date: string; // YYYY-MM-DD
  product: ProductId | "studio";
  href: string;
}

export const milestones: Milestone[] = [
  { id: "ap-3-3-0", date: "2026-10-08", product: "agent-progress", href: "https://github.com/justn-hyeok/agent-progress/releases/tag/v3.3.0" },
  { id: "brgr-2-13-4", date: "2026-10-06", product: "brgr", href: "https://github.com/justn-hyeok/brgr/releases/tag/v2.13.4" },
  { id: "sajurium-flags", date: "2026-10-02", product: "sajurium", href: "https://github.com/bread-dispenser/sajurium-client" },
  { id: "rapi-0-1-0", date: "2026-09-28", product: "rapi", href: "https://github.com/justn-hyeok/rapi-agent/releases/tag/v0.1.0" },
  { id: "studio-start", date: "2026-08-24", product: "studio", href: "https://justn.me" },
];
