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
      <Container as="section" className="grid items-center gap-10 pb-14 pt-24 sm:gap-12 sm:pb-16 sm:pt-32 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-36">
        <div className="lg:col-span-7">
          <Eyebrow>Open to collaborations · {PROFILE.location}</Eyebrow>
          <h1 className="mt-5 text-[clamp(3.15rem,14vw,6.75rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
            Senesh
            <span className="block font-serif font-normal italic text-muted-foreground">Fernando.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {PROFILE.tagline}
          </p>
          <p className="mt-3 text-sm text-foreground/80">{PROFILE.title}</p>
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
            <PrimaryLink href="/projects">View work</PrimaryLink>
            <GhostLink href="/contact">Get in touch</GhostLink>
            <GhostLink href="/Senesh_Fernando_CV.pdf" external>
              Download CV
            </GhostLink>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-secondary">
            <div className="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]">
              <CoverImage
                src={IMAGES.portrait}
                alt="Senesh Fernando"
                className="h-full w-full object-cover object-[center_28%] lg:object-[center_22%]"
                fallbackLabel="Senesh Fernando"
              />
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
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Studying", "BIT @ Curtin University Colombo"],
              ["Building", "CarbonWise — sustainability & data reporting"],
              ["Teaching", "C & DS&A as a tutor at Curtin"],
            ].map(([title, body]) => (
              <li key={title} className="rounded-3xl border border-border bg-card/70 p-6">
                <p className="text-sm text-accent">{title}</p>
                <p className="mt-3 text-lg font-medium leading-snug">{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <Container as="section" className="grid items-end gap-10 pb-20 sm:pb-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-secondary">
            <div className="aspect-[4/5]">
              <CoverImage
                src="https://i0.wp.com/lumenore.com/wp-content/uploads/2024/06/42-B.png?fit=720%2C400&ssl=1"
                alt="Data and analytics visualization"
                className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                fallbackLabel="Data and analytics"
              />
            </div>
          </div>
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
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {SERVICES.map((service) => (
              <li
                key={service.n}
                className="grid gap-3 py-6 transition-colors sm:grid-cols-[4rem_1fr] sm:gap-6 sm:py-8 md:grid-cols-[4rem_16rem_1fr] md:items-baseline"
              >
                <span className="font-mono text-xs text-muted-foreground">{service.n}</span>
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{service.body}</p>
              </li>
            ))}
          </ul>
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
            <Link
              href={`/writing/${featuredPost.slug}`}
              className="group mt-10 grid items-center gap-8 lg:grid-cols-2"
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
          </Reveal>
        </Container>
      )}

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <Eyebrow>Principles</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">What I build for.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border p-6 sm:p-8">
              <h3 className="text-lg font-semibold">What I build for</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {PROFILE.interests.map((item) => (
                  <li key={item} className="border-b border-border/70 pb-3 last:border-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border p-6 sm:p-8">
              <h3 className="text-lg font-semibold">Currently exploring</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {EXPLORING.map((item) => (
                  <li key={item} className="border-b border-border/70 pb-3 last:border-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
            {projects.slice(0, 3).map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group grid gap-5 rounded-[1.75rem] border border-border p-3 transition-colors hover:bg-card/60 sm:p-4 lg:grid-cols-12 lg:items-center"
              >
                <div className="overflow-hidden rounded-2xl bg-secondary lg:col-span-7">
                  <div className="aspect-[16/10]">
                    <CoverImage
                      src={project.cover}
                      alt={project.name}
                      fallbackLabel={project.name}
                      className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                </div>
                <div className="px-2 pb-3 lg:col-span-5 lg:px-4">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {project.n} · {project.year} · {project.tag}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    <TextArrow>{project.name}</TextArrow>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{project.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-12">
        <Reveal>
          <div className="rounded-[2rem] border border-border bg-card/50 px-6 py-14 text-center sm:px-12 sm:py-20">
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
