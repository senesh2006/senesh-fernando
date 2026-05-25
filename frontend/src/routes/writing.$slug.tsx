import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { fetchPost, fetchPosts, recordBlogView } from "@/lib/api";
import type { Post } from "@/data/posts";
import { ScrollProgress } from "@/components/scroll-progress";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/writing/$slug")({
  loader: async ({ params }) => {
    const [post, posts] = await Promise.all([
      fetchPost(params.slug),
      fetchPosts(),
    ]);
    if (!post) throw notFound();
    return { post, posts };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Not found" }] };
    return {
      meta: [
        { title: `${post.title} — Senesh Fernando` },
        { name: "description", content: post.dek },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.dek },
        { property: "og:image", content: post.cover },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: post.cover },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-32 text-center">
      <div className="font-mono text-xs text-muted-foreground mb-4">// 404.essay</div>
      <h1 className="text-4xl font-semibold tracking-tight">Essay not found.</h1>
      <Link to="/writing" className="inline-block mt-6 font-mono text-sm link-hover px-2 py-1 rounded-sm border border-border">← back to writing</Link>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  useReveal();
  const { post, posts } = Route.useLoaderData() as { post: Post; posts: Post[] };
  const idx = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[(idx + 1) % posts.length] ?? post;

  useEffect(() => {
    recordBlogView(post.slug).catch(() => undefined);
  }, [post.slug]);

  return (
    <>
      <ScrollProgress />
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-20">
        <Link to="/writing" className="font-mono text-xs text-muted-foreground link-hover px-1.5 py-0.5 rounded-sm">← writing</Link>

        <header className="mt-8 space-y-5 stagger">
          <div className="font-mono text-xs text-muted-foreground flex flex-wrap gap-3">
            <span>{post.date}</span><span>·</span>
            <span># {post.tag}</span><span>·</span>
            <span>{post.read} read</span>
            {typeof post.views === "number" && post.views > 0 && (
              <>
                <span>·</span>
                <span>{post.views} views</span>
              </>
            )}
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">{post.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{post.dek}</p>
        </header>

        <figure className="mt-12 -mx-5 sm:mx-0 reveal">
          <div className="overflow-hidden sm:rounded-md aspect-[16/10] bg-secondary">
            <img
              src={post.cover}
              alt={post.title}
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
        </figure>

        <div className="prose-custom mt-14 space-y-8">
          <PostBody post={post} />
        </div>

        <nav className="mt-24 border-t border-border pt-10 reveal">
          <div className="font-mono text-xs text-muted-foreground mb-3">// next.essay</div>
          <Link to="/writing/$slug" params={{ slug: next.slug }} className="group block">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              <span className="story-link">{next.title}</span> <span className="text-muted-foreground">→</span>
            </h3>
            <p className="mt-2 text-muted-foreground">{next.dek}</p>
          </Link>
        </nav>
      </article>
    </>
  );
}

function PostBody({ post }: { post: Post }) {
  if (post.contentHtml) {
    return (
      <div
        className="blog-html-content reveal space-y-6 text-[17px] leading-[1.8]"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    );
  }

  if (post.contentMarkdown) {
    return post.contentMarkdown
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((text, index) => (
        <p key={index} className="text-[17px] leading-[1.8] reveal">
          {text}
        </p>
      ));
  }

  if (post.blocks?.length) {
    return post.blocks.map((block, index) => {
      if (block.type === "p") {
        return (
          <p key={index} className="text-[17px] leading-[1.8] reveal">
            {block.text}
          </p>
        );
      }
      if (block.type === "h2") {
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-semibold tracking-tight mt-12 reveal">
            // {block.text}
          </h2>
        );
      }
      if (block.type === "quote") {
        return (
          <blockquote key={index} className="reveal border-l-2 border-foreground pl-6 my-10">
            <p className="text-xl sm:text-2xl font-medium leading-snug">"{block.text}"</p>
            {block.cite && (
              <footer className="mt-3 font-mono text-xs text-muted-foreground">{block.cite}</footer>
            )}
          </blockquote>
        );
      }
      if (block.type === "img") {
        return (
          <figure key={index} className="reveal -mx-5 sm:mx-0 my-12">
            <div className="overflow-hidden sm:rounded-md aspect-[16/10] bg-secondary">
              <img
                src={block.src}
                alt={block.alt}
                width={1600}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            {block.caption && (
              <figcaption className="mt-3 px-5 sm:px-0 font-mono text-xs text-muted-foreground">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      }
      return null;
    });
  }

  return null;
}
