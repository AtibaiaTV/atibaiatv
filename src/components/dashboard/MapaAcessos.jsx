/* Mapa dos acessos sem depender de biblioteca ou de mapa externo.

   As coordenadas de cada cidade são projetadas direto num retângulo que cobre o
   Brasil (projeção equiretangular simples). Quem cair fora dessa faixa aparece
   na lista lateral, não no mapa — em vez de ser jogado numa borda qualquer. */

const OESTE = -74, LESTE = -34, NORTE = 6, SUL = -34

function posicao(lat, lon) {
  return {
    x: ((lon - OESTE) / (LESTE - OESTE)) * 100,
    y: ((NORTE - lat) / (NORTE - SUL)) * 100,
  }
}

export default function MapaAcessos({ cidades }) {
  const noBrasil = cidades.filter(c =>
    c.lat != null && c.lon != null && c.lat <= NORTE && c.lat >= SUL && c.lon >= OESTE && c.lon <= LESTE
  )
  const maior = Math.max(...cidades.map(c => c.count || 0), 1)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem', alignItems: 'start' }}>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '1 / 1',
        background: '#eef3fa', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden',
      }}>
        {/* linhas de referência: equador e trópico de capricórnio */}
        {[{ lat: 0, rot: 'Equador' }, { lat: -23.44, rot: 'Trópico de Capricórnio' }].map(l => (
          <div key={l.rot} style={{ position: 'absolute', left: 0, right: 0, top: posicao(l.lat, 0).y + '%', borderTop: '1px dashed #c9d6e8' }}>
            <span style={{ position: 'absolute', left: 6, top: 2, fontSize: '0.55rem', color: '#9db2cd' }}>{l.rot}</span>
          </div>
        ))}

        {noBrasil.map(c => {
          const p = posicao(c.lat, c.lon)
          const d = 8 + (c.count / maior) * 26
          return (
            <div key={c.id} title={c.cidade + ' — ' + c.count + ' acessos'} style={{
              position: 'absolute', left: p.x + '%', top: p.y + '%',
              width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2,
              borderRadius: '50%', background: 'rgba(205,0,0,0.55)', border: '1.5px solid #Cd0000',
            }} />
          )
        })}

        {noBrasil.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9db2cd', fontSize: '0.78rem', textAlign: 'center', padding: '1rem' }}>
            Ainda não há acessos com localização registrada.
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>CIDADES</div>
        {cidades.length === 0 && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sem dados ainda.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
          {cidades.slice(0, 20).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem' }}>
              <span style={{ flex: 1, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.cidade}{c.estado ? '/' + c.estado : ''}
              </span>
              <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{(c.count || 0).toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
