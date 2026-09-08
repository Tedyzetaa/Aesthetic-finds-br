"use client";

import { useEffect, useRef, useState } from "react";

export default function SearchBar({
  categorias,
  onChange
}: {
  categorias: string[];
  onChange: (filtros: { q: string; categoria: string }) => void;
}) {
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ q, categoria });
    }, 220);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, categoria]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-inkmuted"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="text"
          placeholder="Buscar achados: vaso, luminária, manta..."
          className="focus-ring w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 font-body text-sm text-ink placeholder:text-inkmuted/70"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoria("")}
          className={`focus-ring rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
            categoria === ""
              ? "border-green bg-green text-base"
              : "border-line bg-white text-inkmuted hover:border-green hover:text-green"
          }`}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`focus-ring rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
              categoria === c
                ? "border-green bg-green text-base"
                : "border-line bg-white text-inkmuted hover:border-green hover:text-green"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
