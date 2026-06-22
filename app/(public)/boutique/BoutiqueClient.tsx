'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { C, R, SH, SECTION_PAD, MAX_W, Badge, Btn, SectionHeader, PageHero } from '@/components/public/ui'

interface Produit { id: number; nom: string; categorie: string; prix: number; description: string | null; badge: string | null; imageUrl: string | null; tailles: string | null; personnalisation: boolean; lienSumup: string | null; disponible: boolean; ordre: number }

function ProductCard({ p }: { p: Produit }) {
  const [hov, setHov] = useState(false)
  const tailles = p.tailles ? p.tailles.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, overflow: 'hidden', border: `1.5px solid ${hov ? C.lightBlue : C.border}`, boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.22s', transform: hov ? 'translateY(-4px)' : 'none', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 220, background: p.imageUrl ? '#f8f9fb' : `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Image src="/assets/logo-secondaire.png" alt="" width={130} height={130} style={{ opacity: 0.22, objectFit: 'contain', filter: 'brightness(10)', pointerEvents: 'none' }} />
        )}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {p.badge && <Badge bg={C.red}>{p.badge}</Badge>}
          {p.personnalisation && <Badge bg="#7C3AED">Personnalisable</Badge>}
        </div>
        <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
          <span style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '3px 10px', borderRadius: R.badge, fontSize: 11, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>{p.categorie}</span>
        </div>
      </div>
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 19, color: C.navy, marginBottom: 6, lineHeight: 1.15 }}>{p.nom}</div>
        {p.description && <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: '0 0 10px' }}>{p.description}</p>}
        {tailles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
            {tailles.map(t => (
              <span key={t} style={{ background: C.offWhite, color: C.navy, border: `1px solid ${C.border}`, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif" }}>{t}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: C.navy }}>{p.prix.toFixed(0)} €</span>
          {p.lienSumup ? (
            <a href={p.lienSumup} target="_blank" rel="noopener noreferrer"
              style={{ background: C.red, color: '#fff', padding: '9px 18px', borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13.5, textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Acheter →
            </a>
          ) : (
            <a href="/contact"
              style={{ background: 'transparent', color: C.navy, padding: '8px 16px', borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, textDecoration: 'none', border: `1.5px solid ${C.border}`, whiteSpace: 'nowrap' }}>
              Nous contacter
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BoutiqueClient({ badge }: { badge: string }) {
  const [produits, setProduits]     = useState<Produit[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeCategory, setActive] = useState('all')

  useEffect(() => {
    fetch('/api/boutique')
      .then(r => r.json())
      .then(d => setProduits(Array.isArray(d) ? d.filter((p: Produit) => p.disponible) : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(produits.map(p => p.categorie))]
  const filtered   = activeCategory === 'all' ? produits : produits.filter(p => p.categorie === activeCategory)
  const vedette    = produits[0] ?? null

  return (
    <div>
      <PageHero badge={badge} title="La Boutique" titleAccent="des Roads"
        subtitle="Portez les couleurs de Lyon Roller Hockey — maillots et équipements officiels du club." />

      {!loading && vedette && (
        <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
          <div style={{ ...MAX_W }}>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: SH.card, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ background: vedette.imageUrl ? '#f8f9fb' : `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {vedette.imageUrl ? (
                  <img src={vedette.imageUrl} alt={vedette.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : (
                  <Image src="/assets/logo-principal.png" alt={vedette.nom} width={240} height={240}
                    style={{ opacity: 0.90, objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.35))' }} />
                )}
                <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 6 }}>
                  <Badge>PRODUIT VEDETTE</Badge>
                  {vedette.personnalisation && <Badge bg="#7C3AED">Personnalisable</Badge>}
                </div>
              </div>
              <div style={{ padding: '44px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: C.red, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Produit vedette</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: C.navy, marginBottom: 10, lineHeight: 1.1 }}>{vedette.nom}</div>
                <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{vedette.description || ''}</p>
                {vedette.tailles && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
                    <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, alignSelf: 'center', marginRight: 4 }}>Tailles :</span>
                    {vedette.tailles.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} style={{ background: C.offWhite, color: C.navy, border: `1px solid ${C.border}`, padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif" }}>{t}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 26 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, color: C.navy }}>{vedette.prix.toFixed(0)} €</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {vedette.lienSumup ? (
                    <a href={vedette.lienSumup} target="_blank" rel="noopener noreferrer"
                      style={{ background: C.red, color: '#fff', padding: '14px 32px', borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 15.5, textDecoration: 'none' }}>
                      Acheter sur SumUp →
                    </a>
                  ) : (
                    <Btn onClick={() => window.location.href = '/contact'} size="md">Commander →</Btn>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', padding: '40px 28px 80px' }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {['all', ...categories].map(c => (
              <button key={c} onClick={() => setActive(c)}
                style={{ background: activeCategory === c ? C.navy : C.offWhite, color: activeCategory === c ? '#fff' : C.navy, border: `1.5px solid ${activeCategory === c ? C.navy : C.border}`, padding: '8px 18px', borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s' }}>
                {c === 'all' ? 'Tout voir' : c}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted }}>Chargement…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Boutique à venir</div>
              <p style={{ color: C.muted }}>Les produits seront disponibles prochainement.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 18 }}>
              {filtered.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Informations" title="Comment commander ?" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18, maxWidth: 760, margin: '0 auto' }}>
            {[
              { icon: '👕', title: 'Choisissez',    desc: "Parcourez le catalogue et sélectionnez le produit souhaité." },
              { icon: '💳', title: 'Payez en ligne', desc: "Cliquez sur \"Acheter\" et réglez directement et en sécurité via SumUp." },
              { icon: '📦', title: 'Récupérez',      desc: "Retirez votre commande au gymnase lors d'un entraînement." },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: R.card, padding: '28px 22px', textAlign: 'center', boxShadow: SH.card }}>
                <div style={{ fontSize: 34, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, color: C.navy, marginBottom: 8, textTransform: 'uppercase' }}>{s.title}</div>
                <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
