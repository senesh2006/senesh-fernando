"use client";

import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight, Folder, FolderOpen, FileText, FileJson, FileCode, Lock, Loader2, X } from "lucide-react";
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
      <button
        type="button"
        disabled={!clickable}
        onClick={clickable ? () => onSelectFile!(node.path!) : undefined}
        className={cn(
          "group w-full text-left flex items-center gap-2 py-1 px-2 rounded-sm font-mono text-xs transition-colors",
          clickable ? "cursor-pointer hover:text-foreground hover:bg-secondary/60" : "cursor-default",
          isActive ? "text-foreground bg-secondary/70" : "text-muted-foreground"
        )}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
        ) : (
          <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
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

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-md border border-border bg-background/60 backdrop-blur p-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border mb-1">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            {isPrivate && <Lock className="h-2.5 w-2.5 text-amber-500/80" />}
            {isPrivate ? "private repository" : "repository"}
          </span>
        </div>
        {tree.map((n, i) => (
          <Node
            key={`${n.type}-${n.name}-${i}`}
            node={n}
            activePath={openFile?.path ?? null}
            loadingPath={loadingPath}
            onSelectFile={canBrowse ? handleSelectFile : undefined}
          />
        ))}
        {canBrowse && (
          <div className="px-2 pt-1.5 mt-1 border-t border-border text-[10px] text-muted-foreground/70">
            click a file to view its contents
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 font-mono text-xs text-amber-600 dark:text-amber-400">
          {error}
        </div>
      )}

      {openFile && (
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-1">
            <span className="truncate">{openFile.path}</span>
            <button
              onClick={() => setOpenFile(null)}
              className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
              aria-label="Close file"
            >
              <X className="h-3 w-3" /> close
            </button>
          </div>
          <CodeTabs lang={openFile.ext} codes={{ [openFile.name]: openFile.content }} />
        </div>
      )}
    </div>
  );
}
