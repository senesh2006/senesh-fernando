"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import type { Post } from "@/data/posts";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { LikeButton } from "@/components/animate-ui/components/buttons/like-button";
import { AnimatedLiquidBackground } from "@/components/site/animated-liquid-background";

const TAGS = ["all", "data science", "startups", "education", "hackathons", "linux"];

export function WritingPage({ posts }: { posts: Post[] }) {
  useReveal();
  const [featured, ...rest] = posts;

  return (
    <>
      <ScrollProgress />

      {/* HERO */}
      <section className="border-b border-border relative">
        <CursorSpotlight />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <AnimatedLiquidBackground preset="Mist" speed={22} className="absolute inset-0" />
        </div>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-32 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// writing.landing</div>
            <div>[MODE: READING] · {posts.length} essays · est. {posts.reduce((s, p) => s + parseInt(p.read), 0)} min total</div>
          </div>

          {/* Main heading — isolated */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] max-w-5xl">
            <span className="caret">Field notes.</span>
          </h1>

          {/* Description — clearly separated, smaller, secondary */}
          <div className="mt-10 grid md:grid-cols-12 gap-6 items-start animate-fade-in-up">
            <div className="md:col-span-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground pt-1">
              ▍ desc
            </div>
            <p className="md:col-span-7 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              A decade of shipping software the slow, honest way. Essays on
              design systems, the modern web platform, performance budgets,
              and the unglamorous middle of building things — no newsletters,
              no popups, just text and the occasional photo.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs">
            {TAGS.map((t) => (
              <a key={t} href={`#${t}`} className="px-3 py-1.5 border border-border rounded-full link-hover">
                # {t}
              </a>
            ))}
          </div>
        </div>

        {/* Marquee strip */}
        <div className="overflow-hidden border-t border-border bg-secondary/40">
          <div className="marquee-track flex gap-12 whitespace-nowrap py-3 font-mono text-xs text-muted-foreground">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex gap-12 shrink-0">
                {["♪ deficit — mindvacy", "press ? for shortcuts", "j / k to scroll", "g w for writing index", "[MODE: READING]", "© senesh fernando", "no analytics. no cookies.", "rss available"].map((s) => (
                  <span key={s} className="flex items-center gap-3"><span>•</span>{s}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <SectionHeader
          tag="// featured.essay"
          title="Featured."
          desc="The current pick — the one I'd hand someone if they only had ten minutes."
          image={posts[1]?.cover}
        />
        <Link
          href={`/writing/${featured.slug}`}
          className="group block grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-8"
        >
          <div className="aspect-[4/3] overflow-hidden rounded-md bg-secondary relative">
            <img
              src={featured.cover}
              alt={featured.title}
              width={1600}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-background/80 backdrop-blur px-2 py-1 rounded-sm">
              ↗ read essay
            </div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted-foreground mb-3">{featured.date} · {featured.tag} · {featured.read}</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
              <span className="story-link">{featured.title}</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{featured.dek}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="font-mono text-xs text-muted-foreground">→ continue reading</div>
              <LikeButton id={featured.slug} type="blogs" size="sm" />
            </div>
          </div>
        </Link>
      </section>

      {/* ARCHIVE GRID */}
      <section id="all" className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <SectionHeader
          tag="// archive.all"
          title="Archive."
          desc="Everything else, newest first. Skim the tags, open whatever catches the eye."
          image={posts[2]?.cover}
          right={<span className="font-mono text-xs text-muted-foreground">{rest.length} more</span>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 stagger mt-8">
          {rest.map((p, i) => (
            <div key={p.slug} className="group block">
              <Link href={`/writing/${p.slug}`}>
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-secondary mb-4 relative">
                  <img
                    src={p.cover}
                    alt={p.title}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between font-mono text-[10px] uppercase tracking-widest text-background opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="bg-foreground px-2 py-1 rounded-sm">0{i + 2}</span>
                    <span className="bg-foreground px-2 py-1 rounded-sm">read ↗</span>
                  </div>
                </div>
              </Link>
              <div className="font-mono text-[11px] text-muted-foreground mb-2 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span>{p.date}</span>
                  <span>·</span>
                  <span># {p.tag}</span>
                  <span>·</span>
                  <span>{p.read}</span>
                </div>
                <LikeButton id={p.slug} type="blogs" size="sm" variant="ghost" />
              </div>
              <Link href={`/writing/${p.slug}`}>
                <h3 className="text-lg font-semibold leading-snug">
                  <span className="story-link">{p.title}</span>
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">{p.dek}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-32 sm:mt-40 reveal">
        <div className="border-t border-b border-border py-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.feed</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            That's everything, for now.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            New essays land roughly once a month. Subscribe by RSS or just bookmark this page — the URL won't change.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <a href="/rss.xml" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ rss feed</a>
            <Link href="/contact" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ get in touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  tag,
  title,
  desc,
  image,
  right,
}: {
  tag: string;
  title: string;
  desc: string;
  image?: string;
  right?: ReactNode;
}) {
  return (
    <div className="border-b border-border pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-xs text-muted-foreground">{tag}</div>
        {right}
      </div>
      <div className="grid md:grid-cols-12 gap-6 items-end">
        {image && (
          <div className="md:col-span-2 hidden md:block">
            <div className="aspect-square overflow-hidden rounded-md bg-secondary">
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.08]"
              />
            </div>
          </div>
        )}
        <h2 className={`${image ? "md:col-span-6" : "md:col-span-8"} text-4xl sm:text-5xl font-semibold tracking-tight leading-[1]`}>
          {title}
        </h2>
        <p className="md:col-span-4 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
          {desc}
        </p>
      </div>
    </div>
  );
}
