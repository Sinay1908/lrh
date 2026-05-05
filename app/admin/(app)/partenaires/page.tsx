'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Sponsor { id: number; nom: string; logoUrl: string | null; siteUrl: string | null; niveau: string; actif: boolean; ordre: number }

const INIT = { nom: '', logoUrl: '', siteUrl: '', niveau: 'partenaire', actif: true, ordre: '0' }

export default function PartenairesPage() {
  const [items, setItems]     = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<Sponsor | null>(null)
  const [form, setForm]       = useState(INIT)
  const [saving, setSaving]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/sponsors'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(INIT); setModal(true) }
  const openEdit   = (s: Sponsor) => { setEditing(s); setForm({ nom: s.nom, logoUrl: s.logoUrl || '', siteUrl: s.siteUrl || '', niveau: s.niveau, actif: s.actif, ordre: String(s.ordre) }); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, ordre: Number(form.ordre) }
      if (editing) {
        await fetch(`/api/sponsors/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      } else {
        await fetch('/api/sponsors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce partenaire ?')) return
    await fetch(`/api/sponsors/${id}`, { method: 'DELETE' }); await load()
  }

  const niveauLabel: Record<string, string> = { premium: 'Premium', partenaire: 'Partenaire', supporter: 'Supporter' }
  const niveauColor: Record<string, string> = { premium: '#7C3AED', partenaire: A.blue, supporter: A.green }

  const cols: Col[] = [
    { label: 'Partenaire', key: 'nom', render: s => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.nom as string}</div>
        {s.siteUrl && <div style={{ fontSize: 12, color: A.muted }}>{s.siteUrl as string}</div>}
      </div>
    )},
    { label: 'Niveau', key: 'niveau', render: s => (
      <span style={{ background: `${niveauColor[s.niveau as string]}15`, color: niveauColor[s.niveau as string], padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{niveauLabel[s.niveau as string] || s.niveau as string}</span>
    )},
    { label: 'Ordre', key: 'ordre' },
    { label: 'Statut', key: 'actif', render: s => (
      <span style={{ background: s.actif ? '#ECFDF5' : '#FFF1F2', color: s.actif ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{s.actif ? 'Actif' : 'Inactif'}</span>
    )},
    { label: '', key: 'actions', right: true, render: s => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(s as unknown as Sponsor)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((s as Sponsor).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Partenaires" subtitle="Gérez les sponsors et partenaires du club" action="Ajouter un partenaire" actionIcon="plus" onAction={openCreate} breadcrumb="Partenaires" />
      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, color: A.muted, fontSize: 12.5 }}>{items.length} partenaire{items.length !== 1 ? 's' : ''}</div>
        {loading ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={items as unknown as Record<string, unknown>[]} />}
      </ACard>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `Modifier — ${editing.nom}` : 'Nouveau partenaire'}>
        <AInput label="Nom du partenaire" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required placeholder="ex. Decathlon Pro" />
        <AInput label="URL du site" value={form.siteUrl} onChange={e => setForm({ ...form, siteUrl: e.target.value })} placeholder="https://…" />
        <AInput label="URL du logo" value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://…/logo.png" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <ASelect label="Niveau" value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })}
            options={[{value:'premium',label:'Premium'},{value:'partenaire',label:'Partenaire'},{value:'supporter',label:'Supporter'}]} />
          <AInput label="Ordre d'affichage" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
          <ASelect label="Statut" value={form.actif ? 'true' : 'false'} onChange={e => setForm({ ...form, actif: e.target.value === 'true' })}
            options={[{value:'true',label:'Actif'},{value:'false',label:'Inactif'}]} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
