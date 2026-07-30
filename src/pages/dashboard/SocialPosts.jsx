import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { EDITORIAS } from '../../data'
import DashFormField, { inputStyle } from '../../components/dashboard/DashFormField'

const W = 1080
const H = 1350 // 4:5 — formato de feed aceito no Facebook e no Instagram
const SITE = 'atibaiatv.com.br'
const HANDLES = '/AtibaiaTv   ·   @atibaiatv_   ·   ' + SITE
const MAX_CAPTION = 2200 // limite do Instagram

function editoriaInfo(label) {
  return EDITORIAS.find(ed => ed.label === label) || { label: label || 'Notícias', icon: '📰', color: '#4971B1' }
}

/* o bucket do Firebase nao envia cabecalho de CORS, e sem ele o canvas fica
   bloqueado para exportar JPEG. A funcao /api/img repassa a foto pelo nosso
   dominio, mantendo o canvas liberado */
function proxied(url) {
  if (!url) return ''
  return url.includes('firebasestorage.googleapis.com')
    ? '/api/img?u=' + encodeURIComponent(url)
    : url
}

function wrapText(ctx, text, maxWidth, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i]
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = words[i]
      if (lines.length === maxLines) break
    } else {
      line = test
    }
  }
  if (lines.length < maxLines && line) lines.push(line)
  // se sobrou texto, marca o corte na ultima linha
  const usadas = lines.join(' ').split(/\s+/).length
  if (usadas < words.length) lines[lines.length - 1] += '…'
  return lines
}

function loadImage(src, crossOrigin) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('falha ao carregar ' + src))
    img.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/* padrao visual por editoria: foto de capa, faixa e chip na cor da editoria,
   logo, titulo sobre gradiente escuro e rodape com os perfis */
async function drawPost(canvas, article) {
  const ed = editoriaInfo(article.category)
  const ctx = canvas.getContext('2d')
  canvas.width = W
  canvas.height = H
  const aviso = []

  ctx.fillStyle = '#0f1b2d'
  ctx.fillRect(0, 0, W, H)

  if (article.thumbnailUrl) {
    try {
      const img = await loadImage(proxied(article.thumbnailUrl), true)
      const scale = Math.max(W / img.width, H / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
    } catch (e) {
      aviso.push('A foto da matéria não pôde ser carregada — a arte saiu com o fundo padrão.')
    }
  } else {
    aviso.push('Esta matéria não tem foto de capa; a arte saiu com o fundo padrão.')
  }

  ctx.fillStyle = ed.color
  ctx.fillRect(0, 0, W, 16)

  // chip da editoria
  ctx.font = '700 42px Arial'
  const chipText = ed.icon + '  ' + ed.label.toUpperCase()
  const chipW = ctx.measureText(chipText).width + 56
  ctx.fillStyle = ed.color
  roundRect(ctx, W - chipW - 36, 52, chipW, 78, 39)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.fillText(chipText, W - chipW - 36 + 28, 52 + 41)

  // logo em cartao branco
  try {
    const logo = await loadImage('/logos/logo-horizontal.png')
    const lh = 64
    const lw = logo.width * (lh / logo.height)
    ctx.fillStyle = '#fff'
    roundRect(ctx, 36, 52, lw + 48, 78, 14)
    ctx.fill()
    ctx.drawImage(logo, 60, 52 + (78 - lh) / 2, lw, lh)
  } catch (e) { /* segue sem logo */ }

  // gradiente para o titulo ficar legivel sobre qualquer foto
  const grad = ctx.createLinearGradient(0, H * 0.45, 0, H)
  grad.addColorStop(0, 'rgba(10,16,28,0)')
  grad.addColorStop(0.55, 'rgba(10,16,28,0.72)')
  grad.addColorStop(1, 'rgba(10,16,28,0.97)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // titulo
  ctx.font = '800 62px Arial'
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'alphabetic'
  const lines = wrapText(ctx, article.title, W - 120, 4)
  const lineH = 76
  const footerH = 96
  let y = H - footerH - 48 - (lines.length - 1) * lineH
  ctx.fillStyle = ed.color
  ctx.fillRect(60, y - 92, 110, 10)
  ctx.fillStyle = '#fff'
  for (const l of lines) {
    ctx.fillText(l, 60, y)
    y += lineH
  }

  // rodape
  ctx.fillStyle = ed.color
  ctx.fillRect(0, H - footerH, W, footerH)
  ctx.font = '600 34px Arial'
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  const tw = ctx.measureText(HANDLES).width
  ctx.fillText(HANDLES, (W - tw) / 2, H - footerH / 2)

  return aviso
}

function buildCaption(article) {
  const ed = editoriaInfo(article.category)
  const tag = ed.label.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]/g, '')
  const cabeca = ed.icon + ' ' + String(article.title || '').toUpperCase()
  const pe = '\n\n📲 Leia a matéria completa em ' + SITE + '\n\n#Atibaia #AtibaiaTV #' + tag
  const espaco = MAX_CAPTION - cabeca.length - pe.length - 4
  let body = String(article.body || '').trim()
  if (body.length > espaco) body = body.slice(0, espaco).replace(/\s+\S*$/, '') + '…'
  return cabeca + '\n\n' + body + pe
}

export default function SocialPosts() {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [selected, setSelected] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(true)
  const [rendering, setRendering] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')
  const [targets, setTargets] = useState({ facebook: true, instagram: true })
  const [status, setStatus] = useState(null)
  const [warnings, setWarnings] = useState([])
  const canvasRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
    getDocs(q).then(snap => {
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  const pickArticle = async (a) => {
    setSelected(a)
    setCaption(buildCaption(a))
    setStatus(null)
    setRendering(true)
    try {
      setWarnings(await drawPost(canvasRef.current, a))
    } catch (e) {
      console.error(e)
      setStatus({ ok: false, msg: 'Não foi possível gerar a arte: ' + e.message })
    }
    setRendering(false)
  }

  const artToBlob = () =>
    new Promise((resolve, reject) => {
      try {
        canvasRef.current.toBlob(b => (b ? resolve(b) : reject(new Error('falha ao gerar o JPEG'))), 'image/jpeg', 0.92)
      } catch (e) {
        reject(new Error('a imagem da matéria bloqueou a exportação da arte (CORS)'))
      }
    })

  const download = async () => {
    try {
      const blob = await artToBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = 'post-' + (selected?.id || 'atibaiatv') + '.jpg'
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setStatus({ ok: false, msg: e.message })
    }
  }

  const copyCaption = async () => {
    await navigator.clipboard.writeText(caption)
    setStatus({ ok: true, msg: 'Legenda copiada.' })
  }

  const publish = async () => {
    if (!targets.facebook && !targets.instagram) {
      setStatus({ ok: false, msg: 'Escolha ao menos uma rede.' })
      return
    }
    setPublishing(true)
    setStatus(null)
    try {
      const blob = await artToBlob()
      const storageRef = ref(storage, 'social/' + selected.id + '-' + Date.now() + '.jpg')
      await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
      const imageUrl = await getDownloadURL(storageRef)

      const idToken = await user.getIdToken()
      const res = await fetch('/api/social-publish', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken, imageUrl, caption, scheduleAt, targets }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'erro inesperado')

      setStatus({
        ok: true,
        msg: data.results.join('  ·  ') + (data.errors && data.errors.length ? '  |  ' + data.errors.join(' · ') : ''),
      })
    } catch (e) {
      console.error(e)
      setStatus({ ok: false, msg: 'Erro ao publicar: ' + e.message })
    }
    setPublishing(false)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  const btn = (bg, color, border) => ({
    padding: '10px 18px', borderRadius: 8, border: border || 'none', background: bg,
    color, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
  })

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.35rem' }}>Redes Sociais</h1>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Escolha uma matéria: a arte sai no padrão da editoria e a legenda já vem com o texto da matéria.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 350px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', maxHeight: '72vh', overflowY: 'auto' }}>
          {articles.map(a => {
            const ed = editoriaInfo(a.category)
            const active = selected?.id === a.id
            return (
              <button key={a.id} onClick={() => pickArticle(a)} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '0.8rem 1rem',
                border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
                background: active ? '#eef3fa' : '#fff',
              }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: ed.color }}>{ed.icon} {ed.label.toUpperCase()}</span>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.35, marginTop: 2 }}>{a.title}</div>
                {!a.thumbnailUrl && <span style={{ fontSize: '0.66rem', color: '#c47a00' }}>sem foto de capa</span>}
              </button>
            )
          })}
        </div>

        <div>
          {!selected ? (
            <div style={{ background: '#fff', border: '1px dashed #d1d5db', borderRadius: 12, padding: '4rem 2rem', textAlign: 'center', color: '#9ca3af' }}>
              👈 Escolha uma matéria pra gerar o post
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 320px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <canvas ref={canvasRef} style={{ width: '100%', borderRadius: 12, border: '1px solid #e5e7eb', display: 'block', opacity: rendering ? 0.5 : 1 }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <button onClick={download} style={btn('#fff', '#374151', '1px solid #e5e7eb')}>⬇️ Baixar arte</button>
                  <button onClick={copyCaption} style={btn('#fff', '#374151', '1px solid #e5e7eb')}>📋 Copiar legenda</button>
                </div>
                {warnings.map((w, i) => (
                  <p key={i} style={{ fontSize: '0.72rem', color: '#c47a00', marginTop: 8, lineHeight: 1.5 }}>⚠️ {w}</p>
                ))}
              </div>

              <div>
                <DashFormField label={'Legenda do post (' + caption.length + '/' + MAX_CAPTION + ')'}>
                  <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={13} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, fontSize: '0.82rem' }} />
                </DashFormField>

                <div style={{ display: 'flex', gap: 18, marginBottom: '1rem' }}>
                  {[['facebook', 'Facebook'], ['instagram', 'Instagram']].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.84rem', color: '#374151', cursor: 'pointer' }}>
                      <input type="checkbox" checked={targets[key]} onChange={e => setTargets(t => ({ ...t, [key]: e.target.checked }))} />
                      {label}
                    </label>
                  ))}
                </div>

                <DashFormField label="Agendar para (opcional)" hint="Só o Facebook permite agendar, com no mínimo 10 minutos de antecedência. O Instagram publica na hora.">
                  <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} style={inputStyle} />
                </DashFormField>

                <button onClick={publish} disabled={publishing || rendering} style={{
                  ...btn(publishing ? '#93a3b8' : '#Cd0000', '#fff'),
                  padding: '12px 26px', fontSize: '0.9rem',
                  cursor: publishing ? 'not-allowed' : 'pointer',
                }}>
                  {publishing ? 'Enviando...' : scheduleAt ? '🚀 Agendar e publicar' : '🚀 Publicar agora'}
                </button>

                {status && (
                  <p style={{
                    marginTop: 12, fontSize: '0.8rem', fontWeight: 600, padding: '10px 14px', borderRadius: 8, lineHeight: 1.5,
                    background: status.ok ? '#ecfdf5' : '#fef2f2', color: status.ok ? '#059669' : '#dc2626',
                  }}>{status.msg}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
