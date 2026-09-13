import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              XCodeLab
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
              Shoes Admin
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Benvenuto, {session.nome}
              {session.cognome ? ` ${session.cognome}` : ""}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm ring-1 ring-black/5">
            {session.email}
          </div>
        </div>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/catalogo"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Catalogo
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              Scarpe e varianti
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Gestisci articoli, taglie, colori, disponibilità e prezzi.
            </p>
          </Link>

          <Link
            href="/admin/marche"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Marche
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              Brand
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Crea e modifica le marche presenti nel catalogo.
            </p>
          </Link>

          <Link
            href="/admin/categorie"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Categorie
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              Tipologie
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Sneakers, running, eleganti, casual e altre categorie.
            </p>
          </Link>

          <Link
            href="/admin/promozioni"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Promozioni
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              Offerte
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Gestisci sconti, promozioni e prodotti in evidenza.
            </p>
          </Link>

          <Link
            href="/admin/ordini"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Ordini
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              Vendite
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Visualizza ordini, pagamenti e stato delle spedizioni.
            </p>
          </Link>

          <Link
            href="/admin/clienti"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Clienti
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              Anagrafica
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Profili clienti, indirizzi e storico acquisti.
            </p>
          </Link>

          <Link
            href="/admin/statistiche"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Statistiche
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              Dashboard
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Vendite, ordini, clienti e prodotti più richiesti.
            </p>
          </Link>

          <Link
            href="/admin/impostazioni"
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Impostazioni
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-950">
              White-label
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Logo, colori, contatti, spedizione e dati negozio.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}