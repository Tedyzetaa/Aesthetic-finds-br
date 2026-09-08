import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-base/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="focus-ring group flex items-center gap-2 rounded-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold text-gold transition group-hover:bg-gold group-hover:text-base">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="font-display text-[1.2rem] italic leading-none text-ink">
            Aesthetic Finds <span className="not-italic text-gold">Br</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-inkmuted md:flex">
          <Link href="/#colecao" className="focus-ring rounded-sm transition hover:text-ink">
            Coleção
          </Link>
          <Link href="/#categorias" className="focus-ring rounded-sm transition hover:text-ink">
            Categorias
          </Link>
          <Link href="/admin" className="focus-ring rounded-sm transition hover:text-ink">
            Painel
          </Link>
        </nav>
      </div>
    </header>
  );
}
