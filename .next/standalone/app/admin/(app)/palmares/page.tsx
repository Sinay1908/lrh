'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { A, ABtn, ACard, AInput, ASelect, ATable, Col, Divider, Icon, IconBtn, Modal, PageHeader } from '@/components/admin/ui'

// ─── Types ────────────────────────────────────────────────────────────────────
interface PalmaresItem { id: number; annee: string; titre: string; competition: string; description: string | null; ordre: number }
interface StaffMembre  { id: number; nom: string; role: string; depuis: string | null; equipeNom: string | null; description: string | null; photoUrl: string | null; actif: boolean; ordre: number }

// ─── Sous-sections ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'identite', label: 'Identité du club',  icon: 'star'     },
  { id: 'stats',    label: 'Statistiques',       icon: 'settings' },
  { id: 'palmares', label: 'Palmarès',           icon: 'star'     },
  { id: 'staff',    label: 'Staff technique',    icon: 'teams'    },
]

// ─── Valeurs par défaut ───────────────────────────────────────────────────────
const DEF_IDENTITE = {
  'club.identite.para1':   "Lyon Roller Hockey est l'un des clubs de roller hockey les plus historiques de France. Fondé en 1974 dans le 5e arrondissement de Lyon, le club a su traverser les décennies en construisant une identité forte, fondée sur la compétition, la formation et l'appartenance à une vraie communauté sportive.",
  'club.identite.para2':   "Aujourd'hui, avec plus de 180 licenciés, 7 équipes et un ancrage fort dans la métropole lyonnaise, les Aigles continuent de porter haut les couleurs du roller hockey français.",
  'club.identite.imageUrl': '',
  'club.identite.caption':  "Photo de l'équipe — saison 2024-2025",
}

const DEF_STATS = {
  'club.stat.1.valeur': '50+',  'club.stat.1.label': "Ans d'existence",
  'club.stat.2.valeur': '180+', 'club.stat.2.label': 'Licenciés actifs',
  'club.stat.3.valeur': '7',    'club.stat.3.label': 'Équipes',
  'club.stat.4.valeur': '12',   'club.stat.4.label': 'Titres nationaux',
  'club.stat.5.valeur': '3',    'club.stat.5.label': "Terrains d'entraînement",
  'club.stat.6.valeur': '1974', 'club.stat.6.label': 'Fondation',
}

// ─── Compression image ────────────────────────────────────────────────────────
function compressImage(file: File, maxW = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new window.Image()
      img.onload = () => {
        const ratio  = Math.min(1, maxW / img.width)
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = ev.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ClubAdminPage() {
  const [section, setSection] = useState('identite')

  return (
    <div>
      <PageHeader
        title="Le Club"
        subtitle="Gérez l'identité, les statistiques, le palmarès et le staff"
        breadcrumb="Le Club"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <ACard style={{ padding: 8 }}>
          {SECTIONS.map(s => {
            const active = section === s.id
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: A.r8, border: 'none',
                  background: active ? '#EDF4FF' : 'transparent',
                  color: active ? A.blue : A.textSec,
                  fontFamily: "'Barlow',sans-serif", fontWeight: active ? 600 : 500,
                  fontSize: 13.5, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s', marginBottom: 2,
                }}>
                <Icon name={s.icon} size={15} color={active ? A.blue : A.muted} />
                {s.label}
              </button>
            )
          })}
        </ACard>

        {/* Contenu */}
        <div>
          {section === 'identite' && <IdentiteSection />}
          {section === 'stats'    && <StatsSection />}
          {section === 'palmares' && <PalmaresSection />}
          {section === 'staff'    && <StaffSection />}
        </div>
      </div>
    </div>
  )
}

// ─── Identité ─────────────────────────────────────────────────────────────────
function IdentiteSection() {
  const [values, setValues]       = useState(DEF_IDENTITE)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const get = (k: keyof typeof DEF_IDENTITE) => values[k] ?? ''
  const set = (k: keyof typeof DEF_IDENTITE, v: string) => setValues(prev => ({ ...prev, [k]: v }))

  useEffect(() => {
    fetch('/api/parametres?section=club')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        setValues(prev => ({
          ...prev,
          ...Object.fromEntries(Object.entries(d).filter(([k]) => k.startsWith('club.identite.'))),
        }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    try {
      const compressed = await compressImage(file)
      const res  = await fetch('/api/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: compressed, filename: file.name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur upload'); return }
      set('club.identite.imageUrl', data.url)
    } catch { setError("Erreur lors de l'upload") } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true); setError(null)
    try {
      const body: Record<string, { valeur: string; section: string }> = {}
      Object.entries(values).forEach(([k, v]) => { body[k] = { valeur: v, section: 'club' } })
      const res = await fetch('/api/parametres', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) { setError('Erreur lors de la sauvegarde'); return }
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch { setError('Erreur réseau') } finally { setSaving(false) }
  }

  if (loading) return <ACard><div style={{ textAlign: 'center', padding: 40, color: A.muted }}>Chargement…</div></ACard>

  return (
    <ACard>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 20 }}>
        Identité du club
      </div>

      <AInput
        label="Premier paragraphe"
        value={get('club.identite.para1')}
        onChange={e => set('club.identite.para1', e.target.value)}
        rows={4}
      />
      <AInput
        label="Second paragraphe"
        value={get('club.identite.para2')}
        onChange={e => set('club.identite.para2', e.target.value)}
        rows={3}
      />

      <Divider label="Photo d'équipe" />

      {get('club.identite.imageUrl') ? (
        <div style={{ marginBottom: 14 }}>
          <div style={{ borderRadius: A.r10, overflow: 'hidden', maxHeight: 220, marginBottom: 10, border: `1.5px solid ${A.border}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={get('club.identite.imageUrl')}
              alt="Photo équipe"
              style={{ width: '100%', objectFit: 'cover', maxHeight: 220, display: 'block' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ABtn variant="ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Upload…' : 'Changer la photo'}
            </ABtn>
            <ABtn variant="ghost" onClick={() => set('club.identite.imageUrl', '')}>Supprimer</ABtn>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            border: `2px dashed ${uploading ? A.blue : A.border}`, borderRadius: A.r8,
            padding: '28px 16px', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer',
            background: A.bg, transition: 'border-color 0.2s', marginBottom: 14,
          }}>
          {uploading ? (
            <div style={{ color: A.blue, fontSize: 13, fontWeight: 500 }}>Upload en cours…</div>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
              <div style={{ fontSize: 13, color: A.textSec, fontWeight: 500 }}>Cliquer pour ajouter la photo d&apos;équipe</div>
              <div style={{ fontSize: 11.5, color: A.muted, marginTop: 4 }}>JPG, PNG, WebP — max 8MB</div>
            </>
          )}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

      <AInput
        label="Légende de la photo"
        value={get('club.identite.caption')}
        onChange={e => set('club.identite.caption', e.target.value)}
        placeholder="ex. Photo de l'équipe — saison 2024-2025"
      />

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: A.r8, padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500, marginTop: 8 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16, alignItems: 'center' }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: A.green, fontSize: 13.5, fontWeight: 600 }}>
            <Icon name="check" size={15} color={A.green} /> Enregistré !
          </div>
        )}
        <ABtn variant="navy" onClick={handleSave} disabled={saving || uploading}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </ABtn>
      </div>
    </ACard>
  )
}

// ─── Statistiques ─────────────────────────────────────────────────────────────
function StatsSection() {
  const [values, setValues]   = useState(DEF_STATS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/parametres?section=club')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        setValues(prev => ({
          ...prev,
          ...Object.fromEntries(Object.entries(d).filter(([k]) => k.startsWith('club.stat.'))),
        }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const get = (k: string) => (values as Record<string, string>)[k] ?? ''
  const set = (k: string, v: string) => setValues(prev => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError(null)
    try {
      const body: Record<string, { valeur: string; section: string }> = {}
      Object.entries(values).forEach(([k, v]) => { body[k] = { valeur: v, section: 'club' } })
      const res = await fetch('/api/parametres', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) { setError('Erreur lors de la sauvegarde'); return }
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch { setError('Erreur réseau') } finally { setSaving(false) }
  }

  if (loading) return <ACard><div style={{ textAlign: 'center', padding: 40, color: A.muted }}>Chargement…</div></ACard>

  return (
    <ACard>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri, marginBottom: 6 }}>
        Statistiques du club
      </div>
      <p style={{ fontSize: 13, color: A.muted, marginBottom: 20, lineHeight: 1.6 }}>
        Les 6 chiffres clés affichés dans la barre sombre sur la page &quot;Le Club&quot;.
      </p>

      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
          <AInput
            label={i === 1 ? 'Valeur' : undefined}
            value={get(`club.stat.${i}.valeur`)}
            onChange={e => set(`club.stat.${i}.valeur`, e.target.value)}
            placeholder="ex. 180+"
          />
          <AInput
            label={i === 1 ? 'Label affiché' : undefined}
            value={get(`club.stat.${i}.label`)}
            onChange={e => set(`club.stat.${i}.label`, e.target.value)}
            placeholder="ex. Licenciés actifs"
          />
        </div>
      ))}

      {/* Aperçu */}
      <Divider label="Aperçu de la barre" />
      <div style={{
        background: A.navy, borderRadius: A.r10, padding: '16px 8px',
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden',
      }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{
            textAlign: 'center', padding: '12px 8px',
            borderRight: i % 3 !== 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            borderBottom: i <= 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, color: '#A8D6E8', lineHeight: 1 }}>
              {get(`club.stat.${i}.valeur`) || `—`}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
              {get(`club.stat.${i}.label`) || `Label ${i}`}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: A.r8, padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500, marginTop: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16, alignItems: 'center' }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: A.green, fontSize: 13.5, fontWeight: 600 }}>
            <Icon name="check" size={15} color={A.green} /> Enregistré !
          </div>
        )}
        <ABtn variant="navy" onClick={handleSave} disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </ABtn>
      </div>
    </ACard>
  )
}

// ─── Palmarès ─────────────────────────────────────────────────────────────────
const PAL_INIT = { annee: '', titre: '', competition: '', description: '', ordre: '0' }

function PalmaresSection() {
  const [items, setItems]     = useState<PalmaresItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<PalmaresItem | null>(null)
  const [form, setForm]       = useState(PAL_INIT)
  const [saving, setSaving]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/palmares'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(PAL_INIT); setModal(true) }
  const openEdit   = (p: PalmaresItem) => {
    setEditing(p)
    setForm({ annee: p.annee, titre: p.titre, competition: p.competition, description: p.description || '', ordre: String(p.ordre) })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, ordre: Number(form.ordre) }
      if (editing)
        await fetch(`/api/palmares/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      else
        await fetch('/api/palmares', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await load(); setModal(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet élément du palmarès ?')) return
    await fetch(`/api/palmares/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Année', key: 'annee', render: p => (
      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, color: A.red }}>
        {p.annee as string}
      </span>
    )},
    { label: 'Titre', key: 'titre', render: p => <span style={{ fontWeight: 600 }}>{p.titre as string}</span> },
    { label: 'Compétition', key: 'competition', render: p => (
      <span style={{ background: A.bg, color: A.textSec, padding: '3px 9px', borderRadius: 99, fontSize: 12 }}>
        {p.competition as string}
      </span>
    )},
    { label: 'Description', key: 'description', wrap: true, render: p => (
      <span style={{ color: A.muted, fontSize: 12.5 }}>{(p.description as string) || '—'}</span>
    )},
    { label: '', key: 'actions', right: true, render: p => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(p as unknown as PalmaresItem)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((p as PalmaresItem).id)} danger />
      </div>
    )},
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri }}>
          Palmarès
        </div>
        <ABtn variant="navy" onClick={openCreate}>+ Ajouter un titre</ABtn>
      </div>

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, color: A.muted, fontSize: 12.5 }}>
          {items.length} titre{items.length !== 1 ? 's' : ''}
        </div>
        {loading
          ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={items as unknown as Record<string, unknown>[]} />
        }
      </ACard>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le titre' : 'Nouveau titre au palmarès'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
          <AInput label="Année *" value={form.annee} onChange={e => setForm({ ...form, annee: e.target.value })} placeholder="ex. 2014" required />
          <AInput label="Titre *" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="ex. Champion de France" required />
        </div>
        <AInput label="Compétition *" value={form.competition} onChange={e => setForm({ ...form, competition: e.target.value })} placeholder="ex. Nationale 1" required />
        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Contexte, anecdotes…" />
        <AInput label="Ordre d'affichage" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={() => setModal(false)}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </>
  )
}

// ─── Staff ────────────────────────────────────────────────────────────────────
const STAFF_INIT = { nom: '', role: '', depuis: '', equipeNom: '', description: '', photoUrl: '', actif: true, ordre: '0' }

function StaffSection() {
  const [items, setItems]         = useState<StaffMembre[]>([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState<StaffMembre | null>(null)
  const [form, setForm]           = useState(STAFF_INIT)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetch('/api/staff'); setItems(await r.json()) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm(STAFF_INIT); setError(null); setModal(true) }
  const openEdit   = (s: StaffMembre) => {
    setEditing(s); setError(null)
    setForm({ nom: s.nom, role: s.role, depuis: s.depuis || '', equipeNom: s.equipeNom || '', description: s.description || '', photoUrl: s.photoUrl || '', actif: s.actif, ordre: String(s.ordre) })
    setModal(true)
  }
  const closeModal = () => { setModal(false); setError(null) }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    try {
      const compressed = await compressImage(file, 800, 0.85)
      const res  = await fetch('/api/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: compressed, filename: file.name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur upload'); return }
      setForm(prev => ({ ...prev, photoUrl: data.url }))
    } catch { setError("Erreur lors de l'upload") } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!form.nom.trim() || !form.role.trim()) { setError('Nom et rôle requis'); return }
    setSaving(true); setError(null)
    try {
      const body   = { ...form, ordre: Number(form.ordre), photoUrl: form.photoUrl || null }
      const url    = editing ? `/api/staff/${editing.id}` : '/api/staff'
      const method = editing ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data   = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur serveur'); return }
      await load(); closeModal()
    } catch { setError('Erreur réseau') } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce membre du staff ?')) return
    await fetch(`/api/staff/${id}`, { method: 'DELETE' }); await load()
  }

  const cols: Col[] = [
    { label: 'Membre', key: 'nom', render: s => {
      const st = s as unknown as StaffMembre
      const initials = st.nom.split(' ').map((w: string) => w[0]).join('')
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: A.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8D6E8', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 14 }}>
            {st.photoUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={st.photoUrl} alt={st.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{st.nom}</div>
            <div style={{ fontSize: 12, color: A.muted }}>{st.role}</div>
          </div>
        </div>
      )
    }},
    { label: 'Équipe', key: 'equipeNom', render: s => <span>{((s as unknown as StaffMembre).equipeNom) || '—'}</span> },
    { label: 'Depuis',  key: 'depuis',   render: s => <span>{((s as unknown as StaffMembre).depuis)   || '—'}</span> },
    { label: 'Statut',  key: 'actif',    render: s => {
      const actif = (s as unknown as StaffMembre).actif
      return (
        <span style={{ background: actif ? '#ECFDF5' : '#FFF1F2', color: actif ? '#065F46' : '#BE123C', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
          {actif ? 'Actif' : 'Inactif'}
        </span>
      )
    }},
    { label: '', key: 'actions', right: true, render: s => (
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconBtn icon="edit"  title="Modifier"  onClick={() => openEdit(s as unknown as StaffMembre)} color={A.blue} />
        <IconBtn icon="trash" title="Supprimer" onClick={() => handleDelete((s as unknown as StaffMembre).id)} danger />
      </div>
    )},
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, color: A.textPri }}>
          Staff technique
        </div>
        <ABtn variant="navy" onClick={openCreate}>+ Ajouter un membre</ABtn>
      </div>

      <ACard noPad>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${A.border}`, color: A.muted, fontSize: 12.5 }}>
          {items.length} membre{items.length !== 1 ? 's' : ''}
        </div>
        {loading
          ? <div style={{ textAlign: 'center', padding: 48, color: A.muted }}>Chargement…</div>
          : <ATable cols={cols} rows={items as unknown as Record<string, unknown>[]} />
        }
      </ACard>

      <Modal open={modal} onClose={closeModal} title={editing ? `Modifier — ${editing.nom}` : 'Nouveau membre du staff'}>
        <div className="rsp-form-2col">
          <AInput label="Nom complet *"  value={form.nom}  onChange={e => setForm({ ...form, nom: e.target.value })}  placeholder="ex. Marc Villeneuve"    required />
          <AInput label="Rôle / Poste *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="ex. Entraîneur principal" required />
        </div>
        <div className="rsp-form-2col">
          <AInput label="Équipe encadrée" value={form.equipeNom} onChange={e => setForm({ ...form, equipeNom: e.target.value })} placeholder="ex. Nationale 1" />
          <AInput label="Depuis"          value={form.depuis}    onChange={e => setForm({ ...form, depuis: e.target.value })}    placeholder="ex. Depuis 2018" />
        </div>
        <AInput label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Courte biographie…" />

        {/* Photo */}
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: A.textSec, display: 'block', marginBottom: 6 }}>
            Photo du membre
          </label>
          {form.photoUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${A.border}`, background: A.navy }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.photoUrl} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: A.textSec, marginBottom: 6 }}>Photo sélectionnée</div>
                <button onClick={() => setForm({ ...form, photoUrl: '' })} style={{ background: 'none', border: `1px solid ${A.border}`, borderRadius: A.r6, padding: '4px 10px', fontSize: 12, color: A.red, cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }}>
                  Supprimer la photo
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => !uploading && fileRef.current?.click()} style={{ border: `2px dashed ${uploading ? A.blue : A.border}`, borderRadius: A.r8, padding: '18px 16px', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer', background: A.bg, transition: 'border-color 0.2s' }}>
              {uploading ? (
                <div style={{ color: A.blue, fontSize: 13, fontWeight: 500 }}>Upload en cours…</div>
              ) : (
                <>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>👤</div>
                  <div style={{ fontSize: 13, color: A.textSec, fontWeight: 500 }}>Cliquer pour choisir une photo</div>
                  <div style={{ fontSize: 11.5, color: A.muted, marginTop: 3 }}>JPG, PNG, WebP — compressée automatiquement</div>
                </>
              )}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>

        <div className="rsp-form-2col">
          <AInput label="Ordre d'affichage" type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} />
          <ASelect label="Statut" value={form.actif ? 'true' : 'false'} onChange={e => setForm({ ...form, actif: e.target.value === 'true' })} options={[{ value: 'true', label: 'Actif' }, { value: 'false', label: 'Inactif' }]} />
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: A.r8, padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <ABtn variant="ghost" onClick={closeModal}>Annuler</ABtn>
          <ABtn variant="navy" onClick={handleSave} disabled={saving || uploading || !form.nom.trim() || !form.role.trim()}>
            {saving ? 'Enregistrement…' : uploading ? 'Upload…' : 'Enregistrer'}
          </ABtn>
        </div>
      </Modal>
    </>
  )
}
