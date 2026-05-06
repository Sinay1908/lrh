'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Ligne  { id: number; competition: string; saison: string; position: number; equipe: string; joues: number; gagnes: number; nuls: number; perdus: number; bpour: number; bcontre: number; points: number; isLyon: boolean }
interface Equipe { id: number; nom: string; actif: boolean }

const INIT = { competition: '', saison: '2024-2025', position: '1', equipe: '', joues: '0', gagnes: '0', nuls: '0', perdus: '0', bpour: '0', bcontre: '0', points: '0', isLyon: false }

export default function ClassementPage() {
  const [items, setItems]           = useState<Ligne[]>([])
  const [equipes, setEquipes]       = useState<Equipe[]>([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(false)
  const [editing, setEditing]       = useState<Ligne | null>(null)
  const [form, setForm]             = useState(INIT)
  const [saving, setSaving]         = useState(false)
  const [filterComp, setFilterComp] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [r, eq] = await Promise.all([fetch('/api/classement'), fetch('/api/equipes')])
      const classData = await r.json()
      const eqData    = await eq.json()
      setItems(classData)
      const actifs = Array.isArray(eqData) ? eqData.filter((e: Equipe) => e.actif) : []
      setEquipes(actifs)
      // set default filter to first available competition
      if (filterComp === '' && classData.length > 0) setFilterComp(classData[0].competition)
    } finally { setLoading(false) }
  }, [filterComp])

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const competitions = [...new Set(items.map(i => i.competition))]
  const filtered     = items.filter(i => i.competition === filterComp).sort((a, b) => a.position - b.position)

  // Options compétition = noms des équipes actives
  const compOptions = equipes.map(e => ({ value: e.nom, label: e.nom }))

  const openCreate = () => {
    setEditing(null)
    setForm({ ...INIT, competition: filterComp || (equipes[0]?.nom ?? '') })
    setModal(true)
  }
  const openEdit = (l: Ligne) => {
    setEditing(l)
    setForm({ competition: l.competition, saison: l.saison, position: String(l.position), equipe: l.equipe, joues: String(l.joues), gagnes: String(l.gagnes), nuls: String(l.nuls), perdus: String(l.perdus), bpour: String(l.bpour), bcontre: String(l.bcontre), points: String(l.points), isLyon: l.isLyon })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, position: Number(form.position), joues: Number(form.joues), gagnes: Number(form.gagnes), nuls: Number(form.nuls), perdus: Number(form.perdus), bpour: Number(form.bpour), bcontre: Number(form.bcontre), points: Number(form.points) }
      if (editing) await fetch(`/api/classement/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      else         await fetch('/api/classement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette ligne ?')) return
    await fetch(`/api/classement/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: '#', key: 'position', right: true, render: l => (
      <div style={{ width: 28, height: 28, borderRadius: 4, background: (l as Ligne).isLyon ? A.red : A.bg, color: (l as Ligne).isLyon ? '#fff' : A.textPri, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 15, marginLeft: 'auto' }}>
        {l.position as number}
      </div>
    )},
    { label: 'Équipe', key: 'equipe', render: l => (
      <span style={{ fontWeight: (l as Ligne).isLyon ? 700 : 500, color: (l as Ligne).isLyon ? A.red : A.textPri }}>
        {l.equipe as string}{(l as Ligne).isLyon ? ' ★' : ''}
      </span>
    )},
    { label: 'J',   key: 'joues',    right: true },
    { label: 'G',   key: 'gagnes',   right: true },
    { label: 'N',   key: 'nuls',     right: true },
    { label: 'P',   key: 'perdus',   right: true },
    { label: 'BP',  key: 'bpour',    right: true },
    { label: 'BC',  key: 'bcontre',  right: true },
    { label: 'Pts', key: 'points',   right: true, render: l => (
      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, color: A.navy }}>{l.points as number}</span>
    )},
    { label: '', key: 'actions', right: true, render: l => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(l as unknown as Ligne)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((l as Ligne).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Classement" subtitle="Gérez les classements de toutes les compétitions" action="Ajouter une ligne" actionIcon="plus" onAction={openCreate} breadcrumb="Classement" />

      {competitions.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {competitions.map(c => (
            <button key={c} onClick={() => setFilterComp(c)}
              style={{ background: filterComp === c ? A.navy : A.bg, color: filterComp === c ? '#fff' : A.textSec, border: `1px solid ${filterComp === c ? A.navy : A.border}`, padding: '6px 14px', borderRadius: A.r6, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 13, transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      )}

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: A.textPri }}>{filterComp || 'Classement'}</div>
          <div style={{ color: A.muted, fontSize: 12.5 }}>{filtered.length} équipe{filtered.length !== 1 ? 's' : ''}</div>
        </div>
        {loading
          ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={filtered as unknown as Record<string, unknown>[]} />
        }
      </ACard>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier la ligne' : 'Nouvelle ligne de classement'} width={580}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
          <ASelect
            label="Compétition"
            value={form.competition}
            onChange={e => setForm({ ...form, competition: e.target.value })}
            options={compOptions.length > 0 ? compOptions : [{ value: '', label: '— Aucune équipe créée —' }]}
          />
          <AInput label="Saison"   value={form.saison}    onChange={e => setForm({ ...form, saison: e.target.value })}    placeholder="2024-2025" />
          <AInput label="Position" type="number" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <AInput label="Nom de l'équipe" value={form.equipe} onChange={e => setForm({ ...form, equipe: e.target.value })} required placeholder="ex. Lyon RH" />
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5, fontWeight: 500, color: A.textSec }}>
              <input type="checkbox" checked={form.isLyon} onChange={e => setForm({ ...form, isLyon: e.target.checked })} style={{ width: 16, height: 16 }} />
              C&apos;est Lyon
            </label>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }}>
          {[['J','joues'],['G','gagnes'],['N','nuls'],['P','perdus'],['BP','bpour'],['BC','bcontre'],['Pts','points']].map(([l, k]) => (
            <AInput key={k} label={l} type="number" value={form[k as keyof typeof form] as string} onChange={e => setForm({ ...form, [k]: e.target.value })} />
          ))}
        </div>
        {equipes.length === 0 && (
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: A.r8, padding: '10px 14px', color: '#9A3412', fontSize: 13 }}>
            ⚠️ Aucune équipe créée. <strong>Ajoutez d&apos;abord des équipes</strong> dans la section &quot;Équipes&quot; pour les retrouver ici.
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
