"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { RadialIntro, type OrbitItem } from "@/components/site/radial-intro";
import { IMAGES } from "@/lib/images";
import { FireParticles } from "@/components/site/FireParticles";
import { PROFILE } from "@/lib/profile";

interface GitHubSkill {
  name: string;
  bytes: number;
  icon: string | null;
}

// simpleicons.org serves a black SVG per slug; `dark:invert` flips it for dark mode.
const ICON = (slug: string) => `https://cdn.simpleicons.org/${slug}/000000`;

// Curated frameworks / tools that GitHub's language stats don't surface.
const TOOLS: OrbitItem[] = [
  { id: "react",      name: "React",       src: ICON("react") },
  { id: "next",       name: "Next.js",     src: ICON("nextdotjs") },
  { id: "node",       name: "Node.js",     src: ICON("nodedotjs") },
  { id: "tailwindcss",name: "Tailwind",    src: ICON("tailwindcss") },
  { id: "postgresql", name: "PostgreSQL",  src: ICON("postgresql") },
  { id: "mysql",      name: "MySQL",       src: ICON("mysql") },
  { id: "git",        name: "Git",         src: ICON("git") },
  { id: "docker",     name: "Docker",      src: ICON("docker") },
  { id: "redhat",     name: "Red Hat",     src: ICON("redhat") },
  { id: "tableau",    name: "Tableau",     src: ICON("tableau") },
  { id: "powerbi",    name: "Power BI",    src: ICON("powerbi") },
  { id: "jupyter",    name: "Jupyter",     src: ICON("jupyter") },
  { id: "visualstudiocode", name: "VS Code", src: ICON("visualstudiocode") },
];

// Default orbit before GitHub data loads (Python/TS lead so it looks right pre-fetch).
const TECH_ORBIT: OrbitItem[] = [
  { id: "python", name: "Python",     src: ICON("python") },
  { id: "typescript", name: "TypeScript", src: ICON("typescript") },
  ...TOOLS,
];

// Skills / methodologies with no logo — shown as pills only.
const OTHER_SKILLS = [
  "Data Pipelines",
  "Data Science & Analytics",
  "Artificial Intelligence",
  "Machine Learning",
  "REST APIs",
  "Linux / RHEL",
  "Agile Project Management",
];

export function AboutPage({ timeline, stack }: { timeline: [string, string][]; stack: string[] }) {
  useReveal();

  // Pull real languages detected across the user's GitHub repos and fold any
  // logo-able ones into the orbit; falls back to the curated list on failure.
  const [orbit, setOrbit] = useState<OrbitItem[]>(TECH_ORBIT);
  const [ghStack, setGhStack] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github/skills")
      .then((r) => r.json())
      .then((data: { skills?: GitHubSkill[] }) => {
        if (cancelled || !data.skills?.length) return;

        // Ranked list of detected language names (for the pills).
        setGhStack(data.skills.map((s) => s.name));

        // Orbit = GitHub-detected languages (with logos) FIRST, then the
        // curated frameworks/tools, de-duped by icon slug, capped at 15.
        const detected: OrbitItem[] = data.skills
          .filter((s) => s.icon)
          .map((s) => ({ id: s.icon!, name: s.name, src: ICON(s.icon!) }));

        const seen = new Set<string>();
        const merged: OrbitItem[] = [];
        for (const item of [...detected, ...TOOLS]) {
          if (seen.has(item.id as string)) continue;
          seen.add(item.id as string);
          merged.push(item);
          if (merged.length >= 15) break;
        }
        setOrbit(merged);
      })
      .catch(() => {/* keep curated fallback */});
    return () => {
      cancelled = true;
    };
  }, []);

  // Pills: detected languages (from GitHub) + curated tools + non-logo skills.
  const languagePills = ghStack ?? stack;
  const toolNames = TOOLS.map((t) => t.name);

  return (
    <>
      <ScrollProgress />

      {/* HERO */}
      <section className="relative border-b border-border">
        <CursorSpotlight />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
          <FireParticles intensity={4} />
        </div>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28 grid md:grid-cols-5 gap-10 items-center relative">
          <div className="md:col-span-3 space-y-6">
            <div className="font-mono text-xs text-muted-foreground stagger">
              <div>// about.landing</div>
              <div>[MODE: EXPLORING] · {PROFILE.title} · still learning</div>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95]">
              <span className="caret">About.</span>
              <span className="block text-muted-foreground font-normal">A short field guide.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-in-up">
              I'm Senesh — an IT undergraduate at Curtin University Colombo, based in
              Negombo. I work across data science, AI, and full-stack development,
              with a focus on tools that bridge data and decision-making.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://github.com/senesh2006"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-border rounded-sm bg-background hover:bg-primary/10 hover:border-primary transition-all font-mono text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/peter-senesh-fernando/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-border rounded-sm bg-background hover:bg-primary/10 hover:border-primary transition-all font-mono text-sm"
              >
                LinkedIn
              </a>
              <a
                href="/Senesh_Fernando_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-border rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-mono text-sm shadow-sm"
              >
                Download CV
              </a>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-center items-start">
            <div className="w-64 h-64 overflow-hidden rounded-full bg-secondary group border border-border">
              <img
                src={IMAGES.portrait}
                alt="Senesh Fernando portrait"
                width={400}
                height={400}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
            </div>
          </div>

        </div>
        <MarqueeStrip items={[
          PROFILE.location, "Curtin University Colombo", "[MODE: EXPLORING]",
          "data pipelines · AI · analytics", "CarbonWise co-founder",
          "press ? for shortcuts",
        ]} />
      </section>

      {/* APPROACH */}
      <section className="mx-auto max-w-3xl px-5 sm:px-8 mt-24 sm:mt-32 space-y-6 reveal">
        <div className="font-mono text-xs text-muted-foreground">// approach</div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
          Bridging data and decision-making.
        </h2>
        {PROFILE.summary.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// timeline</div>
        <ol className="space-y-2 font-mono text-sm border-y border-border divide-y divide-border stagger">
          {timeline.map(([when, what]) => (
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
              Skills and tools I work with.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              From data pipelines and analytics to full-stack web development
              and Linux system administration — always learning, always building.
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  languages {ghStack ? "· from github" : ""}
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {languagePills.map((s) => (
                    <span key={s} className="px-2 py-0.5 border border-border rounded-full text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  tools &amp; skills
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {Array.from(new Set([...toolNames, ...OTHER_SKILLS])).map((s) => (
                    <span key={s} className="px-2 py-0.5 border border-border rounded-full text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <RadialIntro orbitItems={orbit} />
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// certifications</div>
        <ul className="space-y-2 font-mono text-sm border-y border-border divide-y divide-border stagger">
          {PROFILE.certifications.map((cert) => (
            <li key={cert} className="py-4 row-hover rounded-sm text-muted-foreground">
              + {cert}
            </li>
          ))}
        </ul>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// values</div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4 font-mono text-sm stagger">
          <div>
            <div className="text-foreground mb-2">+ i care about</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>+ data-driven decision making</li>
              <li>+ AI applied to real problems</li>
              <li>+ teaching and mentoring students</li>
              <li>+ curiosity, consistency, compassion</li>
            </ul>
          </div>
          <div>
            <div className="text-foreground mb-2">- what drives me</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>- sustainability & environmental tech</li>
              <li>- student & startup empowerment</li>
              <li>- hackathons & competitions</li>
              <li>- building things that create impact</li>
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
            <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ projects</Link>
            <Link href="/writing" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ writing</Link>
            <Link href="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}
