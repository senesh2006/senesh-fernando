"use client"

import { Suspense } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertCircle, Github } from "lucide-react"

const allowedUsername =
  process.env.NEXT_PUBLIC_GITHUB_ALLOWED_USERNAME ?? "senesh2006"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "https://senesh.dev")

const githubCallbackUrl = `${siteUrl.replace(/\/$/, "")}/api/auth/callback/github`

const errorMessages: Record<string, string> = {
  Configuration:
    "Auth is not configured. Add GITHUB_ID, GITHUB_SECRET, and NEXTAUTH_SECRET in your environment variables.",
  AccessDenied: `Access denied. Only @${allowedUsername} can sign in.`,
  OAuthSignin:
    "Could not start GitHub sign-in. Check your OAuth credentials and callback URL.",
  OAuthCallback:
    "GitHub sign-in callback failed. Make sure your GitHub OAuth app uses the callback URL shown below.",
  Default: "Sign-in failed. Please try again.",
}

function LoginForm() {
  const searchParams = useSearchParams()
  const errorKey = searchParams.get("error")
  const errorMessage = errorKey
    ? (errorMessages[errorKey] ?? errorMessages.Default)
    : null

  return (
    <Reveal>
      <div className="max-w-md w-full glass-card p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Restricted Access</h1>
        <p className="text-foreground-muted text-sm mb-6">
          Sign in with your GitHub account to manage portfolio content.
        </p>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Button
          onClick={() => signIn("github", { callbackUrl: "/admin" })}
          className="w-full py-6 bg-white text-black hover:bg-white/90 rounded-xl flex items-center justify-center gap-3 font-bold transition-all"
        >
          <Github className="h-5 w-5" />
          Sign in with GitHub
        </Button>

        <p className="mt-6 text-xs text-foreground-muted leading-relaxed">
          Allowed account:{" "}
          <span className="text-primary">@{allowedUsername}</span>
        </p>

        <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-4 text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted mb-2">
            GitHub OAuth callback URL
          </p>
          <code className="block break-all text-xs text-primary">{githubCallbackUrl}</code>
        </div>

        <p className="mt-4 text-[10px] text-foreground-muted/50 uppercase tracking-[0.2em]">
          Secure Portfolio CMS
        </p>
      </div>
    </Reveal>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#050302] flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
