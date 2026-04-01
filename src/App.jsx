import { Routes, Route } from 'react-router-dom'
import TopBar    from './components/TopBar'
import Header    from './components/Header'
import Ticker    from './components/Ticker'
import Footer    from './components/Footer'
import Home         from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import AoVivo       from './pages/AoVivo'
import ArticlePage  from './pages/ArticlePage'
import { SobrePage, AnunciePage, ContatoPage } from './pages/StaticPages'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Header />
      <Ticker />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/noticias"        element={<CategoryPage />} />
          <Route path="/cultura"         element={<CategoryPage />} />
          <Route path="/eventos"         element={<CategoryPage />} />
          <Route path="/esportes"        element={<CategoryPage />} />
          <Route path="/turismo"         element={<CategoryPage />} />
          <Route path="/economia"        element={<CategoryPage />} />
          <Route path="/ao-vivo"         element={<AoVivo />} />
          <Route path="/artigo/:id"      element={<ArticlePage />} />
          <Route path="/sobre"           element={<SobrePage />} />
          <Route path="/anuncie"         element={<AnunciePage />} />
          <Route path="/contato"         element={<ContatoPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
