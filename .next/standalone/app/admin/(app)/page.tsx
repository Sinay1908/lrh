'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { A, ABtn, ACard, Icon, PageHeader } from '@/components/admin/ui'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Metrics {
  matchsAvenir:        number
  articlesPub:         number
  inscriptionsAttente: number
  messagesNonLus:      number
  equipesActives:      number
  partenaires:         number
}
interface UpcomingMatch { id: number; date: string; home: string; away: string; comp: string; lieu: string }
interface ActivityItem   { text: string; icon: string; type: string; time: string }
interface DashData {
  metrics:        Metrics
  prochainMatchs: UpcomingMatch[]
  activity:       ActivityItem[]
}

// ─── Couleur par type ─────────────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  green: A.green, blue: A.blue, amber: A.amber, red: A.red, navy: A.navy, purple: A.purple,
}

// ─── Carte métrique ───────────────────────────────────────────────────────────
function MetricCard({ label, value, icon, colorKey, href }: {
  label: string; value: number; icon: string; colorKey: string; href?: string
}) {
  const router = useRouter()
  const [hov, setHov] = useState(false)
  const color = TYPE_COLOR[colorKey] || A.blue
  const bg    = `${color}12`
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => href && router.push(href)}
      style={{ background: '#fff', borderRadius: A.r10, padding: '20px 20px', border: `1px solid ${A.border}`,
        boxShadow: hov ? A.cardHov : A.card, cursor: href ? 'pointer' : 'default',
        transition: 'all 0.15s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: A.textSec, lineHeight: 1.3, maxWidth: '70%' }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: A.r8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={16} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 34, color: A.textPri, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  )
}

// ─── Actions rapides (statiques) ──────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Nouvel article',    icon: 'news',          href: '/admin/actualites',  color: A.green  },
  { label: 'Ajouter un match',  icon: 'matches',       href: '/admin/matchs',      color: A.blue   },
  { label: 'Voir inscriptions', icon: 'registrations', href: '/admin/inscriptions',color: A.amber  },
  { label: 'Lire les messages', icon: 'messages',      href: '/admin/messages',    color: A.red    },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router  = useRouter()
  const [data, setData]       = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/dashboard')
      if (r.ok) setData(await r.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const m = data?.metrics

  const METRIC_CARDS = [
    { label: 'Matchs à venir',         value: m?.matchsAvenir        ?? 0, icon: 'matches',       colorKey: 'blue',   href: '/admin/matchs'       },
    { label: 'Articles publiés',        value: m?.articlesPub         ?? 0, icon: 'news',          colorKey: 'green',  href: '/admin/actualites'   },
    { label: 'Inscriptions en attente', value: m?.inscriptionsAttente ?? 0, icon: 'registrations', colorKey: 'amber',  href: '/admin/inscriptions' },
    { label: 'Messages non lus',        value: m?.messagesNonLus      ?? 0, icon: 'messages',      colorKey: 'red',    href: '/admin/messages'     },
    { label: 'Équipes actives',          value: m?.equipesActives      ?? 0, icon: 'teams',         colorKey: 'navy',   href: '/admin/equipes'      },
    { label: 'Partenaires',              value: m?.partenaires         ?? 0, icon: 'sponsors',      colorKey: 'purple', href: '/admin/partenaires'  },
  ]

  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité du club" breadcrumb="Tableau de bord" />

      {/* ── Métriques ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        {METRIC_CARDS.map(mc => (
          <MetricCard key={mc.label} label={mc.label} value={mc.value} icon={mc.icon} colorKey={mc.colorKey} href={mc.href} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>

        {/* ── Prochains matchs ── */}
        <ACard noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${A.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>
              Prochains matchs
            </div>
            <ABtn variant="ghost" size="sm" icon="chevronR" onClick={() => router.push('/admin/matchs')}>Tout voir</ABtn>
          </div>

          {loading ? (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: A.muted, fontSize: 13 }}>Chargement…</div>
          ) : !data?.prochainMatchs?.length ? (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: A.muted, fontSize: 13 }}>Aucun match à venir</div>
          ) : (
            data.prochainMatchs.map((match, i) => (
              <div key={match.id} style={{ padding: '13px 20px',
                borderBottom: i < data.prochainMatchs.length - 1 ? `1px solid ${A.border}` : 'none',
                display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ background: A.navy, color: '#fff', borderRadius: A.r6,
                  padding: '6px 10px', textAlign: 'center', flexShrink: 0, minWidth: 52 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, lineHeight: 1 }}>
                    {match.date}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5, color: A.textPri,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {match.home} <span style={{ color: A.muted, fontWeight: 400 }}>–</span> {match.away}
                  </div>
                  <div style={{ color: A.muted, fontSize: 12, marginTop: 2 }}>
                    {match.comp}{match.lieu ? ` · ${match.lieu}` : ''}
                  </div>
                </div>
                <span style={{ background: '#EFF6FF', color: A.blue, borderRadius: 99,
                  padding: '2px 10px', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  À venir
                </span>
              </div>
            ))
          )}
        </ACard>

        {/* ── Colonne droite ── */}
        <div>
          {/* Actions rapides */}
          <ACard style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri, marginBottom: 14 }}>
              Actions rapides
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_ACTIONS.map(q => (
                <button key={q.label} onClick={() => router.push(q.href)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                    background: A.bg, border: `1px solid ${A.border}`, borderRadius: A.r8,
                    cursor: 'pointer', textAlign: 'left', fontFamily: "'Barlow',sans-serif",
                    fontWeight: 600, fontSize: 13.5, color: A.textPri, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EDF2FF')}
                  onMouseLeave={e => (e.currentTarget.style.background = A.bg)}>
                  <div style={{ width: 30, height: 30, borderRadius: A.r6, flexShrink: 0,
                    background: `${q.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={q.icon} size={15} color={q.color} />
                  </div>
                  {q.label}
                </button>
              ))}
            </div>
          </ACard>

          {/* Inscriptions en attente */}
          {!loading && (m?.inscriptionsAttente ?? 0) > 0 && (
            <ACard style={{ background: `${A.amber}10`, border: `1px solid ${A.amber}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: A.r6, background: A.amberL,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="registrations" size={15} color={A.amber} />
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: A.textPri }}>
                  {m?.inscriptionsAttente} inscription{(m?.inscriptionsAttente ?? 0) > 1 ? 's' : ''} en attente
                </div>
              </div>
              <p style={{ color: A.textSec, fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 }}>
                Des demandes attendent votre traitement.
              </p>
              <ABtn variant="ghost" size="sm" onClick={() => router.push('/admin/inscriptions')}>
                Traiter les demandes →
              </ABtn>
            </ACard>
          )}

          {/* Messages non lus */}
          {!loading && (m?.messagesNonLus ?? 0) > 0 && (
            <ACard style={{ background: `${A.blue}08`, border: `1px solid ${A.blue}25`, marginTop: (m?.inscriptionsAttente ?? 0) > 0 ? 16 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: A.r6, background: A.blueL,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="messages" size={15} color={A.blue} />
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: A.textPri }}>
                  {m?.messagesNonLus} message{(m?.messagesNonLus ?? 0) > 1 ? 's' : ''} non lu{(m?.messagesNonLus ?? 0) > 1 ? 's' : ''}
                </div>
              </div>
              <ABtn variant="ghost" size="sm" onClick={() => router.push('/admin/messages')}>
                Lire les messages →
              </ABtn>
            </ACard>
          )}
        </div>
      </div>

      {/* ── Activité récente ── */}
      <ACard noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${A.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>
            Activité récente
          </div>
          <button onClick={load}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: A.muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="settings" size={12} color={A.muted} /> Actualiser
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '28px 20px', textAlign: 'center', color: A.muted, fontSize: 13 }}>Chargement…</div>
        ) : !data?.activity?.length ? (
          <div style={{ padding: '28px 20px', textAlign: 'center', color: A.muted, fontSize: 13 }}>Aucune activité récente</div>
        ) : (
          data.activity.map((a, i) => {
            const color = TYPE_COLOR[a.type] || A.muted
            return (
              <div key={i} style={{ padding: '12px 20px',
                borderBottom: i < data.activity.length - 1 ? `1px solid ${A.border}` : 'none',
                display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={a.icon} size={14} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0, fontFamily: "'Barlow',sans-serif",
                  fontSize: 13.5, color: A.textPri, fontWeight: 500, lineHeight: 1.4 }}>
                  {a.text}
                </div>
                <div style={{ color: A.muted, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</div>
              </div>
            )
          })
        )}
      </ACard>
    </div>
  )
}
