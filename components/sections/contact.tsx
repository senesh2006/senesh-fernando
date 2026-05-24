"use client"

import { Reveal } from "@/components/reveal"
import { SectionHeader } from "@/components/editorial/section-header"

export function ContactSection() {
  return (
    <section id="contact">
      <div className="container">
        <SectionHeader num="06" title="Contact" />
        <Reveal>
          <div className="contact-inner">
            <div className="contact-text">
              <p>
                I&apos;m currently open to internship opportunities, freelance projects, and
                interesting collaborations. If you have something worth building, I&apos;d love to hear
                about it.
              </p>
              <p>
                Also happy to chat about hackathons, AI integrations, or anything you&apos;re working
                on.
              </p>
              <a href="mailto:seneshfernando55@gmail.com" className="contact-email">
                seneshfernando55@gmail.com
              </a>
            </div>
            <div className="social-links">
              <a
                href="https://github.com/senesh2006"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div>
                  <div className="social-link-label">GitHub</div>
                  <div>senesh2006</div>
                </div>
                <span className="social-arrow">↗</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div>
                  <div className="social-link-label">LinkedIn</div>
                  <div>Senesh</div>
                </div>
                <span className="social-arrow">↗</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div>
                  <div className="social-link-label">Twitter / X</div>
                  <div>@senesh</div>
                </div>
                <span className="social-arrow">↗</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
