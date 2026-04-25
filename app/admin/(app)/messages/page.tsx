'use client'

import { useState } from 'react'
import { A, ABtn, ACard, AInput, Divider, Icon, IconBtn, PageHeader, SearchBar, StatusBadge } from '@/components/admin/ui'

interface Message { id: number; from: string; email: string; sujet: string; date: string; status: string; message: string }

const MESSAGES: Message[] = [
  { id:1, from:'Jean-Luc Moreau',   email:'jl.moreau@mail.com',  sujet:'Demande de partenariat',         date:'23 avr.', status:'unread',   message:"Bonjour, je dirige une entreprise lyonnaise et je souhaiterais discuter d'un possible partenariat avec votre club pour la saison prochaine. Pourriez-vous me recontacter ?" },
  { id:2, from:'Isabelle Fontaine', email:'i.fontaine@mail.com', sujet:'Renseignements U11',              date:'22 avr.', status:'unread',   message:"Bonjour, ma fille a 9 ans et est très attirée par le sport. Pourriez-vous m'expliquer comment fonctionne la catégorie U11 et quels sont les horaires ?" },
  { id:3, from:'Pierre Garnier',    email:'p.garnier@mail.com',  sujet:'Inscription adulte débutant',    date:'21 avr.', status:'read',     message:"Bonjour, j'aimerais m'inscrire en section loisir. Je n'ai jamais fait de roller hockey mais je patine bien. Y a-t-il des prérequis ?" },
  { id:4, from:'Nathalie Vidal',    email:'n.vidal@mail.com',    sujet:'Commande boutique',              date:'20 avr.', status:'read',     message:"J'ai passé une commande sur la boutique pour 2 maillots (tailles M et L) mais je n'ai pas reçu de confirmation. Pouvez-vous vérifier ?" },
  { id:5, from:'Romain Faure',      email:'r.faure@mail.com',    sujet:"Question horaires entraînement", date:'19 avr.', status:'unread',   message:"Bonjour, je voudrais savoir si les entraînements du mardi ont lieu pendant les vacances scolaires. Merci." },
  { id:6, from:'Céline Aubert',     email:'c.aubert@mail.com',   sujet:'Prise en charge Pass Sport',     date:'17 avr.', status:'archived', message:"Bonjour, je voudrais savoir si le club accepte le Pass Sport pour payer une partie de la cotisation." },
  { id:7, from:'Marc Tissier',      email:'m.tissier@mail.com',  sujet:'Tarif familial',                 date:'15 avr.', status:'archived', message:"Nous avons deux enfants qui aimeraient s'inscrire. Est-ce qu'un tarif famille est prévu ?" },
]

function MessageRow({ message: m, active, onClick, isLast }: { message: Message; active: boolean; onClick: () => void; isLast: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '13px 18px', borderBottom: isLast ? 'none' : `1px solid ${A.border}`,
        background: active ? '#EDF4FF' : hov ? '#FAFBFC' : A.white,
        cursor: 'pointer', transition: 'background 0.12s',
        borderLeft: `3px solid ${active ? A.blue : 'transparent'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {m.status === 'unread' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: A.blue, flexShrink: 0 }} />}
          <span style={{ fontWeight: m.status === 'unread' ? 700 : 500, fontSize: 13.5, color: A.textPri }}>{m.from}</span>
        </div>
        <span style={{ fontSize: 12, color: A.muted, flexShrink: 0 }}>{m.date}</span>
      </div>
      <div style={{ fontSize: 13, color: A.textSec, fontWeight: 500, marginBottom: 2 }}>{m.sujet}</div>
      <div style={{ fontSize: 12.5, color: A.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
    </div>
  )
}

export default function MessagesPage() {
  const [selected, setSelected] = useState<Message | null>(null)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [reply, setReply]       = useState('')

  const counts = {
    all:      MESSAGES.length,
    unread:   MESSAGES.filter(m => m.status === 'unread').length,
    read:     MESSAGES.filter(m => m.status === 'read').length,
    archived: MESSAGES.filter(m => m.status === 'archived').length,
  }

  const filtered = MESSAGES.filter(m => {
    const s = search.toLowerCase()
    const ok = m.from.toLowerCase().includes(s) || m.sujet.toLowerCase().includes(s) || m.email.toLowerCase().includes(s)
    return ok && (filter === 'all' || m.status === filter)
  })

  return (
    <div>
      <PageHeader title="Messages" subtitle="Gérez les messages de contact reçus via le site" breadcrumb="Messages" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12, marginBottom: 24 }}>
        {([
          { key: 'unread',   label: 'Non lus',  color: A.blue  },
          { key: 'read',     label: 'Lus',      color: A.muted },
          { key: 'archived', label: 'Archivés', color: A.muted },
        ] as { key: keyof typeof counts; label: string; color: string }[]).map(s => (
          <ACard key={s.key}
            style={{ cursor: 'pointer', borderTop: `3px solid ${filter === s.key ? s.color : 'transparent'}`, transition: 'all 0.15s' }}
            onClick={() => setFilter(s.key === filter ? 'all' : s.key)}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>{counts[s.key]}</div>
            <div style={{ fontSize: 12, color: A.muted, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </ACard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 20 }}>
        <ACard noPad>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}`,
            display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Expéditeur, sujet..." />
            <div style={{ display: 'flex', gap: 6 }}>
              {([['all','Tous'],['unread','Non lus'],['read','Lus'],['archived','Archivés']] as [string,string][]).map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)}
                  style={{ background: filter === v ? A.navy : A.bg, color: filter === v ? '#fff' : A.textSec,
                    border: `1px solid ${filter === v ? A.navy : A.border}`,
                    padding: '6px 12px', borderRadius: A.r6, cursor: 'pointer',
                    fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 12.5, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>{l}</button>
              ))}
            </div>
          </div>
          {filtered.map((m, i) => (
            <MessageRow key={m.id} message={m} active={selected?.id === m.id}
              onClick={() => { setSelected(m); setReply('') }} isLast={i === filtered.length - 1} />
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: A.muted, fontSize: 14 }}>Aucun message trouvé</div>
          )}
        </ACard>

        {selected && (
          <ACard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: A.textPri, marginBottom: 3 }}>{selected.from}</div>
                <div style={{ fontSize: 12.5, color: A.blue }}>{selected.email}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <IconBtn icon="archive" title="Archiver" onClick={() => setSelected(null)} />
                <IconBtn icon="x" title="Fermer" onClick={() => setSelected(null)} />
              </div>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, color: A.textPri, marginBottom: 6 }}>{selected.sujet}</div>
            <div style={{ color: A.muted, fontSize: 12, marginBottom: 18 }}>{selected.date}</div>
            <Divider />
            <div style={{ background: A.bg, borderRadius: A.r8, padding: '14px 16px',
              color: A.textSec, fontSize: 14, lineHeight: 1.7, marginBottom: 20, minHeight: 80 }}>
              {selected.message}
            </div>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: A.textSec, marginBottom: 8 }}>Répondre par email</div>
            <AInput value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Votre réponse..." />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
              <ABtn variant="ghost" size="sm" icon="archive" onClick={() => setSelected(null)}>Archiver</ABtn>
              <ABtn variant="navy"  size="sm" icon="mail"    onClick={() => {}}>Envoyer la réponse</ABtn>
            </div>
          </ACard>
        )}
      </div>
    </div>
  )
}
