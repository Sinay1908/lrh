'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Produit { id: number; nom: string; categorie: string; prix: number; description: string | null; badge: string | null; imageUrl: string | null; tailles: string | null; personnalisation: boolean; lienSumup: string | null; disponible: boolean; ordre: number }

const INIT = { nom: '', categorie: 'Maillot', prix: '', description: '', badge: '', imageUrl: '', tailles: '', personnalisation: false, lienSumup: '', disponible: true, ordre: '0' }

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: reader.result, filename: file.name }),
        })
        const json = await res.json()
        if (json.url) onChange(json.url)
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: A.textSec, marginBottom: 6 }}>Image du produit</div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={value} alt="" style={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 8, border: `1px solid ${A.border}` }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <ABtn variant="ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>{uploading ? 'Upload…' : 'Changer'}</ABtn>
            <ABtn variant="ghost" onClick={() => onChange('')}>Supprimer</ABtn>
          </div>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          style={{ width: '100%', padding: '24px 16px', border: `2px dashed ${A.border}`, borderRadius: 8, background: A.bg, color: A.muted, cursor: 'pointer', fontSize: 13, fontFamily: "'Barlow',sans-serif" }}>
          {uploading ? 'Upload en cours…' : '📷 Cliquer pour importer une image'}
        </button>
      )}
    </div>
  )
}

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
  const openEdit   = (p: Produit) => {
    setEditing(p)
    setForm({ nom: p.nom, categorie: p.categorie, prix: String(p.prix), description: p.description || '', badge: p.badge || '', imageUrl: p.imageUrl || '', tailles: p.tailles || '', personnalisation: p.personnalisation, lienSumup: p.lienSumup || '', disponible: p.disponible, ordre: String(p.ordre) })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, prix: Number(form.prix), ordre: Number(form.ordre), imageUrl: form.imageUrl || null, tailles: form.tailles || null, lienSumup: form.lienSumup || null }
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {p.imageUrl ? <img src={p.imageUrl as string} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} /> : <div style={{ width: 40, height: 40, borderRadius: 6, background: A.bg, flexShrink: 0 }} />}
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.nom as string}</div>
          {p.badge && <span style={{ background: A.red, color: '#fff', padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 700 }}>{p.badge as string}</span>}
        </div>
      </div>
    )},
    { label: 'Catégorie', key: 'categorie', render: p => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12 }}>{p.categorie as string}</span>
    )},
    { label: 'Prix', key: 'prix', right: true, render: p => <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, color: A.navy }}>{(p.prix as number).toFixed(2)} €</span> },
    { label: 'Tailles', key: 'tailles', render: p => <span style={{ color: p.tailles ? A.navy : A.muted, fontSize: 12 }}>{p.tailles ? (p.tailles as string) : '—'}</span> },
    { label: 'SumUp', key: 'lienSumup', render: p => (
      <span style={{ fontSize: 12, color: p.lienSumup ? '#065F46' : A.muted, background: p.lienSumup ? '#ECFDF5' : A.bg, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>
        {p.lienSumup ? '✓ Configuré' : '—'}
      </span>
    )},
    { label: 'Dispo', key: 'disponible', render: p => <span style={{ background: p.disponible ? '#ECFDF5' : '#FFF1F2', color: p.disponible ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{p.disponible ? 'Oui' : 'Non'}</span> },
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
          <AInput label="Nom du produit" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required placeholder="ex. Maillot domicile 2025-26" />
          <AInput label="Prix (€)" type="number" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} required placeholder="ex. 65" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Catégorie" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}
            options={['Maillot', 'Short', 'Pantalon', 'T-Shirt', 'Sweat', 'Veste', 'Accessoire', 'Sac', 'Équipement', 'Autre'].map(v => ({ value: v, label: v }))} />
          <AInput label="Badge (optionnel)" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="ex. Nouveau, Promo…" />
        </div>
        <ImageUpload value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
        <AInput label="Tailles disponibles" value={form.tailles} onChange={e => setForm({ ...form, tailles: e.target.value })} placeholder="ex. XS,S,M,L,XL,XXL (séparées par des virgules)" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Personnalisation" value={form.personnalisation ? 'true' : 'false'} onChange={e => setForm({ ...form, personnalisation: e.target.value === 'true' })} options={[{value:'false',label:'Non personnalisable'},{value:'true',label:'Personnalisable'}]} />
          <ASelect label="Disponibilité" value={form.disponible ? 'true' : 'false'} onChange={e => setForm({ ...form, disponible: e.target.value === 'true' })} options={[{value:'true',label:'Disponible'},{value:'false',label:'Indisponible'}]} />
        </div>
        <AInput label="Lien SumUp" value={form.lienSumup} onChange={e => setForm({ ...form, lienSumup: e.target.value })} placeholder="https://pay.sumup.com/b2c/QXXX… ou lien boutique" />
        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Description du produit…" />
        <AInput label="Ordre d'affichage" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
