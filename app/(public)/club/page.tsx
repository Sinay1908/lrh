import { prisma } from '@/lib/prisma'
import ClubClient from './ClubClient'

export const dynamic = 'force-dynamic'

export default async function ClubPage() {
  let badge = 'Depuis 1974'
  try {
    const rows = await prisma.parametre.findMany({ where: { section: 'club' } })
    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['club.badge'] || badge
  } catch {}
  return <ClubClient badge={badge} />
}
