import { useLocation } from 'react-router-dom'
import { NEWS, TAG_STYLES, EDITORIAS, RECENT_VIDEOS } from '../data'
import NewsCard from '../components/NewsCard'
import AdBanner from '../components/AdBanner'
import VideoCard from '../components/VideoCard'
import EditoriaCard from '../components/EditoriaCard'

const CATEGORY_MAP = {
  '/noticias': 'Notícias',
  '/cultura':  'Cultura',
  '/eventos':  'Eventos',
  '/esportes': 'Esportes',
  '/turismo':  'Turismo',
  '/economia': 'Economia',
}

export default function CategoryPage() {
  const { pathname } = useLocation()
  const category = CATEGORY_MAP[pathname] || 'Notícias'
  const tagStyle  = TAG_STYLES[category] || TAG_STYLES['Notícias']
  const editoria  = EDITORIAS.find(e => e.label === category)
  const news      = NEWS.filter(n => n.category === category)
  const otherNews = NEWS.filter(n => n.category !== category).slice(0, 4)

  const featured = news[0]
  const rest     = news.slice(1)

  return (
    <>
      {/* Banner topo */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center', padding: '10px 2rem' }}>
        <AdBanner type="billboard" />
      </div>

      {/* Cabeçalho da editoria */}
      <div style={{ background: editoria?.bg || 'var(--blue-light)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
            <span style={{ fontSize: 26 }}>{editoria?.icon || '📰'}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tagStyle.color, marginBottom: 4 }}>Editoria</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>{category}</h1>
            {editoria?.description && <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>{editoria.description}</p>}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.75rem', color: tagStyle.color, background: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              {news.length} matérias
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>

        {/* Coluna principal */}
        <div>
          {news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', background: 'var(--surface)', borderRadius: 12 }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>📭</div>
              Nenhuma notícia disponível nessa categoria ainda.
            </div>
          ) : (
            <>
              {/* Destaque */}
              {featured && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                  <NewsCard news={featured} featured={true} />
                </div>
              )}

              {/* Grid restante */}
              {rest.length > 0 && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px', background: 'var(--border)',
                  border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
                }}>
                  {rest.map(n => <NewsCard key={n.id} news={n} />)}
                </div>
              )}
            </>
          )}

          {/* Banner leaderboard */}
          <div style={{ marginTop: '1.5rem' }}>
            <AdBanner type="leaderboard" />
          </div>

          {/* Outras editorias */}
          {otherNews.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)' }}>Leia também</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                {otherNews.map(n => <NewsCard key={n.id} news={n} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar direita */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AdBanner type="square" />

          {/* Vídeos recentes */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              Vídeos recentes <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {RECENT_VIDEOS.slice(0, 3).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>

          <AdBanner type="square" />

          {/* Outras editorias */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              Editorias <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EDITORIAS.filter(e => e.label !== category).map(ed => (
                <a key={ed.slug} href={`/${ed.slug}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
                  background: '#fff', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ed.color; e.currentTarget.style.background = ed.bg }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: ed.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{ed.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{ed.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{NEWS.filter(n => n.category === ed.label).length} matérias</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ed.color} strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
