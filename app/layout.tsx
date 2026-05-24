import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Instrument_Serif, DM_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"
import { EasterEgg } from "@/components/easter-egg"
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
  title: 'PETER SENESH FERNANDO | IT Student & Developer',
  description: 'Portfolio of PETER SENESH FERNANDO - Information Technology Student at Curtin University Colombo. Skilled in Python, data visualization, and analytical problem-solving.',
  keywords: ['PETER SENESH FERNANDO', 'IT Student', 'Developer', 'Python', 'Curtin University Colombo', 'Portfolio'],
  authors: [{ name: 'PETER SENESH FERNANDO' }],
  openGraph: {
    title: 'PETER SENESH FERNANDO | IT Student & Developer',
    description: 'Portfolio of PETER SENESH FERNANDO - Information Technology Student at Curtin University Colombo.',
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
      <body className={`${fontClasses} text-foreground`}>
        <EasterEgg />
        {!isAdmin && <Navbar />}
        <main className={`relative z-10 ${isAdmin ? "" : "pt-16"}`}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
