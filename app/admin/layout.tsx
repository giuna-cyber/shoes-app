import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

const menu = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/catalogo", label: "Catalogo" },
  { href: "/admin/marche", label: "Marche" },
  { href: "/admin/categorie", label: "Categorie" },
  { href: "/admin/promozioni", label: "Promozioni" },
  { href: "/admin/ordini", label: "Ordini" },
  { href: "/admin/clienti", label: "Clienti" },
  { href: "/admin/statistiche", label: "Statistiche" },
  { href: "/admin/impostazioni", label: "Impostazioni" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex lg:flex-col">
          <div className="border-b border-[var(--color-border)] px-6 py-6">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
              XCodeLab
            </div>

            <div className="mt-2 text-2xl font-bold">
              Shoes Admin
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-secondary-hover)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[var(--color-border)] px-5 py-5">
            <div className="rounded-2xl bg-[var(--color-background)] p-4">
              <div className="text-sm font-semibold">
                {session.nome}
                {session.cognome ? ` ${session.cognome}` : ""}
              </div>

              <div className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
                {session.email}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div>
                <div className="text-sm font-semibold">
                  Shoes App
                </div>

                <div className="text-xs text-[var(--color-text-muted)]">
                  Pannello amministrazione
                </div>
              </div>

              <Link
                href="/"
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--color-secondary-hover)]"
              >
                Vai al sito
              </Link>
            </div>
          </header>

          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}