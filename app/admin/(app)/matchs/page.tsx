'use client'

import { useState } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader, SearchBar, StatusBadge } from '@/components/admin/ui'

interface Match { id: number; date: string; home: string; away: string; comp: string; time: string; lieu: string; status: string; score?: string; team: string }

const UPCOMING: Match[] = [
  { id:1, date:'26 avr.',  home:'Lyon RH',      away:'Grenoble RH',   comp:'Nationale 1',  time:'15h00', lieu:'Vieux-Lyon',  status:'upcoming', team:'nat1' },
  { id:2, date:'03 mai',   home:'Marseille RH', away:'Lyon RH',       comp:'Nationale 1',  time:'18h00', lieu:'Marseille',   status:'upcoming', team:'nat1' },
  { id:3, date:'07 mai',   home:'Lyon RH Rég.', away:'Villeurbanne',  comp:'Régionale 1',  time:'20h00', lieu:'Vieux-Lyon',  status:'upcoming', team:'reg1' },
  { id:4, date:'10 mai',   home:'Lyon RH',      away:'Paris RHC',     comp:'Nationale 1',  time:'15h00', lieu:'Vieux-Lyon',  status:'upcoming', team:'nat1' },
  { id:5, date:'17 mai',   home:'Lyon U17',     away:'Grenoble U17',  comp:'U17',          time:'15h00', lieu:'Vieux-Lyon',  status:'upcoming', team:'u17'  },
  { id:6, date:'24 mai',   home:'Lyon RH',      away:'Toulouse RH',   comp:'Playoffs 1/4', time:'16h00', lieu:'Vieux-Lyon',  status:'upcoming', team:'nat1' },
]

const RESULTS: Match[] = [
  { id:7,  date:'19 avr.', home:'Lyon RH',    away:'Bordeaux RH', comp:'Nationale 1', time:'15h00', lieu:'Vieux-Lyon', status:'win',  score:'6–2', team:'nat1' },
  { id:8,  date:'12 avr.', home:'Nantes RH',  away:'Lyon RH',     comp:'Nationale 1', time:'18h00', lieu:'Nantes',     status:'win',  score:'3–4', team:'nat1' },
  { id:9,  date:'09 avr.', home:'Lyon Rég.',  away:'Annecy RH',   comp:'Régionale 1', time:'20h00', lieu:'Vieux-Lyon', status:'win',  score:'5–1', team:'reg1' },
  { id:10, date:'05 avr.', home:'Lyon RH',    away:'Nice RHC',    comp:'Nationale 1', time:'15h00', lieu:'Vieux-Lyon', status:'draw', score:'2–2', team:'nat1' },
  { id:11, date:'29 mar.', home:'Paris RHC',  away:'Lyon RH',     comp:'Nationale 1', time:'18h00', lieu:'Paris',      status:'loss', score:'4–1', team:'nat1' },
  { id:12, date:'22 mar.', home:'Lyon U17',   away:'Annecy U17',  comp:'U17',         time:'15h00', lieu:'Vieux-Lyon', status:'win',  score:'7–2', team:'u17'  },
]

const INIT_FORM = { date: '', home: '', away: '', competition: '', location: '', time: '', homeScore: '', awayScore: '', status: 'upcoming' }

export default function MatchsPage() {
  const [tab, setTab]             = useState<'upcoming' | 'results'>('upcoming')
  const [modal, setModal]         = useState(false)
  const [search, setSearch]       = useState('')
  const [teamFilter, setTeamFilter] = useState('all')
  const [form, setForm]           = useState(INIT_FORM)

  const data     = tab === 'upcoming' ? UPCOMING : RESULTS
  const filtered = data.filter(m => {
    const s = search.toLowerCase()
    const ok = m.home.toLowerCase().includes(s) || m.away.toLowerCase().includes(s) || m.comp.toLowerCase().includes(s)
    return ok && (teamFilter === 'all' || m.team === teamFilter)
  })

  const baseCols: Col[] = [
    { label: 'Date', key: 'date', render: m => <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, color: A.textPri }}>{m.date}</div> },
    { label: 'Rencontre', key: 'match', wrap: true, render: m => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: A.textPri }}>{m.home} <span style={{ color: A.muted, fontWeight: 400 }}>–</span> {m.away}</div>
        <div style={{ fontSize: 12, color: A.muted, marginTop: 2 }}>📍 {m.lieu}</div>
      </div>
    )},
    { label: 'Compétition', key: 'comp', render: m => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12 }}>{m.comp}</span>
    )},
  ]

  const upcomingCols: Col[] = [
    ...baseCols,
    { label: 'Horaire', key: 'time' },
    { label: 'Statut', key: 'status', render: m => <StatusBadge status={m.status} /> },
    { label: '', key: 'actions', right: true, render: () => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => {}} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => {}} danger />
      </div>
    )},
  ]

  const resultCols: Col[] = [
    ...baseCols,
    { label: 'Score', key: 'score', render: m => (
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, color: A.textPri }}>{m.score}</div>
    )},
    { label: 'Résultat', key: 'status', render: m => <StatusBadge status={m.status} /> },
    { label: '', key: 'actions', right: true, render: () => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => {}} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => {}} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Matchs & Résultats" subtitle="Gérez le calendrier et les résultats de toutes les équipes"
        action="Ajouter un match" actionIcon="plus" onAction={() => { setForm(INIT_FORM); setModal(true) }}
        breadcrumb="Matchs & Résultats" />

      <ACard noPad>
        <div style={{ display: 'flex', borderBottom: `1px solid ${A.border}` }}>
          {([['upcoming','Matchs à venir'],['results','Résultats']] as [string,string][]).map(([id,label]) => (
            <button key={id} onClick={() => setTab(id as 'upcoming' | 'results')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 20px',
                fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14,
                color: tab === id ? A.navy : A.muted,
                borderBottom: `2px solid ${tab === id ? A.red : 'transparent'}`,
                marginBottom: -1, transition: 'all 0.15s' }}>{label}</button>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}`,
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher..." />
          <div style={{ display: 'flex', gap: 6 }}>
            {([['all','Toutes'],['nat1','Nat. 1'],['reg1','Rég. 1'],['u17','U17']] as [string,string][]).map(([v,l]) => (
              <button key={v} onClick={() => setTeamFilter(v)}
                style={{ background: teamFilter === v ? A.navy : A.bg, color: teamFilter === v ? '#fff' : A.textSec,
                  border: `1px solid ${teamFilter === v ? A.navy : A.border}`,
                  padding: '6px 12px', borderRadius: A.r6, cursor: 'pointer',
                  fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 12.5, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>{l}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', color: A.muted, fontSize: 12.5 }}>{filtered.length} match{filtered.length !== 1 ? 's' : ''}</div>
        </div>
        <ATable cols={tab === 'upcoming' ? upcomingCols : resultCols} rows={filtered as unknown as Record<string, unknown>[]} />
      </ACard>

      <Modal open={modal} onClose={() => setModal(false)} title="Ajouter un match" width={560}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <AInput label="Horaire" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="15h00" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Équipe domicile" value={form.home} onChange={e => setForm({ ...form, home: e.target.value })} required placeholder="Domicile" />
          <AInput label="Équipe extérieur" value={form.away} onChange={e => setForm({ ...form, away: e.target.value })} required placeholder="Extérieur" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Compétition" value={form.competition} onChange={e => setForm({ ...form, competition: e.target.value })}
            options={[{value:'',label:'Choisir...'},{value:'Nationale 1',label:'Nationale 1'},{value:'Régionale 1',label:'Régionale 1'},{value:'Régionale 2',label:'Régionale 2'},{value:'U17',label:'U17'},{value:'U14',label:'U14'}]} />
          <ASelect label="Statut" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            options={[{value:'upcoming',label:'À venir'},{value:'win',label:'Victoire'},{value:'draw',label:'Nul'},{value:'loss',label:'Défaite'}]} />
        </div>
        <AInput label="Lieu" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Gymnase Vieux-Lyon" />
        {form.status !== 'upcoming' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AInput label="Score domicile" value={form.homeScore} onChange={e => setForm({ ...form, homeScore: e.target.value })} placeholder="0" />
            <AInput label="Score extérieur" value={form.awayScore} onChange={e => setForm({ ...form, awayScore: e.target.value })} placeholder="0" />
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={() => setModal(false)}>Enregistrer le match</ABtn>
        </div>
      </Modal>
    </div>
  )
}
