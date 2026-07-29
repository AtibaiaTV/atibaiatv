import { useState, useEffect } from 'react'
import getMoonPhase from '../utils/moonPhase'

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

function uvLevel(uv) {
  if (uv == null) return null
  if (uv < 3) return { label: 'Baixo', color: '#059669' }
  if (uv < 6) return { label: 'Moderado', color: '#c47a00' }
  if (uv < 8) return { label: 'Alto', color: '#dc2626' }
  if (uv < 11) return { label: 'Muito alto', color: '#b91c1c' }
  return { label: 'Extremo', color: '#7c2d12' }
}

export default function WeatherWidget() {
  var dataState = useState(null)
  var data = dataState[0]
  var setData = dataState[1]
  var errorState = useState(false)
  var error = errorState[0]
  var setError = errorState[1]

  useEffect(function() {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON
      + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code'
      + '&daily=uv_index_max&timezone=America%2FSao_Paulo'

    fetch(url)
      .then(function(r) { if (!r.ok) throw new Error('erro'); return r.json() })
      .then(function(json) { setData(json) })
      .catch(function() { setError(true) })
  }, [])

  var moon = getMoonPhase()

  if (error) return null

  var current = data && data.current
  var uv = data && data.daily ? data.daily.uv_index_max[0] : null
  var uvInfo = uvLevel(uv)
  var icon = current ? (WEATHER_ICON[current.weather_code] || '🌡️') : '🌡️'

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tempo em Atibaia</h3>
      </div>

      {!current ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>Carregando...</div>
      ) : (
        <div style={{ padding: '1rem 1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{icon}</span>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{Math.round(current.temperature_2m)}°C</div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Sensação {Math.round(current.apparent_temperature)}°C</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: '0.76rem', color: '#4b5563' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>💧</span> {current.relative_humidity_2m}% umidade
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🌬️</span> {Math.round(current.wind_speed_10m)} km/h
            </div>
            {uvInfo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>☀️</span> UV <b style={{ color: uvInfo.color }}>{uvInfo.label}</b>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{moon.icon}</span> {moon.label}
            </div>
          </div>

          <div style={{ fontSize: '0.62rem', color: '#c4c8cf', marginTop: 10 }}>Dados: Open-Meteo</div>
        </div>
      )}
    </div>
  )
}
