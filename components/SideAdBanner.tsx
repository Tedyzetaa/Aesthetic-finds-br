/**
 * Anúncio "sticky" lateral da A-ADS — grudado na esquerda ou na direita
 * da tela, verticalmente centralizado, com botão de fechar (checkbox
 * só-CSS). Reaproveita a mesma ideia do StickyAdBanner, parametrizado
 * por `side` porque a A-ADS gera uma unidade pra cada lado.
 *
 * Escondido em telas pequenas (mobile) por decisão de UX: em 15% de
 * largura com mínimo de 100px, num celular ele tampa boa parte do
 * conteúdo. A partir de `md:` (tablet/desktop) ele aparece normalmente.
 *
 * Se o unitId correspondente não estiver definido, não renderiza nada.
 */

type SideAdBannerProps = {
  unitId?: string;
  side: "left" | "right";
};

export default function SideAdBanner({ unitId, side }: SideAdBannerProps) {
  if (!unitId) return null;

  const toggleId = `aads-side-${side}-toggle`;
  const sideClass = side === "left" ? "left-0" : "right-0";

  return (
    <div
      className={`fixed top-1/2 z-[99999] hidden -translate-y-1/2 md:block ${sideClass}`}
      style={{ width: "15%", minWidth: 100, height: "70vh" }}
    >
      <input
        autoComplete="off"
        type="checkbox"
        id={toggleId}
        hidden
        className="peer"
      />
      <div className="relative flex h-full flex-col justify-center peer-checked:hidden">
        <label
          htmlFor={toggleId}
          className="absolute bottom-6 left-1/2 z-[99999] -translate-x-1/2 cursor-pointer rounded bg-white/70 p-1"
        >
          <svg
            fill="#000000"
            height="16"
            width="16"
            viewBox="0 0 490 490"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 " />
          </svg>
        </label>
        <iframe
          data-aa={unitId}
          src={`//acceptable.a-ads.com/${unitId}/?size=Adaptive`}
          style={{
            border: 0,
            padding: 0,
            width: "70%",
            height: "70%",
            overflow: "hidden",
            margin: "0 auto",
          }}
          title="Anúncio A-ADS"
        />
      </div>
    </div>
  );
}
