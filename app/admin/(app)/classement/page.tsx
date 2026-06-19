'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Ligne  { id: number; competition: string; saison: string; position: number; equipe: string; joues: number; gagnes: number; nuls: number; perdus: number; bpour: number; bcontre: number; points: number; isLyon: boolean }
interface Equipe { id: number; nom: string; actif: boolean }

function getCurrentSaison() {
  const now = new Date()
  const y = now.getFullYear()
  return now.getMonth() + 1 >= 9 ? `${y}/${y + 1}` : `${y - 1}/${y}`
}
const CURRENT_SAISON = getCurrentSaison()
const INIT = { competition: '', saison: CURRENT_SAISON, position: '1', equipe: '', joues: '0', gagnes: '0', nuls: '0', perdus: '0', bpour: '0', bcontre: '0', points: '0', isLyon: false }

export default function ClassementPage() {
  const [items, setItems]                   = useState<Ligne[]>([])
  const [equipes, setEquipes]               = useState<Equipe[]>([])
  const [loading, setLoading]               = useState(true)
  const [modal, setModal]                   = useState(false)
  const [editing, setEditing]               = useState<Ligne | null>(null)
  const [form, setForm]                     = useState(INIT)
  const [saving, setSaving]                 = useState(false)
  const [saveError, setSaveError]           = useState<string | null>(null)
  const [filterSaison, setFilterSaison]     = useState(CURRENT_SAISON)
  const [filterComp, setFilterComp]         = useState('')
  const [showNewSaison, setShowNewSaison]   = useState(false)
  const [newSaisonInput, setNewSaisonInput] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [r, eq] = await Promise.all([fetch('/api/classement'), fetch('/api/equipes')])
      const classData = await r.json()
      const eqData    = await eq.json()
      setItems(Array.isArray(classData) ? classData : [])
      setEquipes(Array.isArray(eqData) ? eqData.filter((e: Equipe) => e.actif) : [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Saisons triées desc + toujours inclure la saison courante et celle sélectionnée
  const saisonsInDB = [...new Set(items.map(i => i.saison))].sort((a, b) => b.localeCompare(a))
  const saisons = [...new Set([filterSaison, CURRENT_SAISON, ...saisonsInDB])].sort((a, b) => b.localeCompare(a))

  const activeSaison     = filterSaison
  const itemsForSaison   = items.filter(i => i.saison === activeSaison)
  const competitions     = [...new Set(itemsForSaison.map(i => i.competition))]
  const activeComp       = competitions.includes(filterComp) ? filterComp : (competitions[0] ?? '')
  const filtered         = itemsForSaison.filter(i => i.competition === activeComp).sort((a, b) => a.position - b.position)

  const compOptions = equipes.map(e => ({ value: e.nom, label: e.nom }))

  const switchSaison = (s: string) => { setFilterSaison(s); setFilterComp('') }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...INIT, saison: activeSaison, competition: activeComp || (equipes[0]?.nom ?? '') })
    setModal(true)
  }
  const openEdit = (l: Ligne) => {
    setEditing(l)
    setForm({ competition: l.competition, saison: l.saison, position: String(l.position), equipe: l.equipe, joues: String(l.joues), gagnes: String(l.gagnes), nuls: String(l.nuls), perdus: String(l.perdus), bpour: String(l.bpour), bcontre: String(l.bcontre), points: String(l.points), isLyon: l.isLyon })
    setModal(true)
  }

  const handleSave = async () => {
    setSaveError(null)
    if (!form.competition.trim()) { setSaveError('La compétition est requise.'); return }
    if (!form.equipe.trim())      { setSaveError("Le nom de l'équipe est requis."); return }
    setSaving(true)
    try {
      const body = { ...form, position: Number(form.position), joues: Number(form.joues), gagnes: Number(form.gagnes), nuls: Number(form.nuls), perdus: Number(form.perdus), bpour: Number(form.bpour), bcontre: Number(form.bcontre), points: Number(form.points) }
      let res: Response
      if (editing) res = await fetch(`/api/classement/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      else         res = await fetch('/api/classement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const d = await res.json(); setSaveError(d.error || 'Erreur lors de la sauvegarde'); return }
      await load()
      setModal(false)
      setFilterSaison(form.saison)
    } catch { setSaveError('Erreur réseau') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette ligne ?')) return
    await fetch(`/api/classement/${id}`, { method: 'DELETE' }); await load()
  }

  const handleAddSaison = () => {
    const y = newSaisonInput.trim()
    if (!y) return
    switchSaison(y)
    setShowNewSaison(false)
    setNewSaisonInput('')
  }

  const handleDeleteSaison = async (saison: string) => {
    const lignes = items.filter(i => i.saison === saison)
    if (!confirm(`Supprimer la saison "${saison}" et ses ${lignes.length} ligne${lignes.length !== 1 ? 's' : ''} ?`)) return
    await Promise.all(lignes.map(l => fetch(`/api/classement/${l.id}`, { method: 'DELETE' })))
    await load()
    if (filterSaison === saison) switchSaison(saisons.find(s => s !== saison) ?? CURRENT_SAISON)
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
    { label: 'J',   key: 'joues',   right: true },
    { label: 'G',   key: 'gagnes',  right: true },
    { label: 'N',   key: 'nuls',    right: true },
    { label: 'P',   key: 'perdus',  right: true },
    { label: 'BP',  key: 'bpour',   right: true },
    { label: 'BC',  key: 'bcontre', right: true },
    { label: 'Pts', key: 'points',  right: true, render: l => (
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

      {/* ── Sélecteur de saison ── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: A.muted, letterSpacing: 1, textTransform: 'uppercase', marginRight: 4 }}>Saison</span>
        {saisons.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button onClick={() => switchSaison(s)}
              style={{ background: activeSaison === s ? A.navy : A.bg, color: activeSaison === s ? '#fff' : A.textSec, border: `1px solid ${activeSaison === s ? A.navy : A.border}`, padding: '6px 14px', borderRadius: `${A.r6} 0 0 ${A.r6}`, cursor: 'pointer', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, transition: 'all 0.15s', borderRight: 'none' }}>
              {s}
            </button>
            {items.some(i => i.saison === s) && (
              <button onClick={() => handleDeleteSaison(s)} title={`Supprimer la saison ${s}`}
                style={{ background: activeSaison === s ? A.navy : A.bg, color: activeSaison === s ? 'rgba(255,255,255,0.6)' : A.muted, border: `1px solid ${activeSaison === s ? A.navy : A.border}`, padding: '6px 8px', borderRadius: `0 ${A.r6} ${A.r6} 0`, cursor: 'pointer', fontSize: 13, lineHeight: 1, transition: 'all 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = activeSaison === s ? '#fff' : '#DC2626')}
                onMouseLeave={e => (e.currentTarget.style.color = activeSaison === s ? 'rgba(255,255,255,0.6)' : A.muted)}>
                ×
              </button>
            )}
          </div>
        ))}
        {showNewSaison ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              value={newSaisonInput}
              onChange={e => setNewSaisonInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSaison()}
              placeholder="ex. 2026/2027"
              maxLength={9}
              style={{ width: 76, padding: '6px 10px', border: `1px solid ${A.border}`, borderRadius: A.r6, fontSize: 14, fontFamily: "'Barlow',sans-serif", outline: 'none' }}
              autoFocus
            />
            <button onClick={handleAddSaison}
              style={{ background: A.navy, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: A.r6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              OK
            </button>
            <button onClick={() => { setShowNewSaison(false); setNewSaisonInput('') }}
              style={{ background: 'transparent', color: A.muted, border: `1px solid ${A.border}`, padding: '6px 10px', borderRadius: A.r6, cursor: 'pointer', fontSize: 13 }}>
              ×
            </button>
          </div>
        ) : (
          <button onClick={() => setShowNewSaison(true)}
            style={{ background: 'transparent', color: A.textSec, border: `1px dashed ${A.border}`, padding: '6px 14px', borderRadius: A.r6, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
            + Nouvelle saison
          </button>
        )}
      </div>

      {/* ── Onglets compétitions (dans la saison active) ── */}
      {competitions.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {competitions.map(c => (
            <button key={c} onClick={() => setFilterComp(c)}
              style={{ background: activeComp === c ? A.navy : A.bg, color: activeComp === c ? '#fff' : A.textSec, border: `1px solid ${activeComp === c ? A.navy : A.border}`, padding: '6px 14px', borderRadius: A.r6, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 13, transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      )}

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: A.textPri }}>
            {activeComp || activeSaison}
            <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 500, color: A.muted }}>Saison {activeSaison}</span>
          </div>
          <div style={{ color: A.muted, fontSize: 12.5 }}>{filtered.length} équipe{filtered.length !== 1 ? 's' : ''}</div>
        </div>
        {loading
          ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Aucune ligne pour cette saison. Cliquez sur &quot;Ajouter une ligne&quot; pour commencer.</div>
            : <ATable cols={cols} rows={filtered as unknown as Record<string, unknown>[]} />
        }
      </ACard>

      <Modal open={modal} onClose={() => { setModal(false); setSaveError(null) }} title={editing ? 'Modifier la ligne' : `Nouvelle ligne — Saison ${form.saison}`} width={580}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          {compOptions.length > 0 ? (
            <ASelect
              label="Compétition"
              value={form.competition}
              onChange={e => setForm({ ...form, competition: e.target.value })}
              options={compOptions}
            />
          ) : (
            <AInput
              label="Compétition"
              value={form.competition}
              onChange={e => setForm({ ...form, competition: e.target.value })}
              placeholder="ex. Nationale 1"
              required
            />
          )}
          <AInput label="Position" type="number" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        </div>
        <div style={{ background: A.bg, border: `1px solid ${A.border}`, borderRadius: A.r6, padding: '8px 12px', fontSize: 13, color: A.muted }}>
          Saison : <strong style={{ color: A.textPri }}>{form.saison}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <AInput label="Nom de l'équipe adversaire" value={form.equipe} onChange={e => setForm({ ...form, equipe: e.target.value })} required placeholder="ex. Lyon RH" />
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
        {saveError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: A.r8, padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500 }}>
            {saveError}
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
