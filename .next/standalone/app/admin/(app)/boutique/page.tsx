'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Produit { id: number; nom: string; categorie: string; prix: number; description: string | null; badge: string | null; disponible: boolean; ordre: number }

const INIT = { nom: '', categorie: 'Maillot', prix: '', description: '', badge: '', disponible: true, ordre: '0' }

export default function BoutiquePage() {
  const [items, setItems]     = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<Produit | null>(null)
  const [form, setForm]       = useState(INIT)
  const [saving, setSaving]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/boutique'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(INIT); setModal(true) }
  const openEdit   = (p: Produit) => { setEditing(p); setForm({ nom: p.nom, categorie: p.categorie, prix: String(p.prix), description: p.description || '', badge: p.badge || '', disponible: p.disponible, ordre: String(p.ordre) }); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, prix: Number(form.prix), ordre: Number(form.ordre) }
      if (editing) await fetch(`/api/boutique/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      else await fetch('/api/boutique', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    await fetch(`/api/boutique/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Produit', key: 'nom', render: p => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.nom as string}</div>
        {p.badge && <span style={{ background: A.red, color: '#fff', padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 700 }}>{p.badge as string}</span>}
      </div>
    )},
    { label: 'Catégorie', key: 'categorie', render: p => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12 }}>{p.categorie as string}</span>
    )},
    { label: 'Prix', key: 'prix', right: true, render: p => <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, color: A.navy }}>{(p.prix as number).toFixed(2)} €</span> },
    { label: 'Disponibilité', key: 'disponible', render: p => <span style={{ background: p.disponible ? '#ECFDF5' : '#FFF1F2', color: p.disponible ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{p.disponible ? 'Disponible' : 'Indisponible'}</span> },
    { label: '', key: 'actions', right: true, render: p => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(p as unknown as Produit)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((p as Produit).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Boutique" subtitle="Gérez les produits disponibles à la boutique du club" action="Ajouter un produit" actionIcon="plus" onAction={openCreate} breadcrumb="Boutique" />
      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, color: A.muted, fontSize: 12.5 }}>{items.length} produit{items.length !== 1 ? 's' : ''}</div>
        {loading ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={items as unknown as Record<string, unknown>[]} />}
      </ACard>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le produit' : 'Nouveau produit'}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <AInput label="Nom du produit" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required placeholder="ex. Maillot domicile 2024-25" />
          <AInput label="Prix (€)" type="number" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} required placeholder="ex. 65" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Catégorie" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}
            options={['Maillot','Équipement','Accessoire','Textile','Protection'].map(v=>({value:v,label:v}))} />
          <AInput label="Badge (optionnel)" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="ex. Nouveau, Promo…" />
        </div>
        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Description du produit…" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Ordre" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
          <ASelect label="Disponibilité" value={form.disponible ? 'true' : 'false'} onChange={e => setForm({ ...form, disponible: e.target.value === 'true' })} options={[{value:'true',label:'Disponible'},{value:'false',label:'Indisponible'}]} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
