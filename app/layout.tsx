import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    <html lang="en" className="bg-[#0a0705]">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
