'use client'

import { useState } from 'react'
import Image from 'next/image'
import { C, R, SH, SECTION_PAD, SECTION_PAD_SM, MAX_W, Badge, Btn, SectionHeader, CTABanner, MatchCard, ContentCard } from '@/components/public/ui'

function HeroStatCard({ number, label }: { number: string; label: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
      padding: '22px 18px', textAlign: 'center',
      borderRadius: R.card, border: '1px solid rgba(168,214,232,0.12)',
    }}>
      <div style={{ color: C.lightBlue, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 34, lineHeight: 1 }}>{number}</div>
      <div style={{ color: 'rgba(255,255,255,0.52)', fontSize: 11.5, marginTop: 5, fontFamily: "'Barlow',sans-serif", fontWeight: 500 }}>{label}</div>
    </div>
  )
}

function TeamMiniCard({ name, cat, color }: { name: string; cat: string; color: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a href="/equipes" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: R.card, padding: '18px 16px',
        boxShadow: hov ? SH.cardHover : SH.card,
        cursor: 'pointer', transition: 'all 0.2s',
        transform: hov ? 'translateY(-3px)' : 'none',
        borderTop: `3px solid ${color}`, textAlign: 'center', textDecoration: 'none',
      }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: C.navy, lineHeight: 1.15 }}>{name}</div>
      <div style={{ color: C.muted, fontSize: 12, marginTop: 5, fontWeight: 500 }}>{cat}</div>
    </a>
  )
}

const MATCHES = [
  { date: '26', day: 'AVR', time: '15h00', home: 'Lyon RH',       away: 'Grenoble RH',   competition: 'Nationale 1', location: 'Gymnase Vieux-Lyon' },
  { date: '03', day: 'MAI', time: '18h00', home: 'Marseille RH',  away: 'Lyon RH',        competition: 'Nationale 1', location: 'Palais des Sports, Marseille' },
  { date: '10', day: 'MAI', time: '15h00', home: 'Lyon RH',       away: 'Paris RHC',      competition: 'Nationale 1', location: 'Gymnase Vieux-Lyon' },
]

const NEWS = [
  { badge: 'Résultat',    title: 'Victoire 6-2 face à Bordeaux à domicile',    meta: '18 avril 2025', excerpt: "Une prestation collective convaincante. L'équipe première s'impose largement et remonte au classement." },
  { badge: 'Recrutement', title: 'Recherche de joueurs U14 pour 2025-26',       meta: '15 avril 2025', excerpt: "Votre enfant aime le sport et les patins ? Rejoignez les jeunes Aigles lyonnais dès la rentrée." },
  { badge: 'Compétition', title: '3e place en fin de saison : les playoffs approchent', meta: '10 avril 2025', excerpt: "Après 22 journées, les Aigles terminent à la 3e place et se qualifient pour les playoffs." },
]

const TEAMS = [
  { name: 'Nationale 1',   cat: 'Équipe première', color: C.red  },
  { name: 'Régionale 1',   cat: 'Seniors',         color: C.navy },
  { name: 'Régionale 2',   cat: 'Seniors',         color: C.navy },
  { name: 'U17 Juniors',   cat: 'Jeunes',          color: '#1E6B9A' },
  { name: 'U14 Cadets',    cat: 'Jeunes',          color: '#1E6B9A' },
  { name: 'U11 Poussins',  cat: 'Jeunes',          color: '#1E6B9A' },
  { name: 'Loisir',        cat: 'Tout niveau',     color: '#2A7A4B' },
]

const HERO_STATS = [['50+', "Ans d'histoire"], ['180+', 'Licenciés'], ['7', 'Équipes'], ['12', 'Titres']]

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <div style={{
        background: C.navy, position: 'relative',
        overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 75% 75% at 70% 50%, rgba(168,214,232,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', right: '-3%', top: '50%', transform: 'translateY(-50%)',
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,214,232,0.07) 0%, transparent 70%)' }} />
        <Image src="/assets/logo-secondaire.png" alt="" width={72} height={72}
          style={{ position: 'absolute', right: '26%', top: '10%', opacity: 0.06, filter: 'brightness(10)', pointerEvents: 'none' }} />
        <Image src="/assets/logo-principal.png" alt="" width={500} height={500}
          style={{ position: 'absolute', right: '2%', top: '50%', transform: 'translateY(-50%)',
            maxHeight: 500, opacity: 0.10, filter: 'brightness(10)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3 }}>
          <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 64 }}>
            <path d="M0,64 L1440,64 L1440,32 Q1080,0 720,18 Q360,36 0,8 Z" fill={C.offWhite} />
          </svg>
        </div>

        <div style={{ ...MAX_W, padding: '80px 28px 110px', position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ marginBottom: 22 }}>
                <Badge>Saison 2024 – 2025</Badge>
              </div>
              <h1 style={{
                color: '#fff', fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: 900, fontSize: 'clamp(46px,7vw,90px)',
                textTransform: 'uppercase', margin: 0, lineHeight: 0.93, letterSpacing: 0.5,
              }}>
                LA PASSION
                <br /><span style={{ color: C.lightBlue }}>DU ROLLER</span>
                <br />HOCKEY
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.66)', fontSize: 17, margin: '26px 0 34px', lineHeight: 1.7, maxWidth: 500 }}>
                Depuis 1974, les Aigles de Lyon défendent les couleurs du roller hockey français avec passion et ambition.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Btn size="lg" onClick={() => window.location.href = '/inscription'}>Nous rejoindre</Btn>
                <Btn variant="ghost" size="lg" onClick={() => window.location.href = '/club'}>Découvrir le club →</Btn>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              {HERO_STATS.map(([n, l]) => <HeroStatCard key={l} number={n} label={l} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── PROCHAINS MATCHS ── */}
      <div style={{ background: C.offWhite, padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <SectionHeader label="Agenda" title="Prochains Matchs" />
            <div style={{ marginBottom: 44 }}>
              <Btn variant="secondary" size="sm" onClick={() => window.location.href = '/calendrier'}>
                Tout le calendrier →
              </Btn>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MATCHES.map((m, i) => <MatchCard key={i} {...m} />)}
          </div>
        </div>
      </div>

      {/* ── ACTUALITÉS ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Actualités" title="Les Dernières Nouvelles"
            subtitle="Résultats, annonces et vie du club — toute l'actualité des Aigles de Lyon." center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 22 }}>
            {NEWS.map((n, i) => <ContentCard key={i} badge={n.badge} title={n.title} meta={n.meta} excerpt={n.excerpt} />)}
          </div>
        </div>
      </div>

      {/* ── ÉQUIPES ── */}
      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <SectionHeader label="Nos Équipes" title="Pour Tous les Niveaux"
              subtitle="Du débutant au compétiteur national, une équipe vous attend." />
            <div style={{ marginBottom: 44 }}>
              <Btn variant="secondary" size="sm" onClick={() => window.location.href = '/equipes'}>
                Toutes les équipes →
              </Btn>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(165px,1fr))', gap: 12 }}>
            {TEAMS.map(t => <TeamMiniCard key={t.name} name={t.name} cat={t.cat} color={t.color} />)}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <CTABanner
        title="Rejoignez les Aigles de Lyon"
        subtitle="Inscriptions ouvertes pour la saison 2025-2026. Tout niveau, tout âge — venez découvrir le roller hockey !"
        btnLabel="S'inscrire maintenant"
        btnHref="/inscription"
      />

      {/* ── PARTENAIRES ── */}
      <div style={{ background: C.offWhite, padding: SECTION_PAD_SM }}>
        <div style={{ ...MAX_W, textAlign: 'center' }}>
          <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 28 }}>
            Nos partenaires
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {['Métropole de Lyon', 'Mairie du 5e', 'Decathlon Pro', 'Crédit Lyonnais', 'Sports 69'].map(s => (
              <div key={s} style={{
                background: '#fff', border: `1.5px solid ${C.border}`,
                color: C.navy, padding: '11px 22px', borderRadius: R.card,
                fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.8,
              }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
