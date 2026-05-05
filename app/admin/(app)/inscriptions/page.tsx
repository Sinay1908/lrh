'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, ATable, Col, IconBtn, Modal, PageHeader, SearchBar } from '@/components/admin/ui'

interface Inscription { id: number; prenom: string; nom: string; email: string; telephone: string | null; equipe: string | null; message: string | null; statut: string; createdAt: string }

function SBadge({ s }: { s: string }) {
  const cfg: Record<string, [string, string, string]> = { pending: ['#FFF7ED','#9A3412','En attente'], approved: ['#ECFDF5','#065F46','Approuvé'], rejected: ['#FFF1F2','#BE123C','Refusé'] }
  const [bg, color, label] = cfg[s] || ['#F3F4F6','#374151', s]
  return <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{label}</span>
}

export default function InscriptionsPage() {
  const [items, setItems]     = useState<Inscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [detail, setDetail]   = useState<Inscription | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/inscriptions'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const filtered = items.filter(i => `${i.prenom} ${i.nom} ${i.email}`.toLowerCase().includes(search.toLowerCase()))

  const updateStatut = async (id: number, statut: string) => {
    await fetch(`/api/inscriptions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statut }) })
    await load()
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, statut } : null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette inscription ?')) return
    await fetch(`/api/inscriptions/${id}`, { method: 'DELETE' }); await load(); if (detail?.id === id) setDetail(null)
  }

  const cols: Col[] = [
    { label: 'Demandeur', key: 'nom', render: i => (
      <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{(i as Inscription).prenom} {(i as Inscription).nom}</div><div style={{ fontSize: 12, color: A.muted }}>{i.email as string}</div></div>
    )},
    { label: 'Équipe souhaitée', key: 'equipe', render: i => <span>{(i.equipe as string) || '—'}</span> },
    { label: 'Statut', key: 'statut', render: i => <SBadge s={i.statut as string} /> },
    { label: 'Date', key: 'createdAt', render: i => <span>{new Date((i as Inscription).createdAt).toLocaleDateString('fr-FR')}</span> },
    { label: '', key: 'actions', right: true, render: i => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Voir détail" onClick={() => setDetail(i as unknown as Inscription)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer"   onClick={() => handleDelete((i as Inscription).id)} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Inscriptions" subtitle="Demandes d'inscription au club" breadcrumb="Inscriptions" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[['Total', items.length, A.blue], ['En attente', items.filter(i=>i.statut==='pending').length, '#D97706'], ['Approuvées', items.filter(i=>i.statut==='approved').length, '#059669']].map(([l,v,c]) => (
          <ACard key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: c as string, lineHeight: 1 }}>{v as number}</div>
            <div style={{ fontSize: 13, color: A.textSec, fontWeight: 500 }}>{l as string}</div>
          </ACard>
        ))}
      </div>
      <ACard noPad>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}` }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par nom, email…" />
        </div>
        {loading ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={filtered as unknown as Record<string, unknown>[]} />}
      </ACard>
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `${detail.prenom} ${detail.nom}` : ''} width={520}>
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="rsp-form-2col">
              <div><div style={{ fontSize: 11, fontWeight: 600, color: A.muted, marginBottom: 3 }}>EMAIL</div><div style={{ fontSize: 13.5 }}>{detail.email}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: A.muted, marginBottom: 3 }}>TÉLÉPHONE</div><div style={{ fontSize: 13.5 }}>{detail.telephone || '—'}</div></div>
            </div>
            <div><div style={{ fontSize: 11, fontWeight: 600, color: A.muted, marginBottom: 3 }}>ÉQUIPE SOUHAITÉE</div><div style={{ fontSize: 13.5 }}>{detail.equipe || '—'}</div></div>
            {detail.message && <div><div style={{ fontSize: 11, fontWeight: 600, color: A.muted, marginBottom: 3 }}>MESSAGE</div><div style={{ fontSize: 13.5, background: A.bg, borderRadius: A.r8, padding: '10px 12px', lineHeight: 1.6 }}>{detail.message}</div></div>}
            <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: `1px solid ${A.border}` }}>
              {detail.statut !== 'approved' && <ABtn variant="navy" onClick={() => updateStatut(detail.id, 'approved')}>✓ Approuver</ABtn>}
              {detail.statut !== 'rejected' && <ABtn variant="ghost" onClick={() => updateStatut(detail.id, 'rejected')}>✗ Refuser</ABtn>}
              <div style={{ marginLeft: 'auto' }}><ABtn variant="ghost" onClick={() => handleDelete(detail.id)}>Supprimer</ABtn></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
