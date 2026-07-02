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
        {/*
          eslint-disable-next-line @next/next/no-page-custom-font --
          Questo è il layout ROOT (app/layout.tsx), condiviso da TUTTE le
          pagine dell'app — non un layout di singola pagina. La regola
          no-page-custom-font è pensata per il vecchio Pages Router, dove un
          <link> in una pagina caricava il font SOLO per quella pagina: qui
          è un falso positivo.

          display=block (invece di swap) nasconde il testo dell'icona
          finché il font non è pronto, invece di mostrare per un istante
          la parola grezza ("bolt", "add", ecc.) al posto del disegno —
          è la soluzione corretta per i font a icone via ligatura.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}