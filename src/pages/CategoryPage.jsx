import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { TAG_STYLES, EDITORIAS } from '../data'
import useArticles from '../hooks/useArticles'
import useVideos from '../hooks/useVideos'
import useBanners from '../hooks/useBanners'
import { trackPageView } from '../hooks/usePageViews'
import NewsCard from '../components/NewsCard'
import AdBanner from '../components/AdBanner'
import VideoCard from '../components/VideoCard'

const CATEGORY_MAP = {
  '/noticias': 'Noticias',
  '/cultura': 'Cultura',
  '/eventos': 'Eventos',
  '/esportes': 'Esportes',
  '/turismo': 'Turismo',
  '/economia': 'Economia',
  '/seguranca': 'Seguranca Publica',
  '/mobilidade': 'Mobilidade',
}

export default function CategoryPage() {
  const { pathname } = useLocation()
  const category = CATEGORY_MAP[pathname] || 'Noticias'
  const tagStyle = TAG_STYLES[category] || TAG_STYLES['Noticias']
  const editoria = EDITORIAS.find(e => e.label === category)
  const { articles: news, loading } = useArticles(category)
  const { videos } = useVideos()
  const { getBanner } = useBanners()
  const otherArticles = []
  const featured = news[0]
  const rest = news.slice(1)
  const billboard = getBanner('billboard')
  const square = getBanner('square')

  useEffect(() => { trackPageView('category-' + pathname.replace('/', '')) }, [pathname])

  return (
    <>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center', padding: '10px 2rem' }}>
        <AdBanner type="billboard" src={billboard ? billboard.mediaUrl : '/banners/prefeitura-abril26/billboard.gif'} />
      </div>

      <div style={{ background: editoria?.bg || 'var(--blue-light)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.08)', fontSize: 26 }}>
            {editoria?.icon || '📰'}
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tagStyle.color, marginBottom: 4 }}>Editoria</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>{category}</h1>
            {editoria?.description && <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>{editoria.description}</p>}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.75rem', color: tagStyle.color, background: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              {news.length} materias
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Carregando...</div>
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', background: 'var(--surface)', borderRadius: 12 }}>
              Nenhuma noticia disponivel nessa categoria ainda.
            </div>
          ) : (
            <>
              {featured && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                  <NewsCard news={featured} featured={true} />
                </div>
              )}
              {rest.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  {rest.map(n => <NewsCard key={n.id} news={n} />)}
                </div>
              )}
            </>
          )}
          <div style={{ marginTop: '1.5rem' }}>
            <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              Videos recentes <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {videos.slice(0, 3).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
          <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 12 }}>Editorias</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EDITORIAS.filter(e => e.label !== category).map(ed => (
                <a key={ed.slug} href={'/' + ed.slug} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', textDecoration: 'none', transition: 'all .2s' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: ed.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{ed.icon}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{ed.label}</div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
