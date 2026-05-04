import { NextResponse } from "next/server"

const GITHUB_USERNAME = "senesh2006" // Update this with actual username

interface GitHubEvent {
  id: string
  type: string
  repo: { name: string }
  created_at: string
  payload: {
    commits?: { message: string }[]
    action?: string
    ref_type?: string
    ref?: string
  }
}

interface FormattedEvent {
  id: string
  type: string
  repo: string
  message: string
  date: string
}

function formatEvent(event: GitHubEvent): FormattedEvent {
  let message = ""
  
  switch (event.type) {
    case "PushEvent":
      const commitCount = event.payload.commits?.length || 0
      const firstCommit = event.payload.commits?.[0]?.message || ""
      message = commitCount > 1 
        ? `Pushed ${commitCount} commits: "${firstCommit.slice(0, 50)}${firstCommit.length > 50 ? '...' : ''}"`
        : `Pushed: "${firstCommit.slice(0, 50)}${firstCommit.length > 50 ? '...' : ''}"`
      break
    case "CreateEvent":
      message = `Created ${event.payload.ref_type} ${event.payload.ref || ""}`
      break
    case "PullRequestEvent":
      message = `${event.payload.action} pull request`
      break
    case "IssuesEvent":
      message = `${event.payload.action} issue`
      break
    case "WatchEvent":
      message = "Starred repository"
      break
    case "ForkEvent":
      message = "Forked repository"
      break
    default:
      message = event.type.replace("Event", "")
  }

  return {
    id: event.id,
    type: event.type,
    repo: event.repo.name,
    message,
    date: event.created_at,
  }
}

export async function GET() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ events: [], error: "User not found" })
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const events: GitHubEvent[] = await response.json()
    const formattedEvents = events.slice(0, 5).map(formatEvent)

    return NextResponse.json({ events: formattedEvents })
  } catch (error) {
    console.error("Failed to fetch GitHub activity:", error)
    return NextResponse.json({ events: [], error: "Failed to fetch activity" })
  }
}
