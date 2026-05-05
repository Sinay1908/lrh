import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const equipes = await prisma.equipe.findMany({ orderBy: { id: 'asc' } })
    return NextResponse.json(equipes)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[GET /api/equipes]', msg)
    return NextResponse.json({ error: 'Erreur serveur', detail: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, niveau, categorie, groupe, couleur, horaire, coach, description, nbJoueurs, actif } = body
    if (!nom?.trim()) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }
    const equipe = await prisma.equipe.create({
      data: { nom: nom.trim(), niveau: niveau?.trim() || '', categorie: categorie || 'Senior', groupe: groupe || 'senior', couleur: couleur || '#0D2150', horaire: horaire || null, coach: coach || null, description: description || null, nbJoueurs: nbJoueurs || 0, actif: actif ?? true },
    })
    return NextResponse.json(equipe, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[POST /api/equipes]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
