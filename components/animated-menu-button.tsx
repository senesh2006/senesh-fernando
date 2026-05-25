"use client"

interface AnimatedMenuButtonProps {
  isOpen: boolean
  onClick: () => void
  label?: string
}

export function AnimatedMenuButton({
  isOpen,
  onClick,
  label = "Toggle menu",
}: AnimatedMenuButtonProps) {
  return (
    <button
      type="button"
      className={`nav-hamburger ${isOpen ? "nav-hamburger--open" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
    >
      <span className="nav-hamburger__line" />
      <span className="nav-hamburger__line" />
      <span className="nav-hamburger__line" />
    </button>
  )
}
