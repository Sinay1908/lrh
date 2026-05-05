import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.palmaresItem.findMany({ orderBy: [{ annee: 'desc' }, { ordre: 'asc' }] })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { annee, titre, competition, description, ordre } = body
    if (!annee || !titre || !competition) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    const item = await prisma.palmaresItem.create({
      data: { annee, titre, competition, description, ordre: ordre || 0 },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
