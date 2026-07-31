"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

export default function InventoryTable({
  itensIniciais,
  categoriasIniciais
}: {
  itensIniciais: Product[];
  categoriasIniciais: string[];
}) {
  const router = useRouter();
  const [itens, setItens] = useState(itensIniciais);
  const [alvoExclusao, setAlvoExclusao] = useState<Product | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState(""); // "" = todas
  const [colapsadas, setColapsadas] = useState<Record<string, boolean>>({});

  // Lista de categorias: junta as que vieram do servidor com as que
  // porventura existam só nos itens carregados no client (ex: recém-criadas).
  const categorias = useMemo(() => {
    const set = new Set([...categoriasIniciais, ...itens.map((p) => p.categoria)]);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [categoriasIniciais, itens]);

  // Agrupa os itens (já filtrados por categoria, se houver filtro ativo)
  // por categoria, em ordem alfabética — assim cada seção fica isolada
  // e fica mais fácil editar item por item dentro de um mesmo grupo.
  const grupos = useMemo(() => {
    const base = categoriaFiltro
      ? itens.filter((p) => p.categoria === categoriaFiltro)
      : itens;

    const mapa = new Map<string, Product[]>();
    for (const p of base) {
      const chave = p.categoria || "Sem categoria";
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(p);
    }

    return Array.from(mapa.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], "pt-BR")
    );
  }, [itens, categoriaFiltro]);

  function contagemPorCategoria(cat: string) {
    return itens.filter((p) => p.categoria === cat).length;
  }

  function toggleColapso(cat: string) {
    setColapsadas((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  async function toggleCampo(id: string, campo: "ativo" | "destaque", valor: boolean) {
    setItens((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [campo]: valor })
    });
  }

  async function confirmarExclusao() {
    if (!alvoExclusao) return;
    setExcluindo(true);
    try {
      await fetch(`/api/products/${alvoExclusao.id}`, { method: "DELETE" });
      setItens((prev) => prev.filter((p) => p.id !== alvoExclusao.id));
      setAlvoExclusao(null);
      setConfirmText("");
      router.refresh();
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      {/* Filtro por categoria */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoriaFiltro("")}
          className={`focus-ring rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
            categoriaFiltro === ""
              ? "border-green bg-green text-base"
              : "border-line bg-white text-inkmuted hover:border-green hover:text-green"
          }`}
        >
          Todas ({itens.length})
        </button>
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategoriaFiltro(c)}
            className={`focus-ring rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
              categoriaFiltro === c
                ? "border-green bg-green text-base"
                : "border-line bg-white text-inkmuted hover:border-green hover:text-green"
            }`}
          >
            {c} ({contagemPorCategoria(c)})
          </button>
        ))}
      </div>

      {/* Grupos por categoria */}
      <div className="space-y-6">
        {grupos.length === 0 && (
          <div className="rounded-card border border-line bg-white py-10 text-center text-inkmuted shadow-card">
            Nenhum item cadastrado ainda.
          </div>
        )}

        {grupos.map(([categoria, produtosDaCategoria]) => {
          const colapsada = !!colapsadas[categoria];
          return (
            <div
              key={categoria}
              className="overflow-hidden rounded-card border border-line bg-white shadow-card"
            >
              <button
                onClick={() => toggleColapso(categoria)}
                className="focus-ring flex w-full items-center justify-between bg-base/60 px-4 py-3 text-left"
              >
                <span className="font-display text-base italic text-ink">
                  {categoria}{" "}
                  <span className="font-body text-xs not-italic text-inkmuted">
                    ({produtosDaCategoria.length}{" "}
                    {produtosDaCategoria.length === 1 ? "item" : "itens"})
                  </span>
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`text-inkmuted transition-transform ${colapsada ? "" : "rotate-180"}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {!colapsada && (
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-t border-line bg-base/30 text-xs uppercase tracking-wide text-inkmuted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item</th>
                      <th className="px-4 py-3 font-medium">Ativo</th>
                      <th className="px-4 py-3 font-medium">Destaque</th>
                      <th className="px-4 py-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosDaCategoria.map((p) => (
                      <tr key={p.id} className="border-b border-line last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.imagem}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <span className="font-medium text-ink">{p.titulo}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Toggle
                            checked={p.ativo}
                            onChange={(v) => toggleCampo(p.id, "ativo", v)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Toggle
                            checked={p.destaque}
                            onChange={(v) => toggleCampo(p.id, "destaque", v)}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/admin/produtos/${p.id}`}
                              className="focus-ring text-sm text-green hover:underline"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => setAlvoExclusao(p)}
                              className="focus-ring text-sm text-alert hover:underline"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de exclusão com dupla checagem — ação destrutiva */}
      {alvoExclusao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5">
          <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-lift">
            <p className="font-mono text-xs uppercase tracking-widest text-alert">
              Ação destrutiva
            </p>
            <h2 className="mt-2 font-display text-lg italic text-ink">
              Excluir "{alvoExclusao.titulo}"?
            </h2>
            <p className="mt-2 text-sm text-inkmuted">
              Essa ação não pode ser desfeita. Digite <strong>EXCLUIR</strong> para confirmar.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="focus-ring mt-4 w-full rounded-lg border border-line px-3 py-2 text-sm"
              placeholder="EXCLUIR"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setAlvoExclusao(null);
                  setConfirmText("");
                }}
                className="focus-ring rounded-full border border-line px-4 py-2 text-sm text-inkmuted hover:bg-base"
              >
                Cancelar
              </button>
              <button
                disabled={confirmText !== "EXCLUIR" || excluindo}
                onClick={confirmarExclusao}
                className="focus-ring rounded-full bg-alert px-4 py-2 text-sm font-semibold text-base disabled:opacity-40"
              >
                {excluindo ? "Excluindo..." : "Excluir definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`focus-ring relative h-6 w-11 rounded-full transition ${
        checked ? "bg-growth" : "bg-line"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}
