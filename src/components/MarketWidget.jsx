import { useState, useEffect, useRef } from 'react'

function fmtMoney(v) {
  var n = parseFloat(v)
  if (isNaN(n)) return '—'
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function ChangeTag({ pct }) {
  var n = parseFloat(pct)
  if (isNaN(n)) return null
  var up = n >= 0
  return (
    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: up ? '#059669' : '#dc2626' }}>
      {up ? '▲' : '▼'} {Math.abs(n).toFixed(2)}%
    </span>
  )
}

export default function MarketWidget() {
  var dollarState = useState(null)
  var dollar = dollarState[0]
  var setDollar = dollarState[1]
  var errorState = useState(false)
  var error = errorState[0]
  var setError = errorState[1]
  var chartRef = useRef(null)

  useEffect(function() {
    fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
      .then(function(r) { if (!r.ok) throw new Error('erro'); return r.json() })
      .then(function(json) { setDollar(json.USDBRL) })
      .catch(function() { setError(true) })
  }, [])

  /* widget publico do TradingView para o Ibovespa — sem necessidade de chave/API propria */
  useEffect(function() {
    if (!chartRef.current || chartRef.current.dataset.loaded) return
    chartRef.current.dataset.loaded = '1'
    var script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [['BMFBOVESPA:IBOV|1D']],
      chartOnly: true,
      width: '100%',
      height: 90,
      locale: 'br',
      colorTheme: 'light',
      autosize: true,
      showVolume: false,
      hideDateRanges: true,
      hideMarketStatus: true,
      hideSymbolLogo: true,
      scalePosition: 'no',
      scaleMode: 'Normal',
      noTimeScale: true,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      lineWidth: 2,
      lineType: 0,
    })
    chartRef.current.appendChild(script)
  }, [])

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid #f3f4f6' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mercado</h3>
      </div>

      <div style={{ padding: '1rem 1.1rem' }}>
        {!error && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1rem' }}>💵</span>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Dólar</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e' }}>
                  {dollar ? 'R$ ' + fmtMoney(dollar.bid) : '...'}
                </div>
              </div>
            </div>
            {dollar && <ChangeTag pct={dollar.pctChange} />}
          </div>
        )}

        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: 4 }}>Ibovespa</div>
        <div ref={chartRef} style={{ minHeight: 90 }} />

        <div style={{ fontSize: '0.62rem', color: '#c4c8cf', marginTop: 8 }}>Dólar: AwesomeAPI · Ibovespa: TradingView</div>
      </div>
    </div>
  )
}
