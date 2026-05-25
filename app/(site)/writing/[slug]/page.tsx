import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WritingDetailPage } from "@/components/pages/writing-detail-page"
import { getPost, getPosts } from "@/lib/content"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Not found" }
  return {
    title: `${post.title} — Senesh Fernando`,
    description: post.dek,
    openGraph: {
      title: post.title,
      description: post.dek,
      images: [post.cover],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      images: [post.cover],
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [post, posts] = await Promise.all([getPost(slug), getPosts()])
  if (!post) notFound()
  return <WritingDetailPage post={post} posts={posts} />
}
