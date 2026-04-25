'use client'

import { useState } from 'react'
import { A, ABtn, ACard, AInput, Divider, Icon, ImageUpload, PageHeader } from '@/components/admin/ui'

const SECTIONS = [
  { id: 'hero',    label: "Hero / Accueil",       icon: 'star'     },
  { id: 'contact', label: 'Informations contact',  icon: 'mail'     },
  { id: 'footer',  label: 'Pied de page',          icon: 'settings' },
  { id: 'seo',     label: 'SEO & Métadonnées',     icon: 'search'   },
]

export default function ParametresPage() {
  const [section, setSection] = useState('hero')
  const [saved, setSaved]     = useState(false)

  const [heroData, setHeroData] = useState({
    title: 'La Passion du Roller Hockey',
    subtitle: "Depuis 1974, les Aigles de Lyon défendent les couleurs du roller hockey français avec passion et ambition.",
    ctaPrimary: 'Nous rejoindre', ctaSecondary: 'Découvrir le club', badge: 'Saison 2024–25',
  })
  const [contactData, setContactData] = useState({
    address: 'Gymnase du Vieux-Lyon', street: '12 rue de la Patinoire', city: '69005 Lyon',
    phone: '04 72 00 00 00', email: 'contact@lyonrollerhockey.fr',
    scheduleSecretariat: 'Mar & Jeu 18h – 21h · Sam 9h – 12h',
  })
  const [footerData, setFooterData] = useState({
    description: "Club de roller hockey lyonnais fondé en 1974. Passion, sport et esprit d'équipe depuis plus de 50 ans.",
    facebook: 'https://facebook.com/lyonrollerhockey',
    instagram: 'https://instagram.com/lyonrollerhockey',
    twitter: '',
  })
  const [seoData, setSeoData] = useState({
    siteTitle: 'Lyon Roller Hockey — Les Aigles de Lyon',
    metaDescription: "Club de roller hockey de Lyon fondé en 1974. Équipes de Nationale 1 à la catégorie Loisir. Inscriptions ouvertes.",
  })

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <PageHeader title="Paramètres du site" subtitle="Modifiez les contenus éditoriaux et les informations du site" breadcrumb="Paramètres" />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'flex-start' }}>
        <ACard style={{ padding: 8 }}>
          {SECTIONS.map(s => {
            const active = section === s.id
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: A.r8, border: 'none',
                  background: active ? '#EDF4FF' : 'transparent',
                  color: active ? A.blue : A.textSec,
                  fontFamily: "'Barlow',sans-serif", fontWeight: active ? 600 : 500,
                  fontSize: 13.5, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s', marginBottom: 2 }}>
                <Icon name={s.icon} size={15} color={active ? A.blue : A.muted} />
                {s.label}
              </button>
            )
          })}
        </ACard>

        <div>
          {section === 'hero' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>
                {"Page d'accueil — Hero"}
              </div>
              <ImageUpload label="Image de fond du hero" hint="1920×1080px recommandé · JPG ou PNG" />
              <AInput label="Badge / étiquette" value={heroData.badge} onChange={e => setHeroData({ ...heroData, badge: e.target.value })} placeholder="ex. Saison 2024–25" />
              <AInput label="Titre principal" value={heroData.title} onChange={e => setHeroData({ ...heroData, title: e.target.value })} required />
              <AInput label="Sous-titre" value={heroData.subtitle} onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })} rows={3} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <AInput label="Bouton principal (CTA)" value={heroData.ctaPrimary} onChange={e => setHeroData({ ...heroData, ctaPrimary: e.target.value })} />
                <AInput label="Bouton secondaire"      value={heroData.ctaSecondary} onChange={e => setHeroData({ ...heroData, ctaSecondary: e.target.value })} />
              </div>
              <Divider label="Aperçu du hero" />
              <div style={{ background: A.navy, borderRadius: A.r10, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'inline-block', background: '#D42B2B', color: '#fff',
                  padding: '3px 10px', borderRadius: 3, fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                  {heroData.badge || 'Badge'}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: '#fff', lineHeight: 1.1, marginBottom: 10 }}>
                  {heroData.title || 'Titre principal'}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13.5, margin: '0 0 16px', lineHeight: 1.6 }}>{heroData.subtitle}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ background: '#D42B2B', color: '#fff', padding: '8px 18px', borderRadius: A.r8, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13 }}>{heroData.ctaPrimary}</span>
                  <span style={{ border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', padding: '8px 18px', borderRadius: A.r8, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13 }}>{heroData.ctaSecondary}</span>
                </div>
              </div>
            </ACard>
          )}

          {section === 'contact' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>Informations de contact</div>
              <AInput label="Nom du gymnase / lieu" value={contactData.address} onChange={e => setContactData({ ...contactData, address: e.target.value })} />
              <AInput label="Adresse" value={contactData.street} onChange={e => setContactData({ ...contactData, street: e.target.value })} />
              <AInput label="Ville / code postal" value={contactData.city} onChange={e => setContactData({ ...contactData, city: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <AInput label="Téléphone" value={contactData.phone} onChange={e => setContactData({ ...contactData, phone: e.target.value })} />
                <AInput label="Email" type="email" value={contactData.email} onChange={e => setContactData({ ...contactData, email: e.target.value })} />
              </div>
              <AInput label="Horaires du secrétariat" value={contactData.scheduleSecretariat} onChange={e => setContactData({ ...contactData, scheduleSecretariat: e.target.value })} />
            </ACard>
          )}

          {section === 'footer' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>Pied de page</div>
              <AInput label="Description du club" value={footerData.description} onChange={e => setFooterData({ ...footerData, description: e.target.value })} rows={3} />
              <Divider label="Réseaux sociaux" />
              <AInput label="Facebook" icon="link" value={footerData.facebook}  onChange={e => setFooterData({ ...footerData, facebook: e.target.value })}  placeholder="https://facebook.com/..." />
              <AInput label="Instagram" icon="link" value={footerData.instagram} onChange={e => setFooterData({ ...footerData, instagram: e.target.value })} placeholder="https://instagram.com/..." />
              <AInput label="X / Twitter" icon="link" value={footerData.twitter} onChange={e => setFooterData({ ...footerData, twitter: e.target.value })}   placeholder="https://x.com/..." />
            </ACard>
          )}

          {section === 'seo' && (
            <ACard>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>SEO & Métadonnées</div>
              <AInput label="Titre de l'onglet / SEO" value={seoData.siteTitle} onChange={e => setSeoData({ ...seoData, siteTitle: e.target.value })} />
              <AInput label="Description meta" value={seoData.metaDescription} onChange={e => setSeoData({ ...seoData, metaDescription: e.target.value })} rows={3} />
              <ImageUpload label="Image OG (partage réseaux sociaux)" hint="1200×630px recommandé" />
              <div style={{ background: A.bg, borderRadius: A.r8, padding: '14px 16px', marginTop: 4 }}>
                <div style={{ fontSize: 12, color: A.muted, marginBottom: 6, fontWeight: 600 }}>Aperçu Google</div>
                <div style={{ color: A.blue, fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{seoData.siteTitle}</div>
                <div style={{ color: A.green, fontSize: 12, marginBottom: 3 }}>lyonrollerhockey.fr</div>
                <div style={{ color: A.textSec, fontSize: 13, lineHeight: 1.5 }}>{seoData.metaDescription}</div>
              </div>
            </ACard>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: A.green,
                fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5 }}>
                <Icon name="check" size={15} color={A.green} /> Enregistré !
              </div>
            )}
            <ABtn variant="ghost" onClick={() => {}}>Annuler les modifications</ABtn>
            <ABtn variant="navy"  onClick={handleSave}>Enregistrer les modifications</ABtn>
          </div>
        </div>
      </div>
    </div>
  )
}
