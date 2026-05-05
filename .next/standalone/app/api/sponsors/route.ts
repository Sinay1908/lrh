import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({ orderBy: [{ ordre: 'asc' }, { id: 'asc' }] })
    return NextResponse.json(sponsors)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, logoUrl, siteUrl, niveau, actif, ordre } = body
    if (!nom) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    const sponsor = await prisma.sponsor.create({
      data: { nom, logoUrl, siteUrl, niveau: niveau || 'partenaire', actif: actif ?? true, ordre: ordre || 0 },
    })
    return NextResponse.json(sponsor, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
