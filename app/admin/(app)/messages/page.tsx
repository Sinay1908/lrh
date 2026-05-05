'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, ATable, Col, IconBtn, Modal, PageHeader, SearchBar } from '@/components/admin/ui'

interface Msg { id: number; nom: string; email: string; sujet: string; corps: string; lu: boolean; archive: boolean; createdAt: string }

export default function MessagesPage() {
  const [items, setItems]     = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [tab, setTab]         = useState<'inbox' | 'archive'>('inbox')
  const [detail, setDetail]   = useState<Msg | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/messages'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const data = items
    .filter(m => tab === 'inbox' ? !m.archive : m.archive)
    .filter(m => `${m.nom} ${m.email} ${m.sujet}`.toLowerCase().includes(search.toLowerCase()))

  const markLu = async (id: number) => {
    await fetch(`/api/messages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lu: true }) })
    await load()
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, lu: true } : null)
  }

  const archive = async (id: number, val: boolean) => {
    await fetch(`/api/messages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archive: val }) })
    await load(); if (detail?.id === id) setDetail(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' }); await load(); if (detail?.id === id) setDetail(null)
  }

  const openDetail = async (m: Msg) => {
    setDetail(m)
    if (!m.lu) await markLu(m.id)
  }

  const cols: Col[] = [
    { label: 'Expéditeur', key: 'nom', render: m => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!(m as Msg).lu && <div style={{ width: 7, height: 7, borderRadius: '50%', background: A.blue, flexShrink: 0 }} />}
        <div>
          <div style={{ fontWeight: (m as Msg).lu ? 500 : 700, fontSize: 13.5 }}>{m.nom as string}</div>
          <div style={{ fontSize: 12, color: A.muted }}>{m.email as string}</div>
        </div>
      </div>
    )},
    { label: 'Sujet', key: 'sujet', wrap: true },
    { label: 'Date', key: 'createdAt', render: m => <span>{new Date((m as Msg).createdAt).toLocaleDateString('fr-FR')}</span> },
    { label: '', key: 'actions', right: true, render: m => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Lire"      onClick={() => openDetail(m as unknown as Msg)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((m as Msg).id)} danger />
      </div>
    )},
  ]

  const nonLus = items.filter(m => !m.lu && !m.archive).length

  return (
    <div>
      <PageHeader title={`Messages${nonLus ? ` (${nonLus} non lu${nonLus>1?'s':''})` : ''}`} subtitle="Messages reçus via le formulaire de contact" breadcrumb="Messages" />

      <ACard noPad>
        <div style={{ display: 'flex', borderBottom: `1px solid ${A.border}` }}>
          {([['inbox','Boîte de réception'],['archive','Archivés']] as [string,string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as 'inbox' | 'archive')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 20px', fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14, color: tab === id ? A.navy : A.muted, borderBottom: `2px solid ${tab === id ? A.red : 'transparent'}`, marginBottom: -1, transition: 'all 0.15s' }}>{label}</button>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}` }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher…" />
        </div>
        {loading ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={data as unknown as Record<string, unknown>[]} />}
      </ACard>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.sujet || ''} width={560}>
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="rsp-form-2col">
              <div><div style={{ fontSize: 11, fontWeight: 600, color: A.muted, marginBottom: 3 }}>DE</div><div style={{ fontSize: 13.5 }}>{detail.nom} &lt;{detail.email}&gt;</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: A.muted, marginBottom: 3 }}>DATE</div><div style={{ fontSize: 13.5 }}>{new Date(detail.createdAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}</div></div>
            </div>
            <div style={{ background: A.bg, borderRadius: A.r8, padding: '14px 16px', lineHeight: 1.7, fontSize: 14, whiteSpace: 'pre-wrap' }}>{detail.corps}</div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: `1px solid ${A.border}` }}>
              {!detail.archive
                ? <ABtn variant="ghost" onClick={() => archive(detail.id, true)}>Archiver</ABtn>
                : <ABtn variant="ghost" onClick={() => archive(detail.id, false)}>Désarchiver</ABtn>}
              <ABtn variant="ghost" onClick={() => handleDelete(detail.id)}>Supprimer</ABtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
