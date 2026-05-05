import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const matchs = await prisma.match.findMany({
      where: statut ? { statut } : undefined,
      include: { equipe: { select: { nom: true, couleur: true } } },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(matchs)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { equipeId, domicile, adversaire, competition, lieu, date, heure, statut, scoreDom, scoreExt } = body
    if (!adversaire || !competition || !date) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const match = await prisma.match.create({
      data: {
        equipeId: equipeId ? Number(equipeId) : null,
        domicile: domicile ?? true,
        adversaire,
        competition,
        lieu,
        date: new Date(date),
        heure,
        statut: statut || 'upcoming',
        scoreDom: scoreDom !== undefined && scoreDom !== '' ? Number(scoreDom) : null,
        scoreExt: scoreExt !== undefined && scoreExt !== '' ? Number(scoreExt) : null,
      },
    })
    return NextResponse.json(match, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
