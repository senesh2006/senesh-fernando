"use client"

import { Grainient } from "@/components/grainient"
import "@/components/grainient.css"

export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <Grainient
        color1="#000000"
        color2="#5227FF"
        color3="#B497CF"
        timeSpeed={0.25}
        colorBalance={0}
        warpStrength={2.2}
        warpFrequency={12}
        warpSpeed={5.9}
        warpAmplitude={50}
        blendAngle={11}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0}
        grainScale={8}
        grainAnimated={false}
        contrast={1.5}
        gamma={0.8}
        saturation={0.65}
        centerX={0.34}
        centerY={0.2}
        zoom={2}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-background/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,var(--background)_100%)]" />
    </div>
  );
}
