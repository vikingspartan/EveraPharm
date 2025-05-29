import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'EveraPharma - Leading Pharmaceutical Distributor',
    template: '%s | EveraPharma',
  },
  description: 'Global manufacturer and supplier of pharmaceuticals, medical devices, supplements, and veterinary medicines distributed in more than 65 countries.',
  keywords: ['pharmaceuticals', 'medical devices', 'supplements', 'veterinary', 'distributor', 'manufacturer'],
  authors: [{ name: 'EveraPharma' }],
  creator: 'EveraPharma',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://everapharm.com',
    siteName: 'EveraPharma',
    title: 'EveraPharma - Leading Pharmaceutical Distributor',
    description: 'Global manufacturer and supplier of pharmaceuticals, medical devices, supplements, and veterinary medicines.',
    images: [
      {
        url: 'https://everapharm.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EveraPharma',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EveraPharma - Leading Pharmaceutical Distributor',
    description: 'Global manufacturer and supplier of pharmaceuticals and medical products.',
    images: ['https://everapharm.com/twitter-image.jpg'],
    creator: '@everapharm',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}