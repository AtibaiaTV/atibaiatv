import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function DashboardLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Email ou senha incorretos' : 'Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #e5e7eb', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f1b2d 0%, #1a3a5c 100%)' }}>
      <form onSubmit={handleSubmit} style={{ width: 380, background: '#fff', borderRadius: 16, padding: '2.5rem 2rem', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logos/logo-horizontal.png" alt="Atibaia TV" style={{ height: 40, marginBottom: 12 }} />
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Painel Administrativo</h1>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 4 }}>Acesse com suas credenciais</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.82rem', padding: '10px 14px', borderRadius: 8, marginBottom: '1rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@atibaiatv.com.br" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Sua senha" style={inputStyle} />
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: 8, border: 'none',
          background: loading ? '#93a3b8' : '#4971B1', color: '#fff',
          fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background .2s',
        }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
