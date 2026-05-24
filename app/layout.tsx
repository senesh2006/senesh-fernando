import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Instrument_Serif, DM_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from "@/components/navbar"
import { CustomCursor } from "@/components/custom-cursor"
import { PageBackground } from "@/components/page-background"
import { PageTransition } from "@/components/page-transition"
import { MaintenanceScreen } from "@/components/maintenance-screen"
import './globals.css'

function isMaintenanceMode(pathname: string) {
  if (process.env.MAINTENANCE_MODE !== "true") return false
  return !pathname.startsWith("/admin") && !pathname.startsWith("/api/auth")
}

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'Senesh — Developer',
  description: 'Portfolio of Senesh — undergraduate developer from Sri Lanka building full-stack web apps and AI integrations.',
  keywords: ['Senesh', 'Developer', 'Full-Stack', 'AI', 'Sri Lanka', 'Portfolio'],
  authors: [{ name: 'Senesh' }],
  openGraph: {
    title: 'Senesh — Developer',
    description: 'Undergrad developer building full-stack web apps and AI integrations.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = (await headers()).get("x-pathname") ?? ""
  const maintenance = isMaintenanceMode(pathname)
  const fontClasses = `${GeistSans.variable} ${instrumentSerif.variable} ${dmMono.variable} font-sans antialiased`

  if (maintenance) {
    return (
      <html lang="en" className="bg-background">
        <body className={fontClasses}>
          <MaintenanceScreen />
        </body>
      </html>
    )
  }

  const isAdmin = pathname.startsWith("/admin")

  return (
    <html lang="en" className="bg-background">
      <body className={`${fontClasses} text-foreground ${isAdmin ? "" : "site-cursor"}`}>
        {!isAdmin && <PageBackground />}
        {!isAdmin && <CustomCursor />}
        {!isAdmin && <Navbar />}
        <main className="relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
