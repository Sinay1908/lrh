import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const equipes = await prisma.equipe.findMany({ orderBy: { id: 'asc' } })
    return NextResponse.json(equipes)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, niveau, categorie, groupe, couleur, horaire, coach, description, nbJoueurs, actif } = body
    if (!nom || !niveau || !categorie || !groupe) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const equipe = await prisma.equipe.create({
      data: { nom, niveau, categorie, groupe, couleur: couleur || '#0D2150', horaire, coach, description, nbJoueurs: nbJoueurs || 0, actif: actif ?? true },
    })
    return NextResponse.json(equipe, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
