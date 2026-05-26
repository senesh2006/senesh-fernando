'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, FileCode, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GithubFile {
  name: string
  path: string
  type: 'file' | 'dir'
  size?: number
  url?: string
  content?: string
}

interface CodeViewerModalProps {
  isOpen: boolean
  onClose: () => void
  owner: string
  repo: string
  repoUrl: string
}

export function CodeViewerModal({
  isOpen,
  onClose,
  owner,
  repo,
  repoUrl,
}: CodeViewerModalProps) {
  const [contents, setContents] = useState<GithubFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<GithubFile | null>(null)

  useEffect(() => {
    if (!isOpen) return

    async function fetchRepo() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/github/repo?owner=${owner}&repo=${repo}`)
        if (!response.ok) throw new Error('Failed to fetch repository')
        const data = await response.json()
        setContents(data.contents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load repository')
      } finally {
        setLoading(false)
      }
    }

    fetchRepo()
  }, [isOpen, owner, repo])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[80vh] bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <div className="flex items-center gap-3">
            <FileCode className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">{repo}</h3>
              <p className="text-xs text-muted-foreground">github.com/{owner}/{repo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* File List */}
          <div className="w-64 border-r border-border bg-background/30 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-red-400">{error}</div>
            ) : (
              <div className="p-2 space-y-1">
                {contents.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors text-left',
                      selectedFile?.path === file.path
                        ? 'bg-primary/20 text-foreground'
                        : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                    )}
                  >
                    {file.type === 'dir' ? (
                      <Folder className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <FileCode className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File Content */}
          <div className="flex-1 overflow-auto bg-background flex flex-col">
            {selectedFile ? (
              <>
                <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-mono text-muted-foreground">{selectedFile.name}</span>
                  {selectedFile.size && (
                    <span className="text-xs text-muted-foreground/60">{formatBytes(selectedFile.size)}</span>
                  )}
                </div>
                {selectedFile.content ? (
                  <pre className="flex-1 overflow-auto p-4 font-mono text-sm text-muted-foreground bg-background/50">
                    <code>{selectedFile.content}</code>
                  </pre>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    {selectedFile.type === 'dir' ? (
                      <div className="text-center">
                        <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Folder selected</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">File too large or unsupported format</p>
                        {selectedFile.url && (
                          <a
                            href={selectedFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-2 inline-block"
                          >
                            View on GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                {contents.length > 0 ? (
                  <p className="text-sm">Select a file to view</p>
                ) : (
                  <p className="text-sm">No files found</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 bg-background/50 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {contents.length} {contents.length === 1 ? 'item' : 'items'} • Showing up to 50
          </p>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 border border-border rounded-sm hover:bg-primary/10 transition-colors"
          >
            Open on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
