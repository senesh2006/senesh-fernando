"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/components/auth-provider"
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  GraduationCap,
  Award,
  Cpu,
  ChevronRight,
  Menu,
  X,
  User,
  Home,
  LogOut,
  Loader2,
} from "lucide-react"

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { label: "Projects", href: "/admin/projects", icon: Cpu },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Achievements", href: "/admin/achievements", icon: Award },
  { label: "Skills", href: "/admin/skills", icon: User },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [status, pathname, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!session && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      {!isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform duration-300 transform lg:relative lg:translate-x-0",
          !isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
              PS
            </div>
            <span className="font-bold tracking-tight text-lg">Admin Hub</span>
          </div>

          <nav className="flex-1 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,106,0,0.1)]"
                      : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-primary" : "group-hover:text-primary"
                      )}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-foreground-muted hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 text-foreground-muted hover:text-foreground hover:bg-white/5 rounded-xl transition-all"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
              PS
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/5 text-foreground-muted"
          >
            {isSidebarOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
