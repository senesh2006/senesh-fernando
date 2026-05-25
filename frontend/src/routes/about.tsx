import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { ScrollProgress } from "@/components/scroll-progress";
import { MarqueeStrip } from "@/components/marquee-strip";
import { RadialIntro, type OrbitItem } from "@/components/radial-intro";
import { fetchExperienceTimeline, fetchSkillNames } from "@/lib/api";
import portrait from "@/assets/portrait.jpg";

const FALLBACK_TIMELINE = [
  ["2025 —", "independent. consulting, open source, writing."],
  ["2022 — 2025", "staff engineer at a fintech infra company. design system + perf."],
  ["2019 — 2022", "founding engineer at two early-stage startups."],
  ["2016 — 2019", "agency life. shipped 30+ marketing & product sites."],
  ["2014 — 2016", "computer science at the University of Moratuwa."],
] as const;

const FALLBACK_STACK = ["TypeScript", "React", "TanStack", "Node", "Postgres", "Redis", "Cloudflare", "Tailwind", "CSS variables", "Vite", "Bun", "Rust (learning)"];

export const Route = createFileRoute("/about")({
  loader: async () => {
    const [timeline, skills] = await Promise.all([
      fetchExperienceTimeline(),
      fetchSkillNames(),
    ]);

    return {
      timeline: timeline.length > 0 ? timeline : [...FALLBACK_TIMELINE],
      stack: skills.length > 0 ? skills : [...FALLBACK_STACK],
    };
  },
  head: () => ({
    meta: [
      { title: "About — Senesh Fernando" },
      { name: "description", content: "About Senesh Fernando — background, approach, timeline, and how I work." },
      { property: "og:title", content: "About — Senesh Fernando" },
      { property: "og:description", content: "Background, approach, timeline, and how I work." },
      { property: "og:image", content: portrait },
    ],
  }),
  component: AboutLanding,
});

// simpleicons.org serves a black SVG per slug; `dark:invert` flips it for dark mode.
const ICON = (slug: string) => `https://cdn.simpleicons.org/${slug}/000000`;

const TECH_ORBIT: OrbitItem[] = [
  { id: "ts",       name: "TypeScript",  src: ICON("typescript") },
  { id: "react",    name: "React",       src: ICON("react") },
  { id: "tanstack", name: "TanStack",    src: ICON("reactquery") },
  { id: "node",     name: "Node",        src: ICON("nodedotjs") },
  { id: "pg",       name: "Postgres",    src: ICON("postgresql") },
  { id: "redis",    name: "Redis",       src: ICON("redis") },
  { id: "cf",       name: "Cloudflare",  src: ICON("cloudflare") },
  { id: "tw",       name: "Tailwind",    src: ICON("tailwindcss") },
  { id: "vite",     name: "Vite",        src: ICON("vite") },
  { id: "bun",       name: "Bun",         src: ICON("bun") },
  { id: "rust",     name: "Rust",        src: ICON("rust") },
  { id: "css",      name: "CSS",         src: ICON("css3") },
];

function AboutLanding() {
  useReveal();
  const { timeline: TIMELINE, stack: STACK } = Route.useLoaderData();
  return (
    <>
      <ScrollProgress />

      {/* HERO */}
      <section className="relative border-b border-border">
        <CursorSpotlight />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28 grid md:grid-cols-5 gap-10 items-end relative">
          <div className="md:col-span-3 space-y-6">
            <div className="font-mono text-xs text-muted-foreground stagger">
              <div>// about.landing</div>
              <div>[MODE: EXPLORING] · 10+ yrs shipping · still curious</div>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95]">
              <span className="caret">About.</span>
              <span className="block text-muted-foreground font-normal">A short field guide.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-in-up">
              I'm Senesh — a software engineer and designer working between
              Colombo and Berlin. Mostly between IDE and Figma, occasionally
              between problems and people.
            </p>
          </div>
          <div className="md:col-span-2 aspect-[3/4] overflow-hidden rounded-md bg-secondary group">
            <img
              src={portrait}
              alt="Senesh Fernando portrait"
              width={900}
              height={1200}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
            />
          </div>
        </div>
        <MarqueeStrip items={[
          "colombo / berlin", "available q3 2026", "[MODE: EXPLORING]",
          "currently reading — christopher alexander", "♪ deficit — mindvacy",
          "press ? for shortcuts",
        ]} />
      </section>

      {/* APPROACH */}
      <section className="mx-auto max-w-3xl px-5 sm:px-8 mt-24 sm:mt-32 space-y-6 reveal">
        <div className="font-mono text-xs text-muted-foreground">// approach</div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
          Most software is too large for what it does.
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          I work the other way: start from the smallest version that earns its
          place on the page, then add only when the cost is honest. The result
          is interfaces that load fast, behave predictably, and hold up under
          taste-driven critique.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          I lean on vanilla web standards wherever I can — CSS variables for
          theming, semantic HTML for accessibility, native ESM for delivery.
          Frameworks are tools, not religions.
        </p>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// timeline</div>
        <ol className="space-y-2 font-mono text-sm border-y border-border divide-y divide-border stagger">
          {TIMELINE.map(([when, what]) => (
            <li key={when} className="grid grid-cols-[8rem_1fr] gap-4 py-4 row-hover rounded-sm">
              <span className="text-muted-foreground">{when}</span>
              <span>{what}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* STACK */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 space-y-4">
            <div className="font-mono text-xs text-muted-foreground">// stack</div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">
              Tools i reach for, in roughly that order.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Boring on purpose. Each one earns its keep — fast feedback loops,
              honest defaults, a community that ships.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[11px]">
              {STACK.map((s) => (
                <span key={s} className="px-2 py-0.5 border border-border rounded-full text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
          <div className="md:col-span-7">
            <RadialIntro orbitItems={TECH_ORBIT} />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// values</div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4 font-mono text-sm stagger">
          <div>
            <div className="text-foreground mb-2">+ i care about</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>+ honest materials</li>
              <li>+ legibility, then everything else</li>
              <li>+ teams that disagree well</li>
              <li>+ shipping over rehearsing</li>
            </ul>
          </div>
          <div>
            <div className="text-foreground mb-2">- i avoid</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>- meetings that should've been a doc</li>
              <li>- design without an owner</li>
              <li>- frameworks treated as identity</li>
              <li>- 'just one more abstraction'</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-32 reveal">
        <div className="border-t border-b border-border py-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.about</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Want the long version?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">Either browse the work, read the essays, or just say hello.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <Link to="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ projects</Link>
            <Link to="/writing" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ writing</Link>
            <Link to="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}