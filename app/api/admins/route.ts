import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, email: true, nom: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(admins)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email, nom, password } = await request.json() as { email: string; nom: string; password: string }

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 })
    }

    const existing = await prisma.admin.findUnique({ where: { email: email.trim() } })
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await prisma.admin.create({
      data: { email: email.trim(), nom: nom?.trim() || null, passwordHash },
      select: { id: true, email: true, nom: true, createdAt: true },
    })

    return NextResponse.json(admin, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
