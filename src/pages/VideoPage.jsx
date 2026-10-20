import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { trackPageView } from '../hooks/usePageViews'

const SITE_URL = 'https://www.atibaiatv.com.br'

function toDate(value) {
  if (!value) return null
  const d = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  return isNaN(d.getTime()) ? null : d
}

/* duracao em segundos -> formato ISO 8601 que o Google pede (PT9M42S) */
function isoDuration(seconds) {
  if (!seconds) return undefined
  return 'PT' + Math.floor(seconds / 60) + 'M' + (seconds % 60) + 'S'
}

function excerpt(text, max = 160) {
  const t = (text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

export default function VideoPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trackPageView('video-' + id)
    getDoc(doc(db, 'videos', id)).then(snap => {
      if (snap.exists()) setVideo({ id: snap.id, ...snap.data() })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>
  if (!video || !video.videoUrl) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Video nao encontrado.</div>

  const published = toDate(video.createdAt)
  const description = excerpt(video.description) || 'Video da Atibaia TV, a TV da sua cidade.'
  const canonicalUrl = SITE_URL + '/video/' + video.id
  const imageUrl = video.thumbnailUrl || SITE_URL + '/logo.png'
  const paragraphs = (video.description || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description,
    thumbnailUrl: [imageUrl],
    uploadDate: published ? published.toISOString() : undefined,
    contentUrl: video.videoUrl,
    duration: isoDuration(video.durationSeconds),
    publisher: {
      '@type': 'Organization',
      name: 'Atibaia TV',
      logo: { '@type': 'ImageObject', url: SITE_URL + '/logos/logo-icon.png' },
    },
  }

  return (
    <>
      <Helmet>
        <title>{video.title + ' - Atibaia TV'}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="video.other" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:video" content={video.videoUrl} />
        <meta property="og:site_name" content="Atibaia TV" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="atv-container atv-section-pad" style={{ maxWidth: 900 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--blue)' }}>Inicio</Link>
          <span>&gt;</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{video.title}</span>
        </nav>

        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1.25, color: '#1a1a2e', margin: '0 0 0.6rem' }}>{video.title}</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 1.25rem' }}>
          {published && published.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          {published && video.duration ? ' · ' : ''}
          {video.duration}
        </p>

        <video
          src={video.videoUrl}
          poster={video.thumbnailUrl || undefined}
          controls
          playsInline
          preload="metadata"
          style={{ width: '100%', maxHeight: '75vh', background: '#000', borderRadius: 10, display: 'block' }}
        />

        {paragraphs.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', margin: '0 0 1rem', whiteSpace: 'pre-line' }}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
