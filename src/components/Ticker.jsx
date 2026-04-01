import { TICKER_ITEMS } from '../data'

const style = {
  ticker: {
    background: '#e8f4fd',
    borderBottom: '1px solid #c8def0',
    height: 34,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    background: '#1a6fa8',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0 14px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  scroll: { overflow: 'hidden', flex: 1 },
}

// CSS animation injected once
const css = `
@keyframes atv-ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
.atv-ticker-track { display: flex; animation: atv-ticker 32s linear infinite; white-space: nowrap; }
.atv-ticker-item { font-size: 0.78rem; color: #1a6fa8; font-weight: 500; padding: 0 32px; }
`

export default function Ticker() {
  // Duplicate items for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      <style>{css}</style>
      <div style={style.ticker}>
        <div style={style.label}>Últimas</div>
        <div style={style.scroll}>
          <div className="atv-ticker-track">
            {items.map((item, i) => (
              <span key={i} className="atv-ticker-item">
                {item}
                {i < items.length - 1 && <span style={{ opacity: 0.3, paddingLeft: 32 }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
