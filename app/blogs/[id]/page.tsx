import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { getDocument } from "@/lib/firestore"
import { getAuthBaseUrl } from "@/lib/auth-url"
import { BlogArticle, type BlogArticleData } from "@/components/editorial/blog-article"
import { SiteFooter } from "@/components/site-footer"

interface Props {
  params: Promise<{ id: string }>
}

async function getBlog(id: string) {
  return getDocument("blogs", id)
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
  const blog = await getBlog(id)

  if (!blog) {
    return { title: "Blog Not Found" }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${blog.title} | PETER SENESH FERNANDO`,
    description: String(blog.content).substring(0, 160),
    openGraph: {
      title: String(blog.title),
      description: String(blog.content).substring(0, 160),
      url: `${getAuthBaseUrl()}/blogs/${id}`,
      siteName: "PETER SENESH FERNANDO Portfolio",
      images: blog.image_url
        ? [String(blog.image_url), ...previousImages]
        : previousImages,
      type: "article",
      publishedTime: String(blog.created_at ?? ""),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const id = (await params).id
  const blog = await getBlog(id)

  if (!blog) {
    notFound()
  }

  const article: BlogArticleData = {
    id: String(blog.id),
    title: String(blog.title),
    content: String(blog.content),
    category: String(blog.category),
    tags: Array.isArray(blog.tags) ? blog.tags.map(String) : [],
    image_url: blog.image_url ? String(blog.image_url) : null,
    github_url: blog.github_url ? String(blog.github_url) : null,
    linkedin_url: blog.linkedin_url ? String(blog.linkedin_url) : null,
    other_url: blog.other_url ? String(blog.other_url) : null,
    created_at: String(blog.created_at ?? ""),
    views: Number(blog.views ?? 0),
  }

  return (
    <>
      <BlogArticle blog={article} />
      <SiteFooter />
    </>
  )
}
