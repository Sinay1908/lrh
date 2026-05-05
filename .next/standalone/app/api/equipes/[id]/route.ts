import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const equipe = await prisma.equipe.findUnique({ where: { id: Number(id) } })
    if (!equipe) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(equipe)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nom, niveau, categorie, groupe, couleur, horaire, coach, description, nbJoueurs, actif } = body
    if (!nom?.trim()) return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    const equipe = await prisma.equipe.update({
      where: { id: Number(id) },
      data: { nom: nom.trim(), niveau: niveau?.trim() || '', categorie, groupe, couleur: couleur || '#0D2150', horaire: horaire || null, coach: coach || null, description: description || null, nbJoueurs: nbJoueurs || 0, actif: actif ?? true },
    })
    return NextResponse.json(equipe)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[PUT /api/equipes/:id]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.equipe.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
