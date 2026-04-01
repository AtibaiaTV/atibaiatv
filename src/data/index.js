// ─── CORES BASEADAS NOS LOGOS REAIS ──────────────────────────────────────────
export const COLORS = {
  blue:       '#4a6fa5',   // "Atibaia" no logo horizontal
  blueDark:   '#2d5282',
  blueLight:  '#eef3fa',
  green:      '#5aab3a',   // "TV" no logo horizontal
  greenDark:  '#3d7a25',
  greenLight: '#edf7e8',
  red:        '#c0392b',   // badge ao vivo
  text:       '#1a1a2e',
  muted:      '#6b7280',
  border:     '#e5e7eb',
  surface:    '#f9fafb',
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
export const TICKER_ITEMS = [
  'Prefeitura anuncia plano de revitalização do centro histórico com R$ 12 milhões',
  'Festival de Orquídeas 2025 bate recorde com mais de 80 mil visitantes',
  'Obras da nova ponte sobre o Rio Atibaia têm previsão de conclusão para março',
  'Time de futsal conquista título estadual na categoria sub-17',
  'Temperatura pode chegar a 38°C neste fim de semana em Atibaia, alerta Inmet',
  'Atibaia é eleita entre as 10 melhores cidades do interior paulista para viver',
]

// ─── EDITORIAS ───────────────────────────────────────────────────────────────
export const EDITORIAS = [
  { slug: 'noticias',  label: 'Notícias',   icon: '📰', color: '#4a6fa5', bg: '#eef3fa', description: 'Tudo o que acontece em Atibaia e região' },
  { slug: 'cultura',   label: 'Cultura',    icon: '🎭', color: '#8b44c2', bg: '#f3eafa', description: 'Arte, música, teatro e patrimônio local' },
  { slug: 'eventos',   label: 'Eventos',    icon: '📅', color: '#5aab3a', bg: '#edf7e8', description: 'Agenda completa da cidade e região' },
  { slug: 'esportes',  label: 'Esportes',   icon: '⚽', color: '#c47a00', bg: '#fff7e0', description: 'Esporte amador e profissional da região' },
  { slug: 'turismo',   label: 'Turismo',    icon: '🏔️', color: '#1a8c7a', bg: '#e6f7f5', description: 'Serra de Atibaia, ecoturismo e destinos' },
  { slug: 'economia',  label: 'Economia',   icon: '💼', color: '#c0392b', bg: '#faeaea', description: 'Negócios, empregos e desenvolvimento local' },
]

// ─── PROGRAMAÇÃO ─────────────────────────────────────────────────────────────
export const SCHEDULE = [
  { time: '07:00', name: 'Bom Dia Atibaia',     category: 'Notícias',   live: false },
  { time: '09:00', name: 'Atibaia em Foco',      category: 'Variedades', live: false },
  { time: '12:00', name: 'Jornal do Meio-Dia',   category: 'Notícias',   live: false },
  { time: '14:00', name: 'Jornal da Tarde',      category: 'Notícias',   live: true  },
  { time: '16:30', name: 'Cultura em Cena',      category: 'Cultura',    live: false },
  { time: '18:00', name: 'Agenda da Cidade',     category: 'Eventos',    live: false },
  { time: '20:00', name: 'Jornal da Noite',      category: 'Notícias',   live: false },
  { time: '21:30', name: 'Esporte Total',        category: 'Esportes',   live: false },
]

// ─── CATEGORIAS ──────────────────────────────────────────────────────────────
export const CATEGORIES = ['Todos', 'Notícias', 'Cultura', 'Eventos', 'Esportes', 'Turismo', 'Economia']

// ─── TAG STYLES ──────────────────────────────────────────────────────────────
export const TAG_STYLES = {
  Notícias:   { bg: '#eef3fa', color: '#4a6fa5' },
  Cultura:    { bg: '#f3eafa', color: '#8b44c2' },
  Eventos:    { bg: '#edf7e8', color: '#3d7a25' },
  Esportes:   { bg: '#fff7e0', color: '#c47a00' },
  Turismo:    { bg: '#e6f7f5', color: '#1a8c7a' },
  Economia:   { bg: '#faeaea', color: '#c0392b' },
  Variedades: { bg: '#fce4ec', color: '#b71c5b' },
}

// ─── NOTÍCIAS ────────────────────────────────────────────────────────────────
export const NEWS = [
  { id: 1,  title: 'Prefeitura anuncia plano de revitalização do centro histórico com R$ 12 milhões em investimentos', category: 'Notícias',  author: 'Redação Atibaia TV', time: 'há 2 horas',  featured: true,  color: 'blue'   },
  { id: 2,  title: 'Orquestra Municipal abre temporada 2025 com concerto gratuito na Praça Central',                  category: 'Cultura',   author: 'Redação Atibaia TV', time: 'há 4 horas',  featured: false, color: 'purple' },
  { id: 3,  title: 'Feira de Artesanato e Gastronomia chega à 15ª edição neste sábado em Atibaia',                   category: 'Eventos',   author: 'Redação Atibaia TV', time: 'há 6 horas',  featured: false, color: 'green'  },
  { id: 4,  title: 'Atibaia é eleita entre as 10 melhores cidades do interior paulista para se viver em 2025',       category: 'Notícias',  author: 'Redação Atibaia TV', time: 'Ontem',       featured: false, color: 'blue'   },
  { id: 5,  title: 'Atibaia FC empata em 1 a 1 com Bragantino na Copa Regional Sub-20',                              category: 'Esportes',  author: 'Redação Atibaia TV', time: 'Ontem',       featured: false, color: 'orange' },
  { id: 6,  title: 'Novo CEI inaugura na zona leste e amplia vagas para crianças de 0 a 3 anos',                     category: 'Notícias',  author: 'Redação Atibaia TV', time: 'há 2 dias',   featured: false, color: 'blue'   },
  { id: 7,  title: 'Trilha das Orquídeas recebe recorde de visitantes neste verão na Serra de Atibaia',              category: 'Turismo',   author: 'Redação Atibaia TV', time: 'há 2 dias',   featured: false, color: 'teal'   },
  { id: 8,  title: 'Mostra de cinema local exibe 12 curtas produzidos por realizadores de Atibaia',                  category: 'Cultura',   author: 'Redação Atibaia TV', time: 'há 2 dias',   featured: false, color: 'purple' },
  { id: 9,  title: 'Maratona de Atibaia 2025 terá percurso renovado e inscrições abertas até fim do mês',            category: 'Esportes',  author: 'Redação Atibaia TV', time: 'há 3 dias',   featured: false, color: 'orange' },
  { id: 10, title: 'Parque ecológico da zona norte tem projeto aprovado pela Câmara Municipal',                       category: 'Notícias',  author: 'Redação Atibaia TV', time: 'há 3 dias',   featured: false, color: 'blue'   },
  { id: 11, title: 'Empresas de Atibaia geram 340 novos empregos no primeiro trimestre de 2025',                     category: 'Economia',  author: 'Redação Atibaia TV', time: 'há 4 dias',   featured: false, color: 'red'    },
  { id: 12, title: 'Rota turística da Serra de Atibaia integra novo roteiro estadual de ecoturismo',                 category: 'Turismo',   author: 'Redação Atibaia TV', time: 'há 4 dias',   featured: false, color: 'teal'   },
]

// ─── VÍDEOS RECENTES ─────────────────────────────────────────────────────────
export const RECENT_VIDEOS = [
  { id: 'v1', title: 'Jornal da Tarde — Edição 01/04/2025', duration: '22:14', views: '1.2k', thumb: 'blue'   },
  { id: 'v2', title: 'Festival de Orquídeas: cobertura especial', duration: '18:40', views: '3.4k', thumb: 'green'  },
  { id: 'v3', title: 'Entrevista: prefeito fala sobre obras',       duration: '14:05', views: '980',  thumb: 'blue'   },
  { id: 'v4', title: 'Esporte Total — Rodada do fim de semana',     duration: '26:30', views: '2.1k', thumb: 'orange' },
]
