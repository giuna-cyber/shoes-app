import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [
    ordiniRows,
    clientiRows,
    articoliRows,
    venditeRows,
    esauritiRows,
  ] = await Promise.all([
    sql`
      SELECT COUNT(*) AS totale
      FROM ordini
    `,

    sql`
      SELECT COUNT(*) AS totale
      FROM clienti
    `,

    sql`
      SELECT COUNT(*) AS totale
      FROM articoli
    `,

    sql`
      SELECT COALESCE(SUM(totale), 0) AS totale
      FROM ordini
      WHERE stato <> 'annullato'
    `,

    sql`
      SELECT COUNT(*) AS totale
      FROM articoli a
      WHERE NOT EXISTS (
        SELECT 1
        FROM varianti v
        WHERE v.articolo_id = a.id
          AND v.quantita_disponibile > 0
      )
    `,
  ]);

  const totaleOrdini = Number(ordiniRows[0]?.totale ?? 0);
  const totaleClienti = Number(clientiRows[0]?.totale ?? 0);
  const totaleArticoli = Number(articoliRows[0]?.totale ?? 0);
  const totaleVendite = Number(venditeRows[0]?.totale ?? 0);
  const prodottiEsauriti = Number(esauritiRows[0]?.totale ?? 0);

  const cards = [
    {
      href: "/admin/catalogo",
      label: "Catalogo",
      title: "Scarpe e varianti",
      description:
        "Gestisci modelli, taglie, colori, disponibilità, prezzi e immagini.",
    },
    {
      href: "/admin/marche",
      label: "Marche",
      title: "Brand",
      description:
        "Crea e modifica le marche presenti nel catalogo.",
    },
    {
      href: "/admin/categorie",
      label: "Categorie",
      title: "Tipologie",
      description:
        "Organizza sneakers, running, eleganti, casual, sandali e stivali.",
    },
    {
      href: "/admin/promozioni",
      label: "Promozioni",
      title: "Offerte",
      description:
        "Imposta sconti, campagne e prodotti in evidenza.",
    },
    {
      href: "/admin/ordini",
      label: "Ordini",
      title: "Vendite",
      description:
        "Controlla ordini, pagamenti, preparazione e spedizioni.",
    },
    {
      href: "/admin/clienti",
      label: "Clienti",
      title: "Anagrafica",
      description:
        "Consulta profili, indirizzi e storico acquisti.",
    },
    {
      href: "/admin/statistiche",
      label: "Statistiche",
      title: "Analisi",
      description:
        "Visualizza vendite, prodotti più richiesti e andamento ordini.",
    },
    {
      href: "/admin/impostazioni",
      label: "Impostazioni",
      title: "White-label",
      description:
        "Logo, colori, contatti, spedizione e configurazione del negozio.",
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Buongiorno, {session.nome}
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Panoramica generale del negozio e accesso rapido alle funzioni.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="app-card p-5">
            <div className="text-sm font-medium text-[var(--color-text-muted)]">
              Ordini
            </div>

            <div className="mt-2 text-3xl font-bold">
              {totaleOrdini}
            </div>
          </div>

          <div className="app-card p-5">
            <div className="text-sm font-medium text-[var(--color-text-muted)]">
              Clienti
            </div>

            <div className="mt-2 text-3xl font-bold">
              {totaleClienti}
            </div>
          </div>

          <div className="app-card p-5">
            <div className="text-sm font-medium text-[var(--color-text-muted)]">
              Articoli
            </div>

            <div className="mt-2 text-3xl font-bold">
              {totaleArticoli}
            </div>
          </div>

          <div className="app-card p-5">
            <div className="text-sm font-medium text-[var(--color-text-muted)]">
              Vendite
            </div>

            <div className="mt-2 text-3xl font-bold">
              € {totaleVendite.toFixed(2)}
            </div>
          </div>

          <div className="app-card p-5">
            <div className="text-sm font-medium text-[var(--color-text-muted)]">
              Esauriti
            </div>

            <div className="mt-2 text-3xl font-bold">
              {prodottiEsauriti}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                Gestione negozio
              </h2>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Tutte le funzioni principali della Shoes App.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="app-card group p-6 transition duration-200 hover:-translate-y-1"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {card.label}
                </div>

                <h3 className="mt-3 text-xl font-bold">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                  {card.description}
                </p>

                <div className="mt-6 text-sm font-semibold text-[var(--color-primary)]">
                  Apri
                  <span className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="app-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Catalogo
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Inserisci una nuova scarpa
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Aggiungi marca, modello, categoria, genere, prezzo e successivamente
              tutte le varianti taglia/colore.
            </p>

            <Link
              href="/admin/catalogo/nuovo"
              className="app-button-primary mt-6 inline-flex px-5 py-3 text-sm font-semibold"
            >
              Nuova scarpa
            </Link>
          </div>

          <div className="app-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              White-label
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Personalizza il negozio
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Gestisci palette colori, logo, dati aziendali, contatti e costi
              di spedizione.
            </p>

            <Link
              href="/admin/impostazioni"
              className="app-button-secondary mt-6 inline-flex px-5 py-3 text-sm font-semibold"
            >
              Impostazioni
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}