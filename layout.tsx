import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default function AdminProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] font-body">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 flex-col border-r border-line bg-white px-5 py-6 md:flex">
          <Link href="/admin" className="font-display text-lg italic text-ink">
            Aesthetic Finds <span className="not-italic text-gold">Br</span>
          </Link>
          <p className="mb-8 mt-1 font-mono text-[10px] uppercase tracking-widest text-inkmuted">
            Sala de controle
          </p>

          <nav className="flex flex-col gap-1 text-sm">
            <Link
              href="/admin"
              className="focus-ring rounded-lg px-3 py-2 text-inkmuted transition hover:bg-base hover:text-ink"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/produtos"
              className="focus-ring rounded-lg px-3 py-2 text-inkmuted transition hover:bg-base hover:text-ink"
            >
              Inventário
            </Link>
            <Link
              href="/admin/produtos/novo"
              className="focus-ring rounded-lg px-3 py-2 text-inkmuted transition hover:bg-base hover:text-ink"
            >
              Novo item
            </Link>
            <Link
              href="/"
              className="focus-ring rounded-lg px-3 py-2 text-inkmuted transition hover:bg-base hover:text-ink"
            >
              Ver vitrine
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 px-5 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
