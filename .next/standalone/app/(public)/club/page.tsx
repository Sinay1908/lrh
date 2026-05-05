'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { C, R, SH, SECTION_PAD, SECTION_PAD_SM, MAX_W, SectionHeader, CTABanner, PageHero, StatBlock, Btn } from '@/components/public/ui'

interface StaffMembre { id: number; nom: string; role: string; depuis: string | null; equipeNom: string | null; description: string | null; actif: boolean; ordre: number }
interface PalmaresItem { id: number; annee: string; titre: string; competition: string; description: string | null; ordre: number }

function ValueCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '32px 26px', textAlign: 'center', transition: 'all 0.22s', boxShadow: hov ? SH.cardHover : SH.card, transform: hov ? 'translateY(-4px)' : 'none', borderBottom: `3px solid ${hov ? C.red : 'transparent'}` }}>
      <div style={{ fontSize: 34, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: C.navy, marginBottom: 10, textTransform: 'uppercase' }}>{title}</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  )
}

function StaffCard({ s }: { s: StaffMembre }) {
  const [hov, setHov] = useState(false)
  const initials = s.nom.split(' ').map(w => w[0]).join('')
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, overflow: 'hidden', boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.22s', transform: hov ? 'translateY(-3px)' : 'none' }}>
      <div style={{ height: 130, background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(168,214,232,0.18)', border: '2px solid rgba(168,214,232,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: C.lightBlue, letterSpacing: 1 }}>
          {initials}
        </div>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: C.navy, lineHeight: 1.2 }}>{s.nom}</div>
        <div style={{ color: C.red, fontSize: 13, fontWeight: 600, marginTop: 3 }}>{s.role}</div>
        {s.equipeNom && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{s.equipeNom}</div>}
        {s.depuis && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Depuis {s.depuis}</div>}
      </div>
    </div>
  )
}

function TimelineItem({ annee, titre, competition, description, align, dot }: {
  annee: string; titre: string; competition: string; description: string | null; align: 'left' | 'right'; dot: 'red' | 'navy'
}) {
  const dotColor = dot === 'red' ? C.red : C.navy
  const bgColor  = dot === 'red' ? C.red : C.navy
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 1fr', gap: 0, marginBottom: 36 }}>
      {align === 'left' ? (
        <>
          <div style={{ paddingRight: 28, textAlign: 'right' }}>
            <div style={{ display: 'inline-block', background: bgColor, color: '#fff', padding: '3px 12px', borderRadius: R.badge, marginBottom: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16 }}>{annee}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 3 }}>{titre}</div>
            <div style={{ fontSize: 12, color: C.red, fontWeight: 600, marginBottom: 4 }}>{competition}</div>
            {description && <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{description}</p>}
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
            <div style={{ display: 'inline-block', background: bgColor, color: '#fff', padding: '3px 12px', borderRadius: R.badge, marginBottom: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16 }}>{annee}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 3 }}>{titre}</div>
            <div style={{ fontSize: 12, color: C.red, fontWeight: 600, marginBottom: 4 }}>{competition}</div>
            {description && <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{description}</p>}
          </div>
        </>
      )}
    </div>
  )
}

const VALUES = [
  { icon: '🏆', title: 'Excellence', desc: "Nous visons l'excellence sur et en dehors des terrains, avec des équipes compétitives à tous les niveaux." },
  { icon: '🤝', title: 'Solidarité', desc: "L'esprit d'équipe est au cœur de notre projet. Chaque victoire est collective, chaque difficulté partagée." },
  { icon: '🌱', title: 'Formation',  desc: "Notre centre de formation accueille les jeunes dès 8 ans pour les initier et les faire progresser durablement." },
  { icon: '🏙️', title: 'Ancrage local', desc: "Fiers de représenter Lyon, nous sommes un acteur sportif et social de notre territoire depuis 50 ans." },
]

export default function ClubPage() {
  const [staff, setStaff]       = useState<StaffMembre[]>([])
  const [palmares, setPalmares] = useState<PalmaresItem[]>([])

  useEffect(() => {
    fetch('/api/staff')
      .then(r => r.json())
      .then(d => setStaff(Array.isArray(d) ? d.filter((s: StaffMembre) => s.actif).sort((a: StaffMembre, b: StaffMembre) => a.ordre - b.ordre) : []))
      .catch(() => {})
    fetch('/api/palmares')
      .then(r => r.json())
      .then(d => setPalmares(Array.isArray(d) ? d.sort((a: PalmaresItem, b: PalmaresItem) => a.annee.localeCompare(b.annee)) : []))
      .catch(() => {})
  }, [])

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
          <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, borderRadius: 16, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <Image src="/assets/mascotte.png" alt="Mascotte Lyon RH" width={200} height={200}
              style={{ height: '78%', width: 'auto', opacity: 0.30, objectFit: 'contain' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(13,33,80,0.75)', borderRadius: R.inner, padding: '10px 14px', textAlign: 'center', fontFamily: "'Barlow',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>
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

      {/* ── PARCOURS / PALMARÈS ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Notre parcours" title="Notre Palmarès" center
            subtitle="Les grandes étapes qui ont forgé l'identité des Aigles de Lyon." />
          {palmares.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted }}>Le palmarès sera mis à jour prochainement.</div>
          ) : (
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {palmares.map((item, i) => (
                <TimelineItem key={item.id}
                  annee={item.annee} titre={item.titre} competition={item.competition} description={item.description}
                  align={i % 2 === 0 ? 'left' : 'right'} dot={i % 2 === 0 ? 'red' : 'navy'} />
              ))}
            </div>
          )}
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
          {staff.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted }}>Le staff sera présenté prochainement.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18 }}>
              {staff.map(s => <StaffCard key={s.id} s={s} />)}
            </div>
          )}
        </div>
      </div>

      <CTABanner title="Prêt à rejoindre l'aventure ?"
        subtitle="Que vous soyez joueur, parent ou bénévole, Lyon Roller Hockey vous accueille à bras ouverts."
        btnLabel="S'inscrire au club" btnHref="/inscription" />
    </div>
  )
}
