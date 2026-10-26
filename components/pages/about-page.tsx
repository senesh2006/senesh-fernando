"use client"

import { useEffect, useState } from "react"
import { IMAGES } from "@/lib/images"
import { PROFILE } from "@/lib/profile"
import {
  Container,
  CoverImage,
  Eyebrow,
  GhostLink,
  PrimaryLink,
  Reveal,
} from "@/components/site/redesign/ui"
import { SpotlightCard } from "@/components/site/redesign/fx"

interface GitHubSkill {
  name: string
  bytes: number
  icon: string | null
}

const TOOLS = [
  "React",
  "Next.js",
  "Node.js",
  "Tailwind",
  "PostgreSQL",
  "MySQL",
  "Git",
  "Docker",
  "Red Hat",
  "Tableau",
  "Power BI",
  "Jupyter",
  "VS Code",
]

const OTHER_SKILLS = [
  "Data Pipelines",
  "Data Science & Analytics",
  "Artificial Intelligence",
  "Machine Learning",
  "REST APIs",
  "Linux / RHEL",
  "Agile Project Management",
]

export function AboutPage({ timeline, stack }: { timeline: [string, string][]; stack: string[] }) {
  const [ghStack, setGhStack] = useState<string[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/github/skills")
      .then((r) => r.json())
      .then((data: { skills?: GitHubSkill[] }) => {
        if (cancelled || !data.skills?.length) return
        setGhStack(data.skills.map((s) => s.name))
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const languagePills = ghStack?.length ? ghStack : [...stack]
  const seen = new Set(languagePills.map((skill) => skill.toLowerCase()))
  const toolNames = Array.from(new Set([...stack, ...TOOLS, ...OTHER_SKILLS])).filter(
    (skill) => !seen.has(skill.toLowerCase()),
  )

  return (
    <>
      <Container as="section" className="grid items-center gap-10 pb-16 pt-28 sm:pt-36 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>{PROFILE.title}</Eyebrow>
          <h1 className="mt-4 text-[clamp(3.2rem,12vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            About
            <span className="gradient-text block font-serif font-normal italic">me.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I&apos;m Senesh — an IT undergraduate at Curtin University Colombo, based in Negombo. I work across data
            science, AI, and full-stack development, with a focus on tools that bridge data and decision-making.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{PROFILE.fullName}</p>
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
            <PrimaryLink href={PROFILE.github} external>
              GitHub
            </PrimaryLink>
            <GhostLink href={PROFILE.linkedin} external>
              LinkedIn
            </GhostLink>
            <GhostLink href="/Senesh_Fernando_CV.pdf" external>
              Download CV
            </GhostLink>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="float-y relative overflow-hidden rounded-[2rem] p-[2px]">
            <div className="spin-ring absolute opacity-90" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-secondary">
            <div className="aspect-square sm:aspect-[4/5]">
              <CoverImage
                src={IMAGES.portrait}
                alt="Senesh Fernando portrait"
                className="h-full w-full object-cover object-[center_18%]"
              />
            </div>
          </div>
          </div>
        </div>
      </Container>

      <Container as="section" className="max-w-3xl pb-20 sm:pb-28">
        <Reveal>
          <Eyebrow>Approach</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Bridging data and decision-making.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            {PROFILE.summary.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <Eyebrow>Timeline</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Experience & education.</h2>
          <ol className="mt-10 space-y-3">
            {timeline.map(([when, what], index) => (
              <li key={when}>
                <SpotlightCard className="glass-panel grid gap-2 rounded-3xl p-5 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                    0{index + 1} · {when}
                  </p>
                  <p className="text-base leading-relaxed">{what}</p>
                </SpotlightCard>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <Eyebrow>Stack {ghStack ? "· languages from GitHub" : ""}</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Skills and tools I work with.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            From data pipelines and analytics to full-stack web development and Linux system administration — always
            learning, always building.
          </p>
          <div className="mt-8 space-y-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Languages {ghStack ? "· from GitHub" : ""}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {languagePills.map((skill) => (
                  <li key={skill} className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tools & skills</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {toolNames.map((skill) => (
                  <li key={skill} className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <Eyebrow>Certifications</Eyebrow>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PROFILE.certifications.map((cert) => (
              <li key={cert}>
                <SpotlightCard className="glass-panel h-full rounded-3xl p-5 text-base leading-relaxed">
                  {cert}
                </SpotlightCard>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <Container as="section" className="pb-20 sm:pb-28">
        <Reveal>
          <Eyebrow>Values</Eyebrow>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <SpotlightCard className="glass-panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold">I care about</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li>data-driven decision making</li>
                <li>AI applied to real problems</li>
                <li>teaching and mentoring students</li>
                <li>curiosity, consistency, compassion</li>
              </ul>
            </SpotlightCard>
            <SpotlightCard className="glass-panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold">What drives me</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li>sustainability & environmental tech</li>
                <li>student & startup empowerment</li>
                <li>hackathons & competitions</li>
                <li>building things that create impact</li>
              </ul>
            </SpotlightCard>
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center shadow-[0_0_80px_-20px_color-mix(in_oklab,var(--accent)_50%,transparent)] backdrop-blur-md sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_55%)]" />
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Want the long version?</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Either browse the work, read the essays, or just say hello.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <PrimaryLink href="/projects">Projects</PrimaryLink>
              <GhostLink href="/writing">Writing</GhostLink>
              <GhostLink href="/contact">Contact</GhostLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  )
}
