export type ProductId =
  | "brgr"
  | "agent-progress"
  | "rapi"
  | "justn-me"
  | "sajurium"
  | "bungae";

/** "own": built and run by justn. "cobuilt": a two-person team product where
 *  justn did the part named in the dictionary (`items[id].form`). */
export type Ownership = "own" | "cobuilt";

/** Facts that do not change between languages. Every value here was checked
 *  against the repository, release page or live site on 2026-10-08. */
export interface ProductFacts {
  id: ProductId;
  name: string;
  latinName?: string;
  ownership: Ownership;
  flagship?: boolean;
  url: string;
  /** Install or package page when the product is a CLI. */
  install?: { label: string; url: string };
  repo?: string;
  release?: { tag: string; date: string; url: string };
  since: string;
  stack: string[];
  recording?: { src: string; width: number; height: number; displayAspect?: number; startAt?: number };
  live: boolean;
}

export const products: ProductFacts[] = [
  {
    id: "brgr",
    name: "brgr",
    ownership: "own",
    flagship: true,
    url: "https://github.com/justn-hyeok/brgr",
    install: { label: "crates.io · brgr-cli", url: "https://crates.io/crates/brgr-cli" },
    repo: "https://github.com/justn-hyeok/brgr",
    release: { tag: "v2.13.4", date: "2026-10-06", url: "https://github.com/justn-hyeok/brgr/releases/tag/v2.13.4" },
    since: "2026-09-13",
    stack: ["Rust", "Herdr", "MIT"],
    recording: { src: "/media/brgr.mp4", width: 1200, height: 674, startAt: 11 },
    live: true,
  },
  {
    id: "agent-progress",
    name: "agent-progress",
    ownership: "own",
    url: "https://github.com/justn-hyeok/agent-progress",
    install: { label: "Homebrew tap", url: "https://github.com/justn-hyeok/agent-progress#설치" },
    repo: "https://github.com/justn-hyeok/agent-progress",
    release: { tag: "v3.3.0", date: "2026-10-08", url: "https://github.com/justn-hyeok/agent-progress/releases/tag/v3.3.0" },
    since: "2026-09-28",
    stack: ["Rust", "Homebrew", "Herdr / tmux"],
    recording: { src: "/media/agent-progress.mp4", width: 1500, height: 214 },
    live: true,
  },
  {
    id: "rapi",
    name: "라피",
    latinName: "rapi-agent",
    ownership: "own",
    url: "https://rapi.justn.me",
    repo: "https://github.com/justn-hyeok/rapi-agent",
    release: { tag: "v0.1.2", date: "2026-09-28", url: "https://github.com/justn-hyeok/rapi-agent/releases/tag/v0.1.2" },
    since: "2026-09-06",
    stack: ["Node.js", "PostgreSQL", "Discord bot", "Go crawler"],
    live: false,
  },
  {
    id: "justn-me",
    name: "justn.me",
    ownership: "own",
    url: "https://justn.me",
    since: "2026-08-24",
    stack: ["Next.js", "MCP server", "PDF export"],
    live: true,
  },
  {
    id: "sajurium",
    name: "사주리움",
    latinName: "Sajurium",
    ownership: "cobuilt",
    url: "https://sajurium.justn.me",
    repo: "https://github.com/bread-dispenser/sajurium-client",
    since: "2026-08-25",
    stack: ["Next.js 16", "React 19", "FastAPI"],
    live: true,
  },
  {
    id: "bungae",
    name: "벙개",
    latinName: "Bungae",
    ownership: "cobuilt",
    url: "https://bungae.justn.me",
    repo: "https://github.com/stacking-money-forever/bungae-frontend",
    since: "2026-08-31",
    stack: ["Next.js", "Mobile web 320–430px", "/v1 API"],
    live: false,
  },
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<ProductId, ProductFacts>;
export const ownProducts = products.filter((p) => p.ownership === "own");
export const cobuiltProducts = products.filter((p) => p.ownership === "cobuilt");
