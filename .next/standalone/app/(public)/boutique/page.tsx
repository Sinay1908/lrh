import { prisma } from '@/lib/prisma'
import BoutiqueClient from './BoutiqueClient'

export const dynamic = 'force-dynamic'

export default async function BoutiquePage() {
  let badge = 'Collection 2025'
  try {
    const rows = await prisma.parametre.findMany({ where: { section: 'boutique' } })
    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['boutique.badge'] || badge
  } catch {}
  return <BoutiqueClient badge={badge} />
}
