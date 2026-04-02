import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import DashFormField, { inputStyle, selectStyle } from '../../components/dashboard/DashFormField'
import ImageUpload from '../../components/dashboard/ImageUpload'

export default function BannerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ type: 'billboard', mediaUrl: '', mediaType: 'image', href: '', active: true })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    getDoc(doc(db, 'banners', id)).then(snap => {
      if (snap.exists()) setForm(snap.data())
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleMediaChange = (url) => {
    const isVideo = /.(mp4|webm|mov)/i.test(url)
    setForm(f => ({ ...f, mediaUrl: url, mediaType: isVideo ? 'video' : 'image' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'banners', id), form)
      } else {
        await addDoc(collection(db, 'banners'), { ...form, createdAt: serverTimestamp() })
      }
      navigate('/dashboard/banners')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar banner')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>{isEdit ? 'Editar Banner' : 'Novo Banner'}</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <DashFormField label="Tipo de banner">
            <select value={form.type} onChange={e => set('type', e.target.value)} style={selectStyle}>
              <option value="billboard">Billboard (1920x200)</option>
              <option value="leaderboard">Leaderboard (1200x300)</option>
              <option value="square">Square (300x300)</option>
            </select>
          </DashFormField>
          <DashFormField label="Link (href)">
            <input value={form.href} onChange={e => set('href', e.target.value)} style={inputStyle} placeholder="https://..." />
          </DashFormField>
        </div>
        <DashFormField label="Midia (imagem ou video)" hint="JPG, PNG, GIF, MP4">
          <ImageUpload value={form.mediaUrl} onChange={handleMediaChange} path="banners" accept="image/*,video/*" />
        </DashFormField>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>Banner ativo</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: saving ? '#93a3b8' : '#4971B1', color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard/banners')} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </>
  )
}
