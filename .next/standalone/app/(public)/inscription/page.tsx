// Server Component — charge les tarifs depuis Prisma, injecte dans le HTML
import { prisma } from '@/lib/prisma'
import InscriptionPageClient from './InscriptionPageClient'

export const dynamic = 'force-dynamic'

export default async function InscriptionPage() {
  let tarifs: Awaited<ReturnType<typeof prisma.tarif.findMany>> = []

  try {
    tarifs = await prisma.tarif.findMany({
      where:   { actif: true },
      orderBy: [{ saison: 'desc' }, { ordre: 'asc' }],
    })
  } catch {
    // DB indisponible → section tarifs affiche message "à venir"
  }

  return <InscriptionPageClient tarifs={tarifs} />
}
