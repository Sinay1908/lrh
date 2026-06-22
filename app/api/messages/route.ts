import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'mail.infomaniak.com',
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(request: Request) {
  try {
    const { nom, email, sujet, message } = await request.json()
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const msg = await prisma.message.create({
      data: { nom, email, sujet, corps: message },
    })

    // Envoi email — non bloquant si SMTP non configuré
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = getTransporter()
        await transporter.sendMail({
          from:    `"Site Lyon Roller Hockey" <${process.env.SMTP_USER}>`,
          to:      process.env.SMTP_TO || 'contact@lyonrollerhockey.fr',
          replyTo: email,
          subject: `[Contact] ${sujet}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#0D2150;padding:20px 28px">
                <h2 style="color:#fff;margin:0;font-size:20px">Nouveau message — Lyon Roller Hockey</h2>
              </div>
              <div style="padding:28px;background:#f9f9f9">
                <p><strong>Nom :</strong> ${nom}</p>
                <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Sujet :</strong> ${sujet}</p>
                <hr style="margin:20px 0;border:none;border-top:1px solid #ddd"/>
                <p style="white-space:pre-wrap">${message}</p>
              </div>
              <div style="padding:16px 28px;background:#eee;font-size:12px;color:#888">
                Message envoyé depuis le formulaire de contact du site lyonrollerhockey.fr
              </div>
            </div>
          `,
        })
      } catch (mailErr) {
        console.error('Email send error:', mailErr)
        // Ne pas faire échouer la requête si l'email plante
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
