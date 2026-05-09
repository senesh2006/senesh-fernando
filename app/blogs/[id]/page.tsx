import { neon } from "@neondatabase/serverless"
import { Metadata, ResolvingMetadata } from 'next'
import { BlogsSection } from "@/components/sections/blogs"
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

async function getBlog(id: string) {
  const sql = neon(process.env.DATABASE_URL!)
  const blogs = await sql`SELECT * FROM blogs WHERE id = ${id}`
  return blogs[0]
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
  const blog = await getBlog(id)

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${blog.title} | PETER SENESH FERNANDO`,
    description: blog.content.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.substring(0, 160),
      url: `https://senesh.dev/blogs/${id}`, // Update with your actual domain
      siteName: 'PETER SENESH FERNANDO Portfolio',
      images: blog.image_url ? [blog.image_url, ...previousImages] : previousImages,
      type: 'article',
      publishedTime: blog.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.content.substring(0, 160),
      images: blog.image_url ? [blog.image_url] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const id = (await params).id
  const blog = await getBlog(id)

  if (!blog) {
    notFound()
  }

  // We reuse the BlogsSection but it will handle showing the modal for this specific blog
  return <BlogsSection autoOpenId={id} />
}
