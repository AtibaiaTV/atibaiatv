import { useState, useRef } from 'react'
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase'

export var MAX_VIDEO_SECONDS = 10 * 60
var MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024
var STALL_TIMEOUT_MS = 60000
var POSTER_MAX_WIDTH = 1280

var EXT_TO_MIME = { mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm' }

function resolveContentType(file) {
  if (file.type) return file.type
  var ext = (file.name.split('.').pop() || '').toLowerCase()
  return EXT_TO_MIME[ext] || ''
}

export function formatDuration(totalSeconds) {
  var s = Math.max(0, Math.round(totalSeconds))
  var m = Math.floor(s / 60)
  var r = s % 60
  return m + ':' + (r < 10 ? '0' + r : r)
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024 * 1024) return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB'
  return Math.round(bytes / 1024 / 1024) + ' MB'
}

/* abre o arquivo no proprio navegador so para descobrir a duracao e tirar um
   quadro de capa. Assim o limite de 10 minutos barra o arquivo antes de gastar
   upload, e a capa nasce do proprio video sem ninguem precisar montar uma */
function inspectVideo(file) {
  return new Promise(function(resolve, reject) {
    var url = URL.createObjectURL(file)
    var video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    var finish = function(result) { URL.revokeObjectURL(url); resolve(result) }
    var fail = function(msg) { URL.revokeObjectURL(url); reject(new Error(msg)) }

    video.onerror = function() {
      fail('Não foi possível ler esse vídeo. Use um arquivo MP4 (H.264).')
    }

    video.onloadedmetadata = function() {
      var duration = video.duration
      if (!isFinite(duration) || duration <= 0) {
        fail('Não foi possível ler a duração desse vídeo. Use um arquivo MP4 (H.264).')
        return
      }
      var info = { duration: duration, vertical: video.videoHeight > video.videoWidth, poster: null }
      if (duration > MAX_VIDEO_SECONDS) { finish(info); return }

      var gaveUp = setTimeout(function() { finish(info) }, 8000)
      video.onseeked = function() {
        clearTimeout(gaveUp)
        try {
          var scale = Math.min(1, POSTER_MAX_WIDTH / video.videoWidth)
          var canvas = document.createElement('canvas')
          canvas.width = Math.round(video.videoWidth * scale)
          canvas.height = Math.round(video.videoHeight * scale)
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
          canvas.toBlob(function(blob) { info.poster = blob; finish(info) }, 'image/jpeg', 0.82)
        } catch (e) {
          finish(info)
        }
      }
      video.currentTime = Math.min(1, duration / 2)
    }

    video.src = url
  })
}

export default function VideoUpload({ value, onChange }) {
  var [uploading, setUploading] = useState(false)
  var [progress, setProgress] = useState(0)
  var [checking, setChecking] = useState(false)
  var [error, setError] = useState('')
  var fileRef = useRef()
  var taskRef = useRef(null)
  var stallTimerRef = useRef(null)

  var clearStallTimer = function() {
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current)
  }

  var armStallTimer = function() {
    clearStallTimer()
    stallTimerRef.current = setTimeout(function() {
      if (taskRef.current) taskRef.current.cancel()
    }, STALL_TIMEOUT_MS)
  }

  var cancelUpload = function() {
    clearStallTimer()
    if (taskRef.current) taskRef.current.cancel()
  }

  var handleFile = async function(file) {
    if (!file) return
    setError('')

    var contentType = resolveContentType(file)
    if (!contentType.startsWith('video/')) {
      setError('Arquivo inválido. Envie um vídeo (MP4 é o mais seguro).')
      return
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError('Arquivo muito grande (' + formatSize(file.size) + '). O limite é ' + formatSize(MAX_VIDEO_BYTES) + ' — para 10 minutos, exporte em 1080p.')
      return
    }

    setChecking(true)
    var info
    try {
      info = await inspectVideo(file)
    } catch (e) {
      setChecking(false)
      setError(e.message)
      return
    }
    setChecking(false)

    if (info.duration > MAX_VIDEO_SECONDS) {
      setError('Esse vídeo tem ' + formatDuration(info.duration) + ' e o limite é 10:00. Corte o vídeo e envie de novo.')
      return
    }

    setUploading(true)
    setProgress(0)

    var ext = (file.name.split('.').pop() || 'mp4').toLowerCase()
    var stamp = Date.now()
    var storageRef = ref(storage, 'videos/files/' + stamp + '.' + ext)
    var task = uploadBytesResumable(storageRef, file, { contentType: contentType })
    taskRef.current = task
    armStallTimer()

    task.on('state_changed',
      function(snap) {
        armStallTimer()
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
      },
      function(err) {
        clearStallTimer()
        taskRef.current = null
        console.error(err)
        setUploading(false)
        setError(
          err && err.code === 'storage/canceled'
            ? 'Envio cancelado ou conexão parada por muito tempo. Tente de novo, de preferência no wi-fi.'
            : 'Não foi possível enviar o vídeo. Tente novamente.'
        )
      },
      async function() {
        clearStallTimer()
        taskRef.current = null
        try {
          var url = await getDownloadURL(task.snapshot.ref)
          var posterUrl = ''
          if (info.poster) {
            try {
              var posterRef = ref(storage, 'videos/' + stamp + '-capa.jpg')
              await uploadBytes(posterRef, info.poster, { contentType: 'image/jpeg' })
              posterUrl = await getDownloadURL(posterRef)
            } catch (e) {
              console.error(e) // sem capa o video continua valendo; o formulario deixa enviar uma a mao
            }
          }
          onChange({
            url: url,
            duration: formatDuration(info.duration),
            durationSeconds: Math.round(info.duration),
            vertical: info.vertical,
            posterUrl: posterUrl,
          })
        } catch (e) {
          console.error(e)
          setError('O vídeo subiu, mas não foi possível obter o endereço dele. Tente novamente.')
        }
        setUploading(false)
        setProgress(0)
      }
    )
  }

  var busy = uploading || checking

  return (
    <div>
      <div
        onClick={function() { if (!busy) fileRef.current && fileRef.current.click() }}
        onDrop={function(e) { e.preventDefault(); if (!busy) handleFile(e.dataTransfer.files[0]) }}
        onDragOver={function(e) { e.preventDefault() }}
        style={{
          border: '2px dashed #d1d5db', borderRadius: 10, padding: '1.5rem',
          textAlign: 'center', cursor: busy ? 'default' : 'pointer', background: '#fafbfc',
        }}
      >
        {checking ? (
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Verificando o vídeo...</span>
        ) : uploading ? (
          <div>
            <div style={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: progress + '%', height: '100%', background: '#4971B1', borderRadius: 3, transition: 'width .3s' }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
              {progress > 0 ? 'Enviando... ' + progress + '%' : 'Preparando envio...'}
            </span>
            <div>
              <button type="button" onClick={function(e) { e.stopPropagation(); cancelUpload() }} style={{ marginTop: 8, padding: '4px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: '0.72rem', cursor: 'pointer' }}>
                Cancelar envio
              </button>
            </div>
          </div>
        ) : value ? (
          <div>
            <video src={value} controls preload="metadata" onClick={function(e) { e.stopPropagation() }} style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 6, background: '#000' }} />
            <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 8 }}>Clique aqui para trocar o vídeo</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>🎬</div>
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>Toque para escolher o vídeo, ou arraste o arquivo para cá</p>
            <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Até 10 minutos · MP4 (H.264) é o formato mais compatível</p>
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 6 }}>{error}</p>}
      <input ref={fileRef} type="file" accept="video/*" onChange={function(e) { handleFile(e.target.files[0]); e.target.value = '' }} style={{ display: 'none' }} />
    </div>
  )
}
