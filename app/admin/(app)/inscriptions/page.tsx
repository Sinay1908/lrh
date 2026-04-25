'use client'

import { useState } from 'react'
import { A, ABtn, ACard, ATable, Col, Divider, IconBtn, Modal, PageHeader, SearchBar, StatusBadge } from '@/components/admin/ui'

interface Inscription { id: number; prenom: string; nom: string; email: string; tel: string; equipe: string; message: string; date: string; status: string }

const INSCRIPTIONS: Inscription[] = [
  { id:1,  prenom:'Lucas',   nom:'Perrin',   email:'lucas.perrin@mail.com',   tel:'06 12 34 56 78', equipe:'U14',         message:"Mon fils a déjà joué au hockey sur glace.",             date:'22 avr. 2025', status:'pending'  },
  { id:2,  prenom:'Emma',    nom:'Rousseau', email:'emma.rousseau@mail.com',  tel:'07 23 45 67 89', equipe:'Loisir',      message:"Complètement débutante, cherche une activité sportive.", date:'20 avr. 2025', status:'approved' },
  { id:3,  prenom:'Thomas',  nom:'Girard',   email:'t.girard@mail.com',       tel:'06 34 56 78 90', equipe:'Nationale 1', message:"Ancien joueur en Régionale 1 à Grenoble.",               date:'19 avr. 2025', status:'pending'  },
  { id:4,  prenom:'Chloé',   nom:'Martin',   email:'chloe.martin@mail.com',   tel:'07 45 67 89 01', equipe:'U17',         message:"Pratique le patin depuis 3 ans.",                        date:'18 avr. 2025', status:'pending'  },
  { id:5,  prenom:'Antoine', nom:'Dupont',   email:'a.dupont@mail.com',       tel:'06 56 78 90 12', equipe:'Loisir',      message:'',                                                        date:'17 avr. 2025', status:'approved' },
  { id:6,  prenom:'Sophie',  nom:'Leroy',    email:'sophie.leroy@mail.com',   tel:'07 67 89 01 23', equipe:'U11',         message:"Fille de 9 ans, très motivée !",                         date:'16 avr. 2025', status:'pending'  },
  { id:7,  prenom:'Maxime',  nom:'Bernard',  email:'m.bernard@mail.com',      tel:'06 78 90 12 34', equipe:'Régionale 2', message:"Retour au hockey après 5 ans de pause.",                  date:'15 avr. 2025', status:'rejected' },
  { id:8,  prenom:'Julie',   nom:'Petit',    email:'julie.petit@mail.com',    tel:'07 89 01 23 45', equipe:'U14',         message:"Passionnée de sport, cherche un club.",                  date:'14 avr. 2025', status:'approved' },
  { id:9,  prenom:'Nicolas', nom:'Simon',    email:'n.simon@mail.com',        tel:'06 90 12 34 56', equipe:'Nationale 1', message:"Niveau régional depuis 4 ans.",                           date:'12 avr. 2025', status:'pending'  },
  { id:10, prenom:'Marie',   nom:'Laurent',  email:'m.laurent@mail.com',      tel:'07 01 23 45 67', equipe:'Loisir',      message:"Cherche une activité entre amis.",                       date:'10 avr. 2025', status:'archived' },
]

export default function InscriptionsPage() {
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState<Inscription | null>(null)

  const counts = {
    all:      INSCRIPTIONS.length,
    pending:  INSCRIPTIONS.filter(r => r.status === 'pending').length,
    approved: INSCRIPTIONS.filter(r => r.status === 'approved').length,
    rejected: INSCRIPTIONS.filter(r => r.status === 'rejected').length,
    archived: INSCRIPTIONS.filter(r => r.status === 'archived').length,
  }

  const filtered = INSCRIPTIONS.filter(r => {
    const s = search.toLowerCase()
    const ok = r.prenom.toLowerCase().includes(s) || r.nom.toLowerCase().includes(s) ||
               r.email.toLowerCase().includes(s) || r.equipe.toLowerCase().includes(s)
    return ok && (filter === 'all' || r.status === filter)
  })

  const cols: Col[] = [
    { label: 'Demandeur', key: 'name', wrap: true, render: r => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: A.textPri }}>{r.prenom} {r.nom}</div>
        <div style={{ fontSize: 12, color: A.muted }}>{r.email}</div>
      </div>
    )},
    { label: 'Équipe souhaitée', key: 'equipe', render: r => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12.5, fontWeight: 500 }}>{r.equipe}</span>
    )},
    { label: 'Date', key: 'date' },
    { label: 'Statut', key: 'status', render: r => <StatusBadge status={r.status} /> },
    { label: '', key: 'actions', right: true, render: r => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="eye"     title="Voir la demande" onClick={() => setSelected(r as Inscription)} color={A.blue} />
        {r.status === 'pending' && <>
          <IconBtn icon="check" title="Approuver" onClick={() => {}} color={A.green} />
          <IconBtn icon="x"     title="Refuser"   onClick={() => {}} danger />
        </>}
        <IconBtn icon="archive" title="Archiver" onClick={() => {}} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Inscriptions" subtitle="Traitez les demandes d'inscription au club" breadcrumb="Inscriptions" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {([
          { key: 'pending',  label: 'En attente', color: A.amber },
          { key: 'approved', label: 'Approuvées', color: A.green },
          { key: 'rejected', label: 'Refusées',   color: A.red   },
          { key: 'archived', label: 'Archivées',  color: A.muted },
        ] as { key: keyof typeof counts; label: string; color: string }[]).map(s => (
          <ACard key={s.key}
            style={{ cursor: 'pointer', borderTop: `3px solid ${filter === s.key ? s.color : 'transparent'}`, transition: 'all 0.15s' }}
            onClick={() => setFilter(s.key === filter ? 'all' : s.key)}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>{counts[s.key]}</div>
            <div style={{ fontSize: 12, color: A.muted, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </ACard>
        ))}
      </div>

      <ACard noPad>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${A.border}`,
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Nom, email, équipe..." />
          <div style={{ display: 'flex', gap: 6 }}>
            {([['all',`Toutes (${counts.all})`],['pending','En attente'],['approved','Approuvées']] as [string,string][]).map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ background: filter === v ? A.navy : A.bg, color: filter === v ? '#fff' : A.textSec,
                  border: `1px solid ${filter === v ? A.navy : A.border}`,
                  padding: '6px 13px', borderRadius: A.r6, cursor: 'pointer',
                  fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 12.5, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>{l}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', color: A.muted, fontSize: 12.5 }}>{filtered.length} demande{filtered.length !== 1 ? 's' : ''}</div>
        </div>
        <ATable cols={cols} rows={filtered as unknown as Record<string, unknown>[]} emptyMsg="Aucune demande trouvée" />
      </ACard>

      <Modal open={!!selected} onClose={() => setSelected(null)}
        title={selected ? `Demande — ${selected.prenom} ${selected.nom}` : ''}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
              {([['Prénom', selected.prenom],['Nom', selected.nom],['Email', selected.email],['Téléphone', selected.tel],['Équipe souhaitée', selected.equipe],['Date', selected.date]] as [string,string][]).map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11.5, color: A.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13.5, color: A.textPri, fontWeight: 500 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
            <Divider label="Message" />
            <div style={{ background: A.bg, borderRadius: A.r8, padding: '14px 16px',
              color: A.textSec, fontSize: 13.5, lineHeight: 1.6, marginBottom: 18, minHeight: 60 }}>
              {selected.message || <em style={{ color: A.muted }}>Aucun message</em>}
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <StatusBadge status={selected.status} />
            </div>
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <ABtn variant="success" icon="check" onClick={() => setSelected(null)}>Approuver</ABtn>
                <ABtn variant="danger"  icon="x"     onClick={() => setSelected(null)}>Refuser</ABtn>
                <ABtn variant="ghost"   icon="archive" onClick={() => setSelected(null)}>Archiver</ABtn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
