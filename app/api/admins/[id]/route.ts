import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { nom, email, password } = await request.json() as { nom?: string; email?: string; password?: string }

    const data: Record<string, unknown> = {}
    if (nom   !== undefined) data.nom   = nom?.trim() || null
    if (email !== undefined) data.email = email?.trim()
    if (password?.trim()) {
      if (password.length < 8) return NextResponse.json({ error: 'Mot de passe trop court (8 car. min)' }, { status: 400 })
      data.passwordHash = await bcrypt.hash(password, 12)
    }

    const admin = await prisma.admin.update({
      where: { id: Number(id) },
      data,
      select: { id: true, email: true, nom: true, createdAt: true },
    })
    return NextResponse.json(admin)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const total = await prisma.admin.count()
    if (total <= 1) {
      return NextResponse.json({ error: 'Impossible de supprimer le dernier administrateur' }, { status: 400 })
    }
    await prisma.admin.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
