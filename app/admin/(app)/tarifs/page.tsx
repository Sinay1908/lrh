'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface Tarif  { id: number; saison: string; categorie: string; montant: number; description: string | null; actif: boolean; ordre: number }
interface Equipe { id: number; nom: string; actif: boolean }

const CUSTOM_VAL = '__custom__'
const INIT = { saison: '2025-2026', categorie: '', montant: '', description: '', actif: true, ordre: '0' }

export default function TarifsPage() {
  const [items, setItems]       = useState<Tarif[]>([])
  const [equipes, setEquipes]   = useState<Equipe[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState<Tarif | null>(null)
  const [form, setForm]         = useState(INIT)
  const [saving, setSaving]     = useState(false)
  // Mode de saisie de la catégorie : depuis la liste ou saisie libre
  const [catMode, setCatMode]   = useState<'select' | 'manual'>('select')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [r, eq] = await Promise.all([fetch('/api/tarifs'), fetch('/api/equipes')])
      setItems(await r.json())
      const eqData = await eq.json()
      setEquipes(Array.isArray(eqData) ? eqData.filter((e: Equipe) => e.actif) : [])
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  // Options pour la catégorie = noms des équipes actives + "Saisir manuellement"
  const catOptions = [
    ...equipes.map(e => ({ value: e.nom, label: e.nom })),
    { value: CUSTOM_VAL, label: '✏️ Saisir manuellement…' },
  ]

  const openCreate = () => {
    setEditing(null)
    setForm({ ...INIT, categorie: equipes[0]?.nom ?? '' })
    setCatMode('select')
    setModal(true)
  }

  const openEdit = (t: Tarif) => {
    setEditing(t)
    // Si la catégorie existante n'est pas dans la liste des équipes → mode manuel
    const isCustom = t.categorie !== '' && !equipes.some(e => e.nom === t.categorie)
    setCatMode(isCustom ? 'manual' : 'select')
    setForm({ saison: t.saison, categorie: t.categorie, montant: String(t.montant), description: t.description || '', actif: t.actif, ordre: String(t.ordre) })
    setModal(true)
  }

  const handleSelectChange = (val: string) => {
    if (val === CUSTOM_VAL) {
      setCatMode('manual')
      setForm(prev => ({ ...prev, categorie: '' }))
    } else {
      setForm(prev => ({ ...prev, categorie: val }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, montant: Number(form.montant), ordre: Number(form.ordre) }
      if (editing) await fetch(`/api/tarifs/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      else         await fetch('/api/tarifs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce tarif ?')) return
    await fetch(`/api/tarifs/${id}`, { method: 'DELETE' }); await load()
  }

  const saisons = [...new Set(items.map(t => t.saison))].sort().reverse()

  const cols: Col[] = [
    { label: 'Saison',      key: 'saison',      render: t => <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>{t.saison as string}</span> },
    { label: 'Catégorie',   key: 'categorie' },
    { label: 'Montant',     key: 'montant',     right: true, render: t => <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, color: A.navy }}>{(t.montant as number).toFixed(0)} €</span> },
    { label: 'Description', key: 'description', wrap: true,  render: t => <span style={{ color: A.muted, fontSize: 12.5 }}>{(t.description as string) || '—'}</span> },
    { label: 'Statut',      key: 'actif',       render: t => <span style={{ background: t.actif ? '#ECFDF5' : '#FFF1F2', color: t.actif ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{t.actif ? 'Actif' : 'Inactif'}</span> },
    { label: '', key: 'actions', right: true, render: t => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(t as unknown as Tarif)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((t as Tarif).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Tarifs" subtitle="Gérez les tarifs d'inscription par saison et catégorie" action="Ajouter un tarif" actionIcon="plus" onAction={openCreate} breadcrumb="Tarifs" />

      {loading ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div> : (
        saisons.length === 0 ? (
          <ACard><div style={{ textAlign: 'center', padding: 32, color: A.muted }}>Aucun tarif. Cliquez sur &quot;Ajouter un tarif&quot; pour commencer.</div></ACard>
        ) : (
          saisons.map(saison => (
            <div key={saison} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 4, height: 20, background: A.red, borderRadius: 2 }} />
                Saison {saison}
              </div>
              <ACard noPad>
                <ATable cols={cols} rows={items.filter(t => t.saison === saison) as unknown as Record<string, unknown>[]} />
              </ACard>
            </div>
          ))
        )
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le tarif' : 'Nouveau tarif'}>
        <div className="rsp-form-2col">
          <AInput label="Saison *" value={form.saison} onChange={e => setForm({ ...form, saison: e.target.value })} required placeholder="ex. 2025-2026" />
          <AInput label="Montant (€) *" type="number" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} required placeholder="ex. 250" />
        </div>

        {/* Catégorie : sélection depuis les équipes ou saisie libre */}
        {catMode === 'select' ? (
          <ASelect
            label="Catégorie *"
            value={equipes.some(e => e.nom === form.categorie) ? form.categorie : (equipes[0]?.nom ?? '')}
            onChange={e => handleSelectChange(e.target.value)}
            options={catOptions.length > 1 ? catOptions : [{ value: CUSTOM_VAL, label: '✏️ Saisir manuellement…' }]}
          />
        ) : (
          <div>
            <AInput
              label="Catégorie *"
              value={form.categorie}
              onChange={e => setForm({ ...form, categorie: e.target.value })}
              required
              placeholder="ex. Famille, Réduction Pass Sport…"
            />
            {equipes.length > 0 && (
              <button
                onClick={() => { setCatMode('select'); setForm(prev => ({ ...prev, categorie: equipes[0]?.nom ?? '' })) }}
                style={{ background: 'none', border: 'none', color: A.blue, fontSize: 12.5, cursor: 'pointer', padding: '4px 0', fontFamily: "'Barlow',sans-serif", textDecoration: 'underline' }}>
                ← Choisir depuis la liste des équipes
              </button>
            )}
          </div>
        )}

        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Détails inclus, conditions particulières…" />
        <div className="rsp-form-2col">
          <AInput label="Ordre" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
          <ASelect label="Statut" value={form.actif ? 'true' : 'false'} onChange={e => setForm({ ...form, actif: e.target.value === 'true' })} options={[{ value: 'true', label: 'Actif' }, { value: 'false', label: 'Inactif' }]} />
        </div>

        {equipes.length === 0 && catMode === 'select' && (
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: A.r8, padding: '10px 14px', color: '#9A3412', fontSize: 13 }}>
            ⚠️ Aucune équipe créée. <strong>Ajoutez d&apos;abord des équipes</strong> dans &quot;Équipes&quot; ou utilisez la saisie manuelle.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving || !form.categorie.trim()}>{saving ? 'Enregistrement…' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
