import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const ligne = await prisma.classementLigne.update({
      where: { id: Number(id) },
      data: { ...body, position: Number(body.position), joues: Number(body.joues), gagnes: Number(body.gagnes), nuls: Number(body.nuls), perdus: Number(body.perdus), bpour: Number(body.bpour), bcontre: Number(body.bcontre), points: Number(body.points) },
    })
    return NextResponse.json(ligne)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.classementLigne.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
