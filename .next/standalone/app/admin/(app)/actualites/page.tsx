'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, Modal, PageHeader, SearchBar, StatusBadge } from '@/components/admin/ui'

interface Article {
  id: number; titre: string; statut: string; categorie: string | null
  extrait: string | null; contenu: string; imageUrl: string | null
  vues: number; publishedAt: string | null; createdAt: string
}

const EMPTY_FORM = { titre: '', statut: 'draft', categorie: '', extrait: '', contenu: '', imageUrl: '' }

// ── Compression image côté client ──────────────────────────────────────────
function compressImage(file: File, maxW = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new window.Image()
      img.onload = () => {
        const ratio  = Math.min(1, maxW / img.width)
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * ratio)
        canvas.height = Math.round(img.height * ratio)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = ev.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Miniature de l'image ────────────────────────────────────────────────────
function ImagePreview({ url, onRemove }: { url: string; onRemove: () => void }) {
  const isExternal = url.startsWith('http')
  return (
    <div style={{ position: 'relative', display: 'inline-block', marginTop: 8 }}>
      {isExternal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="aperçu" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: A.r8, border: `1px solid ${A.border}` }} />
      ) : (
        <Image src={url} alt="aperçu" width={400} height={160}
          style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: A.r8, border: `1px solid ${A.border}` }}
          unoptimized />
      )}
      <button onClick={onRemove}
        style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
        ×
      </button>
    </div>
  )
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [modal, setModal]       = useState<null | 'create' | 'edit'>(null)
  const [editId, setEditId]     = useState<number | null>(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

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

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setError(null); setModal('create') }
  const openEdit   = (a: Article) => {
    setForm({ titre: a.titre, statut: a.statut, categorie: a.categorie || '', extrait: a.extrait || '', contenu: a.contenu, imageUrl: a.imageUrl || '' })
    setEditId(a.id); setError(null); setModal('edit')
  }

  // ── Upload image ──────────────────────────────────────────────────────────
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
      setForm(prev => ({ ...prev, imageUrl: data.url }))
    } catch { setError('Erreur lors de l\'upload') } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ── Sauvegarde ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.titre.trim() || !form.contenu.trim()) return
    setSaving(true); setError(null)
    try {
      const url    = modal === 'create' ? '/api/articles' : `/api/articles/${editId}`
      const method = modal === 'create' ? 'POST' : 'PUT'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erreur'); return }
      setModal(null); load()
    } catch { setError('Erreur réseau') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return
    await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    load()
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  const cols: Col[] = [
    { label: '', key: 'img', render: (a: Article) => (
      <div style={{ width: 52, height: 36, borderRadius: A.r6, overflow: 'hidden', flexShrink: 0,
        background: `linear-gradient(135deg, ${A.navy} 0%, #1a3568 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {(a as Article).imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={(a as Article).imageUrl!} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="rgba(168,214,232,0.4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        )}
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

      {/* ── Modal article ── */}
      <Modal open={!!modal} onClose={() => { setModal(null); setError(null) }}
        title={modal === 'create' ? 'Nouvel article' : "Modifier l'article"} width={600}>

        <AInput label="Titre *" value={form.titre}
          onChange={e => setForm({ ...form, titre: e.target.value })}
          placeholder="Titre de l'article" required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Catégorie" value={form.categorie}
            onChange={e => setForm({ ...form, categorie: e.target.value })}
            options={[{value:'',label:'Choisir...'},{value:'Résultat',label:'Résultat'},{value:'Recrutement',label:'Recrutement'},{value:'Compétition',label:'Compétition'},{value:'Club',label:'Club'},{value:'Formation',label:'Formation'},{value:'Inscription',label:'Inscription'}]} />
          <ASelect label="Statut" value={form.statut}
            onChange={e => setForm({ ...form, statut: e.target.value })}
            options={[{value:'draft',label:'Brouillon'},{value:'published',label:'Publié'}]} />
        </div>

        {/* ── Photo ── */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: A.textSec, display: 'block', marginBottom: 6 }}>
            Photo de l&apos;article
          </label>
          {form.imageUrl ? (
            <ImagePreview url={form.imageUrl} onRemove={() => setForm({ ...form, imageUrl: '' })} />
          ) : (
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              style={{ border: `2px dashed ${uploading ? A.blue : A.border}`, borderRadius: A.r8,
                padding: '22px 16px', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer',
                background: A.bg, transition: 'border-color 0.2s' }}>
              {uploading ? (
                <div style={{ color: A.blue, fontSize: 13, fontWeight: 500 }}>Upload en cours…</div>
              ) : (
                <>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
                  <div style={{ fontSize: 13, color: A.textSec, fontWeight: 500 }}>Cliquez pour choisir une photo</div>
                  <div style={{ fontSize: 11.5, color: A.muted, marginTop: 3 }}>JPG, PNG, WebP — max 8MB (compressée auto)</div>
                </>
              )}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <AInput label="Extrait" value={form.extrait}
          onChange={e => setForm({ ...form, extrait: e.target.value })}
          placeholder="Résumé court affiché en aperçu..." rows={2} />
        <AInput label="Contenu *" value={form.contenu}
          onChange={e => setForm({ ...form, contenu: e.target.value })}
          placeholder="Contenu complet de l'article..." rows={7} />

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: A.r8,
            padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => { setModal(null); setError(null) }}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave}
            disabled={saving || uploading || !form.titre.trim() || !form.contenu.trim()}>
            {saving ? 'Enregistrement…' : uploading ? 'Upload…' : modal === 'create' ? "Créer l'article" : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </div>
  )
}
