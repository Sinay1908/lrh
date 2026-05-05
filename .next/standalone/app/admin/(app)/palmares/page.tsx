'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Palmares { id: number; annee: string; titre: string; competition: string; description: string | null; ordre: number }

const INIT = { annee: '', titre: '', competition: '', description: '', ordre: '0' }

export default function PalmaresPage() {
  const [items, setItems]     = useState<Palmares[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<Palmares | null>(null)
  const [form, setForm]       = useState(INIT)
  const [saving, setSaving]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/palmares'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(INIT); setModal(true) }
  const openEdit   = (p: Palmares) => { setEditing(p); setForm({ annee: p.annee, titre: p.titre, competition: p.competition, description: p.description || '', ordre: String(p.ordre) }); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, ordre: Number(form.ordre) }
      if (editing) await fetch(`/api/palmares/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      else await fetch('/api/palmares', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet élément du palmarès ?')) return
    await fetch(`/api/palmares/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Année', key: 'annee', render: p => <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, color: A.red }}>{p.annee as string}</span> },
    { label: 'Titre', key: 'titre', render: p => <span style={{ fontWeight: 600 }}>{p.titre as string}</span> },
    { label: 'Compétition', key: 'competition', render: p => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12 }}>{p.competition as string}</span>
    )},
    { label: 'Description', key: 'description', wrap: true, render: p => <span style={{ color: A.muted, fontSize: 12.5 }}>{(p.description as string) || '—'}</span> },
    { label: '', key: 'actions', right: true, render: p => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(p as unknown as Palmares)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((p as Palmares).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Palmarès" subtitle="Gérez l'historique des titres et récompenses du club" action="Ajouter un titre" actionIcon="plus" onAction={openCreate} breadcrumb="Palmarès" />
      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, color: A.muted, fontSize: 12.5 }}>{items.length} titre{items.length !== 1 ? 's' : ''}</div>
        {loading ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={items as unknown as Record<string, unknown>[]} />}
      </ACard>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le titre' : 'Nouveau titre au palmarès'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
          <AInput label="Année" value={form.annee} onChange={e => setForm({ ...form, annee: e.target.value })} required placeholder="ex. 2014" />
          <AInput label="Titre" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required placeholder="ex. Champion de France" />
        </div>
        <AInput label="Compétition" value={form.competition} onChange={e => setForm({ ...form, competition: e.target.value })} required placeholder="ex. Nationale 1" />
        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Contexte, anecdotes…" />
        <AInput label="Ordre d'affichage" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
