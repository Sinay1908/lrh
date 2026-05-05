import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const staff = await prisma.staffMembre.findMany({ orderBy: [{ ordre: 'asc' }, { id: 'asc' }] })
    return NextResponse.json(staff)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, role, depuis, equipeNom, description, actif, ordre } = body
    if (!nom || !role) return NextResponse.json({ error: 'Nom et rôle requis' }, { status: 400 })
    const membre = await prisma.staffMembre.create({
      data: { nom, role, depuis, equipeNom, description, actif: actif ?? true, ordre: ordre || 0 },
    })
    return NextResponse.json(membre, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
