import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#4971B1', borderRadius: '50%', animation: 'atv-blink 0.8s linear infinite', margin: '0 auto 12px' }} />
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Carregando...</span>
        </div>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/dashboard/login" replace />
}
