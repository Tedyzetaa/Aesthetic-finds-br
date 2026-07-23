"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState({ q: "", categoria: "" });

  // carrega categorias uma vez, a partir da coleção completa ativa
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const cats = Array.from(
          new Set((data.items as Product[]).map((p) => p.categoria))
        ).sort();
        setCategorias(cats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setCarregando(true);
    const params = new URLSearchParams();
    if (filtros.q) params.set("q", filtros.q);
    if (filtros.categoria) params.set("categoria", filtros.categoria);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setProdutos(data.items || []))
      .finally(() => setCarregando(false));
  }, [filtros]);

  const destaques = produtos.filter((p) => p.destaque).slice(0, 3);

  return (
    <div className="min-h-screen bg-base">
      <Header />

      {/* Hero editorial */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr,1fr] md:px-8 md:py-24">
          <div className="animate-rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Curadoria Aesthetic Finds
            </p>
            <h1 className="mt-4 font-display text-4xl italic leading-[1.1] text-ink md:text-6xl">
              Achados com estética,
              <br />
              <span className="not-italic text-green">selecionados a dedo.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-inkmuted">
              Uma vitrine editorial de objetos de decoração, iluminação e
              texturas — cada peça leva você direto até a loja de origem, sem
              ruído no caminho.
            </p>
            <a
              href="#colecao"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 font-body text-sm font-semibold text-base transition hover:bg-greendark"
            >
              Ver coleção
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(destaques.length ? destaques : Array(3).fill(null)).slice(0, 3).map((p, i) =>
              p ? (
                <div
                  key={p.id}
                  className={`overflow-hidden rounded-card shadow-card ${
                    i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imagem} alt={p.titulo} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div
                  key={i}
                  className={`skeleton animate-shimmer rounded-card ${
                    i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* Coleção */}
      <section id="colecao" className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div id="categorias" className="mb-8">
          <SearchBar categorias={categorias} onChange={setFiltros} />
        </div>

        {carregando ? (
          <ProductGridSkeleton />
        ) : produtos.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-white py-20 text-center">
            <p className="font-display text-lg italic text-ink">
              Nenhum achado por aqui ainda.
            </p>
            <p className="mt-2 text-sm text-inkmuted">
              Ajuste a busca ou volte para "Todas" as categorias.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {produtos.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
