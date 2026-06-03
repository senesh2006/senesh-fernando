"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import Beams from "@/components/site/Beams";
import { IMAGES } from "@/lib/images";
import { PROFILE } from "@/lib/profile";
import type { Post } from "@/data/posts";
import type { Project } from "@/data/projects";
import CardSwap, { Card } from "@/components/site/CardSwap";

const SKILLS = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "C"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "REST APIs", "Firebase", "PostgreSQL"] },
  { category: "AI / ML", items: ["Google Gemini", "Anthropic API", "Prompt Engineering"] },
  { category: "Tools", items: ["Git / GitHub", "Figma", "Cursor", "VS Code"] },
];

export function HomePage({ featuredPost, projects }: { featuredPost: Post; projects: Project[] }) {
  useReveal();
  const swapProjects = projects.slice(0, 3);

  return (
    <>
      <ScrollProgress />

      {/* ── HERO ── */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Beams
            beamWidth={3}
            beamHeight={30}
            beamNumber={20}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>
        <CursorSpotlight />

        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-32 relative">
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
            {/* Left — text */}
            <div>
              <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
                <div>// welcome.start</div>
                <div>[MODE: VISITOR] · {PROFILE.title} · {PROFILE.location}</div>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-semibold tracking-tight leading-[0.9]">
                <span className="caret">Senesh</span>
                <span className="block text-muted-foreground font-normal">Fernando.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed animate-fade-in-up">
                {PROFILE.tagline}
              </p>

              {/* Quick stats */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground stagger">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Open to work
                </span>
                <span>3rd · Google Gemini track</span>
                <span>Co-founder · CarbonWise</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
                <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ projects</Link>
                <Link href="/writing" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ writing</Link>
                <Link href="/about" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ about</Link>
                <Link href="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
                <a href="/Senesh_Fernando_CV.pdf" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ cv</a>
              </div>
            </div>

            {/* Right — portrait */}
            <div className="hidden md:block">
              <div
                className="relative w-[220px] h-[270px] rounded-md overflow-hidden border border-border"
                style={{ boxShadow: "0 0 40px rgba(255,106,0,0.08), 0 0 80px rgba(255,106,0,0.04)" }}
              >
                <img
                  src={IMAGES.portrait}
                  alt="Senesh Fernando"
                  className="w-full h-full object-cover object-top"
                />
                {/* subtle orange gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 font-mono text-[9px] text-white/50">senesh.fernando</div>
              </div>
            </div>
          </div>
        </div>

        <MarqueeStrip items={[
          "open to collaborations", "Curtin University Colombo", "press ? for shortcuts",
          "g then h · home", "g then p · projects", "[MODE: VISITOR]",
          "data · AI · analytics", "Negombo, Sri Lanka",
        ]} />
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-8">// about.me</div>
        <div className="grid md:grid-cols-[1fr_280px] gap-10 md:gap-16">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I&apos;m <strong className="text-foreground">Senesh</strong> — an undergraduate developer from Sri Lanka who
              builds web applications, experiments with AI integrations, and occasionally ships things in
              24 hours that somehow impress judges.
            </p>
            <p>
              My approach is practical: understand the problem, pick the right tools, write clean code,
              and get something real in front of people. I care about architecture as much as aesthetics —
              a well-designed schema and a well-designed UI matter equally to me.
            </p>
            <p>
              I competed in the <strong className="text-foreground">Cursor 24hr Buildathon</strong> with SoloScale and
              placed <strong className="text-foreground">20th globally</strong> and{" "}
              <strong className="text-foreground">3rd in the Google Gemini track</strong> — with a product that wasn&apos;t
              even deployed. I also co-founded{" "}
              <strong className="text-foreground">CarbonWise</strong>, a sustainability reporting platform.
            </p>
          </div>

          {/* Facts */}
          <div className="border border-border rounded-sm p-5 font-mono text-xs space-y-3 h-fit">
            <div className="text-muted-foreground mb-4">// quick.facts</div>
            {[
              ["Status", <span key="s" className="text-green-500">Undergrad · Active</span>],
              ["Location", "Sri Lanka"],
              ["Focus", "Full-Stack · AI"],
              ["Best finish", "3rd · Google Gemini"],
              ["GitHub", "senesh2006"],
              ["Availability", <span key="a" className="text-green-500">Open to work</span>],
            ].map(([label, val]) => (
              <div key={String(label)} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground text-right">{val}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-border">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                → full profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-8">
          <div className="font-mono text-xs text-muted-foreground">// timeline</div>
          <Link href="/about" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">full story →</Link>
        </div>
        <div className="space-y-0 stagger">
          {PROFILE.timeline.map(([period, event], i) => (
            <div
              key={i}
              className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-8 border-t border-border py-5 group"
            >
              <div className="font-mono text-xs text-muted-foreground pt-0.5 whitespace-pre-line">{period}</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-8">// skills.stack</div>
        <div className="space-y-6 stagger">
          {SKILLS.map((group) => (
            <div key={group.category} className="grid sm:grid-cols-[160px_1fr] gap-3 sm:gap-8 border-t border-border pt-5">
              <div className="font-mono text-xs text-muted-foreground">{group.category}</div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs px-2.5 py-1 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-8">
          <div className="font-mono text-xs text-muted-foreground">// services.start</div>
          <Link href="/contact" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">→ enquire</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 stagger">
          {[
            { n: "01", title: "Data & analytics.", body: "Building data pipelines, dashboards, and analytics tools that turn raw information into actionable insights." },
            { n: "02", title: "AI-powered solutions.", body: "Developing AI-driven business analysis tools and exploring practical applications of machine learning." },
            { n: "03", title: "Full-stack development.", body: "Designing and shipping websites and web apps with React, TypeScript, and modern backends." },
            { n: "04", title: "Teaching & mentoring.", body: "Tutoring programming fundamentals, C, and data structures at Curtin University Colombo." },
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

      {/* ── SELECTED PROJECTS ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-8">
          <div className="font-mono text-xs text-muted-foreground">// selected.projects</div>
          <Link href="/projects" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">view all →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05] mb-6">
              Shaping data<br />into stories.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A collection of projects where I&apos;ve applied data science, AI, and full-stack
              development to solve real problems.
            </p>
            <div className="space-y-3 mb-8">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="flex items-center justify-between border-t border-border pt-3 group font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              ))}
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-xs link-hover px-3 py-2 rounded-sm border border-border"
            >
              Explore all projects →
            </Link>
          </div>
          <div className="relative h-[450px] w-full flex items-center justify-center">
            <CardSwap width="100%" height={300} cardDistance={30} verticalDistance={40} delay={4000}>
              {swapProjects.map((project) => (
                <Card
                  key={project.slug}
                  className="p-6 border border-border bg-card flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
                      {project.year} · {project.tag}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{project.body}</p>
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-4 font-mono text-xs text-primary hover:underline"
                  >
                    View project details →
                  </Link>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </section>

      {/* ── FEATURED WRITING ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-6">
          <div className="font-mono text-xs text-muted-foreground">// from.the.journal</div>
          <Link href="/writing" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">all essays →</Link>
        </div>
        <Link
          href={`/writing/${featuredPost.slug}`}
          className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center"
        >
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
            <div className="font-mono text-xs text-muted-foreground mb-3">
              {featuredPost.date} · {featuredPost.tag} · {featuredPost.read}
            </div>
            <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">
              <span className="story-link">{featuredPost.title}</span>
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">{featuredPost.dek}</p>
            <div className="mt-6 font-mono text-xs text-muted-foreground">→ continue reading</div>
          </div>
        </Link>
      </section>

      {/* ── PRINCIPLES ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// principles</div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6 font-mono text-sm stagger">
          <div>
            <div className="text-foreground mb-3">+ what i build for</div>
            <ul className="space-y-1.5 text-muted-foreground">
              {PROFILE.interests.map((item) => (
                <li key={item}>+ {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-foreground mb-3">- currently exploring</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>- deeper AI & ML applications</li>
              <li>- scalable data pipeline architecture</li>
              <li>- sustainability tech (CarbonWise)</li>
              <li>- hackathons & tech competitions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-32 pb-8 reveal">
        <div className="border-t border-b border-border py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.welcome</div>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                Working on something in tech, education, or AI?
              </h2>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I&apos;m open to collaborations, projects, and conversations.
                Email or LinkedIn is the fastest way to reach me.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <Link href="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
                <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ see the work</Link>
                <a href="/Senesh_Fernando_CV.pdf" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ download cv</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
