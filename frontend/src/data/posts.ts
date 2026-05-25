import coverVanilla from "@/assets/writing-cover-vanilla.jpg";
import coverKeyboard from "@/assets/writing-cover-keyboard.jpg";
import coverSystem from "@/assets/writing-cover-system.jpg";
import coverPerf from "@/assets/writing-cover-perf.jpg";
import coverHandoff from "@/assets/writing-cover-handoff.jpg";

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "img"; src: string; alt: string; caption?: string };

export type Post = {
  slug: string;
  date: string;
  title: string;
  dek: string;
  read: string;
  tag: string;
  cover: string;
  blocks?: PostBlock[];
  contentHtml?: string;
  contentMarkdown?: string;
  views?: number;
  tags?: string[];
};

export const FALLBACK_POSTS: Post[] = [
  {
    slug: "vanilla-css-2025",
    date: "2025.04.18",
    title: "the case for vanilla CSS in 2025",
    dek: "Native CSS finally caught up. Here's what falls out of your bundle when you let it.",
    read: "6 min",
    tag: "frontend",
    cover: coverVanilla,
    blocks: [
      { type: "p", text: "For a decade, every serious frontend stack reached for a preprocessor, then a CSS-in-JS runtime, then a utility framework, then all three at once. The browser caught up while we weren't looking." },
      { type: "h2", text: "what the platform gives you" },
      { type: "p", text: "Custom properties, container queries, :has(), nesting, color-mix(), cascade layers, view transitions. Each one used to be a library. Together they cover most of what we reached for build-time tooling to provide." },
      { type: "img", src: coverSystem, alt: "Wireframe of a modular system", caption: "Fig 1. The same component, themed by overriding three custom properties." },
      { type: "p", text: "The win is not aesthetic — it's reliability. You stop shipping a runtime to your users. You stop maintaining a build pipeline whose only purpose is to convert your CSS into different CSS." },
      { type: "quote", text: "Every dependency is a bet that someone else's future is going to look like your future.", cite: "— a thing i wrote on a napkin" },
      { type: "h2", text: "what you give up" },
      { type: "p", text: "Honest answer: a familiar API and the comfort of monoculture. That's a real cost — code review, hiring, tooling all get easier when everyone uses the same library. Pick your fights." },
    ],
  },
  {
    slug: "modes-not-modals",
    date: "2025.02.02",
    title: "modes, not modals: declarative UI state",
    dek: "Stop reaching for <Dialog>. Start expressing what mode the app is in, and let the styles respond.",
    read: "9 min",
    tag: "design systems",
    cover: coverSystem,
    blocks: [
      { type: "p", text: "Most apps are a finite state machine pretending to be a tree of toggled booleans. You can feel it during onboarding flows, during checkout, during any 'wizard'." },
      { type: "h2", text: "the trick" },
      { type: "p", text: "Hoist mode to a single attribute on <html>. Style everything downstream with attribute selectors. Your components become spectators of a single source of truth." },
      { type: "img", src: coverKeyboard, alt: "Macro shot of a mechanical keyboard", caption: "Modes feel physical — like switching contexts on a keyboard." },
      { type: "p", text: "I built modes.css this way. It's smaller than a single React component. It debugs in DevTools without source maps. It works the same in a marketing page and a dashboard." },
    ],
  },
  {
    slug: "30kb-budget",
    date: "2024.11.27",
    title: "what i learned shipping under a 30kb budget",
    dek: "A landing page, fully interactive, dark-mode synced, in less JS than a single emoji-picker.",
    read: "11 min",
    tag: "performance",
    cover: coverPerf,
    blocks: [
      { type: "p", text: "I gave myself one rule for a client landing page rebuild: 30kb of JS, gzipped, total. Everything else had to be HTML, CSS, and SVG." },
      { type: "h2", text: "what survives the cut" },
      { type: "p", text: "Theme switcher. Keyboard nav. Mobile menu. Carousel. Everything else became a CSS scroll-snap region, a <details> element, or a link to a real page." },
      { type: "img", src: coverPerf, alt: "Server room with light trails", caption: "TTFB matters more than any optimisation you'll do in JS." },
      { type: "h2", text: "what it bought us" },
      { type: "p", text: "INP of 32ms on a Moto G Power. LCP under one second on cold cache from Singapore. Conversion rate up 18% in the first month." },
    ],
  },
  {
    slug: "keyboard-first",
    date: "2024.09.10",
    title: "keyboard-first interfaces are kind interfaces",
    dek: "Designing for the keyboard isn't a power-user concession. It's how you find out where your UI hides things.",
    read: "5 min",
    tag: "interaction",
    cover: coverKeyboard,
    blocks: [
      { type: "p", text: "Every time you make something keyboard-accessible, you're forced to give it a name, a focus state, and a predictable position in the document order. That's not just an a11y win — it's the same vocabulary you need for screen readers, automated tests, and your own future debugging." },
      { type: "img", src: coverKeyboard, alt: "Single keycap in dramatic light" },
      { type: "p", text: "Try this: navigate your own product, eyes closed, mouse unplugged. The places you get stuck are the places your design hasn't finished thinking yet." },
    ],
  },
  {
    slug: "design-systems-handoff",
    date: "2024.06.04",
    title: "design systems die in the handoff layer",
    dek: "The Figma file is fine. The Storybook is fine. The thing in between is where systems quietly rot.",
    read: "8 min",
    tag: "design systems",
    cover: coverHandoff,
    blocks: [
      { type: "p", text: "Every design system I've audited had two healthy artefacts and one sick one: a beautiful Figma library, a thorough component catalogue in code, and a translation layer between them that nobody owned." },
      { type: "img", src: coverHandoff, alt: "Open notebook on a desk" },
      { type: "h2", text: "who owns the gap" },
      { type: "p", text: "Name a person, not a team. Give them a calendar block every week. Without that, your tokens drift, your spacing scale grows a sixth value 'just for this one screen', and within six months your system is a museum." },
    ],
  },
];

export const POSTS = FALLBACK_POSTS;

export const getPost = (slug: string) => FALLBACK_POSTS.find((p) => p.slug === slug);