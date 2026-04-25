'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { C, R, SH, SECTION_PAD, SECTION_PAD_SM, MAX_W, SectionHeader, CTABanner, PageHero, StatBlock, Btn } from '@/components/public/ui'

function ValueCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: R.card, padding: '32px 26px', textAlign: 'center',
        transition: 'all 0.22s', boxShadow: hov ? SH.cardHover : SH.card,
        transform: hov ? 'translateY(-4px)' : 'none',
        borderBottom: `3px solid ${hov ? C.red : 'transparent'}`,
      }}>
      <div style={{ fontSize: 34, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: C.navy, marginBottom: 10, textTransform: 'uppercase' }}>{title}</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  )
}

function StaffCard({ name, role, since }: { name: string; role: string; since: string }) {
  const [hov, setHov] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('')
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: R.card, overflow: 'hidden',
        boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.22s', transform: hov ? 'translateY(-3px)' : 'none',
      }}>
      <div style={{
        height: 130, background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(168,214,232,0.18)', border: '2px solid rgba(168,214,232,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: C.lightBlue, letterSpacing: 1,
        }}>{initials}</div>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: C.navy, lineHeight: 1.2 }}>{name}</div>
        <div style={{ color: C.red, fontSize: 13, fontWeight: 600, marginTop: 3 }}>{role}</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{since}</div>
      </div>
    </div>
  )
}

function TimelineItem({ year, title, desc, align, dot }: {
  year: string; title: string; desc: string; align: 'left' | 'right'; dot: 'red' | 'navy'
}) {
  const dotColor = dot === 'red' ? C.red : C.navy
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 1fr', gap: 0, marginBottom: 36 }}>
      {align === 'left' ? (
        <>
          <div style={{ paddingRight: 28, textAlign: 'right' }}>
            <div style={{ display: 'inline-block', background: C.red, color: '#fff', padding: '3px 12px', borderRadius: R.badge, marginBottom: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16 }}>{year}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 5 }}>{title}</div>
            <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{desc}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, flex: 1, background: C.border }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: dotColor, border: '3px solid #fff', boxShadow: `0 0 0 2px ${dotColor}` }} />
            <div style={{ width: 2, flex: 1, background: C.border }} />
          </div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, flex: 1, background: C.border }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: C.navy, border: '3px solid #fff', boxShadow: `0 0 0 2px ${C.navy}` }} />
            <div style={{ width: 2, flex: 1, background: C.border }} />
          </div>
          <div style={{ paddingLeft: 28 }}>
            <div style={{ display: 'inline-block', background: C.navy, color: '#fff', padding: '3px 12px', borderRadius: R.badge, marginBottom: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16 }}>{year}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 5 }}>{title}</div>
            <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{desc}</p>
          </div>
        </>
      )}
    </div>
  )
}

const TIMELINE = [
  { year: '1974', title: 'Fondation du club', desc: "Création par un groupe de passionnés lyonnais. Les premières séances ont lieu au gymnase du 5e arrondissement." },
  { year: '1983', title: 'Premier titre régional', desc: "Les Aigles remportent leur premier championnat régional et accèdent à une compétition nationale pour la première fois." },
  { year: '1995', title: 'Accession en Nationale 1', desc: "Après des années de progression, le club atteint le plus haut niveau du roller hockey français." },
  { year: '2003', title: 'Inauguration du complexe', desc: "Le club inaugure son propre espace au gymnase du Vieux-Lyon, avec une piste homologuée fédérale." },
  { year: '2014', title: 'Titre de champion de France', desc: "Année historique : Lyon Roller Hockey sacré champion de France de Nationale 1 pour la première fois." },
  { year: '2024', title: "50 ans d'histoire", desc: "Le club célèbre son jubilé avec plus de 180 licenciés, 7 équipes et un projet de développement ambitieux." },
]

const VALUES = [
  { icon: '🏆', title: 'Excellence', desc: "Nous visons l'excellence sur et en dehors des terrains, avec des équipes compétitives à tous les niveaux." },
  { icon: '🤝', title: 'Solidarité', desc: "L'esprit d'équipe est au cœur de notre projet. Chaque victoire est collective, chaque difficulté partagée." },
  { icon: '🌱', title: 'Formation', desc: "Notre centre de formation accueille les jeunes dès 8 ans pour les initier et les faire progresser durablement." },
  { icon: '🏙️', title: 'Ancrage local', desc: "Fiers de représenter Lyon, nous sommes un acteur sportif et social de notre territoire depuis 50 ans." },
]

const STAFF = [
  { name: 'Marc Villeneuve', role: 'Entraîneur principal', since: 'Depuis 2018' },
  { name: 'Sophie Bertrand', role: 'Entraîneuse U17/U14',  since: 'Depuis 2021' },
  { name: 'Thierry Arnaud',  role: 'Directeur sportif',    since: 'Depuis 2015' },
  { name: 'Claire Moulin',   role: 'Responsable jeunes',   since: 'Depuis 2020' },
]

export default function ClubPage() {
  return (
    <div>
      <PageHero badge="Depuis 1974" title="Le Club" titleAccent="Lyon Roller Hockey"
        subtitle="50 ans de passion, d'ambition et d'esprit sportif au cœur de Lyon."
        cta="Nous rejoindre" ctaHref="/inscription"
        ctaSecondary="Nous contacter" ctaSecondaryHref="/contact" />

      {/* ── INTRO ── */}
      <div style={{ background: C.offWhite, padding: SECTION_PAD }}>
        <div style={{ ...MAX_W, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <SectionHeader label="Notre identité" title="Les Aigles de Lyon" />
            <p style={{ color: C.muted, fontSize: 15.5, lineHeight: 1.8, marginBottom: 18 }}>
              Lyon Roller Hockey est l&apos;un des clubs de roller hockey les plus historiques de France. Fondé en 1974 dans le 5e arrondissement de Lyon, le club a su traverser les décennies en construisant une identité forte, fondée sur la compétition, la formation et l&apos;appartenance à une vraie communauté sportive.
            </p>
            <p style={{ color: C.muted, fontSize: 15.5, lineHeight: 1.8, marginBottom: 28 }}>
              Aujourd&apos;hui, avec plus de 180 licenciés, 7 équipes et un ancrage fort dans la métropole lyonnaise, les Aigles continuent de porter haut les couleurs du roller hockey français.
            </p>
            <Btn onClick={() => window.location.href = '/inscription'}>Rejoindre le club</Btn>
          </div>
          <div style={{
            background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`,
            borderRadius: 16, height: 260, display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <Image src="/assets/mascotte.png" alt="Mascotte Lyon RH" width={200} height={200}
              style={{ height: '78%', width: 'auto', opacity: 0.30, objectFit: 'contain' }} />
            <div style={{
              position: 'absolute', bottom: 16, left: 16, right: 16,
              background: 'rgba(13,33,80,0.75)', borderRadius: R.inner,
              padding: '10px 14px', textAlign: 'center',
              fontFamily: "'Barlow',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic',
            }}>
              Photo de l&apos;équipe — saison 2024-2025
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: C.navy, padding: SECTION_PAD_SM }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 0, borderRadius: R.card, overflow: 'hidden' }}>
            {[["50+", "Ans d'existence"], ['180+', 'Licenciés actifs'], ['7', 'Équipes'],
              ['12', 'Titres nationaux'], ['3', "Terrains d'entraînement"], ['1974', 'Fondation']
            ].map(([n, l], i) => (
              <div key={l} style={{ borderRight: i < 5 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <StatBlock number={n} label={l} dark />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Notre parcours" title="50 Ans d'Histoire" center
            subtitle="Les grandes étapes qui ont forgé l'identité des Aigles de Lyon." />
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.year} year={item.year} title={item.title} desc={item.desc}
                align={i % 2 === 0 ? 'left' : 'right'} dot={i % 2 === 0 ? 'red' : 'navy'} />
            ))}
          </div>
        </div>
      </div>

      {/* ── VALEURS ── */}
      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Ce qui nous unit" title="Nos Valeurs" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
            {VALUES.map(v => <ValueCard key={v.title} icon={v.icon} title={v.title} desc={v.desc} />)}
          </div>
        </div>
      </div>

      {/* ── STAFF ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Encadrement" title="Notre Staff Technique" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18 }}>
            {STAFF.map(s => <StaffCard key={s.name} name={s.name} role={s.role} since={s.since} />)}
          </div>
        </div>
      </div>

      <CTABanner title="Prêt à rejoindre l'aventure ?"
        subtitle="Que vous soyez joueur, parent ou bénévole, Lyon Roller Hockey vous accueille à bras ouverts."
        btnLabel="S'inscrire au club" btnHref="/inscription" />
    </div>
  )
}
