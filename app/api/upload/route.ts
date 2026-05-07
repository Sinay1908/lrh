import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// Dossier uploads HORS du .next/ pour survivre aux déploiements
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads')

export async function POST(request: Request) {
  try {
    const { data, filename } = await request.json() as { data: string; filename: string }

    if (!data?.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Fichier invalide — seules les images sont acceptées' }, { status: 400 })
    }

    const match  = data.match(/^data:image\/(\w+);base64,/)
    const ext    = match?.[1] === 'jpeg' ? 'jpg' : (match?.[1] ?? 'jpg')
    const base64 = data.split(',')[1]
    const buffer = Buffer.from(base64, 'base64')

    // Vérification taille max 8MB
    if (buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image trop volumineuse (max 8MB)' }, { status: 400 })
    }

    const name = `${randomUUID()}.${ext}`
    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(join(UPLOAD_DIR, name), buffer)

    console.log(`[upload] Saved ${name} (${Math.round(buffer.length / 1024)}KB) to ${UPLOAD_DIR}`)

    return NextResponse.json({ url: `/api/files/${name}` })
  } catch (e) {
    console.error('[POST /api/upload]', e instanceof Error ? e.message : String(e))
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement du fichier' }, { status: 500 })
  }
}
