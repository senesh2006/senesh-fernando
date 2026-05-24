import { Wrench } from "lucide-react"

export function MaintenanceScreen() {
  return (
    <div className="editorial-hero min-h-screen flex items-center justify-center px-4">
      <div className="editorial-hero-inner max-w-lg w-full text-center py-20">
        <div className="glass-card p-10 sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-sm border border-border bg-paper-2">
            <Wrench className="h-8 w-8 text-primary animate-pulse" />
          </div>

          <p className="editorial-kicker justify-center mb-4">
            <span className="editorial-kicker-line" />
            System notice
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground mb-4">
            Site under maintenance
          </h1>

          <p className="mb-8 text-sm sm:text-base leading-relaxed text-foreground-muted font-light">
            This portfolio is being updated right now. Please check back soon.
          </p>

          <div className="rounded-sm border border-border bg-paper-2 px-4 py-3 font-mono text-xs text-foreground-muted text-left">
            <span className="text-primary">status:</span> maintenance_mode=active
          </div>
        </div>

        <p className="mt-8 font-mono text-xs text-foreground-muted/60 tracking-widest uppercase">
          Peter Senesh Fernando
        </p>
      </div>
    </div>
  )
}
