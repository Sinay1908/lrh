'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { C, R, SH, SECTION_PAD, MAX_W, Badge, Btn, SectionHeader, CTABanner, MatchCard, ContentCard } from '@/components/public/ui'

interface DbMatch { id: number; adversaire: string; competition: string; domicile: boolean; lieu: string | null; date: string; heure: string | null; statut: string; scoreDom: number | null; scoreExt: number | null }
interface DbArticle { id: number; titre: string; slug: string; categorie: string | null; extrait: string | null; contenu: string; imageUrl: string | null; publishedAt: string | null; createdAt: string }
interface DbEquipe { id: number; nom: string; categorie: string; couleur: string }

export interface DbSponsor { id: number; nom: string; logoUrl: string | null; siteUrl: string | null; niveau: string; ordre: number }

export interface HeroParams {
  badge:        string
  title:        string
  subtitle:     string
  ctaPrimary:   string
  ctaSecondary: string
}

export interface HeroStat {
  valeur: string
  label:  string
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="stats-bar-divider" style={{ textAlign: 'center', padding: '28px 16px', borderRight: `1px solid ${C.border}` }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 38, color: C.red, lineHeight: 1 }}>{number}</div>
      <div style={{ color: C.muted, fontSize: 12.5, marginTop: 5, fontFamily: "'Barlow',sans-serif", fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  )
}

function TeamMiniCard({ name, cat, color }: { name: string; cat: string; color: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a href="/equipes" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '18px 16px', boxShadow: hov ? SH.cardHover : SH.card, cursor: 'pointer', transition: 'all 0.2s', transform: hov ? 'translateY(-3px)' : 'none', borderTop: `3px solid ${color}`, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: C.navy, lineHeight: 1.15 }}>{name}</div>
      <div style={{ color: C.muted, fontSize: 12, marginTop: 5, fontWeight: 500 }}>{cat}</div>
    </a>
  )
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr)
  return { date: d.getDate().toString().padStart(2,'0'), day: d.toLocaleDateString('fr-FR',{month:'short'}).toUpperCase().replace('.','') }
}

export default function HomePageClient({ hero, heroStats, sponsors }: { hero: HeroParams; heroStats: HeroStat[]; sponsors: DbSponsor[] }) {
  const [matchs, setMatchs]     = useState<DbMatch[]>([])
  const [articles, setArticles] = useState<DbArticle[]>([])
  const [equipes, setEquipes]   = useState<DbEquipe[]>([])

  useEffect(() => {
    fetch('/api/matchs?statut=upcoming').then(r=>r.json()).then(data => setMatchs(Array.isArray(data) ? data.slice(0,3) : [])).catch(()=>{})
    fetch('/api/articles?statut=published').then(r=>r.json()).then(data => setArticles(Array.isArray(data) ? data.slice(0,3) : [])).catch(()=>{})
    fetch('/api/equipes').then(r=>r.json()).then(data => setEquipes(Array.isArray(data) ? data.filter((e: DbEquipe) => e) : [])).catch(()=>{})
  }, [])

  return (
    <div>
      {/* ── HERO — valeurs injectées côté serveur ── */}
      <div style={{ background: C.navy, position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 75% at 70% 50%, rgba(168,214,232,0.08) 0%, transparent 60%)' }} />
        <Image src="/assets/logo-secondaire.png" alt="" width={72} height={72}
          style={{ position: 'absolute', right: '26%', top: '10%', opacity: 0.06, filter: 'brightness(10)', pointerEvents: 'none' }} />
        <Image src="/assets/logo-principal.png" alt="" width={500} height={500}
          style={{ position: 'absolute', right: '2%', top: '50%', transform: 'translateY(-50%)', maxHeight: 500, opacity: 0.10, filter: 'brightness(10)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3 }}>
          <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 64 }}>
            <path d="M0,64 L1440,64 L1440,32 Q1080,0 720,18 Q360,36 0,8 Z" fill={C.offWhite} />
          </svg>
        </div>

        <div style={{ ...MAX_W, padding: '80px 28px 110px', position: 'relative', zIndex: 2, width: '100%' }}
          className="rsp-page-hero-inner">
            <div style={{ maxWidth: 680 }}>
              <div style={{ marginBottom: 22 }}><Badge>{hero.badge}</Badge></div>
              <h1 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(40px,7vw,90px)', textTransform: 'uppercase', margin: 0, lineHeight: 0.93, letterSpacing: 0.5 }}>
                {hero.title}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.66)', fontSize: 'clamp(14px,2vw,17px)', margin: '22px 0 28px', lineHeight: 1.7, maxWidth: 560 }}>
                {hero.subtitle}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Btn size="lg" onClick={() => window.location.href = '/inscription'}>{hero.ctaPrimary}</Btn>
                <Btn variant="ghost" size="lg" onClick={() => window.location.href = '/club'}>{hero.ctaSecondary} →</Btn>
              </div>
            </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...MAX_W, padding: '0 28px' }}>
          <div className="stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {heroStats.map(s => <StatItem key={s.label} number={s.valeur} label={s.label} />)}
          </div>
        </div>
      </div>

      {/* ── PROCHAINS MATCHS ── */}
      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
            <SectionHeader label="Agenda" title="Prochains Matchs" />
            <div style={{ marginBottom: 44 }}>
              <Btn variant="secondary" size="sm" onClick={() => window.location.href = '/calendrier'}>Tout le calendrier →</Btn>
            </div>
          </div>
          {matchs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: C.muted, fontSize: 15 }}>Aucun match à venir pour le moment.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {matchs.map(m => {
                const { date, day } = fmtDate(m.date)
                const home = m.domicile ? 'Lyon RH' : m.adversaire
                const away = m.domicile ? m.adversaire : 'Lyon RH'
                return <MatchCard key={m.id} date={date} day={day} time={m.heure || '—'} home={home} away={away} competition={m.competition} location={m.lieu || ''} />
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── ACTUALITÉS ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Actualités" title="Les Dernières Nouvelles" subtitle="Résultats, annonces et vie du club — toute l'actualité des Roads." center />
          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: C.muted }}>Aucune actualité publiée pour le moment.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22 }}>
              {articles.map(a => {
                const dateStr = a.publishedAt || a.createdAt
                const meta = new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
                return <ContentCard key={a.id} badge={a.categorie || 'Actualité'} title={a.titre} meta={meta} excerpt={a.extrait || a.contenu.substring(0, 160) + '…'} imageUrl={a.imageUrl} href={'/actualites/' + a.slug} />
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── ÉQUIPES ── */}
      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
            <SectionHeader label="Nos Équipes" title="Pour Tous les Niveaux" subtitle="Du débutant au compétiteur national, une équipe vous attend." />
            <div style={{ marginBottom: 44 }}>
              <Btn variant="secondary" size="sm" onClick={() => window.location.href = '/equipes'}>Toutes les équipes →</Btn>
            </div>
          </div>
          {equipes.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.muted }}>Chargement des équipes…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
              {equipes.map(e => <TeamMiniCard key={e.id} name={e.nom} cat={e.categorie} color={e.couleur} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── PARTENAIRES ── */}
      {sponsors.length > 0 && (
        <div style={{ background: '#fff', padding: SECTION_PAD }} className="rsp-section">
          <div style={{ ...MAX_W }}>
            <SectionHeader label="Ils nous soutiennent" title="Nos Partenaires" center />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 40, marginTop: 8 }}>
              {sponsors.map(s => (
                <a key={s.id}
                  href={s.siteUrl || undefined}
                  target={s.siteUrl ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  {s.logoUrl ? (
                    <div style={{ width: 160, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={s.logoUrl} alt={s.nom}
                        style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', filter: 'grayscale(30%)', transition: 'filter 0.2s', opacity: 0.85 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%)'; (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(30%)'; (e.currentTarget as HTMLImageElement).style.opacity = '0.85' }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      padding: '12px 24px', borderRadius: R.card,
                      border: `1.5px solid ${C.border}`, color: C.navy,
                      fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15,
                      letterSpacing: 0.5, whiteSpace: 'nowrap',
                    }}>{s.nom}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <CTABanner title="Rejoignez Les Roads" subtitle="Inscriptions ouvertes pour la saison 2025-2026. Tout niveau, tout âge — venez découvrir le roller hockey !" btnLabel="S'inscrire maintenant" btnHref="/inscription" />
    </div>
  )
}
