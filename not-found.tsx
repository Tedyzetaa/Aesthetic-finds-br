import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">Erro 404</p>
        <h1 className="mt-3 font-display text-3xl italic text-ink">
          Esse achado não está mais aqui.
        </h1>
        <p className="mt-2 text-sm text-inkmuted">
          O item pode ter sido removido ou o link está incorreto.
        </p>
        <Link
          href="/"
          className="focus-ring mt-6 rounded-full bg-green px-6 py-3 text-sm font-semibold text-base transition hover:bg-greendark"
        >
          Voltar para a vitrine
        </Link>
      </div>
      <Footer />
    </div>
  );
}
