import { NextResponse } from "next/server"
import {
  getAuthBaseUrl,
  getGitHubCallbackUrl,
  PRODUCTION_SITE_URL,
} from "@/lib/auth-url"

export async function GET() {
  return NextResponse.json({
    authBaseUrl: getAuthBaseUrl(),
    githubCallbackUrl: getGitHubCallbackUrl(),
    productionDefault: PRODUCTION_SITE_URL,
    githubClientIdSet: Boolean(process.env.GITHUB_ID),
    githubSecretSet: Boolean(process.env.GITHUB_SECRET),
    nextAuthSecretSet: Boolean(process.env.NEXTAUTH_SECRET),
    env: {
      SITE_URL: process.env.SITE_URL ?? null,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
      VERCEL_URL: process.env.VERCEL_URL ?? null,
      VERCEL_ENV: process.env.VERCEL_ENV ?? null,
    },
    githubAppSettings: {
      homepageUrl: getAuthBaseUrl(),
      authorizationCallbackUrl: getGitHubCallbackUrl(),
    },
  })
}
