import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { EDITORIAS } from '../data'
import useArticles from '../hooks/useArticles'
import useVideos from '../hooks/useVideos'
import useBanners from '../hooks/useBanners'
import { trackPageView } from '../hooks/usePageViews'
import NewsCard from '../components/NewsCard'
import AdBanner from '../components/AdBanner'
import BannerCarousel from '../components/BannerCarousel'
import VideoCard from '../components/VideoCard'
import SidebarWidgets from '../components/SidebarWidgets'

const CATEGORY_MAP = {
  '/noticias':   'Notícias',
  '/cultura':    'Cultura',
  '/eventos':    'Eventos',
  '/esportes':   'Esportes',
  '/turismo':    'Turismo',
  '/economia':   'Economia',
  '/seguranca':  'Segurança Pública',
  '/mobilidade': 'Mobilidade',
  '/educacao':  'Educação',
  '/saude':     'Saúde',
  '/politica':  'Política',
  '/brasil':    'Brasil',
  '/mundo':     'Mundo',
  '/cidade':    'Cidade',
  '/zeladoria': 'Zeladoria',
  '/alimentacao': 'Alimentação',
  '/regiao': 'Região',
  '/horoscopo': 'Horóscopo',
}

var PAGE_SIZE = 12

export default function CategoryPage() {
  const { pathname } = useLocation()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const slug = pathname.slice(1)
  const category = CATEGORY_MAP[pathname] || 'Notícias'
  const editoria = EDITORIAS.find(e => e.slug === slug)
  const tagStyle = { bg: editoria?.bg || '#eef3fa', color: editoria?.color || '#4971B1' }
  const { articles: news, loading } = useArticles(category)
  const { videos } = useVideos()
  const { banners } = useBanners()
  const featured = news[0]
  const rest = news.slice(1)
  /* cada espaco roda entre todos os banners ativos do seu tipo, em vez de travar
     sempre no primeiro cadastrado e esconder os demais */
  const billboardBanners = banners.filter(b => b.type === 'billboard')
  const squareBanners = banners.filter(b => b.type === 'square')
  const leaderboardBanners = banners.filter(b => b.type === 'leaderboard')

  useEffect(() => { trackPageView('category-' + slug) }, [slug])
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [slug])

  return (
    <>
      {billboardBanners.length > 0 && (
        <div className="atv-banner-wrap" style={{ display: 'flex', justifyContent: 'center', background: '#f4f5f7', borderBottom: '1px solid #e5e7eb' }}>
          <BannerCarousel type="billboard" banners={billboardBanners} />
        </div>
      )}

      <div style={{ background: editoria?.bg || 'var(--blue-light)', borderBottom: '1px solid var(--border)', padding: '1.5rem 1rem' }}>
        <div className="atv-container" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.08)', fontSize: 24, flexShrink: 0 }}>
            {editoria?.icon || '📰'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>{editoria?.label || category}</h1>
            {editoria?.description && <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>{editoria.description}</p>}
          </div>
          <span style={{ fontSize: '0.75rem', color: tagStyle.color, background: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>
            {news.length} materias
          </span>
        </div>
      </div>

      <div className="atv-container atv-grid-article atv-section-pad">
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Carregando...</div>
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', background: 'var(--surface)', borderRadius: 12 }}>
              Nenhuma noticia disponivel nessa categoria.
            </div>
          ) : (
            <>
              {featured && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                  <NewsCard news={featured} featured={true} />
                </div>
              )}
              {rest.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  {rest.slice(0, visibleCount).map((n, i) => <NewsCard key={n.id} news={n} highlight={i > 0 && i % 4 === 0} />)}
                </div>
              )}
              {visibleCount < rest.length && (
                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button onClick={() => setVisibleCount(c => c + PAGE_SIZE)} style={{
                    padding: '10px 28px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff',
                    color: '#4971B1', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                  }}>
                    Carregar mais noticias
                  </button>
                </div>
              )}
            </>
          )}
          {leaderboardBanners.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <BannerCarousel type="leaderboard" banners={leaderboardBanners} />
            </div>
          )}
        </div>

        <aside className="atv-sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <SidebarWidgets />
          {squareBanners.length > 0
            ? <BannerCarousel banners={squareBanners} width={300} height={300} />
            : <AdBanner type="square" src="/banners/prefeitura-abril26/square.gif" />}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#Cd0000', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              Videos recentes <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {videos.slice(0, 3).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
          {squareBanners.length > 0
            ? <BannerCarousel banners={squareBanners} width={300} height={300} />
            : <AdBanner type="square" src="/banners/prefeitura-abril26/square.gif" />}
        </aside>
      </div>
    </>
  )
}
