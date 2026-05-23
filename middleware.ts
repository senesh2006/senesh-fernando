import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAuthBaseUrl, getCanonicalHost } from "@/lib/auth-url"

function shouldUseCanonicalAuthHost(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/auth")
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  const canonicalHost = getCanonicalHost()
  if (
    canonicalHost &&
    process.env.VERCEL_ENV === "production" &&
    shouldUseCanonicalAuthHost(pathname) &&
    request.nextUrl.host !== canonicalHost
  ) {
    const redirectUrl = new URL(pathname + request.nextUrl.search, getAuthBaseUrl())
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
}
