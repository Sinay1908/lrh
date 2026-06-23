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

    if (process.env.FORMSPREE_ID) {
      try {
        await fetch(`https://formspree.io/f/${process.env.FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: nom, _replyto: email, email, subject: sujet, message }),
        })
      } catch (err) {
        console.error('Formspree error:', err)
      }
    }

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
