'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader, SearchBar } from '@/components/admin/ui'

interface Match { id: number; adversaire: string; competition: string; domicile: boolean; lieu: string | null; date: string; heure: string | null; statut: string; scoreDom: number | null; scoreExt: number | null; equipe?: { nom: string } | null }

const INIT = { adversaire: '', competition: 'Nationale 1', domicile: 'true', lieu: '', date: '', heure: '', statut: 'upcoming', scoreDom: '', scoreExt: '', equipeId: '' }

function fmt(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MatchsPage() {
  const [matchs, setMatchs]   = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<'upcoming' | 'results'>('upcoming')
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<Match | null>(null)
  const [form, setForm]       = useState(INIT)
  const [saving, setSaving]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/matchs'); setMatchs(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const upcoming = matchs.filter(m => m.statut === 'upcoming')
  const results  = matchs.filter(m => m.statut !== 'upcoming')
  const data     = (tab === 'upcoming' ? upcoming : results).filter(m => {
    const s = search.toLowerCase()
    return m.adversaire.toLowerCase().includes(s) || m.competition.toLowerCase().includes(s)
  })

  const openCreate = () => { setEditing(null); setForm(INIT); setModal(true) }
  const openEdit   = (m: Match) => {
    setEditing(m)
    const d = new Date(m.date)
    const dateStr = d.toISOString().slice(0, 10)
    setForm({ adversaire: m.adversaire, competition: m.competition, domicile: m.domicile ? 'true' : 'false', lieu: m.lieu || '', date: dateStr, heure: m.heure || '', statut: m.statut, scoreDom: m.scoreDom !== null ? String(m.scoreDom) : '', scoreExt: m.scoreExt !== null ? String(m.scoreExt) : '', equipeId: '' })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, domicile: form.domicile === 'true' }
      if (editing) {
        await fetch(`/api/matchs/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      } else {
        await fetch('/api/matchs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce match ?')) return
    await fetch(`/api/matchs/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Date', key: 'date', render: m => <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>{fmt((m as Match).date)}</span> },
    { label: 'Rencontre', key: 'adversaire', wrap: true, render: m => {
      const match = m as Match
      const home = match.domicile ? 'Lyon RH' : match.adversaire
      const away = match.domicile ? match.adversaire : 'Lyon RH'
      return (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{home} <span style={{ color: A.muted }}>–</span> {away}</div>
          {match.lieu && <div style={{ fontSize: 12, color: A.muted, marginTop: 2 }}>📍 {match.lieu}</div>}
        </div>
      )
    }},
    { label: 'Compétition', key: 'competition', render: m => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12 }}>{m.competition as string}</span>
    )},
    { label: tab === 'upcoming' ? 'Horaire' : 'Score', key: 'score', render: m => {
      const match = m as Match
      if (tab === 'upcoming') return <span>{match.heure || '—'}</span>
      if (match.scoreDom !== null && match.scoreExt !== null) {
        return <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18 }}>{match.scoreDom}–{match.scoreExt}</span>
      }
      return <span style={{ color: A.muted }}>—</span>
    }},
    { label: 'Résultat', key: 'statut', render: m => {
      const s = m.statut as string
      const colors: Record<string, [string,string]> = { upcoming: ['#EFF6FF','#1D4ED8'], win: ['#ECFDF5','#065F46'], loss: ['#FFF1F2','#BE123C'], draw: ['#FFF7ED','#9A3412'] }
      const labels: Record<string, string> = { upcoming: 'À venir', win: 'Victoire', loss: 'Défaite', draw: 'Nul' }
      const [bg, color] = colors[s] || ['#F3F4F6','#374151']
      return <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{labels[s] || s}</span>
    }},
    { label: '', key: 'actions', right: true, render: m => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(m as unknown as Match)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((m as Match).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Matchs & Résultats" subtitle="Gérez le calendrier et les résultats" action="Ajouter un match" actionIcon="plus" onAction={openCreate} breadcrumb="Matchs" />

      <ACard noPad>
        <div style={{ display: 'flex', borderBottom: `1px solid ${A.border}` }}>
          {([['upcoming','Matchs à venir'],['results','Résultats']] as [string,string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as 'upcoming' | 'results')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 20px', fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14, color: tab === id ? A.navy : A.muted, borderBottom: `2px solid ${tab === id ? A.red : 'transparent'}`, marginBottom: -1, transition: 'all 0.15s' }}>{label}</button>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}` }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher adversaire, compétition…" />
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
        ) : (
          <ATable cols={cols} rows={data as unknown as Record<string, unknown>[]} />
        )}
      </ACard>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le match' : 'Ajouter un match'} width={560}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <AInput label="Horaire" value={form.heure} onChange={e => setForm({ ...form, heure: e.target.value })} placeholder="15h00" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Adversaire" value={form.adversaire} onChange={e => setForm({ ...form, adversaire: e.target.value })} required placeholder="ex. Grenoble RH" />
          <ASelect label="Domicile / Extérieur" value={form.domicile} onChange={e => setForm({ ...form, domicile: e.target.value })}
            options={[{value:'true',label:'Domicile (Lyon reçoit)'},{value:'false',label:'Extérieur (Lyon déplace)'}]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Compétition" value={form.competition} onChange={e => setForm({ ...form, competition: e.target.value })}
            options={['Nationale 1','Régionale 1','Régionale 2','U17','U14','U11','Loisir','Playoffs','Coupe de France'].map(v => ({value:v,label:v}))} />
          <ASelect label="Statut" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}
            options={[{value:'upcoming',label:'À venir'},{value:'win',label:'Victoire'},{value:'draw',label:'Nul'},{value:'loss',label:'Défaite'}]} />
        </div>
        <AInput label="Lieu" value={form.lieu} onChange={e => setForm({ ...form, lieu: e.target.value })} placeholder="Gymnase Vieux-Lyon" />
        {form.statut !== 'upcoming' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AInput label="Score Lyon" type="number" value={form.scoreDom} onChange={e => setForm({ ...form, scoreDom: e.target.value })} placeholder="0" />
            <AInput label="Score adversaire" type="number" value={form.scoreExt} onChange={e => setForm({ ...form, scoreExt: e.target.value })} placeholder="0" />
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
