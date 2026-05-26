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

export function HomePage({ featuredPost, projects }: { featuredPost: Post, projects: Project[] }) {
  useReveal();
  
  // Use top 3 projects for the swap
  const swapProjects = projects.slice(0, 3);

  return (
    <>
      <ScrollProgress />

      {/* HERO */}
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
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-36 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// welcome.start</div>
            <div>[MODE: VISITOR] · {PROFILE.title} · {PROFILE.location}</div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[8.5rem] font-semibold tracking-tight leading-[0.9]">
            <span className="caret">Senesh</span>
            <span className="block text-muted-foreground font-normal">Fernando.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed animate-fade-in-up">
            {PROFILE.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs">
            <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ projects</Link>
            <Link href="/writing" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ writing</Link>
            <Link href="/about" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ about</Link>
            <Link href="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
            <span className="px-3 py-1.5 text-muted-foreground">press <span className="kbd">?</span> for shortcuts</span>
          </div>
        </div>

        <MarqueeStrip items={[
          "open to collaborations", "Curtin University Colombo", "press ? for shortcuts",
          "g then h · home", "g then p · projects", "[MODE: VISITOR]",
          "data · AI · analytics", "Negombo, Sri Lanka",
        ]} />
      </section>

      {/* MANIFESTO IMAGE BAND */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 grid md:grid-cols-5 gap-10 items-end reveal">
        <div className="md:col-span-2 aspect-[4/5] overflow-hidden rounded-md bg-secondary group">
          <img
            src={IMAGES.indexHero}
            alt="Letterpress type on cream paper"
            width={1600}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
        </div>
        <div className="md:col-span-3 space-y-6">
          <div className="font-mono text-xs text-muted-foreground">// manifesto</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
            Data, decisions, and real-world impact.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            I believe curiosity, consistency, and compassion can create real impact.
            My work sits at the intersection of data science, software engineering,
            and building tools that help people make better decisions.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From AI-driven business analysis tools to dashboards and digital
            experiences for students and startups — I enjoy projects where
            technology meets creativity.
          </p>
        </div>
      </section>

      {/* SERVICES */}
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

      {/* FEATURED WRITING */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-6">
          <div className="font-mono text-xs text-muted-foreground">// from.the.journal</div>
          <Link href="/writing" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">all essays →</Link>
        </div>
        <Link href={`/writing/${featuredPost.slug}`} className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center">
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

      {/* FEATURED PROJECTS WITH CARDSWAP */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal relative">
        <div className="flex items-baseline justify-between mb-8">
          <div className="font-mono text-xs text-muted-foreground">// selected.projects</div>
          <Link href="/projects" className="font-mono text-xs link-hover px-2 py-1 rounded-sm border border-border">view more →</Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div>
             <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05] mb-6">
               Shaping data into stories.
             </h2>
             <p className="text-muted-foreground leading-relaxed mb-8">
               A collection of projects where I've applied data science, AI, and full-stack development to solve real problems.
             </p>
             <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs link-hover px-3 py-2 rounded-sm border border-border">
               Explore all projects →
             </Link>
          </div>
          
          <div className="relative h-[450px] w-full flex items-center justify-center">
            <CardSwap
              width="100%"
              height={300}
              cardDistance={30}
              verticalDistance={40}
              delay={4000}
            >
              {swapProjects.map((project) => (
                <Card key={project.slug} className="p-6 border border-border bg-card flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">{project.year} · {project.tag}</div>
                    <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{project.body}</p>
                  </div>
                  <Link href={`/projects/${project.slug}`} className="mt-4 font-mono text-xs text-primary hover:underline">
                    View project details →
                  </Link>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-32 reveal">
        <div className="border-t border-b border-border py-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.welcome</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Working on something in tech, education, or AI?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            I'm open to collaborations, projects, and conversations. Email or LinkedIn is the fastest way to reach me.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <Link href="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
            <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ see the work</Link>
          </div>
        </div>
      </section>
    </>
  );
}
