import type { ContactPayload } from "@/lib/backend-types"

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      typeof body.error === "string" ? body.error : `Request failed (${response.status})`
    )
  }

  return response.json() as Promise<T>
}

export async function submitContact(payload: ContactPayload) {
  return apiFetch<{ success: boolean }>("/api/contact", {
    method: "POST",
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
