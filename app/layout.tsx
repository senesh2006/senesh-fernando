import type { Metadata } from 'next'
import { Geist, Geist_Mono, Pixelify_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from "@/components/navbar"
import { MagneticBlobCursor } from "@/components/magnetic-blob-cursor"
import { PageTransition } from "@/components/page-transition"
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify',
})

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
      <body className={`${geistSans.variable} ${geistMono.variable} ${pixelifySans.variable} ${offBit.variable} font-sans antialiased text-foreground selection:bg-primary/30 selection:text-primary`}>
        <MagneticBlobCursor />
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
