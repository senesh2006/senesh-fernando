"use client"

import { useEffect, useState } from "react"
import { Github, GitCommit, GitBranch, GitPullRequest, Star, GitFork, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GitHubEvent {
  id: string
  type: string
  repo: string
  message: string
  date: string
}

const eventIcons: Record<string, typeof GitCommit> = {
  PushEvent: GitCommit,
  CreateEvent: GitBranch,
  PullRequestEvent: GitPullRequest,
  WatchEvent: Star,
  ForkEvent: GitFork,
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count}${interval.label} ago`
    }
  }

  return "just now"
}

export function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/github")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setEvents(data.events)
        }
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#f5ede6] flex items-center gap-2">
          <Github className="h-5 w-5 text-[#ff6a00]" />
          Recent Activity
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[rgba(245,237,230,0.5)] hover:text-[#ff6a00] gap-1"
          asChild
        >
          <a href="https://github.com/senesh2006" target="_blank" rel="noopener noreferrer">
            View Profile
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-[#ff6a00] animate-spin" />
        </div>
      )}

      {error && !loading && (
        <p className="text-center text-[rgba(245,237,230,0.5)] py-8">
          {error}
        </p>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-center text-[rgba(245,237,230,0.5)] py-8">
          No recent activity
        </p>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="space-y-4">
          {events.map((event) => {
            const Icon = eventIcons[event.type] || GitCommit
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              >
                <div className="p-2 rounded-lg bg-[rgba(255,106,0,0.1)] shrink-0">
                  <Icon className="h-4 w-4 text-[#ff6a00]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#f5ede6] truncate">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={`https://github.com/${event.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#ff6a00] hover:underline truncate"
                    >
                      {event.repo}
                    </a>
                    <span className="text-xs text-[rgba(245,237,230,0.4)]">
                      {timeAgo(event.date)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
