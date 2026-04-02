import { useParams, useLocation, Link } from 'react-router-dom'
import { NEWS, TAG_STYLES } from '../data'
import NewsCard from '../components/NewsCard'
import AdBanner from '../components/AdBanner'
import VideoCard from '../components/VideoCard'
import { RECENT_VIDEOS } from '../data'

// Texto de exemplo para o artigo (em produção viria do CMS)
const LOREM = `Atibaia, uma das cidades mais charmosas do interior paulista, continua investindo no desenvolvimento urbano e na qualidade de vida dos seus moradores. A administração municipal apresentou nesta semana um ambicioso plano de obras e melhorias que promete transformar a paisagem e a infraestrutura da cidade nos próximos anos.

O projeto, desenvolvido em parceria com empresas especializadas e aprovado pela Câmara Municipal, prevê intervenções em diversas áreas da cidade, com foco no centro histórico, que receberá o maior volume de investimentos. A revitalização contempla a recuperação de calçadas, instalação de nova iluminação pública em LED, criação de áreas de convivência e melhorias na mobilidade urbana.

"Este é um passo importante para o desenvolvimento sustentável de Atibaia. Estamos investindo no futuro da nossa cidade, preservando nossa história e melhorando a qualidade de vida de todos os moradores", destacou o secretário de obras em entrevista coletiva.

Além das obras no centro, o plano também contempla a construção de novas ciclovias conectando bairros residenciais ao centro comercial, ampliação de parques e áreas verdes, e a instalação de novos equipamentos urbanos como bancos, lixeiras e totens informativos turísticos.

Os moradores podem acompanhar o andamento das obras pelo aplicativo municipal e pelo portal transparência da prefeitura, onde serão publicadas atualizações mensais sobre o cronograma e os gastos.`

export default function ArticlePage() {
  const { id } = useParams()
  const news = NEWS.find(n => n.id === Number(id)) || NEWS[0]
  const tagStyle = TAG_STYLES[news.category] || TAG_STYLES['Notícias']
  const related  = NEWS.filter(n => n.category === news.category && n.id !== news.id).slice(0, 4)

  const CARD_BG = {
    blue:   'linear-gradient(135deg, #eef3fa, #c8d8ef)',
    purple: 'linear-gradient(135deg, #f3eafa, #ddd0f5)',
    green:  'linear-gradient(135deg, #edf7e8, #c0e4a8)',
    orange: 'linear-gradient(135deg, #fff7e0, #fde8bb)',
    teal:   'linear-gradient(135deg, #e6f7f5, #a8e0d8)',
    red:    'linear-gradient(135deg, #faeaea, #f0b8b8)',
  }

  return (
    <>
      {/* Banner topo */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center', padding: '10px 2rem' }}>
        <AdBanner type="billboard" src="/banners/prefeitura-abril26/billboard.gif" />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>

        {/* Artigo */}
        <article>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
            <Link to="/" style={{ color: 'var(--blue)' }}>Início</Link>
            <span>›</span>
            <Link to={`/${news.category.toLowerCase()}`} style={{ color: 'var(--blue)' }}>{news.category}</Link>
            <span>›</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{news.title}</span>
          </nav>

          {/* Tag + título */}
          <span style={{ display: 'inline-block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, marginBottom: 14, background: tagStyle.bg, color: tagStyle.color }}>
            {news.category}
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: '1rem' }}>
            {news.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: tagStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: tagStyle.color, flexShrink: 0 }}>
              {(news.author || 'Redação')[0]}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{news.author || 'Redação Atibaia TV'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{news.time} · 4 min de leitura</div>
            </div>
            {/* Compartilhar */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {[
                { label: 'WhatsApp', color: '#25d366' },
                { label: 'Facebook', color: '#1877f2' },
                { label: 'Twitter', color: '#1da1f2' },
              ].map(({ label, color }) => (
                <button key={label} style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 500,
                  border: `1px solid ${color}`, background: 'transparent', color, cursor: 'pointer',
                  transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = color }}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* Imagem de capa */}
          <div style={{ width: '100%', height: 340, borderRadius: 10, marginBottom: '1.5rem', background: CARD_BG[news.color] || CARD_BG.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', opacity: 0.3 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={tagStyle.color} strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
              <div style={{ fontSize: '0.75rem', color: tagStyle.color, marginTop: 8 }}>Foto: Atibaia TV</div>
            </div>
          </div>

          {/* Corpo do texto */}
          <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#374151' }}>
            {LOREM.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1.25rem' }}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Tags:</span>
            {['Atibaia', news.category, 'Prefeitura', 'Região'].map(tag => (
              <span key={tag} style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}>{tag}</span>
            ))}
          </div>

          {/* Banner no meio */}
          <div style={{ margin: '2rem 0' }}>
            <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
          </div>

          {/* Relacionadas */}
          {related.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)' }}>Leia também</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                {related.map(n => <NewsCard key={n.id} news={n} />)}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AdBanner type="square" src="/banners/prefeitura-abril26/square.gif" />

          {/* Vídeos */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              Vídeos <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {RECENT_VIDEOS.slice(0, 3).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>

          <AdBanner type="square" src="/banners/prefeitura-abril26/square.gif" />
        </aside>
      </div>
    </>
  )
}
