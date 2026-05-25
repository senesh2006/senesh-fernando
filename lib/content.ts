import {
  listCollection,
  sortByDateDesc,
  sortByOrderThenDate,
  type FirestoreRecord,
} from "@/lib/firestore"
import {
  mapBackendBlog,
  mapBackendProject,
  mapExperienceToTimeline,
  mapSkillNames,
} from "@/lib/mappers"
import type { BackendBlog, BackendExperience, BackendProject, BackendSkill } from "@/lib/backend-types"
import { FALLBACK_PROJECTS } from "@/data/projects"
import { FALLBACK_POSTS } from "@/data/posts"
import type { Post } from "@/data/posts"
import type { Project } from "@/data/projects"

async function withFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await fetcher()
    if (Array.isArray(result) && result.length === 0) return fallback
    return result
  } catch (error) {
    console.warn("[content] falling back:", error)
    return fallback
  }
}

function asRecord<T extends FirestoreRecord>(rows: FirestoreRecord[]) {
  return rows as T[]
}

export async function getProjects(): Promise<Project[]> {
  return withFallback(async () => {
    const records = asRecord<BackendProject>(
      await listCollection("projects", sortByOrderThenDate)
    )
    return records.map(mapBackendProject)
  }, FALLBACK_PROJECTS)
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find((project) => project.slug === slug) ?? null
}

export async function getPosts(): Promise<Post[]> {
  return withFallback(async () => {
    const records = asRecord<BackendBlog>(await listCollection("blogs", sortByDateDesc))
    return records.map(mapBackendBlog)
  }, FALLBACK_POSTS)
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export async function getExperienceTimeline(): Promise<[string, string][]> {
  return withFallback(async () => {
    const records = asRecord<BackendExperience>(
      await listCollection("experience", sortByOrderThenDate)
    )
    return records.map(mapExperienceToTimeline)
  }, [])
}

export async function getSkillNames(): Promise<string[]> {
  return withFallback(async () => {
    const records = asRecord<BackendSkill>(await listCollection("skills", sortByOrderThenDate))
    return mapSkillNames(records)
  }, [])
}
