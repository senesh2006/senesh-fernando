"use client"

import Link from "next/link"

export function HeroSection() {
  return (
    <section id="hero">
      <div className="hero-grid-bg" />
      <div className="hero-inner">
        <div className="hero-tag">Based in Sri Lanka · Undergrad Developer</div>
        <h1 className="hero-name">
          Se<em>nesh</em>
        </h1>
        <p className="hero-title">Building things that work.</p>
        <p className="hero-bio">
          Undergrad developer with a bias for shipping. I build full-stack web apps, integrate AI into
          real products, and think hard about architecture even under time pressure. Currently
          turning hackathon ideas into actual software.
        </p>
        <div className="hero-ctas">
          <Link href="#projects" className="btn btn-primary">
            View my work
          </Link>
          <Link href="#contact" className="btn btn-ghost">
            Get in touch
          </Link>
          <a
            href="https://github.com/senesh2006"
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
      <div className="hero-scroll">Scroll</div>
    </section>
  )
}
