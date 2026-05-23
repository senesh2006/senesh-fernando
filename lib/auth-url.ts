function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, "")
}

export function getAuthBaseUrl() {
  const fromEnv =
    process.env.SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "http://localhost:3000"

  return stripTrailingSlash(fromEnv)
}

export function getGitHubCallbackUrl() {
  return `${getAuthBaseUrl()}/api/auth/callback/github`
}

export function getCanonicalHost() {
  try {
    return new URL(getAuthBaseUrl()).host
  } catch {
    return null
  }
}
