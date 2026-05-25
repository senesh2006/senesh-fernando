import { apiFetch } from "@/lib/api-client"
import type {
  BackendBlog,
  BackendEducation,
  BackendExperience,
  BackendProject,
  BackendSkill,
  ContactPayload,
} from "@/lib/backend-types"
import {
  mapBackendBlog,
  mapBackendProject,
  mapExperienceToTimeline,
  mapSkillNames,
} from "@/lib/mappers"
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
    console.warn("[api] falling back to static content:", error)
    return fallback
  }
}

export async function fetchProjects(): Promise<Project[]> {
  return withFallback(async () => {
    const records = await apiFetch<BackendProject[]>("/api/projects")
    return records.map(mapBackendProject)
  }, FALLBACK_PROJECTS)
}

export async function fetchProject(slug: string): Promise<Project | null> {
  const projects = await fetchProjects()
  return projects.find((project) => project.slug === slug) ?? null
}

export async function fetchPosts(): Promise<Post[]> {
  return withFallback(async () => {
    const records = await apiFetch<BackendBlog[]>("/api/blogs")
    return records.map(mapBackendBlog)
  }, FALLBACK_POSTS)
}

export async function fetchPost(slug: string): Promise<Post | null> {
  const posts = await fetchPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export async function fetchExperienceTimeline(): Promise<[string, string][]> {
  return withFallback(async () => {
    const records = await apiFetch<BackendExperience[]>("/api/experience")
    return records.map(mapExperienceToTimeline)
  }, [])
}

export async function fetchSkillNames(): Promise<string[]> {
  return withFallback(async () => {
    const records = await apiFetch<BackendSkill[]>("/api/skills")
    return mapSkillNames(records)
  }, [])
}

export async function fetchEducation(): Promise<BackendEducation[]> {
  return withFallback(async () => {
    return apiFetch<BackendEducation[]>("/api/education")
  }, [])
}

export async function submitContact(payload: ContactPayload) {
  return apiFetch<{ success: boolean }>("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function recordBlogView(id: string) {
  return apiFetch<{ views: number }>(`/api/blogs/${id}/views`, {
    method: "POST",
  })
}

export async function recordVisitor() {
  return apiFetch<{ totalViews: number; uniqueVisitors: number }>("/api/visitors", {
    method: "POST",
  })
}
