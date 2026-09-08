import Link from "next/link";
import { listProducts, getCategorias } from "@/lib/db";
import InventoryTable from "./InventoryTable";

export default async function InventarioPage() {
  const [produtos, categorias] = await Promise.all([
    listProducts({}),
    getCategorias()
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl italic text-ink">Inventário</h1>
          <p className="mt-1 text-sm text-inkmuted">
            Adicione, edite e gerencie os itens da vitrine.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="focus-ring rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-base transition hover:bg-greendark"
        >
          + Novo item
        </Link>
      </div>

      <div className="mt-6">
        <InventoryTable itensIniciais={produtos} categoriasIniciais={categorias} />
      </div>
    </div>
  );
}
