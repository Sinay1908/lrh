/**
 * Proxy de sécurité (Next.js 16 — remplace middleware.ts)
 *
 * Pages admin :
 *   /admin/*  (sauf /admin/login) → redirige vers login si pas de session
 *
 * Routes API :
 *   /api/admins, /api/dashboard, /api/upload
 *       → 401 toutes méthodes confondues
 *   /api/messages, /api/inscriptions
 *       → POST sur le chemin exact = public (formulaires visiteurs)
 *         tout le reste (GET, PUT, DELETE, sous-chemins) = 401
 *   Toutes les autres /api/*
 *       → GET public (pages publiques)
 *         POST / PUT / PATCH / DELETE = 401
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Lecture publique OK — écriture protégée
const PUBLIC_READ_APIS = [
  '/api/articles',
  '/api/boutique',
  '/api/classement',
  '/api/equipes',
  '/api/faq',
  '/api/files',
  '/api/matchs',
  '/api/palmares',
  '/api/parametres',
  '/api/sponsors',
  '/api/staff',
  '/api/tarifs',
]

// POST public (formulaire visiteur), tout le reste protégé
const PUBLIC_POST_ONLY_APIS = ['/api/messages', '/api/inscriptions']

// Toujours protégées (toutes méthodes)
const ALWAYS_AUTH_APIS = ['/api/admins', '/api/dashboard', '/api/upload']

function unauthorized() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Pages admin (sauf /admin/login) ─────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next()

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('callbackUrl', encodeURIComponent(pathname))
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // ── 2. APIs toujours protégées ──────────────────────────────────────────
  if (ALWAYS_AUTH_APIS.some(p => pathname.startsWith(p))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return unauthorized()
    return NextResponse.next()
  }

  // ── 3. Formulaires publics — POST base seulement ────────────────────────
  //  POST /api/messages        → formulaire contact (public)
  //  GET  /api/messages        → liste admin
  //  *    /api/messages/[id]   → opérations admin
  //  idem pour /api/inscriptions
  if (PUBLIC_POST_ONLY_APIS.some(p => pathname.startsWith(p))) {
    const isPublicPost = PUBLIC_POST_ONLY_APIS.includes(pathname) && request.method === 'POST'
    if (!isPublicPost) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (!token) return unauthorized()
    }
    return NextResponse.next()
  }

  // ── 4. APIs publiques en lecture, protégées en écriture ─────────────────
  if (PUBLIC_READ_APIS.some(p => pathname.startsWith(p))) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      if (!token) return unauthorized()
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
