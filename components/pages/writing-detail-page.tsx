"use client"

import Link from "next/link"
import { useEffect } from "react"
import type { Post } from "@/data/posts"
import { LikeButton } from "@/components/animate-ui/components/buttons/like-button"
import { ContentSummarizer } from "@/components/content-summarizer"
import { recordBlogView } from "@/lib/client-api"
import { cn } from "@/lib/utils"
import { Container, CoverImage, Eyebrow } from "@/components/site/redesign/ui"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

export function WritingDetailPage({ post, posts }: { post: Post; posts: Post[] }) {
  const idx = posts.findIndex((item) => item.slug === post.slug)
  const next = posts[(idx + 1) % posts.length] ?? post

  useEffect(() => {
    recordBlogView(post.slug).catch(() => undefined)
  }, [post.slug])

  return (
    <article>
      <Container className="max-w-3xl pb-8 pt-28 sm:pt-36">
        <Link href="/writing" className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">
          ← Writing
        </Link>
        <header className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span>{post.date}</span>
            <span>{post.tag}</span>
            <span>{post.read} read</span>
            {typeof post.views === "number" && post.views > 0 && <span>{post.views} views</span>}
            <LikeButton id={post.slug} type="blogs" size="sm" variant="ghost" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">{post.title}</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">{post.dek}</p>
          {post.tags && post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <ContentSummarizer id={post.slug} type="writing" className="pt-2" />
        </header>
      </Container>

      <Container className="max-w-3xl">
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-secondary">
          <div className="aspect-[16/10]">
            <CoverImage src={post.cover} alt={post.title} className="h-full w-full object-cover" />
          </div>
        </div>
      </Container>

      <Container className="max-w-3xl py-12">
        <div className="space-y-6 text-[17px] leading-8 text-foreground/90">
          <PostBody post={post} />
        </div>
      </Container>

      {next.slug !== post.slug && (
        <Container className="max-w-3xl pb-8">
          <Link href={`/writing/${next.slug}`} className="group block border-t border-border pt-8">
            <Eyebrow>Next essay</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{next.title}</h2>
            <p className="mt-2 text-muted-foreground">{next.dek}</p>
          </Link>
        </Container>
      )}
    </article>
  )
}

function PostBody({ post }: { post: Post }) {
  if (post.contentHtml) {
    return (
      <div
        className="blog-html-content space-y-6 text-[17px] leading-[1.8]"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    )
  }

  if (post.contentMarkdown) {
    return (
      <div className="space-y-6 text-[17px] leading-[1.8]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            h2: ({ ...props }) => (
              <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight sm:text-3xl" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="mt-10 mb-4 text-xl font-semibold tracking-tight sm:text-2xl" {...props} />
            ),
            p: ({ ...props }) => <p className="mb-6" {...props} />,
            ul: ({ ...props }) => <ul className="mb-6 list-disc space-y-2 pl-6" {...props} />,
            ol: ({ ...props }) => <ol className="mb-6 list-decimal space-y-2 pl-6" {...props} />,
            li: ({ ...props }) => <li {...props} />,
            blockquote: ({ ...props }) => (
              <blockquote className="my-10 border-l-2 border-foreground pl-6 text-xl italic" {...props} />
            ),
            img: ({ alt, src }) => (
              <figure className="my-12">
                <div className="overflow-hidden rounded-2xl bg-secondary">
                  {src ? <img src={src} alt={alt || ""} className="h-full w-full object-cover" loading="lazy" /> : null}
                </div>
                {alt && <figcaption className="mt-3 text-center font-mono text-xs text-muted-foreground">{alt}</figcaption>}
              </figure>
            ),
            code: ({ className, children, ...props }) => (
              <code className={cn("rounded bg-secondary px-1.5 py-0.5 font-mono text-sm", className)} {...props}>
                {children}
              </code>
            ),
          }}
        >
          {post.contentMarkdown}
        </ReactMarkdown>
      </div>
    )
  }

  if (post.blocks?.length) {
    return post.blocks.map((block, index) => {
      if (block.type === "p") {
        return (
          <p key={index} className="text-[17px] leading-[1.8]">
            {block.text}
          </p>
        )
      }
      if (block.type === "h2") {
        return (
          <h2 key={index} className="mt-12 text-2xl font-semibold tracking-tight sm:text-3xl">
            {block.text}
          </h2>
        )
      }
      if (block.type === "quote") {
        return (
          <blockquote key={index} className="my-10 border-l-2 border-foreground pl-6">
            <p className="text-xl font-medium leading-snug sm:text-2xl">&ldquo;{block.text}&rdquo;</p>
            {block.cite && <footer className="mt-3 font-mono text-xs text-muted-foreground">{block.cite}</footer>}
          </blockquote>
        )
      }
      if (block.type === "img") {
        return (
          <figure key={index} className="my-12">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
              <img src={block.src} alt={block.alt} width={1600} height={1000} loading="lazy" className="h-full w-full object-cover" />
            </div>
            {block.caption && <figcaption className="mt-3 font-mono text-xs text-muted-foreground">{block.caption}</figcaption>}
          </figure>
        )
      }
      return null
    })
  }

  return null
}
