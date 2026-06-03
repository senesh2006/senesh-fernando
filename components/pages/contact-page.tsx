"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { ChromaGrid } from "@/components/site/ChromaGrid";
import type { ChromaGridItem } from "@/components/site/ChromaGrid";
import { submitContact } from "@/lib/client-api";
import { LightspeedBackground } from "@/components/site/lightspeed-background";
import { PROFILE } from "@/lib/profile";
import { useState } from "react";
import { Github, Linkedin, Twitter, GraduationCap, Mail, Phone, MapPin, FileDown } from "lucide-react";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || PROFILE.email;

const GITHUB_USER =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "senesh2006";

const DIRECT = [
  { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, hint: "fastest · < 48h" },
  { icon: Phone, label: "Phone", value: PROFILE.phoneDisplay, href: `tel:${PROFILE.phone}`, hint: "mobile" },
  { icon: MapPin, label: "Location", value: PROFILE.address, href: `https://maps.google.com/?q=${encodeURIComponent(PROFILE.address)}`, hint: PROFILE.location },
  { icon: FileDown, label: "Resume / CV", value: "Senesh_Fernando_CV.pdf", href: "/Senesh_Fernando_CV.pdf", hint: "download" },
] as const;

const SOCIAL_ITEMS: ChromaGridItem[] = [
  {
    icon: Github,
    title: "GitHub",
    subtitle: "Code & Projects",
    handle: " @senesh2006",
    borderColor: "#4F46E5",
    gradient: "linear-gradient(145deg, #4F46E5, #000)",
    url: PROFILE.github,
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    subtitle: "Professional",
    handle: " @peter-senesh",
    borderColor: "#0A66C2",
    gradient: "linear-gradient(180deg, #0A66C2, #000)",
    url: PROFILE.linkedin,
  },
  {
    icon: Twitter,
    title: "X",
    subtitle: "Social Feed",
    handle: " @SeneshF",
    borderColor: "#ffffff",
    gradient: "linear-gradient(165deg, #1da1f2, #000)",
    url: "https://x.com/SeneshF",
  },
  {
    icon: GraduationCap,
    title: "Google Scholar",
    subtitle: "Research",
    handle: " @SeneshF",
    borderColor: "#4285F4",
    gradient: "linear-gradient(195deg, #4285F4, #000)",
    url: "https://scholar.google.com/citations?user=BQ7naRAAAAAJ&hl=en",
  },
];

export function ContactPage() {
  useReveal();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    try {
      await submitContact({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        subject: String(data.get("subject") || ""),
        message: String(data.get("message") || ""),
      });
      setStatus("sent");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
    }
  }

  return (
    <>
      <ScrollProgress />

      {/* HERO */}
      <section className="relative border-b border-border">
        <CursorSpotlight />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <LightspeedBackground className="absolute inset-0" />
        </div>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// contact.landing</div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              [MODE: OPEN] · {PROFILE.location} · response &lt; 48h
            </div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] max-w-5xl">
            <span className="caret">Let's talk.</span>{" "}
            <span className="text-muted-foreground block">Tech, education, or AI.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-fade-in-up">
            If you're working on something exciting — or just want to connect and
            trade ideas — drop a message below, or reach me directly. I read everything.
          </p>
        </div>
        <MarqueeStrip items={[
          "open to collaborations", "response within 48h", "[MODE: OPEN]",
          PROFILE.location, "Curtin University Colombo", PROFILE.phoneDisplay,
        ]} />
      </section>

      {/* FORM + DIRECT CONTACT (two-column centerpiece) */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="font-mono text-xs text-muted-foreground mb-6">// send.message</div>
            <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-md p-6 sm:p-8 bg-card/40">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block space-y-2 font-mono text-xs">
                  <span className="text-muted-foreground">name</span>
                  <input required name="name" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all" />
                </label>
                <label className="block space-y-2 font-mono text-xs">
                  <span className="text-muted-foreground">email</span>
                  <input required type="email" name="email" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all" />
                </label>
              </div>
              <label className="block space-y-2 font-mono text-xs">
                <span className="text-muted-foreground">subject</span>
                <input name="subject" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all" />
              </label>
              <label className="block space-y-2 font-mono text-xs">
                <span className="text-muted-foreground">message</span>
                <textarea required name="message" rows={7} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all" />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="font-mono text-xs px-4 py-2 border border-border rounded-sm bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === "sending" ? "sending…" : "→ send message"}
                </button>
                {status === "sent" && (
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">message sent — talk soon</span>
                )}
                {status === "error" && (
                  <span className="font-mono text-xs text-red-500">{errorMessage}</span>
                )}
              </div>
            </form>
          </div>

          {/* Direct channels */}
          <div className="lg:col-span-5">
            <div className="font-mono text-xs text-muted-foreground mb-6">// or.reach.directly</div>
            <div className="space-y-3">
              {DIRECT.map(({ icon: Icon, label, value, href, hint }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="group flex items-start gap-3 border border-border rounded-md p-4 bg-card/40 hover:border-foreground/30 transition-colors"
                >
                  <div className="p-2 rounded-sm border border-border bg-background shrink-0 group-hover:border-foreground/30 transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                    <div className="text-sm truncate group-hover:text-foreground transition-colors">{value}</div>
                    <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{hint}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIALS */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// find.me.elsewhere</div>
        <div className="relative min-h-[350px]">
          <ChromaGrid
            items={SOCIAL_ITEMS}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
            columns={2}
          />
        </div>
      </section>

      {/* GOOD FIT */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// good.fit</div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4 font-mono text-sm stagger">
          <div>
            <div className="text-foreground mb-3">+ great fit</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>+ data & analytics projects</li>
              <li>+ AI / ML collaborations</li>
              <li>+ student & education initiatives</li>
              <li>+ hackathons & tech events</li>
            </ul>
          </div>
          <div>
            <div className="text-foreground mb-3">- also happy to discuss</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>- freelance web development</li>
              <li>- sustainability tech (CarbonWise)</li>
              <li>- tutoring & mentoring</li>
              <li>- startup digital campaigns</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 mb-24 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// frequently.asked</div>
        <div className="divide-y divide-border border-y border-border">
          {[
            ["Where are you based?", `${PROFILE.address}, ${PROFILE.location}.`],
            ["What's the fastest way to reach you?", `Email (${CONTACT_EMAIL}) or mobile (${PROFILE.phoneDisplay}). I usually respond within 48 hours.`],
            ["Are you open to freelance work?", "Yes — especially data, AI, web development, and tutoring projects alongside my studies."],
            ["What are you studying?", "Bachelor of Information Technology at Curtin University Colombo (since February 2025)."],
          ].map(([q, a]) => (
            <details key={q} className="py-5 group">
              <summary className="cursor-pointer flex items-baseline gap-3 list-none">
                <span className="font-mono text-xs text-muted-foreground">+</span>
                <span className="font-semibold flex-1">{q}</span>
                <span className="font-mono text-xs text-muted-foreground group-open:rotate-45 transition-transform">＋</span>
              </summary>
              <p className="mt-3 pl-6 text-muted-foreground text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
