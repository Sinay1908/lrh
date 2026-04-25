'use client'

import { useState } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, Icon, IconBtn, ImageUpload, Modal, PageHeader, StatusBadge } from '@/components/admin/ui'

interface Team { id: number; name: string; level: string; category: string; coach: string; players: number; schedule: string; status: string; color: string }

const TEAMS: Team[] = [
  { id:1, name:'Nationale 1',  level:'Nat. 1',  category:'Senior', coach:'Marc Villeneuve',   players:18, schedule:'Mar & Jeu 19h–21h', status:'active', color:'#D42B2B' },
  { id:2, name:'Régionale 1',  level:'Rég. 1',  category:'Senior', coach:'Marc Villeneuve',   players:14, schedule:'Mar & Jeu 19h–21h', status:'active', color:'#0D2150' },
  { id:3, name:'Régionale 2',  level:'Rég. 2',  category:'Senior', coach:'Pierre Dumont',     players:12, schedule:'Mar & Sam 10h–12h', status:'active', color:'#1E6B9A' },
  { id:4, name:'U17 Juniors',  level:'U17',     category:'Jeunes', coach:'Sophie Bertrand',   players:15, schedule:'Mer & Sam 14h–16h', status:'active', color:'#1E6B9A' },
  { id:5, name:'U14 Cadets',   level:'U14',     category:'Jeunes', coach:'Sophie Bertrand',   players:13, schedule:'Mer & Sam 10h–12h', status:'active', color:'#1E6B9A' },
  { id:6, name:'U11 Poussins', level:'U11',     category:'Jeunes', coach:'Claire Moulin',     players:10, schedule:'Sam 09h–11h',       status:'active', color:'#1E6B9A' },
  { id:7, name:'Loisir',       level:'Loisir',  category:'Loisir', coach:'Équipe encadrante', players:22, schedule:'Ven 20h–22h',       status:'active', color:'#2A7A4B' },
]

function TeamCard({ team: t, onEdit }: { team: Team; onEdit: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <ACard style={{ borderLeft: `4px solid ${t.color}`, transition: 'box-shadow 0.2s', boxShadow: hov ? A.cardHov : A.card }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ background: t.color, color: '#fff', padding: '2px 8px',
              borderRadius: 3, fontSize: 10.5, fontWeight: 700,
              fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>{t.level}</span>
            <span style={{ fontSize: 12, color: A.muted }}>{t.category}</span>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: A.textPri, marginBottom: 8 }}>{t.name}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 12.5, color: A.textSec, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="teams" size={12} color={A.muted} /> {t.coach}
            </div>
            <div style={{ fontSize: 12.5, color: A.textSec, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="matches" size={12} color={A.muted} /> {t.schedule}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: A.bg, borderRadius: A.r8, padding: '6px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: A.textPri, lineHeight: 1 }}>{t.players}</div>
            <div style={{ fontSize: 10.5, color: A.muted, fontWeight: 500 }}>joueurs</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${A.border}` }}>
        <ABtn variant="ghost" size="sm" icon="edit" onClick={onEdit}>Modifier</ABtn>
        <ABtn variant="ghost" size="sm" icon="image" onClick={() => {}}>Photo</ABtn>
      </div>
    </ACard>
  )
}

export default function EquipesPage() {
  const [modal, setModal]   = useState<null | 'create' | 'edit'>(null)
  const [editing, setEditing] = useState<Team | null>(null)
  const [form, setForm]     = useState({ name: '', level: '', category: '', coach: '', schedule: '', status: 'active' })

  const openEdit = (t: Team) => { setEditing(t); setForm({ name: t.name, level: t.level, category: t.category, coach: t.coach, schedule: t.schedule, status: t.status }); setModal('edit') }
  const openCreate = () => { setEditing(null); setForm({ name: '', level: '', category: '', coach: '', schedule: '', status: 'active' }); setModal('create') }

  const cols: Col[] = [
    { label: 'Équipe', key: 'name', render: t => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 28, borderRadius: 2, background: t.color, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t.name}</div>
          <div style={{ fontSize: 11.5, color: A.muted }}>{t.level}</div>
        </div>
      </div>
    )},
    { label: 'Catégorie', key: 'category' },
    { label: 'Coach', key: 'coach' },
    { label: 'Horaires', key: 'schedule' },
    { label: 'Joueurs', key: 'players', right: true },
    { label: 'Statut', key: 'status', render: t => <StatusBadge status={t.status} /> },
    { label: '', key: 'actions', right: true, render: t => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(t as Team)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => {}} danger />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Équipes" subtitle="Gérez les équipes et catégories du club"
        action="Nouvelle équipe" actionIcon="plus" onAction={openCreate} breadcrumb="Équipes" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16, marginBottom: 20 }}>
        {TEAMS.map(t => <TeamCard key={t.id} team={t} onEdit={() => openEdit(t)} />)}
      </div>

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: A.textPri }}>Vue tableau</div>
          <div style={{ color: A.muted, fontSize: 12.5 }}>{TEAMS.length} équipes</div>
        </div>
        <ATable cols={cols} rows={TEAMS as unknown as Record<string, unknown>[]} />
      </ACard>

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'create' ? 'Nouvelle équipe' : `Modifier — ${editing?.name}`}>
        <ImageUpload label="Photo / visuel de l'équipe" hint="PNG, JPG · 800×500px recommandé" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AInput label="Nom de l'équipe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="ex. Nationale 1" />
          <AInput label="Niveau court" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} placeholder="ex. Nat. 1" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ASelect label="Catégorie" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            options={[{value:'',label:'Choisir...'},{value:'Senior',label:'Senior'},{value:'Jeunes',label:'Jeunes'},{value:'Loisir',label:'Loisir'}]} />
          <ASelect label="Statut" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            options={[{value:'active',label:'Actif'},{value:'inactive',label:'Inactif'}]} />
        </div>
        <AInput label="Coach" value={form.coach} onChange={e => setForm({ ...form, coach: e.target.value })} placeholder="Nom du coach" />
        <AInput label="Horaires d'entraînement" value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} placeholder="ex. Mardi & Jeudi 19h–21h" />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(null)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={() => setModal(null)}>{modal === 'create' ? "Créer l'équipe" : 'Enregistrer'}</ABtn>
        </div>
      </Modal>
    </div>
  )
}
