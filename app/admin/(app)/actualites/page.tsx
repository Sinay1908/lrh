'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader, SearchBar, StatusBadge } from '@/components/admin/ui'

interface Article { id: number; titre: string; statut: string; categorie: string | null; extrait: string | null; contenu: string; vues: number; publishedAt: string | null; createdAt: string }

const EMPTY_FORM = { titre: '', statut: 'draft', categorie: '', extrait: '', contenu: '' }

export default function ActualitesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [modal, setModal]       = useState<null | 'create' | 'edit'>(null)
  const [editId, setEditId]     = useState<number | null>(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/articles')
      .then(r => r.json())
      .then(d => setArticles(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = articles.filter(a =>
    a.titre.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || a.statut === filter)
  )

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit   = (a: Article) => {
    setForm({ titre: a.titre, statut: a.statut, categorie: a.categorie || '', extrait: a.extrait || '', contenu: a.contenu })
    setEditId(a.id)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.titre.trim() || !form.contenu.trim()) return
    setSaving(true)
    try {
      if (modal === 'create') {
        await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else if (editId) {
        await fetch(`/api/articles/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      setModal(null)
      load()
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return
    await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    load()
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  const cols: Col[] = [
    { label: '', key: 'img', render: () => (
      <div style={{ width: 48, height: 34, borderRadius: A.r6, background: `linear-gradient(135deg, ${A.navy} 0%, #1a3568 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="rgba(168,214,232,0.4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    )},
    { label: 'Titre', key: 'titre', wrap: true, render: (a: Article) => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: A.textPri, marginBottom: 2 }}>{a.titre}</div>
        <div style={{ fontSize: 12, color: A.muted }}>{fmtDate(a.publishedAt || a.createdAt)}</div>
      </div>
    )},
    { label: 'Catégorie', key: 'categorie', render: (a: Article) => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12, fontWeight: 500 }}>
        {a.categorie || '—'}
      </span>
    )},
    { label: 'Statut', key: 'statut', render: (a: Article) => <StatusBadge status={a.statut} /> },
    { label: 'Vues', key: 'vues', right: true, render: (a: Article) => (
      <span style={{ color: a.vues > 0 ? A.textPri : A.muted, fontWeight: 500 }}>
        {a.vues > 0 ? a.vues.toLocaleString('fr-FR') : '—'}
      </span>
    )},
    { label: '', key: 'actions', right: true, render: (a: Article) => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(a)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete(a.id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Actualités" subtitle="Gérez les articles et publications du club"
        action="Nouvel article" actionIcon="plus" onAction={openCreate}
        breadcrumb="Actualités" />

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un article..." />
          <div style={{ display: 'flex', gap: 6 }}>
            {([['all','Tous'],['published','Publiés'],['draft','Brouillons']] as [string,string][]).map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ background: filter === v ? A.navy : A.bg, color: filter === v ? '#fff' : A.textSec, border: `1px solid ${filter === v ? A.navy : A.border}`, padding: '6px 14px', borderRadius: A.r6, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', color: A.muted, fontSize: 12.5 }}>
            {loading ? 'Chargement…' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
          </div>
        </div>
        <ATable cols={cols as unknown as Col[]} rows={filtered as unknown as Record<string, unknown>[]} emptyMsg="Aucun article trouvé" />
      </ACard>

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'create' ? 'Nouvel article' : "Modifier l'article"}>
        <AInput label="Titre *" value={form.titre}
          onChange={e => setForm({ ...form, titre: e.target.value })}
          placeholder="Titre de l'article" required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Catégorie" value={form.categorie}
            onChange={e => setForm({ ...form, categorie: e.target.value })}
            options={[
              {value:'',label:'Choisir...'},
              {value:'Résultat',label:'Résultat'},
              {value:'Recrutement',label:'Recrutement'},
              {value:'Compétition',label:'Compétition'},
              {value:'Club',label:'Club'},
              {value:'Formation',label:'Formation'},
              {value:'Inscription',label:'Inscription'},
            ]} />
          <ASelect label="Statut" value={form.statut}
            onChange={e => setForm({ ...form, statut: e.target.value })}
            options={[{value:'draft',label:'Brouillon'},{value:'published',label:'Publié'}]} />
        </div>
        <AInput label="Extrait" value={form.extrait}
          onChange={e => setForm({ ...form, extrait: e.target.value })}
          placeholder="Résumé court affiché en aperçu..." rows={2} />
        <AInput label="Contenu *" value={form.contenu}
          onChange={e => setForm({ ...form, contenu: e.target.value })}
          placeholder="Contenu complet de l'article..." rows={8} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(null)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving || !form.titre.trim() || !form.contenu.trim()}>
            {saving ? 'Enregistrement…' : modal === 'create' ? "Créer l'article" : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </div>
  )
}
