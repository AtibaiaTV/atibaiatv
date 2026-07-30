import { useState, useEffect } from 'react'

var LAT = -23.1165
var LON = -46.5506

/* chave gratuita em https://brapi.dev — sem ela o Ibovespa fica oculto */
var BRAPI_TOKEN = ''

var WEATHER_ICON = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

function fmt(v, digits) {
  var n = parseFloat(v)
  if (isNaN(n)) return '—'
  return n.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

/* item padrao da faixa: icone + nome + valor + variacao percentual */
function Quote({ icon, label, value, pct }) {
  var n = parseFloat(pct)
  var hasPct = !isNaN(n)
  var up = hasPct && n >= 0
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
      {icon} {label} <b style={{ color: '#1a1a2e' }}>{value}</b>
      {hasPct && (
        <span style={{ color: up ? '#059669' : '#dc2626', fontWeight: 700 }}>{up ? '▲' : '▼'} {Math.abs(n).toFixed(2)}%</span>
      )}
    </span>
  )
}

/* faixa compacta e sempre visivel perto do topo — versao resumida dos widgets da sidebar,
   pra quem so quer o essencial sem descer a pagina toda */
export default function InfoStrip() {
  var weatherState = useState(null)
  var weather = weatherState[0]
  var setWeather = weatherState[1]
  var ratesState = useState(null)
  var rates = ratesState[0]
  var setRates = ratesState[1]
  var ibovState = useState(null)
  var ibov = ibovState[0]
  var setIbov = ibovState[1]

  useEffect(function() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON + '&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo')
      .then(function(r) { return r.ok ? r.json() : null })
      .then(function(json) { if (json) setWeather(json.current) })
      .catch(function() {})

    fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL')
      .then(function(r) { return r.ok ? r.json() : null })
      .then(function(json) { if (json) setRates(json) })
      .catch(function() {})

    if (BRAPI_TOKEN) {
      fetch('https://brapi.dev/api/quote/%5EBVSP?token=' + BRAPI_TOKEN)
        .then(function(r) { return r.ok ? r.json() : null })
        .then(function(json) { if (json && json.results && json.results[0]) setIbov(json.results[0]) })
        .catch(function() {})
    }
  }, [])

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div className="atv-container" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '7px 2rem', fontSize: '0.76rem', color: '#4b5563', flexWrap: 'wrap', overflowX: 'auto' }}>
        {weather && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
            {WEATHER_ICON[weather.weather_code] || '🌡️'} {Math.round(weather.temperature_2m)}°C <span style={{ color: '#9ca3af' }}>Atibaia</span>
          </span>
        )}
        {rates && rates.USDBRL && (
          <Quote icon="💵" label="Dólar" value={'R$ ' + fmt(rates.USDBRL.bid, 2)} pct={rates.USDBRL.pctChange} />
        )}
        {rates && rates.EURBRL && (
          <Quote icon="💶" label="Euro" value={'R$ ' + fmt(rates.EURBRL.bid, 2)} pct={rates.EURBRL.pctChange} />
        )}
        {ibov && (
          <Quote icon="📈" label="Ibovespa" value={fmt(ibov.regularMarketPrice, 0) + ' pts'} pct={ibov.regularMarketChangePercent} />
        )}
        {rates && rates.BTCBRL && (
          <Quote icon="🪙" label="Bitcoin" value={'R$ ' + fmt(rates.BTCBRL.bid, 0)} pct={rates.BTCBRL.pctChange} />
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', marginLeft: 'auto' }}>
          🛣️
          <a href="https://rodovias.motiva.com.br/minas-sp/" target="_blank" rel="noreferrer" style={{ color: '#4b5563' }}>Fernão Dias</a>
          <span style={{ color: '#d1d5db' }}>·</span>
          <a href="https://www.rotadasbandeiras.com.br/" target="_blank" rel="noreferrer" style={{ color: '#4b5563' }}>Dom Pedro I</a>
        </span>
      </div>
    </div>
  )
}
