"use client"

import { AnimatedLiquidBackground } from "@/components/site/animated-liquid-background";

export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <AnimatedLiquidBackground preset="Plasma" speed={22} className="absolute inset-0 opacity-80" />
      <div className="absolute inset-0 bg-background/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,var(--background)_100%)]" />
    </div>
  );
}
