import { Reveal } from "@/components/reveal"

interface SectionHeaderProps {
  num?: string
  title: string
  kicker?: string
  description?: string
}

export function SectionHeader({ num, title, kicker, description }: SectionHeaderProps) {
  const label = num ?? kicker ?? ""

  return (
    <Reveal>
      <div className="section-header">
        {label && <span className="section-num">{label}</span>}
        <h2 className="section-title">{title}</h2>
      </div>
      {description && (
        <p className="section-description">{description}</p>
      )}
    </Reveal>
  )
}
