-- Aesthetic Finds Br — migração inicial para Supabase
-- Rode este script no SQL Editor do seu projeto Supabase
-- (https://app.supabase.com/project/_/sql/new)

-- 1) Extensão para gerar UUIDs (já vem habilitada na maioria dos projetos
--    Supabase, mas não custa garantir)
create extension if not exists pgcrypto;

-- 2) Tabela de produtos
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null default '',
  categoria text not null default 'Geral',
  preco_exibicao text not null default '',
  imagem text not null,
  imagens text[] not null default '{}',
  link_redirecionamento text not null,
  destaque boolean not null default false,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists products_categoria_idx on public.products (categoria);
create index if not exists products_ativo_idx on public.products (ativo);
create index if not exists products_criado_em_idx on public.products (criado_em desc);

-- 3) Row Level Security
-- O backend do Next.js acessa a tabela com a service role key (que ignora
-- RLS), então essas políticas são uma segunda camada de proteção — úteis
-- caso a tabela venha a ser lida diretamente do browser com a chave anon
-- no futuro. Elas NÃO são o mecanismo principal de controle de acesso hoje.
alter table public.products enable row level security;

drop policy if exists "Leitura pública de produtos ativos" on public.products;
create policy "Leitura pública de produtos ativos"
  on public.products for select
  to anon, authenticated
  using (ativo = true);

-- 4) Trigger para manter atualizado_em em dia em qualquer UPDATE
create or replace function public.set_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_atualizado_em on public.products;
create trigger trg_products_atualizado_em
  before update on public.products
  for each row
  execute function public.set_atualizado_em();

-- 5) Seed com os 6 itens de exemplo que já existiam em data/products.json
-- (pode remover este bloco se não quiser os dados de exemplo)
insert into public.products
  (titulo, descricao, categoria, preco_exibicao, imagem, imagens, link_redirecionamento, destaque, ativo, criado_em, atualizado_em)
values
  ('Vaso Cerâmica Ondulada Terracota', 'Vaso artesanal em cerâmica com textura ondulada, acabamento fosco em tom terracota. Peça-chave para composições de estante ou mesa de centro.', 'Decoração', 'R$ 129,90', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', '{}', 'https://exemplo.com/produto/vaso-ondulado', true, true, '2026-06-01T12:00:00.000Z', '2026-06-01T12:00:00.000Z'),
  ('Luminária de Mesa Arco Minimal', 'Estrutura em metal com curva suave e cúpula em linho cru. Luz quente, ideal para cantos de leitura.', 'Iluminação', 'R$ 249,00', 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=800&q=80', '{}', 'https://exemplo.com/produto/luminaria-arco', true, true, '2026-06-02T12:00:00.000Z', '2026-06-02T12:00:00.000Z'),
  ('Manta Tricô Canelado Areia', 'Manta 100% algodão em tricô canelado, tom areia. Textura densa, caimento perfeito no sofá.', 'Têxtil', 'R$ 179,90', 'https://images.unsplash.com/photo-1616627981698-e8f7b4f6a5f4?w=800&q=80', '{}', 'https://exemplo.com/produto/manta-canelada', false, true, '2026-06-03T12:00:00.000Z', '2026-06-03T12:00:00.000Z'),
  ('Espelho Orgânico Moldura Ratanho', 'Espelho de formato orgânico com moldura em fibra natural trançada. Assinatura boho-chic para corredores e quartos.', 'Decoração', 'R$ 319,90', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80', '{}', 'https://exemplo.com/produto/espelho-organico', true, true, '2026-06-04T12:00:00.000Z', '2026-06-04T12:00:00.000Z'),
  ('Jogo de Taças Vidro Âmbar', 'Conjunto com 4 taças em vidro soprado tom âmbar. Formato baixo, ideal para mesas postas com clima autoral.', 'Mesa Posta', 'R$ 159,00', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', '{}', 'https://exemplo.com/produto/tacas-ambar', false, true, '2026-06-05T12:00:00.000Z', '2026-06-05T12:00:00.000Z'),
  ('Cesto Fibra Natural com Alça de Couro', 'Cesto trançado à mão em fibra natural com alça em couro legítimo. Organização com estética.', 'Organização', 'R$ 139,90', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80', '{}', 'https://exemplo.com/produto/cesto-fibra', false, true, '2026-06-06T12:00:00.000Z', '2026-06-06T12:00:00.000Z')
on conflict do nothing;

-- 6) Bucket de Storage para as imagens enviadas pelo painel admin
insert into storage.buckets (id, name, public)
values ('produtos-imagens', 'produtos-imagens', true)
on conflict (id) do nothing;

-- Leitura pública das imagens (o bucket já é público, mas a policy reforça)
drop policy if exists "Leitura pública de imagens de produtos" on storage.objects;
create policy "Leitura pública de imagens de produtos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produtos-imagens');

-- Upload/edição/remoção passam pela rota /api/upload usando a service role
-- key no servidor, que ignora RLS — não é necessário criar policies de
-- insert/update/delete para o cliente aqui.
