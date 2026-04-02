import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../firebase'
import DashCard from '../../components/dashboard/DashCard'
import { seedFirestore } from '../../utils/seedFirestore'
import { Link } from 'react-router-dom'

export default function DashboardHome() {
  const [stats, setStats] = useState({ articles: 0, videos: 0, banners: 0, totalViews: 0 })
  const [recentArticles, setRecentArticles] = useState([])
  const [topPages, setTopPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [articlesSnap, videosSnap, bannersSnap, viewsSnap] = await Promise.all([
          getDocs(collection(db, 'articles')),
          getDocs(collection(db, 'videos')),
          getDocs(collection(db, 'banners')),
          getDocs(collection(db, 'pageViews')),
        ])

        let totalViews = 0
        const pages = []
        viewsSnap.forEach(doc => {
          const data = doc.data()
          totalViews += data.count || 0
          pages.push({ id: doc.id, count: data.count || 0 })
        })
        pages.sort((a, b) => b.count - a.count)

        setStats({
          articles: articlesSnap.size,
          videos: videosSnap.size,
          banners: bannersSnap.size,
          totalViews,
        })
        setTopPages(pages.slice(0, 10))

        const recentQ = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(5))
        const recentSnap = await getDocs(recentQ)
        setRecentArticles(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>
  }

  const maxViews = Math.max(...topPages.map(p => p.count), 1)

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>Visao Geral</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <DashCard icon="📰" label="Materias" value={stats.articles} color="#4971B1" />
        <DashCard icon="🎬" label="Videos" value={stats.videos} color="#67AA4D" />
        <DashCard icon="🖼️" label="Banners" value={stats.banners} color="#c47a00" />
        <DashCard icon="👁️" label="Visualizacoes" value={stats.totalViews.toLocaleString('pt-BR')} color="#Cd0000" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Top pages chart */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Paginas Mais Visitadas</h2>
          {topPages.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>Nenhum dado de visualizacao ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topPages.map(page => (
                <div key={page.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', width: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {page.id}
                  </span>
                  <div style={{ flex: 1, height: 20, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(page.count / maxViews) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #4971B1, #67AA4D)', borderRadius: 4, transition: 'width .5s' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#374151', minWidth: 40, textAlign: 'right' }}>
                    {page.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent articles */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a2e' }}>Materias Recentes</h2>
            <Link to="/dashboard/articles" style={{ fontSize: '0.72rem', color: '#4971B1', textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          {recentArticles.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>Nenhuma materia publicada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentArticles.map(a => (
                <Link key={a.id} to={`/dashboard/articles/${a.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  borderRadius: 8, border: '1px solid #f3f4f6', textDecoration: 'none',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>{a.title}</div>
                    <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: 2 }}>{a.category} · {a.author}</div>
                  </div>
                  {a.featured && <span style={{ fontSize: '0.6rem', background: '#eef3fa', color: '#4971B1', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Destaque</span>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
