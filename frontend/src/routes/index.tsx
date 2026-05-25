import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { ScrollProgress } from "@/components/scroll-progress";
import { MarqueeStrip } from "@/components/marquee-strip";
import { fetchPosts } from "@/lib/api";
import { FALLBACK_POSTS } from "@/data/posts";
import indexHero from "@/assets/index-hero.jpg";

export const Route = createFileRoute("/")({
  loader: async () => {
    const posts = await fetchPosts();
    return { featuredPost: posts[0] ?? FALLBACK_POSTS[0] };
  },
  head: () => ({
    meta: [
      { title: "Senesh Fernando — Engineer / Designer" },
      { name: "description", content: "Senesh Fernando — software engineer and designer building fast, opinionated, well-mannered software." },
      { property: "og:title", content: "Senesh Fernando — Engineer / Designer" },
      { property: "og:description", content: "Software engineer and designer building fast, opinionated, well-mannered software." },
      { property: "og:image", content: indexHero },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  useReveal();
  const { featuredPost } = Route.useLoaderData();
  return (
    <>
      <ScrollProgress />

      {/* HERO */}
      <section className="relative border-b border-border">
        <CursorSpotlight />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-36 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// welcome.start</div>
            <div>[MODE: VISITOR] · est. 1991 · based in Colombo / Berlin</div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[8.5rem] font-semibold tracking-tight leading-[0.9]">
            <span className="caret">Senesh</span>
            <span className="block text-muted-foreground font-normal">Fernando.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed animate-fade-in-up">
            Software engineer & designer building fast, opinionated, well-mannered
            interfaces. I work across product, infrastructure, and design systems
            for small teams with a strong point of view.
          </p>
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs">
            <Link to="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ projects</Link>
            <Link to="/writing" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ writing</Link>
            <Link to="/about" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ about</Link>
            <Link to="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
            <span className="px-3 py-1.5 text-muted-foreground">press <span className="kbd">?</span> for shortcuts</span>
          </div>
        </div>

        <MarqueeStrip items={[
          "available q3 2026", "♪ deficit — mindvacy", "press ? for shortcuts",
          "g then h · home", "g then p · projects", "[MODE: VISITOR]",
          "no analytics. no cookies.", "built minimal — zero dependencies",
        ]} />
      </section>

      {/* MANIFESTO IMAGE BAND */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 grid md:grid-cols-5 gap-10 items-end reveal">
        <div className="md:col-span-2 aspect-[4/5] overflow-hidden rounded-md bg-secondary group">
          <img
            src={indexHero}
            alt="Letterpress type on cream paper"
            width={1600}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
        </div>
        <div className="md:col-span-3 space-y-6">
          <div className="font-mono text-xs text-muted-foreground">// manifesto</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
            Less software, set with more care.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            I treat a product the way a typographer treats a page. Deliberate
            spacing. No decorative weight. Every element earning its position.
            The result is interfaces that load fast, behave predictably, and
            hold up under taste-driven critique.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            That philosophy runs from the design system tokens down through
            the database query plan. It's the same conversation.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-8">
          <div className="font-mono text-xs text-muted-foreground">// services.start</div>
          <Link to="/contact" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">→ enquire</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 stagger">
          {[
            { n: "01", title: "Product engineering.", body: "Full-stack delivery on TypeScript / React / Postgres. From spec to ship, with an eye on performance budgets." },
            { n: "02", title: "Design systems.", body: "Token-first, framework-agnostic. Opinionated defaults that scale across product, marketing, and docs." },
            { n: "03", title: "Performance audits.", body: "Lighthouse, INP, CLS, server response times. I find the bottleneck and remove it." },
            { n: "04", title: "Technical advisory.", body: "Architecture reviews, hiring panels, code reviews. Senior input without a full-time hire." },
          ].map((s) => (
            <div key={s.n} className="border-t border-border pt-5 row-hover rounded-sm">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                <h3 className="font-semibold text-lg">{s.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WRITING */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-6">
          <div className="font-mono text-xs text-muted-foreground">// from.the.journal</div>
          <Link to="/writing" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">all essays →</Link>
        </div>
        <Link to="/writing/$slug" params={{ slug: featuredPost.slug }} className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="aspect-[4/3] overflow-hidden rounded-md bg-secondary">
            <img
              src={featuredPost.cover}
              alt={featuredPost.title}
              width={1600}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground mb-3">{featuredPost.date} · {featuredPost.tag} · {featuredPost.read}</div>
            <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">
              <span className="story-link">{featuredPost.title}</span>
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">{featuredPost.dek}</p>
            <div className="mt-6 font-mono text-xs text-muted-foreground">→ continue reading</div>
          </div>
        </Link>
      </section>

      {/* PRINCIPLES */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// principles</div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6 font-mono text-sm stagger">
          <div>
            <div className="text-foreground mb-3">+ what i build for</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>+ tiny, sharp tools that do one thing well</li>
              <li>+ interfaces that feel instant under thumb</li>
              <li>+ teams that ship weekly, not quarterly</li>
              <li>+ products with a strong point of view</li>
            </ul>
          </div>
          <div>
            <div className="text-foreground mb-3">- what i don't do</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>- engagement-maximised dark patterns</li>
              <li>- 600kb of JS to render a marketing page</li>
              <li>- design-by-committee with no taste owner</li>
              <li>- crypto / surveillance ad-tech</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-32 reveal">
        <div className="border-t border-b border-border py-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.welcome</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Have something worth building?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            One or two new engagements per quarter. Email is the fastest way in.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <Link to="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
            <Link to="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ see the work</Link>
          </div>
        </div>
      </section>
    </>
  );
}