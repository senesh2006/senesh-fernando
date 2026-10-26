"use client"

import Link from "next/link"
import { ArrowUpRight, CircleDot, ExternalLink, GitCommit, GitFork, Github, Scale, Star } from "lucide-react"
import type { Project } from "@/data/projects"
import { FilesTree } from "@/components/site/files-tree"
import { LikeButton } from "@/components/animate-ui/components/buttons/like-button"
import { ContentSummarizer } from "@/components/content-summarizer"
import { Container, CoverImage, Eyebrow, Reveal } from "@/components/site/redesign/ui"

const STATUS_COLOR: Record<Project["status"], string> = {
  shipping: "bg-emerald-400",
  maintained: "bg-sky-400",
  beta: "bg-amber-400",
  archived: "bg-muted-foreground",
}

export function ProjectDetailPage({ project, projects }: { project: Project; projects: Project[] }) {
  const idx = projects.findIndex((item) => item.slug === project.slug)
  const next = projects[(idx + 1) % projects.length]

  return (
    <article>
      <Container as="header" className="pb-8 pt-28 sm:pt-36">
        <Link href="/projects" className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">
          ← All projects
        </Link>
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>{project.n}</span>
              <span>{project.year}</span>
              <span>{project.tag}</span>
              <span className="inline-flex items-center gap-2 normal-case tracking-normal">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[project.status]}`} aria-hidden />
                {project.status}
              </span>
            </p>
            <h1 className="mt-4 text-[clamp(2.8rem,9vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              {project.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{project.body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm hover:bg-secondary"
            >
              <Github className="h-4 w-4" /> Repository
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background"
            >
              <ExternalLink className="h-4 w-4" /> Live demo
            </a>
            <LikeButton id={project.slug} type="projects" />
          </div>
        </div>
      </Container>

      <Container>
        <div className="overflow-hidden rounded-[1.75rem] border border-border bg-secondary">
          <div className="aspect-[16/9]">
            <CoverImage
              src={project.cover}
              alt={project.name}
              fallbackLabel={project.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Container>

      <Container as="section" className="py-10">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: Star, label: "Stars", value: project.stats.stars },
            { icon: GitFork, label: "Forks", value: project.stats.forks },
            { icon: CircleDot, label: "Open issues", value: project.stats.issues },
            { icon: Scale, label: "License", value: project.stats.license },
            { icon: GitCommit, label: "Last commit", value: project.stats.lastCommit },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-background px-4 py-5">
              <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <Icon className="h-3 w-3" aria-hidden /> {label}
              </dt>
              <dd className="mt-2 text-lg font-semibold tracking-tight">{value}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container as="section" className="grid gap-12 pb-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Eyebrow>About this project</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What it is, and why it exists.</h2>
          <p className="text-base leading-8 text-muted-foreground sm:text-[17px]">{project.longDescription}</p>
          <ContentSummarizer id={project.slug} type="projects" className="pt-2" />
          <div className="grid gap-6 sm:grid-cols-2">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {project.pros.map((item) => (
                <li key={item}>+ {item}</li>
              ))}
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {project.cons.map((item) => (
                <li key={item}>− {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Stack</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item} className="rounded-full border border-border px-3 py-1.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-5">
          <Eyebrow className="mb-3">Repository</Eyebrow>
          <FilesTree tree={project.tree} isPrivate={project.isPrivate} repo={project.repo} />
        </div>
      </Container>

      {project.gallery.length > 0 && (
        <Container as="section" className="py-12">
          <div className="flex items-end justify-between gap-4">
            <Eyebrow>Screenshots</Eyebrow>
            <p className="font-mono text-xs text-muted-foreground">{project.gallery.length} frames</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((src, index) => (
              <figure key={`${src}-${index}`} className="overflow-hidden rounded-2xl border border-border bg-secondary">
                <div className="aspect-[4/3]">
                  <CoverImage
                    src={src}
                    alt={`${project.name} screenshot ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      )}

      {next && next.slug !== project.slug && (
        <Container as="nav" className="pb-8 pt-6">
          <Reveal>
            <Link href={`/projects/${next.slug}`} className="group block border-t border-border pt-8">
              <Eyebrow>Next project</Eyebrow>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">{next.name}</h2>
                <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-3 max-w-2xl text-muted-foreground">{next.body}</p>
            </Link>
          </Reveal>
        </Container>
      )}
    </article>
  )
}
