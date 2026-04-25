'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Le Club',     href: '/club'        },
  { label: 'Équipes',     href: '/equipes'     },
  { label: 'Inscription', href: '/inscription' },
  { label: 'Calendrier',  href: '/calendrier'  },
  { label: 'Classement',  href: '/classement'  },
  { label: 'Boutique',    href: '/boutique'    },
  { label: 'Contact',     href: '/contact'     },
]

export default function NavBar({ currentPath }: { currentPath?: string }) {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [currentPath])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(13,33,80,0.97)' : '#0D2150',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.22)' : 'none',
      transition: 'background 0.3s, box-shadow 0.3s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', height: 72, gap: 28 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
          <Image src="/assets/logo-principal.png" alt="Lyon Roller Hockey" width={48} height={48} style={{ objectFit: 'contain' }} />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 1.5 }}>LYON</div>
            <div style={{ color: '#A8D6E8', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: 2.5 }}>ROLLER HOCKEY</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <NavLink key={href} href={href} active={currentPath === href}>{label}</NavLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link href="/inscription" className="nav-cta-desk" style={{
          flexShrink: 0, background: '#D42B2B', color: '#fff',
          padding: '9px 20px', borderRadius: 8,
          fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13.5,
          textDecoration: 'none', letterSpacing: 0.3, whiteSpace: 'nowrap',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B52323')}
          onMouseLeave={e => (e.currentTarget.style.background = '#D42B2B')}
        >
          S&apos;inscrire
        </Link>

        {/* Hamburger */}
        <button className="nav-ham" onClick={() => setOpen(!open)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 6, flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: '#0D2150', borderTop: '1px solid rgba(168,214,232,0.15)', padding: '12px 20px 20px' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: currentPath === href ? '#D42B2B' : 'transparent',
                color: '#fff', padding: '11px 14px', borderRadius: 6, marginBottom: 3,
                fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 15,
                textDecoration: 'none',
              }}>
              {label}
            </Link>
          ))}
          <Link href="/inscription" onClick={() => setOpen(false)}
            style={{
              display: 'block', width: '100%', marginTop: 8, textAlign: 'center',
              background: '#D42B2B', color: '#fff', padding: '12px 14px', borderRadius: 8,
              fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
            }}>
            S&apos;inscrire
          </Link>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: active ? '#D42B2B' : hov ? 'rgba(255,255,255,0.09)' : 'transparent',
        color: '#fff', padding: '8px 13px', borderRadius: 6,
        fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5,
        textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.18s',
        opacity: active || hov ? 1 : 0.8,
      }}>
      {children}
    </Link>
  )
}
