export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-base">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg italic text-ink">Aesthetic Finds Br</p>
            <p className="mt-2 max-w-sm text-sm text-inkmuted">
              Curadoria de achados com estética. Cada peça é selecionada a dedo
              e o clique leva direto até a loja de origem.
            </p>
          </div>
          <div className="text-sm text-inkmuted">
            <p className="font-body font-medium text-ink">Portfólio Teddy</p>
            <p className="mt-2">Vitrine digital · Catálogo Elite</p>
          </div>
        </div>
        <p className="mt-10 text-xs text-inkmuted/70">
          © {new Date().getFullYear()} Aesthetic Finds Br. Os produtos exibidos
          redirecionam para lojas parceiras. Preços e disponibilidade são de
          responsabilidade do vendedor de origem.
        </p>
      </div>
    </footer>
  );
}
