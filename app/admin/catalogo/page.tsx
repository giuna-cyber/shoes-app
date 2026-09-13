import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type ArticoloAdmin = {
  id: number;
  modello: string;
  slug: string;
  genere: string;
  prezzo: number;
  prezzo_promozionale: number | null;
  attiva: boolean;
  in_evidenza: boolean;
  marca: string | null;
  categoria: string | null;
  quantita_totale: number;
  numero_varianti: number;
};

export default async function AdminCatalogoPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const rows = await sql`
    SELECT
      a.id,
      a.modello,
      a.slug,
      a.genere,
      a.prezzo,
      a.prezzo_promozionale,
      a.attiva,
      a.in_evidenza,

      m.nome AS marca,
      c.nome AS categoria,

      COALESCE(
        (
          SELECT SUM(v.quantita_disponibile)
          FROM varianti v
          WHERE v.articolo_id = a.id
        ),
        0
      ) AS quantita_totale,

      COALESCE(
        (
          SELECT COUNT(*)
          FROM varianti v
          WHERE v.articolo_id = a.id
        ),
        0
      ) AS numero_varianti

    FROM articoli a

    LEFT JOIN marche m
      ON m.id = a.marca_id

    LEFT JOIN categorie c
      ON c.id = a.categoria_id

    ORDER BY a.created_at DESC
  `;

  const articoli: ArticoloAdmin[] = rows.map((row) => ({
    id: Number(row.id),

    modello: String(row.modello),
    slug: String(row.slug),
    genere: String(row.genere),

    prezzo: Number(row.prezzo),

    prezzo_promozionale:
      row.prezzo_promozionale !== null
        ? Number(row.prezzo_promozionale)
        : null,

    attiva: Boolean(row.attiva),
    in_evidenza: Boolean(row.in_evidenza),

    marca:
      row.marca !== null
        ? String(row.marca)
        : null,

    categoria:
      row.categoria !== null
        ? String(row.categoria)
        : null,

    quantita_totale: Number(row.quantita_totale),

    numero_varianti: Number(row.numero_varianti),
  }));

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Shoes Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
              Catalogo
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Gestisci scarpe, prezzi, varianti e disponibilità.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/catalogo/nuovo"
              className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Nuova scarpa
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          {articoli.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-xl font-bold text-zinc-950">
                Catalogo vuoto
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Non hai ancora inserito nessuna scarpa.
              </p>

              <Link
                href="/admin/catalogo/nuovo"
                className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Inserisci la prima scarpa
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-zinc-600">
                      Articolo
                    </th>

                    <th className="px-5 py-4 font-semibold text-zinc-600">
                      Categoria
                    </th>

                    <th className="px-5 py-4 font-semibold text-zinc-600">
                      Genere
                    </th>

                    <th className="px-5 py-4 font-semibold text-zinc-600">
                      Prezzo
                    </th>

                    <th className="px-5 py-4 font-semibold text-zinc-600">
                      Varianti
                    </th>

                    <th className="px-5 py-4 font-semibold text-zinc-600">
                      Disponibilità
                    </th>

                    <th className="px-5 py-4 font-semibold text-zinc-600">
                      Stato
                    </th>

                    <th className="px-5 py-4 text-right font-semibold text-zinc-600">
                      Azioni
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100">
                  {articoli.map((articolo) => (
                    <tr
                      key={articolo.id}
                      className="transition hover:bg-zinc-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-zinc-950">
                          {articolo.marca
                            ? `${articolo.marca} ${articolo.modello}`
                            : articolo.modello}
                        </div>

                        <div className="mt-1 text-xs text-zinc-400">
                          ID {articolo.id}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-zinc-600">
                        {articolo.categoria ?? "—"}
                      </td>

                      <td className="px-5 py-4 capitalize text-zinc-600">
                        {articolo.genere}
                      </td>

                      <td className="px-5 py-4">
                        {articolo.prezzo_promozionale !== null ? (
                          <div>
                            <div className="font-semibold text-zinc-950">
                              € {articolo.prezzo_promozionale.toFixed(2)}
                            </div>

                            <div className="text-xs text-zinc-400 line-through">
                              € {articolo.prezzo.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold text-zinc-950">
                            € {articolo.prezzo.toFixed(2)}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-zinc-600">
                        {articolo.numero_varianti}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            articolo.quantita_totale > 0
                              ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                              : "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                          }
                        >
                          {articolo.quantita_totale > 0
                            ? `${articolo.quantita_totale} disponibili`
                            : "Esaurito"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={
                              articolo.attiva
                                ? "text-sm font-semibold text-emerald-700"
                                : "text-sm font-semibold text-zinc-400"
                            }
                          >
                            {articolo.attiva ? "Attiva" : "Disattivata"}
                          </span>

                          {articolo.in_evidenza && (
                            <span className="text-xs font-medium text-amber-600">
                              In evidenza
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/catalogo/${articolo.id}`}
                          className="inline-flex rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                        >
                          Modifica
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}