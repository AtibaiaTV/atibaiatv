# Ferramenta de posts para Facebook e Instagram

Painel: **/dashboard/social** (menu "Redes Sociais").

A ferramenta lista as matérias, monta a arte 1080×1350 no padrão da editoria
(faixa e chip coloridos, logo, título sobre gradiente, rodapé com os perfis),
gera a legenda com o texto da matéria e publica pela Graph API da Meta.

> **Hospedagem:** o site roda no **Cloudflare Pages** (`atibaiatv.pages.dev` →
> `atibaiatv.com.br`). As funções abaixo usam o formato do Cloudflare Pages
> Functions — a pasta `functions/` na raiz vira rota automaticamente.

## Por que existem funções no servidor

- **`functions/api/img.js`** (`/api/img`) — repassa as fotos do Firebase Storage com
  cabeçalho de CORS. O bucket não envia `Access-Control-Allow-Origin`, e sem ele o
  navegador bloqueia desenhar a foto no canvas: a arte sairia sem imagem e o JPEG não
  poderia ser exportado. Aceita apenas URLs do bucket do projeto, para não virar
  proxy aberto.
- **`functions/api/social-publish.js`** (`/api/social-publish`) — fala com a Graph API.
  O token da Meta fica só aqui, nas variáveis de ambiente. Se ficasse no navegador ou
  no Firestore, qualquer visitante poderia extrair e postar nas contas oficiais.
  A função confere o login do painel e o e-mail autorizado antes de publicar.

## Variáveis de ambiente

Em **Cloudflare Dashboard → Workers & Pages → atibaiatv → Settings → Environment
variables** (marque como *Secret* as duas primeiras), no ambiente **Production**:

| Variável | Para que serve |
|---|---|
| `META_ACCESS_TOKEN` | Token de página de longa duração |
| `META_PAGE_ID` | ID da página do Facebook (/AtibaiaTv) |
| `META_IG_USER_ID` | ID da conta profissional do Instagram (@atibaiatv_) |
| `FIREBASE_API_KEY` | Chave web do Firebase — valida o login de quem clicou em publicar |
| `SOCIAL_ALLOWED_EMAILS` | E-mails autorizados a publicar, separados por vírgula |

Depois de salvar as variáveis é preciso **refazer o deploy** para elas valerem.

Para testar na sua máquina, crie um arquivo `.dev.vars` na raiz com as mesmas
variáveis (já está no `.gitignore`) e rode:

```
npm run build
npx wrangler pages dev dist
```

### Como obter o token e os IDs

1. Em <https://developers.facebook.com>, crie um app do tipo **Business**.
2. Adicione os produtos **Facebook Login** e **Instagram Graph API**.
3. No **Graph API Explorer**, gere um token de usuário com as permissões:
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`,
   `instagram_basic`, `instagram_content_publish`.
4. Troque pelo token de página e depois por um de longa duração (60 dias, renovável)
   no **Access Token Debugger** → *Extend Access Token*.
5. `META_PAGE_ID`: em `/me/accounts` aparece o `id` da página.
6. `META_IG_USER_ID`: em `/<PAGE_ID>?fields=instagram_business_account`.

O Instagram precisa ser **conta profissional** (Comercial ou Criador) e estar
**vinculado à página do Facebook** — sem isso a API não publica. Não é necessário
passar por revisão da Meta para postar em contas que você mesmo administra.

## Limites da plataforma (não são limitações da ferramenta)

- **Agendamento**: existe só no Facebook, entre 10 minutos e 75 dias de antecedência.
  A API do Instagram não agenda — publica na hora. Para agendar no Instagram só
  pelo Meta Business Suite, à mão.
- **Legenda**: até 2.200 caracteres no Instagram; a ferramenta corta o texto da
  matéria antes desse limite e sempre preserva o rodapé com o link e as hashtags.
- **Token**: expira em ~60 dias e precisa ser renovado. Quando expirar, a ferramenta
  mostra o erro devolvido pela Meta.

Se as variáveis não estiverem configuradas, a arte e a legenda continuam funcionando
(botões **Baixar arte** e **Copiar legenda**) — só a publicação automática fica
indisponível.
