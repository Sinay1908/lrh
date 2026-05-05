'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Staff { id: number; nom: string; role: string; depuis: string | null; equipeNom: string | null; description: string | null; actif: boolean; ordre: number }

const INIT = { nom: '', role: '', depuis: '', equipeNom: '', description: '', actif: true, ordre: '0' }

export default function StaffPage() {
  const [items, setItems]     = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)
  const [form, setForm]       = useState(INIT)
  const [saving, setSaving]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/staff'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(INIT); setModal(true) }
  const openEdit   = (s: Staff) => { setEditing(s); setForm({ nom: s.nom, role: s.role, depuis: s.depuis || '', equipeNom: s.equipeNom || '', description: s.description || '', actif: s.actif, ordre: String(s.ordre) }); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, ordre: Number(form.ordre) }
      if (editing) await fetch(`/api/staff/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      else await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce membre du staff ?')) return
    await fetch(`/api/staff/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Membre', key: 'nom', render: s => {
      const initials = (s.nom as string).split(' ').map((w: string) => w[0]).join('')
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: A.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{initials}</div>
          <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.nom as string}</div><div style={{ fontSize: 12, color: A.muted }}>{s.role as string}</div></div>
        </div>
      )
    }},
    { label: 'Équipe', key: 'equipeNom', render: s => <span>{(s.equipeNom as string) || '—'}</span> },
    { label: 'Depuis', key: 'depuis', render: s => <span>{(s.depuis as string) || '—'}</span> },
    { label: 'Statut', key: 'actif', render: s => <span style={{ background: s.actif ? '#ECFDF5' : '#FFF1F2', color: s.actif ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{s.actif ? 'Actif' : 'Inactif'}</span> },
    { label: '', key: 'actions', right: true, render: s => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(s as unknown as Staff)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((s as Staff).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Staff technique" subtitle="Gérez l'encadrement et le staff du club" action="Ajouter un membre" actionIcon="plus" onAction={openCreate} breadcrumb="Staff" />
      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, color: A.muted, fontSize: 12.5 }}>{items.length} membre{items.length !== 1 ? 's' : ''}</div>
        {loading ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={items as unknown as Record<string, unknown>[]} />}
      </ACard>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `Modifier — ${editing.nom}` : 'Nouveau membre du staff'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Nom complet" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required placeholder="ex. Marc Villeneuve" />
          <AInput label="Rôle / Poste" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required placeholder="ex. Entraîneur principal" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Équipe encadrée" value={form.equipeNom} onChange={e => setForm({ ...form, equipeNom: e.target.value })} placeholder="ex. Nationale 1" />
          <AInput label="Depuis" value={form.depuis} onChange={e => setForm({ ...form, depuis: e.target.value })} placeholder="ex. Depuis 2018" />
        </div>
        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Courte biographie…" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Ordre d'affichage" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
          <ASelect label="Statut" value={form.actif ? 'true' : 'false'} onChange={e => setForm({ ...form, actif: e.target.value === 'true' })} options={[{value:'true',label:'Actif'},{value:'false',label:'Inactif'}]} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
