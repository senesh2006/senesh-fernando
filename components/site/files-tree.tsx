import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight, Folder, FolderOpen, FileText, FileJson, FileCode, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type FileNode =
  | { type: "file"; name: string; ext?: string }
  | { type: "folder"; name: string; defaultOpen?: boolean; children: FileNode[] };

function iconForFile(name: string) {
  if (name.endsWith(".json")) return FileJson;
  if (/\.(tsx?|jsx?|css|html|mjs|cjs|svelte|vue)$/.test(name)) return FileCode;
  return FileText;
}

function Node({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  if (node.type === "file") {
    const Icon = iconForFile(node.name);
    return (
      <div
        className="group flex items-center gap-2 py-1 px-2 rounded-sm font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-default"
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
        <span className="truncate">{node.name}</span>
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
            <Node key={`${c.type}-${c.name}-${i}`} node={c} depth={depth + 1} />
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function FilesTree({ tree, isPrivate, className }: { tree: FileNode[]; isPrivate?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background/60 backdrop-blur p-2 font-mono text-xs",
        className,
      )}
    >
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
        <Node key={`${n.type}-${n.name}-${i}`} node={n} />
      ))}
    </div>
  );
}