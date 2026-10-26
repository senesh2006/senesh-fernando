"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { Post } from "@/data/posts"
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
import { SpotlightCard } from "@/components/site/redesign/fx"

export function WritingPage({ posts }: { posts: Post[] }) {
  const tags = useMemo(() => ["all", ...Array.from(new Set(posts.map((post) => post.tag)))], [posts])
  const [active, setActive] = useState("all")
  const visible = active === "all" ? posts : posts.filter((post) => post.tag === active)
  const [featured, ...rest] = visible
  const minutes = posts.reduce((sum, post) => sum + (parseInt(post.read, 10) || 0), 0)

  return (
    <>
      <Container as="section" className="pb-10 pt-28 sm:pt-36">
        <Eyebrow>
          {posts.length} essays · about {minutes} min
        </Eyebrow>
        <h1 className="mt-4 text-[clamp(3.2rem,12vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
          Field notes
          <span className="gradient-text font-serif font-normal italic">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Notes from studying IT at Curtin, co-founding CarbonWise, tutoring C and data structures, and figuring out
          how data becomes a decision someone can actually use.
        </p>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter essays">
          {tags.map((tag) => {
            const selected = tag === active
            return (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(tag)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm capitalize ${
                  selected ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </Container>

      {featured ? (
        <Container as="section" className="pb-16">
          <Reveal>
            <Eyebrow>Featured</Eyebrow>
            <SpotlightCard className="glass-panel mt-6 rounded-[1.75rem] p-3 sm:p-4">
            <Link href={`/writing/${featured.slug}`} className="group grid items-center gap-8 lg:grid-cols-2">
              <div className="overflow-hidden rounded-[1.75rem] border border-border bg-secondary">
                <div className="aspect-[16/10]">
                  <CoverImage
                    src={featured.cover}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {featured.date} · {featured.tag} · {featured.read}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  <TextArrow>{featured.title}</TextArrow>
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{featured.dek}</p>
                <div className="relative z-[3] mt-6">
                  <LikeButton id={featured.slug} type="blogs" size="sm" />
                </div>
              </div>
            </Link>
            </SpotlightCard>
          </Reveal>
        </Container>
      ) : (
        <Container as="section" className="pb-16">
          <p className="text-muted-foreground">No essays in this category yet.</p>
        </Container>
      )}

      {rest.length > 0 && (
        <Container as="section" id="all" className="pb-16">
          <Reveal>
            <div className="flex items-end justify-between">
              <Eyebrow>Archive</Eyebrow>
              <p className="font-mono text-xs text-muted-foreground">{rest.length} more</p>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <SpotlightCard key={post.slug} className="glass-panel group rounded-[1.4rem] p-3">
                  <Link href={`/writing/${post.slug}`} className="block overflow-hidden rounded-2xl border border-border bg-secondary">
                    <div className="aspect-[4/3]">
                      <CoverImage
                        src={post.cover}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                      />
                    </div>
                  </Link>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {post.date} · {post.tag} · {post.read}
                    </p>
                    <LikeButton id={post.slug} type="blogs" size="sm" variant="ghost" />
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                    <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="relative z-[3] mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.dek}</p>
                </SpotlightCard>
              ))}
            </div>
          </Reveal>
        </Container>
      )}

      <Container as="section" className="pb-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center shadow-[0_0_80px_-20px_color-mix(in_oklab,var(--accent)_50%,transparent)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_55%)]" />
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">That&apos;s the journal, for now.</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Essays on data, sustainability, teaching, and the things I&apos;m still learning.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <PrimaryLink href="/contact">Get in touch</PrimaryLink>
              <GhostLink href="/about">About</GhostLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  )
}
