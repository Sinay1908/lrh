import { prisma } from '@/lib/prisma'
import EquipesClient from './EquipesClient'

export const dynamic = 'force-dynamic'

export default async function EquipesPage() {
  let badge = 'Saison 2024–2025'
  try {
    const rows = await prisma.parametre.findMany({ where: { section: 'equipes' } })
    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['equipes.badge'] || badge
  } catch {}
  return <EquipesClient badge={badge} />
}
