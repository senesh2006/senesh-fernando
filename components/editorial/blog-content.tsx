"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import DOMPurify from "isomorphic-dompurify"
import { extractBlogHtml, looksLikeHtml } from "@/lib/blog-content"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  if (looksLikeHtml(content)) {
    const html = DOMPurify.sanitize(extractBlogHtml(content), {
      ADD_ATTR: ["class", "target", "rel", "href", "src", "alt"],
    })

    return (
      <div
        className="editorial-prose editorial-html"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="editorial-prose"
      components={{
        h2: ({ children }) => (
          <h2 className="font-serif text-3xl font-normal mt-16 mb-5">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-serif text-xl font-normal mt-10 mb-3">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <div className="pull-quote">
            <blockquote>{children}</blockquote>
          </div>
        ),
        pre: ({ children }) => <div className="code-block">{children}</div>,
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes("language-")
          if (isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
          return <code {...props}>{children}</code>
        },
        ul: ({ children }) => (
          <ul className="list-disc pl-6 space-y-2 my-6 text-foreground-muted">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 space-y-2 my-6 text-foreground-muted">{children}</ol>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue underline underline-offset-2"
          >
            {children}
          </a>
        ),
        hr: () => <div className="editorial-divider">· · ·</div>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
