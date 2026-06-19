'use client'

import { useState, useEffect } from 'react'
import { C, R, SH, SECTION_PAD, MAX_W, SectionHeader, CTABanner, PageHero } from '@/components/public/ui'

interface Equipe { id: number; nom: string; niveau: string; categorie: string; groupe: string; couleur: string; horaire: string | null; coach: string | null; description: string | null; nbJoueurs: number; actif: boolean }

function EquipeCard({ e }: { e: Equipe }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: R.card, overflow: 'hidden', boxShadow: hov ? SH.cardHover : SH.card, transition: 'all 0.22s', transform: hov ? 'translateY(-4px)' : 'none', borderTop: `4px solid ${e.couleur}` }}>
      <div style={{ padding: '22px 22px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <span style={{ background: e.couleur, color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>{e.niveau}</span>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: C.navy, marginTop: 8 }}>{e.nom}</div>
          </div>
          {e.nbJoueurs > 0 && (
            <div style={{ textAlign: 'center', background: C.offWhite, borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 24, color: C.navy, lineHeight: 1 }}>{e.nbJoueurs}</div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>joueurs</div>
            </div>
          )}
        </div>
        {e.coach && <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 4 }}><span style={{ fontWeight: 700, color: C.navy }}>Coach :</span> {e.coach}</div>}
        {e.horaire && <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 4 }}><span style={{ fontWeight: 700, color: C.navy }}>Horaires :</span> {e.horaire}</div>}
        {e.description && <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: '8px 0 0' }}>{e.description}</p>}
      </div>
    </div>
  )
}

export default function EquipesClient({ badge }: { badge: string }) {
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/equipes').then(r => r.json()).then(d => setEquipes(Array.isArray(d) ? d.filter((e: Equipe) => e.actif) : [])).catch(()=>{}).finally(() => setLoading(false))
  }, [])

  const groupes: Record<string, Equipe[]> = {}
  equipes.forEach(e => { if (!groupes[e.groupe]) groupes[e.groupe] = []; groupes[e.groupe].push(e) })
  const groupeLabels: Record<string, string> = { seniors: 'Équipes Seniors', jeunesses: 'Équipes Jeunesses', senior: 'Équipes Seniors', jeunes: 'Équipes Jeunesses' }

  return (
    <div>
      <PageHero badge={badge} title="Nos" titleAccent="Équipes"
        subtitle="Du poussins au national, une équipe pour chaque niveau et chaque âge."
        cta="S'inscrire" ctaHref="/inscription" />
      <div style={{ background: C.offWhite, padding: SECTION_PAD }} className="rsp-section">
        <div style={{ ...MAX_W }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted }}>Chargement…</div>
          ) : equipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.muted }}>Les équipes seront bientôt disponibles.</div>
          ) : (
            Object.entries(groupes).map(([groupe, list]) => (
              <div key={groupe} style={{ marginBottom: 48 }}>
                <SectionHeader label="" title={groupeLabels[groupe] || groupe} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginTop: 24 }}>
                  {list.map(e => <EquipeCard key={e.id} e={e} />)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <CTABanner title="Rejoignez-nous !" subtitle="Inscriptions ouvertes pour la saison 2025-2026." btnLabel="S'inscrire" btnHref="/inscription" />
    </div>
  )
}
