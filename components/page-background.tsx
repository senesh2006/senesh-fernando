"use client"

import DotField from "@components/DotField"
import ColorBends from "@components/ColorBends"

export function PageBackground() {
  return (
    <div className="page-background" aria-hidden>
      <ColorBends
        className="page-background__color-bends"
        colors={["#A855F7"]}
        speed={0.2}
        frequency={1.0}
        noise={0.15}
        bandWidth={0.1}
        rotation={90}
        iterations={1}
        intensity={1.3}
        transparent
      />
      <DotField
        className="page-background__dot-field"
        dotRadius={1.5}
        dotSpacing={14}
        cursorRadius={500}
        cursorForce={0.1}
        bulgeOnly
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
      />
      <div className="page-background__fade" />
    </div>
  )
}
