import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const produits = await prisma.produitBoutique.findMany({ orderBy: [{ ordre: 'asc' }, { id: 'asc' }] })
    return NextResponse.json(produits)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, categorie, prix, description, badge, disponible, ordre } = body
    if (!nom || !categorie || prix === undefined) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    const produit = await prisma.produitBoutique.create({
      data: { nom, categorie, prix: Number(prix), description, badge, disponible: disponible ?? true, ordre: ordre || 0 },
    })
    return NextResponse.json(produit, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
