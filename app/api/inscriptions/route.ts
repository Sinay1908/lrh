import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { prenom, nom, email, tel, equipe, message } = await request.json()
    if (!prenom || !nom || !email) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const inscription = await prisma.inscription.create({
      data: { prenom, nom, email, telephone: tel, equipe, message },
    })
    return NextResponse.json(inscription, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const inscriptions = await prisma.inscription.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(inscriptions)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
