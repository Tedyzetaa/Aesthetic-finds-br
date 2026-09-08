"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductInput } from "@/lib/types";

const CATEGORIAS_SUGERIDAS = [
  "Setup e Gadgets",
  "Presentes Criativos",
  "Decoração para Quarto",
  "Decoração para Sala",
  "Utilidades para Casa ✨",
  "Mamãe e Bebê"
];

export default function ProductForm({
  produto,
  categoriasExistentes = []
}: {
  produto?: Product;
  categoriasExistentes?: string[];
}) {
  const router = useRouter();

  // Junta as categorias já cadastradas no banco com as sugestões padrão,
  // para reforçar o uso consistente de nomes e evitar duplicidade
  // (ex: "Decoração" vs "decoracao").
  const categoriasDisponiveis = Array.from(
    new Set([...categoriasExistentes, ...CATEGORIAS_SUGERIDAS])
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const [form, setForm] = useState<ProductInput>({
    titulo: produto?.titulo || "",
    descricao: produto?.descricao || "",
    categoria: produto?.categoria || "Setup e Gadgets",
    precoExibicao: produto?.precoExibicao || "",
    imagem: produto?.imagem || "",
    imagens: produto?.imagens || [],
    linkRedirecionamento: produto?.linkRedirecionamento || "",
    destaque: produto?.destaque ?? false,
    ativo: produto?.ativo ?? true
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  function set<K extends keyof ProductInput>(campo: K, valor: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro("");
    setEnviandoImagem(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro(data.erro || "Não foi possível enviar a imagem.");
        return;
      }
      set("imagem", data.url);
    } finally {
      setEnviandoImagem(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const url = produto ? `/api/products/${produto.id}` : "/api/products";
      const method = produto ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.erro || "Não foi possível salvar o item.");
        return;
      }
      router.push("/admin/produtos");
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Campo label="Título do item">
        <input
          required
          value={form.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm"
          placeholder="Ex: Vaso Cerâmica Ondulada Terracota"
        />
      </Campo>

      <Campo label="Descrição">
        <textarea
          value={form.descricao}
          onChange={(e) => set("descricao", e.target.value)}
          rows={4}
          className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm"
          placeholder="Detalhes que ajudam na decisão de compra..."
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Categoria">
          <input
            list="categorias-sugeridas"
            value={form.categoria}
            onChange={(e) => set("categoria", e.target.value)}
            className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm"
          />
          <datalist id="categorias-sugeridas">
            {categoriasDisponiveis.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Campo>

        <Campo label="Preço de exibição">
          <input
            value={form.precoExibicao}
            onChange={(e) => set("precoExibicao", e.target.value)}
            className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm"
            placeholder="R$ 129,90"
          />
        </Campo>
      </div>

      <Campo label="Imagem principal">
        <div className="flex flex-wrap items-center gap-3">
          <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink transition hover:border-green">
            {enviandoImagem ? "Enviando..." : "Enviar do computador"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              disabled={enviandoImagem}
              className="hidden"
            />
          </label>
          <span className="text-xs text-inkmuted">ou cole uma URL abaixo</span>
        </div>
        <input
          required
          value={form.imagem}
          onChange={(e) => set("imagem", e.target.value)}
          className="focus-ring mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm"
          placeholder="https://..."
        />
      </Campo>

      {form.imagem && (
        <div className="h-40 w-40 overflow-hidden rounded-card border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={form.imagem} alt="Pré-visualização" className="h-full w-full object-cover" />
        </div>
      )}

      <Campo label="Link de redirecionamento (loja de destino)">
        <input
          required
          value={form.linkRedirecionamento}
          onChange={(e) => set("linkRedirecionamento", e.target.value)}
          className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm"
          placeholder="https://loja-parceira.com/produto"
        />
      </Campo>

      <div className="flex gap-8">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => set("ativo", e.target.checked)}
            className="h-4 w-4 accent-green"
          />
          Ativo na vitrine
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.destaque}
            onChange={(e) => set("destaque", e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Em destaque (selo "Achado")
        </label>
      </div>

      {erro && <p className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{erro}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={salvando}
          className="focus-ring rounded-full bg-green px-6 py-2.5 text-sm font-semibold text-base transition hover:bg-greendark disabled:opacity-60"
        >
          {salvando ? "Salvando..." : produto ? "Salvar alterações" : "Cadastrar item"}
        </button>
      </div>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
