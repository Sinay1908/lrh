'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Equipe { id: number; nom: string; niveau: string; categorie: string; groupe: string; couleur: string; horaire: string | null; coach: string | null; nbJoueurs: number; actif: boolean }

const INIT = { nom: '', niveau: '', categorie: 'Senior', groupe: 'senior', couleur: '#0D2150', horaire: '', coach: '', nbJoueurs: '0', actif: true }

export default function EquipesPage() {
  const [equipes, setEquipes]   = useState<Equipe[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<null | 'create' | 'edit'>(null)
  const [editing, setEditing]   = useState<Equipe | null>(null)
  const [form, setForm]         = useState(INIT)
  const [saving, setSaving]     = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/equipes'); setEquipes(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(INIT); setModal('create') }
  const openEdit   = (e: Equipe) => {
    setEditing(e)
    setForm({ nom: e.nom, niveau: e.niveau, categorie: e.categorie, groupe: e.groupe, couleur: e.couleur, horaire: e.horaire || '', coach: e.coach || '', nbJoueurs: String(e.nbJoueurs), actif: e.actif })
    setModal('edit')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, nbJoueurs: Number(form.nbJoueurs) }
      if (modal === 'create') {
        await fetch('/api/equipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      } else if (editing) {
        await fetch(`/api/equipes/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      await load(); setModal(null)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette équipe ?')) return
    await fetch(`/api/equipes/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Équipe', key: 'nom', render: e => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 28, borderRadius: 2, background: (e as Equipe).couleur, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{e.nom as string}</div>
          <div style={{ fontSize: 11.5, color: A.muted }}>{e.niveau as string}</div>
        </div>
      </div>
    )},
    { label: 'Catégorie', key: 'categorie' },
    { label: 'Coach', key: 'coach', render: e => <span>{(e.coach as string) || '—'}</span> },
    { label: 'Horaires', key: 'horaire', render: e => <span>{(e.horaire as string) || '—'}</span> },
    { label: 'Joueurs', key: 'nbJoueurs', right: true },
    { label: 'Statut', key: 'actif', render: e => (
      <span style={{ background: e.actif ? '#ECFDF5' : '#FFF1F2', color: e.actif ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{e.actif ? 'Actif' : 'Inactif'}</span>
    )},
    { label: '', key: 'actions', right: true, render: e => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(e as unknown as Equipe)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((e as Equipe).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Équipes" subtitle="Gérez les équipes du club" action="Nouvelle équipe" actionIcon="plus" onAction={openCreate} breadcrumb="Équipes" />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
      ) : (
        <ACard noPad>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>
              {equipes.length} équipe{equipes.length !== 1 ? 's' : ''}
            </div>
          </div>
          <ATable cols={cols} rows={equipes as unknown as Record<string, unknown>[]} />
        </ACard>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Nouvelle équipe' : `Modifier — ${editing?.nom}`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Nom de l'équipe" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required placeholder="ex. Nationale 1" />
          <AInput label="Niveau" value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })} placeholder="ex. Nat. 1" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Catégorie" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}
            options={[{value:'Senior',label:'Senior'},{value:'Jeunes',label:'Jeunes'},{value:'Loisir',label:'Loisir'}]} />
          <ASelect label="Groupe" value={form.groupe} onChange={e => setForm({ ...form, groupe: e.target.value })}
            options={[{value:'senior',label:'Senior'},{value:'jeunes',label:'Jeunes'},{value:'loisir',label:'Loisir'}]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Coach" value={form.coach} onChange={e => setForm({ ...form, coach: e.target.value })} placeholder="Nom du coach" />
          <AInput label="Nb joueurs" type="number" value={form.nbJoueurs} onChange={e => setForm({ ...form, nbJoueurs: e.target.value })} />
        </div>
        <AInput label="Horaires d'entraînement" value={form.horaire} onChange={e => setForm({ ...form, horaire: e.target.value })} placeholder="ex. Mardi & Jeudi 19h–21h" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: A.textSec, display: 'block', marginBottom: 5 }}>Couleur</label>
            <input type="color" value={form.couleur} onChange={e => setForm({ ...form, couleur: e.target.value })}
              style={{ width: '100%', height: 38, border: `1px solid ${A.border}`, borderRadius: A.r8, cursor: 'pointer', padding: 2 }} />
          </div>
          <ASelect label="Statut" value={form.actif ? 'true' : 'false'} onChange={e => setForm({ ...form, actif: e.target.value === 'true' })}
            options={[{value:'true',label:'Actif'},{value:'false',label:'Inactif'}]} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(null)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : modal === 'create' ? "Créer l'équipe" : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
