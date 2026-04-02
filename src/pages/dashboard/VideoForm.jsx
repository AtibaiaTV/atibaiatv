import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import DashFormField, { inputStyle } from '../../components/dashboard/DashFormField'
import ImageUpload from '../../components/dashboard/ImageUpload'

export default function VideoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ title: '', duration: '', youtubeUrl: '', thumbnailUrl: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    getDoc(doc(db, 'videos', id)).then(snap => {
      if (snap.exists()) setForm(snap.data())
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'videos', id), form)
      } else {
        await addDoc(collection(db, 'videos'), { ...form, createdAt: serverTimestamp() })
      }
      navigate('/dashboard/videos')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar video')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>{isEdit ? 'Editar Video' : 'Novo Video'}</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <DashFormField label="Titulo">
          <input value={form.title} onChange={e => set('title', e.target.value)} required style={inputStyle} />
        </DashFormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <DashFormField label="Duracao" hint="Ex: 14:30">
            <input value={form.duration} onChange={e => set('duration', e.target.value)} style={inputStyle} placeholder="00:00" />
          </DashFormField>
          <DashFormField label="URL do YouTube">
            <input value={form.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)} style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
          </DashFormField>
        </div>
        <DashFormField label="Thumbnail">
          <ImageUpload value={form.thumbnailUrl} onChange={url => set('thumbnailUrl', url)} path="videos" accept="image/*" />
        </DashFormField>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: saving ? '#93a3b8' : '#4971B1', color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard/videos')} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </>
  )
}
