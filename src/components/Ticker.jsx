import useTicker from '../hooks/useTicker'
import { TICKER_ITEMS } from '../data'

export default function Ticker() {
  const { items: firestoreItems, loading } = useTicker()
  const items = loading ? TICKER_ITEMS : (firestoreItems.length > 0 ? firestoreItems : TICKER_ITEMS)
  const doubled = [...items, ...items]

  return (
    <div style={{
      background: 'linear-gradient(90deg, #c0392b, #e74c3c)',
      color: '#fff',
      overflow: 'hidden',
      fontSize: '0.82rem',
      fontWeight: 500,
      position: 'relative',
      height: 36,
      display: 'flex',
      alignItems: 'center',
    }}>
      <span style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center',
        background: '#a93226', padding: '0 14px',
        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        zIndex: 2,
        boxShadow: '4px 0 8px rgba(0,0,0,.15)',
      }}>
        Ultimas
      </span>
      <div style={{
        display: 'flex', whiteSpace: 'nowrap',
        animation: 'atv-ticker 40s linear infinite',
        paddingLeft: 100,
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, paddingRight: 40 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.5)', flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
