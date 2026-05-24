"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"

export function AboutHomeSection() {
  return (
    <section id="about">
      <div className="container">
        <SectionHeader num="01" title="About" />
        <Reveal>
          <div className="about-grid">
          <div className="about-text">
            <p>
              I&apos;m <strong>Senesh</strong> — an undergraduate developer from Sri Lanka who builds
              web applications, experiments with AI integrations, and occasionally ships things in 24
              hours that somehow impress judges.
            </p>
            <p>
              My approach is practical: understand the problem, pick the right tools, write clean
              code, and get something real in front of people. I care about architecture as much as
              aesthetics — a well-designed schema and a well-designed UI matter equally to me.
            </p>
            <p>
              Outside of code, I&apos;m learning how products are built — from the database schema to
              the pitch deck. I competed in the <strong>Cursor 24hr Buildathon</strong> with SoloScale
              and placed <strong>20th globally</strong> and{" "}
              <strong>3rd in the Google Gemini track</strong>, with a product that wasn&apos;t even
              deployed.
            </p>
            <p>I&apos;m currently open to internships, collaborations, and interesting problems.</p>
          </div>
          <div className="about-facts">
            <div className="fact-row">
              <span className="fact-label">Status</span>
              <span className="fact-val accent">Undergrad · Active</span>
            </div>
            <div className="fact-row">
              <span className="fact-label">Location</span>
              <span className="fact-val">Sri Lanka</span>
            </div>
            <div className="fact-row">
              <span className="fact-label">Focus</span>
              <span className="fact-val">Full-Stack · AI</span>
            </div>
            <div className="fact-row">
              <span className="fact-label">Best finish</span>
              <span className="fact-val">3rd · Google Gemini track</span>
            </div>
            <div className="fact-row">
              <span className="fact-label">GitHub</span>
              <span className="fact-val">senesh2006</span>
            </div>
            <div className="fact-row">
              <span className="fact-label">Availability</span>
              <span className="fact-val accent">Open to work</span>
            </div>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
