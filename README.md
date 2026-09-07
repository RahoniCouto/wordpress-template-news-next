# WordPress Template News — Next.js

Frontend headless do WordPress Template News, construído com Next.js, React e TypeScript.

O WordPress fornece conteúdo e dados editoriais por meio do WPGraphQL. O Next.js é responsável pela aplicação pública.

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

- WordPress
- WPGraphQL
- WPGraphQL Content Blocks

## Requisitos

Para executar o projeto localmente:

- Node.js compatível com a versão do Next.js utilizada pelo projeto
- npm
- uma instalação WordPress acessível pelo processo Next.js
- WPGraphQL ativo
- WPGraphQL Content Blocks ativo

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

O arquivo `.env.example` documenta as variáveis necessárias para executar o projeto.

O arquivo `.env.local` contém a configuração efetiva da máquina local e não deve ser versionado.

`WORDPRESS_GRAPHQL_URL` é usada apenas no servidor e, por isso, não utiliza o prefixo `NEXT_PUBLIC_`.

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
├── favicon.ico
├── globals.scss
├── layout.tsx
├── page.module.scss
└── page.tsx

lib/
├── graphql.ts
├── gutenberg.ts
└── home-foundation.ts
```

### `app/`

Contém as rotas, layouts e estilos da aplicação usando o App Router.

### `app/layout.tsx`

Define o layout raiz e o documento HTML compartilhado pelas rotas.

### `app/page.tsx`

Implementa a rota `/`.

A página é um Server Component assíncrono e consome dados do WordPress no servidor.

### `app/globals.scss`

Contém os estilos globais da aplicação.

### `app/page.module.scss`

Contém os estilos da página usando CSS Modules.

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

Contém a operação GraphQL para consultar uma Page Gutenberg por `databaseId` usando WPGraphQL Content Blocks e o contrato editorial WTN exposto pelo companion plugin.

A função pública atual é:

```ts
getGutenbergPage(databaseId);
```

A consulta utiliza `editorBlocks(flat: true)` e mantém a representação flattened dos blocos com:

```graphql
__typename
name
clientId
parentClientId
```

Para `core/column`, a operação consulta o field Headless barato registrado pelo companion:

```graphql
width
```

Ela não utiliza `attributes.width`, evitando o caminho automático de attributes do WPGraphQL Content Blocks que pode renderizar containers e seus descendentes.

Os seis blocos WTN consultam o field `resolved`, que já contém os valores efetivos definidos pelo WordPress após seleção editorial, elegibilidade, deduplicação e aplicação de overrides.

Como os seis tipos `resolved` possuem contratos diferentes, a operação usa aliases apenas no wire GraphQL. A camada de dados normaliza esses aliases para uma única propriedade pública:

```text
GraphQL wire
newsSectionResolved / latestNewsResolved / ...
        ↓
lib/gutenberg.ts
        ↓
block.resolved
```

O restante da aplicação não depende dos nomes dos aliases usados na query.

Os tipos TypeScript modelam os dados resolvidos de imagem, categoria, matéria, autor e de cada WTN conforme o schema GraphQL atual. A camada não recebe nem recria regras editoriais internas como `postOverrides`, `resolvedPostIds`, `selectionMode` ou `slotPostIds`.

`clientId` e `parentClientId` pertencem somente à resposta atual do WPGraphQL Content Blocks e servem para representar a hierarquia dos blocos. Eles não são IDs persistentes do domínio.

A camada de dados ainda não reconstrói a árvore Gutenberg e não renderiza blocos React. Essas responsabilidades pertencem ao renderer da aplicação.

### `lib/home-foundation.ts`

Contém a operação GraphQL usada pela página inicial atual.

A consulta retorna cinco posts publicados com:

```graphql
databaseId
title
uri
```

## Integração com WordPress

As chamadas ao WPGraphQL são feitas no servidor Next.js por meio de `graphqlRequest()`.

O fluxo atual da página inicial é:

```text
Browser
    ↓
Next.js
    ↓
Server Component
    ↓
getHomeFoundationPosts()
    ↓
graphqlRequest()
    ↓
fetch()
    ↓
WPGraphQL
    ↓
WordPress
```

A camada Gutenberg segue o mesmo transporte:

```text
Next.js
    ↓
getGutenbergPage(databaseId)
    ↓
graphqlRequest()
    ↓
WPGraphQL Content Blocks
    +
contrato WTN do companion
    ↓
editorBlocks(flat: true)
    ↓
CoreColumn.width + WTN resolved
    ↓
normalização para block.resolved
```

A seleção editorial permanece integralmente no WordPress. O Next.js recebe apenas os valores efetivos necessários para apresentação e não procura substitutos, não reaplica overrides e não refaz deduplicação.

O navegador não chama diretamente o WordPress para carregar o conteúdo inicial da aplicação.

## Segurança

- `.env.local` não deve ser versionado.
- Variáveis server-side não devem usar `NEXT_PUBLIC_` sem necessidade.
- O frontend consome conteúdo público por meio de chamadas GraphQL não autenticadas.
- Credenciais, secrets, drafts e conteúdo privado não devem ser expostos ao navegador.
- Regras e configuração editorial interna dos WTN, como `postOverrides`, `resolvedPostIds`, `selectionMode` e `slotPostIds`, não fazem parte do contrato público consumido pelo Next.js.
