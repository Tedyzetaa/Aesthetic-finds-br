import ProductForm from "../ProductForm";

export default function NovoProdutoPage() {
  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Novo item</h1>
      <p className="mt-1 text-sm text-inkmuted">
        Cadastre um novo achado para a vitrine.
      </p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
