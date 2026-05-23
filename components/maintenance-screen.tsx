import { Wrench } from "lucide-react"

export function MaintenanceScreen() {
  return (
    <div className="relative min-h-screen bg-[#050302] text-foreground flex items-center justify-center px-4 overflow-hidden">
      <div className="noise-overlay" />
      <div className="grid-background" />

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="glass-card p-10 sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Wrench className="h-8 w-8 text-primary animate-pulse" />
          </div>

          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-primary/80">
            System notice
          </p>

          <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-foreground">
            Site under maintenance
          </h1>

          <p className="mb-8 text-sm sm:text-base leading-relaxed text-foreground-muted">
            This portfolio is being updated right now. Please check back soon —
            we&apos;ll be back online shortly.
          </p>

          <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 font-mono text-xs text-foreground-muted">
            <span className="text-primary">status:</span> maintenance_mode=active
          </div>
        </div>

        <p className="mt-8 text-xs text-foreground-muted/60">
          PETER SENESH FERNANDO
        </p>
      </div>
    </div>
  )
}
