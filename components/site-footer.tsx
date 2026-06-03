import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react"
import { PROFILE } from "@/lib/profile"

const NAV = [
  { label: "projects", href: "/projects" },
  { label: "writing", href: "/writing" },
  { label: "about", href: "/about" },
  { label: "contact", href: "/contact" },
]

const SOCIALS = [
  { label: "GitHub", href: PROFILE.github, handle: PROFILE.githubHandle, icon: Github },
  { label: "LinkedIn", href: PROFILE.linkedin, handle: PROFILE.linkedinHandle, icon: Linkedin },
  { label: "Email", href: `mailto:${PROFILE.email}`, handle: PROFILE.email, icon: Mail },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Identity + CTA */}
          <div className="md:col-span-5 space-y-4">
            <div className="font-mono text-xs text-muted-foreground">// let's build something</div>
            <h2 className="text-2xl font-semibold tracking-tight leading-tight">
              Open to collaborations,<br />projects, and conversations.
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border border-border rounded-sm link-hover"
            >
              get in touch <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
              <MapPin className="h-3.5 w-3.5" /> {PROFILE.location}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
              navigate
            </div>
            <ul className="space-y-2 font-mono text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    → {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
              elsewhere
            </div>
            <ul className="space-y-2 font-mono text-sm">
              {SOCIALS.map(({ label, href, handle, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{handle}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            available for work
          </span>
        </div>
      </div>
    </footer>
  )
}
