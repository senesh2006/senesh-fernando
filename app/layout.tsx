import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Instrument_Serif, DM_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/next'
import { MaintenanceScreen } from "@/components/maintenance-screen"
import { PROFILE } from "@/lib/profile"
import { IMAGES } from "@/lib/images"
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
  title: 'Senesh Fernando — IT Undergraduate & Data Enthusiast',
  description: PROFILE.tagline,
  keywords: ['Senesh Fernando', 'Data Science', 'AI', 'Curtin University', 'Negombo', 'Sri Lanka', 'Portfolio'],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title: 'Senesh Fernando — IT Undergraduate & Data Enthusiast',
    description: PROFILE.tagline,
    type: 'website',
    images: [IMAGES.portrait],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Senesh Fernando — IT Undergraduate & Data Enthusiast',
    description: PROFILE.tagline,
    images: [IMAGES.portrait],
  },
}

const themeScript = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`

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
      <html lang="en" className="bg-background" suppressHydrationWarning>
        <body className={fontClasses}>
          <MaintenanceScreen />
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${fontClasses} text-foreground`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
