'use client'

import { useState } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, Icon, IconBtn, ImageUpload, Modal, PageHeader, StatusBadge } from '@/components/admin/ui'

interface Sponsor { id: number; name: string; tier: string; status: string; since: string; url: string }

const SPONSORS: Sponsor[] = [
  { id:1, name:'Métropole de Lyon',   tier:'premium',    status:'active',   since:'2020', url:'metropole.lyon.fr' },
  { id:2, name:'Mairie du 5e',        tier:'premium',    status:'active',   since:'2018', url:'lyon.fr' },
  { id:3, name:'Decathlon Pro',       tier:'partenaire', status:'active',   since:'2022', url:'decathlon.fr' },
  { id:4, name:'Crédit Lyonnais',     tier:'partenaire', status:'active',   since:'2021', url:'lcl.fr' },
  { id:5, name:'Sports 69',           tier:'partenaire', status:'active',   since:'2023', url:'sports69.fr' },
  { id:6, name:'Brasserie du Rhône',  tier:'supporter',  status:'inactive', since:'2019', url:'brasserie-rhone.fr' },
  { id:7, name:'Presse Sport Lyon',   tier:'media',      status:'active',   since:'2024', url:'pressesportlyon.fr' },
  { id:8, name:'Assurance Sportive+', tier:'supporter',  status:'active',   since:'2023', url:'assurance-sport.fr' },
  { id:9, name:'Auto-École Central',  tier:'supporter',  status:'inactive', since:'2022', url:'autoecole-central.fr' },
]

const TIER_MAP: Record<string, { label: string; color: string; bg: string }> = {
  premium:    { label: 'Premium',    color: '#D97706', bg: '#FFFBEB' },
  partenaire: { label: 'Partenaire', color: A.navy,    bg: '#E8EDF5' },
  supporter:  { label: 'Supporter',  color: A.muted,   bg: A.bg      },
  media:      { label: 'Média',      color: A.purple,  bg: A.purpleL },
}

function SponsorCard({ sponsor: s, onEdit }: { sponsor: Sponsor; onEdit: () => void }) {
  const [hov, setHov] = useState(false)
  const tm = TIER_MAP[s.tier]
  return (
    <ACard style={{ transition: 'box-shadow 0.2s', boxShadow: hov ? A.cardHov : A.card, opacity: s.status === 'inactive' ? 0.6 : 1 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 52, height: 38, borderRadius: A.r6, background: A.bg,
          border: `1px solid ${A.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="image" size={16} color={A.muted} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconBtn icon="edit"  title="Modifier"  onClick={onEdit} color={A.blue} />
          <IconBtn icon="trash" title="Supprimer" onClick={() => {}} danger />
        </div>
      </div>
      <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 14, color: A.textPri, marginBottom: 4 }}>{s.name}</div>
      <div style={{ fontSize: 12, color: A.blue, marginBottom: 10 }}>{s.url}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ background: tm.bg, color: tm.color, padding: '3px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600 }}>{tm.label}</span>
        <StatusBadge status={s.status} />
      </div>
    </ACard>
  )
}

export default function PartenairesPage() {
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null)
  const [form, setForm]   = useState({ name: '', url: '', tier: 'partenaire', status: 'active' })

  const openEdit = (s: Sponsor) => { setForm({ name: s.name, url: s.url, tier: s.tier, status: s.status }); setModal('edit') }
  const openCreate = () => { setForm({ name: '', url: '', tier: 'partenaire', status: 'active' }); setModal('create') }

  const grouped = ['premium','partenaire','supporter','media'].map(tier => ({
    tier, items: SPONSORS.filter(s => s.tier === tier),
  })).filter(g => g.items.length > 0)

  const cols: Col[] = [
    { label: 'Logo', key: 'logo', render: () => (
      <div style={{ width: 48, height: 34, borderRadius: A.r6, background: A.bg,
        border: `1px solid ${A.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="image" size={14} color={A.muted} />
      </div>
    )},
    { label: 'Nom', key: 'name', render: s => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: A.textPri }}>{s.name}</div>
        <div style={{ fontSize: 12, color: A.blue }}>{s.url}</div>
      </div>
    )},
    { label: 'Niveau', key: 'tier', render: s => {
      const tm = TIER_MAP[s.tier]
      return <span style={{ background: tm.bg, color: tm.color, padding: '3px 9px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{tm.label}</span>
    }},
    { label: 'Partenaire depuis', key: 'since', render: s => <span style={{ color: A.textSec }}>{s.since}</span> },
    { label: 'Statut', key: 'status', render: s => <StatusBadge status={s.status} /> },
    { label: '', key: 'actions', right: true, render: s => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="link"  title="Visiter"   onClick={() => {}} color={A.blue} />
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(s as Sponsor)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => {}} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Partenaires" subtitle="Gérez les sponsors et partenaires du club"
        action="Ajouter un partenaire" actionIcon="plus" onAction={openCreate} breadcrumb="Partenaires" />

      {grouped.map(g => {
        const tm = TIER_MAP[g.tier]
        return (
          <div key={g.tier} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ background: tm.bg, color: tm.color, padding: '4px 12px', borderRadius: 99,
                fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12,
                letterSpacing: 1.2, textTransform: 'uppercase' }}>{tm.label}</span>
              <span style={{ color: A.muted, fontSize: 12.5 }}>{g.items.length} partenaire{g.items.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
              {g.items.map(s => <SponsorCard key={s.id} sponsor={s} onEdit={() => openEdit(s)} />)}
            </div>
          </div>
        )
      })}

      <ACard noPad style={{ marginTop: 8 }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>Tous les partenaires</div>
        </div>
        <ATable cols={cols} rows={SPONSORS as unknown as Record<string, unknown>[]} />
      </ACard>

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'create' ? 'Nouveau partenaire' : 'Modifier le partenaire'}>
        <ImageUpload label="Logo du partenaire" hint="PNG transparent recommandé · 300×150px minimum" />
        <AInput label="Nom du partenaire" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="ex. Decathlon Pro" />
        <AInput label="Site web" value={form.url} icon="link" onChange={e => setForm({ ...form, url: e.target.value })} placeholder="www.exemple.fr" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Niveau" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}
            options={[{value:'premium',label:'Premium'},{value:'partenaire',label:'Partenaire'},{value:'supporter',label:'Supporter'},{value:'media',label:'Média'}]} />
          <ASelect label="Statut" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            options={[{value:'active',label:'Actif'},{value:'inactive',label:'Inactif'}]} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(null)}>Annuler</ABtn>
          <ABtn variant="navy"  onClick={() => setModal(null)}>{modal === 'create' ? 'Ajouter' : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
