export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center bg-base">
      <div className="max-w-sm">
        <div className="mx-auto mb-5 h-14 w-14 rounded-full border border-goldsoft flex items-center justify-center">
          <span className="font-display text-goldsoft text-xl">AF</span>
        </div>
        <h1 className="font-display text-2xl mb-3 text-ink">Você está offline</h1>
        <p className="text-sm text-inkmuted mb-1">
          Essa página ainda não tinha sido carregada enquanto você estava online.
        </p>
        <p className="text-sm text-inkmuted">
          Assim que a conexão voltar, é só tocar em atualizar.
        </p>
      </div>
    </div>
  );
}
