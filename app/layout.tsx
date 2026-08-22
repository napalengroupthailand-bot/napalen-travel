import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Prompt, Amiri } from 'next/font/google'
import './globals.css'

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
})

export const metadata: Metadata = {
  title: 'หจก. นาปาเลน แทรเวิล แอนด์ ทัวร์ | NAPALEN TRAVEL & TOUR',
  description:
    'บริการฮัจญ์และอุมเราะห์ครบวงจร ด้วยความศรัทธาและมาตรฐานพรีเมียม โดย หจก. นาปาเลน แทรเวิล แอนด์ ทัวร์',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0a1428',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${amiri.variable} bg-background`}>
      <body className="font-sans antialiased noise-overlay">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
