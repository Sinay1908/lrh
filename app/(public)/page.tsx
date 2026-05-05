// Server Component — lit les paramètres hero directement depuis Prisma
// Les valeurs sont injectées dans le HTML initial, sans dépendre du JS client
import { prisma } from '@/lib/prisma'
import HomePageClient, { type HeroParams } from './HomePageClient'

// Toujours rendu côté serveur, jamais mis en cache statiquement
export const dynamic = 'force-dynamic'

const HERO_DEFAULTS: HeroParams = {
  badge:        'Saison 2024 – 2025',
  title:        'La Passion du Roller Hockey',
  subtitle:     "Depuis 1974, les Aigles de Lyon défendent les couleurs du roller hockey français avec passion et ambition.",
  ctaPrimary:   'Nous rejoindre',
  ctaSecondary: 'Découvrir le club',
}

export default async function HomePage() {
  let hero = { ...HERO_DEFAULTS }

  try {
    const rows = await prisma.parametre.findMany({ where: { section: 'hero' } })
    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })
    hero = {
      badge:        d['hero.badge']        || hero.badge,
      title:        d['hero.title']        || hero.title,
      subtitle:     d['hero.subtitle']     || hero.subtitle,
      ctaPrimary:   d['hero.ctaPrimary']   || hero.ctaPrimary,
      ctaSecondary: d['hero.ctaSecondary'] || hero.ctaSecondary,
    }
  } catch {
    // DB indisponible → valeurs par défaut
  }

  return <HomePageClient hero={hero} />
}
