# WordPress Template News — Next.js

Frontend headless do WordPress Template News, construído com Next.js, React e TypeScript.

O WordPress é o CMS e concentra conteúdo, composição Gutenberg e regras editoriais. O Next.js é responsável pela aplicação pública, renderização React, imagens, routing, SEO público, cache e interatividade do navegador.

## Stack

- Next.js 16
- React 19
- TypeScript
- App Router
- React Compiler
- Server Components por padrão
- SCSS
- CSS Modules
- ESLint
- npm
- `fetch` nativo para GraphQL

Integração com:

- WordPress 6.9+
- WPGraphQL
- WPGraphQL Content Blocks
- companion plugin WordPress Template News Blocks

## Requisitos

Para executar o projeto localmente:

- Node.js compatível com a versão do Next.js utilizada pelo projeto;
- npm;
- uma instalação WordPress acessível pelo processo Next.js;
- WPGraphQL ativo;
- WPGraphQL Content Blocks ativo;
- companion plugin do WordPress Template News ativo.

O WordPress pode rodar diretamente no host, em Docker ou em outro ambiente de desenvolvimento, desde que o endpoint GraphQL configurado seja acessível pelo servidor Next.js.

## Instalação

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente local a partir do exemplo:

```bash
cp .env.example .env.local
```

Configure a URL do endpoint GraphQL de acordo com o seu ambiente.

## Variáveis de ambiente

O projeto utiliza:

```dotenv
WORDPRESS_GRAPHQL_URL=http://localhost:8080/graphql
```

O valor acima é apenas um exemplo. Use o host e a porta correspondentes à sua instalação WordPress.

Quando a mídia do WordPress é servida por uma origem diferente da API GraphQL, configure também:

```dotenv
WORDPRESS_MEDIA_URL=https://media.example.com
```

`WORDPRESS_MEDIA_URL` é opcional. Quando não é definida, a origem permitida para otimização de imagens é derivada de `WORDPRESS_GRAPHQL_URL`. Quando definida, deve representar uma URL absoluta `http` ou `https` da origem de mídia usada pelo site.

O arquivo `.env.example` documenta as variáveis necessárias e opcionais para executar o projeto.

O arquivo `.env.local` contém a configuração efetiva da máquina local e não deve ser versionado.

`WORDPRESS_GRAPHQL_URL` e `WORDPRESS_MEDIA_URL` são usadas somente no servidor/configuração do Next e, por isso, não utilizam o prefixo `NEXT_PUBLIC_`.

## Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrão, o Next.js disponibiliza a aplicação em:

```text
http://localhost:3000
```

A porta pode ser alterada conforme a configuração do ambiente.

### Component Gallery

Durante o desenvolvimento, a rota:

```text
/dev/gutenberg
```

fornece uma galeria de QA dos renderers Gutenberg.

A gallery:

- utiliza os renderers reais de Core e WTN;
- cobre variantes estruturais e estados sem mídia;
- mostra os seis WTN com `resolved: null`;
- inclui uma composição integrada passando por `flatListToTree()` e `GutenbergRenderer`;
- inclui um caso de compatibilidade de bloco desconhecido via `renderedHtml`;
- usa fixtures locais e não depende do WordPress para abrir;
- existe somente em `development` e possui metadata `noindex`.

Os estilos dessa rota são exclusivos da ferramenta de QA e não representam o CSS público final dos componentes.

## Scripts

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento do Next.js.

### Lint

```bash
npm run lint
```

Executa o ESLint.

### Type check

```bash
npm run typecheck
```

Executa:

```text
tsc --noEmit
```

### Build

```bash
npm run build
```

Gera o build de produção.

### Produção local

```bash
npm run start
```

Inicia a aplicação a partir de um build de produção já gerado.

## Estrutura

```text
app/
├── dev/
│   └── gutenberg/
│       ├── PreviewCase.tsx
│       ├── fixtures.ts
│       ├── page.module.scss
│       └── page.tsx
├── favicon.ico
├── globals.scss
├── layout.tsx
├── page.module.scss
└── page.tsx

components/
├── ads/
│   └── AdSenseUnit.tsx
├── gutenberg/
│   ├── wtn/
│   │   ├── AdSlot.tsx
│   │   ├── BreakingNews.tsx
│   │   ├── EditorialHero.tsx
│   │   ├── FeaturedAuthors.tsx
│   │   ├── LatestNews.tsx
│   │   ├── NewsSection.tsx
│   │   └── shared.tsx
│   ├── GutenbergRenderer.tsx
│   ├── RenderedHtmlBlock.tsx
│   ├── RichText.tsx
│   ├── core-renderers.tsx
│   ├── editorial-heading-plan.ts
│   ├── editorial-heading.tsx
│   └── registry.tsx
└── media/
    └── CmsImage.tsx

lib/
├── graphql.ts
├── gutenberg-tree.ts
├── gutenberg.ts
└── home-foundation.ts
```

## Arquitetura Gutenberg

O pipeline de renderização Gutenberg é:

```text
WPGraphQL
    ↓
editorBlocks(flat: true)
    ↓
normalização para GutenbergBlock[]
    ↓
flatListToTree()
    ↓
GutenbergTreeBlock[]
    ↓
GutenbergRenderer
    ↓
registry
    ↓
React
```

A aplicação usa Server Components por padrão. A única ilha Client atualmente necessária dentro do renderer Gutenberg é `AdSenseUnit`, que executa a integração browser-side de uma unidade AdSense.

### `lib/graphql.ts`

Implementa o transporte GraphQL com `fetch` nativo.

Responsabilidades:

- obter o endpoint GraphQL pela variável de ambiente;
- enviar requisições `POST`;
- enviar query e variables;
- validar erros HTTP;
- validar a resposta JSON;
- validar erros GraphQL;
- retornar os dados tipados da operação.

### `lib/gutenberg.ts`

Contém a operação GraphQL para consultar uma Page Gutenberg por `databaseId` usando WPGraphQL Content Blocks e o contrato Headless exposto pelo companion plugin.

A função pública é:

```ts
getGutenbergPage(databaseId);
```

A consulta utiliza:

```graphql
editorBlocks(flat: true)
```

A resposta flattened preserva:

```graphql
__typename
name
clientId
parentClientId
```

Os tipos conhecidos são normalizados para uma discriminated union baseada em `kind`. Os aliases usados no wire GraphQL dos seis WTN são convertidos para uma única propriedade pública:

```text
GraphQL wire
editorialHeroResolved / newsSectionResolved / ...
        ↓
lib/gutenberg.ts
        ↓
block.resolved
```

O restante da aplicação não depende dos nomes dos aliases GraphQL.

#### Core fields Headless

Os Core blocks suportados usam fields diretos registrados pelo companion plugin em vez de depender genericamente de `attributes` ou de `renderedHtml`.

Entre os dados expostos estão conteúdo de RichText, níveis de heading, largura de coluna, propriedades da imagem, dados de quote/list/list-item, tag do Group e contrato do Button.

Essa abordagem evita acionar renderização PHP dos blocos conhecidos apenas para extrair seus dados estruturados.

#### WTN `resolved`

Os seis blocos WTN recebem apenas valores efetivos já resolvidos pelo WordPress.

O Next não recebe nem recria regras editoriais internas como:

- `postOverrides`;
- `resolvedPostIds`;
- `selectionMode`;
- `slotPostIds`;
- elegibilidade;
- deduplicação;
- busca de conteúdo substituto.

Quando um WTN chega com:

```text
resolved = null
```

não é renderizado.

#### Compatibilidade seletiva com `renderedHtml`

`renderedHtml` é compatibilidade para blocos desconhecidos, não a arquitetura principal.

A consulta normal não pede esse field. Quando a primeira resposta encontra um bloco desconhecido que não pertence ao namespace WTN, `getGutenbergPage()` executa uma segunda operação completa contendo `renderedHtml` somente em inline fragments dos concrete GraphQL types desconhecidos detectados.

A segunda resposta inteira se torna a resposta canônica. Não existe merge entre requests por `clientId`, índice ou outra identidade de ocorrência.

A política é:

```text
Core conhecido
→ React nativo

WTN conhecido
→ React nativo + resolved

WTN desconhecido
→ erro de regressão, nunca fallback HTML

bloco desconhecido não-WTN
→ renderedHtml seletivo
```

Antes da consulta de compatibilidade, a estrutura da resposta de discovery é validada. Parent references ausentes, ciclos e boundaries desconhecidas contendo descendants WTN são rejeitados antes de solicitar `renderedHtml`.

### `lib/gutenberg-tree.ts`

Reconstrói a árvore a partir da lista flattened retornada pelo WPGraphQL Content Blocks.

`flatListToTree()`:

- preserva a ordem depth-first da resposta;
- valida `clientId`;
- rejeita IDs duplicados;
- valida `parentClientId`;
- rejeita parent references inválidas e reattachment de branches já fechadas;
- não modifica os blocos de entrada.

`clientId` e `parentClientId` pertencem somente à resposta atual. Não são IDs persistentes do domínio e não são usados para correlacionar requests diferentes.

## Gutenberg Renderer

### `components/gutenberg/registry.tsx`

É o registry estático dos blocos nativamente suportados pelo frontend.

A cobertura é protegida por TypeScript e inclui exatamente os 18 tipos conhecidos do produto: 12 Core e 6 WTN.

O registry também informa quais blocos aceitam children. Um leaf conhecido que receber children inesperados causa erro explícito em vez de descartar conteúdo silenciosamente.

### `components/gutenberg/GutenbergRenderer.tsx`

Renderiza recursivamente `GutenbergTreeBlock[]` usando o registry.

Responsabilidades:

- preservar nesting e ordem Gutenberg;
- usar `clientId` somente como React key local daquela árvore;
- renderizar Core conhecidos por React;
- renderizar WTN conhecidos somente quando `resolved` é válido;
- tratar unknown não-WTN como compatibility boundary opaca;
- impedir fallback HTML para WTN desconhecidos;
- impedir uma unknown boundary de renderizar descendants WTN via PHP.

Uma unknown compatibility boundary não percorre seus children novamente em React, porque seu `renderedHtml` já pode conter a subtree renderizada pelo WordPress.

### `components/gutenberg/RenderedHtmlBlock.tsx`

Centraliza o único fallback genérico de HTML de blocos desconhecidos.

O HTML vem do CMS WordPress confiável e é inserido com `dangerouslySetInnerHTML` dentro de uma boundary explícita. A auditoria final de segurança desse caminho pertence à etapa de segurança do projeto.

`renderedHtml` não é utilizado para WTN nem para os Core conhecidos.

### `components/gutenberg/RichText.tsx`

Centraliza a inserção de RichText confiável vindo do CMS para os Core blocks que precisam preservar markup inline, como Paragraph, Heading, List Item e outros campos estruturados.

### `components/gutenberg/core-renderers.tsx`

Contém os renderers React nativos dos 12 Core inicialmente suportados:

- `core/group`;
- `core/columns`;
- `core/column`;
- `core/paragraph`;
- `core/heading`;
- `core/image`;
- `core/quote`;
- `core/list`;
- `core/list-item`;
- `core/buttons`;
- `core/button`;
- `core/separator`.

Os containers preservam children React. O renderer de `core/list-item` também suporta nested lists válidas.

Não há tentativa de reproduzir preventivamente todos os Block Supports do Gutenberg.

## Renderers WTN

Os renderers em `components/gutenberg/wtn/` cobrem:

- Editorial Hero;
- Breaking News;
- News Section;
- Latest News;
- Featured Authors;
- Ad Slot.

Eles usam somente `block.resolved` e não fazem queries adicionais nem decisões editoriais.

Valores `null` em arrays resolvidos são apenas omitidos da apresentação; o Next nunca procura conteúdo substituto.

### Headings editoriais

`editorial-heading.tsx` suporta os níveis HTML `h1` a `h6`.

`editorial-heading-plan.ts` calcula a política global antes da renderização:

- sem H1 externo, o primeiro WTN editorial efetivamente renderizável pode receber `h1`;
- os próximos headings principais WTN usam `h2`;
- quando o template já renderizou um H1, os WTN começam em `h2`;
- um `core/heading` de nível 1 anterior também é considerado pelo plano;
- blocos que não produzem heading, como Ad Slot ou listas editoriais sem conteúdo renderizável, não consomem o H1.

O renderer não reescreve níveis escolhidos explicitamente por um `core/heading`.

## Imagens do CMS

### `components/media/CmsImage.tsx`

Centraliza a política técnica de imagens vindas do CMS.

Quando a origem está permitida e existem dimensões intrínsecas inteiras válidas, utiliza `next/image`.

Quando essas condições não são satisfeitas, preserva a imagem com um `<img>` nativo como fallback explícito, sem inventar dimensões ou buscar mídia substituta.

A origem remota permitida para o otimizador é configurada por `WORDPRESS_MEDIA_URL` ou, na ausência dela, derivada de `WORDPRESS_GRAPHQL_URL`.

A intenção editorial `prioritizeImage` pode ser traduzida pela camada Next para carregamento eager/fetch priority sem transferir para o CMS a decisão técnica de otimização.

## AdSense

`components/ads/AdSenseUnit.tsx` é uma Client Component pequena e isolada.

Ela é responsável apenas por inicializar uma unidade AdSense no navegador. O script global da plataforma não é carregado por esse componente e pertence à integração global do site.

## Integração atual da rota `/`

A rota pública `/` ainda utiliza `getHomeFoundationPosts()` de `lib/home-foundation.ts`.

O `GutenbergRenderer` já está implementado e validado de forma isolada e integrada na Component Gallery, mas ainda não foi conectado à Home pública. A decisão WordPress entre Gutenberg Home e Default Home e a apresentação final da Home pertencem às etapas posteriores do roadmap.

As chamadas de conteúdo inicial continuam sendo executadas no servidor Next.js. O navegador não chama diretamente o WordPress para montar a página inicial.

## Segurança

- `.env.local` não deve ser versionado.
- Variáveis server-side não devem usar `NEXT_PUBLIC_` sem necessidade.
- Credenciais, secrets, drafts e conteúdo privado não devem ser expostos ao navegador.
- Regras editoriais internas dos WTN não fazem parte do contrato público do Next.
- WTN desconhecido nunca utiliza fallback HTML.
- `renderedHtml` é usado somente como compatibilidade seletiva para blocos desconhecidos não-WTN.
- Raw HTML de compatibilidade fica centralizado em `RenderedHtmlBlock`.
- A auditoria final de `renderedHtml` e demais pontos de segurança pertence à etapa específica de segurança do projeto.
