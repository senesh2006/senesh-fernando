import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectDetailPage } from "@/components/pages/project-detail-page"
import { getProject, getProjects } from "@/lib/content"
import { fetchGitHubRepoData } from "@/lib/github"

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

  // Fetch real GitHub data if available
  if (project.repo && project.repo.includes("github.com")) {
    const gitData = await fetchGitHubRepoData(project.repo)
    if (gitData) {
      if (gitData.tree && gitData.tree.length > 0) {
        project.tree = gitData.tree
      }
      if (gitData.isPrivate !== undefined) {
        project.isPrivate = gitData.isPrivate
      }
      if (gitData.stats) {
        project.stats = {
          ...project.stats,
          ...gitData.stats,
        }
      }
    }
  }

  return <ProjectDetailPage project={project} projects={projects} />
}
