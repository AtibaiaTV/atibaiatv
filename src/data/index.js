// ─── CORES ATUALIZADAS ────────────────────────────────────────────────────────
export const COLORS = {
  blue:       '#4971B1',
  blueDark:   '#2d5282',
  blueLight:  '#eef3fa',
  green:      '#67AA4D',
  greenDark:  '#4a7a35',
  greenLight: '#edf7e8',
  red:        '#Cd0000',
  text:       '#1a1a2e',
  muted:      '#6b7280',
  border:     '#e5e7eb',
  surface:    '#f9fafb',
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
export const TICKER_ITEMS = [
  'Atibaia é a cidade mais segura do estado de São Paulo e 2ª mais segura do Brasil',
  'PM prende quadrilha especializada em roubo de caminhões na região de Atibaia',
  'Prefeitura abre consulta pública para reestruturar transporte coletivo da cidade',
  'Atenção: incidentes na Rodovia Fernão Dias causam interdições no sentido norte',
  'Mercado de trabalho aquecido: diversas vagas abertas em Atibaia neste mês',
  'Secretaria de Mobilidade realiza oficinas presenciais para novo sistema de transporte',
]

// ─── EDITORIAS ───────────────────────────────────────────────────────────────
export const EDITORIAS = [
  { slug: 'noticias',   label: 'Notícias',          icon: '📰', color: '#4971B1', bg: '#eef3fa', description: 'Tudo o que acontece em Atibaia e região' },
  { slug: 'cultura',    label: 'Cultura',            icon: '🎭', color: '#8b44c2', bg: '#f3eafa', description: 'Arte, música, teatro e patrimônio local' },
  { slug: 'eventos',    label: 'Eventos',            icon: '📅', color: '#67AA4D', bg: '#edf7e8', description: 'Agenda completa da cidade e região' },
  { slug: 'esportes',   label: 'Esportes',           icon: '⚽', color: '#c47a00', bg: '#fff7e0', description: 'Esporte amador e profissional da região' },
  { slug: 'turismo',    label: 'Turismo',            icon: '🏔️', color: '#1a8c7a', bg: '#e6f7f5', description: 'Serra de Atibaia, ecoturismo e destinos' },
  { slug: 'educacao',   label: 'Educação',           icon: '🎓', color: '#2563eb', bg: '#eff6ff', description: 'Ensino, escolas e educação em Atibaia' },
  { slug: 'saude',      label: 'Saúde',              icon: '🏥', color: '#059669', bg: '#ecfdf5', description: 'Saúde pública e bem-estar na cidade' },
  { slug: 'politica',   label: 'Política',           icon: '🏛️', color: '#7c3aed', bg: '#f5f3ff', description: 'Câmara, prefeitura e decisões políticas' },
  { slug: 'brasil',     label: 'Brasil',             icon: '🇧🇷', color: '#15803d', bg: '#f0fdf4', description: 'Notícias do Brasil em destaque' },
  { slug: 'mundo',      label: 'Mundo',              icon: '🌍', color: '#0891b2', bg: '#ecfeff', description: 'O que acontece no mundo' },
  { slug: 'cidade',     label: 'Cidade',             icon: '🏙️', color: '#b45309', bg: '#fffbeb', description: 'Infraestrutura, obras e bairros de Atibaia' },
  { slug: 'zeladoria',  label: 'Zeladoria',          icon: '🧹', color: '#0f766e', bg: '#f0fdfa', description: 'Conservação, limpeza e manutenção urbana' },
  { slug: 'alimentacao',label: 'Alimentação',         icon: '🍽️', color: '#dc2626', bg: '#fff1f2', description: 'Gastronomia, feiras e segurança alimentar' },
  { slug: 'economia',   label: 'Economia',           icon: '💼', color: '#Cd0000', bg: '#faeaea', description: 'Negócios, empregos e desenvolvimento local' },
  { slug: 'seguranca',  label: 'Segurança Pública',  icon: '🛡️', color: '#1a6fa8', bg: '#e8f4fd', description: 'Segurança e ordem pública em Atibaia' },
  { slug: 'mobilidade', label: 'Mobilidade',         icon: '🚌', color: '#7a5c00', bg: '#fff7e0', description: 'Trânsito, transporte e mobilidade urbana' },
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
export const CATEGORIES = ['Todos', 'Notícias', 'Segurança Pública', 'Mobilidade', 'Economia', 'Cultura', 'Eventos', 'Esportes', 'Turismo', 'Educação', 'Saúde', 'Política', 'Brasil', 'Mundo', 'Cidade', 'Zeladoria', 'Alimentação']

// ─── TAG STYLES ──────────────────────────────────────────────────────────────
export const TAG_STYLES = {
  'Notícias':         { bg: '#eef3fa', color: '#4971B1' },
  'Cultura':          { bg: '#f3eafa', color: '#8b44c2' },
  'Eventos':          { bg: '#edf7e8', color: '#4a7a35' },
  'Esportes':         { bg: '#fff7e0', color: '#c47a00' },
  'Turismo':          { bg: '#e6f7f5', color: '#1a8c7a' },
  'Economia':         { bg: '#faeaea', color: '#Cd0000' },
  'Segurança Pública':{ bg: '#e8f4fd', color: '#1a6fa8' },
  'Mobilidade':       { bg: '#fff7e0', color: '#7a5c00' },
  'Variedades':       { bg: '#fce4ec', color: '#b71c5b' },
  'Atibaia em Foco':  { bg: '#eef3fa', color: '#4971B1' },
}

// ─── NOTÍCIAS ────────────────────────────────────────────────────────────────
export const NEWS = [
  {
    id: 1,
    title: 'Segurança Consolidada e Avanços na Mobilidade Marcam o Início de Abril',
    category: 'Notícias',
    author: 'Redação Atibaia TV',
    time: 'há 1 hora',
    featured: true,
    color: 'blue',
    body: 'Atibaia reafirma sua posição entre as cidades mais seguras de São Paulo enquanto a prefeitura convoca a população para reestruturar o transporte público. Na última semana, ações da Polícia Militar desarticularam quadrilhas de roubo de carga, e o monitoramento do trânsito segue atento às rodovias Fernão Dias e Dom Pedro I após registros recentes de incidentes com veículos pesados.',
  },
  {
    id: 2,
    title: 'Prisões e Reconhecimento Estadual: PM Desfaz Quadrilha de Roubo de Caminhões',
    category: 'Segurança Pública',
    author: 'Redação Atibaia TV',
    time: 'há 3 horas',
    featured: false,
    color: 'blue',
    body: 'A segurança continua sendo o principal pilar de Atibaia neste início de 2026. Recentemente, a Polícia Militar efetuou a prisão de uma quadrilha especializada em roubo de caminhões. Quatro criminosos foram detidos em flagrante após renderem um motorista sob ameaça de arma de fogo. A ação resultou na recuperação do veículo e na apreensão de bloqueadores de sinal e ferramentas de corte. Dados do Atlas da Violência apontam Atibaia como a cidade mais segura do estado de São Paulo e a 2ª mais segura do Brasil entre municípios de grande porte.',
  },
  {
    id: 3,
    title: 'Participação Popular e Trânsito nas Rodovias: Mobilidade em Foco',
    category: 'Mobilidade',
    author: 'Redação Atibaia TV',
    time: 'há 5 horas',
    featured: false,
    color: 'orange',
    body: 'Com uma frota que beira um veículo por habitante, a gestão municipal intensificou os esforços para otimizar o fluxo urbano. A Secretaria de Mobilidade Urbana está realizando oficinas presenciais e consultas públicas para a construção de um novo sistema de transporte coletivo. O objetivo é reestruturar linhas e melhorar a eficiência do serviço nos bairros mais populosos, como Caetetuba e Portão. Nas rodovias, incidentes recentes na Fernão Dias incluindo tombamentos de carretas causaram interdições parciais no sentido norte.',
  },
  {
    id: 4,
    title: 'Mercado de Trabalho Aquecido e Clima Estável Marcam a Semana em Atibaia',
    category: 'Economia',
    author: 'Redação Atibaia TV',
    time: 'há 6 horas',
    featured: false,
    color: 'red',
    body: 'No setor econômico, destaca-se um aquecimento no mercado de trabalho local, com diversas vagas de emprego abertas para funções administrativas e operacionais, como auxiliares de e-commerce e estoquistas. Para quem planeja atividades ao ar livre, o clima deve permanecer estável, com sol entre nuvens e sem previsão de chuvas intensas.',
  },
  {
    id: 5,
    title: 'Atibaia é a 2ª Cidade Mais Segura do Brasil entre Municípios de Grande Porte',
    category: 'Segurança Pública',
    author: 'Redação Atibaia TV',
    time: 'Ontem',
    featured: false,
    color: 'blue',
    body: 'Dados consolidados do Atlas da Violência e levantamentos municipais apontam Atibaia como a cidade mais segura do estado de São Paulo e a 2ª mais segura do Brasil entre municípios de grande porte. Bairros como Alvinópolis, Jardim do Lago e Vila Giglio mantêm baixos índices de criminalidade, sustentados pelo monitoramento eletrônico e patrulhamento tático.',
  },
]

// ─── VÍDEOS RECENTES ─────────────────────────────────────────────────────────
export const RECENT_VIDEOS = [
  { id: 'v1', title: 'Jornal da Tarde — Edição Atibaia TV', duration: '22:14', views: '1.2k', thumb: 'blue'   },
  { id: 'v2', title: 'PM prende quadrilha de roubo de caminhões', duration: '08:40', views: '3.4k', thumb: 'blue'  },
  { id: 'v3', title: 'Consulta pública: novo transporte coletivo', duration: '14:05', views: '980',  thumb: 'orange' },
  { id: 'v4', title: 'Atibaia: cidade mais segura de SP', duration: '12:30', views: '2.1k', thumb: 'green' },
]

// ─── CONTATO ─────────────────────────────────────────────────────────────────
export const CONTATO = {
  endereco: 'Rua Padre Ernesto da Cunha Veloso, 151 - Atibaia Jardim, Atibaia/SP - CEP 12.942-240',
  telefone: '(11) 97497-6540',
  emailRedacao: 'atibaiatv2013@gmail.com',
  emailComercial: 'atibaiatv2013@gmail.com',
  instagram: 'https://www.instagram.com/atibaia_tv/',
  facebook: 'https://www.facebook.com/AtibaiaTv/',
  youtube: 'https://www.youtube.com/@REDESA_tv',
}
