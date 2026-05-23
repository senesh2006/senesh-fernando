"use client"

import { Suspense } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertCircle } from "lucide-react"

const errorMessages: Record<string, string> = {
  Configuration:
    "Auth is not configured. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET in Vercel environment variables.",
  AccessDenied:
    "Access denied. Only seneshfernando55@gmail.com can sign in.",
  OAuthSignin: "Could not start Google sign-in. Check your OAuth credentials.",
  OAuthCallback: "Google sign-in callback failed. Verify NEXTAUTH_URL matches your site URL.",
  Default: "Sign-in failed. Please try again.",
}

function LoginForm() {
  const searchParams = useSearchParams()
  const errorKey = searchParams.get("error")
  const errorMessage = errorKey
    ? errorMessages[errorKey] ?? errorMessages.Default
    : null

  return (
    <Reveal>
      <div className="max-w-md w-full glass-card p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Restricted Access</h1>
        <p className="text-foreground-muted text-sm mb-6">
          Sign in with your authorized Google account to manage portfolio content.
        </p>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full py-6 bg-white text-black hover:bg-white/90 rounded-xl flex items-center justify-center gap-3 font-bold transition-all"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.75c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </Button>

        <p className="mt-6 text-xs text-foreground-muted leading-relaxed">
          Allowed account: <span className="text-primary">seneshfernando55@gmail.com</span>
        </p>

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
