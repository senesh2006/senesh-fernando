"use client"

import Link from "next/link"
import type { Project } from "@/data/projects"
import { LikeButton } from "@/components/animate-ui/components/buttons/like-button"
import {
  Container,
  CoverImage,
  Eyebrow,
  GhostLink,
  PrimaryLink,
  Reveal,
  TextArrow,
} from "@/components/site/redesign/ui"

export function ProjectsPage({ projects }: { projects: Project[] }) {
  const [featured, ...rest] = projects

  return (
    <>
      <Container as="section" className="pb-12 pt-28 sm:pb-16 sm:pt-36">
        <Eyebrow>{projects.length} projects</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-[clamp(3rem,11vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
          Things I&apos;ve built,
          <span className="block font-serif font-normal italic text-muted-foreground">and stand behind.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Data tools, sustainability reporting, teaching resources, and full-stack experiments. Each one started with
          a real problem and a reason to ship it.
        </p>
      </Container>

      {featured && (
        <Container as="section" className="pb-16">
          <Reveal>
            <Eyebrow>Featured</Eyebrow>
            <article className="mt-6 grid items-center gap-8 lg:grid-cols-2">
              <Link href={`/projects/${featured.slug}`} className="group block overflow-hidden rounded-[1.75rem] border border-border bg-secondary">
                <div className="aspect-[16/10]">
                  <CoverImage
                    src={featured.cover}
                    alt={featured.name}
                    fallbackLabel={featured.name}
                    className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                  />
                </div>
              </Link>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {featured.n} · {featured.year} · {featured.tag} · {featured.status}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  <Link href={`/projects/${featured.slug}`} className="group">
                    <TextArrow>{featured.name}</TextArrow>
                  </Link>
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{featured.body}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {featured.pros.map((item) => (
                      <li key={item}>+ {item}</li>
                    ))}
                  </ul>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {featured.cons.map((item) => (
                      <li key={item}>− {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <PrimaryLink href={`/projects/${featured.slug}`}>Open case study</PrimaryLink>
                  <LikeButton id={featured.slug} type="projects" size="sm" />
                </div>
              </div>
            </article>
          </Reveal>
        </Container>
      )}

      {rest.length > 0 && (
        <Container as="section" className="pb-16">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <Eyebrow>All work</Eyebrow>
              <p className="font-mono text-xs text-muted-foreground">{rest.length} more</p>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {rest.map((project) => (
                <article key={project.slug} className="group">
                  <Link href={`/projects/${project.slug}`} className="block overflow-hidden rounded-[1.5rem] border border-border bg-secondary">
                    <div className="aspect-[16/10]">
                      <CoverImage
                        src={project.cover}
                        alt={project.name}
                        fallbackLabel={project.name}
                        className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                      />
                    </div>
                  </Link>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {project.year} · {project.tag}
                    </p>
                    <LikeButton id={project.slug} type="projects" size="sm" variant="ghost" />
                  </div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    <Link href={`/projects/${project.slug}`} className="group">
                      <TextArrow>{project.name}</TextArrow>
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </Container>
      )}

      <Container as="section" className="pb-8">
        <Reveal>
          <div className="rounded-[2rem] border border-border px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Have a project in mind?</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              I take on collaborations around data, AI, web development, and teaching alongside my studies.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <PrimaryLink href="/contact">Get in touch</PrimaryLink>
              <GhostLink href="/writing">Read the journal</GhostLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  )
}
