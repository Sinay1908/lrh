import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const competition = searchParams.get('competition')
    const saison = searchParams.get('saison')
    const lignes = await prisma.classementLigne.findMany({
      where: {
        ...(competition ? { competition } : {}),
        ...(saison ? { saison } : {}),
      },
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(lignes)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { competition, saison, position, equipe, joues, gagnes, nuls, perdus, bpour, bcontre, points, isLyon } = body
    if (!competition || !saison || !equipe || position === undefined) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const ligne = await prisma.classementLigne.create({
      data: { competition, saison, position: Number(position), equipe, joues: Number(joues) || 0, gagnes: Number(gagnes) || 0, nuls: Number(nuls) || 0, perdus: Number(perdus) || 0, bpour: Number(bpour) || 0, bcontre: Number(bcontre) || 0, points: Number(points) || 0, isLyon: isLyon ?? false },
    })
    return NextResponse.json(ligne, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
