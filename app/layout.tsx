import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from "@/components/navbar"
import { MagneticBlobCursor } from "@/components/magnetic-blob-cursor"
import { PageTransition } from "@/components/page-transition"
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Peter Senesh Fernando | IT Student & Developer',
  description: 'Portfolio of Peter Senesh Fernando - Information Technology Student at Curtin University Colombo. Skilled in Python, data visualization, and analytical problem-solving.',
  keywords: ['Peter Senesh Fernando', 'IT Student', 'Developer', 'Python', 'Curtin University Colombo', 'Portfolio'],
  authors: [{ name: 'Peter Senesh Fernando' }],
  openGraph: {
    title: 'Peter Senesh Fernando | IT Student & Developer',
    description: 'Portfolio of Peter Senesh Fernando - Information Technology Student at Curtin University Colombo.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased text-foreground selection:bg-primary/30 selection:text-primary`}>
        <MagneticBlobCursor />
        {/* Subtle grain/noise texture overlay */}
        <div className="noise-overlay" />
        <Navbar />
        <main className="relative z-10 pt-16">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
