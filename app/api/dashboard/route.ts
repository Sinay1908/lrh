import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()

    const [
      matchsAvenir,
      articlesPub,
      inscriptionsAttente,
      messagesNonLus,
      equipesActives,
      partenaires,
      prochainMatchs,
      derniersArticles,
      dernieresInscriptions,
      dernierMessages,
      derniersMatchs,
    ] = await Promise.all([
      // Métriques
      prisma.match.count({ where: { statut: 'upcoming', date: { gte: now } } }),
      prisma.article.count({ where: { statut: 'published' } }),
      prisma.inscription.count({ where: { statut: 'pending' } }),
      prisma.message.count({ where: { lu: false, archive: false } }),
      prisma.equipe.count({ where: { actif: true } }),
      prisma.sponsor.count({ where: { actif: true } }),

      // Prochains matchs (3 max)
      prisma.match.findMany({
        where: { statut: 'upcoming', date: { gte: now } },
        orderBy: { date: 'asc' },
        take: 3,
      }),

      // Activité récente — articles publiés
      prisma.article.findMany({
        where: { statut: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: { id: true, titre: true, publishedAt: true, createdAt: true },
      }),

      // Activité récente — inscriptions
      prisma.inscription.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, prenom: true, nom: true, equipe: true, statut: true, createdAt: true },
      }),

      // Activité récente — messages
      prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, nom: true, sujet: true, createdAt: true },
      }),

      // Activité récente — résultats de match
      prisma.match.findMany({
        where: { statut: { in: ['win', 'loss', 'draw'] } },
        orderBy: { date: 'desc' },
        take: 3,
        select: { id: true, adversaire: true, statut: true, scoreDom: true, scoreExt: true, domicile: true, date: true },
      }),
    ])

    // Construire le fil d'activité fusionné et trié par date
    type ActivityEntry = { time: Date; text: string; icon: string; type: string }
    const activity: ActivityEntry[] = []

    derniersArticles.forEach(a => {
      activity.push({ time: a.publishedAt || a.createdAt, text: `Article publié : "${a.titre}"`, icon: 'news', type: 'green' })
    })
    dernieresInscriptions.forEach(i => {
      const label = i.statut === 'pending' ? 'Nouvelle demande' : i.statut === 'approved' ? 'Inscription approuvée' : 'Inscription refusée'
      activity.push({ time: i.createdAt, text: `${label} — ${i.prenom} ${i.nom}${i.equipe ? `, ${i.equipe}` : ''}`, icon: 'registrations', type: i.statut === 'pending' ? 'amber' : i.statut === 'approved' ? 'green' : 'red' })
    })
    dernierMessages.forEach(m => {
      activity.push({ time: m.createdAt, text: `Nouveau message : ${m.sujet}`, icon: 'messages', type: 'blue' })
    })
    derniersMatchs.forEach(m => {
      const home = m.domicile ? 'Lyon RH' : m.adversaire
      const away = m.domicile ? m.adversaire : 'Lyon RH'
      const score = m.scoreDom !== null && m.scoreExt !== null ? ` ${m.scoreDom}–${m.scoreExt}` : ''
      activity.push({ time: m.date, text: `Résultat : ${home}${score} ${away}`, icon: 'matches', type: 'navy' })
    })

    activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    // Formater les temps relatifs
    function relativeTime(date: Date): string {
      const diff = Date.now() - new Date(date).getTime()
      const min  = Math.floor(diff / 60000)
      const h    = Math.floor(diff / 3600000)
      const d    = Math.floor(diff / 86400000)
      if (min < 60)  return `il y a ${min} min`
      if (h   < 24)  return `il y a ${h}h`
      if (d   === 1) return 'hier'
      if (d   < 7)   return `il y a ${d} jours`
      return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    }

    // Formater les dates des matchs
    function fmtMatchDate(date: Date): string {
      return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()
    }

    return NextResponse.json({
      metrics: {
        matchsAvenir,
        articlesPub,
        inscriptionsAttente,
        messagesNonLus,
        equipesActives,
        partenaires,
      },
      prochainMatchs: prochainMatchs.map(m => ({
        id:   m.id,
        date: fmtMatchDate(m.date),
        home: m.domicile ? 'Lyon RH' : m.adversaire,
        away: m.domicile ? m.adversaire : 'Lyon RH',
        comp: m.competition,
        lieu: m.lieu || '',
        statut: m.statut,
      })),
      activity: activity.slice(0, 8).map(a => ({
        text: a.text,
        icon: a.icon,
        type: a.type,
        time: relativeTime(a.time),
      })),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[GET /api/dashboard]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
