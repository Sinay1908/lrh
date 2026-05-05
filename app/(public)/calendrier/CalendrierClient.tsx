'use client'

import { useState, useEffect } from 'react'
import { C, R, SH, SECTION_PAD, MAX_W, SectionHeader, PageHero } from '@/components/public/ui'

interface Match { id: number; adversaire: string; competition: string; domicile: boolean; lieu: string | null; date: string; heure: string | null; statut: string; scoreDom: number | null; scoreExt: number | null }

function MatchRow({ m }: { m: Match }) {
  const [hov, setHov] = useState(false)
  const d = new Date(m.date)
  const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'long' })
  const home = m.domicile ? 'Lyon RH' : m.adversaire
  const away = m.domicile ? m.adversaire : 'Lyon RH'
  const isResult = m.statut !== 'upcoming'
  const resultColor: Record<string,string> = { win: '#059669', loss: '#DC2626', draw: '#D97706' }
  const resultLabel: Record<string,string> = { win: 'Victoire', loss: 'Défaite', draw: 'Match nul' }

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '18px 22px', boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.2s', display: 'grid', gridTemplateColumns: '130px 1fr auto', gap: 20, alignItems: 'center' }}>
      <div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: C.navy, textTransform: 'capitalize' }}>{dateStr}</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{m.heure || '—'}</div>
      </div>
      <div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: C.navy }}>
          {home} <span style={{ color: C.muted, fontWeight: 400 }}>–</span> {away}
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3, display: 'flex', gap: 12 }}>
          <span>{m.competition}</span>
          {m.lieu && <span>📍 {m.lieu}</span>}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {isResult && m.scoreDom !== null && m.scoreExt !== null ? (
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 24, color: resultColor[m.statut] || C.navy }}>
              {m.scoreDom} – {m.scoreExt}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: resultColor[m.statut] || C.navy, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {resultLabel[m.statut] || m.statut}
            </div>
          </div>
        ) : (
          <span style={{ background: C.offWhite, color: C.muted, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
            {isResult ? 'Résultat' : 'À venir'}
          </span>
        )}
      </div>
    </div>
  )
}

export default function CalendrierClient({ badge }: { badge: string }) {
  const [matchs, setMatchs]   = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<'upcoming' | 'results'>('upcoming')

  useEffect(() => {
    fetch('/api/matchs').then(r => r.json()).then(d => setMatchs(Array.isArray(d) ? d : [])).catch(()=>{}).finally(() => setLoading(false))
  }, [])

  const upcoming = matchs.filter(m => m.statut === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const results  = matchs.filter(m => m.statut !== 'upcoming').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const data = tab === 'upcoming' ? upcoming : results

  const competitions = [...new Set(data.map(m => m.competition))]
  const [filterComp, setFilterComp] = useState('all')
  const filtered = filterComp === 'all' ? data : data.filter(m => m.competition === filterComp)

  return (
    <div>
      <PageHero badge={badge} title="Calendrier &" titleAccent="Résultats"
        subtitle="Tous les matchs des Aigles de Lyon, compétition par compétition." />

      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: `2px solid ${C.border}`, paddingBottom: 0 }}>
            {([['upcoming','Matchs à venir'],['results','Résultats']] as [string,string][]).map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id as 'upcoming'|'results'); setFilterComp('all') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 20px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: tab === id ? C.red : C.muted, borderBottom: `3px solid ${tab === id ? C.red : 'transparent'}`, marginBottom: -2, transition: 'all 0.15s' }}>{label}</button>
            ))}
          </div>

          {competitions.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {['all', ...competitions].map(c => (
                <button key={c} onClick={() => setFilterComp(c)}
                  style={{ background: filterComp === c ? C.navy : '#fff', color: filterComp === c ? '#fff' : C.muted, border: `1.5px solid ${filterComp === c ? C.navy : C.border}`, padding: '6px 14px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 13, transition: 'all 0.15s' }}>
                  {c === 'all' ? 'Toutes' : c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted }}>Chargement…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
                {tab === 'upcoming' ? 'Aucun match programmé' : 'Aucun résultat disponible'}
              </div>
              <p>Les {tab === 'upcoming' ? 'prochains matchs' : 'résultats'} seront disponibles prochainement.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(m => <MatchRow key={m.id} m={m} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
