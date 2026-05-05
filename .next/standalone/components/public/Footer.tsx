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

// Valeurs par défaut si la DB ne répond pas encore
const DEFAULTS = {
  description: "Club de roller hockey lyonnais fondé en 1974. Passion, sport et esprit d'équipe depuis plus de 50 ans.",
  facebook:    '',
  instagram:   '',
  twitter:     '',
  address:     'Gymnase du Vieux-Lyon',
  street:      '12 rue de la Patinoire',
  city:        '69005 Lyon',
  phone:       '04 72 00 00 00',
  email:       'contact@lyonrollerhockey.fr',
  schedule:    'Mar & Jeu 18h – 21h · Sam 9h – 12h',
}

// Icône SVG pour les réseaux sociaux
function SocialIcon({ type }: { type: 'fb' | 'ig' | 'x' }) {
  const icons: Record<string, React.ReactNode> = {
    fb: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    ig: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    x:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  }
  return <>{icons[type]}</>
}

export default function Footer() {
  const [params, setParams] = useState(DEFAULTS)

  useEffect(() => {
    fetch('/api/parametres')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        setParams(prev => ({
          description: d['footer.description'] || prev.description,
          facebook:    d['footer.facebook']    ?? prev.facebook,
          instagram:   d['footer.instagram']   ?? prev.instagram,
          twitter:     d['footer.twitter']     ?? prev.twitter,
          address:     d['contact.address']    || prev.address,
          street:      d['contact.street']     || prev.street,
          city:        d['contact.city']       || prev.city,
          phone:       d['contact.phone']      || prev.phone,
          email:       d['contact.email']      || prev.email,
          schedule:    d['contact.schedule']   || prev.schedule,
        }))
      })
      .catch(() => {})
  }, [])

  const socials: { key: 'fb' | 'ig' | 'x'; url: string; label: string }[] = [
    { key: 'fb', url: params.facebook,  label: 'Facebook'  },
    { key: 'ig', url: params.instagram, label: 'Instagram' },
    { key: 'x',  url: params.twitter,   label: 'X/Twitter' },
  ]

  return (
    <footer style={{ background: '#0D2150', color: '#fff', padding: '64px 28px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 44, marginBottom: 52 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Image src="/assets/logo-principal.png" alt="Lyon Roller Hockey" width={52} height={52} style={{ objectFit: 'contain' }} />
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 1.5 }}>LYON ROLLER</div>
                <div style={{ color: '#A8D6E8', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: 2.5 }}>HOCKEY</div>
              </div>
            </div>
            {/* Description dynamique */}
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13.5, lineHeight: 1.75, margin: '0 0 20px' }}>
              {params.description}
            </p>
            {/* Réseaux sociaux — liens dynamiques */}
            <div style={{ display: 'flex', gap: 8 }}>
              {socials.map(({ key, url, label }) =>
                url ? (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" title={label}
                    style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#A8D6E8', cursor: 'pointer', textDecoration: 'none',
                      transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                    <SocialIcon type={key} />
                  </a>
                ) : (
                  // Afficher quand même l'icône mais grisée si pas de lien configuré
                  <div key={key} title={`${label} (non configuré)`}
                    style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(168,214,232,0.3)', cursor: 'default' }}>
                    <SocialIcon type={key} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <FooterHeading>Navigation</FooterHeading>
            {NAV_LINKS.map(({ label, href }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </div>

          {/* Contact — dynamique */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: 13.5, lineHeight: 1.75 }}>
              {params.address}<br />
              {params.street}, {params.city}<br />
              <br />
              {params.phone}<br />
              {params.email}
            </p>
          </div>

          {/* Horaires secrétariat */}
          <div>
            <FooterHeading>Secrétariat</FooterHeading>
            <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: 13.5, lineHeight: 1.9 }}>
              {params.schedule}
            </p>
          </div>
        </div>

        <div className="footer-bottom" style={{
          borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 22,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 10,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12.5 }}>
            © {new Date().getFullYear()} Lyon Roller Hockey — Tous droits réservés
          </span>
          <div className="footer-legal" style={{ display: 'flex', gap: 18 }}>
            {['Mentions légales', 'CGU', 'Confidentialité'].map(l => (
              <span key={l} style={{ color: 'rgba(255,255,255,0.32)', fontSize: 12, cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      color: '#A8D6E8', fontFamily: "'Barlow Condensed',sans-serif",
      fontWeight: 700, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 14,
    }}>{children}</div>
  )
}

function FooterLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link href={href} style={{
      display: 'block', color: 'rgba(255,255,255,0.50)', fontSize: 13.5,
      marginBottom: 8, textDecoration: 'none', transition: 'color 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.50)' }}
    >
      {children}
    </Link>
  )
}
