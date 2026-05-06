'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ATable, Col, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

interface FaqItem { id: number; question: string; reponse: string; actif: boolean; ordre: number }

const INIT = { question: '', reponse: '', ordre: '0' }

export default function FaqPage() {
  const [items, setItems]     = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<FaqItem | null>(null)
  const [form, setForm]       = useState(INIT)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/faq')
      const data = await r.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(INIT); setError(null); setModal(true) }
  const openEdit   = (item: FaqItem) => {
    setEditing(item)
    setForm({ question: item.question, reponse: item.reponse, ordre: String(item.ordre) })
    setError(null); setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const body = { ...form, ordre: Number(form.ordre) }
      let res: Response
      if (editing) {
        res = await fetch(`/api/faq/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      } else {
        res = await fetch('/api/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      if (!res.ok) {
        let msg = `Erreur ${res.status}`
        try { const d = await res.json(); msg = d.error || msg } catch {}
        setError(msg)
        return
      }
      await load(); setModal(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur réseau')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette question de la FAQ ?')) return
    await fetch(`/api/faq/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: '#', key: 'ordre', render: p => (
      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.muted }}>
        {String(p.ordre ?? 0).padStart(2, '0')}
      </span>
    )},
    { label: 'Question', key: 'question', wrap: true, render: p => (
      <span style={{ fontWeight: 600, color: A.textPri, fontSize: 14 }}>{p.question as string}</span>
    )},
    { label: 'Réponse', key: 'reponse', wrap: true, render: p => (
      <span style={{ color: A.muted, fontSize: 13 }}>
        {((p.reponse as string) || '').length > 120
          ? (p.reponse as string).slice(0, 120) + '…'
          : (p.reponse as string)}
      </span>
    )},
    { label: '', key: 'actions', right: true, render: p => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(p as unknown as FaqItem)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((p as FaqItem).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader
        title="FAQ — Questions fréquentes"
        subtitle="Gérez les questions et réponses affichées sur la page Contact"
        action="Ajouter une question"
        actionIcon="plus"
        onAction={openCreate}
        breadcrumb="FAQ"
      />
      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, color: A.muted, fontSize: 12.5 }}>
          {items.length} question{items.length !== 1 ? 's' : ''} — ordre croissant d&apos;affichage
        </div>
        {loading
          ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : items.length === 0
            ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: A.muted }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>❓</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Aucune question pour l&apos;instant</div>
                <div style={{ fontSize: 13 }}>Cliquez sur &quot;Ajouter une question&quot; pour commencer.</div>
              </div>
            )
            : <ATable cols={cols} rows={items as unknown as Record<string, unknown>[]} />
        }
      </ACard>

      <Modal open={modal} onClose={() => { setModal(false); setError(null) }} title={editing ? 'Modifier la question' : 'Nouvelle question FAQ'}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 12, color: '#991b1b', fontSize: 13, fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}
        <AInput
          label="Question *"
          value={form.question}
          onChange={e => setForm({ ...form, question: e.target.value })}
          required
          placeholder="ex. Peut-on venir essayer une séance avant de s'inscrire ?"
          rows={2}
        />
        <AInput
          label="Réponse *"
          value={form.reponse}
          onChange={e => setForm({ ...form, reponse: e.target.value })}
          required
          rows={4}
          placeholder="Réponse complète à la question…"
        />
        <AInput
          label="Ordre d'affichage (0 = premier)"
          type="number"
          value={form.ordre}
          onChange={e => setForm({ ...form, ordre: e.target.value })}
        />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving || !form.question || !form.reponse}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </div>
  )
}
