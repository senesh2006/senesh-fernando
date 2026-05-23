export const PRODUCTION_SITE_URL = "https://v0-senesh-fernando.vercel.app"

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, "")
}

export function getAuthBaseUrl() {
  if (process.env.SITE_URL) {
    return stripTrailingSlash(process.env.SITE_URL)
  }

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL
  }

  if (process.env.VERCEL_URL) {
    return stripTrailingSlash(`https://${process.env.VERCEL_URL}`)
  }

  if (process.env.NEXTAUTH_URL) {
    return stripTrailingSlash(process.env.NEXTAUTH_URL)
  }

  return "http://localhost:3000"
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
