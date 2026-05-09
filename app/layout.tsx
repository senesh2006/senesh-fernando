import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from "@/components/navbar"
import { MagneticBlobCursor } from "@/components/magnetic-blob-cursor"
import { PageTransition } from "@/components/page-transition"
import { EasterEgg } from "@/components/easter-egg"
import './globals.css'

const offBit = localFont({
  src: [
    {
      path: '../public/fonts/OffBit-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/OffBit-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-offbit',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${offBit.variable} font-sans antialiased text-foreground selection:bg-primary/30 selection:text-primary`}>
        <MagneticBlobCursor />
        <EasterEgg />
        {/* Subtle grain/noise texture overlay */}
        <div className="noise-overlay" />
        <div className="grid-background" />
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
