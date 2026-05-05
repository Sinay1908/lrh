'use client'

import { useState } from 'react'
import { C, R, SH, SECTION_PAD, SECTION_PAD_SM, MAX_W, Btn, SectionHeader, PageHero } from '@/components/public/ui'

export interface TarifData {
  id:          number
  saison:      string
  categorie:   string
  montant:     number
  description: string | null
  actif:       boolean
  ordre:       number
}

function BenefitCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '30px 24px', textAlign: 'center', transition: 'all 0.22s', boxShadow: hov ? SH.cardHover : SH.card, transform: hov ? 'translateY(-4px)' : 'none' }}>
      <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 19, color: C.navy, marginBottom: 8, textTransform: 'uppercase' }}>{title}</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  )
}

function TarifCard({ tarif }: { tarif: TarifData }) {
  const [hov, setHov] = useState(false)
  const color = getTarifColor(tarif.categorie)
  const priceStr = formatMontant(tarif.montant)
  const detail = tarif.description || 'Saison complète · Licence FFRS incluse'
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '26px 22px', textAlign: 'center', boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.2s', transform: hov ? 'translateY(-3px)' : 'none', borderTop: `3px solid ${color}` }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, color, lineHeight: 1, marginBottom: 6 }}>{priceStr}</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: C.navy, marginBottom: 8 }}>{tarif.categorie}</div>
      <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.5 }}>{detail}</div>
    </div>
  )
}

/** Couleur selon la catégorie */
function getTarifColor(cat: string): string {
  const lower = cat.toLowerCase()
  if (lower.includes('u11') || lower.includes('u14') || lower.includes('u17') || lower.includes('jeune') || lower.includes('enfant') || lower.includes('junior') || lower.includes('cadet') || lower.includes('poussin')) return '#1E6B9A'
  if (lower.includes('loisir')) return '#2A7A4B'
  if (lower.includes('famille') || lower.includes('%') || lower.includes('réduction')) return C.red
  return C.navy
}

/** Affichage du montant : négatif → "−XX %" (réduction), positif → "XX €" */
function formatMontant(m: number): string {
  if (m < 0) return `${m} %`
  return `${m % 1 === 0 ? m : m.toFixed(2)} €`
}

const BENEFITS = [
  { icon: '🛼', title: 'Matériel mis à disposition', desc: "Patins et protections disponibles pour les débutants pendant la période d'essai." },
  { icon: '👨‍🏫', title: 'Encadrement professionnel', desc: "Des entraîneurs diplômés d'État pour chaque catégorie d'âge et de niveau." },
  { icon: '🏟️', title: 'Installations modernes', desc: "Piste homologuée, vestiaires et salle de force au gymnase du Vieux-Lyon." },
  { icon: '🤝', title: 'Communauté soudée', desc: "Événements, tournois, repas de fin de saison — une vie de club intense et chaleureuse." },
]

const STEPS = [
  { num: '01', title: 'Prise de contact', desc: "Remplissez le formulaire ou appelez-nous. On vous rappelle pour répondre à vos questions et vous orienter vers la bonne équipe." },
  { num: '02', title: "Séance d'essai gratuite", desc: "Venez essayer une séance sans engagement. Venez avec des vêtements de sport — le matériel est mis à disposition." },
  { num: '03', title: 'Inscription officielle', desc: "Remplissez le dossier, fournissez les pièces justificatives et réglez la cotisation. Bienvenue dans le club !" },
]

const DOCS = [
  'Certificat médical de moins de 3 mois',
  "Photo d'identité",
  "Copie de la pièce d'identité",
  'Règlement de la cotisation (chèque ou virement)',
  'Formulaire de licence FFRS complété',
]

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px',
  border: `1.5px solid ${C.border}`, borderRadius: R.inner,
  fontFamily: "'Barlow',sans-serif", fontSize: 14, color: C.navy,
  outline: 'none', background: '#fff', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: "'Barlow',sans-serif",
  fontWeight: 600, fontSize: 12.5, color: C.navy, marginBottom: 6,
}

export default function InscriptionPageClient({ tarifs }: { tarifs: TarifData[] }) {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', tel: '', equipe: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  // Grouper les tarifs actifs par saison, afficher la plus récente en premier
  const saisonsActives = [...new Set(tarifs.filter(t => t.actif).map(t => t.saison))].sort().reverse()
  const saisonActive = saisonsActives[0] ?? null
  const tarifsAffiches = saisonActive ? tarifs.filter(t => t.actif && t.saison === saisonActive) : []

  return (
    <div>
      <PageHero badge="Inscriptions 2025" title="Rejoignez" titleAccent="les Aigles"
        subtitle="La saison 2025-2026 approche. Rejoignez Lyon Roller Hockey dès maintenant — tout niveau, tout âge." />

      {/* ── AVANTAGES ── */}
      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Vos avantages" title="Pourquoi nous rejoindre ?" center
            subtitle="En rejoignant Lyon Roller Hockey, vous intégrez bien plus qu'un club sportif." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18 }}>
            {BENEFITS.map(b => <BenefitCard key={b.title} icon={b.icon} title={b.title} desc={b.desc} />)}
          </div>
        </div>
      </div>

      {/* ── ÉTAPES ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Comment s'inscrire" title="3 Étapes Simples" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 32, maxWidth: 900, margin: '0 auto', position: 'relative' }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ textAlign: 'center', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 32, left: 'calc(50% + 38px)', right: 'calc(-50% + 38px)', height: 2, background: C.border }} />
                )}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: C.navy, color: '#fff',
                  margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 24,
                  border: `3px solid ${C.lightBlue}`, position: 'relative', zIndex: 1,
                }}>{s.num}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: C.navy, marginBottom: 10, textTransform: 'uppercase' }}>{s.title}</div>
                <p style={{ color: C.muted, fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TARIFS DYNAMIQUES ── */}
      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader
            label="Cotisations"
            title={saisonActive ? `Tarifs Saison ${saisonActive}` : 'Tarifs'}
            center
            subtitle="Tous les tarifs incluent la licence fédérale FFRS. Des facilités de paiement sont possibles."
          />

          {tarifsAffiches.length === 0 ? (
            <p style={{ textAlign: 'center', color: C.muted, padding: '24px 0' }}>
              Tarifs à venir — contactez-nous pour plus d&apos;informations.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))', gap: 14, maxWidth: 960, margin: '0 auto 24px' }}>
              {tarifsAffiches.map(t => <TarifCard key={t.id} tarif={t} />)}
            </div>
          )}

          <p style={{ textAlign: 'center', color: C.muted, fontSize: 13.5 }}>
            Réductions disponibles : Pass Sport, coupons sport, aide municipale.{' '}
            <strong style={{ color: C.navy }}>Renseignez-vous auprès du club.</strong>
          </p>
        </div>
      </div>

      {/* ── DOCUMENTS ── */}
      <div style={{ background: '#fff', padding: SECTION_PAD_SM }} className="rsp-section-sm">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <SectionHeader label="Dossier d'inscription" title="Documents Requis" />
          <div style={{ background: C.offWhite, borderRadius: R.card, padding: '28px 32px' }}>
            {DOCS.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: i < DOCS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ color: C.navy, fontSize: 14.5, fontWeight: 500 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FORMULAIRE ── */}
      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <SectionHeader label="Première étape" title="Demande d'inscription" center
            subtitle="Remplissez ce formulaire et nous vous recontacterons dans les 48 heures." />
          {sent ? (
            <div style={{ background: '#fff', borderRadius: R.card, padding: '48px 36px', textAlign: 'center', boxShadow: SH.card }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 26, color: C.navy, marginBottom: 10 }}>Demande envoyée !</div>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
                Notre équipe vous contactera dans les 48h pour organiser votre séance d&apos;essai gratuite.
              </p>
              <Btn onClick={() => { setSent(false); setForm({ nom: '', prenom: '', email: '', tel: '', equipe: '', message: '' }) }}>
                Nouvelle demande
              </Btn>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: R.card, padding: '36px 28px', boxShadow: SH.card }}>
              <div className="rsp-form-2col">
                {([['prenom', 'Prénom *'], ['nom', 'Nom *']] as [keyof typeof form, string][]).map(([k, l]) => (
                  <div key={k}>
                    <label style={labelStyle}>{l}</label>
                    <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required style={fieldStyle} />
                  </div>
                ))}
              </div>
              {([['email', 'Adresse email *', 'email'], ['tel', 'Téléphone', 'tel']] as [keyof typeof form, string, string][]).map(([k, l, t]) => (
                <div key={k} style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>{l}</label>
                  <input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required={k === 'email'} style={fieldStyle} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Catégorie souhaitée</label>
                <select value={form.equipe} onChange={e => setForm({ ...form, equipe: e.target.value })} style={fieldStyle}>
                  <option value="">Sélectionnez...</option>
                  {['Nationale 1', 'Régionale 1', 'Régionale 2', 'U17', 'U14', 'U11', 'Loisir', 'Je ne sais pas encore'].map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Message (optionnel)</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
              </div>
              <Btn fullWidth size="lg" disabled={loading}>
                {loading ? 'Envoi en cours…' : 'Envoyer ma demande'}
              </Btn>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
