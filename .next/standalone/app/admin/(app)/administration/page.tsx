'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { A, ABtn, ACard, AInput, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface AdminUser { id: number; email: string; nom: string | null; createdAt: string }

const EMPTY_FORM = { nom: '', email: '', password: '', confirm: '' }

export default function AdministrationPage() {
  const { data: session } = useSession()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<null | 'create' | 'edit'>(null)
  const [editId, setEditId]   = useState<number | null>(null)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admins')
      setAdmins(await r.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setError(null); setModal('create') }
  const openEdit   = (a: AdminUser) => {
    setForm({ nom: a.nom || '', email: a.email, password: '', confirm: '' })
    setEditId(a.id); setError(null); setModal('edit')
  }

  const handleSave = async () => {
    setError(null)
    if (!form.email.trim()) { setError('Email requis'); return }
    if (modal === 'create' && !form.password.trim()) { setError('Mot de passe requis'); return }
    if (form.password && form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return }
    if (form.password && form.password.length < 8) { setError('Mot de passe trop court (8 caractères minimum)'); return }

    setSaving(true)
    try {
      const body: Record<string, string> = { email: form.email.trim(), nom: form.nom.trim() }
      if (form.password) body.password = form.password

      const url    = modal === 'create' ? '/api/admins' : `/api/admins/${editId}`
      const method = modal === 'create' ? 'POST' : 'PUT'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data   = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur'); return }
      setModal(null); load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    const admin = admins.find(a => a.id === id)
    if (!confirm(`Supprimer le compte de ${admin?.email} ?`)) return
    const res  = await fetch(`/api/admins/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return }
    load()
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
  const isMe    = (email: string) => session?.user?.email === email

  const cols: Col[] = [
    { label: 'Administrateur', key: 'nom', render: (a: AdminUser) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: A.navy, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14, color: '#A8D6E8', flexShrink: 0 }}>
          {(a.nom || a.email).slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: A.textPri }}>{a.nom || '—'}</div>
          <div style={{ fontSize: 12, color: A.muted }}>{a.email}</div>
        </div>
      </div>
    )},
    { label: 'Email', key: 'email', render: (a: AdminUser) => (
      <span style={{ fontSize: 13.5, color: A.textSec }}>{a.email}</span>
    )},
    { label: 'Créé le', key: 'createdAt', render: (a: AdminUser) => (
      <span style={{ fontSize: 13, color: A.muted }}>{fmtDate(a.createdAt)}</span>
    )},
    { label: 'Rôle', key: 'role', render: (a: AdminUser) => (
      <span style={{ background: isMe(a.email) ? A.blueL : A.bg, color: isMe(a.email) ? A.blue : A.textSec,
        padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
        {isMe(a.email) ? 'Vous' : 'Admin'}
      </span>
    )},
    { label: '', key: 'actions', right: true, render: (a: AdminUser) => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit" title="Modifier" onClick={() => openEdit(a)} color={A.blue} />
        {!isMe(a.email) && (
          <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete(a.id)} danger />
        )}
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Administration" subtitle="Gérez les comptes administrateurs du site"
        action="Nouvel administrateur" actionIcon="plus" onAction={openCreate}
        breadcrumb="Administration" />

      {/* Avertissement sécurité */}
      <div style={{ background: `${A.amber}10`, border: `1px solid ${A.amber}30`, borderRadius: A.r10,
        padding: '12px 18px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ color: A.amber, fontSize: 18, flexShrink: 0 }}>⚠️</div>
        <div style={{ fontSize: 13, color: A.textSec, lineHeight: 1.5 }}>
          <strong style={{ color: A.textPri }}>Zone sensible.</strong>{' '}
          Les comptes créés ici ont un accès complet à l'interface d'administration. Utilisez des mots de passe forts et ne partagez jamais vos identifiants.
        </div>
      </div>

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>
            {loading ? '…' : `${admins.length} compte${admins.length !== 1 ? 's' : ''} administrateur${admins.length !== 1 ? 's' : ''}`}
          </div>
        </div>
        <ATable cols={cols as unknown as Col[]} rows={admins as unknown as Record<string, unknown>[]}
          emptyMsg="Aucun administrateur trouvé" />
      </ACard>

      {/* Modal création / modification */}
      <Modal open={!!modal} onClose={() => { setModal(null); setError(null) }}
        title={modal === 'create' ? 'Nouvel administrateur' : 'Modifier le compte'}>

        <AInput label="Nom complet" value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })}
          placeholder="ex. Jean Dupont" />
        <AInput label="Adresse email *" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="admin@lyonrh.fr" required />

        <div style={{ height: 1, background: A.border, margin: '4px 0' }} />

        <AInput label={modal === 'create' ? 'Mot de passe *' : 'Nouveau mot de passe (laisser vide = inchangé)'}
          type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="Minimum 8 caractères" />
        <AInput label="Confirmer le mot de passe" type="password" value={form.confirm}
          onChange={e => setForm({ ...form, confirm: e.target.value })}
          placeholder="Répétez le mot de passe" />

        {/* Indicateur de force du mot de passe */}
        {form.password && (
          <div style={{ marginTop: -8, marginBottom: 4 }}>
            {(() => {
              const p = form.password
              const strong = p.length >= 12 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^a-zA-Z0-9]/.test(p)
              const medium = p.length >= 8 && (/[A-Z]/.test(p) || /[0-9]/.test(p))
              const label  = strong ? 'Fort' : medium ? 'Moyen' : 'Faible'
              const color  = strong ? A.green : medium ? A.amber : A.red
              const pct    = strong ? '100%' : medium ? '60%' : '25%'
              return (
                <div>
                  <div style={{ height: 3, background: A.border, borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ height: '100%', width: pct, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 11.5, color, fontWeight: 600 }}>{label}</span>
                </div>
              )
            })()}
          </div>
        )}

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: A.r8,
            padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => { setModal(null); setError(null) }}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving || !form.email.trim()}>
            {saving ? 'Enregistrement…' : modal === 'create' ? 'Créer le compte' : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </div>
  )
}
