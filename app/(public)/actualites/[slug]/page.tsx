import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { C, R, MAX_W } from '@/components/public/ui'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let article = null
  try {
    article = await prisma.article.findFirst({
      where: { slug, statut: 'published' },
    })
    if (article) {
      await prisma.article.update({
        where: { id: article.id },
        data: { vues: { increment: 1 } },
      })
    }
  } catch {}

  if (!article) notFound()

  const dateStr = article.publishedAt || article.createdAt
  const date = new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div style={{ background: C.offWhite, minHeight: '100vh', paddingBottom: 80 }}>
      {/* Image de couverture */}
      <div style={{
        height: 320, background: `linear-gradient(135deg, ${C.navy} 0%, #1a3568 100%)`,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
      }}>
        {article.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.imageUrl} alt={article.titre}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
        )}
        <div style={{ position: 'relative', zIndex: 2, ...MAX_W, width: '100%', padding: '0 28px 32px' }}>
          {article.categorie && (
            <span style={{
              background: C.red, color: '#fff', padding: '4px 12px', borderRadius: 4,
              fontSize: 11, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif",
              letterSpacing: 1.5, textTransform: 'uppercase', display: 'inline-block', marginBottom: 12,
            }}>{article.categorie}</span>
          )}
          <h1 style={{
            color: '#fff', fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 900, fontSize: 'clamp(28px,5vw,52px)', margin: 0, lineHeight: 1.1,
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>{article.titre}</h1>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ ...MAX_W, padding: '40px 28px 0' }}>
        {/* Bouton retour + date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: C.navy, fontSize: 13.5, fontWeight: 600,
            fontFamily: "'Barlow',sans-serif", textDecoration: 'none',
          }}>
            ← Retour à l'accueil
          </a>
          <span style={{ color: C.muted, fontSize: 13 }}>{date}</span>
        </div>

        {/* Corps de l'article */}
        <div style={{
          background: '#fff', borderRadius: R.card,
          padding: 'clamp(24px,5vw,48px)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          maxWidth: 800, margin: '0 auto',
        }}>
          {article.extrait && (
            <p style={{
              color: C.navy, fontSize: 17, fontWeight: 600, lineHeight: 1.6,
              margin: '0 0 28px', paddingBottom: 28,
              borderBottom: `2px solid ${C.offWhite}`,
            }}>{article.extrait}</p>
          )}
          <div style={{ color: '#374151', fontSize: 15.5, lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
            {article.contenu}
          </div>
        </div>
      </div>
    </div>
  )
}
