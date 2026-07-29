import { useState, useEffect } from 'react'

var LAT = -23.1165
var LON = -46.5506

var WEATHER_ICON = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

/* faixa compacta e sempre visivel perto do topo — versao resumida dos widgets da sidebar,
   pra quem so quer o essencial sem descer a pagina toda */
export default function InfoStrip() {
  var weatherState = useState(null)
  var weather = weatherState[0]
  var setWeather = weatherState[1]
  var dollarState = useState(null)
  var dollar = dollarState[0]
  var setDollar = dollarState[1]

  useEffect(function() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON + '&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo')
      .then(function(r) { return r.ok ? r.json() : null })
      .then(function(json) { if (json) setWeather(json.current) })
      .catch(function() {})

    fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
      .then(function(r) { return r.ok ? r.json() : null })
      .then(function(json) { if (json) setDollar(json.USDBRL) })
      .catch(function() {})
  }, [])

  var pct = dollar ? parseFloat(dollar.pctChange) : null
  var up = pct != null && pct >= 0

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div className="atv-container" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '7px 2rem', fontSize: '0.76rem', color: '#4b5563', flexWrap: 'wrap', overflowX: 'auto' }}>
        {weather && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
            {WEATHER_ICON[weather.weather_code] || '🌡️'} {Math.round(weather.temperature_2m)}°C <span style={{ color: '#9ca3af' }}>Atibaia</span>
          </span>
        )}
        {dollar && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
            💵 Dólar <b style={{ color: '#1a1a2e' }}>R$ {parseFloat(dollar.bid).toFixed(2)}</b>
            <span style={{ color: up ? '#059669' : '#dc2626', fontWeight: 700 }}>{up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%</span>
          </span>
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
