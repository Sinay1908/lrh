'use client'

import { useState, useEffect } from 'react'
import { C, R, SH, SECTION_PAD, MAX_W, Btn, SectionHeader, CTABanner, PageHero } from '@/components/public/ui'

function InfoCard({ icon, label, lines }: { icon: string; label: string; lines: string[] }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, padding: '26px 22px', boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.2s', transform: hov ? 'translateY(-3px)' : 'none', borderTop: `3px solid ${C.red}` }}>
      <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, color: C.red, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      {lines.map((l, j) => (
        <div key={j} style={{ color: j === 0 ? C.navy : C.muted, fontSize: j === 0 ? 14.5 : 13.5, fontWeight: j === 0 ? 600 : 400, lineHeight: 1.55, marginBottom: j < lines.length - 1 ? 3 : 0 }}>{l}</div>
      ))}
    </div>
  )
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: R.card, marginBottom: 8, overflow: 'hidden', boxShadow: SH.card }}>
      <button onClick={onToggle}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '17px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left' }}>
        <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 14.5, color: C.navy, lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: C.red, fontWeight: 700, fontSize: 20, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '14px 20px 17px', borderTop: `1px solid ${C.border}` }}>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  )
}

const CONTACT_DEFAULTS = {
  address:  'Gymnase du Vieux-Lyon',
  street:   '12 rue de la Patinoire',
  city:     '69005 Lyon',
  phone:    '04 72 00 00 00',
  email:    'contact@lyonrollerhockey.fr',
  schedule: 'Mar & Jeu 18h – 21h · Sam 9h – 12h',
}

const FAQS = [
  { q: "Peut-on venir essayer une séance avant de s'inscrire ?",  a: "Oui, absolument ! Nous proposons une séance d'essai gratuite et sans engagement pour toutes les catégories." },
  { q: "À partir de quel âge peut-on s'inscrire ?",               a: "Nos catégories jeunes débutent à 8 ans (U11). N'hésitez pas à nous contacter pour les plus petits." },
  { q: "Faut-il avoir ses propres patins pour commencer ?",        a: "Non, le club met du matériel à disposition lors de la période d'essai. Nous recommandons ensuite d'acquérir son propre équipement progressivement." },
  { q: "Le club est-il accessible aux débutants complets ?",       a: "Oui, notre section Loisir et nos équipes jeunes accueillent des débutants. Nos entraîneurs adaptent leur pédagogie à tous les niveaux." },
  { q: "Peut-on payer la cotisation en plusieurs fois ?",          a: "Oui, des facilités de paiement sont possibles sur demande. Des aides existent : Pass Sport, coupons sport, aide municipale." },
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

export default function ContactClient({ badge }: { badge: string }) {
  const [form, setForm]       = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contact, setContact] = useState(CONTACT_DEFAULTS)

  useEffect(() => {
    fetch('/api/parametres?section=contact')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        setContact(prev => ({
          address:  d['contact.address']  || prev.address,
          street:   d['contact.street']   || prev.street,
          city:     d['contact.city']     || prev.city,
          phone:    d['contact.phone']    || prev.phone,
          email:    d['contact.email']    || prev.email,
          schedule: d['contact.schedule'] || prev.schedule,
        }))
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/messages', {
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

  return (
    <div>
      <PageHero badge={badge} title="Contactez" titleAccent="les Aigles"
        subtitle="Une question, une demande d'inscription ou un partenariat ? Notre équipe vous répond dans les 48 heures."
        cta="S'inscrire au club" ctaHref="/inscription" />

      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 16 }}>
            <InfoCard icon="📍" label="Adresse"     lines={[contact.address, `${contact.street}`, contact.city]} />
            <InfoCard icon="📞" label="Téléphone"   lines={[contact.phone, 'Lundi – Vendredi, 9h – 18h']} />
            <InfoCard icon="✉️" label="Email"       lines={[contact.email, 'Réponse sous 48h ouvrées']} />
            <InfoCard icon="🕐" label="Secrétariat" lines={contact.schedule.split('·').map(s => s.trim())} />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: SECTION_PAD }} className="rsp-section">
        <div className="rsp-2col" style={{ ...MAX_W }}>
          <div>
            <SectionHeader label="Nous trouver" title="Notre Salle" />
            <div style={{ background: C.lightBluePale, borderRadius: R.card, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden', border: `1.5px solid ${C.border}` }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} viewBox="0 0 400 300">
                {[0,1,2,3,4,5,6].map(i => <line key={`h${i}`} x1="0" y1={i*50} x2="400" y2={i*50} stroke="#0D2150" strokeWidth="0.7"/>)}
                {[0,1,2,3,4,5,6,7,8].map(i => <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="300" stroke="#0D2150" strokeWidth="0.7"/>)}
              </svg>
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50% 50% 50% 0', background: C.red, transform: 'rotate(-45deg)', margin: '0 auto 6px', boxShadow: '0 4px 14px rgba(212,43,43,0.45)' }} />
                <div style={{ background: 'rgba(13,33,80,0.82)', color: '#fff', padding: '6px 14px', borderRadius: R.inner, marginTop: 6, fontFamily: "'Barlow',sans-serif", fontSize: 12, fontWeight: 600 }}>{contact.address}</div>
              </div>
            </div>
            <div style={{ background: C.offWhite, borderRadius: R.card, padding: '18px 20px' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 12 }}>Comment y accéder</div>
              {[
                { icon: '🚇', text: "Métro ligne D — arrêt Vieux-Lyon Cathédrale Saint-Jean" },
                { icon: '🚌', text: "Bus S2 — arrêt Minimes-Louis Carrand" },
                { icon: '🚗', text: "Parking Cathédrale Saint-Jean (payant)" },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 2 ? 9 : 0, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader label="Écrivez-nous" title="Formulaire de Contact" />
            {sent ? (
              <div style={{ background: C.lightBluePale, borderRadius: R.card, padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 26, color: C.navy, marginBottom: 10 }}>Message envoyé !</div>
                <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>Notre équipe vous répondra dans les 48 heures ouvrées.</p>
                <Btn onClick={() => { setSent(false); setForm({ nom: '', email: '', sujet: '', message: '' }) }}>Nouveau message</Btn>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: C.offWhite, borderRadius: R.card, padding: '32px 28px' }}>
                <div className="rsp-form-2col">
                  {([['nom', 'Nom complet *'], ['email', 'Email *']] as [keyof typeof form, string][]).map(([k, l]) => (
                    <div key={k}>
                      <label style={labelStyle}>{l}</label>
                      <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required style={fieldStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Sujet *</label>
                  <select value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} required style={fieldStyle}>
                    <option value="">Sélectionnez un sujet...</option>
                    {["Demande d'inscription", "Renseignements généraux", "Séance d'essai", "Partenariat / Sponsoring", "Boutique / Commande", "Autre"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} style={{ ...fieldStyle, resize: 'vertical' }} />
                </div>
                <Btn fullWidth size="lg" disabled={loading}>{loading ? 'Envoi…' : 'Envoyer le message'}</Btn>
              </form>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <SectionHeader label="Questions fréquentes" title="FAQ" center />
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </div>

      <CTABanner title="Prêt à nous rejoindre ?"
        subtitle="Ne tardez plus — inscrivez-vous ou venez assister à un entraînement pour découvrir l'ambiance."
        btnLabel="S'inscrire au club" btnHref="/inscription" />
    </div>
  )
}
