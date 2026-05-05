import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tarifs = await prisma.tarif.findMany({ orderBy: [{ saison: 'desc' }, { ordre: 'asc' }] })
    return NextResponse.json(tarifs)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { saison, categorie, montant, description, actif, ordre } = body
    if (!saison || !categorie || montant === undefined) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    const tarif = await prisma.tarif.create({
      data: { saison, categorie, montant: Number(montant), description, actif: actif ?? true, ordre: ordre || 0 },
    })
    return NextResponse.json(tarif, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
