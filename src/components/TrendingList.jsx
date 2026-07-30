import { Link } from 'react-router-dom'

var abaStyle = function(ativa) {
  return {
    border: 'none', background: 'none', cursor: 'pointer', padding: '2px 0',
    fontSize: '0.78rem', fontWeight: ativa ? 700 : 500,
    color: ativa ? '#1a1a2e' : '#9ca3af',
    borderBottom: ativa ? '2px solid #Cd0000' : '2px solid transparent',
  }
}

export default function TrendingList({ items, aba, onTrocarAba, vazio }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '2px solid #1a1a2e', display: 'flex', gap: 16 }}>
        <button onClick={function() { onTrocarAba('lidas') }} style={abaStyle(aba === 'lidas')}>Mais lidas</button>
        <button onClick={function() { onTrocarAba('recentes') }} style={abaStyle(aba === 'recentes')}>Mais recentes</button>
      </div>

      {(!items || items.length === 0) && (
        <p style={{ fontSize: '0.76rem', color: '#9ca3af', padding: '1rem 1.1rem', lineHeight: 1.5, margin: 0 }}>
          {vazio || 'Sem dados ainda.'}
        </p>
      )}
      <div>
        {(items || []).map(function(news, i) {
          return (
            <Link key={news.id} to={'/artigo/' + news.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1.1rem',
              textDecoration: 'none', borderBottom: i < items.length - 1 ? '1px solid #f3f4f6' : 'none',
              transition: 'background .15s',
            }}
            onMouseEnter={function(e) { e.currentTarget.style.background = '#fafbfc' }}
            onMouseLeave={function(e) { e.currentTarget.style.background = '#fff' }}
            >
              <span style={{
                fontSize: '1.3rem', fontWeight: 800, color: i < 3 ? '#Cd0000' : '#d1d5db',
                width: 28, flexShrink: 0, lineHeight: 1, fontStyle: 'italic',
              }}>{i + 1}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.84rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.35 }}>
                  {news.title}
                </span>
                {aba === 'lidas' && news.acessos > 0 && (
                  <span style={{ display: 'block', fontSize: '0.68rem', color: '#9ca3af', marginTop: 3 }}>
                    {news.acessos.toLocaleString('pt-BR')} {news.acessos === 1 ? 'leitura' : 'leituras'}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
