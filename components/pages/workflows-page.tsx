"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { Sparkles, Bot, Zap, BarChart3, GraduationCap, Globe } from "lucide-react";

const WORKFLOW_CARDS = [
  {
    title: "Data Insight Pipeline",
    description: "Automated extraction and summarization of business metrics from structured datasets.",
    icon: BarChart3,
    tag: "Analytics",
    color: "#4F46E5",
    details: [
      "Cleans and validates raw inputs",
      "Identifies key trends and anomalies",
      "Generates human-readable summaries",
    ]
  },
  {
    title: "Sustainability Reporting",
    description: "Streamlined workflows for environmental impact tracking and carbon metrics.",
    icon: Globe,
    tag: "CarbonWise",
    color: "#10B981",
    details: [
      "Standardizes emission data",
      "Automates reporting schedules",
      "Visualizes impact for stakeholders",
    ]
  },
  {
    title: "AI Mentoring Loop",
    description: "Personalized learning resources and automated feedback for programming students.",
    icon: GraduationCap,
    tag: "Education",
    color: "#F59E0B",
    details: [
      "Explains complex C concepts",
      "Provides practice problem loops",
      "Traces logic for better intuition",
    ]
  },
  {
    title: "Editorial Summary",
    description: "Quick-read summaries for projects and blog posts using high-performance LLMs.",
    icon: Sparkles,
    tag: "Portfolio",
    color: "#EC4899",
    details: [
      "Powered by NVIDIA NIM",
      "Context-aware page analysis",
      "Instant 3-bullet takeaways",
    ]
  }
];

export function WorkflowsPage() {
  useReveal();

  return (
    <>
      <ScrollProgress />

      {/* HERO */}
      <section className="relative border-b border-border overflow-hidden">
        <CursorSpotlight />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-32 relative">
          <div className="font-mono text-xs text-muted-foreground mb-6 stagger">
            <div>// workflows.landing</div>
            <div>[MODE: AGENTIC] · Applied AI · Data Clarity</div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] max-w-5xl">
            <span className="caret">AI Workflows.</span>{" "}
            <span className="text-muted-foreground block">Building the gap between data and action.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed animate-fade-in-up">
            Beyond just chatbots — I build structured, repeatable processes that use 
            artificial intelligence to solve specific operational and analytical problems.
          </p>
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs">
             <button 
               onClick={() => {
                 // Trigger chatbot with workflows menu
                 const el = document.querySelector('button[title="AI Workflows"]') as HTMLButtonElement;
                 if (el) el.click();
               }}
               className="px-3 py-1.5 bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity"
             >
               → test workflows now
             </button>
             <Link href="/projects" className="px-3 py-1.5 border border-border rounded-sm link-hover">→ see implementations</Link>
          </div>
        </div>
        <MarqueeStrip items={[
          "NVIDIA NIM · Llama 3.1", "structured data pipelines", "[MODE: AGENTIC]",
          "automated reporting", "AI-assisted education", "decision-ready insights",
        ]} />
      </section>

      {/* WORKFLOW GRID */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-24 sm:mt-32 reveal">
        <div className="flex items-baseline justify-between mb-12">
          <div className="font-mono text-xs text-muted-foreground">// workflow.directory</div>
          <span className="font-mono text-xs text-muted-foreground">04 items found</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 stagger">
          {WORKFLOW_CARDS.map((w) => (
            <div 
              key={w.title} 
              className="group relative border border-border rounded-md p-8 hover:border-foreground/30 transition-all bg-card/50 overflow-hidden"
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]"
                style={{ color: w.color }}
              >
                <w.icon className="w-full h-full rotate-12" />
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-sm bg-secondary/50">
                  <w.icon className="h-5 w-5" style={{ color: w.color }} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-0.5 border border-border rounded-full">
                  {w.tag}
                </span>
              </div>
              
              <h3 className="text-2xl font-semibold mb-3">{w.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {w.description}
              </p>
              
              <ul className="space-y-2 border-t border-border pt-6">
                {w.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <Zap className="h-3 w-3 text-amber-500" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTIC PRINCIPLES */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-32 reveal">
        <div className="font-mono text-xs text-muted-foreground mb-8">// agentic.principles</div>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { t: "Predictable.", d: "Workflows must be repeatable and testable, not just lucky guesses." },
            { t: "Verifiable.", d: "Every AI output should have a path back to the source data." },
            { t: "Actionable.", d: "If it doesn't help someone make a decision, it's just noise." },
          ].map((p) => (
            <div key={p.t}>
              <h4 className="font-bold text-sm mb-2">{p.t}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 mt-32 reveal">
        <div className="border-t border-b border-border py-20 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-6">// end.of.workflows</div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Need a custom AI workflow?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
            I'm currently exploring new ways to apply Llama 3.1 and NVIDIA NIM to real-world datasets. 
            Let's discuss how we can automate your clarity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 font-mono text-xs">
            <Link href="/contact" className="px-4 py-2 bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity">→ discuss a project</Link>
            <Link href="/about" className="px-4 py-2 border border-border rounded-sm link-hover">→ about the builder</Link>
          </div>
        </div>
      </section>
    </>
  );
}
