import { Routes, Route, Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
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
import MigrateArticles   from './pages/dashboard/MigrateArticles'
import PublishingGuide   from './pages/dashboard/PublishingGuide'
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
    <>
      {/* defaults do site inteiro; paginas de artigo sobrescrevem com o
          proprio Helmet em ArticlePage.jsx */}
      <Helmet>
        <title>Atibaia TV — A TV da sua cidade</title>
        <meta name="description" content="Atibaia TV — Notícias, cultura, eventos e esportes de Atibaia e região. Afiliada Rede Redesa." />
        <meta name="keywords" content="Atibaia, TV, notícias, cultura, eventos, esportes, turismo, Redesa" />
        <link rel="canonical" href="https://www.atibaiatv.com.br" />
        <meta property="og:title" content="Atibaia TV" />
        <meta property="og:description" content="A TV da sua cidade. Notícias, cultura, eventos e esportes de Atibaia e região." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.atibaiatv.com.br" />
        <meta property="og:site_name" content="Atibaia TV" />
        <meta property="og:image" content="https://www.atibaiatv.com.br/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Atibaia TV" />
        <meta name="twitter:description" content="A TV da sua cidade. Notícias, cultura, eventos e esportes de Atibaia e região." />
        <meta name="twitter:image" content="https://www.atibaiatv.com.br/logo.png" />
      </Helmet>
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
        <Route path="/artigo/:id/:slug" element={<ArticlePage />} />
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
          <Route path="/dashboard/articles/completar" element={<MigrateArticles />} />
          <Route path="/dashboard/articles/padrao" element={<PublishingGuide />} />
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
    </>
  )
}
