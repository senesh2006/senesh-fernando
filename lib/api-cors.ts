import type { NextRequest } from "next/server"

function getAllowedOrigins(): string[] {
  const fromEnv = process.env.ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (fromEnv?.length) return fromEnv

  return [
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ].filter((origin): origin is string => Boolean(origin))
}

export function isPublicApiRoute(pathname: string) {
  return pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")
}

export function resolveCorsOrigin(request: NextRequest) {
  const origin = request.headers.get("origin")
  const allowed = getAllowedOrigins()

  if (origin && allowed.includes(origin)) return origin
  if (process.env.NODE_ENV === "development" && origin) return origin
  return allowed[0] ?? null
}

export function corsHeaders(request: NextRequest) {
  const headers = new Headers()
  const origin = resolveCorsOrigin(request)

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin)
    headers.set("Vary", "Origin")
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  headers.set("Access-Control-Max-Age", "86400")
  return headers
}

export function handleCorsPreflight(request: NextRequest) {
  if (request.method !== "OPTIONS" || !isPublicApiRoute(request.nextUrl.pathname)) {
    return null
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}

export function applyCors(request: NextRequest, response: Response) {
  const headers = corsHeaders(request)
  headers.forEach((value, key) => {
    response.headers.set(key, value)
  })
  return response
}
