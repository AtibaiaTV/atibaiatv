import { useState } from 'react'

/* Cabecalho de materia no padrao dos grandes portais (G1):
   chapeu da editoria, titulo em cor da editoria, subtitulo, assinatura com
   data, botoes de compartilhamento e caixa "Ver resumo" retratil. */

/* aceita Timestamp do Firestore, Date ou string */
function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  var d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function formatDate(value) {
  var d = toDate(value)
  if (!d) return ''
  var pad = function (n) { return n < 10 ? '0' + n : String(n) }
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() +
    ' ' + pad(d.getHours()) + 'h' + pad(d.getMinutes())
}

function ShareButton({ label, href, color, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '11px 8px', borderRadius: 8, background: '#f3f4f6', color: color,
        fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
      }}
    >
      {children}
    </a>
  )
}

export default function ArticleHeader({ news, tagStyle, views }) {
  var openState = useState(false)
  var open = openState[0]
  var setOpen = openState[1]

  var summaryItems = (news.summary || '')
    .split('\n')
    .map(function (l) { return l.replace(/^\s*[-*•]\s*/, '').trim() })
    .filter(Boolean)

  var pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  var shareText = encodeURIComponent(news.title || '')
  var shareUrl = encodeURIComponent(pageUrl)

  var published = formatDate(news.publishedAt || news.createdAt)
  var updated = formatDate(news.updatedAt)
  var showUpdated = updated && updated !== published

  return (
    <header>
      <span style={{
        display: 'inline-block', fontSize: '0.66rem', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12,
        color: tagStyle.color, borderLeft: '4px solid ' + tagStyle.color, paddingLeft: 8,
      }}>
        {news.category}
      </span>

      <h1 style={{
        fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
        fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 700,
        color: tagStyle.color, lineHeight: 1.2, marginBottom: '0.9rem',
      }}>
        {news.title}
      </h1>

      {news.subtitle && (
        <p style={{
          fontSize: 'clamp(0.95rem, 2.4vw, 1.12rem)', lineHeight: 1.6,
          color: '#4b5563', marginBottom: '1.1rem',
        }}>
          {news.subtitle}
        </p>
      )}

      <div style={{ fontSize: '0.84rem', color: '#374151', marginBottom: 4 }}>
        Por <strong style={{ color: tagStyle.color, fontWeight: 600 }}>{news.author || 'Redacao Atibaia TV'}</strong>
        , Atibaia TV{news.location ? ' — ' + news.location : ''}
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        {published}
        {showUpdated ? ' · Atualizado em ' + updated : ''}
        {views ? ' · ' + views + ' visualizacoes' : ''}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem' }}>
        <ShareButton
          label="Compartilhar no Facebook"
          href={'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl}
          color="#1877f2"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" /></svg>
          Facebook
        </ShareButton>
        <ShareButton
          label="Compartilhar no WhatsApp"
          href={'https://api.whatsapp.com/send?text=' + shareText + '%20' + shareUrl}
          color="#25d366"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.44 1.32-1.99 1.37-.53.05-1.02.24-3.44-.72-2.9-1.14-4.73-4.1-4.87-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.37-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.89 1.04.93 1.92 1.22 2.2 1.36.28.14.44.12.6-.07.17-.19.69-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.61.76 1.89.9.28.14.46.21.53.33.07.12.07.68-.18 1.37Z" /></svg>
          WhatsApp
        </ShareButton>
        <ShareButton
          label="Compartilhar no X"
          href={'https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl}
          color="#111827"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.17 17.52h1.84L7.02 4.13H5.05l12.02 15.64Z" /></svg>
          X
        </ShareButton>
      </div>

      {summaryItems.length > 0 && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, marginBottom: '1.5rem', overflow: 'hidden' }}>
          <button
            type="button"
            onClick={function () { setOpen(!open) }}
            aria-expanded={open}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 10, padding: '14px 16px', background: '#fff', border: 'none',
              fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', textAlign: 'left',
            }}
          >
            Ver resumo
            <span style={{
              width: 24, height: 24, borderRadius: '50%', background: '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', color: '#374151',
              transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s',
            }}>{'▼'}</span>
          </button>
          {open && (
            <ul style={{ listStyle: 'none', margin: 0, padding: '14px 16px 16px', borderTop: '1px solid var(--border)' }}>
              {summaryItems.map(function (item, i) {
                return (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.9rem', lineHeight: 1.65, color: '#374151', marginBottom: 10 }}>
                    <span style={{ color: tagStyle.color, fontWeight: 700, flexShrink: 0 }}>{'•'}</span>
                    <span>{item}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </header>
  )
}
