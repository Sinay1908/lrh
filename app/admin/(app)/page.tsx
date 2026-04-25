'use client'

import { useRouter } from 'next/navigation'
import { A, ABtn, ACard, MetricCard, StatusBadge, Icon, PageHeader } from '@/components/admin/ui'

const METRICS = [
  { label: 'Matchs à venir',         value: 7,  icon: 'matches',       color: 'blue',   trend:  2  },
  { label: 'Articles publiés',        value: 24, icon: 'news',          color: 'green',  trend:  12 },
  { label: 'Inscriptions en attente', value: 11, icon: 'registrations', color: 'amber',  trend: -3  },
  { label: 'Messages non lus',        value: 4,  icon: 'messages',      color: 'red',    trend:  4  },
  { label: 'Équipes actives',          value: 7,  icon: 'teams',         color: 'navy'              },
  { label: 'Partenaires',              value: 9,  icon: 'sponsors',      color: 'purple'            },
]

const ACTIVITY = [
  { time: 'il y a 12 min', text: "Nouvelle demande d'inscription — Lucas Perrin, U14",    icon: 'registrations', color: A.amber },
  { time: 'il y a 1h',    text: 'Article publié : "Victoire 6-2 face à Bordeaux"',        icon: 'news',          color: A.green },
  { time: 'il y a 2h',    text: 'Nouveau message : demande de partenariat',                icon: 'messages',      color: A.blue  },
  { time: 'il y a 3h',    text: 'Résultat enregistré : Lyon RH 6 – 2 Bordeaux RH',        icon: 'matches',       color: A.navy  },
  { time: 'hier',         text: 'Inscription approuvée — Emma Rousseau, Loisir',           icon: 'registrations', color: A.green },
  { time: 'hier',         text: 'Nouveau message : renseignements U11',                    icon: 'messages',      color: A.blue  },
]

const UPCOMING = [
  { date: '26 AVR', home: 'Lyon RH',      away: 'Grenoble RH',   comp: 'Nat. 1',  lieu: 'Vieux-Lyon' },
  { date: '03 MAI', home: 'Marseille RH', away: 'Lyon RH',       comp: 'Nat. 1',  lieu: 'Marseille'  },
  { date: '07 MAI', home: 'Lyon RH Rég.', away: 'Villeurbanne', comp: 'Rég. 1',  lieu: 'Vieux-Lyon' },
]

const QUICK_ACTIONS = [
  { label: 'Nouvel article',    icon: 'news',          href: '/admin/actualites',  color: A.green  },
  { label: 'Ajouter un match',  icon: 'matches',       href: '/admin/matchs',      color: A.blue   },
  { label: 'Voir inscriptions', icon: 'registrations', href: '/admin/inscriptions',color: A.amber  },
  { label: 'Lire les messages', icon: 'messages',      href: '/admin/messages',    color: A.red    },
]

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité du club" breadcrumb="Tableau de bord" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        {METRICS.map(m => (
          <MetricCard key={m.label} label={m.label} value={m.value}
            icon={m.icon} color={m.color} trend={m.trend} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
        <ACard noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${A.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>
              Prochains matchs
            </div>
            <ABtn variant="ghost" size="sm" icon="chevronR" onClick={() => router.push('/admin/matchs')}>Tout voir</ABtn>
          </div>
          {UPCOMING.map((m, i) => (
            <div key={i} style={{ padding: '13px 20px', borderBottom: i < UPCOMING.length - 1 ? `1px solid ${A.border}` : 'none',
              display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: A.navy, color: '#fff', borderRadius: A.r6,
                padding: '6px 10px', textAlign: 'center', flexShrink: 0, minWidth: 52 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, lineHeight: 1 }}>{m.date}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5, color: A.textPri,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.home} <span style={{ color: A.muted, fontWeight: 400 }}>–</span> {m.away}
                </div>
                <div style={{ color: A.muted, fontSize: 12, marginTop: 2 }}>{m.comp} · {m.lieu}</div>
              </div>
              <StatusBadge status="upcoming" />
            </div>
          ))}
        </ACard>

        <div>
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

          <ACard style={{ background: `${A.amber}10`, border: `1px solid ${A.amber}30` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: A.r6, background: A.amberL,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="registrations" size={15} color={A.amber} />
              </div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: A.textPri }}>
                11 inscriptions en attente
              </div>
            </div>
            <p style={{ color: A.textSec, fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 }}>
              Des demandes attendent votre traitement depuis 3 jours.
            </p>
            <ABtn variant="ghost" size="sm" onClick={() => router.push('/admin/inscriptions')}>Traiter les demandes →</ABtn>
          </ACard>
        </div>
      </div>

      <ACard noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${A.border}` }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>
            Activité récente
          </div>
        </div>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{ padding: '12px 20px', borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${A.border}` : 'none',
            display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={a.icon} size={14} color={a.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0, fontFamily: "'Barlow',sans-serif", fontSize: 13.5, color: A.textPri, fontWeight: 500, lineHeight: 1.4 }}>{a.text}</div>
            <div style={{ color: A.muted, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</div>
          </div>
        ))}
      </ACard>
    </div>
  )
}
