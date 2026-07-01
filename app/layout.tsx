import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// IMPORTANTE: dopo il deploy su Vercel, sostituisci l'URL qui sotto
// con il tuo dominio reale (es. https://greendash-tuonome.vercel.app)
const SITE_URL = 'https://greendash.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'GreenDash — Dashboard consumi energetici domestici',
  description:
    'Traccia bollette luce, gas, acqua e telefono con normalizzazione automatica delle cadenze di fatturazione, proiezioni e confronto con la media ARERA.',
  openGraph: {
    title: 'GreenDash — Dashboard consumi energetici domestici',
    description:
      'Traccia bollette luce, gas, acqua e telefono con normalizzazione automatica delle cadenze di fatturazione, proiezioni e confronto con la media ARERA.',
    url: SITE_URL,
    siteName: 'GreenDash',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreenDash — Dashboard consumi energetici domestici',
    description:
      'Traccia bollette luce, gas, acqua e telefono con normalizzazione automatica delle cadenze di fatturazione.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}