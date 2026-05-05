import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { nom, email, sujet, message } = await request.json()
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const msg = await prisma.message.create({
      data: { nom, email, sujet, corps: message },
    })
    return NextResponse.json(msg, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
