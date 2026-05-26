import { cn } from "@/lib/utils";

export type OrbitItem = { id: string | number; name: string; src: string };

type Props = {
  orbitItems: OrbitItem[];
  /** Center label / logo node */
  center?: React.ReactNode;
  className?: string;
};

/**
 * Two-ring orbital display. Inner ring spins one way, outer ring the other.
 * Items counter-rotate so logos stay upright. Pure CSS — no JS.
 */
export function RadialIntro({ orbitItems, center, className }: Props) {
  const split = Math.ceil(orbitItems.length / 2);
  const inner = orbitItems.slice(0, split);
  const outer = orbitItems.slice(split);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[520px] select-none",
        className,
      )}
      aria-hidden
    >
      {/* concentric rings */}
      <div className="absolute inset-[12%] rounded-full border border-border/70" />
      <div className="absolute inset-[28%] rounded-full border border-border/50" />
      <div className="absolute inset-[44%] rounded-full border border-border/30" />

      {/* radial fade backdrop */}
      <div
        className="absolute inset-0 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-foreground) 6%, transparent), transparent 70%)",
        }}
      />

      {/* OUTER orbit (slow, clockwise) */}
      <Orbit items={outer} radiusPct={44} durationMs={42000} reverse={false} size="lg" />
      {/* INNER orbit (faster, counter-clockwise) */}
      <Orbit items={inner} radiusPct={28} durationMs={28000} reverse={true} size="md" />

      {/* CENTER */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-20 w-20 rounded-full bg-background border border-border shadow-[0_0_0_6px_color-mix(in_oklab,var(--color-background)_100%,transparent)] flex items-center justify-center">
          {center ?? (
            <div className="text-center">
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">stack</div>
              <div className="font-mono text-sm font-semibold mt-0.5">// the.kit</div>
            </div>
          )}
          <span className="absolute -inset-2 rounded-full border border-border/40 animate-orbit-pulse" />
        </div>
      </div>
    </div>
  );
}

function Orbit({
  items,
  radiusPct,
  durationMs,
  reverse,
  size,
}: {
  items: OrbitItem[];
  radiusPct: number;
  durationMs: number;
  reverse: boolean;
  size: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "lg" ? "h-8 w-8" : "h-6 w-6";
  
  return (
    <div
      className="absolute inset-0"
      style={{
        animation: `orbit-spin ${durationMs}ms linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
        willChange: "transform",
      }}
    >
      {items.map((item, i) => {
        const angle = (i / items.length) * 360;
        return (
          <div
            key={item.id}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${angle}deg) translateY(-${radiusPct}%) rotate(-${angle}deg)`,
            }}
          >
            <div
              className="relative -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `orbit-spin ${durationMs}ms linear infinite`,
                animationDirection: reverse ? "normal" : "reverse",
                willChange: "transform",
              }}
            >
              <div
                className={cn(
                  "group relative rounded-full border border-border/80 bg-background/90 shadow-md transition-all hover:scale-110 hover:border-primary/50 hover:shadow-lg flex items-center justify-center flex-shrink-0",
                  dim,
                )}
                title={item.name}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  loading="lazy"
                  className="h-6 w-6 rounded-full object-contain"
                  style={{ filter: "invert(1)", minWidth: "24px", minHeight: "24px", display: "block" }}
                />
                <span className="pointer-events-none absolute left-1/2 -bottom-8 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-10">
                  {item.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
