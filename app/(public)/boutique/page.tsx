'use client'

import { useState } from 'react'
import Image from 'next/image'
import { C, R, SH, SECTION_PAD, MAX_W, Badge, Btn, SectionHeader, PageHero } from '@/components/public/ui'

interface Product { id: number; name: string; cat: string; price: string; badge?: string; badgeColor?: string; desc: string }

function ProductCard({ product: p, onAdd }: { product: Product; onAdd: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, overflow: 'hidden', border: `1.5px solid ${hov ? C.lightBlue : C.border}`, boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.22s', transform: hov ? 'translateY(-4px)' : 'none' }}>
      <div style={{ height: 196, background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <Image src="/assets/logo-secondaire.png" alt="" width={130} height={130} style={{ opacity: 0.22, objectFit: 'contain', filter: 'brightness(10)', pointerEvents: 'none' }} />
        {p.badge && <div style={{ position: 'absolute', top: 12, left: 12 }}><Badge bg={p.badgeColor || C.red}>{p.badge}</Badge></div>}
      </div>
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 19, color: C.navy, marginBottom: 6, lineHeight: 1.15 }}>{p.name}</div>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: '0 0 14px', minHeight: 40 }}>{p.desc}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: C.navy }}>{p.price}</span>
          <Btn size="sm" onClick={onAdd}>+ Panier</Btn>
        </div>
      </div>
    </div>
  )
}

const PRODUCTS: Product[] = [
  { id:1, name:'Maillot Domicile 2025',   cat:'textile',     price:'65 €',  badge:'Nouveau',     badgeColor: C.red,   desc:'Tissu technique respirant. Numéros personnalisables sur demande.' },
  { id:2, name:'Maillot Extérieur 2025',  cat:'textile',     price:'65 €',                                             desc:'Version extérieur du maillot officiel. Coloris inversé.' },
  { id:3, name:'Veste de survêtement',    cat:'textile',     price:'75 €',                                             desc:'Veste officielle avec logo brodé. Coupe moderne, matière légère.' },
  { id:4, name:'Pantalon de survêtement', cat:'textile',     price:'55 €',                                             desc:'Bas assorti à la veste. Coupe droite avec bandes contrastées.' },
  { id:5, name:'Casquette Snapback',      cat:'accessoires', price:'28 €',  badge:'Populaire',   badgeColor:'#2A7A4B', desc:'Réglable, brodée avec le logo des Aigles. Coloris navy et bleu.' },
  { id:6, name:"Bonnet d'hiver",          cat:'accessoires', price:'22 €',                                             desc:'Bonnet en laine mélangée avec logo du club. Pour les déplacements.' },
  { id:7, name:'Sac de sport',            cat:'accessoires', price:'45 €',                                             desc:'Grand sac avec compartiment chaussures et poche intérieure zippée.' },
  { id:8, name:'Kit Protection Junior',   cat:'equipement',  price:'89 €',  badge:'Recommandé',  badgeColor:'#1E6B9A', desc:'Protections homologuées pour U11 et U14. Genouillères, coudières, jambières.' },
  { id:9, name:'Gourde personnalisée',    cat:'accessoires', price:'18 €',                                             desc:'Gourde isotherme 500ml avec logo du club. Idéal pour les entraînements.' },
]

const CATEGORIES = [
  { id: 'all',         label: 'Tout voir'   },
  { id: 'textile',     label: 'Textile'     },
  { id: 'accessoires', label: 'Accessoires' },
  { id: 'equipement',  label: 'Équipement'  },
]

export default function BoutiquePage() {
  const [cart, setCart]                = useState<Array<Product & { qty: number }>>([])
  const [activeCategory, setActive]    = useState('all')
  const [notification, setNotification] = useState<string | null>(null)

  const filtered = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCategory)
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setNotification(product.name)
    setTimeout(() => setNotification(null), 2500)
  }

  return (
    <div>
      <PageHero badge="Collection 2025" title="La Boutique" titleAccent="des Aigles"
        subtitle="Portez les couleurs de Lyon Roller Hockey — maillots, textile et accessoires officiels du club." />

      {/* Toast */}
      {notification && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 2000, background: C.navy, color: '#fff', padding: '13px 20px', borderRadius: R.card, boxShadow: '0 8px 32px rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Barlow',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
          <span style={{ fontSize: 17 }}>✅</span>
          <span><strong>{notification}</strong> ajouté au panier</span>
        </div>
      )}

      {/* ── PRODUIT VEDETTE ── */}
      <div style={{ background: C.offWhite, padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: SH.card, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`, minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 40 }}>
              <Image src="/assets/logo-principal.png" alt="Maillot domicile" width={240} height={240} style={{ opacity: 0.90, objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.35))' }} />
              <div style={{ position: 'absolute', top: 20, left: 20 }}><Badge>NOUVEAUTÉ 2025</Badge></div>
            </div>
            <div style={{ padding: '44px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ color: C.red, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Produit vedette</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: C.navy, marginBottom: 10, lineHeight: 1.1 }}>Maillot Domicile 2024-2025</div>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 22 }}>
                Le maillot officiel de la saison. Tissu technique respirant, coupe athlétique, logo tissé. Personnalisation du numéro et du nom disponible sur commande.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 26 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, color: C.navy }}>65 €</span>
                <span style={{ color: C.muted, fontSize: 13 }}>Tailles XS – 3XL · Perso. +15 €</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Btn onClick={() => addToCart(PRODUCTS[0])} size="md">Ajouter au panier</Btn>
                <Btn variant="secondary" onClick={() => window.location.href = '/contact'} size="md">Commander</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRILLE PRODUITS ── */}
      <div style={{ background: '#fff', padding: '40px 28px 80px' }}>
        <div style={{ ...MAX_W }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setActive(c.id)}
                  style={{ background: activeCategory === c.id ? C.navy : C.offWhite, color: activeCategory === c.id ? '#fff' : C.navy, border: `1.5px solid ${activeCategory === c.id ? C.navy : C.border}`, padding: '8px 18px', borderRadius: R.btn, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {c.label}
                </button>
              ))}
            </div>
            {totalItems > 0 && (
              <div style={{ background: C.lightBluePale, border: `1.5px solid ${C.lightBlue}`, padding: '9px 16px', borderRadius: R.inner, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13.5, color: C.navy }}>
                🛒 {totalItems} article{totalItems > 1 ? 's' : ''} — Contactez-nous pour finaliser
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 18 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />)}
          </div>
        </div>
      </div>

      {/* ── COMMENT COMMANDER ── */}
      <div style={{ background: C.lightBluePale, padding: SECTION_PAD }}>
        <div style={{ ...MAX_W }}>
          <SectionHeader label="Informations" title="Comment commander ?" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18, maxWidth: 860, margin: '0 auto' }}>
            {[
              { icon: '📋', title: 'Sélectionnez',  desc: "Parcourez le catalogue et notez les références et tailles souhaitées." },
              { icon: '📞', title: 'Contactez-nous', desc: "Envoyez votre liste par email ou venez directement lors d'un entraînement." },
              { icon: '💳', title: 'Réglez & retirez',desc: "Paiement sur place ou par virement. Retrait au gymnase lors des séances." },
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
