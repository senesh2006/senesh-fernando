import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { ScrollProgress } from "@/components/scroll-progress";
import { MarqueeStrip } from "@/components/marquee-strip";
import projectsHero from "@/assets/projects-hero.jpg";
import { fetchProjects } from "@/lib/api";
import { FALLBACK_PROJECTS } from "@/data/projects";

export const Route = createFileRoute("/projects")({
  loader: async () => {
    const projects = await fetchProjects();
    return { projects: projects.length > 0 ? projects : FALLBACK_PROJECTS };
  },
  head: () => ({
    meta: [
      { title: "Projects — Senesh Fernando" },
      { name: "description", content: "Selected open source, client work, and experiments by Senesh Fernando." },
      { property: "og:title", content: "Projects — Senesh Fernando" },
      { property: "og:description", content: "Selected open source, client work, and experiments." },
      { property: "og:image", content: projectsHero },
    ],
  }),
  component: ProjectsLanding,
});

function ProjectsLanding() {
  useReveal();
  const { projects: PROJECTS } = Route.useLoaderData();
  const [featured, ...rest] = PROJECTS;
  return (
    <>
      <ScrollProgress />

      {/* HERO */}
      <section className="relative border-b border-border">
        <CursorSpotlight />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// projects.landing</div>
            <div>[MODE: EXPLORING] · {PROJECTS.length} projects · est. 10 yrs of work</div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] max-w-5xl">
            <span className="caret">Things i've built,</span>
            <span className="block text-muted-foreground">and stand behind.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-fade-in-up">
            A mix of open-source libraries, design experiments, and client
            projects. Each one is built around a single sharp question and
            shipped only after it earned the shipping.
          </p>
        </div>
        <MarqueeStrip items={[
          "TypeScript", "React", "TanStack", "Node", "Postgres", "Redis",
          "Cloudflare", "Tailwind CSS", "CSS variables", "Vite", "Bun", "Rust",
        ]} />
      </section>

      {/* FEATURED PROJECT */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// featured.project</div>
        <article className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <Link to="/projects/$slug" params={{ slug: featured.slug }} className="group aspect-[4/3] overflow-hidden rounded-md bg-secondary relative block">
            <img
              src={featured.cover}
              alt={featured.name}
              width={1600}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-background/80 backdrop-blur px-2 py-1 rounded-sm">
              ↗ case study
            </div>
          </Link>
          <div>
            <div className="font-mono text-xs text-muted-foreground mb-3">{featured.n} · {featured.year} · {featured.tag}</div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
              <Link to="/projects/$slug" params={{ slug: featured.slug }} className="story-link">{featured.name}</Link>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{featured.body}</p>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-sm">
              <ul className="space-y-1">{featured.pros.map((x) => <li key={x}><span className="text-foreground">+</span> <span className="text-muted-foreground">{x}</span></li>)}</ul>
              <ul className="space-y-1">{featured.cons.map((x) => <li key={x}><span className="text-foreground">-</span> <span className="text-muted-foreground">{x}</span></li>)}</ul>
            </div>
            <div className="mt-6">
              <Link to="/projects/$slug" params={{ slug: featured.slug }} className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border border-border rounded-sm link-hover">
                → open case study
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-6">
          <div className="font-mono text-xs text-muted-foreground">// archive.all</div>
          <div className="font-mono text-xs text-muted-foreground">{rest.length} more</div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 stagger">
          {rest.map((p) => (
            <Link key={p.slug} to="/projects/$slug" params={{ slug: p.slug }} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-secondary mb-4 relative">
                <img
                  src={p.cover}
                  alt={p.name}
                  width={1600}
                  height={1000}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between font-mono text-[10px] uppercase tracking-widest text-background opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="bg-foreground px-2 py-1 rounded-sm">{p.n}</span>
                  <span className="bg-foreground px-2 py-1 rounded-sm">view ↗</span>
                </div>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground mb-2 flex gap-2 items-center">
                <span>{p.year}</span><span>·</span><span># {p.tag}</span>
              </div>
              <h3 className="text-lg font-semibold leading-snug"><span className="story-link">{p.name}</span></h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">{p.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-32 reveal">
        <div className="border-t border-b border-border py-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.list</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Have a project worth a sharp question?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">I take on one or two new engagements per quarter.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <Link to="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
            <Link to="/writing" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ read the journal</Link>
          </div>
        </div>
      </section>
    </>
  );
}