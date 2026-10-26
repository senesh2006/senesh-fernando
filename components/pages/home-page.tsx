"use client"

import Link from "next/link"
import { PROFILE } from "@/lib/profile"
import { IMAGES } from "@/lib/images"
import type { Post } from "@/data/posts"
import type { Project } from "@/data/projects"
import {
  Container,
  CoverImage,
  Eyebrow,
  GhostLink,
  PrimaryLink,
  Reveal,
  SkillMarquee,
  TextArrow,
} from "@/components/site/redesign/ui"
import { Counter, Parallax, SplitHeading, SpotlightCard } from "@/components/site/redesign/fx"

const SERVICES = [
  {
    n: "01",
    title: "Data & analytics.",
    body: "Building data pipelines, dashboards, and analytics tools that turn raw information into actionable insights.",
  },
  {
    n: "02",
    title: "AI-powered solutions.",
    body: "Developing AI-driven business analysis tools and exploring practical applications of machine learning.",
  },
  {
    n: "03",
    title: "Full-stack development.",
    body: "Designing and shipping websites and web apps with React, TypeScript, and modern backends.",
  },
  {
    n: "04",
    title: "Teaching & mentoring.",
    body: "Tutoring programming fundamentals, C, and data structures at Curtin University Colombo.",
  },
]

const EXPLORING = [
  "deeper AI & ML applications",
  "scalable data pipeline architecture",
  "sustainability tech (CarbonWise)",
  "hackathons & tech competitions",
]

export function HomePage({ featuredPost, projects }: { featuredPost: Post; projects: Project[] }) {
  const updated = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })

  return (
    <>
      <Container as="section" className="relative grid min-h-[calc(100svh-4rem)] items-center gap-10 pb-10 pt-24 sm:gap-12 sm:pt-28 lg:grid-cols-12 lg:pb-16">
        <div className="pointer-events-none absolute -left-10 top-24 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="lg:col-span-7">
          <Eyebrow>
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to collaborations · {PROFILE.location}
            </span>
          </Eyebrow>
          <SplitHeading
            className="mt-5 text-[clamp(3.4rem,13vw,7.1rem)] font-semibold leading-[0.88] tracking-[-0.05em]"
            lines={[
              { text: "Senesh" },
              { text: "Fernando.", className: "font-serif font-normal italic gradient-text" },
            ]}
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {PROFILE.tagline}
          </p>
          <p className="mt-3 text-sm text-foreground/80">{PROFILE.title}</p>
          <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:flex min-[420px]:flex-wrap">
            <PrimaryLink href="/projects" fill>View work</PrimaryLink>
            <GhostLink href="/contact" fill>Get in touch</GhostLink>
            <GhostLink href="/Senesh_Fernando_CV.pdf" external fill>
              Download CV
            </GhostLink>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              [projects.length, "Projects"],
              [PROFILE.skills.length, "Skills"],
              [PROFILE.certifications.length, "Certificates"],
            ].map(([value, label]) => (
              <SpotlightCard key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 backdrop-blur-md">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">
                  <Counter value={Number(value)} />
                </dd>
              </SpotlightCard>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5">
          <div className="float-y relative overflow-hidden rounded-[2rem] p-[2px]">
            <div className="spin-ring absolute opacity-90" />
            <div className="relative overflow-hidden rounded-[1.85rem] border border-white/10 bg-secondary shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
              <div className="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]">
                <CoverImage
                  src={IMAGES.portrait}
                  alt="Senesh Fernando"
                  className="h-full w-full object-cover object-[center_28%] lg:object-[center_22%]"
                  fallbackLabel="Senesh Fernando"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>{PROFILE.location}</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              Available
            </span>
          </div>
        </div>
      </Container>

      <SkillMarquee items={PROFILE.skills} />

      <Container as="section" className="py-20 sm:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Now · updated {updated}</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Currently.</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Studying", "BIT @ Curtin University Colombo"],
              ["02", "Building", "CarbonWise — sustainability & data reporting"],
              ["03", "Teaching", "C & DS&A as a tutor at Curtin"],
            ].map(([n, title, body]) => (
              <SpotlightCard key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
                <p className="font-mono text-xs text-accent">{n} · {title}</p>
                <p className="mt-3 text-lg font-medium leading-snug">{body}</p>
              </SpotlightCard>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="grid items-end gap-10 pb-20 sm:pb-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Parallax>
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-secondary shadow-[0_20px_80px_-30px_rgba(0,0,0,0.7)]">
              <div className="aspect-[4/5]">
                <CoverImage
                  src="https://i0.wp.com/lumenore.com/wp-content/uploads/2024/06/42-B.png?fit=720%2C400&ssl=1"
                  alt="Data and analytics visualization"
                  className="h-full w-full scale-110 object-cover"
                  fallbackLabel="Data and analytics"
                />
              </div>
            </div>
          </Parallax>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={0.08}>
          <Eyebrow>Manifesto</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.05]">
            Data, decisions, and real-world impact.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              I believe curiosity, consistency, and compassion can create real impact. My work sits at the
              intersection of data science, software engineering, and building tools that help people make better
              decisions.
            </p>
            <p>
              From AI-driven business analysis tools to dashboards and digital experiences for students and startups —
              I enjoy projects where technology meets creativity.
            </p>
          </div>
          <div className="mt-8">
            <GhostLink href="/about">Read the full story</GhostLink>
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Services</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">How I can help.</h2>
            </div>
            <GhostLink href="/contact">Enquire</GhostLink>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {SERVICES.map((service) => (
              <SpotlightCard key={service.n} className="glass-panel rounded-[1.75rem] p-6 sm:p-8">
                <p className="font-serif text-4xl italic gradient-text">{service.n}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{service.body}</p>
              </SpotlightCard>
            ))}
          </div>
        </Reveal>
      </Container>

      {featuredPost && (
        <Container as="section" className="pb-20 sm:pb-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>From the journal</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Latest writing.</h2>
              </div>
              <GhostLink href="/writing">All essays</GhostLink>
            </div>
            <SpotlightCard className="glass-panel mt-10 rounded-[1.75rem] p-3 sm:p-4">
            <Link
              href={`/writing/${featuredPost.slug}`}
              className="group grid items-center gap-8 lg:grid-cols-2"
            >
              <div className="overflow-hidden rounded-[1.75rem] border border-border bg-secondary">
                <div className="aspect-[16/10]">
                  <CoverImage
                    src={featuredPost.cover}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {featuredPost.date} · {featuredPost.tag} · {featuredPost.read}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
                  <TextArrow>{featuredPost.title}</TextArrow>
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{featuredPost.dek}</p>
              </div>
            </Link>
            </SpotlightCard>
          </Reveal>
        </Container>
      )}

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <Eyebrow>Principles</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">What I build for.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <SpotlightCard className="glass-panel rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold">What I build for</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {PROFILE.interests.map((item) => (
                  <li key={item} className="border-b border-border/70 pb-3 last:border-0">
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
            <SpotlightCard className="glass-panel rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold">Currently exploring</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {EXPLORING.map((item) => (
                  <li key={item} className="border-b border-border/70 pb-3 last:border-0">
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Selected projects</Eyebrow>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Shaping data into stories.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                A collection of projects where I&apos;ve applied data science, AI, and full-stack development to solve
                real problems.
              </p>
            </div>
            <GhostLink href="/projects">View more</GhostLink>
          </div>
          <div className="mt-10 space-y-6">
            {projects.slice(0, 3).map((project, index) => (
              <SpotlightCard
                key={project.slug}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md sm:p-4"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group grid gap-5 lg:grid-cols-12 lg:items-center"
                >
                  <div className="overflow-hidden rounded-2xl bg-secondary lg:col-span-7">
                    <div className="aspect-[16/10]">
                      <CoverImage
                        src={project.cover}
                        alt={project.name}
                        fallbackLabel={project.name}
                        className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.06]"
                      />
                    </div>
                  </div>
                  <div className="relative z-[3] px-2 pb-3 lg:col-span-5 lg:px-4">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {project.n} · {project.year} · {project.tag}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                      <TextArrow>{project.name}</TextArrow>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{project.body}</p>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                      0{index + 1} / case study
                    </p>
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center shadow-[0_0_80px_-20px_color-mix(in_oklab,var(--accent)_50%,transparent)] backdrop-blur-md sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_55%)]" />
            <Eyebrow>Let&apos;s talk</Eyebrow>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Working on something in tech, education, or AI?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              I&apos;m open to collaborations, projects, and conversations. Email or LinkedIn is the fastest way to
              reach me.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
              <PrimaryLink href="/contact">Get in touch</PrimaryLink>
              <GhostLink href="/projects">See the work</GhostLink>
              <GhostLink href="/Senesh_Fernando_CV.pdf" external>
                Download CV
              </GhostLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  )
}
