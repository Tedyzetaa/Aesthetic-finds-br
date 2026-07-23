# Aesthetic Finds Br

Vitrine digital de alta performance para exibir achados de decoração/estética
e redirecionar o clique para a loja de origem. Construído a partir do
briefing "Catálogo Elite" (Portfólio Teddy): frontend premium (padrão Apple),
funil de conversão sem atrito (padrão Amazon) e um painel admin enxuto e
seguro (padrão Google).

## Stack

- **Frontend:** Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Backend:** API Routes do próprio Next.js (Node.js), autenticação por
  cookie assinado (JWT + bcrypt)
- **Dados:** Postgres via [Supabase](https://supabase.com) (tabela
  `products`, ver `supabase/migration.sql`). Acesso pelo servidor com a
  service role key — funciona em qualquer hospedagem, incluindo serverless.
- **Imagens:** upload direto pelo painel admin para o Supabase Storage
  (bucket público `produtos-imagens`), com opção de colar uma URL externa.

## Rodando localmente

1. Crie um projeto em [supabase.com](https://supabase.com) (gratuito).
2. No **SQL Editor** do projeto, rode o conteúdo de `supabase/migration.sql`
   — isso cria a tabela `products`, o bucket de imagens e já popula 6 itens
   de exemplo.
3. Em **Project Settings → API**, copie a **Project URL** e a
   **service_role key**.

```bash
npm install
cp .env.example .env.local   # cole SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
                              # e ajuste as credenciais do admin
npm run dev
```

Acesse:
- Vitrine pública: http://localhost:3000
- Painel admin: http://localhost:3000/admin/login

**Login de desenvolvimento** (definido em `.env.example`):
- E-mail: `admin@aestheticfinds.com.br`
- Senha: `mudar123`

⚠️ Troque `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `ADMIN_JWT_SECRET` antes de
publicar. Para gerar um novo hash de senha:

```bash
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA_AQUI', 10))"
```

## Estrutura

```
app/
  page.tsx                 → Home pública (hero, busca, grid com skeleton)
  produto/[id]/page.tsx    → Página do produto (CTA de saída para a loja)
  admin/
    login/page.tsx         → Login do painel
    (protected)/
      layout.tsx           → Guarda de sessão (redireciona se não logado)
      page.tsx             → Dashboard (métricas em tempo real)
      produtos/page.tsx    → Inventário (CRUD, toggle ativo/destaque)
      produtos/novo/       → Cadastro de item
      produtos/[id]/       → Edição de item
  api/
    products/               → GET (público, só ativos) / POST (admin)
    products/[id]/           → GET / PUT / DELETE (admin)
    auth/login, auth/logout  → Sessão do painel
lib/
  db.ts        → Camada de dados (Supabase/Postgres)
  supabase.ts  → Cliente Supabase server-side (service role)
  auth.ts      → Verificação de credenciais e sessão
  types.ts     → Tipos do produto
supabase/migration.sql → Schema da tabela products + bucket de imagens
```

## Identidade visual

Paleta e tipografia seguem a diretriz do briefing, com token system definido
para consistência:

| Uso | Cor |
|---|---|
| Fundo base | `#FCFBF8` |
| Texto principal | `#20241F` |
| Dourado (destaques, CTAs secundários) | `#8B6A1E` |
| Verde principal (CTA de compra) | `#2F6E60` |
| Azul de suporte (links, badges) | `#73C6E6` |
| Verde de crescimento (métricas positivas) | `#6BAA57` |
| Alerta (ações destrutivas) | `#D9534F` |

Tipografia: **Fraunces** (display, itálico editorial) + **Manrope** (corpo) +
**IBM Plex Mono** (rótulos/dados no admin) — via `next/font/google`.

Assinatura visual: selo dourado "Achado" que aparece no hover dos cards em
destaque, reforçando o conceito de curadoria (referência ao portfólio antigo
no Pinterest).

## Funcionalidades por área

**Pública:** busca preditiva com filtro por categoria, grid responsivo com
skeleton loading, página de produto com CTA grande de saída, seção de itens
relacionados.

**Admin:** dashboard com métricas (total, ativos, destaques), inventário com
toggles inline (ativo/destaque) sem precisar abrir cada item, formulário de
cadastro/edição, exclusão com dupla checagem (digitar "EXCLUIR" para
confirmar), sessão protegida por middleware + verificação server-side.

## Testes de responsividade

Layout testado nos dois extremos citados no briefing: telas amplas (ex.
notebook 15") e telas de celular Android de entrada. Grid do catálogo:
2 colunas no mobile → 3 no tablet → 4 no desktop; navegação colapsa para
menu simplificado abaixo de `md`.

## Deploy

Como os dados agora vivem no Supabase (não mais em arquivo local), a
aplicação é stateless e roda em qualquer hospedagem, inclusive serverless
(Vercel, Render, EC2 etc.) — basta configurar as variáveis de ambiente
(`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_JWT_SECRET`,
`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`) no provedor escolhido.

**Vercel:** importe o repositório, adicione as variáveis de ambiente no
painel do projeto e faça o deploy — sem passos extras.

**Render (Web Service) ou AWS EC2:** build command `npm install && npm run
build`, start command `npm start`, configurar as mesmas variáveis de
ambiente. Não é mais necessário disco persistente.

## Evoluindo o projeto

- Múltiplos usuários admin com papéis, se a equipe de vendas crescer
  (hoje é um único admin via variáveis de ambiente).
- Migrar o login do admin para o Supabase Auth, se quiser gerenciar
  usuários pelo painel do Supabase em vez de env vars.
- Cache/CDN para as imagens do Storage se o catálogo crescer bastante.
