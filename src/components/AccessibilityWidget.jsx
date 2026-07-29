import { useState, useEffect } from 'react'

var SIZES = ['normal', 'grande', 'maior']
var SIZE_LABEL = { normal: 'A', grande: 'A+', maior: 'A++' }
var STORAGE_KEY = 'atv-a11y'

function applyPrefs(prefs) {
  var html = document.documentElement
  html.classList.remove('atv-fontsize-grande', 'atv-fontsize-maior')
  if (prefs.size === 'grande') html.classList.add('atv-fontsize-grande')
  if (prefs.size === 'maior') html.classList.add('atv-fontsize-maior')
  html.classList.toggle('atv-underline-links', !!prefs.underline)
}

export default function AccessibilityWidget() {
  var prefsState = useState(function() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      return saved || { size: 'normal', underline: false }
    } catch (e) {
      return { size: 'normal', underline: false }
    }
  })
  var prefs = prefsState[0]
  var setPrefs = prefsState[1]

  useEffect(function() {
    applyPrefs(prefs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs])

  function cycleSize() {
    var idx = SIZES.indexOf(prefs.size)
    var next = SIZES[(idx + 1) % SIZES.length]
    setPrefs(function(p) { return Object.assign({}, p, { size: next }) })
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid #f3f4f6' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Acessibilidade</h3>
      </div>
      <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={cycleSize} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fafbfc',
          fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer',
        }}>
          Tamanho do texto <span style={{ color: '#4971B1' }}>{SIZE_LABEL[prefs.size]}</span>
        </button>

        <button onClick={function() { setPrefs(function(p) { return Object.assign({}, p, { underline: !p.underline }) }) }} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
          background: prefs.underline ? '#eef3fa' : '#fafbfc',
          fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer',
        }}>
          Sublinhar links <span style={{ color: prefs.underline ? '#4971B1' : '#9ca3af' }}>{prefs.underline ? 'Ativo' : 'Inativo'}</span>
        </button>

        <p style={{ fontSize: '0.68rem', color: '#9ca3af', lineHeight: 1.4, margin: 0 }}>
          Use o ícone azul de <b>Libras</b> no canto da tela para tradução em Língua Brasileira de Sinais (VLibras).
        </p>
      </div>
    </div>
  )
}
