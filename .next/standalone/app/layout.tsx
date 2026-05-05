import type { Metadata } from 'next'
import './globals.css'

// Lecture des métadonnées SEO depuis la DB (server component — revalidé toutes les 60s)
async function getSeoParams(): Promise<{ title: string; description: string }> {
  const defaults = {
    title:       'Lyon Roller Hockey — Les Aigles de Lyon',
    description: "Club de roller hockey lyonnais fondé en 1974. Inscriptions ouvertes pour la saison 2025-2026.",
  }
  try {
    const baseUrl = (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
    const res = await fetch(`${baseUrl}/api/parametres?section=seo`, { next: { revalidate: 60 } })
    if (!res.ok) return defaults
    const d: Record<string, string> = await res.json()
    return {
      title:       d['seo.title']       || defaults.title,
      description: d['seo.description'] || defaults.description,
    }
  } catch {
    return defaults
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoParams()
  return {
    title: {
      template: '%s | Lyon Roller Hockey',
      default:  seo.title,
    },
    description: seo.description,
    openGraph: {
      siteName: 'Lyon Roller Hockey',
      type:     'website',
      locale:   'fr_FR',
    },
  }
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
