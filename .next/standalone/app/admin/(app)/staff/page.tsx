'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Staff { id: number; nom: string; role: string; depuis: string | null; equipeNom: string | null; description: string | null; photoUrl: string | null; actif: boolean; ordre: number }

const INIT = { nom: '', role: '', depuis: '', equipeNom: '', description: '', photoUrl: '', actif: true, ordre: '0' }

// ── Compression image ───────────────────────────────────────────────────────
function compressImage(file: File, maxW = 800, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new window.Image()
      img.onload = () => {
        const ratio  = Math.min(1, maxW / img.width)
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = ev.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Aperçu photo ────────────────────────────────────────────────────────────
function PhotoPreview({ url, onRemove }: { url: string; onRemove: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${A.border}`, background: A.navy }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: A.textSec, marginBottom: 6 }}>Photo sélectionnée</div>
        <button onClick={onRemove} style={{ background: 'none', border: `1px solid ${A.border}`, borderRadius: A.r6, padding: '4px 10px', fontSize: 12, color: A.red, cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }}>
          Supprimer la photo
        </button>
      </div>
    </div>
  )
}

export default function StaffPage() {
  const [items, setItems]       = useState<Staff[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState<Staff | null>(null)
  const [form, setForm]         = useState(INIT)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/staff'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(INIT); setError(null); setModal(true) }
  const openEdit   = (s: Staff) => {
    setEditing(s)
    setForm({ nom: s.nom, role: s.role, depuis: s.depuis || '', equipeNom: s.equipeNom || '', description: s.description || '', photoUrl: s.photoUrl || '', actif: s.actif, ordre: String(s.ordre) })
    setError(null); setModal(true)
  }
  const closeModal = () => { setModal(false); setError(null) }

  // ── Upload photo ──────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    try {
      const compressed = await compressImage(file)
      const res  = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: compressed, filename: file.name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur upload'); return }
      setForm(prev => ({ ...prev, photoUrl: data.url }))
    } catch { setError("Erreur lors de l'upload") } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!form.nom.trim() || !form.role.trim()) { setError('Nom et rôle requis'); return }
    setSaving(true); setError(null)
    try {
      const body = { ...form, ordre: Number(form.ordre), photoUrl: form.photoUrl || null }
      const url    = editing ? `/api/staff/${editing.id}` : '/api/staff'
      const method = editing ? 'PUT' : 'POST'
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur serveur'); return }
      await load(); closeModal()
    } catch { setError('Erreur réseau') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce membre du staff ?')) return
    await fetch(`/api/staff/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Membre', key: 'nom', render: s => {
      const staff = s as unknown as Staff
      const initials = staff.nom.split(' ').map((w: string) => w[0]).join('')
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            background: A.navy, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#A8D6E8', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14 }}>
            {staff.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={staff.photoUrl} alt={staff.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{staff.nom}</div>
            <div style={{ fontSize: 12, color: A.muted }}>{staff.role}</div>
          </div>
        </div>
      )
    }},
    { label: 'Équipe', key: 'equipeNom', render: s => <span>{((s as unknown as Staff).equipeNom) || '—'}</span> },
    { label: 'Depuis', key: 'depuis', render: s => <span>{((s as unknown as Staff).depuis) || '—'}</span> },
    { label: 'Statut', key: 'actif', render: s => {
      const actif = (s as unknown as Staff).actif
      return <span style={{ background: actif ? '#ECFDF5' : '#FFF1F2', color: actif ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{actif ? 'Actif' : 'Inactif'}</span>
    }},
    { label: '', key: 'actions', right: true, render: s => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(s as unknown as Staff)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((s as unknown as Staff).id)} danger />
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

      <Modal open={modal} onClose={closeModal} title={editing ? `Modifier — ${editing.nom}` : 'Nouveau membre du staff'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Nom complet *" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="ex. Marc Villeneuve" required />
          <AInput label="Rôle / Poste *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="ex. Entraîneur principal" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Équipe encadrée" value={form.equipeNom} onChange={e => setForm({ ...form, equipeNom: e.target.value })} placeholder="ex. Nationale 1" />
          <AInput label="Depuis" value={form.depuis} onChange={e => setForm({ ...form, depuis: e.target.value })} placeholder="ex. Depuis 2018" />
        </div>
        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Courte biographie…" />

        {/* ── Photo ── */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: A.textSec, display: 'block', marginBottom: 6 }}>
            Photo du membre
          </label>
          {form.photoUrl ? (
            <PhotoPreview url={form.photoUrl} onRemove={() => setForm({ ...form, photoUrl: '' })} />
          ) : (
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              style={{ border: `2px dashed ${uploading ? A.blue : A.border}`, borderRadius: A.r8,
                padding: '18px 16px', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer',
                background: A.bg, transition: 'border-color 0.2s' }}>
              {uploading ? (
                <div style={{ color: A.blue, fontSize: 13, fontWeight: 500 }}>Upload en cours…</div>
              ) : (
                <>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>👤</div>
                  <div style={{ fontSize: 13, color: A.textSec, fontWeight: 500 }}>Cliquez pour choisir une photo</div>
                  <div style={{ fontSize: 11.5, color: A.muted, marginTop: 3 }}>JPG, PNG, WebP — compressée automatiquement</div>
                </>
              )}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Ordre d'affichage" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
          <ASelect label="Statut" value={form.actif ? 'true' : 'false'} onChange={e => setForm({ ...form, actif: e.target.value === 'true' })} options={[{value:'true',label:'Actif'},{value:'false',label:'Inactif'}]} />
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: A.r8,
            padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={closeModal}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving || uploading || !form.nom.trim() || !form.role.trim()}>
            {saving ? 'Enregistrement…' : uploading ? 'Upload…' : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </div>
  )
}
