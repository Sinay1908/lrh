import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const article = await prisma.article.findUnique({ where: { id: Number(id) } })
    if (!article) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        ...body,
        publishedAt: body.statut === 'published' ? (body.publishedAt || new Date()) : null,
        updatedAt: new Date(),
      },
    })
    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.article.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
