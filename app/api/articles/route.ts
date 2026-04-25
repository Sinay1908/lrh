import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const articles = await prisma.article.findMany({
      where: statut ? { statut } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(articles)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titre, contenu, extrait, imageUrl, categorie, statut } = body
    if (!titre || !contenu) {
      return NextResponse.json({ error: 'Titre et contenu requis' }, { status: 400 })
    }
    const slug = titre
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
      + '-' + Date.now()

    const article = await prisma.article.create({
      data: { titre, slug, contenu, extrait, imageUrl, categorie, statut: statut || 'draft',
        publishedAt: statut === 'published' ? new Date() : null },
    })
    return NextResponse.json(article, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
