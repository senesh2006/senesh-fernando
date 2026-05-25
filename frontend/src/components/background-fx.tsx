export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.05] dark:opacity-[0.08]" />

      {/* Drifting ambient blobs */}
      <div className="absolute -top-1/3 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-foreground/[0.04] blur-3xl bg-blob-a" />
      <div className="absolute -bottom-1/3 -right-1/4 w-[65vw] h-[65vw] rounded-full bg-foreground/[0.05] blur-3xl bg-blob-b" />

      {/* Subtle scanline sweep */}
      <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-transparent via-foreground/[0.025] to-transparent bg-scanline" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--background)_100%)]" />
    </div>
  );
}