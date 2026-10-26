"use client"

import { useState } from "react"
import { FileDown, Mail, MapPin, Phone } from "lucide-react"
import { submitContact } from "@/lib/client-api"
import { PROFILE } from "@/lib/profile"
import { Container, Eyebrow, Reveal } from "@/components/site/redesign/ui"

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || PROFILE.email

const DIRECT = [
  { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, hint: "fastest · under 48h" },
  { icon: Phone, label: "Phone", value: PROFILE.phoneDisplay, href: `tel:${PROFILE.phone}`, hint: "mobile" },
  {
    icon: MapPin,
    label: "Location",
    value: PROFILE.address,
    href: `https://maps.google.com/?q=${encodeURIComponent(PROFILE.address)}`,
    hint: PROFILE.location,
  },
  { icon: FileDown, label: "Resume / CV", value: "Senesh_Fernando_CV.pdf", href: "/Senesh_Fernando_CV.pdf", hint: "download" },
] as const

const SOCIALS = [
  { title: "GitHub", subtitle: "Code & projects", handle: "@senesh2006", url: PROFILE.github },
  { title: "LinkedIn", subtitle: "Professional", handle: "@peter-senesh", url: PROFILE.linkedin },
  { title: "X", subtitle: "Social feed", handle: "@SeneshF", url: "https://x.com/SeneshF" },
  {
    title: "Google Scholar",
    subtitle: "Research",
    handle: "@SeneshF",
    url: "https://scholar.google.com/citations?user=BQ7naRAAAAAJ&hl=en",
  },
]

const inputClass =
  "w-full min-h-12 rounded-2xl border border-border bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-accent"

export function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus("sending")
    setErrorMessage("")

    try {
      await submitContact({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        subject: String(data.get("subject") || ""),
        message: String(data.get("message") || ""),
      })
      setStatus("sent")
      form.reset()
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message")
    }
  }

  return (
    <>
      <Container as="section" className="pb-8 pt-28 sm:pt-36">
        <Eyebrow>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            Open · {PROFILE.location} · response under 48h
          </span>
        </Eyebrow>
        <h1 className="mt-4 max-w-4xl text-[clamp(3.1rem,12vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
          Let&apos;s talk
          <span className="block font-serif font-normal italic text-muted-foreground">about the work.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          If you&apos;re working on something exciting — or just want to connect and trade ideas — drop a message
          below, or reach me directly. I read everything.
        </p>
      </Container>

      <Container as="section" className="grid items-start gap-8 py-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Eyebrow className="mb-4">Send a message</Eyebrow>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-border bg-card/50 p-5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm">
                <span className="text-muted-foreground">Name</span>
                <input required name="name" autoComplete="name" className={inputClass} />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="text-muted-foreground">Email</span>
                <input required type="email" name="email" autoComplete="email" className={inputClass} />
              </label>
            </div>
            <label className="block space-y-2 text-sm">
              <span className="text-muted-foreground">Subject</span>
              <input name="subject" className={inputClass} />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="text-muted-foreground">Message</span>
              <textarea required name="message" rows={7} className={`${inputClass} min-h-40 py-3`} />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              {status === "sent" && (
                <p className="text-sm text-emerald-500" role="status">
                  Message sent. Talk soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-400" role="alert">
                  {errorMessage}
                </p>
              )}
            </div>
          </form>
        </Reveal>

        <div className="space-y-3 lg:col-span-5">
          <Eyebrow className="mb-4">Or reach me directly</Eyebrow>
          {DIRECT.map(({ icon: Icon, label, value, href, hint }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
              rel="noreferrer"
              className="flex min-h-16 items-start gap-3 rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-secondary/60"
            >
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
                <span className="mt-1 block break-words text-sm">{value}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
              </span>
            </a>
          ))}
        </div>
      </Container>

      <Container as="section" className="py-12">
        <Reveal>
          <Eyebrow>Find me elsewhere</Eyebrow>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SOCIALS.map((item) => (
              <li key={item.title}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-border px-5 py-4 transition-colors hover:bg-card"
                >
                  <span>
                    <span className="block text-lg font-semibold">{item.title}</span>
                    <span className="text-sm text-muted-foreground">{item.subtitle}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{item.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <Container as="section" className="py-8">
        <Reveal>
          <Eyebrow>Good fit</Eyebrow>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border p-6">
              <h2 className="text-lg font-semibold">Great fit</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>data & analytics projects</li>
                <li>AI / ML collaborations</li>
                <li>student & education initiatives</li>
                <li>hackathons & tech events</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border p-6">
              <h2 className="text-lg font-semibold">Also happy to discuss</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>freelance web development</li>
                <li>sustainability tech (CarbonWise)</li>
                <li>tutoring & mentoring</li>
                <li>startup digital campaigns</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>

      <Container as="section" className="pb-8 pt-4">
        <Reveal>
          <Eyebrow>Frequently asked</Eyebrow>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {[
              ["Where are you based?", `${PROFILE.address}, ${PROFILE.location}.`],
              [
                "What's the fastest way to reach you?",
                `Email (${CONTACT_EMAIL}) or mobile (${PROFILE.phoneDisplay}). I usually respond within 48 hours.`,
              ],
              [
                "Are you open to freelance work?",
                "Yes — especially data, AI, web development, and tutoring projects alongside my studies.",
              ],
              [
                "What are you studying?",
                "Bachelor of Information Technology at Curtin University Colombo (since February 2025).",
              ],
            ].map(([question, answer]) => (
              <details key={question} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-medium [&::-webkit-details-marker]:hidden">
                  <span>{question}</span>
                  <span className="font-mono text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </>
  )
}
