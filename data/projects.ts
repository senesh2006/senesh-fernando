import type { FileNode } from "@/components/site/files-tree";
import { IMAGES } from "@/lib/images";

export type Project = {
  slug: string;
  n: string;
  name: string;
  year: string;
  tag: string;
  status: "shipping" | "maintained" | "archived" | "beta";
  body: string;
  longDescription: string;
  pros: string[];
  cons: string[];
  cover: string;
  gallery: string[];
  repo: string;
  demo: string;
  stack: string[];
  stats: { stars: string; forks: string; issues: string; license: string; lastCommit: string };
  tree: FileNode[];
};

const baseTree: FileNode[] = [
  {
    type: "folder", name: "src", defaultOpen: true, children: [
      { type: "folder", name: "components", children: [
        { type: "file", name: "button.tsx" },
        { type: "file", name: "card.tsx" },
        { type: "file", name: "dialog.tsx" },
      ]},
      { type: "folder", name: "lib", children: [
        { type: "file", name: "utils.ts" },
        { type: "file", name: "tokens.ts" },
      ]},
      { type: "file", name: "index.ts" },
      { type: "file", name: "styles.css" },
    ],
  },
  { type: "folder", name: "docs", children: [
    { type: "file", name: "getting-started.md" },
    { type: "file", name: "theming.md" },
  ]},
  { type: "file", name: "package.json" },
  { type: "file", name: "README.md" },
  { type: "file", name: "LICENSE" },
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    slug: "puppertino", n: "01", name: "puppertino", year: "2025", tag: "css framework",
    status: "shipping",
    body: "An Apple HIG-inspired CSS framework. Zero JS, semantic defaults, themeable via CSS variables.",
    longDescription:
      "Puppertino is a CSS-only design system that ports Apple's Human Interface Guidelines to the web. It ships with semantic component classes, a typographic scale tuned for SF Pro fallbacks, and a token layer that themes the entire surface from three custom properties. No runtime, no build step required.",
    pros: ["zero dependencies", "tree-shakable", "WCAG-AA out of the box"],
    cons: ["opinionated, not configurable", "not for non-Apple aesthetics"],
    cover: IMAGES.coverSystem, gallery: [IMAGES.coverSystem, IMAGES.coverKeyboard, IMAGES.coverPerf],
    repo: "https://github.com/senesh/puppertino", demo: "https://puppertino.dev",
    stack: ["CSS", "PostCSS", "TypeScript"],
    stats: { stars: "2.4k", forks: "184", issues: "12", license: "MIT", lastCommit: "2 days ago" },
    tree: baseTree,
  },
  {
    slug: "termfolio", n: "02", name: "termfolio", year: "2025", tag: "template",
    status: "maintained",
    body: "Terminal-first portfolio template. Keyboard-driven, mode-aware footer, dark mode that syncs across tabs.",
    longDescription:
      "A portfolio template that treats the page like a terminal session. j/k navigation, a mode-aware footer that mirrors the section you're in, and cross-tab dark mode sync built on BroadcastChannel. Ships at under 30kb of first-load JS.",
    pros: ["sub-30kb first load", "j/k navigation built-in", "MIT licensed"],
    cons: ["text-forward only", "no built-in CMS"],
    cover: IMAGES.coverVanilla, gallery: [IMAGES.coverVanilla, IMAGES.coverKeyboard, IMAGES.coverSystem],
    repo: "https://github.com/senesh/termfolio", demo: "https://termfolio.dev",
    stack: ["TypeScript", "Vite", "Tailwind"],
    stats: { stars: "1.1k", forks: "92", issues: "7", license: "MIT", lastCommit: "6 days ago" },
    tree: baseTree,
  },
  {
    slug: "edge-router", n: "03", name: "edge-router", year: "2024", tag: "library",
    status: "shipping",
    body: "Tiny edge-runtime routing primitive. ~1.4kb gzipped, supports nested layouts and streaming responses.",
    longDescription:
      "A routing primitive built for the Web Streams era. Runs on Workers, Deno, and Bun with zero adapters. Supports nested layouts, streaming responses, and per-route caching with no runtime dependencies. Designed to be the foundation other frameworks build on, not a framework itself.",
    pros: ["1.4kb gzipped", "Workers / Deno / Bun", "no runtime deps"],
    cons: ["bring-your-own data loader", "no file-system routing"],
    cover: IMAGES.coverPerf, gallery: [IMAGES.coverPerf, IMAGES.coverSystem, IMAGES.coverVanilla],
    repo: "https://github.com/senesh/edge-router", demo: "https://edge-router.dev",
    stack: ["TypeScript", "Web Streams", "Cloudflare"],
    stats: { stars: "3.8k", forks: "241", issues: "23", license: "MIT", lastCommit: "yesterday" },
    tree: baseTree,
  },
  {
    slug: "modes-css", n: "04", name: "modes.css", year: "2024", tag: "experiment",
    status: "beta",
    body: "A mode-driven UI state framework. Components react to global [MODE: …] attributes instead of class toggles.",
    longDescription:
      "modes.css inverts the React state-toggle pattern. Instead of toggling classes per component, the app declares a single mode attribute on <html> and every component styles itself reactively via attribute selectors. State becomes debuggable in DevTools, no source maps needed.",
    pros: ["declarative state", "easy to debug", "no JS required"],
    cons: ["new mental model", "tooling not mature"],
    cover: IMAGES.coverKeyboard, gallery: [IMAGES.coverKeyboard, IMAGES.coverPerf, IMAGES.coverVanilla],
    repo: "https://github.com/senesh/modes-css", demo: "https://modes.css.dev",
    stack: ["CSS", "HTML"],
    stats: { stars: "612", forks: "38", issues: "4", license: "MIT", lastCommit: "3 weeks ago" },
    tree: baseTree,
  },
];

export const PROJECTS = FALLBACK_PROJECTS;

export const getProject = (slug: string) => FALLBACK_PROJECTS.find((p) => p.slug === slug);