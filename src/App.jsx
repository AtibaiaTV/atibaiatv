import { Routes, Route, Outlet } from 'react-router-dom'
import TopBar    from './components/TopBar'
import Header    from './components/Header'
import Ticker    from './components/Ticker'
import InfoStrip from './components/InfoStrip'
import Footer    from './components/Footer'
import VLibras   from './components/VLibras'
import Home         from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticlePage  from './pages/ArticlePage'
import Denuncia     from './pages/Denuncia'
import Ranking      from './pages/Ranking'
import Mural        from './pages/Mural'
import { SobrePage, AnunciePage, ContatoPage, PrivacidadePage } from './pages/StaticPages'

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
import DenunciasList     from './pages/dashboard/DenunciasList'
import EnquetesList      from './pages/dashboard/EnquetesList'
import SocialPosts       from './pages/dashboard/SocialPosts'
import Fiscal             from './pages/dashboard/Fiscal'

function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Header />
      <Ticker />
      <InfoStrip />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <VLibras />
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
        <Route path="/regiao"    element={<CategoryPage />} />
        <Route path="/horoscopo" element={<CategoryPage />} />
        <Route path="/participe" element={<Denuncia />} />
        <Route path="/ranking"   element={<Ranking />} />
        <Route path="/mural"     element={<Mural />} />
        <Route path="/artigo/:id" element={<ArticlePage />} />
        <Route path="/sobre"      element={<SobrePage />} />
        <Route path="/anuncie"    element={<AnunciePage />} />
        <Route path="/contato"    element={<ContatoPage />} />
        <Route path="/privacidade" element={<PrivacidadePage />} />
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
          <Route path="/dashboard/denuncias"    element={<DenunciasList />} />
          <Route path="/dashboard/enquetes"     element={<EnquetesList />} />
          <Route path="/dashboard/social"       element={<SocialPosts />} />
          <Route path="/dashboard/fiscal"       element={<Fiscal />} />
        </Route>
      </Route>
    </Routes>
  )
}
