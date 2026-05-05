'use client'

import { useState, useEffect } from 'react'
import { C, R, SECTION_PAD, MAX_W, SectionHeader, PageHero } from '@/components/public/ui'

interface Ligne { id: number; competition: string; saison: string; position: number; equipe: string; joues: number; gagnes: number; nuls: number; perdus: number; bpour: number; bcontre: number; points: number; isLyon: boolean }

function ClassementTable({ lignes, competition }: { lignes: Ligne[]; competition: string }) {
  const sorted = [...lignes].sort((a, b) => a.position - b.position)
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: C.navy, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 5, height: 24, background: C.red, borderRadius: 2 }} />
        {competition}
        {sorted[0] && <span style={{ fontSize: 13, fontWeight: 500, color: C.muted, fontFamily: "'Barlow',sans-serif" }}>Saison {sorted[0].saison}</span>}
      </div>
      <div style={{ background: '#fff', borderRadius: R.card, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 40px 40px 40px 40px 50px 50px 60px', background: C.navy, padding: '10px 16px', gap: 8 }}>
          {['#','Équipe','J','G','N','P','BP','BC','Pts'].map(h => (
            <div key={h} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: h === 'Équipe' ? 'left' : 'center', letterSpacing: 0.5 }}>{h}</div>
          ))}
        </div>
        {sorted.map((l, i) => (
          <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 40px 40px 40px 40px 50px 50px 60px', padding: '11px 16px', gap: 8, background: l.isLyon ? 'rgba(212,43,43,0.06)' : i % 2 === 0 ? '#fff' : '#FAFAFA', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 4, background: l.isLyon ? C.red : i < 3 ? C.navy : C.offWhite, color: l.isLyon || i < 3 ? '#fff' : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 15 }}>{l.position}</div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: l.isLyon ? 700 : 500, fontSize: 14, color: l.isLyon ? C.red : C.navy }}>{l.equipe}{l.isLyon ? ' ★' : ''}</div>
            {[l.joues, l.gagnes, l.nuls, l.perdus, l.bpour, l.bcontre].map((v, j) => (
              <div key={j} style={{ textAlign: 'center', fontSize: 13.5, color: C.muted }}>{v}</div>
            ))}
            <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, color: l.isLyon ? C.red : C.navy }}>{l.points}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ClassementClient({ badge }: { badge: string }) {
  const [lignes, setLignes]   = useState<Ligne[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/classement').then(r => r.json()).then(d => setLignes(Array.isArray(d) ? d : [])).catch(()=>{}).finally(() => setLoading(false))
  }, [])

  const competitions = [...new Set(lignes.map(l => l.competition))]

  return (
    <div>
      <PageHero badge={badge} title="Classement" titleAccent="General"
        subtitle="La position des Aigles de Lyon dans toutes les compétitions." />
      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted }}>Chargement…</div>
          ) : lignes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <SectionHeader label="" title="Classement à venir" center />
              <p style={{ color: C.muted }}>Les classements seront mis à jour au fil de la saison.</p>
            </div>
          ) : (
            competitions.map(c => (
              <ClassementTable key={c} competition={c} lignes={lignes.filter(l => l.competition === c)} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
