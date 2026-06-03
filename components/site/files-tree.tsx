"use client";

import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight, Folder, FolderOpen, FileText, FileJson, FileCode, Lock, Loader2, X, FolderInput } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeTabs } from "@/components/animate-ui/components/animate/code-tabs";

export type FileNode =
  | { type: "file"; name: string; ext?: string; path?: string }
  | { type: "folder"; name: string; defaultOpen?: boolean; children: FileNode[] };

function iconForFile(name: string) {
  if (name.endsWith(".json")) return FileJson;
  if (/\.(tsx?|jsx?|css|html|mjs|cjs|svelte|vue)$/.test(name)) return FileCode;
  return FileText;
}

interface NodeProps {
  node: FileNode;
  depth?: number;
  activePath?: string | null;
  loadingPath?: string | null;
  onSelectFile?: (path: string) => void;
}

function Node({ node, depth = 0, activePath, loadingPath, onSelectFile }: NodeProps) {
  if (node.type === "file") {
    const Icon = iconForFile(node.name);
    const clickable = Boolean(node.path && onSelectFile);
    const isActive = node.path != null && node.path === activePath;
    const isLoading = node.path != null && node.path === loadingPath;
    return (
      <div
        className={cn(
          "group flex items-center gap-2 py-1 px-2 rounded-sm font-mono text-xs transition-colors",
          isActive ? "text-foreground bg-secondary/70" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
        )}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
        ) : (
          <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
        )}
        <span className="truncate flex-1">{node.name}</span>
        {clickable && !isLoading && (
          <button
            type="button"
            onClick={() => onSelectFile!(node.path!)}
            className={cn(
              "shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] border transition-colors",
              isActive
                ? "opacity-100 border-border text-muted-foreground"
                : "opacity-0 group-hover:opacity-100 border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
            aria-label={`Open ${node.name}`}
          >
            <FolderInput className="h-3 w-3" />
            open file
          </button>
        )}
      </div>
    );
  }
  return (
    <Collapsible.Root defaultOpen={node.defaultOpen} className="group/folder">
      <Collapsible.Trigger
        className="w-full flex items-center gap-2 py-1 px-2 rounded-sm font-mono text-xs text-foreground hover:bg-secondary/60 transition-colors"
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/folder:rotate-90" />
        <Folder className="h-3.5 w-3.5 shrink-0 opacity-70 group-data-[state=open]/folder:hidden" />
        <FolderOpen className="h-3.5 w-3.5 shrink-0 opacity-70 hidden group-data-[state=open]/folder:inline" />
        <span className="truncate">{node.name}</span>
      </Collapsible.Trigger>
      <Collapsible.Content
        className={cn(
          "overflow-hidden",
          "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
        )}
      >
        <div className="border-l border-border ml-[18px]">
          {node.children.map((c, i) => (
            <Node
              key={`${c.type}-${c.name}-${i}`}
              node={c}
              depth={depth + 1}
              activePath={activePath}
              loadingPath={loadingPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

interface OpenFile {
  name: string;
  path: string;
  ext: string;
  content: string;
}

export function FilesTree({
  tree,
  isPrivate,
  repo,
  className,
}: {
  tree: FileNode[];
  isPrivate?: boolean;
  repo?: string;
  className?: string;
}) {
  const [openFile, setOpenFile] = React.useState<OpenFile | null>(null);
  const [loadingPath, setLoadingPath] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const canBrowse = Boolean(repo) && !isPrivate;

  const handleSelectFile = React.useCallback(
    async (path: string) => {
      if (!repo) return;
      setLoadingPath(path);
      setError(null);
      try {
        const res = await fetch(
          `/api/github/file?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Failed to load file");
          setOpenFile(null);
        } else if (data.tooLarge) {
          setError("This file is too large to preview here.");
          setOpenFile(null);
        } else {
          setOpenFile({ name: data.name, path: data.path, ext: data.ext, content: data.content });
        }
      } catch {
        setError("Failed to load file");
        setOpenFile(null);
      } finally {
        setLoadingPath(null);
      }
    },
    [repo]
  );

  const treePanel = (
    <div className="rounded-md border border-border bg-background/60 backdrop-blur p-2 font-mono text-xs h-full">
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border mb-1">
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          {isPrivate && <Lock className="h-2.5 w-2.5 text-amber-500/80" />}
          {isPrivate ? "private repository" : "repository"}
        </span>
      </div>
      <div className={cn(openFile ? "max-h-[420px] overflow-y-auto" : "")}>
        {tree.map((n, i) => (
          <Node
            key={`${n.type}-${n.name}-${i}`}
            node={n}
            activePath={openFile?.path ?? null}
            loadingPath={loadingPath}
            onSelectFile={canBrowse ? handleSelectFile : undefined}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {error && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 font-mono text-xs text-amber-600 dark:text-amber-400">
          {error}
        </div>
      )}

      {openFile ? (
        /* Side-by-side: tree on left, code on right */
        <div className="grid grid-cols-[280px_1fr] gap-3 items-start">
          <div>{treePanel}</div>
          <div className="space-y-2 min-w-0">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-1">
              <span className="truncate">{openFile.path}</span>
              <button
                onClick={() => setOpenFile(null)}
                className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0 ml-3"
                aria-label="Close file"
              >
                <X className="h-3 w-3" /> close
              </button>
            </div>
            <CodeTabs lang={openFile.ext} codes={{ [openFile.name]: openFile.content }} />
          </div>
        </div>
      ) : (
        treePanel
      )}
    </div>
  );
}
