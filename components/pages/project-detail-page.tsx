"use client";

import Link from "next/link";
import { Star, GitFork, CircleDot, Scale, GitCommit, ExternalLink, Github, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { FilesTree } from "@/components/site/files-tree";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { ProjectDetailShell } from "@/components/site/project-detail-shell";
import { useReveal } from "@/hooks/use-reveal";

const STATUS_COLOR: Record<Project["status"], string> = {
  shipping: "bg-emerald-500",
  maintained: "bg-blue-500",
  beta: "bg-amber-500",
  archived: "bg-muted-foreground",
};

export function ProjectDetailPage({ project, projects }: { project: Project; projects: Project[] }) {
  useReveal();
  const p = project;
  const PROJECTS = projects;
  const idx = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <>
      <ScrollProgress />
      <ProjectDetailShell>
      <article className="relative">
        {/* HERO */}
        <header className="mx-auto max-w-6xl px-5 sm:px-8 pt-8 sm:pt-12">
          <Link href="/projects" className="font-mono text-xs text-muted-foreground link-hover px-1.5 py-0.5 rounded-sm">← projects</Link>

          <div className="mt-8 grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8 stagger">
              <div className="font-mono text-xs text-muted-foreground flex flex-wrap items-center gap-3 mb-5">
                <span>{p.n}</span><span>·</span>
                <span>{p.year}</span><span>·</span>
                <span># {p.tag}</span><span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[p.status]} animate-pulse`} />
                  {p.status}
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[0.95]">
                <span className="caret">{p.name}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
            <div className="md:col-span-4 flex flex-wrap gap-2 font-mono text-xs">
              <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-sm link-hover">
                <Github className="h-3.5 w-3.5" /> repository
              </a>
              <a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-sm bg-foreground text-background hover:opacity-90 transition-opacity">
                <ExternalLink className="h-3.5 w-3.5" /> live demo
              </a>
            </div>
          </div>
        </header>

        {/* COVER */}
        <figure className="mx-auto max-w-6xl px-5 sm:px-8 mt-12 reveal">
          <div className="overflow-hidden rounded-md aspect-[16/9] bg-secondary border border-border">
            <img src={p.cover} alt={p.name} width={1920} height={1080} className="h-full w-full object-cover" />
          </div>
        </figure>

        {/* STATS STRIP */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-12 reveal">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-border border border-border rounded-md overflow-hidden">
            {[
              { icon: Star, label: "stars", value: p.stats.stars },
              { icon: GitFork, label: "forks", value: p.stats.forks },
              { icon: CircleDot, label: "open issues", value: p.stats.issues },
              { icon: Scale, label: "license", value: p.stats.license },
              { icon: GitCommit, label: "last commit", value: p.stats.lastCommit },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-background px-4 py-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Icon className="h-3 w-3" /> {label}
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DESCRIPTION + FILES */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 grid md:grid-cols-12 gap-10 reveal">
          <div className="md:col-span-7 space-y-6">
            <div className="font-mono text-xs text-muted-foreground">// about.project</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">What it is, and why it exists.</h2>
            <p className="text-[17px] leading-[1.8] text-muted-foreground">{p.longDescription}</p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-sm pt-2">
              <ul className="space-y-1">{p.pros.map((x) => <li key={x}><span className="text-foreground">+</span> <span className="text-muted-foreground">{x}</span></li>)}</ul>
              <ul className="space-y-1">{p.cons.map((x) => <li key={x}><span className="text-foreground">-</span> <span className="text-muted-foreground">{x}</span></li>)}</ul>
            </div>

            <div className="pt-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">// stack</div>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="font-mono text-xs px-2 py-1 border border-border rounded-sm bg-secondary/50">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="font-mono text-xs text-muted-foreground mb-3">// repo.tree</div>
            <FilesTree tree={p.tree} isPrivate={p.isPrivate} />
          </div>
        </section>

        {/* GALLERY */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 reveal">
          <div className="flex items-baseline justify-between mb-6">
            <div className="font-mono text-xs text-muted-foreground">// screenshots</div>
            <div className="font-mono text-xs text-muted-foreground">{p.gallery.length} frames</div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {p.gallery.map((src, i) => (
              <div key={i} className="group aspect-[4/3] overflow-hidden rounded-md bg-secondary border border-border relative">
                <img src={src} alt={`${p.name} screenshot ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                <div className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest bg-background/80 backdrop-blur px-1.5 py-0.5 rounded-sm">
                  {String(i + 1).padStart(2, "0")} / {String(p.gallery.length).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NEXT */}
        <nav className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 mb-24 border-t border-border pt-10 reveal">
          <div className="font-mono text-xs text-muted-foreground mb-3">// next.project</div>
          <Link href={`/projects/${next.slug}`} className="group flex items-baseline justify-between gap-6">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              <span className="story-link">{next.name}</span>
            </h3>
            <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
          <p className="mt-2 text-muted-foreground max-w-2xl">{next.body}</p>
        </nav>
      </article>
      </ProjectDetailShell>
    </>
  );
}
