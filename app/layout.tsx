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
  metadataBase: new URL('https://napalen-travel.vercel.app'),
  icons: {
    icon: '/logo-napalen.png',
    apple: '/logo-napalen.png',
  },
  openGraph: {
    title: 'หจก. นาปาเลน แทรเวิล แอนด์ ทัวร์ | NAPALEN TRAVEL & TOUR',
    description:
      'บริการฮัจญ์และอุมเราะห์ครบวงจร ด้วยความศรัทธาและมาตรฐานพรีเมียม',
    url: 'https://napalen-travel.vercel.app',
    siteName: 'NAPALEN TRAVEL & TOUR',
    images: [
      {
        url: '/logo-napalen.png',
        width: 512,
        height: 512,
        alt: 'NAPALEN TRAVEL & TOUR',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'หจก. นาปาเลน แทรเวิล แอนด์ ทัวร์',
    description: 'บริการฮัจญ์และอุมเราะห์ครบวงจร',
    images: ['/logo-napalen.png'],
  },
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
