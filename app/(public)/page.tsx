// Server Component — lit les paramètres hero et les sponsors directement depuis Prisma
import { prisma } from '@/lib/prisma'
import HomePageClient, { type HeroParams, type HeroStat, type DbSponsor } from './HomePageClient'

export const dynamic = 'force-dynamic'

const HERO_DEFAULTS: HeroParams = {
  badge:        'Saison 2024 – 2025',
  title:        'La Passion du Roller Hockey',
  subtitle:     "Depuis 1974, Les Roads défendent les couleurs du roller hockey français avec passion et ambition.",
  ctaPrimary:   'Nous rejoindre',
  ctaSecondary: 'Découvrir le club',
}

const STAT_DEFAULTS: HeroStat[] = [
  { valeur: '50+',  label: "Ans d'histoire" },
  { valeur: '180+', label: 'Licenciés'      },
  { valeur: '7',    label: 'Équipes'        },
  { valeur: '12',   label: 'Titres'         },
]

export default async function HomePage() {
  let hero       = { ...HERO_DEFAULTS }
  let heroStats  = STAT_DEFAULTS
  let sponsors: DbSponsor[] = []

  try {
    const [rows, sponsorRows] = await Promise.all([
      prisma.parametre.findMany({ where: { section: 'hero' } }),
      prisma.sponsor.findMany({ where: { actif: true }, orderBy: [{ niveau: 'asc' }, { ordre: 'asc' }] }),
    ])

    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })

    hero = {
      badge:        d['hero.badge']        || hero.badge,
      title:        d['hero.title']        || hero.title,
      subtitle:     d['hero.subtitle']     || hero.subtitle,
      ctaPrimary:   d['hero.ctaPrimary']   || hero.ctaPrimary,
      ctaSecondary: d['hero.ctaSecondary'] || hero.ctaSecondary,
    }

    heroStats = STAT_DEFAULTS.map((def, i) => ({
      valeur: d[`hero.stat.${i + 1}.valeur`] || def.valeur,
      label:  d[`hero.stat.${i + 1}.label`]  || def.label,
    }))

    sponsors = sponsorRows
  } catch {
    // DB indisponible → valeurs par défaut, pas de sponsors
  }

  return <HomePageClient hero={hero} heroStats={heroStats} sponsors={sponsors} />
}
