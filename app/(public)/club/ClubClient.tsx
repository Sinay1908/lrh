'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { C, R, SH, SECTION_PAD, SECTION_PAD_SM, MAX_W, SectionHeader, CTABanner, PageHero, StatBlock, Btn } from '@/components/public/ui'

interface StaffMembre { id: number; nom: string; role: string; depuis: string | null; equipeNom: string | null; description: string | null; photoUrl: string | null; actif: boolean; ordre: number }
interface PalmaresItem { id: number; annee: string; titre: string; competition: string; description: string | null; ordre: number }

function ValueCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '28px 22px', textAlign: 'center', transition: 'all 0.22s', boxShadow: hov ? SH.cardHover : SH.card, transform: hov ? 'translateY(-4px)' : 'none', borderBottom: `3px solid ${hov ? C.red : 'transparent'}` }}>
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
      <div style={{ height: 140, background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {s.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.photoUrl} alt={s.nom}
            style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid rgba(168,214,232,0.5)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }} />
        ) : (
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(168,214,232,0.18)', border: '2px solid rgba(168,214,232,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 28, color: C.lightBlue, letterSpacing: 1 }}>
            {initials}
          </div>
        )}
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
    <div className="timeline-item" style={{ display: 'grid', gridTemplateColumns: '1fr 48px 1fr', gap: 0, marginBottom: 36 }}>
      {align === 'left' ? (
        <>
          <div className="timeline-content" style={{ paddingRight: 28, textAlign: 'right' }}>
            <div style={{ display: 'inline-block', background: bgColor, color: '#fff', padding: '3px 12px', borderRadius: R.badge, marginBottom: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16 }}>{annee}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 3 }}>{titre}</div>
            <div style={{ fontSize: 12, color: C.red, fontWeight: 600, marginBottom: 4 }}>{competition}</div>
            {description && <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{description}</p>}
          </div>
          <div className="timeline-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, flex: 1, background: C.border }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: dotColor, border: '3px solid #fff', boxShadow: `0 0 0 2px ${dotColor}` }} />
            <div style={{ width: 2, flex: 1, background: C.border }} />
          </div>
          <div className="timeline-empty" />
        </>
      ) : (
        <>
          <div className="timeline-empty" />
          <div className="timeline-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, flex: 1, background: C.border }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: C.navy, border: '3px solid #fff', boxShadow: `0 0 0 2px ${C.navy}` }} />
            <div style={{ width: 2, flex: 1, background: C.border }} />
          </div>
          <div className="timeline-content" style={{ paddingLeft: 28 }}>
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

const DEF_VALUES = [
  { icon: '🏆', title: 'Excellence',   desc: "Nous visons l'excellence sur et en dehors des terrains, avec des équipes compétitives à tous les niveaux." },
  { icon: '🤝', title: 'Solidarité',   desc: "L'esprit d'équipe est au cœur de notre projet. Chaque victoire est collective, chaque difficulté partagée." },
  { icon: '🌱', title: 'Formation',    desc: "Notre centre de formation accueille les jeunes dès 8 ans pour les initier et les faire progresser durablement." },
  { icon: '🏙️', title: 'Ancrage local', desc: "Fiers de représenter Lyon, nous sommes un acteur sportif et social de notre territoire depuis 50 ans." },
]

const DEF_IDENTITE = {
  para1:    "Lyon Roller Hockey est l'un des clubs de roller hockey les plus historiques de France. Fondé en 1974 dans le 5e arrondissement de Lyon, le club a su traverser les décennies en construisant une identité forte, fondée sur la compétition, la formation et l'appartenance à une vraie communauté sportive.",
  para2:    "Aujourd'hui, avec plus de 180 licenciés, 7 équipes et un ancrage fort dans la métropole lyonnaise, Les Roads continuent de porter haut les couleurs du roller hockey français.",
  imageUrl: '',
  caption:  "Photo de l'équipe — saison 2024-2025",
}

const DEF_STATS = [
  { valeur: '50+',  label: "Ans d'existence"     },
  { valeur: '180+', label: 'Licenciés actifs'     },
  { valeur: '7',    label: 'Équipes'              },
  { valeur: '12',   label: 'Titres nationaux'     },
  { valeur: '3',    label: "Terrains d'entraînement" },
  { valeur: '1974', label: 'Fondation'            },
]

export default function ClubClient({ badge }: { badge: string }) {
  const [staff, setStaff]       = useState<StaffMembre[]>([])
  const [palmares, setPalmares] = useState<PalmaresItem[]>([])
  const [identite, setIdentite] = useState(DEF_IDENTITE)
  const [stats, setStats]       = useState(DEF_STATS)
  const [values, setValues]     = useState(DEF_VALUES)

  useEffect(() => {
    fetch('/api/staff')
      .then(r => r.json())
      .then(d => setStaff(Array.isArray(d) ? d.filter((s: StaffMembre) => s.actif).sort((a: StaffMembre, b: StaffMembre) => a.ordre - b.ordre) : []))
      .catch(() => {})
    fetch('/api/palmares')
      .then(r => r.json())
      .then(d => setPalmares(Array.isArray(d) ? d.sort((a: PalmaresItem, b: PalmaresItem) => a.annee.localeCompare(b.annee)) : []))
      .catch(() => {})
    fetch('/api/parametres?section=club')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        setIdentite({
          para1:    d['club.identite.para1']    || DEF_IDENTITE.para1,
          para2:    d['club.identite.para2']    || DEF_IDENTITE.para2,
          imageUrl: d['club.identite.imageUrl'] || '',
          caption:  d['club.identite.caption']  || DEF_IDENTITE.caption,
        })
        setStats(prev => prev.map((s, i) => ({
          valeur: d[`club.stat.${i + 1}.valeur`] || s.valeur,
          label:  d[`club.stat.${i + 1}.label`]  || s.label,
        })))
        setValues(prev => prev.map((v, i) => ({
          icon:  d[`club.valeur.${i + 1}.icon`]  || v.icon,
          title: d[`club.valeur.${i + 1}.titre`] || v.title,
          desc:  d[`club.valeur.${i + 1}.desc`]  || v.desc,
        })))
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <PageHero badge={badge} title="Le Club" titleAccent="Lyon Roller Hockey"
        subtitle="50 ans de passion, d'ambition et d'esprit sportif au cœur de Lyon."
        cta="Nous rejoindre" ctaHref="/inscription"
        ctaSecondary="Nous contacter" ctaSecondaryHref="/contact" />

      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <div className="rsp-2col">
            <div>
              <SectionHeader label="Notre identité" title="Les Roads" />
              <p style={{ color: C.muted, fontSize: 15.5, lineHeight: 1.8, marginBottom: 18 }}>
                {identite.para1}
              </p>
              <p style={{ color: C.muted, fontSize: 15.5, lineHeight: 1.8, marginBottom: 28 }}>
                {identite.para2}
              </p>
              <Btn onClick={() => window.location.href = '/inscription'}>Rejoindre le club</Btn>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, borderRadius: 16, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {identite.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={identite.imageUrl} alt="Photo équipe Lyon RH"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              ) : (
                <Image src="/assets/mascotte.png" alt="Mascotte Lyon RH" width={200} height={200}
                  style={{ height: '78%', width: 'auto', opacity: 0.30, objectFit: 'contain' }} />
              )}
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(13,33,80,0.75)', borderRadius: R.inner, padding: '10px 14px', textAlign: 'center', fontFamily: "'Barlow',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', zIndex: 1 }}>
                {identite.caption}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: C.navy, padding: SECTION_PAD_SM }} className="rsp-section-sm">
        <div style={{ ...MAX_W }}>
          <div className="stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 0, borderRadius: R.card, overflow: 'hidden' }}>
            {stats.map((s, i) => (
              <div key={i} className="stats-bar-divider" style={{ borderRight: i < 5 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <StatBlock number={s.valeur} label={s.label} dark />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Notre parcours" title="Notre Palmarès" center
            subtitle="Les grandes étapes qui ont forgé l'identité des Roads." />
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

      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Ce qui nous unit" title="Nos Valeurs" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 18 }}>
            {values.map((v, i) => <ValueCard key={i} icon={v.icon} title={v.title} desc={v.desc} />)}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Encadrement" title="Notre Staff Technique" center />
          {staff.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted }}>Le staff sera présenté prochainement.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 18 }}>
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
