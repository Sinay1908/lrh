'use client'

import { useState } from 'react'
import { C, R, SH, SECTION_PAD, MAX_W, Badge, Btn, SectionHeader, CTABanner, PageHero } from '@/components/public/ui'

function ExpandedTeamCard({ team: t }: { team: typeof TEAMS[0] }) {
  const [hov, setHov] = useState(false)
  const [exp, setExp] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: R.card, overflow: 'hidden',
        boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.22s', borderTop: `4px solid ${t.color}`,
      }}>
      <div style={{ padding: '22px 22px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <Badge bg={t.color}>{t.level}</Badge>
          <span style={{ color: C.muted, fontSize: 12.5 }}>{t.cat}</span>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, color: C.navy, marginBottom: 12 }}>{t.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 13, marginBottom: 12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {t.schedule}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, color: t.color }}>
            {t.coach.split(' ').map((w: string) => w[0]).join('')}
          </div>
          <span style={{ color: C.muted, fontSize: 13 }}>Coach : <strong style={{ color: C.navy }}>{t.coach}</strong></span>
        </div>
        {exp && (
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, margin: '0 0 14px', borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            {t.desc}
          </p>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setExp(!exp)}
            style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, padding: '7px 14px', borderRadius: R.inner, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12.5 }}>
            {exp ? 'Réduire ▲' : 'En savoir plus ▼'}
          </button>
          <Btn size="sm" onClick={() => window.location.href = '/inscription'}>S&apos;inscrire</Btn>
        </div>
      </div>
    </div>
  )
}

const TEAMS = [
  { name: 'Nationale 1',  cat: 'Compétition nationale',  level: 'Nat. 1',  color: C.red,      group: 'senior', schedule: 'Mar & Jeu 19h – 21h', coach: 'Marc Villeneuve', desc: "L'équipe phare du club évolue au plus haut niveau du roller hockey français. Compétition exigeante, objectif playoffs chaque saison." },
  { name: 'Régionale 1',  cat: 'Compétition régionale',  level: 'Rég. 1',  color: C.navy,     group: 'senior', schedule: 'Mar & Jeu 19h – 21h', coach: 'Marc Villeneuve', desc: "Une équipe senior compétitive qui joue les premiers rôles en championnat régional Auvergne-Rhône-Alpes." },
  { name: 'Régionale 2',  cat: 'Compétition régionale',  level: 'Rég. 2',  color: '#1E6B9A',  group: 'senior', schedule: 'Mar & Sam 10h – 12h', coach: 'Pierre Dumont',    desc: "Pour les joueurs souhaitant s'initier à la compétition dans un cadre bienveillant et progressif." },
  { name: 'U17 Juniors',  cat: '15 – 17 ans',            level: 'U17',     color: '#1E6B9A',  group: 'jeunes', schedule: 'Mer & Sam 14h – 16h', coach: 'Sophie Bertrand', desc: "Catégorie juniors avec un programme d'entraînement intensif axé sur la technique et la tactique." },
  { name: 'U14 Cadets',   cat: '12 – 14 ans',            level: 'U14',     color: '#1E6B9A',  group: 'jeunes', schedule: 'Mer & Sam 10h – 12h', coach: 'Sophie Bertrand', desc: "Une équipe dynamique en pleine construction, avec un accent fort sur la progression individuelle." },
  { name: 'U11 Poussins', cat: '8 – 11 ans',             level: 'U11',     color: '#1E6B9A',  group: 'jeunes', schedule: 'Sam 09h – 11h',       coach: 'Claire Moulin',   desc: "La catégorie d'éveil : découverte du roller hockey dans un cadre ludique adapté aux plus jeunes." },
  { name: 'Loisir',       cat: 'Tout niveau & tout âge', level: 'Loisir',  color: '#2A7A4B',  group: 'loisir', schedule: 'Ven 20h – 22h',        coach: 'Équipe encadrante',desc: "Pas de pression, juste du plaisir. La section loisir est ouverte à tous, débutants comme expérimentés." },
]

const GROUPS = [
  { id: 'all',    label: 'Toutes les équipes' },
  { id: 'senior', label: 'Seniors' },
  { id: 'jeunes', label: 'Jeunes' },
  { id: 'loisir', label: 'Loisir' },
]

const PLANNING = [
  { day: 'Mardi',    time: '19h – 21h', teams: 'Nationale 1, Régionale 1',  color: C.red     },
  { day: 'Mercredi', time: '10h – 12h', teams: 'U14, U11',                  color: '#1E6B9A' },
  { day: 'Mercredi', time: '14h – 16h', teams: 'U17',                       color: '#1E6B9A' },
  { day: 'Jeudi',    time: '19h – 21h', teams: 'Nationale 1, Régionale 1',  color: C.red     },
  { day: 'Vendredi', time: '20h – 22h', teams: 'Loisir',                    color: '#2A7A4B' },
  { day: 'Samedi',   time: '09h – 12h', teams: 'U11, U14, Régionale 2',     color: '#1E6B9A' },
]

export default function EquipesPage() {
  const [activeGroup, setActiveGroup] = useState('all')
  const filtered = activeGroup === 'all' ? TEAMS : TEAMS.filter(t => t.group === activeGroup)

  return (
    <div>
      <PageHero badge="Saison 2024–25" title="Nos Équipes" titleAccent="7 Catégories"
        subtitle="Du poussin au compétiteur national, Lyon Roller Hockey propose une équipe adaptée à chaque niveau."
        cta="S'inscrire" ctaHref="/inscription" />

      {/* ── FILTERS ── */}
      <div style={{ background: C.offWhite, padding: '32px 28px 0', position: 'sticky', top: 72, zIndex: 10, boxShadow: '0 2px 0 rgba(13,33,80,0.06)' }}>
        <div style={{ ...MAX_W, display: 'flex', gap: 8, paddingBottom: 16, flexWrap: 'wrap' }}>
          {GROUPS.map(g => (
            <button key={g.id} onClick={() => setActiveGroup(g.id)}
              style={{
                background: activeGroup === g.id ? C.navy : '#fff',
                color: activeGroup === g.id ? '#fff' : C.navy,
                border: `2px solid ${activeGroup === g.id ? C.navy : C.border}`,
                padding: '9px 22px', borderRadius: R.btn,
                fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13.5,
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TEAMS GRID ── */}
      <div style={{ background: C.offWhite, padding: '32px 28px 80px' }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 18 }}>
            {filtered.map(t => <ExpandedTeamCard key={t.name} team={t} />)}
          </div>
        </div>
      </div>

      {/* ── PLANNING ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Planning" title="Horaires d'Entraînement"
            subtitle="Tous les entraînements ont lieu au Gymnase du Vieux-Lyon, 12 rue de la Patinoire, Lyon 5e." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 14 }}>
            {PLANNING.map((s, i) => (
              <div key={i} style={{ background: C.offWhite, borderRadius: R.card, padding: '18px 20px', borderLeft: `4px solid ${s.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: C.navy }}>{s.day}</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: s.color }}>{s.time}</div>
                </div>
                <div style={{ color: C.muted, fontSize: 13 }}>{s.teams}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CTABanner title="Trouvez votre équipe"
        subtitle="Nos entraîneurs sont disponibles pour vous orienter vers la catégorie qui vous correspond."
        btnLabel="Nous contacter" btnHref="/contact" light />
    </div>
  )
}
