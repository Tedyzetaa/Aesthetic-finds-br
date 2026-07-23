import { supabaseAdmin } from "./supabase";
import { Product, ProductInput } from "./types";

// Camada de dados sobre a tabela "products" no Supabase (Postgres).
// Substitui o antigo armazenamento em data/products.json — ver
// supabase/migration.sql para o schema e a policy de RLS.

const TABLE = "products";

type ProductRow = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  preco_exibicao: string;
  imagem: string;
  imagens: string[] | null;
  link_redirecionamento: string;
  destaque: boolean;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
};

function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    categoria: row.categoria,
    precoExibicao: row.preco_exibicao,
    imagem: row.imagem,
    imagens: row.imagens || [],
    linkRedirecionamento: row.link_redirecionamento,
    destaque: row.destaque,
    ativo: row.ativo,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em
  };
}

function toRow(input: Partial<ProductInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.titulo !== undefined) row.titulo = input.titulo;
  if (input.descricao !== undefined) row.descricao = input.descricao;
  if (input.categoria !== undefined) row.categoria = input.categoria;
  if (input.precoExibicao !== undefined) row.preco_exibicao = input.precoExibicao;
  if (input.imagem !== undefined) row.imagem = input.imagem;
  if (input.imagens !== undefined) row.imagens = input.imagens;
  if (input.linkRedirecionamento !== undefined)
    row.link_redirecionamento = input.linkRedirecionamento;
  if (input.destaque !== undefined) row.destaque = input.destaque;
  if (input.ativo !== undefined) row.ativo = input.ativo;
  return row;
}

// Escapa caracteres especiais do filtro .or()/.ilike() do PostgREST
// (% e , e * quebrariam a query se vierem da busca do usuário).
function sanitizeIlike(value: string): string {
  return value.replace(/[%,*]/g, "");
}

export async function listProducts(opts?: {
  q?: string;
  categoria?: string;
  somenteAtivos?: boolean;
}): Promise<Product[]> {
  let query = supabaseAdmin.from(TABLE).select("*");

  if (opts?.somenteAtivos) {
    query = query.eq("ativo", true);
  }
  if (opts?.categoria) {
    query = query.ilike("categoria", opts.categoria);
  }
  if (opts?.q) {
    const q = `%${sanitizeIlike(opts.q)}%`;
    query = query.or(`titulo.ilike.${q},descricao.ilike.${q},categoria.ilike.${q}`);
  }

  query = query.order("criado_em", { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(`Erro ao listar produtos: ${error.message}`);
  return (data as ProductRow[]).map(fromRow);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Erro ao buscar produto: ${error.message}`);
  return data ? fromRow(data as ProductRow) : undefined;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .insert(toRow(input))
    .select("*")
    .single();
  if (error) throw new Error(`Erro ao criar produto: ${error.message}`);
  return fromRow(data as ProductRow);
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product | undefined> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update(toRow(input))
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`);
  return data ? fromRow(data as ProductRow) : undefined;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(`Erro ao excluir produto: ${error.message}`);
  return !!data && data.length > 0;
}

export async function getCategorias(): Promise<string[]> {
  const { data, error } = await supabaseAdmin.from(TABLE).select("categoria");
  if (error) throw new Error(`Erro ao buscar categorias: ${error.message}`);
  const set = new Set((data as { categoria: string }[]).map((r) => r.categoria));
  return Array.from(set).sort();
}

export async function getStats() {
  const items = await listProducts({});
  return {
    total: items.length,
    ativos: items.filter((p) => p.ativo).length,
    inativos: items.filter((p) => !p.ativo).length,
    destaques: items.filter((p) => p.destaque).length,
    categorias: new Set(items.map((p) => p.categoria)).size
  };
}
