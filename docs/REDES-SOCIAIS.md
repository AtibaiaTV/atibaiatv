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
| `META_ACCESS_TOKEN` | Token **de página** de longa duração (marque como **Secret**) |
| `META_PAGE_ID` | `566044903408400` — página Atibaia TV |
| `META_IG_USER_ID` | `17841400603446887` — conta **@atibaia_tv** |
| `SOCIAL_ALLOWED_EMAILS` | E-mails do **painel** autorizados a publicar, separados por vírgula |

Sem o `META_IG_USER_ID` a ferramenta publica só no Facebook e avisa na tela que o
Instagram não está configurado. Nada quebra.

> **Cuidado com o Instagram parecido.** Existem duas contas: a oficial **@atibaia_tv**
> (~5.500 seguidores) e a secundária **@atibaiatv_** (~19 seguidores). Confira sempre
> pelo ID `17841400603446887`, não pelo nome.

A chave do Firebase que valida o login não precisa ser cadastrada: a função
reaproveita a `VITE_FIREBASE_API_KEY` que o projeto já define. Se um dia quiser
usar outra, basta criar `FIREBASE_API_KEY`, que tem prioridade.

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

### O token que não expira

Não use o token de usuário direto. A sequência certa é:

1. Gere o token de **usuário** no Graph API Explorer.
2. Leve-o ao **Access Token Debugger** e clique em **Extend Access Token** — vira um
   token de usuário de longa duração (60 dias).
3. Cole esse token estendido no Explorer e rode `me/accounts` de novo.
4. O `access_token` que vier junto da página agora é um **token de página de longa
   duração**, que na prática não expira (só cai se você trocar a senha do Facebook,
   remover o app ou perder a administração da página).

É esse último que vai no `META_ACCESS_TOKEN`. Pulando o passo 2, o token da página
herda a validade curta e para de funcionar em poucas horas.

## Por que `instagram_business_account` volta vazio (e por que tudo bem)

A consulta `566044903408400?fields=instagram_business_account` não devolve nada, porque
a conta vinculada à página Atibaia TV é a **@redesa_tv**, da rede parceira — e uma
página comporta apenas uma conta do Instagram vinculada.

Isso **não impede** a publicação. O acesso à @atibaia_tv chega pelo **portfólio
empresarial** (Carlos Henrique Pompeu, `1622203431210650`) e aparece nos "escopos
granulares" do token: `instagram_content_publish → 17841400603446887`. Verificado em
30/07/2026 criando contêiner de mídia com token de usuário e com token de página —
funcionou nos dois. Não é preciso desconectar a @redesa_tv.

O Instagram precisa ser **conta profissional** (Comercial ou Criador). Não é necessário
passar por revisão da Meta para postar em contas que você mesmo administra.

## Carrossel

A matéria tem uma foto só (`thumbnailUrl`), então a capa vem dela e as fotos
extras são enviadas no painel, em **+ Foto**. Todas passam pela mesma arte, sem o
título — que já aparece na capa —, para o conjunto ficar uniforme. Cada foto tem
miniatura numerada; clicar nela mostra o slide na prévia e o **×** remove.

O limite é de **10 fotos**, imposto pelo Instagram. Cada rede monta o carrossel
do seu jeito, e a função cuida disso:

- **Facebook** — cada foto é enviada com `published: false` e depois anexada a um
  post de `/feed` em `attached_media`. Isso vale **mesmo para uma foto só**:
  publicar direto em `/photos` cria uma *foto*, que vai para o álbum da página e
  aparece como foto no feed, em vez de sair como post.
- **Instagram** — cada foto vira um container filho (`is_carousel_item`) e todos
  entram num container `media_type=CAROUSEL`, que é o publicado.

## Vídeo (MP4)

Em **Vídeo (MP4, até 5:00)**, no painel, dá para anexar um arquivo no lugar da
arte. O vídeo **substitui a arte e o carrossel**: as redes não aceitam foto e
vídeo na mesma publicação, então os controles de enquadramento e de carrossel
somem enquanto houver vídeo anexado. A legenda continua a mesma.

O painel confere no navegador, **antes de enviar**, três coisas — descobrir o
problema depois de subir 200 MB seria cruel com quem está publicando:

| Regra | Valor | De onde vem |
|---|---|---|
| Formato | MP4 (H.264 + AAC) | é o que a Meta aceita |
| Duração | de 3 segundos a **5:00** | o mínimo é do Reels; os 5 minutos são a regra da casa (o Reels aceitaria até 15) |
| Tamanho | até **1 GB** | é o teto do próprio Instagram para Reels |

O arquivo vai para o Firebase Storage (`social/videos/…`) em envio **resumível**,
com porcentagem no botão, e a Meta busca o vídeo por essa URL.

> **Arquivo grande custa duas vezes.** Um MP4 de 800 MB sobe 800 MB para o
> Storage e depois é baixado outros 800 MB pela Meta — tudo isso conta na cota
> do Firebase. Cinco minutos em 1080p a 5 Mbps cabem em ~190 MB e ficam
> iguaizinhos no feed, porque o Instagram recomprime tudo de qualquer jeito.
> Vale exportar com bitrate menor antes de subir.
 Mandar o arquivo
direto para a Graph API pelo navegador não daria: o token só existe no servidor.

- **Facebook** — `POST /{page-id}/videos` com `file_url`, no host
  `graph-video.facebook.com`. Aqui o endpoint já cria a publicação no feed,
  sem o rodeio que a foto exige. **Aceita agendamento**, igual à foto.
- **Instagram** — container `media_type=REELS` com `video_url`, e depois
  `media_publish`. Desde a v21 o `VIDEO` foi descontinuado: todo vídeo enviado
  pela API vira **Reels** — e aparece no feed, com `share_to_feed`.

### Cada rede no seu formato

O Facebook recebe o arquivo **como veio** — 16:9 é o formato natural do feed de
lá. O Instagram recebe uma versão **9:16 (1080×1920)**, ampliada e centralizada
até preencher a tela: um 16:9 mandado cru para o Reels entra com tarja preta em
cima e embaixo.

O recorte mora em `src/utils/recorteVideo.js` e roda **no navegador**: o vídeo
toca num `<video>`, cada quadro é desenhado recortado num `<canvas>` e o
`MediaRecorder` grava a saída em MP4/H.264, com o áudio puxado pelo WebAudio (sem
passar pelas caixas de som, senão a redação inteira ouviria o vídeo). Daí:

- **Leva o tempo do vídeo.** É gravação em tempo real: 5 minutos de vídeo, 5
  minutos de processamento, com a porcentagem no botão.
- **Trocar de aba pausa** a gravação e o vídeo juntos, e tudo continua quando a
  aba volta. Sem esse cuidado o recorte sairia com a imagem congelada — o
  navegador para de desenhar em abas de segundo plano.
- **Precisa de Chrome atualizado.** Se o navegador não gravar MP4, o painel
  avisa, pula o recorte e manda o original também para o Instagram, em vez de
  gerar um WebM que a Meta recusaria depois.
- **Sai menor que o original** (1080×1920 a 6 Mbps), o que ajuda no envio.

### Por que quem espera é o navegador

A primeira versão fazia tudo numa requisição só e ficava perguntando à Meta se o
Reels já havia processado. Ela morria por volta de 1min30 e a tela mostrava
`Unexpected token '<'`: o Worker do Cloudflare corta em **50 sub-requisições**, e
cada pergunta dessas era uma. Estourado o teto, quem responde é o Cloudflare —
com uma página de erro em HTML, que não é JSON nenhum.

Aumentar a espera não resolvia: o limite é de chamadas, não de tempo. Então a
função virou passos curtos, chamados pelo navegador:

| Passo | O que faz | Chamadas à Meta |
|---|---|---|
| (sem `step`) | publica no Facebook e cria o container do Reels | 2 |
| `ig-status` | pergunta se o container ficou pronto | 1 |
| `ig-finish` | publica o Reels e busca o permalink | 2 |

O painel pergunta de 5 em 5 segundos, por até 15 minutos, com o relógio no botão.
Nenhuma requisição chega perto do limite do Cloudflare.

O histórico marca o post com a etiqueta **🎬 Vídeo** e guarda as duas URLs.
Excluir da rede funciona igual: o Facebook apaga pelo id do vídeo, o Instagram
continua sem endpoint de exclusão.

## Histórico e exclusão

Cada publicação vira um documento na coleção **`socialPosts`** do Firestore, com
a legenda, as artes e — o que importa para excluir — os **ids que a Meta
devolveu**. Sem esses ids não haveria como apagar nada depois.

A seção **Publicados**, no fim da tela, oferece duas ações separadas:

- **Excluir da rede** — apaga a publicação de fato, via `/api/social-delete`.
- **Remover do histórico** — tira o post da lista; o que está no ar continua no ar.

### Regra do Firestore — nada a fazer

A coleção é nova, mas **não precisa de regra nova**. As regras do projeto já
abrem com um curinga que vale para qualquer coleção:

```
match /{document=**} {
  allow read, write: if request.auth != null;
}
```

Como o painel exige login do Firebase Auth, quem está logado nele já lê e
escreve em `socialPosts`. As regras específicas que vêm depois (`articles`,
`banners`, `enquetes`…) existem para liberar o **público não logado** a ler o
conteúdo do site — e o histórico fica de fora delas de propósito: ele mostra o
que foi publicado, por quem e os ids internos das publicações na Meta.

Se um dia esse curinga for removido — trocado por regras coleção a coleção —,
aí sim o histórico para de gravar, em silêncio: o post sai nas redes e não entra
na lista, e o "Excluir da rede" fica sem os ids. Nesse caso, o bloco a
acrescentar é:

```
match /socialPosts/{postId} {
  allow read, write: if request.auth != null;
}
```

> **Atenção ao banco.** O projeto `site-atibaiatv` tem dois bancos de dados:
> `(default)` (edição Padrão) e `default` (Enterprise). O site chama
> `getFirestore(app)` sem nomear banco, o que usa sempre o **`(default)`** —
> é nele que as regras valem. Publicar no Enterprise não tem efeito no painel.

## Limites da plataforma (não são limitações da ferramenta)

- **Excluir publicação**: o Facebook tem endpoint de exclusão; o **Instagram não
  tem nenhum** na Graph API. Um post do Instagram só sai pelo app, à mão. A
  confirmação na tela diz quais redes a ação alcança antes de você confirmar.
- **Agendamento**: existe só no Facebook, entre 10 minutos e 75 dias de antecedência.
  A API do Instagram não agenda — publica na hora. Para agendar no Instagram só
  pelo Meta Business Suite, à mão.
- **Vídeo no Instagram**: sai sempre como **Reels** — a API não publica vídeo de
  outro jeito. E o Reels não agenda: agendamento de vídeo só no Facebook.
- **Legenda**: até 2.200 caracteres no Instagram; a ferramenta corta o texto da
  matéria antes desse limite e sempre preserva o rodapé com o link e as hashtags.
- **Token**: expira em ~60 dias e precisa ser renovado. Quando expirar, a ferramenta
  mostra o erro devolvido pela Meta.

Se as variáveis não estiverem configuradas, a arte e a legenda continuam funcionando
(botões **Baixar arte** e **Copiar legenda**) — só a publicação automática fica
indisponível.
