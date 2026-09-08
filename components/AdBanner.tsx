"use client";

/**
 * Bloco de anúncio da A-ADS (a-ads.com).
 *
 * A A-ADS gera um <iframe data-aa="SEU_ID" src="//acceptable.a-ads.com/SEU_ID">
 * por unidade de anúncio criada no painel deles. Em vez de colar esse ID
 * direto no código, ele vem de uma env var (NEXT_PUBLIC_*) — assim dá pra
 * trocar de campanha/unidade sem precisar mexer em código ou redeployar
 * manualmente o app inteiro toda vez.
 *
 * Se a env var não estiver definida, o componente não renderiza nada
 * (evita quebrar o layout com iframe vazio em dev/preview).
 */

type AdBannerProps = {
  unitId?: string;
  width?: number;
  height?: number;
  label?: string;
  className?: string;
};

export default function AdBanner({
  unitId,
  width = 728,
  height = 90,
  label = "Publicidade",
  className = "",
}: AdBannerProps) {
  if (!unitId) return null;

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-inkmuted/50">
        {label}
      </span>
      <div
        className="overflow-hidden rounded-card"
        style={{ maxWidth: "100%" }}
      >
        <iframe
          data-aa={unitId}
          src={`//acceptable.a-ads.com/${unitId}`}
          style={{
            border: 0,
            padding: 0,
            width: `${width}px`,
            maxWidth: "100%",
            height: `${height}px`,
            overflow: "hidden",
          }}
          scrolling="no"
          title="Anúncio A-ADS"
        />
      </div>
    </div>
  );
}
