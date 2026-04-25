import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Lyon Roller Hockey',
    default:  'Lyon Roller Hockey — Les Aigles de Lyon',
  },
  description: "Club de roller hockey lyonnais fondé en 1974. Inscriptions ouvertes pour la saison 2025-2026.",
  openGraph: {
    siteName:  'Lyon Roller Hockey',
    type:      'website',
    locale:    'fr_FR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
