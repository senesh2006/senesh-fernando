const DEFAULT_DEV_API = "http://localhost:3000"
const PRODUCTION_API = "https://v0-senesh-fernando.vercel.app"

/** Base URL for the Next.js portfolio API (no trailing slash). */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.replace(/\/$/, "")

  // Browser dev: relative /api hits the Vite proxy.
  if (import.meta.env.DEV && typeof window !== "undefined" && !configured) {
    return ""
  }

  if (configured) return configured
  if (import.meta.env.DEV) return DEFAULT_DEV_API
  return PRODUCTION_API
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const base = getApiBaseUrl()
  if (!base) return normalized
  return `${base}${normalized}`
}
