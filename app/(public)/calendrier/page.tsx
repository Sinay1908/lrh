'use client'

import { useState } from 'react'
import { C, R, SH, MAX_W, Badge, CTABanner, PageHero } from '@/components/public/ui'

function ResultMatchCard({ match: m, isResult }: { match: typeof UPCOMING[0] & { score?: string; win?: boolean | null }; isResult: boolean }) {
  const [hov, setHov] = useState(false)
  const winColor = m.win === true ? '#2A7A4B' : m.win === false ? C.red : C.muted
  const winLabel = m.win === true ? 'V' : m.win === false ? 'D' : 'N'

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '18px 22px', boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.2s', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ background: isResult ? C.offWhite : C.navy, borderRadius: R.inner, padding: '10px 13px', textAlign: 'center', minWidth: 54, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, color: isResult ? C.navy : '#fff', lineHeight: 1 }}>{m.date}</div>
        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 10, color: isResult ? C.muted : C.lightBlue, letterSpacing: 1, marginTop: 2 }}>{m.day}</div>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <Badge>{m.competition}</Badge>
          <span style={{ color: C.muted, fontSize: 12 }}>{m.time}</span>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 19, color: C.navy, marginBottom: 4 }}>
          {m.home} <span style={{ color: C.muted, fontWeight: 400 }}>–</span> {m.away}
        </div>
        <div style={{ color: C.muted, fontSize: 12.5 }}>📍 {m.location}</div>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 72 }}>
        {isResult && m.score ? (
          <>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: C.navy, lineHeight: 1 }}>{m.score}</div>
            <div style={{ display: 'inline-flex', marginTop: 6, width: 24, height: 24, borderRadius: R.inner, background: winColor, alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 12, color: '#fff' }}>{winLabel}</div>
          </>
        ) : (
          <div style={{ background: C.navy, color: C.lightBlue, padding: '6px 12px', borderRadius: R.inner, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15 }}>{m.time}</div>
        )}
      </div>
    </div>
  )
}

const UPCOMING = [
  { date: '26', day: 'AVR', time: '15h00', home: 'Lyon RH',       away: 'Grenoble RH',    competition: 'Nationale 1',     location: 'Gymnase Vieux-Lyon',           team: 'nat1' },
  { date: '03', day: 'MAI', time: '18h00', home: 'Marseille RH',  away: 'Lyon RH',        competition: 'Nationale 1',     location: 'Palais des Sports, Marseille', team: 'nat1' },
  { date: '07', day: 'MAI', time: '20h00', home: 'Lyon RH Rég.',  away: 'Villeurbanne RH',competition: 'Régionale 1',     location: 'Gymnase Vieux-Lyon',           team: 'reg1' },
  { date: '10', day: 'MAI', time: '15h00', home: 'Lyon RH',       away: 'Paris RHC',      competition: 'Nationale 1',     location: 'Gymnase Vieux-Lyon',           team: 'nat1' },
  { date: '14', day: 'MAI', time: '14h00', home: 'Clermont RH',   away: 'Lyon RH Rég.',   competition: 'Régionale 1',     location: 'Gymnase Clermont',             team: 'reg1' },
  { date: '17', day: 'MAI', time: '15h00', home: 'Lyon U17',      away: 'Grenoble U17',   competition: 'Championnat U17', location: 'Gymnase Vieux-Lyon',           team: 'u17'  },
  { date: '24', day: 'MAI', time: '16h00', home: 'Lyon RH',       away: 'Toulouse RH',    competition: 'Playoffs – 1/4',  location: 'Gymnase Vieux-Lyon',           team: 'nat1' },
]

const RESULTS = [
  { date: '19', day: 'AVR', time: '15h00', home: 'Lyon RH',       away: 'Bordeaux RH',    competition: 'Nationale 1',     location: 'Gymnase Vieux-Lyon',   score: '6 – 2', win: true,  team: 'nat1' },
  { date: '12', day: 'AVR', time: '18h00', home: 'Nantes RH',     away: 'Lyon RH',        competition: 'Nationale 1',     location: 'Nantes',               score: '3 – 4', win: true,  team: 'nat1' },
  { date: '09', day: 'AVR', time: '20h00', home: 'Lyon RH Rég.',  away: 'Annecy RH',      competition: 'Régionale 1',     location: 'Gymnase Vieux-Lyon',   score: '5 – 1', win: true,  team: 'reg1' },
  { date: '05', day: 'AVR', time: '15h00', home: 'Lyon RH',       away: 'Nice RHC',       competition: 'Nationale 1',     location: 'Gymnase Vieux-Lyon',   score: '2 – 2', win: null,  team: 'nat1' },
  { date: '29', day: 'MAR', time: '18h00', home: 'Paris RHC',     away: 'Lyon RH',        competition: 'Nationale 1',     location: 'Paris',                score: '4 – 1', win: false, team: 'nat1' },
  { date: '22', day: 'MAR', time: '15h00', home: 'Lyon U17',      away: 'Annecy U17',     competition: 'Championnat U17', location: 'Gymnase Vieux-Lyon',   score: '7 – 2', win: true,  team: 'u17'  },
  { date: '15', day: 'MAR', time: '15h00', home: 'Lyon RH',       away: 'Montpellier RH', competition: 'Nationale 1',     location: 'Gymnase Vieux-Lyon',   score: '3 – 1', win: true,  team: 'nat1' },
]

const TEAM_FILTERS = [
  { id: 'all',  label: 'Toutes les équipes' },
  { id: 'nat1', label: 'Nationale 1'        },
  { id: 'reg1', label: 'Régionale 1'        },
  { id: 'u17',  label: 'U17'                },
]

export default function CalendrierPage() {
  const [tab, setTab]              = useState<'upcoming' | 'results'>('upcoming')
  const [teamFilter, setTeamFilter] = useState('all')

  const data     = tab === 'upcoming' ? UPCOMING : RESULTS
  const filtered = teamFilter === 'all' ? data : data.filter(m => m.team === teamFilter)

  return (
    <div>
      <PageHero badge="Saison 2024–25" title="Calendrier &" titleAccent="Résultats"
        subtitle="Retrouvez tous les matchs à venir et les résultats de la saison pour l'ensemble des équipes." />

      {/* ── TABS + FILTERS ── */}
      <div style={{ background: C.offWhite, padding: '0 28px', position: 'sticky', top: 72, zIndex: 10, boxShadow: '0 2px 0 rgba(13,33,80,0.06)' }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', borderBottom: `2px solid ${C.border}` }}>
            {([['upcoming', 'Prochains matchs'], ['results', 'Résultats']] as ['upcoming' | 'results', string][]).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '18px 28px', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14.5, color: tab === id ? C.navy : C.muted, borderBottom: `2px solid ${tab === id ? C.red : 'transparent'}`, marginBottom: -2, transition: 'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '14px 0', flexWrap: 'wrap' }}>
            {TEAM_FILTERS.map(t => (
              <button key={t.id} onClick={() => setTeamFilter(t.id)}
                style={{ background: teamFilter === t.id ? C.navy : '#fff', color: teamFilter === t.id ? '#fff' : C.navy, border: `1.5px solid ${teamFilter === t.id ? C.navy : C.border}`, padding: '7px 16px', borderRadius: R.inner, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIST ── */}
      <div style={{ background: C.offWhite, padding: '24px 28px 80px' }}>
        <div style={{ ...MAX_W, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted, fontSize: 15 }}>
              Aucun match trouvé pour cette sélection.
            </div>
          ) : filtered.map((m, i) => (
            <ResultMatchCard key={i} match={m} isResult={tab === 'results'} />
          ))}
        </div>
      </div>

      <CTABanner title="Venez soutenir les Aigles !"
        subtitle="Tous les matchs à domicile se déroulent au Gymnase du Vieux-Lyon. Entrée libre pour les supporters."
        btnLabel="Infos pratiques" btnHref="/contact" light />
    </div>
  )
}
