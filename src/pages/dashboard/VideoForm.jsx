import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, addDoc, updateDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import DashFormField, { inputStyle, selectStyle, textareaStyle } from '../../components/dashboard/DashFormField'
import ImageUpload from '../../components/dashboard/ImageUpload'
import VideoUpload from '../../components/dashboard/VideoUpload'

/* o campo datetime-local trabalha com "AAAA-MM-DDTHH:MM" na hora local */
function toLocalInput(d) {
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function VideoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '', description: '', duration: '', durationSeconds: null,
    youtubeUrl: '', videoUrl: '', thumbnailUrl: '', format: 'video',
  })
  /* a data escolhida vira o createdAt do video, que e o que ordena o site inteiro;
     por isso uma data antiga manda o video para o seu lugar na linha do tempo */
  const [date, setDate] = useState(() => toLocalInput(new Date()))
  const [originalDate, setOriginalDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    getDoc(doc(db, 'videos', id)).then(snap => {
      if (snap.exists()) {
        const { createdAt, ...data } = snap.data()
        setForm(f => ({ ...f, ...data }))
        if (createdAt?.toDate) {
          const local = toLocalInput(createdAt.toDate())
          setDate(local)
          setOriginalDate(local)
        }
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleUploaded = ({ url, duration, durationSeconds, posterUrl }) => {
    setForm(f => ({
      ...f,
      videoUrl: url,
      duration,
      durationSeconds,
      /* so assume a capa automatica se ninguem escolheu outra */
      thumbnailUrl: f.thumbnailUrl || posterUrl,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.videoUrl && !form.youtubeUrl.trim()) {
      alert('Envie o arquivo do vídeo ou informe o link do YouTube.')
      return
    }
    const when = new Date(date)
    if (isNaN(when.getTime())) {
      alert('Informe uma data válida.')
      return
    }

    setSaving(true)
    try {
      const data = { ...form }
      if (!isEdit || date !== originalDate) data.createdAt = Timestamp.fromDate(when)
      if (isEdit) {
        await updateDoc(doc(db, 'videos', id), data)
      } else {
        await addDoc(collection(db, 'videos'), data)
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
      <form onSubmit={handleSubmit} style={{ maxWidth: 700, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <DashFormField label="Titulo">
          <input value={form.title} onChange={e => set('title', e.target.value)} required style={inputStyle} />
        </DashFormField>

        <DashFormField label="Texto" hint="Descricao que aparece abaixo do video. Linha em branco separa paragrafos.">
          <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} style={{ ...textareaStyle, minHeight: 140 }} placeholder="Conte o que o video mostra..." />
        </DashFormField>

        <DashFormField label="Data e hora de publicacao" hint="Pode ser uma data passada: o video entra na ordem do site conforme essa data.">
          <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
        </DashFormField>

        <DashFormField label="Video (ate 10 minutos)" hint="Envie o arquivo direto pelo site. Se preferir, use o link do YouTube mais abaixo.">
          <VideoUpload value={form.videoUrl} onChange={handleUploaded} />
        </DashFormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <DashFormField label="Duracao" hint="Preenchida sozinha ao enviar o arquivo. Ex: 14:30">
            <input value={form.duration} onChange={e => set('duration', e.target.value)} style={inputStyle} placeholder="00:00" />
          </DashFormField>
          <DashFormField label="URL do YouTube (opcional)">
            <input value={form.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)} style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
          </DashFormField>
        </div>

        <DashFormField label="Formato" hint="Videos curtos aparecem no carrossel vertical da home">
          <select value={form.format || 'video'} onChange={e => set('format', e.target.value)} style={selectStyle}>
            <option value="video">Video (16:9)</option>
            <option value="short">Video curto (vertical)</option>
          </select>
        </DashFormField>

        <DashFormField label="Thumbnail" hint="Ao enviar o arquivo, a capa e gerada do proprio video; troque aqui se quiser outra.">
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
