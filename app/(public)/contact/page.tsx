import { prisma } from '@/lib/prisma'
import ContactClient from './ContactClient'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  let badge = 'Contactez-nous'
  try {
    const rows = await prisma.parametre.findMany({ where: { section: 'contact' } })
    const d: Record<string, string> = {}
    rows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['contact.badge'] || badge
  } catch {}
  return <ContactClient badge={badge} />
}
