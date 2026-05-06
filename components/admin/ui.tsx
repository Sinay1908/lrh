'use client'

import { useState, ReactNode, ReactElement } from 'react'

export const A = {
  navy:    '#0D2150',
  navyD:   '#091838',
  navyL:   '#162B65',
  red:     '#D42B2B',
  redL:    '#FEF2F2',
  blue:    '#2563EB',
  blueL:   '#EFF6FF',
  green:   '#16A34A',
  greenL:  '#F0FDF4',
  amber:   '#D97706',
  amberL:  '#FFFBEB',
  purple:  '#7C3AED',
  purpleL: '#F5F3FF',
  muted:   '#64748B',
  border:  '#E2E8F0',
  bg:      '#F4F6F9',
  white:   '#FFFFFF',
  textPri: '#0D2150',
  textSec: '#475569',
  r4:  4,  r6:  6,  r8:  8,  r10: 10,  r12: 12,
  card:    '0 1px 4px rgba(0,0,0,0.07)',
  cardHov: '0 4px 16px rgba(13,33,80,0.13)',
  modal:   '0 16px 48px rgba(0,0,0,0.22)',
}

export function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.75 }: {
  name: string; size?: number; color?: string; strokeWidth?: number
}) {
  const s: React.CSSProperties = { width: size, height: size, display: 'block', flexShrink: 0 }
  const p = { fill: 'none' as const, stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const icons: Record<string, ReactElement> = {
    dashboard:     <svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    news:          <svg style={s} viewBox="0 0 24 24" {...p}><path d="M4 6h16M4 10h16M4 14h10M4 18h6"/><rect x="2" y="3" width="20" height="18" rx="2"/></svg>,
    teams:         <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"/></svg>,
    matches:       <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    registrations: <svg style={s} viewBox="0 0 24 24" {...p}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    sponsors:      <svg style={s} viewBox="0 0 24 24" {...p}><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    settings:      <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    messages:      <svg style={s} viewBox="0 0 24 24" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    logout:        <svg style={s} viewBox="0 0 24 24" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus:          <svg style={s} viewBox="0 0 24 24" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit:          <svg style={s} viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:         <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    eye:           <svg style={s} viewBox="0 0 24 24" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    check:         <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    x:             <svg style={s} viewBox="0 0 24 24" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    search:        <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    filter:        <svg style={s} viewBox="0 0 24 24" {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    upload:        <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    archive:       <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
    mail:          <svg style={s} viewBox="0 0 24 24" {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    chevronR:      <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    drag:          <svg style={s} viewBox="0 0 24 24" {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    link:          <svg style={s} viewBox="0 0 24 24" {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    image:         <svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    star:          <svg style={s} viewBox="0 0 24 24" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    bell:          <svg style={s} viewBox="0 0 24 24" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    arrowDown:     <svg style={s} viewBox="0 0 24 24" {...p}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    arrowUp:       <svg style={s} viewBox="0 0 24 24" {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    heart:         <svg style={s} viewBox="0 0 24 24" {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  }
  return icons[name] ?? null
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    published: { label: 'Publié',     bg: A.greenL,  color: A.green,  dot: A.green  },
    draft:     { label: 'Brouillon',  bg: '#F1F5F9', color: A.muted,  dot: A.muted  },
    pending:   { label: 'En attente', bg: A.amberL,  color: A.amber,  dot: A.amber  },
    approved:  { label: 'Approuvé',  bg: A.greenL,  color: A.green,  dot: A.green  },
    rejected:  { label: 'Refusé',    bg: A.redL,    color: A.red,    dot: A.red    },
    archived:  { label: 'Archivé',   bg: '#F1F5F9', color: A.muted,  dot: A.muted  },
    unread:    { label: 'Non lu',    bg: A.blueL,   color: A.blue,   dot: A.blue   },
    read:      { label: 'Lu',        bg: '#F1F5F9', color: A.muted,  dot: A.muted  },
    upcoming:  { label: 'À venir',   bg: A.blueL,   color: A.blue,   dot: A.blue   },
    result:    { label: 'Résultat',  bg: '#F1F5F9', color: A.muted,  dot: A.muted  },
    win:       { label: 'Victoire',  bg: A.greenL,  color: A.green,  dot: A.green  },
    loss:      { label: 'Défaite',   bg: A.redL,    color: A.red,    dot: A.red    },
    draw:      { label: 'Nul',       bg: A.amberL,  color: A.amber,  dot: A.amber  },
    active:    { label: 'Actif',     bg: A.greenL,  color: A.green,  dot: A.green  },
    inactive:  { label: 'Inactif',   bg: '#F1F5F9', color: A.muted,  dot: A.muted  },
  }
  const s = map[status] ?? { label: status, bg: '#F1F5F9', color: A.muted, dot: A.muted }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color, padding: '3px 9px', borderRadius: 99,
      fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 11.5,
      whiteSpace: 'nowrap', letterSpacing: 0.2 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

export function ABtn({ children, icon, variant = 'primary', size = 'md', onClick, disabled, fullWidth, type = 'button' }: {
  children?: ReactNode; icon?: string; variant?: string; size?: string
  onClick?: () => void; disabled?: boolean; fullWidth?: boolean; type?: 'button' | 'submit'
}) {
  const [hov, setHov] = useState(false)
  const variants: Record<string, { bg: string; clr: string; brd: string }> = {
    primary:  { bg: hov ? '#B52323' : A.red,    clr: '#fff',          brd: 'none' },
    secondary:{ bg: hov ? '#E2E8F0' : '#F1F5F9', clr: A.textPri,     brd: 'none' },
    navy:     { bg: hov ? A.navyL   : A.navy,   clr: '#fff',          brd: 'none' },
    ghost:    { bg: hov ? '#F1F5F9' : 'transparent', clr: A.muted,    brd: `1px solid ${A.border}` },
    danger:   { bg: hov ? '#991B1B' : A.red,    clr: '#fff',          brd: 'none' },
    success:  { bg: hov ? '#15803D' : A.green,  clr: '#fff',          brd: 'none' },
    link:     { bg: 'transparent', clr: hov ? A.blue : A.muted,       brd: 'none' },
  }
  const v = variants[variant] ?? variants.primary
  const pad = size === 'sm' ? '6px 12px' : size === 'lg' ? '11px 24px' : '8px 16px'
  const fs  = size === 'sm' ? 12.5 : size === 'lg' ? 15 : 13.5
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
        background: v.bg, color: v.clr, border: v.brd,
        padding: pad, borderRadius: A.r8, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: fs,
        transition: 'all 0.15s', whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1, width: fullWidth ? '100%' : 'auto',
        justifyContent: fullWidth ? 'center' : 'flex-start' }}>
      {icon && <Icon name={icon} size={fs} color={v.clr} />}
      {children}
    </button>
  )
}

export function IconBtn({ icon, onClick, title, color = A.muted, bg, danger }: {
  icon: string; onClick?: () => void; title?: string; color?: string; bg?: string; danger?: boolean
}) {
  const [hov, setHov] = useState(false)
  const hoverBg    = danger ? A.redL    : '#F1F5F9'
  const hoverColor = danger ? A.red     : A.blue
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, border: 'none', borderRadius: A.r6,
        background: hov ? hoverBg : bg || 'transparent',
        color: hov ? hoverColor : color,
        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
      <Icon name={icon} size={14} color="currentColor" />
    </button>
  )
}

export function AInput({ label, value, onChange, type = 'text', placeholder, required, rows, icon, name }: {
  label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string; placeholder?: string; required?: boolean; rows?: number; icon?: string; name?: string
}) {
  const [focus, setFocus] = useState(false)
  const base: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: icon ? '8px 12px 8px 36px' : '8px 12px',
    border: `1.5px solid ${focus ? A.navy : A.border}`,
    borderRadius: A.r8, fontFamily: "'Barlow',sans-serif",
    fontSize: 13.5, color: A.textPri, background: A.white,
    outline: 'none', transition: 'border-color 0.15s',
  }
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontFamily: "'Barlow',sans-serif",
        fontWeight: 600, fontSize: 12, color: A.textSec, marginBottom: 5, letterSpacing: 0.3 }}>
        {label}{required && <span style={{ color: A.red }}> *</span>}
      </label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: A.muted, pointerEvents: 'none' }}><Icon name={icon} size={14} /></span>}
        {rows
          ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder}
              rows={rows} required={required}
              onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
              style={{ ...base, resize: 'vertical' }} />
          : <input name={name} type={type} value={value} onChange={onChange}
              placeholder={placeholder} required={required}
              onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
              style={base} />
        }
      </div>
    </div>
  )
}

export function ASelect({ label, value, onChange, options, required }: {
  label?: string; value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]; required?: boolean
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontFamily: "'Barlow',sans-serif",
        fontWeight: 600, fontSize: 12, color: A.textSec, marginBottom: 5 }}>
        {label}{required && <span style={{ color: A.red }}> *</span>}
      </label>}
      <select value={value} onChange={onChange} required={required}
        style={{ width: '100%', padding: '8px 12px', border: `1.5px solid ${A.border}`,
          borderRadius: A.r8, fontFamily: "'Barlow',sans-serif", fontSize: 13.5,
          color: A.textPri, background: A.white, outline: 'none',
          boxSizing: 'border-box', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function ACard({ children, style: extra, noPad, onClick, onMouseEnter, onMouseLeave }: {
  children: ReactNode; style?: React.CSSProperties; noPad?: boolean
  onClick?: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void
}) {
  return (
    <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      style={{ background: A.white, borderRadius: A.r12, border: `1px solid ${A.border}`,
        boxShadow: A.card, padding: noPad ? 0 : '20px 22px',
        overflow: noPad ? 'hidden' : undefined, ...extra }}>
      {children}
    </div>
  )
}

export function MetricCard({ label, value, icon, color, trend, trendLabel }: {
  label: string; value: number | string; icon: string; color: string; trend?: number; trendLabel?: string
}) {
  const bg: Record<string, { light: string; icon: string }> = {
    red:    { light: A.redL,    icon: A.red    },
    blue:   { light: A.blueL,  icon: A.blue   },
    green:  { light: A.greenL, icon: A.green  },
    amber:  { light: A.amberL, icon: A.amber  },
    purple: { light: A.purpleL,icon: A.purple },
    navy:   { light: '#E8EDF5',icon: A.navy   },
  }
  const c = bg[color] ?? { light: '#F1F5F9', icon: A.muted }
  return (
    <ACard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 500,
            fontSize: 12.5, color: A.muted, marginBottom: 6, letterSpacing: 0.3 }}>{label}</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
            fontSize: 32, color: A.textPri, lineHeight: 1 }}>{value}</div>
          {trend !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8,
              color: trend >= 0 ? A.green : A.red, fontSize: 12, fontWeight: 600 }}>
              <Icon name={trend >= 0 ? 'arrowUp' : 'arrowDown'} size={12} color="currentColor" />
              {Math.abs(trend)}% {trendLabel || 'ce mois'}
            </div>
          )}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: A.r10,
          background: c.light, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={18} color={c.icon} />
        </div>
      </div>
    </ACard>
  )
}

export interface Col {
  label: string; key: string; right?: boolean; wrap?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => ReactNode
}

function TableRowItem({ row, cols, i }: { row: Record<string, unknown>; cols: Col[]; i: number }) {
  const [hov, setHov] = useState(false)
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? '#FAFBFC' : A.white,
        borderBottom: `1px solid ${A.border}`, transition: 'background 0.12s' }}>
      {cols.map((c, j) => (
        <td key={j} style={{ padding: '11px 14px', fontSize: 13.5,
          color: j === 0 ? A.textPri : A.textSec,
          fontWeight: j === 0 ? 500 : 400,
          textAlign: c.right ? 'right' : 'left',
          whiteSpace: c.wrap ? 'normal' : 'nowrap' }}>
          {c.render ? c.render(row) : String(row[c.key] ?? '')}
        </td>
      ))}
    </tr>
  )
}

export function ATable({ cols, rows, emptyMsg = 'Aucune donnée' }: {
  cols: Col[]; rows: Record<string, unknown>[]; emptyMsg?: string
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Barlow',sans-serif" }}>
        <thead>
          <tr style={{ background: A.bg }}>
            {cols.map((c, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: c.right ? 'right' : 'left',
                fontWeight: 600, fontSize: 11.5, color: A.muted, letterSpacing: 0.8,
                textTransform: 'uppercase', borderBottom: `1px solid ${A.border}`,
                whiteSpace: 'nowrap' }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} style={{ padding: '32px 14px', textAlign: 'center',
                color: A.muted, fontSize: 14 }}>{emptyMsg}</td></tr>
            : rows.map((row, i) => <TableRowItem key={i} row={row} cols={cols} i={i} />)
          }
        </tbody>
      </table>
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Rechercher...' }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div style={{ position: 'relative', minWidth: 220 }}>
      <span style={{ position: 'absolute', left: 10, top: '50%',
        transform: 'translateY(-50%)', color: A.muted, pointerEvents: 'none' }}>
        <Icon name="search" size={14} />
      </span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px 8px 32px',
          border: `1.5px solid ${A.border}`, borderRadius: A.r8,
          fontFamily: "'Barlow',sans-serif", fontSize: 13.5, color: A.textPri,
          background: A.white, outline: 'none' }} />
    </div>
  )
}

export function PageHeader({ title, subtitle, action, actionIcon, onAction, breadcrumb }: {
  title: string; subtitle?: string; action?: string; actionIcon?: string
  onAction?: () => void; breadcrumb?: string
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 6, color: A.muted, fontSize: 12.5 }}>
          <span>Administration</span>
          <Icon name="chevronR" size={12} />
          <span style={{ color: A.textPri, fontWeight: 500 }}>{breadcrumb}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
            fontSize: 26, color: A.textPri, margin: 0, letterSpacing: 0.2 }}>{title}</h1>
          {subtitle && <p style={{ color: A.muted, fontSize: 13.5, margin: '4px 0 0', lineHeight: 1.5 }}>{subtitle}</p>}
        </div>
        {action && <ABtn icon={actionIcon || 'plus'} onClick={onAction}>{action}</ABtn>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 520 }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number
}) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(9,24,56,0.5)', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: A.white, borderRadius: A.r12, width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: A.modal }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 22px', borderBottom: `1px solid ${A.border}` }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
            fontSize: 18, color: A.textPri }}>{title}</div>
          <IconBtn icon="x" onClick={onClose} />
        </div>
        <div style={{ padding: '20px 22px' }}>{children}</div>
      </div>
    </div>
  )
}

export function ImageUpload({ label, hint }: { label?: string; hint?: string }) {
  const [drag, setDrag] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontFamily: "'Barlow',sans-serif",
        fontWeight: 600, fontSize: 12, color: A.textSec, marginBottom: 5 }}>{label}</label>}
      <div onDragEnter={() => setDrag(true)} onDragLeave={() => setDrag(false)}
        style={{ border: `2px dashed ${drag ? A.navy : A.border}`,
          borderRadius: A.r10, padding: '28px 20px', textAlign: 'center',
          background: drag ? '#EDF2FF' : A.bg, transition: 'all 0.15s', cursor: 'pointer' }}>
        <div style={{ color: A.muted, marginBottom: 8 }}><Icon name="upload" size={22} color={A.muted} /></div>
        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600,
          fontSize: 13, color: A.textPri, marginBottom: 4 }}>
          Glissez une image ou <span style={{ color: A.blue }}>parcourez</span>
        </div>
        {hint && <div style={{ color: A.muted, fontSize: 11.5 }}>{hint}</div>}
      </div>
    </div>
  )
}

export function Divider({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: A.border }} />
      {label && <span style={{ color: A.muted, fontSize: 11.5, fontWeight: 600,
        letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: A.border }} />
    </div>
  )
}
