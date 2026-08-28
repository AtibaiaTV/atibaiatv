import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import DashFormField, { inputStyle, selectStyle, textareaStyle } from '../../components/dashboard/DashFormField'
import ImageUpload from '../../components/dashboard/ImageUpload'
import { EDITORIAS } from '../../data'

const COLORS = ['blue', 'green', 'red', 'orange', 'purple', 'teal']

export default function ArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '', subtitle: '', summary: '', category: 'Notícias',
    author: 'Redacao Atibaia TV', location: 'Atibaia',
    body: '', featured: false, color: 'blue', thumbnailUrl: '',
    imageCaption: '', imageCredit: '',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    getDoc(doc(db, 'articles', id)).then(snap => {
      if (snap.exists()) setForm({ ...snap.data(), thumbnailUrl: snap.data().thumbnailUrl || '' })
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...form, updatedAt: serverTimestamp() }
      if (isEdit) {
        await updateDoc(doc(db, 'articles', id), data)
      } else {
        data.createdAt = serverTimestamp()
        data.publishedAt = serverTimestamp()
        await addDoc(collection(db, 'articles'), data)
      }
      navigate('/dashboard/articles')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar materia')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>
        {isEdit ? 'Editar Materia' : 'Nova Materia'}
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 800, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <DashFormField label="Titulo">
          <input value={form.title} onChange={e => set('title', e.target.value)} required style={inputStyle} placeholder="Titulo da materia" />
        </DashFormField>

        <DashFormField label="Subtitulo" hint="Linha fina exibida abaixo do titulo, como no G1">
          <textarea value={form.subtitle} onChange={e => set('subtitle', e.target.value)} style={{ ...textareaStyle, minHeight: 70 }} placeholder="Resuma a materia em uma ou duas frases" />
        </DashFormField>

        <DashFormField label="Resumo (Ver resumo)" hint="Um topico por linha; aparece na caixa retratil no topo da materia">
          <textarea value={form.summary} onChange={e => set('summary', e.target.value)} style={{ ...textareaStyle, minHeight: 90 }} placeholder={'Primeiro ponto principal\nSegundo ponto principal'} />
        </DashFormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <DashFormField label="Editoria">
            <select value={form.category} onChange={e => set('category', e.target.value)} style={selectStyle}>
              {EDITORIAS.map(ed => <option key={ed.slug} value={ed.label}>{ed.label}</option>)}
            </select>
          </DashFormField>

          <DashFormField label="Autor">
            <input value={form.author} onChange={e => set('author', e.target.value)} style={inputStyle} />
          </DashFormField>

          <DashFormField label="Cidade / local">
            <input value={form.location} onChange={e => set('location', e.target.value)} style={inputStyle} placeholder="Atibaia" />
          </DashFormField>

          <DashFormField label="Cor do card">
            <select value={form.color} onChange={e => set('color', e.target.value)} style={selectStyle}>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </DashFormField>
        </div>

        <DashFormField label="Texto da materia" hint={'Linha em branco separa paragrafos. Comece uma linha com "## " para criar um intertitulo.'}>
          <textarea value={form.body} onChange={e => set('body', e.target.value)} required style={textareaStyle} placeholder="Escreva o conteudo da materia..." />
        </DashFormField>

        <DashFormField label="Imagem de capa" hint="Arraste ou clique para enviar">
          <ImageUpload value={form.thumbnailUrl} onChange={url => set('thumbnailUrl', url)} path="articles" accept="image/*" />
        </DashFormField>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <DashFormField label="Legenda da foto">
            <input value={form.imageCaption} onChange={e => set('imageCaption', e.target.value)} style={inputStyle} placeholder="Descreva a imagem" />
          </DashFormField>
          <DashFormField label="Credito da foto">
            <input value={form.imageCredit} onChange={e => set('imageCredit', e.target.value)} style={inputStyle} placeholder="Atibaia TV" />
          </DashFormField>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>Materia em destaque</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={saving} style={{
            padding: '10px 24px', borderRadius: 8, border: 'none',
            background: saving ? '#93a3b8' : '#4971B1', color: '#fff',
            fontSize: '0.88rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Salvando...' : isEdit ? 'Atualizar' : 'Publicar'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard/articles')} style={{
            padding: '10px 24px', borderRadius: 8, border: '1px solid #e5e7eb',
            background: '#fff', color: '#6b7280', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer',
          }}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  )
}
