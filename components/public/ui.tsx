'use client'

import { useState } from 'react'
import Image from 'next/image'

// ── Design tokens ────────────────────────────────────────────────────────────
export const C = {
  navy:          '#0D2150',
  navyLight:     '#162B65',
  lightBlue:     '#A8D6E8',
  lightBluePale: '#EDF4F8',
  red:           '#D42B2B',
  redHover:      '#B52323',
  white:         '#FFFFFF',
  offWhite:      '#F7F9FB',
  muted:         '#5A6B8A',
  border:        '#D8E4ED',
}
export const R = { card: 12, btn: 8, badge: 4, inner: 6 }
export const SH = {
  card:      '0 2px 10px rgba(13,33,80,0.07)',
  cardHover: '0 8px 28px rgba(13,33,80,0.14)',
  nav:       '0 2px 20px rgba(0,0,0,0.22)',
}
export const SECTION_PAD     = '80px 28px'
export const SECTION_PAD_SM  = '56px 28px'
export const MAX_W           = { maxWidth: 1280, margin: '0 auto' } as const

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, bg, color }: { children: React.ReactNode; bg?: string; color?: string }) {
  return (
    <span style={{
      display: 'inline-block',
      background: bg || C.red, color: color || '#fff',
      padding: '4px 11px', borderRadius: R.badge,
      fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
      fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
      whiteSpace: 'nowrap', lineHeight: 1.4,
    }}>{children}</span>
  )
}

// ── Btn ──────────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'navy' | 'ghost'
type BtnSize    = 'sm' | 'md' | 'lg'

export function Btn({
  children, variant = 'primary', size = 'md', onClick, fullWidth, disabled, style: extra,
}: {
  children: React.ReactNode
  variant?:  BtnVariant
  size?:     BtnSize
  onClick?:  () => void
  fullWidth?: boolean
  disabled?:  boolean
  style?:     React.CSSProperties
}) {
  const [hov, setHov] = useState(false)
  const pad  = { sm: '8px 16px', md: '11px 22px', lg: '14px 32px' }[size]
  const fs   = { sm: 13,        md: 14,           lg: 15.5        }[size]

  const styles: Record<BtnVariant, { bg: string; clr: string; brd: string }> = {
    primary:   { bg: hov ? C.redHover : C.red,   clr: '#fff',       brd: 'none' },
    secondary: { bg: hov ? C.navy     : 'transparent', clr: hov ? '#fff' : C.navy, brd: `2px solid ${C.navy}` },
    navy:      { bg: hov ? C.navyLight : C.navy, clr: '#fff',       brd: 'none' },
    ghost:     { bg: hov ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)', clr: '#fff', brd: '1.5px solid rgba(255,255,255,0.4)' },
  }
  const s = styles[variant]

  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: s.bg, color: s.clr, border: s.brd,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: pad, borderRadius: R.btn,
        fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: fs, letterSpacing: 0.3,
        width: fullWidth ? '100%' : 'auto', transition: 'all 0.2s',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap', ...extra,
      }}>
      {children}
    </button>
  )
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ label, title, subtitle, center }: {
  label?:    string
  title:     string
  subtitle?: string
  center?:   boolean
}) {
  const align = center ? 'center' : 'left'
  return (
    <div style={{ textAlign: align, marginBottom: 44 }}>
      {label && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          marginBottom: 10, color: C.red,
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
          fontSize: 11, letterSpacing: 3.5, textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          <span style={{ display: 'inline-block', width: 20, height: 2, background: C.red, borderRadius: 1, flexShrink: 0 }} />
          {label}
          <span style={{ display: 'inline-block', width: 20, height: 2, background: C.red, borderRadius: 1, flexShrink: 0 }} />
        </div>
      )}
      <h2 style={{
        color: C.navy, fontFamily: "'Barlow Condensed',sans-serif",
        fontWeight: 800, fontSize: 'clamp(26px,3.2vw,42px)',
        textTransform: 'uppercase', margin: '0 0 12px', lineHeight: 1.05, letterSpacing: 0.3,
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          color: C.muted, fontSize: 15.5, lineHeight: 1.7,
          maxWidth: center ? 580 : 660, margin: center ? '0 auto' : 0,
        }}>{subtitle}</p>
      )}
    </div>
  )
}

// ── PageHero ──────────────────────────────────────────────────────────────────
export function PageHero({ badge, title, titleAccent, subtitle, cta, ctaHref, ctaSecondary, ctaSecondaryHref }: {
  badge?:              string
  title:               string
  titleAccent?:        string
  subtitle?:           string
  cta?:                string
  ctaHref?:            string
  ctaSecondary?:       string
  ctaSecondaryHref?:   string
}) {
  return (
    <div style={{
      background: C.navy, paddingTop: 72, position: 'relative',
      overflow: 'hidden', minHeight: 300, display: 'flex', alignItems: 'center',
    }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%',
        background: 'radial-gradient(ellipse at 80% 50%, rgba(168,214,232,0.09) 0%, transparent 65%)' }} />
      <div style={{ position: 'absolute', right: -80, top: -60, width: 320, height: 460,
        background: 'rgba(168,214,232,0.05)', transform: 'rotate(-12deg)', borderRadius: 32 }} />
      <Image src="/assets/logo-principal.png" alt="" width={260} height={260}
        style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
          opacity: 0.07, filter: 'brightness(10)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 56 }}>
          <path d="M0,56 L1440,56 L1440,28 Q1080,0 720,18 Q360,36 0,8 Z" fill={C.offWhite} />
        </svg>
      </div>

      <div style={{ ...MAX_W, padding: '64px 28px 76px', position: 'relative', zIndex: 2, width: '100%' }}>
        {badge && (
          <div style={{ marginBottom: 14 }}>
            <Badge>{badge}</Badge>
          </div>
        )}
        <h1 style={{
          color: '#fff', fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 900, fontSize: 'clamp(36px,5.5vw,64px)',
          textTransform: 'uppercase', margin: '0 0 8px', lineHeight: 1, letterSpacing: 0.5,
        }}>
          {title}
          {titleAccent && <><br /><span style={{ color: C.lightBlue }}>{titleAccent}</span></>}
        </h1>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 16, margin: '12px 0 0', maxWidth: 560, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        )}
        {(cta || ctaSecondary) && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            {cta && ctaHref && (
              <a href={ctaHref} style={{
                background: C.red, color: '#fff', padding: '14px 32px', borderRadius: R.btn,
                fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15.5,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>{cta}</a>
            )}
            {ctaSecondary && ctaSecondaryHref && (
              <a href={ctaSecondaryHref} style={{
                background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '14px 32px', borderRadius: R.btn,
                fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15.5,
                textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.4)',
              }}>{ctaSecondary}</a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── CTABanner ─────────────────────────────────────────────────────────────────
export function CTABanner({ title, subtitle, btnLabel, btnHref, light }: {
  title:     string
  subtitle?: string
  btnLabel:  string
  btnHref:   string
  light?:    boolean
}) {
  const bg  = light ? C.lightBluePale : C.navy
  const clr = light ? C.navy          : '#fff'
  const sub = light ? C.muted         : 'rgba(255,255,255,0.70)'
  return (
    <div style={{ background: bg, padding: SECTION_PAD, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <Image src="/assets/logo-principal.png" alt="" width={320} height={320}
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          opacity: 0.04, filter: light ? 'none' : 'brightness(10)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 600, margin: '0 auto' }}>
        <h3 style={{
          color: clr, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
          fontSize: 'clamp(26px,3.5vw,42px)', textTransform: 'uppercase',
          margin: '0 0 10px', letterSpacing: 0.5,
        }}>{title}</h3>
        {subtitle && <p style={{ color: sub, fontSize: 15.5, margin: '0 0 26px', lineHeight: 1.65 }}>{subtitle}</p>}
        <a href={btnHref} style={{
          display: 'inline-flex', background: C.red, color: '#fff', padding: '14px 32px',
          borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15.5,
          textDecoration: 'none',
        }}>{btnLabel}</a>
      </div>
    </div>
  )
}

// ── StatBlock ─────────────────────────────────────────────────────────────────
export function StatBlock({ number, label, dark }: { number: string; label: string; dark?: boolean }) {
  return (
    <div style={{ textAlign: 'center', padding: '22px 20px' }}>
      <div style={{
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
        fontSize: 'clamp(36px,4.5vw,56px)', color: dark ? C.lightBlue : C.red,
        lineHeight: 1, letterSpacing: -0.5,
      }}>{number}</div>
      <div style={{
        color: dark ? 'rgba(255,255,255,0.55)' : C.muted,
        fontSize: 11.5, fontWeight: 600, letterSpacing: 1.8,
        textTransform: 'uppercase', marginTop: 7, fontFamily: "'Barlow',sans-serif",
      }}>{label}</div>
    </div>
  )
}

// ── ContentCard ───────────────────────────────────────────────────────────────
export function ContentCard({ badge, badgeColor, title, excerpt, meta, href, imageUrl }: {
  badge?:      string
  badgeColor?: string
  title:       string
  excerpt?:    string
  meta?:       string
  href?:       string
  imageUrl?:   string | null
}) {
  const [hov, setHov] = useState(false)
  const Tag = href ? 'a' : 'div'
  return (
    <Tag href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', background: '#fff', borderRadius: R.card, overflow: 'hidden',
        boxShadow: hov ? SH.cardHover : SH.card,
        transition: 'all 0.25s', transform: hov ? 'translateY(-4px)' : 'none',
        cursor: href ? 'pointer' : 'default', textDecoration: 'none',
      }}>
      <div style={{
        height: 186, background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <Image src="/assets/mascotte.png" alt="" width={160} height={160}
            style={{ height: '86%', width: 'auto', opacity: 0.20, objectFit: 'contain', pointerEvents: 'none' }} />
        )}
        {badge && (
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <Badge bg={badgeColor || C.red}>{badge}</Badge>
          </div>
        )}
      </div>
      <div style={{ padding: '20px 22px 24px' }}>
        {meta && <div style={{ color: C.muted, fontSize: 12.5, marginBottom: 7 }}>{meta}</div>}
        <h3 style={{
          color: C.navy, fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 700, fontSize: 20, margin: '0 0 8px', letterSpacing: 0.2, lineHeight: 1.2,
        }}>{title}</h3>
        {excerpt && <p style={{ color: C.muted, fontSize: 13.5, margin: 0, lineHeight: 1.65 }}>{excerpt}</p>}
      </div>
    </Tag>
  )
}

// ── MatchCard ─────────────────────────────────────────────────────────────────
export function MatchCard({ date, day, time, home, away, competition, location }: {
  date:        string
  day:         string
  time:        string
  home:        string
  away:        string
  competition: string
  location?:   string
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: R.card, padding: '18px 22px',
      boxShadow: SH.card, display: 'flex', gap: 18, alignItems: 'center',
    }}>
      <div style={{
        background: C.navy, borderRadius: R.inner,
        padding: '10px 13px', textAlign: 'center', minWidth: 56, flexShrink: 0,
      }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, color: '#fff', lineHeight: 1 }}>{date}</div>
        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 10, color: C.lightBlue, letterSpacing: 1, marginTop: 2 }}>{day}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <Badge>{competition}</Badge>
          {time && <span style={{ color: C.muted, fontSize: 12 }}>{time}</span>}
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 19, color: C.navy, marginBottom: 4 }}>
          {home} <span style={{ color: C.muted, fontWeight: 400 }}>–</span> {away}
        </div>
        {location && <div style={{ color: C.muted, fontSize: 12.5 }}>📍 {location}</div>}
      </div>
      <div style={{
        flexShrink: 0, background: C.lightBluePale, color: C.navy,
        padding: '6px 12px', borderRadius: R.inner,
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15,
      }}>{time}</div>
    </div>
  )
}
