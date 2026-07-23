import Link from "next/link";
import { Product } from "@/lib/types";

export default function ProductCard({ produto }: { produto: Product }) {
  return (
    <Link
      href={`/produto/${produto.id}`}
      className="focus-ring group relative block overflow-hidden rounded-card bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={produto.imagem}
          alt={produto.titulo}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {produto.destaque && (
          <span className="absolute left-3 top-3 -translate-y-1 rotate-[-3deg] rounded-sm bg-gold px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-base opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Achado
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-gold">
          {produto.categoria}
        </p>
        <h3 className="mt-1 font-display text-base leading-snug text-ink">
          {produto.titulo}
        </h3>
        {produto.precoExibicao && (
          <p className="mt-2 text-sm font-medium text-inkmuted">
            {produto.precoExibicao}
          </p>
        )}
      </div>
    </Link>
  );
}
