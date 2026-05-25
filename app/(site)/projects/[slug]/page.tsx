import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectDetailPage } from "@/components/pages/project-detail-page"
import { getProject, getProjects } from "@/lib/content"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: "Not found" }
  return {
    title: `${project.name} — Senesh Fernando`,
    description: project.body,
    openGraph: {
      title: project.name,
      description: project.body,
      images: [project.cover],
    },
    twitter: {
      card: "summary_large_image",
      images: [project.cover],
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [project, projects] = await Promise.all([getProject(slug), getProjects()])
  if (!project) notFound()
  return <ProjectDetailPage project={project} projects={projects} />
}
