import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const params = await prisma.parametre.findMany({
      where: section ? { section } : undefined,
    })
    // Return as key-value map
    const map: Record<string, string> = {}
    params.forEach(p => { map[p.cle] = p.valeur })
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, { valeur: string; section?: string }>
    // Upsert all params
    await Promise.all(
      Object.entries(body).map(([cle, data]) =>
        prisma.parametre.upsert({
          where: { cle },
          update: { valeur: data.valeur },
          create: { cle, valeur: data.valeur, section: data.section || 'general' },
        })
      )
    )
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
