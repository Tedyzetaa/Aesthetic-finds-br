/**
 * Anúncio "sticky" da A-ADS — fica fixo na parte de baixo da tela, por
 * cima de todo o conteúdo, com um botão de fechar (checkbox só-CSS, sem
 * precisar de JS/estado). Pensado pra viver no layout raiz e aparecer em
 * todas as páginas do site.
 *
 * Se NEXT_PUBLIC_AADS_UNIT_STICKY não estiver definida, não renderiza nada.
 */

type StickyAdBannerProps = {
  unitId?: string;
};

export default function StickyAdBanner({ unitId }: StickyAdBannerProps) {
  if (!unitId) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[99999]">
      <input
        autoComplete="off"
        type="checkbox"
        id="aads-sticky-toggle"
        hidden
        className="peer"
      />
      <div className="relative w-full text-center peer-checked:hidden">
        <label
          htmlFor="aads-sticky-toggle"
          className="absolute right-6 top-1/2 z-[99999] -translate-y-1/2 cursor-pointer rounded bg-white/70 p-1"
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
        <div className="relative z-[99998] mx-auto w-full">
          <iframe
            data-aa={unitId}
            src={`//acceptable.a-ads.com/${unitId}/?size=Adaptive`}
            style={{
              border: 0,
              padding: 0,
              width: "70%",
              height: "auto",
              overflow: "hidden",
              margin: "auto",
            }}
            title="Anúncio A-ADS"
          />
        </div>
      </div>
    </div>
  );
}
