"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

export default function InventoryTable({ itensIniciais }: { itensIniciais: Product[] }) {
  const router = useRouter();
  const [itens, setItens] = useState(itensIniciais);
  const [alvoExclusao, setAlvoExclusao] = useState<Product | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [excluindo, setExcluindo] = useState(false);

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
      <div className="overflow-hidden rounded-card border border-line bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-base/60 text-xs uppercase tracking-wide text-inkmuted">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Ativo</th>
              <th className="px-4 py-3 font-medium">Destaque</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imagem} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium text-ink">{p.titulo}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-inkmuted">{p.categoria}</td>
                <td className="px-4 py-3">
                  <Toggle checked={p.ativo} onChange={(v) => toggleCampo(p.id, "ativo", v)} />
                </td>
                <td className="px-4 py-3">
                  <Toggle checked={p.destaque} onChange={(v) => toggleCampo(p.id, "destaque", v)} />
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
            {itens.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-inkmuted">
                  Nenhum item cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
