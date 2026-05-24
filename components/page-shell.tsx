import { ReactNode } from "react"
import { SiteFooter } from "@/components/site-footer"

interface PageShellProps {
  children: ReactNode
  footer?: boolean
}

export function PageShell({ children, footer = true }: PageShellProps) {
  return (
    <>
      {children}
      {footer && <SiteFooter />}
    </>
  )
}
