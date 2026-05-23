import { Metadata, ResolvingMetadata } from "next"
import { BlogsSection } from "@/components/sections/blogs"
import { notFound } from "next/navigation"
import { getDocument } from "@/lib/firestore"

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
    return {
      title: "Blog Not Found",
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${blog.title} | PETER SENESH FERNANDO`,
    description: String(blog.content).substring(0, 160),
    openGraph: {
      title: String(blog.title),
      description: String(blog.content).substring(0, 160),
      url: `https://senesh.dev/blogs/${id}`,
      siteName: "PETER SENESH FERNANDO Portfolio",
      images: blog.image_url
        ? [String(blog.image_url), ...previousImages]
        : previousImages,
      type: "article",
      publishedTime: String(blog.created_at ?? ""),
    },
    twitter: {
      card: "summary_large_image",
      title: String(blog.title),
      description: String(blog.content).substring(0, 160),
      images: blog.image_url ? [String(blog.image_url)] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const id = (await params).id
  const blog = await getBlog(id)

  if (!blog) {
    notFound()
  }

  return <BlogsSection autoOpenId={id} />
}
