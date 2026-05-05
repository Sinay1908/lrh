import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.faqItem.findMany({
      where:   { actif: true },
      orderBy: { ordre: 'asc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, reponse, ordre } = body
    if (!question || !reponse) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    const item = await prisma.faqItem.create({
      data: { question, reponse, ordre: ordre ?? 0, actif: true },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
