import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { useNavigate, Link } from 'react-router-dom'
import DashTable from '../../components/dashboard/DashTable'
import { TAG_STYLES } from '../../data'

const COLUMNS = [
  {
    key: 'title', label: 'Titulo',
    render: (row) => (
      <div style={{ maxWidth: 300 }}>
        <div style={{ fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>{row.title}</div>
      </div>
    ),
  },
  {
    key: 'category', label: 'Editoria',
    render: (row) => {
      const s = TAG_STYLES[row.category] || { bg: '#f3f4f6', color: '#6b7280' }
      return <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: s.bg, color: s.color }}>{row.category}</span>
    },
  },
  { key: 'author', label: 'Autor' },
  {
    key: 'featured', label: 'Destaque',
    render: (row) => row.featured ? '⭐' : '—',
  },
  {
    key: 'createdAt', label: 'Data',
    render: (row) => row.createdAt?.toDate ? row.createdAt.toDate().toLocaleDateString('pt-BR') : '—',
  },
]

export default function ArticlesList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchArticles = async () => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const handleDelete = async (row) => {
    if (!window.confirm(`Excluir "${row.title}"?`)) return
    await deleteDoc(doc(db, 'articles', row.id))
    fetchArticles()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Materias</h1>
        <Link to="/dashboard/articles/new" style={{
          padding: '10px 20px', borderRadius: 8, background: '#4971B1', color: '#fff',
          fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'background .15s',
        }}>
          + Nova Materia
        </Link>
      </div>
      <DashTable
        columns={COLUMNS}
        data={articles}
        onEdit={(row) => navigate(`/dashboard/articles/${row.id}`)}
        onDelete={handleDelete}
      />
    </>
  )
}
