import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db";
import ProductForm from "../ProductForm";

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const produto = await getProduct(params.id);
  if (!produto) return notFound();

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Editar item</h1>
      <p className="mt-1 text-sm text-inkmuted">{produto.titulo}</p>
      <div className="mt-6">
        <ProductForm produto={produto} />
      </div>
    </div>
  );
}
