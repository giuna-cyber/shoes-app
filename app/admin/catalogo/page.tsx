import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCatalogoPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const articoli = await sql`
    SELECT
      a.id,
      a.modello,
      a.genere,
      a.prezzo,
      a.prezzo_promozionale,
      a.attiva,
      a.in_evidenza,
      m.nome AS marca,
      c.nome AS categoria,
      COALESCE(
        (SELECT SUM(v.quantita_disponibile) FROM varianti v WHERE v.articolo_id = a.id),
        0
      ) AS quantita_totale,
      COALESCE(
        (SELECT COUNT(*) FROM varianti v WHERE v.articolo_id = a.id),
        0
      ) AS numero_varianti
    FROM articoli a
    LEFT JOIN marche m ON m.id = a.marca_id
    LEFT JOIN categorie c ON c.id = a.categoria_id
    ORDER BY a.created_at DESC
  `;

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-950">Catalogo</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Gestisci scarpe, prezzi, varianti e disponibilità.
            </p>
          </div>

          <Link
            href="/admin/catalogo/nuovo"
            className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Nuova scarpa
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          {articoli.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-xl font-bold text-zinc-950">Catalogo vuoto</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Non hai ancora inserito nessuna scarpa.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-5 py-4">Articolo</th>
                    <th className="px-5 py-4">Categoria</th>
                    <th className="px-5 py-4">Genere</th>
                    <th className="px-5 py-4">Prezzo</th>
                    <th className="px-5 py-4">Varianti</th>
                    <th className="px-5 py-4">Disponibilità</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {articoli.map((a) => (
                    <tr key={Number(a.id)}>
                      <td className="px-5 py-4 font-semibold">
                        {a.marca ? `${String(a.marca)} ` : ""}
                        {String(a.modello)}
                      </td>
                      <td className="px-5 py-4">
                        {a.categoria ? String(a.categoria) : "—"}
                      </td>
                      <td className="px-5 py-4 capitalize">{String(a.genere)}</td>
                      <td className="px-5 py-4">
                        € {Number(a.prezzo_promozionale ?? a.prezzo).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">{Number(a.numero_varianti)}</td>
                      <td className="px-5 py-4">{Number(a.quantita_totale)}</td>
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
