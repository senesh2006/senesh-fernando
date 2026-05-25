"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { FlipCard } from "@/components/site/flip-card";
import type { FlipCardData } from "@/components/site/flip-card";
import { submitContact } from "@/lib/client-api";
import { useState } from "react";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "seneshfernando55@gmail.com";

const GITHUB_USER =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "senesh2006";

const CHANNELS = [
  ["01", "Email.",      CONTACT_EMAIL,  `mailto:${CONTACT_EMAIL}`, "→", "fastest"],
  ["02", "GitHub.",     `github.com/${GITHUB_USER}`,        `https://github.com/${GITHUB_USER}`,              "↗", "code"],
  ["03", "LinkedIn.",   "linkedin.com/in/seneshf",   "https://linkedin.com",            "↗", "work"],
  ["04", "Twitter / X.", "@seneshf",                 "https://x.com",                   "↗", "rare"],
  ["05", "RSS.",        "/rss.xml",                  "/rss.xml",                        "→", "writing"],
] as const;

const SOCIAL_CARD_DATA: FlipCardData = {
  name: 'Senesh Fernando',
  username: 'seneshf',
  image: 'https://avatars.githubusercontent.com/u/1?v=4',
  bio: 'Engineering lead building taste-led products, design systems and performance-critical frontend infrastructure.',
  stats: { following: 200, followers: 2900, posts: 120 },
  socialLinks: {
    linkedin: 'https://linkedin.com/in/seneshf',
    github: 'https://github.com/seneshf',
    twitter: 'https://x.com/seneshf',
  },
};

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
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-32 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// contact.landing</div>
            <div>[MODE: OPEN] · accepting q3 2026 work · response &lt; 48h</div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] max-w-5xl">
            <span className="caret">Get in touch.</span>{" "}
            <span className="text-muted-foreground block">Email beats every other channel.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-fade-in-up">
            I'm taking on one or two engagements per quarter — engineering
            leadership, design system work, and the occasional weird research
            project. Send a paragraph about what you're building.
          </p>
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs">
            <a href={`mailto:${CONTACT_EMAIL}`} className="px-3 py-1.5 border border-border rounded-sm link-hover">→ {CONTACT_EMAIL}</a>
            <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ see the work first</Link>
          </div>
        </div>
        <MarqueeStrip items={[
          "currently — accepting q3 2026", "response within 48h", "[MODE: OPEN]",
          "based colombo / berlin", "remote-friendly", "♪ deficit — mindvacy",
        ]} />
      </section>

      {/* SOCIAL FLIP CARDS */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// social.cards</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          <FlipCard data={SOCIAL_CARD_DATA} platform="github" />
          <FlipCard data={SOCIAL_CARD_DATA} platform="linkedin" />
          <FlipCard data={SOCIAL_CARD_DATA} platform="twitter" />
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// send.message</div>
        <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-md p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block space-y-2 font-mono text-xs">
              <span className="text-muted-foreground">name</span>
              <input required name="name" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm" />
            </label>
            <label className="block space-y-2 font-mono text-xs">
              <span className="text-muted-foreground">email</span>
              <input required type="email" name="email" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="block space-y-2 font-mono text-xs">
            <span className="text-muted-foreground">subject</span>
            <input name="subject" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block space-y-2 font-mono text-xs">
            <span className="text-muted-foreground">message</span>
            <textarea required name="message" rows={6} className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm resize-y" />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="font-mono text-xs px-3 py-1.5 border border-border rounded-sm link-hover disabled:opacity-50"
            >
              {status === "sending" ? "sending…" : "→ send message"}
            </button>
            {status === "sent" && (
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">message sent</span>
            )}
            {status === "error" && (
              <span className="font-mono text-xs text-red-500">{errorMessage}</span>
            )}
          </div>
        </form>
      </section>

      {/* CHANNELS */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// channels</div>
        <ul className="divide-y divide-border border-y border-border font-mono text-sm stagger">
          {CHANNELS.map(([n, label, val, href, arrow, hint]) => (
            <li key={n} className="grid grid-cols-[2rem_8rem_1fr_auto] gap-4 items-baseline py-4 row-hover rounded-sm">
              <span className="text-muted-foreground">{n}</span>
              <span className="text-foreground">{label}</span>
              <a href={href} className="story-link truncate">{val} {arrow}</a>
              <span className="text-muted-foreground hidden sm:inline text-xs">[{hint}]</span>
            </li>
          ))}
        </ul>
      </section>

      {/* GOOD FIT */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// good.fit</div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4 font-mono text-sm stagger">
          <div>
            <div className="text-foreground mb-3">+ great fit</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>+ small, sharp teams</li>
              <li>+ taste-led products</li>
              <li>+ performance-critical work</li>
              <li>+ design systems at scale</li>
            </ul>
          </div>
          <div>
            <div className="text-foreground mb-3">- not a fit</div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>- ad-tech / surveillance</li>
              <li>- crypto speculation</li>
              <li>- 'rewrite the monolith in 6 weeks'</li>
              <li>- unpaid 'equity-only' work</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// frequently.asked</div>
        <div className="divide-y divide-border border-y border-border">
          {[
            ["What time zone do you work?", "CET, with comfortable overlap into UK and US-East mornings."],
            ["Do you take fixed-bid work?", "Rarely. I prefer time-and-materials with weekly check-ins — it keeps incentives honest."],
            ["Will you sign an NDA?", "Yes, the standard one-page mutual NDA. I won't sign bespoke 30-page contracts before a first call."],
            ["Do you do interviews / panels?", "Yes — happy to join hiring panels for senior engineering or design roles."],
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

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-32 reveal">
        <div className="border-t border-b border-border py-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.contact</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Still here? Just send the email.</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">A paragraph beats a form, every time.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <a href={`mailto:${CONTACT_EMAIL}`} className="px-3 py-1.5 border border-border rounded-sm link-hover">→ {CONTACT_EMAIL}</a>
          </div>
        </div>
      </section>
    </>
  );
}
