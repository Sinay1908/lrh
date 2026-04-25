'use client'

import { useState } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, IconBtn, ImageUpload, Modal, PageHeader, SearchBar, StatusBadge } from '@/components/admin/ui'

interface Article { id: number; title: string; status: string; category: string; author: string; date: string; views: number }

const ARTICLES: Article[] = [
  { id:1, title:'Victoire 6-2 face à Bordeaux à domicile',           status:'published', category:'Résultat',     author:'Admin', date:'18 avr. 2025', views:412 },
  { id:2, title:'Recherche de joueurs U14 pour la saison 2025-26',    status:'published', category:'Recrutement',  author:'Admin', date:'15 avr. 2025', views:318 },
  { id:3, title:'3e place en fin de saison régulière',                 status:'published', category:'Compétition',  author:'Admin', date:'10 avr. 2025', views:527 },
  { id:4, title:'Ouverture des inscriptions pour 2025-2026',           status:'draft',     category:'Inscription',  author:'Admin', date:'08 avr. 2025', views:0   },
  { id:5, title:'Nouveau partenariat avec Decathlon Pro',              status:'published', category:'Club',         author:'Admin', date:'02 avr. 2025', views:201 },
  { id:6, title:"Compte-rendu de l'assemblée générale 2025",           status:'draft',     category:'Club',         author:'Admin', date:'28 mar. 2025', views:0   },
  { id:7, title:'Stage de Pâques pour les U11 et U14',                status:'published', category:'Formation',    author:'Admin', date:'20 mar. 2025', views:289 },
]

export default function ActualitesPage() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [modal, setModal]     = useState<null | 'create' | 'edit'>(null)
  const [form, setForm]       = useState({ title: '', status: 'draft', category: '', excerpt: '' })

  const filtered = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || a.status === filter)
  )

  const cols: Col[] = [
    { label: '', key: 'img', render: () => (
      <div style={{ width: 48, height: 34, borderRadius: A.r6,
        background: `linear-gradient(135deg, ${A.navy} 0%, #1a3568 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="rgba(168,214,232,0.4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    )},
    { label: 'Titre', key: 'title', wrap: true, render: a => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: A.textPri, marginBottom: 2 }}>{a.title}</div>
        <div style={{ fontSize: 12, color: A.muted }}>{a.author} · {a.date}</div>
      </div>
    )},
    { label: 'Catégorie', key: 'category', render: a => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12, fontWeight: 500 }}>{a.category}</span>
    )},
    { label: 'Statut', key: 'status', render: a => <StatusBadge status={a.status} /> },
    { label: 'Vues', key: 'views', right: true, render: a => (
      <span style={{ color: a.views > 0 ? A.textPri : A.muted, fontWeight: 500 }}>
        {a.views > 0 ? a.views.toLocaleString('fr-FR') : '—'}
      </span>
    )},
    { label: '', key: 'actions', right: true, render: a => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="eye"   title="Aperçu"    onClick={() => {}} />
        <IconBtn icon="edit"  title="Modifier"  onClick={() => { setForm({ title: a.title, status: a.status, category: a.category, excerpt: '' }); setModal('edit') }} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => {}} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Actualités" subtitle="Gérez les articles et publications du club"
        action="Nouvel article" actionIcon="plus" onAction={() => { setForm({ title: '', status: 'draft', category: '', excerpt: '' }); setModal('create') }}
        breadcrumb="Actualités" />

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`,
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un article..." />
          <div style={{ display: 'flex', gap: 6 }}>
            {([['all','Tous'],['published','Publiés'],['draft','Brouillons']] as [string,string][]).map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ background: filter === v ? A.navy : A.bg, color: filter === v ? '#fff' : A.textSec,
                  border: `1px solid ${filter === v ? A.navy : A.border}`,
                  padding: '6px 14px', borderRadius: A.r6, cursor: 'pointer',
                  fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', color: A.muted, fontSize: 12.5 }}>
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
        <ATable cols={cols} rows={filtered as unknown as Record<string, unknown>[]} emptyMsg="Aucun article trouvé" />
      </ACard>

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'create' ? 'Nouvel article' : "Modifier l'article"}>
        <ImageUpload label="Image de couverture" hint="PNG, JPG · 1200×600px recommandé" />
        <AInput label="Titre" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Titre de l'article" required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Catégorie" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            options={[{value:'',label:'Choisir...'},{value:'Résultat',label:'Résultat'},{value:'Recrutement',label:'Recrutement'},{value:'Compétition',label:'Compétition'},{value:'Club',label:'Club'},{value:'Formation',label:'Formation'}]} />
          <ASelect label="Statut" value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            options={[{value:'draft',label:'Brouillon'},{value:'published',label:'Publié'}]} />
        </div>
        <AInput label="Extrait" value={form.excerpt}
          onChange={e => setForm({ ...form, excerpt: e.target.value })}
          placeholder="Résumé court de l'article..." rows={3} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(null)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={() => setModal(null)}>
            {modal === 'create' ? "Créer l'article" : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </div>
  )
}
