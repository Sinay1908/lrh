// Server Component — charge les tarifs et le badge depuis Prisma
import { prisma } from '@/lib/prisma'
import InscriptionPageClient from './InscriptionPageClient'

export const dynamic = 'force-dynamic'

export default async function InscriptionPage() {
  let tarifs: Awaited<ReturnType<typeof prisma.tarif.findMany>> = []
  let badge = 'Inscriptions 2025'

  try {
    const [tarifRows, paramRows] = await Promise.all([
      prisma.tarif.findMany({
        where:   { actif: true },
        orderBy: [{ saison: 'desc' }, { ordre: 'asc' }],
      }),
      prisma.parametre.findMany({ where: { section: 'inscription' } }),
    ])
    tarifs = tarifRows
    const d: Record<string, string> = {}
    paramRows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['inscription.badge'] || badge
  } catch {
    // DB indisponible → valeurs par défaut
  }

  return <InscriptionPageClient tarifs={tarifs} badge={badge} />
}
