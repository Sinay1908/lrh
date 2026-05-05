import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const match = await prisma.match.update({
      where: { id: Number(id) },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
        equipeId: body.equipeId ? Number(body.equipeId) : null,
        scoreDom: body.scoreDom !== undefined && body.scoreDom !== '' ? Number(body.scoreDom) : null,
        scoreExt: body.scoreExt !== undefined && body.scoreExt !== '' ? Number(body.scoreExt) : null,
      },
    })
    return NextResponse.json(match)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.match.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
