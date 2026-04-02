import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase'

export default function ImageUpload({ value, onChange, path, accept = 'image/*,video/*' }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const storageRef = ref(storage, `${path}/${Date.now()}.${ext}`)
    const task = uploadBytesResumable(storageRef, file)

    task.on('state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { console.error(err); setUploading(false) },
      async () => {
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

  const isVideo = value && (value.includes('.mp4') || value.includes('.webm') || value.includes('.mov'))

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
            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Enviando... {progress}%</span>
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
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>Clique ou arraste um arquivo</p>
            <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>JPG, PNG, GIF, MP4</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept={accept} onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
    </div>
  )
}
