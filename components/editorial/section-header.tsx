import { cn } from "@/lib/utils"
import { Reveal } from "@/components/reveal"

interface SectionHeaderProps {
  kicker?: string
  title: string
  description?: string
  align?: "center" | "left"
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left"

  return (
    <Reveal>
      <header className={`mb-14 max-w-2xl ${alignClass}`}>
        {kicker && (
          <p
            className={cn(
              "editorial-kicker mb-4 flex items-center gap-2.5",
              align === "center" ? "justify-center" : "justify-start"
            )}
          >
            <span className="editorial-kicker-line" />
            {kicker}
          </p>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base sm:text-lg text-foreground-muted font-light leading-relaxed">
            {description}
          </p>
        )}
      </header>
    </Reveal>
  )
}
