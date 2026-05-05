'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { A, Icon } from './ui'

const NAV_ITEMS: { id: string; label: string; icon: string; href: string; badge?: string | number }[] = [
  { id: 'dashboard',     label: 'Tableau de bord',   icon: 'dashboard',     href: '/admin' },
  { id: 'news',          label: 'Actualités',         icon: 'news',          href: '/admin/actualites' },
  { id: 'teams',         label: 'Équipes',            icon: 'teams',         href: '/admin/equipes' },
  { id: 'matches',       label: 'Matchs & Résultats', icon: 'matches',       href: '/admin/matchs' },
  { id: 'classement',    label: 'Classement',         icon: 'star',          href: '/admin/classement' },
  { id: 'boutique',      label: 'Boutique',           icon: 'sponsors',      href: '/admin/boutique' },
  { id: 'staff',         label: 'Staff technique',    icon: 'teams',         href: '/admin/staff' },
  { id: 'tarifs',        label: 'Tarifs',             icon: 'settings',      href: '/admin/tarifs' },
  { id: 'palmares',      label: 'Palmarès',           icon: 'star',          href: '/admin/palmares' },
  { id: 'registrations', label: 'Inscriptions',       icon: 'registrations', href: '/admin/inscriptions' },
  { id: 'sponsors',      label: 'Partenaires',        icon: 'sponsors',      href: '/admin/partenaires' },
  { id: 'messages',      label: 'Messages',           icon: 'messages',      href: '/admin/messages' },
  { id: 'settings',      label: 'Paramètres',         icon: 'settings',      href: '/admin/parametres' },
  { id: 'administration', label: 'Administration',      icon: 'settings',      href: '/admin/administration' },
]

function SidebarItem({ item, active }: { item: typeof NAV_ITEMS[0]; active: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={item.href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        background: active ? 'rgba(212,43,43,0.18)' : hov ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: active ? '1px solid rgba(212,43,43,0.3)' : '1px solid transparent',
        borderRadius: A.r8, padding: '9px 12px', marginBottom: 2,
        cursor: 'pointer', transition: 'all 0.15s', textDecoration: 'none' }}>
      <span style={{ color: active ? '#A8D6E8' : hov ? '#fff' : 'rgba(255,255,255,0.55)', transition: 'color 0.15s' }}>
        <Icon name={item.icon} size={15} color="currentColor" />
      </span>
      <span style={{ flex: 1, color: active ? '#fff' : hov ? '#fff' : 'rgba(255,255,255,0.65)',
        fontFamily: "'Barlow',sans-serif", fontWeight: active ? 600 : 500,
        fontSize: 13.5, transition: 'color 0.15s', whiteSpace: 'nowrap' }}>
        {item.label}
      </span>
      {item.badge && (
        <span style={{ background: A.red, color: '#fff', borderRadius: 99,
          minWidth: 18, height: 18, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 10, fontWeight: 700, padding: '0 5px' }}>
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function Sidebar({ pathname }: { pathname: string }) {
  const activeId = NAV_ITEMS.find(n =>
    n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)
  )?.id ?? 'dashboard'

  return (
    <aside style={{ width: 240, flexShrink: 0, background: A.navy, height: '100vh',
      position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column',
      zIndex: 100, overflowY: 'auto' }}>
      <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/assets/logo-secondaire.png" alt="LRH" width={36} height={36}
            style={{ objectFit: 'contain', filter: 'brightness(10)', opacity: 0.9 }} />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 800, fontSize: 14, letterSpacing: 1.2 }}>LYON RH</div>
            <div style={{ color: 'rgba(168,214,232,0.7)', fontFamily: "'Barlow',sans-serif",
              fontWeight: 500, fontSize: 10, letterSpacing: 1 }}>Administration</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV_ITEMS.map(item => (
          <SidebarItem key={item.id} item={item} active={activeId === item.id} />
        ))}
      </nav>

      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(168,214,232,0.15)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700, fontSize: 13, color: '#A8D6E8', flexShrink: 0 }}>AD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 12.5,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin LRH</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>admin@lyonrh.fr</div>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 12px', borderRadius: A.r8, color: 'rgba(255,255,255,0.5)',
            fontFamily: "'Barlow',sans-serif", fontWeight: 500, fontSize: 12.5,
            transition: 'all 0.15s' }}>
          <Icon name="logout" size={14} color="currentColor" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

function TopBar({ title, pathname }: { title: string; pathname: string }) {
  const pageTitle = NAV_ITEMS.find(n =>
    n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)
  )?.label ?? title
  return (
    <div style={{ height: 60, background: A.white, borderBottom: `1px solid ${A.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14.5,
        color: A.textPri }}>{pageTitle}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" target="_blank"
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: A.muted,
            textDecoration: 'none', fontFamily: "'Barlow',sans-serif",
            fontSize: 12.5, fontWeight: 500 }}>
          <Icon name="eye" size={13} />
          Voir le site
        </Link>
        <div style={{ width: 34, height: 34, borderRadius: '50%',
          background: A.navy, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 700, fontSize: 13, color: '#A8D6E8', cursor: 'pointer' }}>AD</div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: A.bg }}>
      <Sidebar pathname={pathname} />
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        <TopBar title="Administration" pathname={pathname} />
        <main style={{ flex: 1, padding: '28px 28px 40px' }}>{children}</main>
      </div>
    </div>
  )
}
