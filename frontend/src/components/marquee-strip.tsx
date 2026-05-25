export function MarqueeStrip({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden border-y border-border bg-secondary/40">
      <div className="marquee-track flex gap-12 whitespace-nowrap py-3 font-mono text-xs text-muted-foreground">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-12 shrink-0">
            {items.map((s) => (
              <span key={s} className="flex items-center gap-3"><span>•</span>{s}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}