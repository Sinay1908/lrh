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

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Lyon Roller Hockey <contact@lyonrollerhockey.fr>',
            to:   ['contact@lyonrollerhockey.fr'],
            reply_to: email,
            subject:  `[Contact] ${sujet}`,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px">
              <div style="background:#0D2150;padding:20px 28px"><h2 style="color:#fff;margin:0">Nouveau message — Lyon Roller Hockey</h2></div>
              <div style="padding:28px;background:#f9f9f9">
                <p><strong>Nom :</strong> ${nom}</p>
                <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Sujet :</strong> ${sujet}</p>
                <hr style="margin:20px 0;border:none;border-top:1px solid #ddd"/>
                <p style="white-space:pre-wrap">${message}</p>
              </div>
            </div>`,
          }),
        })
      } catch (err) {
        console.error('Resend error:', err)
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
