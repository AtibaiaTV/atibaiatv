# Atibaia TV — Site Oficial

Site oficial da AtibaiaTV, desenvolvido com React + Vite.

## Tecnologias
- React 18
- React Router DOM 6
- Vite 5

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (http://localhost:5173)
npm run dev

# Gerar build de produção
npm run build

# Visualizar build de produção
npm run preview
```

## Estrutura do projeto

```
src/
├── components/
│   ├── TopBar.jsx       # Barra superior com data, ao vivo e redes sociais
│   ├── Header.jsx       # Cabeçalho com logo e navegação
│   ├── Logo.jsx         # Componente do logo Atibaia TV
│   ├── Ticker.jsx       # Faixa de últimas notícias
│   ├── LivePlayer.jsx   # Player de transmissão ao vivo
│   ├── Sidebar.jsx      # Sidebar com programação, redes sociais e Redesa
│   ├── NewsFeed.jsx     # Feed de notícias com filtros por categoria
│   ├── NewsCard.jsx     # Card individual de notícia
│   └── Footer.jsx       # Rodapé
│
├── pages/
│   ├── Home.jsx         # Página inicial
│   ├── CategoryPage.jsx # Página de categoria (Notícias, Cultura, etc)
│   └── AoVivo.jsx       # Página de transmissão ao vivo
│
├── data/
│   └── index.js         # Dados mock (notícias, programação, etc)
│
├── App.jsx              # Rotas principais
└── main.jsx             # Entry point
```

## Configurar transmissão ao vivo

Em `src/components/LivePlayer.jsx`, altere:

```js
const YOUTUBE_LIVE_ID = null // substitua pelo ID do seu stream no YouTube
// Ex: const YOUTUBE_LIVE_ID = 'jfKfPfyJRdk'
```

## Conectar a um CMS

Os dados mock ficam em `src/data/index.js`.
Para conectar a um CMS (WordPress headless, Strapi, etc), substitua os arrays
de `NEWS` por chamadas fetch/axios nos componentes que os consomem.

## Deploy

O projeto é compatível com **Vercel**, **Netlify** e qualquer serviço de
hospedagem estática. Após `npm run build`, faça upload da pasta `dist/`.

## Cores da identidade visual

| Cor        | HEX       | Uso                      |
|------------|-----------|--------------------------|
| Azul       | `#1a6fa8` | Cor primária, links, nav |
| Verde      | `#4caf2a` | Destaque, CTA, "TV"      |
| Vermelho   | `#c0392b` | Badge "Ao Vivo"          |
| Cinza      | `#6b7280` | Textos secundários       |
| Borda      | `#e5e7eb` | Bordas e divisores       |

---

Desenvolvido para **Atibaia TV** — www.atibaiatv.com.br  
Afiliada **Rede Redesa** · Rede entre Serras e Águas

