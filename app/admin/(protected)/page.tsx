import Link from "next/link";
import { getStats, listProducts } from "@/lib/db";

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentes = (await listProducts({})).slice(0, 5);

  const cards = [
    { label: "Itens no catálogo", valor: stats.total, cor: "text-ink" },
    { label: "Ativos na vitrine", valor: stats.ativos, cor: "text-growth" },
    { label: "Inativos / pausados", valor: stats.inativos, cor: "text-inkmuted" },
    { label: "Em destaque", valor: stats.destaques, cor: "text-gold" }
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl italic text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-inkmuted">
            Visão em tempo real do catálogo Aesthetic Finds Br.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="focus-ring rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-base transition hover:bg-greendark"
        >
          + Novo item
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-line bg-white p-5 shadow-card">
            <p className={`font-display text-3xl ${c.cor}`}>{c.valor}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-inkmuted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg italic text-ink">Itens recentes</h2>
          <Link href="/admin/produtos" className="focus-ring text-sm text-green hover:underline">
            Ver inventário completo →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-card border border-line bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-base/60 text-xs uppercase tracking-wide text-inkmuted">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/produtos/${p.id}`} className="focus-ring font-medium text-ink hover:text-green">
                      {p.titulo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-inkmuted">{p.categoria}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        p.ativo ? "bg-growth/15 text-growth" : "bg-alert/10 text-alert"
                      }`}
                    >
                      {p.ativo ? "Ativo" : "Pausado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-inkmuted">
                    {new Date(p.atualizadoEm).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {recentes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-inkmuted">
                    Nenhum item cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
