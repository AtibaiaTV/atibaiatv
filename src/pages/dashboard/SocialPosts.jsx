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
const LOGO_REDONDO = '/logos/RS_logo_triang_redondo.png'
const BARRA_PERFIS = '/logos/RS_Logos_hor.png'

/* medidas da arte, no padrão do modelo da emissora: moldura branca, cabeçalho com
   logo e editoria, foto ocupando o miolo e a barra de perfis no rodapé */
const MARGEM = 36
const CAB_ALTURA = 150
const BARRA_ALTURA = 14
const RESPIRO = 28
const FOTO_TOPO = CAB_ALTURA + BARRA_ALTURA + RESPIRO
const RODAPE_ALTURA = 118                                    // faixa dos perfis
const BARRA_BAIXO_Y = H - RODAPE_ALTURA - BARRA_ALTURA       // 2a faixa, como no modelo
const MAX_CAPTION = 2200 // limite do Instagram

/* quanto de legenda cada rede mostra antes do "ver mais" */
const REDES = {
  instagram: { nome: 'atibaia_tv', corte: 125, maisTexto: '... mais', rotulo: 'Instagram' },
  facebook: { nome: 'Atibaia TV', corte: 250, maisTexto: 'Ver mais', rotulo: 'Facebook' },
}

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

/* guarda as imagens ja baixadas: o ajuste manual redesenha a arte a cada pixel
   arrastado, e recarregar a foto a cada quadro deixaria o arraste travado */
const cacheImagens = new Map()

function loadImage(src, crossOrigin) {
  if (cacheImagens.has(src)) return Promise.resolve(cacheImagens.get(src))
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = 'anonymous'
    img.onload = () => { cacheImagens.set(src, img); resolve(img) }
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

/* padrao visual da emissora: moldura branca, cabecalho com o logo redondo e o nome
   da editoria na cor dela, foto no miolo com o titulo sobre gradiente, e a barra
   de perfis no rodape */
async function drawPost(canvas, article, enquadramento, ajuste = { dx: 0, dy: 0, zoom: 1 }) {
  const ed = editoriaInfo(article.category)
  const ctx = canvas.getContext('2d')
  canvas.width = W
  canvas.height = H
  const aviso = []

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)

  // ── cabecalho ──────────────────────────────────────────────────────────────
  try {
    const logo = await loadImage(LOGO_REDONDO)
    const d = 104
    ctx.drawImage(logo, MARGEM + 8, (CAB_ALTURA - d) / 2, d, d)
  } catch (e) { /* segue sem logo */ }

  ctx.font = '800 76px Arial'
  ctx.fillStyle = ed.color
  ctx.textBaseline = 'middle'
  ctx.fillText(ed.label, MARGEM + 8 + 104 + 26, CAB_ALTURA / 2 + 3)

  // faixa da editoria separando cabecalho e foto
  ctx.fillStyle = ed.color
  ctx.fillRect(MARGEM, CAB_ALTURA, W - MARGEM * 2, BARRA_ALTURA)

  // ── foto ───────────────────────────────────────────────────────────────────
  const fx = MARGEM
  const fy = FOTO_TOPO
  const fw = W - MARGEM * 2
  const fh = BARRA_BAIXO_Y - RESPIRO - FOTO_TOPO

  ctx.save()
  ctx.beginPath()
  ctx.rect(fx, fy, fw, fh)
  ctx.clip()

  ctx.fillStyle = '#0f1b2d'
  ctx.fillRect(fx, fy, fw, fh)

  if (article.thumbnailUrl) {
    try {
      const img = await loadImage(proxied(article.thumbnailUrl), true)

      const base = enquadramento === 'inteira'
        ? Math.min(fw / img.width, fh / img.height)
        : Math.max(fw / img.width, fh / img.height)
      const escala = base * (ajuste.zoom || 1)
      const dw = img.width * escala
      const dh = img.height * escala

      /* limita o deslocamento conforme o eixo: quando a foto transborda, ela nao
         pode revelar falha nas bordas; quando sobra espaco (caso do cartaz), ela
         desliza livre mas sem sair da area */
      const limitar = (inicio, tamanhoArea, tamanhoFoto, desloc) => {
        const centro = inicio + (tamanhoArea - tamanhoFoto) / 2 + desloc
        return tamanhoFoto >= tamanhoArea
          ? Math.min(inicio, Math.max(inicio + tamanhoArea - tamanhoFoto, centro))
          : Math.max(inicio, Math.min(inicio + tamanhoArea - tamanhoFoto, centro))
      }
      const px = limitar(fx, fw, dw, ajuste.dx)
      const py = limitar(fy, fh, dh, ajuste.dy)

      // sobrando espaco, preenche com a propria foto desfocada em vez de tarja
      if (dw < fw || dh < fh) {
        const cobrir = Math.max(fw / img.width, fh / img.height)
        ctx.save()
        ctx.filter = 'blur(28px)'
        ctx.drawImage(img, fx + (fw - img.width * cobrir) / 2, fy + (fh - img.height * cobrir) / 2, img.width * cobrir, img.height * cobrir)
        ctx.restore()
        ctx.fillStyle = 'rgba(10,16,28,0.28)'
        ctx.fillRect(fx, fy, fw, fh)
      }

      ctx.drawImage(img, px, py, dw, dh)
    } catch (e) {
      aviso.push('A foto da matéria não pôde ser carregada — a arte saiu com o fundo padrão.')
    }
  } else {
    aviso.push('Esta matéria não tem foto de capa; a arte saiu com o fundo padrão.')
  }

  // ── titulo sobre a foto ────────────────────────────────────────────────────
  ctx.font = '800 58px Arial'
  const linhas = wrapText(ctx, article.title, fw - 88, 4)
  const alturaLinha = 70
  const blocoAltura = linhas.length * alturaLinha + 56

  const grad = ctx.createLinearGradient(0, fy + fh - blocoAltura - 150, 0, fy + fh)
  grad.addColorStop(0, 'rgba(10,16,28,0)')
  grad.addColorStop(0.45, 'rgba(10,16,28,0.78)')
  grad.addColorStop(1, 'rgba(10,16,28,0.94)')
  ctx.fillStyle = grad
  ctx.fillRect(fx, fy + fh - blocoAltura - 150, fw, blocoAltura + 150)

  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'alphabetic'
  let y = fy + fh - 44 - (linhas.length - 1) * alturaLinha
  for (const l of linhas) {
    ctx.fillText(l, fx + 44, y)
    y += alturaLinha
  }
  ctx.restore()

  // ── rodape: faixa da editoria + perfis ─────────────────────────────────────
  ctx.fillStyle = ed.color
  ctx.fillRect(MARGEM, BARRA_BAIXO_Y, W - MARGEM * 2, BARRA_ALTURA)

  try {
    const barra = await loadImage(BARRA_PERFIS)
    const bw = W - MARGEM * 2 - 60
    const bh = barra.height * (bw / barra.width)
    ctx.drawImage(barra, (W - bw) / 2, H - RODAPE_ALTURA + (RODAPE_ALTURA - bh) / 2, bw, bh)
  } catch (e) {
    // sem a barra de perfis, escreve os enderecos em texto
    ctx.font = '600 34px Arial'
    ctx.fillStyle = '#373435'
    ctx.textBaseline = 'middle'
    const t = '@atibaia_tv   ·   @AtibaiaTv   ·   ' + SITE
    ctx.fillText(t, (W - ctx.measureText(t).width) / 2, H - RODAPE_ALTURA / 2)
  }

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

/* pinta as hashtags de azul, como as redes fazem */
function textoComTags(texto) {
  return texto.split(/(\s+)/).map((pedaco, i) =>
    pedaco.startsWith('#')
      ? <span key={i} style={{ color: '#00376b' }}>{pedaco}</span>
      : <span key={i}>{pedaco}</span>
  )
}

/* simula o card do feed para a pessoa ver onde a legenda corta e como a foto
   fica enquadrada, antes de publicar de verdade */
function PostPreview({ rede, holderRef, caption, scheduleAt }) {
  const cfg = REDES[rede]
  const cortou = caption.length > cfg.corte
  const visivel = cortou ? caption.slice(0, cfg.corte).replace(/\s+\S*$/, '') : caption

  return (
    <div style={{ border: '1px solid #dbdbdb', borderRadius: 10, background: '#fff', overflow: 'hidden', maxWidth: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px' }}>
        <img src={LOGO_REDONDO} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'contain' }} />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e' }}>{cfg.nome}</div>
          <div style={{ fontSize: '0.68rem', color: '#8e8e8e' }}>
            {scheduleAt ? 'agendado para ' + new Date(scheduleAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'agora'}
          </div>
        </div>
      </div>

      <div ref={holderRef} style={{ width: '100%', aspectRatio: '4/5', background: '#f3f4f6' }} />

      <div style={{ padding: '10px 12px 14px' }}>
        <div style={{ fontSize: '1.05rem', letterSpacing: 6, color: '#262626', marginBottom: 8 }}>♡ ♬ ↗</div>
        <div style={{ fontSize: '0.78rem', color: '#262626', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
          <b>{cfg.nome}</b>{' '}
          {textoComTags(visivel)}
          {cortou && <span style={{ color: '#8e8e8e' }}>{cfg.maisTexto}</span>}
        </div>
      </div>
    </div>
  )
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
  const [redePreview, setRedePreview] = useState('instagram')
  const [enquadramento, setEnquadramento] = useState('preencher')
  const [ajuste, setAjuste] = useState({ dx: 0, dy: 0, zoom: 1 })
  const canvasRef = useRef(null)
  const holderRef = useRef(null)
  const arrasteRef = useRef(null)

  /* o canvas é criado uma vez em memória e depois encaixado na prévia; assim ele
     nunca é nulo e o que aparece na tela é a arte real, não uma cópia */
  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas')
    const canvas = canvasRef.current
    canvas.style.width = '100%'
    canvas.style.display = 'block'
    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'none'
    if (holderRef.current && canvas.parentNode !== holderRef.current) {
      holderRef.current.appendChild(canvas)
    }
    canvas.onpointerdown = aoPressionar
    canvas.onpointermove = aoMover
    canvas.onpointerup = aoSoltar
    canvas.onpointercancel = aoSoltar
  })

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
    getDocs(q).then(snap => {
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  const renderArt = async (a, modo, aj) => {
    try {
      if (!canvasRef.current) canvasRef.current = document.createElement('canvas')
      setWarnings(await drawPost(canvasRef.current, a, modo, aj))
    } catch (e) {
      console.error(e)
      setStatus({ ok: false, msg: 'Não foi possível gerar a arte: ' + e.message })
    }
  }

  const pickArticle = async (a) => {
    const zerado = { dx: 0, dy: 0, zoom: 1 }
    setSelected(a)
    setCaption(buildCaption(a))
    setAjuste(zerado)
    setStatus(null)
    setRendering(true)
    await renderArt(a, enquadramento, zerado)
    setRendering(false)
  }

  const trocarEnquadramento = async (modo) => {
    const zerado = { dx: 0, dy: 0, zoom: 1 }
    setEnquadramento(modo)
    setAjuste(zerado)
    if (selected) await renderArt(selected, modo, zerado)
  }

  const mexerAjuste = (novo) => {
    setAjuste(novo)
    if (selected) renderArt(selected, enquadramento, novo)
  }

  /* arraste na propria arte: converte o movimento do mouse na tela para pixels
     da imagem de 1080 de largura */
  const aoPressionar = (e) => {
    if (!selected) return
    const canvas = canvasRef.current
    arrasteRef.current = { x: e.clientX, y: e.clientY, base: ajuste, fator: canvas.width / canvas.getBoundingClientRect().width }
    canvas.style.cursor = 'grabbing'
    canvas.setPointerCapture?.(e.pointerId)
  }

  const aoMover = (e) => {
    const a = arrasteRef.current
    if (!a) return
    mexerAjuste({
      ...a.base,
      dx: a.base.dx + (e.clientX - a.x) * a.fator,
      dy: a.base.dy + (e.clientY - a.y) * a.fator,
    })
  }

  const aoSoltar = () => {
    arrasteRef.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
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
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {Object.keys(REDES).map(k => (
                    <button key={k} onClick={() => setRedePreview(k)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                      border: '1px solid ' + (redePreview === k ? '#4971B1' : '#e5e7eb'),
                      background: redePreview === k ? '#eef3fa' : '#fff',
                      color: redePreview === k ? '#4971B1' : '#6b7280',
                    }}>{REDES[k].rotulo}</button>
                  ))}
                </div>

                <div style={{ opacity: rendering ? 0.5 : 1 }}>
                  <PostPreview rede={redePreview} holderRef={holderRef} caption={caption} scheduleAt={scheduleAt} />
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Enquadramento da foto</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[['preencher', 'Preencher'], ['inteira', 'Foto inteira']].map(([k, rotulo]) => (
                      <button key={k} onClick={() => trocarEnquadramento(k)} style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                        border: '1px solid ' + (enquadramento === k ? '#4971B1' : '#e5e7eb'),
                        background: enquadramento === k ? '#eef3fa' : '#fff',
                        color: enquadramento === k ? '#4971B1' : '#6b7280',
                      }}>{rotulo}</button>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: 5, lineHeight: 1.45 }}>
                    "Preencher" corta as bordas para ocupar tudo. "Foto inteira" mostra a imagem completa — use em cartaz e flyer.
                  </p>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Ajuste manual</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => mexerAjuste({ ...ajuste, zoom: Math.max(1, +(ajuste.zoom - 0.1).toFixed(2)) })}
                      style={btn('#fff', '#374151', '1px solid #e5e7eb')}>−</button>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280', minWidth: 42, textAlign: 'center' }}>
                      {Math.round(ajuste.zoom * 100)}%
                    </span>
                    <button onClick={() => mexerAjuste({ ...ajuste, zoom: Math.min(3, +(ajuste.zoom + 0.1).toFixed(2)) })}
                      style={btn('#fff', '#374151', '1px solid #e5e7eb')}>+</button>
                    <button onClick={() => mexerAjuste({ dx: 0, dy: 0, zoom: 1 })}
                      style={btn('#fff', '#6b7280', '1px solid #e5e7eb')}>Centralizar</button>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: 5, lineHeight: 1.45 }}>
                    Arraste a foto direto na prévia para reposicionar. O deslocamento para nas bordas da imagem.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
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
