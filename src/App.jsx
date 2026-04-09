import { Routes, Route, Outlet } from 'react-router-dom'
import TopBar    from './components/TopBar'
import Header    from './components/Header'
import Ticker    from './components/Ticker'
import Footer    from './components/Footer'
import Home         from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticlePage  from './pages/ArticlePage'
import { SobrePage, AnunciePage, ContatoPage } from './pages/StaticPages'

import ProtectedRoute    from './components/dashboard/ProtectedRoute'
import DashboardLogin    from './pages/dashboard/DashboardLogin'
import DashboardLayout   from './pages/dashboard/DashboardLayout'
import DashboardHome     from './pages/dashboard/DashboardHome'
import ArticlesList      from './pages/dashboard/ArticlesList'
import ArticleForm       from './pages/dashboard/ArticleForm'
import VideosList        from './pages/dashboard/VideosList'
import VideoForm         from './pages/dashboard/VideoForm'
import TickerManager     from './pages/dashboard/TickerManager'
import BannersList       from './pages/dashboard/BannersList'
import BannerForm        from './pages/dashboard/BannerForm'

function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Header />
      <Ticker />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/"           element={<Home />} />
        <Route path="/noticias"   element={<CategoryPage />} />
        <Route path="/cultura"    element={<CategoryPage />} />
        <Route path="/eventos"    element={<CategoryPage />} />
        <Route path="/esportes"   element={<CategoryPage />} />
        <Route path="/turismo"    element={<CategoryPage />} />
        <Route path="/economia"   element={<CategoryPage />} />
        <Route path="/seguranca"  element={<CategoryPage />} />
        <Route path="/mobilidade" element={<CategoryPage />} />
        <Route path="/educacao"  element={<CategoryPage />} />
        <Route path="/saude"     element={<CategoryPage />} />
        <Route path="/politica"  element={<CategoryPage />} />
        <Route path="/brasil"    element={<CategoryPage />} />
        <Route path="/mundo"     element={<CategoryPage />} />
        <Route path="/cidade"    element={<CategoryPage />} />
        <Route path="/zeladoria" element={<CategoryPage />} />
        <Route path="/alimentacao" element={<CategoryPage />} />
        <Route path="/artigo/:id" element={<ArticlePage />} />
        <Route path="/sobre"      element={<SobrePage />} />
        <Route path="/anuncie"    element={<AnunciePage />} />
        <Route path="/contato"    element={<ContatoPage />} />
      </Route>

      {/* Dashboard */}
      <Route path="/dashboard/login" element={<DashboardLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"              element={<DashboardHome />} />
          <Route path="/dashboard/articles"     element={<ArticlesList />} />
          <Route path="/dashboard/articles/new" element={<ArticleForm />} />
          <Route path="/dashboard/articles/:id" element={<ArticleForm />} />
          <Route path="/dashboard/videos"       element={<VideosList />} />
          <Route path="/dashboard/videos/new"   element={<VideoForm />} />
          <Route path="/dashboard/videos/:id"   element={<VideoForm />} />
          <Route path="/dashboard/ticker"       element={<TickerManager />} />
          <Route path="/dashboard/banners"      element={<BannersList />} />
          <Route path="/dashboard/banners/new"  element={<BannerForm />} />
          <Route path="/dashboard/banners/:id"  element={<BannerForm />} />
        </Route>
      </Route>
    </Routes>
  )
}
