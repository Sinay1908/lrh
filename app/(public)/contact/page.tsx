import { prisma } from '@/lib/prisma'
import ContactClient, { type FaqItem } from './ContactClient'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  let badge = 'Contactez-nous'
  let faqs: FaqItem[] = []

  try {
    const [paramRows, faqRows] = await Promise.all([
      prisma.parametre.findMany({ where: { section: 'contact' } }),
      prisma.faqItem.findMany({ where: { actif: true }, orderBy: { ordre: 'asc' } }),
    ])
    const d: Record<string, string> = {}
    paramRows.forEach(p => { d[p.cle] = p.valeur })
    badge = d['contact.badge'] || badge
    faqs  = faqRows
  } catch {}

  return <ContactClient badge={badge} faqs={faqs} />
}
