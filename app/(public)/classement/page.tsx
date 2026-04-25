'use client'

import { useState } from 'react'
import Image from 'next/image'
import { C, R, SH, MAX_W, CTABanner, PageHero } from '@/components/public/ui'

type FormResult = 'V' | 'N' | 'D'
interface TableEntry { rank: number; team: string; pts: number; j: number; v: number; n: number; d: number; bp: number; bc: number; form: FormResult[]; highlight?: boolean }

function TableRow({ row, i, isLyon }: { row: TableEntry; i: number; isLyon: boolean }) {
  const [hov, setHov] = useState(false)
  const formColor = (f: FormResult) => f === 'V' ? '#2A7A4B' : f === 'D' ? C.red : C.muted
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'grid', gridTemplateColumns: '44px 1fr 52px 52px 52px 52px 62px 62px 90px', padding: '13px 20px', gap: 6, alignItems: 'center', background: isLyon ? C.lightBluePale : hov ? C.offWhite : '#fff', borderTop: `1px solid ${C.border}`, transition: 'background 0.15s' }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: i < 3 ? C.red : C.muted, textAlign: 'center' }}>{row.rank}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isLyon && <Image src="/assets/logo-secondaire.png" alt="" width={18} height={18} style={{ objectFit: 'contain', flexShrink: 0 }} />}
        <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: isLyon ? 700 : 500, fontSize: 14, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.team}</span>
        {isLyon && <span style={{ flexShrink: 0, background: C.red, color: '#fff', padding: '1px 7px', borderRadius: R.badge, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>VOUS</span>}
      </div>
      {[row.j, row.v, row.n, row.d, row.bp, row.bc].map((val, j) => (
        <div key={j} style={{ textAlign: 'center', fontFamily: "'Barlow',sans-serif", fontSize: 13.5, fontWeight: j === 1 ? 700 : j === 3 ? 600 : 400, color: j === 1 ? '#2A7A4B' : j === 3 ? C.red : C.navy }}>{val}</div>
      ))}
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        {row.form.map((f, j) => (
          <div key={j} style={{ width: 19, height: 19, borderRadius: 3, background: formColor(f), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 800 }}>{f}</div>
        ))}
      </div>
    </div>
  )
}

const TABLES: Record<string, TableEntry[]> = {
  nat1: [
    { rank:1,  team:'Paris RHC',       pts:52, j:22, v:17, n:1, d:4,  bp:98, bc:52, form:['V','V','N','V','V'] },
    { rank:2,  team:'Marseille RH',     pts:48, j:22, v:15, n:3, d:4,  bp:87, bc:58, form:['V','D','V','V','N'] },
    { rank:3,  team:'Lyon RH',          pts:44, j:22, v:14, n:2, d:6,  bp:79, bc:61, form:['V','V','V','N','D'], highlight:true },
    { rank:4,  team:'Toulouse RH',      pts:41, j:22, v:13, n:2, d:7,  bp:74, bc:65, form:['D','V','V','D','V'] },
    { rank:5,  team:'Bordeaux RH',      pts:38, j:22, v:12, n:2, d:8,  bp:68, bc:70, form:['D','V','D','V','V'] },
    { rank:6,  team:'Nantes RH',        pts:35, j:22, v:11, n:2, d:9,  bp:63, bc:72, form:['V','D','V','D','V'] },
    { rank:7,  team:'Nice RHC',         pts:30, j:22, v:9,  n:3, d:10, bp:60, bc:79, form:['N','D','V','D','N'] },
    { rank:8,  team:'Grenoble RH',      pts:27, j:22, v:8,  n:3, d:11, bp:58, bc:84, form:['D','D','V','V','D'] },
    { rank:9,  team:'Montpellier RH',   pts:22, j:22, v:7,  n:1, d:14, bp:54, bc:91, form:['D','D','V','D','D'] },
    { rank:10, team:'Strasbourg RH',    pts:14, j:22, v:4,  n:2, d:16, bp:42, bc:104,form:['D','D','D','V','D'] },
  ],
  reg1: [
    { rank:1, team:'Villeurbanne RH',  pts:38, j:18, v:12, n:2, d:4, bp:72, bc:45, form:['V','V','V','N','V'] },
    { rank:2, team:'Lyon RH Rég.',     pts:35, j:18, v:11, n:2, d:5, bp:68, bc:50, form:['V','V','V','V','D'], highlight:true },
    { rank:3, team:'Annecy RH',        pts:31, j:18, v:10, n:1, d:7, bp:61, bc:55, form:['V','D','V','V','N'] },
    { rank:4, team:'Clermont RH',      pts:28, j:18, v:9,  n:1, d:8, bp:56, bc:59, form:['D','V','V','D','V'] },
    { rank:5, team:'Saint-Étienne RH', pts:21, j:18, v:6,  n:3, d:9, bp:48, bc:66, form:['N','D','V','D','N'] },
    { rank:6, team:'Chambéry RH',      pts:14, j:18, v:4,  n:2, d:12,bp:39, bc:79, form:['D','D','V','D','D'] },
  ],
  reg2: [
    { rank:1, team:'Lyon RH Loisir',     pts:30, j:14, v:10, n:0, d:4, bp:58, bc:38, form:['V','V','V','D','V'], highlight:true },
    { rank:2, team:'Bourg-en-Bresse RH', pts:26, j:14, v:8,  n:2, d:4, bp:51, bc:43, form:['V','N','V','V','D'] },
    { rank:3, team:'Oyonnax RH',         pts:20, j:14, v:6,  n:2, d:6, bp:44, bc:49, form:['D','V','N','V','D'] },
    { rank:4, team:'Roanne RH',          pts:15, j:14, v:4,  n:3, d:7, bp:37, bc:55, form:['N','D','V','D','N'] },
  ],
  u17: [
    { rank:1, team:'Lyon U17',     pts:28, j:12, v:9, n:1, d:2, bp:64, bc:32, form:['V','V','V','N','V'], highlight:true },
    { rank:2, team:'Grenoble U17', pts:24, j:12, v:8, n:0, d:4, bp:58, bc:38, form:['V','D','V','V','D'] },
    { rank:3, team:'Annecy U17',   pts:19, j:12, v:6, n:1, d:5, bp:47, bc:44, form:['V','N','D','V','V'] },
    { rank:4, team:'Clermont U17', pts:14, j:12, v:4, n:2, d:6, bp:39, bc:52, form:['D','D','V','N','D'] },
    { rank:5, team:'Chambéry U17', pts:8,  j:12, v:2, n:2, d:8, bp:28, bc:68, form:['D','D','D','N','V'] },
  ],
}

const LEAGUES = [
  { id: 'nat1', label: 'Nationale 1'  },
  { id: 'reg1', label: 'Régionale 1'  },
  { id: 'reg2', label: 'Régionale 2'  },
  { id: 'u17',  label: 'U17 Régional' },
]

export default function ClassementPage() {
  const [league, setLeague] = useState('nat1')
  const current = TABLES[league]
  const lyonRow = current.find(r => r.highlight)

  return (
    <div>
      <PageHero badge="Saison 2024–25" title="Classement" titleAccent="& Statistiques"
        subtitle="Suivez les classements de toutes les équipes de Lyon Roller Hockey en temps réel." />

      {/* ── LEAGUE SELECTOR ── */}
      <div style={{ background: C.offWhite, padding: '28px 28px 0', position: 'sticky', top: 72, zIndex: 10, boxShadow: '0 2px 0 rgba(13,33,80,0.06)' }}>
        <div style={{ ...MAX_W, display: 'flex', gap: 8, paddingBottom: 16, flexWrap: 'wrap' }}>
          {LEAGUES.map(l => (
            <button key={l.id} onClick={() => setLeague(l.id)}
              style={{ background: league === l.id ? C.navy : '#fff', color: league === l.id ? '#fff' : C.navy, border: `2px solid ${league === l.id ? C.navy : C.border}`, padding: '9px 22px', borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── LYON HIGHLIGHT ── */}
      {lyonRow && (
        <div style={{ background: C.navy, padding: '40px 28px' }}>
          <div style={{ ...MAX_W }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Image src="/assets/logo-secondaire.png" alt="" width={28} height={28} style={{ opacity: 0.7, filter: 'brightness(10)' }} />
              <div style={{ color: C.lightBlue, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase' }}>Position de Lyon Roller Hockey</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 1 }}>
              {[
                [`${lyonRow.rank}e`, 'Classement'],
                [`${lyonRow.pts} pts`, 'Points'],
                [`${lyonRow.v}V ${lyonRow.n}N ${lyonRow.d}D`, 'Bilan'],
                [`${lyonRow.bp} / ${lyonRow.bc}`, 'Buts P. / C.'],
              ].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center', padding: '14px 12px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: C.lightBlue, lineHeight: 1 }}>{n}</div>
                  <div style={{ color: 'rgba(255,255,255,0.50)', fontSize: 11.5, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 5 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TABLE ── */}
      <div style={{ background: C.offWhite, padding: '36px 28px 80px' }}>
        <div style={{ ...MAX_W }}>
          <div style={{ background: '#fff', borderRadius: R.card, overflow: 'hidden', boxShadow: SH.card }}>
            <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 52px 52px 52px 52px 62px 62px 90px', background: C.navy, padding: '13px 20px', gap: 6, alignItems: 'center' }}>
              {['#', 'Équipe', 'J', 'V', 'N', 'D', 'BP', 'BC', 'Forme'].map((h, i) => (
                <div key={i} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1.8, color: C.lightBlue, textTransform: 'uppercase', textAlign: i > 1 ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>
            {current.map((row, i) => (
              <TableRow key={row.team} row={row} i={i} isLyon={!!row.highlight} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            {[['#2A7A4B', 'V – Victoire'], [C.muted, 'N – Nul'], [C.red, 'D – Défaite']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: C.muted }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
                {label}
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 12.5, color: C.muted }}>Mis à jour le 22 avril 2025</div>
          </div>
        </div>
      </div>

      <CTABanner title="Venez encourager les Aigles !"
        subtitle="Prochains matchs à domicile : 26 avril et 10 mai au Gymnase du Vieux-Lyon."
        btnLabel="Voir le calendrier" btnHref="/calendrier" light />
    </div>
  )
}
