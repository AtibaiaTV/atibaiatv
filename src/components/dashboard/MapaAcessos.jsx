import { useEffect, useRef, useState } from 'react'

/* Mapa real dos acessos, com Leaflet e ladrilhos do OpenStreetMap.

   A biblioteca entra por import dinâmico de propósito: ela só é baixada quando
   alguém abre o painel, e não pesa no carregamento do site público. */

export default function MapaAcessos({ cidades }) {
  const divRef = useRef(null)
  const mapaRef = useRef(null)
  const camadaRef = useRef(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let cancelado = false

    async function montar() {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')
        if (cancelado || !divRef.current) return

        if (!mapaRef.current) {
          mapaRef.current = L.map(divRef.current, { scrollWheelZoom: false })
            .setView([-15.8, -47.9], 4)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 18,
          }).addTo(mapaRef.current)
          camadaRef.current = L.layerGroup().addTo(mapaRef.current)
        }

        const L2 = L
        camadaRef.current.clearLayers()

        const comCoord = cidades.filter(c => c.lat != null && c.lon != null)
        if (comCoord.length === 0) return

        const maior = Math.max(...comCoord.map(c => c.count || 0), 1)

        comCoord.forEach(c => {
          const raio = 8 + (c.count / maior) * 22
          L2.circleMarker([c.lat, c.lon], {
            radius: raio,
            color: '#Cd0000',
            weight: 2,
            fillColor: '#Cd0000',
            fillOpacity: 0.45,
          })
            .bindPopup('<b>' + c.cidade + (c.estado ? '/' + c.estado : '') + '</b><br>' +
              (c.count || 0).toLocaleString('pt-BR') + ' acesso' + (c.count === 1 ? '' : 's'))
            .addTo(camadaRef.current)
        })

        /* enquadra todos os pontos; com um só, mantém um zoom que ainda mostra
           a região em volta, senão o mapa "cola" na rua da pessoa */
        const limites = L2.latLngBounds(comCoord.map(c => [c.lat, c.lon]))
        mapaRef.current.fitBounds(limites, { padding: [30, 30], maxZoom: 9 })
      } catch (e) {
        console.error(e)
        if (!cancelado) setErro(true)
      }
    }

    montar()
    return () => { cancelado = true }
  }, [cidades])

  useEffect(() => {
    return () => {
      if (mapaRef.current) { mapaRef.current.remove(); mapaRef.current = null }
    }
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem', alignItems: 'start' }}>
      <div style={{ position: 'relative', width: '100%', height: 360, borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', background: '#eef3fa' }}>
        <div ref={divRef} style={{ width: '100%', height: '100%' }} />

        {(erro || cidades.length === 0) && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#eef3fa', color: '#7d93b2', fontSize: '0.78rem', textAlign: 'center', padding: '1rem',
          }}>
            {erro
              ? 'Não foi possível carregar o mapa. A lista de cidades ao lado continua valendo.'
              : 'Ainda não há acessos com localização registrada.'}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>CIDADES</div>
        {cidades.length === 0 && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sem dados ainda.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 330, overflowY: 'auto' }}>
          {cidades.slice(0, 25).map(c => (
            <button key={c.id}
              onClick={() => {
                if (mapaRef.current && c.lat != null) mapaRef.current.setView([c.lat, c.lon], 11)
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem',
                border: 'none', background: 'none', padding: '3px 0', cursor: 'pointer', textAlign: 'left',
              }}>
              <span style={{ flex: 1, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.cidade}{c.estado ? '/' + c.estado : ''}
              </span>
              <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{(c.count || 0).toLocaleString('pt-BR')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
