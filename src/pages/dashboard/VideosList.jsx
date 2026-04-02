import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { useNavigate, Link } from 'react-router-dom'
import DashTable from '../../components/dashboard/DashTable'

const COLUMNS = [
  { key: 'title', label: 'Titulo', render: (row) => <span style={{ fontWeight: 600 }}>{row.title}</span> },
  { key: 'duration', label: 'Duracao' },
  {
    key: 'youtubeUrl', label: 'YouTube',
    render: (row) => row.youtubeUrl ? <a href={row.youtubeUrl} target="_blank" rel="noreferrer" style={{ color: '#4971B1', fontSize: '0.78rem' }}>Abrir</a> : '—',
  },
  {
    key: 'createdAt', label: 'Data',
    render: (row) => row.createdAt?.toDate ? row.createdAt.toDate().toLocaleDateString('pt-BR') : '—',
  },
]

export default function VideosList() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetch = async () => {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const handleDelete = async (row) => {
    if (!window.confirm(`Excluir "${row.title}"?`)) return
    await deleteDoc(doc(db, 'videos', row.id))
    fetch()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Videos</h1>
        <Link to="/dashboard/videos/new" style={{ padding: '10px 20px', borderRadius: 8, background: '#4971B1', color: '#fff', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>+ Novo Video</Link>
      </div>
      <DashTable columns={COLUMNS} data={videos} onEdit={(row) => navigate(`/dashboard/videos/${row.id}`)} onDelete={handleDelete} />
    </>
  )
}
