import { prisma } from '@/lib/prisma'
import ClassementClient from './ClassementClient'

export const dynamic = 'force-dynamic'

export default async function ClassementPage() {
  let badge = 'Saison 2024–2025'
  try {
    const rows = await prisma.parametre.findMany({ where: { section: 'classement' } })
    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['classement.badge'] || badge
  } catch {}
  return <ClassementClient badge={badge} />
}
