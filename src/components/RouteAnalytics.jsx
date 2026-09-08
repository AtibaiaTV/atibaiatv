import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../analytics'

// Envia um page_view ao GA a cada troca de rota da SPA.
export default function RouteAnalytics() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    trackPageView(pathname + search)
  }, [pathname, search])

  return null
}
