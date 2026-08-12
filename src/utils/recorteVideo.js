/* Recorta o vídeo no formato vertical do Reels (1080×1920), ampliando e
   centralizando até preencher a tela — sem tarja preta em cima e embaixo, que é
   como um 16:9 entra no Instagram se ninguém mexer.

   O recorte roda aqui no navegador, em tempo real: a única forma de gerar MP4
   sem servidor de vídeo é tocar o arquivo e gravar o canvas quadro a quadro pelo
   MediaRecorder. Ou seja, um vídeo de 5 minutos leva 5 minutos para ser
   regravado. Trocar de aba não estraga o resultado — gravação e vídeo pausam
   juntos e continuam quando a aba volta —, mas segura o relógio. Em troca, nada
   sai da máquina para ser processado e o arquivo que sobe já vai no formato
   certo, bem menor que o original.

   Só MP4: é o que a Meta aceita. Se o navegador não souber gravar MP4 (Chrome
   antigo, Firefox), a função avisa em vez de entregar um WebM que a Meta
   recusaria mais adiante. */

const MIMES = [
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  'video/mp4;codecs=avc1',
  'video/mp4',
]

export function mimeDeSaida() {
  if (typeof MediaRecorder === 'undefined') return null
  return MIMES.find(m => {
    try { return MediaRecorder.isTypeSupported(m) } catch { return false }
  }) || null
}

export function suportaRecorte() {
  return Boolean(mimeDeSaida())
}

export async function gerarVideoVertical(arquivo, opcoes = {}) {
  const { largura = 1080, altura = 1920, zoom = 1, aoProgresso } = opcoes

  const mime = mimeDeSaida()
  if (!mime) {
    throw new Error('este navegador não sabe gerar MP4; abra o painel no Chrome atualizado')
  }

  const url = URL.createObjectURL(arquivo)
  const video = document.createElement('video')
  video.src = url
  video.playsInline = true
  video.preload = 'auto'

  const limpezas = []
  try {
    await new Promise((ok, erro) => {
      video.onloadedmetadata = () => ok()
      video.onerror = () => erro(new Error('não foi possível abrir o vídeo para recortar'))
    })

    const canvas = document.createElement('canvas')
    canvas.width = largura
    canvas.height = altura
    const ctx = canvas.getContext('2d')

    /* preencher e centralizar: a maior das duas escalas garante que não sobre
       borda, e o excedente é cortado meio a meio dos dois lados */
    const escala = Math.max(largura / video.videoWidth, altura / video.videoHeight) * zoom
    const dw = video.videoWidth * escala
    const dh = video.videoHeight * escala
    const dx = (largura - dw) / 2
    const dy = (altura - dh) / 2

    const stream = canvas.captureStream(30)
    limpezas.push(() => stream.getTracks().forEach(t => t.stop()))

    /* o canvas não carrega áudio. A trilha vem do próprio vídeo pelo WebAudio e
       vai só para a gravação, sem passar pelas caixas de som — senão a redação
       inteira ouviria o vídeo tocando durante o processamento */
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      limpezas.push(() => audioCtx.close())
      if (audioCtx.state === 'suspended') await audioCtx.resume()
      const destino = audioCtx.createMediaStreamDestination()
      audioCtx.createMediaElementSource(video).connect(destino)
      destino.stream.getAudioTracks().forEach(t => stream.addTrack(t))
    } catch (e) {
      /* vídeo mudo ainda é melhor do que vídeo nenhum */
      console.warn('recorte sem áudio:', e)
    }

    const gravador = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 })
    const pedacos = []
    gravador.ondataavailable = e => { if (e.data && e.data.size) pedacos.push(e.data) }
    const gravado = new Promise((ok, erro) => {
      gravador.onstop = () => ok(new Blob(pedacos, { type: mime }))
      gravador.onerror = () => erro(new Error('o navegador falhou ao gravar o vídeo recortado'))
    })

    /* aba em segundo plano congela o requestAnimationFrame: sem tratar isso, o
       recorte de quem troca de aba sairia com uma imagem parada e o áudio
       correndo por baixo. Pausando os dois juntos, o processamento apenas
       espera a pessoa voltar */
    const aoTrocarAba = () => {
      if (document.hidden) {
        video.pause()
        if (gravador.state === 'recording') gravador.pause()
      } else {
        if (gravador.state === 'paused') gravador.resume()
        video.play().catch(() => { /* volta no próximo clique */ })
      }
    }
    document.addEventListener('visibilitychange', aoTrocarAba)
    limpezas.push(() => document.removeEventListener('visibilitychange', aoTrocarAba))

    let rodando = true
    const desenhar = () => {
      if (!rodando) return
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, largura, altura)
      ctx.drawImage(video, dx, dy, dw, dh)
      if (aoProgresso && video.duration) {
        aoProgresso(Math.min(99, Math.round((video.currentTime / video.duration) * 100)))
      }
      requestAnimationFrame(desenhar)
    }

    gravador.start(1000)
    await video.play()
    desenhar()

    await new Promise(ok => { video.onended = () => ok() })
    rodando = false
    gravador.stop()

    const blob = await gravado
    if (!blob.size) throw new Error('o recorte saiu vazio')
    if (aoProgresso) aoProgresso(100)
    return blob
  } finally {
    limpezas.forEach(f => { try { f() } catch (e) { /* nada a fazer */ } })
    video.src = ''
    URL.revokeObjectURL(url)
  }
}
