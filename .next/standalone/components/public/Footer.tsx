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

export default function Footer() {
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
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13.5, lineHeight: 1.75, margin: '0 0 20px' }}>
              Club de roller hockey lyonnais fondé en 1974. Passion, sport et esprit d&apos;équipe depuis plus de 50 ans.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['fb', 'Facebook'], ['ig', 'Instagram'], ['x', 'X/Twitter']].map(([s, t]) => (
                <div key={s} title={t} style={{
                  width: 34, height: 34, borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#A8D6E8', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}>
                  {s[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <FooterHeading>Navigation</FooterHeading>
            {NAV_LINKS.map(({ label, href }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: 13.5, lineHeight: 1.75 }}>
              Gymnase du Vieux-Lyon<br />
              12 rue de la Patinoire, 69005 Lyon<br />
              <br />
              04 72 00 00 00<br />
              contact@lyonrollerhockey.fr
            </p>
          </div>

          {/* Horaires */}
          <div>
            <FooterHeading>Entraînements</FooterHeading>
            {[['Mardi', '19h – 21h'], ['Jeudi', '19h – 21h'], ['Samedi', '10h – 12h'], ['Vendredi', '20h – 22h (loisir)']].map(([j, h]) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9, fontSize: 13.5 }}>
                <span style={{ color: '#A8D6E8', fontWeight: 600 }}>{j}</span>
                <span style={{ color: 'rgba(255,255,255,0.50)' }}>{h}</span>
              </div>
            ))}
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
