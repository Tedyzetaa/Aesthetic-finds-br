import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, listProducts } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export default async function ProdutoPage({ params }: { params: { id: string } }) {
  const produto = await getProduct(params.id);
  if (!produto || !produto.ativo) return notFound();

  const relacionados = (
    await listProducts({ categoria: produto.categoria, somenteAtivos: true })
  )
    .filter((p) => p.id !== produto.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-base">
      <Header />

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="overflow-hidden rounded-card bg-white shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={produto.imagem}
              alt={produto.titulo}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="animate-rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              {produto.categoria}
            </p>
            <h1 className="mt-3 font-display text-3xl italic leading-tight text-ink md:text-4xl">
              {produto.titulo}
            </h1>

            {produto.precoExibicao && (
              <p className="mt-4 text-2xl font-semibold text-ink">
                {produto.precoExibicao}
              </p>
            )}

            <p className="mt-6 max-w-md whitespace-pre-line text-base leading-relaxed text-inkmuted">
              {produto.descricao}
            </p>

            <a
              href={produto.linkRedirecionamento}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="focus-ring mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-green px-8 py-4 font-body text-base font-semibold text-base shadow-lift transition hover:bg-greendark md:w-auto"
            >
              Ver na loja
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="mt-3 text-xs text-inkmuted/70">
              Você será redirecionado para a loja parceira em uma nova aba.
            </p>
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-xl italic text-ink">
              Outros achados em {produto.categoria}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {relacionados.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
