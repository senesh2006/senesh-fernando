"use client"

import { Suspense, useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertCircle, Github, Loader2 } from "lucide-react"

const allowedUsername =
  process.env.NEXT_PUBLIC_GITHUB_ALLOWED_USERNAME ?? "senesh2006"

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

function LoginFormContent() {
  const searchParams = useSearchParams()
  const [githubCallbackUrl, setGithubCallbackUrl] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    
    // Attempt to fetch actual callback URL from server
    fetch("/api/auth/debug")
      .then((res) => res.json())
      .then((data) => {
        if (data.githubCallbackUrl) {
          setGithubCallbackUrl(data.githubCallbackUrl)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch debug auth info:", err)
        const base = window.location.origin
        setGithubCallbackUrl(`${base}/api/auth/callback/github`)
      })
  }, [])

  if (!isMounted) return null

  const errorKey = searchParams.get("error")
  const errorMessage = errorKey
    ? (errorMessages[errorKey] ?? errorMessages.Default)
    : null

  return (
    <Reveal>
      <div className="max-w-md w-full glass-card p-10 text-center bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Restricted Access</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Sign in with your GitHub account to manage portfolio content.
        </p>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-300 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Button
          onClick={() => signIn("github", { callbackUrl: "/admin" })}
          className="w-full py-7 bg-white text-black hover:bg-zinc-200 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg active:scale-[0.98]"
        >
          <Github className="h-5 w-5" />
          Sign in with GitHub
        </Button>

        <div className="mt-8 pt-8 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-4">
            Authorized: <span className="text-primary font-mono font-bold">@{allowedUsername}</span>
          </p>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-left">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">
              GitHub OAuth callback URL
            </p>
            <code className="block break-all text-[11px] text-primary font-mono">
              {githubCallbackUrl || "Detecting..."}
            </code>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">
          Secure Portfolio CMS
        </p>
      </div>
    </Reveal>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-xs text-zinc-500 font-mono animate-pulse">INITIATING AUTH...</p>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  )
}
