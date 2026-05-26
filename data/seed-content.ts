import { IMAGES } from "@/lib/images"
import { PROFILE } from "@/lib/profile"
import type { FileNode } from "@/components/site/files-tree"

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "img"; src: string; alt: string; caption?: string }

export type Post = {
  slug: string
  date: string
  title: string
  dek: string
  read: string
  tag: string
  cover: string
  blocks?: PostBlock[]
  contentHtml?: string
  contentMarkdown?: string
  views?: number
  tags?: string[]
}

export type Project = {
  slug: string
  n: string
  name: string
  year: string
  tag: string
  status: "shipping" | "maintained" | "archived" | "beta"
  body: string
  longDescription: string
  pros: string[]
  cons: string[]
  cover: string
  gallery: string[]
  repo: string
  demo: string
  stack: string[]
  stats: { stars: string; forks: string; issues: string; license: string; lastCommit: string }
  tree: FileNode[]
}

const baseTree: FileNode[] = [
  {
    type: "folder",
    name: "src",
    defaultOpen: true,
    children: [
      {
        type: "folder",
        name: "app",
        children: [
          { type: "file", name: "layout.tsx" },
          { type: "file", name: "page.tsx" },
        ],
      },
      {
        type: "folder",
        name: "lib",
        children: [
          { type: "file", name: "content.ts" },
          { type: "file", name: "neon.ts" },
        ],
      },
      { type: "file", name: "package.json" },
    ],
  },
  { type: "file", name: "README.md" },
]

export type SeedProject = {
  id: string
  name: string
  language: string
  description: string
  full_description: string
  source_url: string
  demo_url?: string
  skills: string[]
  impact?: string
  image_url: string
  order_index: number
  year: string
  status: Project["status"]
  pros: string[]
  cons: string[]
  gallery: string[]
  stats: Project["stats"]
  tree?: FileNode[]
}

export type SeedBlog = {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  image_url: string
  created_at: string
  blocks: PostBlock[]
  read: string
}

export const SEED_PROJECTS: SeedProject[] = [
  {
    id: "senesh-fernando-portfolio",
    name: "Senesh Fernando Portfolio",
    language: "full-stack",
    description:
      "Personal portfolio with editorial UI, admin CMS, and Neon PostgreSQL — one Next.js app for the whole site.",
    full_description:
      "A full-stack portfolio built after merging a TanStack editorial frontend into Next.js 16. Public pages load content server-side from Neon. The admin panel handles projects, blogs, skills, and experience. Includes keyboard-driven navigation, dark mode, visitor tracking, and a liquid-background project detail view.",
    source_url: "https://github.com/senesh2006/senesh-fernando",
    demo_url: PROFILE.website,
    skills: ["Next.js", "React", "TypeScript", "PostgreSQL", "Neon", "Tailwind CSS"],
    impact: "Replaced Firebase with Neon and unified frontend + backend into a single Vercel deploy.",
    image_url: "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/Pictures/Prt1.png",
    order_index: 1,
    year: "2026",
    status: "shipping",
    pros: ["server-side content from Neon", "admin CMS included", "single Vercel deployment"],
    cons: ["still iterating on content", "admin auth required for edits"],
    gallery: [
      "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/Pictures/Prt1.png",
      "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/Pictures/Prt2.png",
      "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/Pictures/Prt3.png"
    ],
    stats: { stars: "—", forks: "—", issues: "—", license: "Private", lastCommit: "recent" },
    tree: baseTree,
  },
  {
    id: "carbonwise",
    name: "CarbonWise",
    language: "sustainability",
    description:
      "Co-founded platform for sustainability reporting, environmental insights, and data-driven carbon tracking in Sri Lanka.",
    full_description:
      "CarbonWise was co-founded to help organisations measure and report environmental impact with clearer data pipelines and dashboards. I led technical development of reporting systems, worked on data collection workflows, and supported projects that turned raw sustainability metrics into actionable insights for teams and stakeholders.",
    source_url: PROFILE.github,
    demo_url: PROFILE.linkedin,
    skills: ["Python", "Data Pipelines", "PostgreSQL", "Analytics", "Agile"],
    impact: "Improved environmental reporting workflows and operational efficiency for early partners.",
    image_url: "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/carbonwise.png",
    order_index: 2,
    year: "2025",
    status: "maintained",
    pros: ["real-world sustainability impact", "data reporting focus", "co-founder experience"],
    cons: ["early-stage product", "private codebase"],
    gallery: ["https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/carbonwise-1.png", "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/carbonwise-2.png"],
    stats: { stars: "—", forks: "—", issues: "—", license: "Private", lastCommit: "2025" },
  },
  {
    id: "curtin-tutor-resources",
    name: "Curtin Tutor Hub",
    language: "education",
    description:
      "Programming fundamentals resources for Curtin engineering and CS students — C, data structures, and algorithms.",
    full_description:
      "Built while freelancing as a tutor at Curtin University Colombo. Structured notes, example problems, and walkthroughs for programming fundamentals, C programming, and data structures & algorithms. Designed to help students move from syntax to problem-solving with clearer explanations and practical exercises.",
    source_url: PROFILE.github,
    skills: ["C", "Data Structures", "Algorithms", "Teaching", "Documentation"],
    impact: "Helped students improve understanding and complete coursework with clearer guided material.",
    image_url: "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/curtin-tutor.png",
    order_index: 3,
    year: "2025",
    status: "shipping",
    pros: ["student-focused", "clear fundamentals", "built from tutoring sessions"],
    cons: ["not a public SaaS yet", "content still expanding"],
    gallery: ["https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/curtin-tutor-1.png", "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/curtin-tutor-2.png"],
    stats: { stars: "—", forks: "—", issues: "—", license: "MIT", lastCommit: "2025" },
  },
  {
    id: "ai-business-insights",
    name: "AI Business Insights Tool",
    language: "ai / analytics",
    description:
      "AI-assisted business analysis prototype that turns structured inputs into summaries, trends, and decision-ready insights.",
    full_description:
      "An experimental analytics tool exploring how AI can support small businesses and student founders. Combines structured data inputs with prompt-driven analysis to produce readable summaries, highlight trends, and suggest next steps. Part of my broader interest in bridging data and decision-making with practical, approachable tooling.",
    source_url: PROFILE.github,
    skills: ["Python", "AI", "Analytics", "SQL", "Data Science"],
    impact: "Explored practical AI workflows for non-technical stakeholders and early-stage founders.",
    image_url: "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/ai-insights.png",
    order_index: 4,
    year: "2025",
    status: "beta",
    pros: ["decision-focused outputs", "analytics + AI blend", "startup-friendly"],
    cons: ["prototype stage", "needs richer data connectors"],
    gallery: ["https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/ai-insights-1.png", "https://raw.githubusercontent.com/senesh2006/senesh-fernando/main/pictures/ai-insights-2.png"],
    stats: { stars: "—", forks: "—", issues: "—", license: "MIT", lastCommit: "2025" },
  },
]

export const SEED_BLOGS: SeedBlog[] = [
  {
    id: "bridging-data-and-decisions",
    title: "Bridging data and decision-making as a student builder",
    category: "data science",
    tags: ["data science", "analytics", "career"],
    image_url: IMAGES.coverSystem,
    created_at: "2026-01-15T00:00:00.000Z",
    read: "6 min",
    content: `I'm studying Information Technology at Curtin University Colombo, but the question that keeps me up isn't a syllabus topic — it's how to turn data into better decisions.

Most teams don't fail because they lack data. They fail because the data never becomes something a human can act on. Dashboards get built, spreadsheets multiply, and the insight still sits one translation layer away from the person who needs it.

That's the problem I'm interested in: the gap between collection and clarity.

## What I'm building toward

My work so far — from AI-assisted analysis experiments to sustainability reporting at CarbonWise — has been about making numbers legible. Not prettier charts for their own sake, but outputs someone can read in five minutes and actually use.

## What I've learned early

Start with the decision, not the dataset. Ask what someone needs to choose before you ask what data you have. The tooling gets easier when the question is honest.

If you're working on analytics, education, or applied AI in Sri Lanka, I'd love to compare notes.`,
    blocks: [
      {
        type: "p",
        text: "I'm studying Information Technology at Curtin University Colombo, but the question that keeps me up isn't a syllabus topic — it's how to turn data into better decisions.",
      },
      {
        type: "p",
        text: "Most teams don't fail because they lack data. They fail because the data never becomes something a human can act on.",
      },
      { type: "h2", text: "what i'm building toward" },
      {
        type: "p",
        text: "My work so far — from AI-assisted analysis experiments to sustainability reporting at CarbonWise — has been about making numbers legible.",
      },
      { type: "h2", text: "what i've learned early" },
      {
        type: "p",
        text: "Start with the decision, not the dataset. Ask what someone needs to choose before you ask what data you have.",
      },
    ],
  },
  {
    id: "co-founding-carbonwise",
    title: "What co-founding CarbonWise taught me about data and sustainability",
    category: "startups",
    tags: ["carbonwise", "sustainability", "data pipelines"],
    image_url: IMAGES.coverPerf,
    created_at: "2025-11-20T00:00:00.000Z",
    read: "7 min",
    content: `CarbonWise started with a straightforward frustration: sustainability data was scattered, slow to compile, and hard to trust once it finally arrived in a report.

Co-founding the initiative meant wearing more hats than any course prepares you for — product thinking, data reporting, stakeholder communication, and the unglamorous work of making sure numbers reconcile.

## Reporting is a pipeline problem

Environmental insights don't fail at the chart. They fail upstream — inconsistent inputs, manual handoffs, and formats that change every quarter. Treating reporting like a data pipeline (validate early, automate repeats, document assumptions) made the whole system more credible.

## Sustainability needs better UX too

The best metric in the world doesn't matter if a team can't find it. Clarity beats complexity, especially when you're asking non-technical people to act on data.

I'm still learning, but CarbonWise pushed me to connect analytics skills with real operational problems — and that's the work I want to keep doing.`,
    blocks: [
      {
        type: "p",
        text: "CarbonWise started with a straightforward frustration: sustainability data was scattered, slow to compile, and hard to trust once it finally arrived in a report.",
      },
      { type: "h2", text: "reporting is a pipeline problem" },
      {
        type: "p",
        text: "Environmental insights don't fail at the chart. They fail upstream — inconsistent inputs, manual handoffs, and formats that change every quarter.",
      },
      { type: "h2", text: "sustainability needs better UX too" },
      {
        type: "p",
        text: "The best metric in the world doesn't matter if a team can't find it. Clarity beats complexity.",
      },
    ],
  },
  {
    id: "teaching-programming-at-curtin",
    title: "Teaching C and data structures at Curtin — what actually helps students",
    category: "education",
    tags: ["curtin", "tutoring", "programming", "c"],
    image_url: IMAGES.coverKeyboard,
    created_at: "2025-10-05T00:00:00.000Z",
    read: "5 min",
    content: `Since August 2025 I've been tutoring engineering and computer science students at Curtin University Colombo in programming fundamentals, C, and data structures & algorithms.

The pattern is consistent: students don't struggle because they're incapable. They struggle because abstractions arrive before intuition.

## What works in sessions

Drawing memory before code. Tracing loops on paper. Replacing "memorise the syntax" with "predict the output." Once a student can predict, debugging becomes possible — and confidence follows.

## Why fundamentals still matter

Frameworks change every year. Pointers, complexity, and clear problem decomposition don't expire. The students who grasp fundamentals adapt faster to everything else on the curriculum.

Tutoring keeps me honest as a builder. If I can't explain it simply, I probably don't understand it deeply enough yet.`,
    blocks: [
      {
        type: "p",
        text: "Since August 2025 I've been tutoring engineering and computer science students at Curtin University Colombo in programming fundamentals, C, and data structures & algorithms.",
      },
      { type: "h2", text: "what works in sessions" },
      {
        type: "p",
        text: "Drawing memory before code. Tracing loops on paper. Replacing 'memorise the syntax' with 'predict the output.'",
      },
      { type: "h2", text: "why fundamentals still matter" },
      {
        type: "p",
        text: "Frameworks change every year. Pointers, complexity, and clear problem decomposition don't expire.",
      },
    ],
  },
  {
    id: "tetr-verse-hackathon",
    title: "Notes from the Tetr Verse Pro Hackathon",
    category: "hackathons",
    tags: ["hackathon", "tetr", "business"],
    image_url: IMAGES.coverHandoff,
    created_at: "2025-07-18T00:00:00.000Z",
    read: "4 min",
    content: `I participated in the Tetr Verse Pro Hackathon at Tetr College of Business in July 2025. It was a sharp reminder that ideas compete on clarity as much as code.

Hackathons compress weeks of ambiguity into hours. The teams that did best weren't the ones with the flashiest demos — they were the ones who picked a narrow problem and showed a believable path to value.

## Three takeaways

Ship a story, not a feature list. Judges and teammates both need to understand the "why" in the first minute.

Scope is a skill. A working slice beats a broken grand vision.

Business context matters. Technical builders who can articulate impact are dramatically easier to collaborate with.

I'd love to do more events like this — especially where tech, education, and entrepreneurship overlap.`,
    blocks: [
      {
        type: "p",
        text: "I participated in the Tetr Verse Pro Hackathon at Tetr College of Business in July 2025.",
      },
      { type: "h2", text: "three takeaways" },
      {
        type: "p",
        text: "Ship a story, not a feature list. Scope is a skill. Business context matters.",
      },
    ],
  },
  {
    id: "rh124-linux-notes",
    title: "RH124 forced me to respect the terminal again",
    category: "linux",
    tags: ["rhel", "linux", "certification"],
    image_url: IMAGES.coverVanilla,
    created_at: "2025-06-12T00:00:00.000Z",
    read: "5 min",
    content: `Completing Red Hat System Administration I (RH124 — RHA, Ver. 9.3) reminded me why Linux fundamentals still belong in a modern IT degree.

Cloud dashboards hide a lot. When something breaks — permissions, services, storage mounts — the terminal is still where the truth shows up.

## What stuck

User and group management isn't bureaucracy; it's the security model. Services aren't magic; they're units with logs. File systems aren't abstract; they're where backups and permissions actually live.

I'm not trying to become a sysadmin full-time, but understanding the layer under my apps makes me a better developer and a more credible data person when pipelines hit production issues.

If you're studying IT and skipping the operating system depth — reconsider. The confidence pays off faster than you'd expect.`,
    blocks: [
      {
        type: "p",
        text: "Completing Red Hat System Administration I (RH124 — RHA, Ver. 9.3) reminded me why Linux fundamentals still belong in a modern IT degree.",
      },
      { type: "h2", text: "what stuck" },
      {
        type: "p",
        text: "User and group management isn't bureaucracy; it's the security model. Services aren't magic; they're units with logs.",
      },
    ],
  },
]

export function seedProjectToFrontend(record: SeedProject, index: number): Project {
  return {
    slug: record.id,
    n: String(index + 1).padStart(2, "0"),
    name: record.name,
    year: record.year,
    tag: record.language,
    status: record.status,
    body: record.description,
    longDescription: record.full_description,
    pros: record.pros,
    cons: record.cons,
    cover: record.image_url,
    gallery: record.gallery,
    repo: record.source_url,
    demo: record.demo_url || record.source_url,
    stack: record.skills,
    stats: record.stats,
    tree: record.tree || baseTree,
  }
}

export function seedBlogToFrontend(record: SeedBlog): Post {
  const date = record.created_at.slice(0, 10).replace(/-/g, ".")
  const parts = date.split(".")
  const formatted = parts.length === 3 ? `${parts[0]}.${parts[1]}.${parts[2]}` : date

  return {
    slug: record.id,
    date: formatted,
    title: record.title,
    dek: record.content.split("\n\n")[0]?.trim() || record.title,
    read: record.read,
    tag: record.category,
    cover: record.image_url,
    contentMarkdown: record.content,
    blocks: record.blocks,
    tags: record.tags,
    views: 0,
  }
}

export const FALLBACK_PROJECTS = SEED_PROJECTS.map(seedProjectToFrontend)
export const FALLBACK_POSTS = SEED_BLOGS.map(seedBlogToFrontend)
