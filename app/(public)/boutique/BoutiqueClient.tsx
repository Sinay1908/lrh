'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { C, R, SH, SECTION_PAD, MAX_W, Badge, Btn, SectionHeader, PageHero } from '@/components/public/ui'

interface Produit { id: number; nom: string; categorie: string; prix: number; description: string | null; badge: string | null; disponible: boolean; ordre: number }

function ProductCard({ p, onAdd }: { p: Produit; onAdd: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, overflow: 'hidden', border: `1.5px solid ${hov ? C.lightBlue : C.border}`, boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.22s', transform: hov ? 'translateY(-4px)' : 'none' }}>
      <div style={{ height: 196, background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <Image src="/assets/logo-secondaire.png" alt="" width={130} height={130} style={{ opacity: 0.22, objectFit: 'contain', filter: 'brightness(10)', pointerEvents: 'none' }} />
        {p.badge && <div style={{ position: 'absolute', top: 12, left: 12 }}><Badge bg={C.red}>{p.badge}</Badge></div>}
      </div>
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 19, color: C.navy, marginBottom: 6, lineHeight: 1.15 }}>{p.nom}</div>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: '0 0 14px', minHeight: 40 }}>{p.description || ''}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: C.navy }}>{p.prix.toFixed(0)} €</span>
          <Btn size="sm" onClick={onAdd}>+ Panier</Btn>
        </div>
      </div>
    </div>
  )
}

export default function BoutiqueClient({ badge }: { badge: string }) {
  const [produits, setProduits]         = useState<Produit[]>([])
  const [loading, setLoading]           = useState(true)
  const [cart, setCart]                 = useState<Array<Produit & { qty: number }>>([])
  const [activeCategory, setActive]     = useState('all')
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/boutique')
      .then(r => r.json())
      .then(d => setProduits(Array.isArray(d) ? d.filter((p: Produit) => p.disponible) : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(produits.map(p => p.categorie))]
  const filtered   = activeCategory === 'all' ? produits : produits.filter(p => p.categorie === activeCategory)
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const vedette    = produits[0] ?? null

  const addToCart = (p: Produit) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id)
      if (existing) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...p, qty: 1 }]
    })
    setNotification(p.nom)
    setTimeout(() => setNotification(null), 2500)
  }

  return (
    <div>
      <PageHero badge={badge} title="La Boutique" titleAccent="des Roads"
        subtitle="Portez les couleurs de Lyon Roller Hockey — maillots, textile et accessoires officiels du club." />

      {notification && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 2000, background: C.navy, color: '#fff', padding: '13px 20px', borderRadius: R.card, boxShadow: '0 8px 32px rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
          <span style={{ fontSize: 17 }}>✅</span>
          <span><strong>{notification}</strong> ajouté au panier</span>
        </div>
      )}

      {!loading && vedette && (
        <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
          <div style={{ ...MAX_W }}>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: SH.card, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 40 }}>
                <Image src="/assets/logo-principal.png" alt={vedette.nom} width={240} height={240}
                  style={{ opacity: 0.90, objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.35))' }} />
                <div style={{ position: 'absolute', top: 20, left: 20 }}><Badge>PRODUIT VEDETTE</Badge></div>
              </div>
              <div style={{ padding: '44px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: C.red, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Produit vedette</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: C.navy, marginBottom: 10, lineHeight: 1.1 }}>{vedette.nom}</div>
                <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 22 }}>{vedette.description || ''}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 26 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, color: C.navy }}>{vedette.prix.toFixed(0)} €</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Btn onClick={() => addToCart(vedette)} size="md">Ajouter au panier</Btn>
                  <Btn variant="secondary" onClick={() => window.location.href = '/contact'} size="md">Commander</Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', padding: '40px 28px 80px' }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', ...categories].map(c => (
                <button key={c} onClick={() => setActive(c)}
                  style={{ background: activeCategory === c ? C.navy : C.offWhite, color: activeCategory === c ? '#fff' : C.navy, border: `1.5px solid ${activeCategory === c ? C.navy : C.border}`, padding: '8px 18px', borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {c === 'all' ? 'Tout voir' : c}
                </button>
              ))}
            </div>
            {totalItems > 0 && (
              <div style={{ background: C.lightBluePale, border: `1.5px solid ${C.lightBlue}`, padding: '9px 16px', borderRadius: R.inner, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5, color: C.navy }}>
                🛒 {totalItems} article{totalItems > 1 ? 's' : ''} — Contactez-nous pour finaliser
              </div>
            )}
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
              {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={() => addToCart(p)} />)}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Informations" title="Comment commander ?" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18, maxWidth: 860, margin: '0 auto' }}>
            {[
              { icon: '📋', title: 'Sélectionnez',    desc: "Parcourez le catalogue et notez les références et tailles souhaitées." },
              { icon: '📞', title: 'Contactez-nous',   desc: "Envoyez votre liste par email ou venez directement lors d'un entraînement." },
              { icon: '💳', title: 'Réglez & retirez', desc: "Paiement sur place ou par virement. Retrait au gymnase lors des séances." },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: R.card, padding: '28px 22px', textAlign: 'center', boxShadow: SH.card }}>
                <div style={{ fontSize: 34, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, color: C.navy, marginBottom: 8, textTransform: 'uppercase' }}>{s.title}</div>
                <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Btn onClick={() => window.location.href = '/contact'} size="lg">Passer commande →</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}
