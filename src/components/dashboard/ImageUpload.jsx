import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase'

var EXT_TO_MIME = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
  webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
  mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', m4v: 'video/mp4',
}

var STALL_TIMEOUT_MS = 25000
var MAX_DIMENSION = 1600
var JPEG_QUALITY = 0.82

/* alguns navegadores (sobretudo iOS/Safari com fotos HEIC) nao preenchem file.type;
   nesses casos inferimos pela extensao em vez de rejeitar o arquivo */
function resolveContentType(file) {
  if (file.type) return file.type
  var ext = (file.name.split('.').pop() || '').toLowerCase()
  return EXT_TO_MIME[ext] || ''
}

function matchesAccept(contentType, accept) {
  if (!accept || accept === 'image/*,video/*') return true
  if (!contentType) return true // deixa passar; o input ja filtrou pelo seletor do sistema
  return accept.split(',').map(t => t.trim()).some(t => {
    if (t.endsWith('/*')) return contentType.startsWith(t.replace('/*', '/'))
    return contentType === t
  })
}

/* reduz fotos grandes (comuns em celular, 5-20MB) antes de enviar, pra nao travar em conexao movel.
   se algo falhar (HEIC nao suportado pelo navegador, etc) devolve o arquivo original sem quebrar o fluxo */
function compressImageIfNeeded(file) {
  return new Promise(function(resolve) {
    if (!file.type || !file.type.startsWith('image/') || file.type === 'image/gif') {
      resolve(file)
      return
    }
    var img = new Image()
    var url = URL.createObjectURL(file)
    var done = function(result) { URL.revokeObjectURL(url); resolve(result) }

    img.onload = function() {
      var scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
      if (scale >= 1) { done(file); return }
      try {
        var canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(function(blob) {
          if (!blob) { done(file); return }
          done(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
        }, 'image/jpeg', JPEG_QUALITY)
      } catch (e) {
        done(file)
      }
    }
    img.onerror = function() { done(file) }
    img.src = url
  })
}

export default function ImageUpload({ value, onChange, path, accept = 'image/*,video/*' }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const taskRef = useRef(null)
  const stallTimerRef = useRef(null)

  const clearStallTimer = () => {
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current)
  }

  const armStallTimer = () => {
    clearStallTimer()
    stallTimerRef.current = setTimeout(() => {
      if (taskRef.current) taskRef.current.cancel()
    }, STALL_TIMEOUT_MS)
  }

  const handleFile = async (fileInput) => {
    if (!fileInput) return
    setError('')
    setUploading(true)
    setProgress(0)

    const file = await compressImageIfNeeded(fileInput)
    const contentType = resolveContentType(file)
    if (!matchesAccept(contentType, accept)) {
      setUploading(false)
      setError('Arquivo inválido. Envie uma foto ou um vídeo.')
      return
    }

    const ext = contentType === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() || 'bin').toLowerCase()
    const storageRef = ref(storage, `${path}/${Date.now()}.${ext}`)
    const task = uploadBytesResumable(storageRef, file, contentType ? { contentType } : undefined)
    taskRef.current = task
    armStallTimer()

    task.on('state_changed',
      (snap) => {
        armStallTimer()
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
      },
      (err) => {
        clearStallTimer()
        taskRef.current = null
        console.error(err)
        setUploading(false)
        setError(
          err && err.code === 'storage/canceled'
            ? 'A conexão está muito lenta para enviar agora. Tente com wi-fi ou uma foto menor.'
            : 'Não foi possível enviar o arquivo. Tente novamente.'
        )
      },
      async () => {
        clearStallTimer()
        taskRef.current = null
        const url = await getDownloadURL(task.snapshot.ref)
        onChange(url)
        setUploading(false)
        setProgress(0)
      }
    )
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const isVideo = value && (value.includes('.mp4') || value.includes('.webm') || value.includes('.mov') || value.includes('.m4v'))

  return (
    <div>
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: '2px dashed #d1d5db', borderRadius: 10, padding: '1.5rem',
          textAlign: 'center', cursor: 'pointer', background: '#fafbfc',
          transition: 'border-color .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#4971B1'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#d1d5db'}
      >
        {uploading ? (
          <div>
            <div style={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#4971B1', borderRadius: 3, transition: 'width .3s' }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{progress > 0 ? `Enviando... ${progress}%` : 'Preparando arquivo...'}</span>
          </div>
        ) : value ? (
          <div>
            {isVideo ? (
              <video src={value} style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 6 }} controls />
            ) : (
              <img src={value} alt="Preview" style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 6, objectFit: 'cover' }} />
            )}
            <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 8 }}>Clique para trocar</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>📁</div>
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>Toque para escolher uma foto ou vídeo</p>
            <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>JPG, PNG, HEIC, GIF, MP4</p>
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 6 }}>{error}</p>}
      <input ref={fileRef} type="file" accept={accept} onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
    </div>
  )
}
