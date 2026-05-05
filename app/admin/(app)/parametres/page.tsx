'use client'

import { useState, useEffect, useCallback } from 'react'
import { A, ABtn, ACard, AInput, Divider, Icon, ImageUpload, PageHeader } from '@/components/admin/ui'

const SECTIONS = [
  { id: 'hero',    label: "Hero / Accueil",       icon: 'star'     },
  { id: 'contact', label: 'Informations contact',  icon: 'mail'     },
  { id: 'footer',  label: 'Pied de page',          icon: 'settings' },
  { id: 'seo',     label: 'SEO & Métadonnées',     icon: 'search'   },
]

const DEFAULTS = {
  'hero.badge':        'Saison 2024–2025',
  'hero.title':        'La Passion du Roller Hockey',
  'hero.subtitle':     "Depuis 1974, les Aigles de Lyon défendent les couleurs du roller hockey français avec passion et ambition.",
  'hero.ctaPrimary':   'Nous rejoindre',
  'hero.ctaSecondary': 'Découvrir le club',
  'contact.address':   'Gymnase du Vieux-Lyon',
  'contact.street':    '12 rue de la Patinoire',
  'contact.city':      '69005 Lyon',
  'contact.phone':     '04 72 00 00 00',
  'contact.email':     'contact@lyonrollerhockey.fr',
  'contact.schedule':  'Mar & Jeu 18h – 21h · Sam 9h – 12h',
  'footer.description': "Club de roller hockey lyonnais fondé en 1974. Passion, sport et esprit d'équipe depuis plus de 50 ans.",
  'footer.facebook':   'https://facebook.com/lyonrollerhockey',
  'footer.instagram':  'https://instagram.com/lyonrollerhockey',
  'footer.twitter':    '',
  'seo.title':         'Lyon Roller Hockey — Les Aigles de Lyon',
  'seo.description':   "Club de roller hockey de Lyon fondé en 1974. Équipes de Nationale 1 à la catégorie Loisir. Inscriptions ouvertes.",
}

type ParamKey = keyof typeof DEFAULTS

export default function ParametresPage() {
  const [section, setSection] = useState('hero')
  const [values, setValues]   = useState<Record<string, string>>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const load = useCallback(() => {
    fetch('/api/parametres')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        setValues(prev => ({ ...prev, ...d }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const set = (key: ParamKey, val: string) => setValues(prev => ({ ...prev, [key]: val }))
  const get = (key: ParamKey) => values[key] ?? ''

  const handleSave = async () => {
    setSaving(true)
    try {
      const body: Record<string, { valeur: string; section: string }> = {}
      Object.entries(values).forEach(([cle, valeur]) => {
        const sec = cle.split('.')[0]
        body[cle] = { valeur, section: sec }
      })
      await fetch('/api/parametres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Paramètres du site" subtitle="Modifiez les contenus éditoriaux et les informations du site" breadcrumb="Paramètres" />
        <div style={{ textAlign: 'center', padding: '60px 0', color: A.muted }}>Chargement…</div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Paramètres du site" subtitle="Modifiez les contenus éditoriaux et les informations du site" breadcrumb="Paramètres" />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'flex-start' }}>
        <ACard style={{ padding: 8 }}>
          {SECTIONS.map(s => {
            const active = section === s.id
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: A.r8, border: 'none', background: active ? '#EDF4FF' : 'transparent', color: active ? A.blue : A.textSec, fontFamily: "'Barlow',sans-serif", fontWeight: active ? 600 : 500, fontSize: 13.5, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', marginBottom: 2 }}>
                <Icon name={s.icon} size={15} color={active ? A.blue : A.muted} />
                {s.label}
              </button>
            )
          })}
        </ACard>

        <div>
          {section === 'hero' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>{"Page d'accueil — Hero"}</div>
              <AInput label="Badge / étiquette" value={get('hero.badge')} onChange={e => set('hero.badge', e.target.value)} placeholder="ex. Saison 2024–25" />
              <AInput label="Titre principal" value={get('hero.title')} onChange={e => set('hero.title', e.target.value)} required />
              <AInput label="Sous-titre" value={get('hero.subtitle')} onChange={e => set('hero.subtitle', e.target.value)} rows={3} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <AInput label="Bouton principal (CTA)" value={get('hero.ctaPrimary')} onChange={e => set('hero.ctaPrimary', e.target.value)} />
                <AInput label="Bouton secondaire"      value={get('hero.ctaSecondary')} onChange={e => set('hero.ctaSecondary', e.target.value)} />
              </div>
              <Divider label="Aperçu du hero" />
              <div style={{ background: A.navy, borderRadius: A.r10, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'inline-block', background: '#D42B2B', color: '#fff', padding: '3px 10px', borderRadius: 3, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                  {get('hero.badge') || 'Badge'}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: '#fff', lineHeight: 1.1, marginBottom: 10 }}>
                  {get('hero.title') || 'Titre principal'}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13.5, margin: '0 0 16px', lineHeight: 1.6 }}>{get('hero.subtitle')}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ background: '#D42B2B', color: '#fff', padding: '8px 18px', borderRadius: A.r8, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13 }}>{get('hero.ctaPrimary')}</span>
                  <span style={{ border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', padding: '8px 18px', borderRadius: A.r8, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13 }}>{get('hero.ctaSecondary')}</span>
                </div>
              </div>
            </ACard>
          )}

          {section === 'contact' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>Informations de contact</div>
              <AInput label="Nom du gymnase / lieu"   value={get('contact.address')}  onChange={e => set('contact.address', e.target.value)} />
              <AInput label="Adresse"                 value={get('contact.street')}   onChange={e => set('contact.street', e.target.value)} />
              <AInput label="Ville / code postal"     value={get('contact.city')}     onChange={e => set('contact.city', e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <AInput label="Téléphone" value={get('contact.phone')} onChange={e => set('contact.phone', e.target.value)} />
                <AInput label="Email" type="email" value={get('contact.email')} onChange={e => set('contact.email', e.target.value)} />
              </div>
              <AInput label="Horaires du secrétariat" value={get('contact.schedule')} onChange={e => set('contact.schedule', e.target.value)} />
            </ACard>
          )}

          {section === 'footer' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>Pied de page</div>
              <AInput label="Description du club" value={get('footer.description')} onChange={e => set('footer.description', e.target.value)} rows={3} />
              <Divider label="Réseaux sociaux" />
              <AInput label="Facebook"   icon="link" value={get('footer.facebook')}  onChange={e => set('footer.facebook', e.target.value)}  placeholder="https://facebook.com/..." />
              <AInput label="Instagram"  icon="link" value={get('footer.instagram')} onChange={e => set('footer.instagram', e.target.value)} placeholder="https://instagram.com/..." />
              <AInput label="X / Twitter" icon="link" value={get('footer.twitter')} onChange={e => set('footer.twitter', e.target.value)}   placeholder="https://x.com/..." />
            </ACard>
          )}

          {section === 'seo' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>SEO & Métadonnées</div>
              <AInput label="Titre de l'onglet / SEO" value={get('seo.title')}       onChange={e => set('seo.title', e.target.value)} />
              <AInput label="Description meta"        value={get('seo.description')} onChange={e => set('seo.description', e.target.value)} rows={3} />
              <ImageUpload label="Image OG (partage réseaux sociaux)" hint="1200×630px recommandé" />
              <div style={{ background: A.bg, borderRadius: A.r8, padding: '14px 16px', marginTop: 4 }}>
                <div style={{ fontSize: 12, color: A.muted, marginBottom: 6, fontWeight: 600 }}>Aperçu Google</div>
                <div style={{ color: A.blue, fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{get('seo.title')}</div>
                <div style={{ color: A.green, fontSize: 12, marginBottom: 3 }}>lyonrollerhockey.fr</div>
                <div style={{ color: A.textSec, fontSize: 13, lineHeight: 1.5 }}>{get('seo.description')}</div>
              </div>
            </ACard>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: A.green, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5 }}>
                <Icon name="check" size={15} color={A.green} /> Enregistré !
              </div>
            )}
            <ABtn variant="ghost" onClick={load}>Annuler les modifications</ABtn>
            <ABtn variant="navy" onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </ABtn>
          </div>
        </div>
      </div>
    </div>
  )
}
