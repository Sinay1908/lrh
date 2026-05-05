import { prisma } from '@/lib/prisma'
import CalendrierClient from './CalendrierClient'

export const dynamic = 'force-dynamic'

export default async function CalendrierPage() {
  let badge = 'Saison 2024–2025'
  try {
    const rows = await prisma.parametre.findMany({ where: { section: 'calendrier' } })
    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['calendrier.badge'] || badge
  } catch {}
  return <CalendrierClient badge={badge} />
}
