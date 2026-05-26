"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { ChromaGrid } from "@/components/site/ChromaGrid";
import type { ChromaGridItem } from "@/components/site/ChromaGrid";
import { submitContact } from "@/lib/client-api";
import { PROFILE } from "@/lib/profile";
import { useState } from "react";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || PROFILE.email;

const GITHUB_USER =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "senesh2006";

const CHANNELS = [
  ["01", "Email.", CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`, "→", "fastest"],
  ["02", "Phone.", PROFILE.phoneDisplay, `tel:${PROFILE.phone}`, "→", "mobile"],
  ["03", "LinkedIn.", PROFILE.linkedinHandle, PROFILE.linkedin, "↗", "work"],
  ["04", "GitHub.", `github.com/${GITHUB_USER}`, PROFILE.github, "↗", "code"],
  ["05", "Portfolio.", "v0-senesh-fernando.vercel.app", PROFILE.website, "↗", "personal"],
  ["06", "Location.", PROFILE.address, `https://maps.google.com/?q=${encodeURIComponent(PROFILE.address)}`, "↗", "map"],
] as const;

const SOCIAL_ITEMS: ChromaGridItem[] = [
  {
    image: "https://cdn.simpleicons.org/github/ffffff",
    title: "GitHub",
    subtitle: "Code & Projects",
    handle: " @senesh2006",
    borderColor: "#4F46E5",
    gradient: "linear-gradient(145deg, #4F46E5, #000)",
    url: PROFILE.github,
  },
  {
    image: "https://cdn.simpleicons.org/linkedin/ffffff",
    title: "LinkedIn",
    subtitle: "Professional",
    handle: " @peter-senesh",
    borderColor: "#0A66C2",
    gradient: "linear-gradient(180deg, #0A66C2, #000)",
    url: PROFILE.linkedin,
  },
  {
    image: "https://cdn.simpleicons.org/x/ffffff",
    title: "X",
    subtitle: "Social Feed",
    handle: " @SeneshF",
    borderColor: "#ffffff",
    gradient: "linear-gradient(165deg, #1da1f2, #000)",
    url: "https://x.com/SeneshF",
  },
  {
    image: "https://cdn.simpleicons.org/googlescholar/ffffff",
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
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-32 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// contact.landing</div>
            <div>[MODE: OPEN] · {PROFILE.location} · response &lt; 48h</div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] max-w-5xl">
            <span className="caret">Get in touch.</span>{" "}
            <span className="text-muted-foreground block">Email or call — either works.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-fade-in-up">
            If you're working on something exciting in tech, education, or AI — or
            just want to connect and chat ideas — I'd love to hear from you.
          </p>
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs">
            <a href={`mailto:${CONTACT_EMAIL}`} className="px-3 py-1.5 border border-border rounded-sm link-hover">→ {CONTACT_EMAIL}</a>
            <a href={`tel:${PROFILE.phone}`} className="px-3 py-1.5 border border-border rounded-sm link-hover">→ {PROFILE.phoneDisplay}</a>
            <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ see the work first</Link>
          </div>
        </div>
        <MarqueeStrip items={[
          "open to collaborations", "response within 48h", "[MODE: OPEN]",
          PROFILE.location, "Curtin University Colombo", PROFILE.phoneDisplay,
        ]} />
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

      {/* SOCIAL CHROMA GRID */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-6">// social.cards</div>
        <div className="relative min-h-[600px]">
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
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
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

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-32 reveal">
        <div className="border-t border-b border-border py-16 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4">// end.of.contact</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Still here? Just send the email.</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">Or call {PROFILE.phoneDisplay} — happy to chat.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <a href={`mailto:${CONTACT_EMAIL}`} className="px-3 py-1.5 border border-border rounded-sm link-hover">→ {CONTACT_EMAIL}</a>
            <a href={`tel:${PROFILE.phone}`} className="px-3 py-1.5 border border-border rounded-sm link-hover">→ {PROFILE.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </>
  );
}
