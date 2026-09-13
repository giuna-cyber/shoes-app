import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const rows = await sql`
    SELECT
      a.id,
      a.modello,
      a.prezzo,
      a.prezzo_promozionale,
      a.genere,
      m.nome AS marca,
      c.nome AS categoria,
      (
        SELECT ia.url
        FROM immagini_articoli ia
        WHERE ia.articolo_id = a.id
        ORDER BY ia.principale DESC, ia.ordinamento ASC, ia.id ASC
        LIMIT 1
      ) AS immagine_principale
    FROM articoli a
    LEFT JOIN marche m ON m.id = a.marca_id
    LEFT JOIN categorie c ON c.id = a.categoria_id
    WHERE a.attiva = TRUE
    ORDER BY a.in_evidenza DESC, a.created_at DESC
  `;

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-zinc-950">Catalogo</h1>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-zinc-500">Catalogo ancora vuoto.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <article
                key={Number(row.id)}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5"
              >
                <div className="aspect-square bg-zinc-100">
                  {row.immagine_principale ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={String(row.immagine_principale)}
                      alt={String(row.modello)}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="p-5">
                  <div className="text-sm text-zinc-500">
                    {row.marca ? String(row.marca) : "Marca"}
                  </div>

                  <h2 className="mt-1 text-xl font-bold text-zinc-950">
                    {String(row.modello)}
                  </h2>

                  <div className="mt-3 text-sm text-zinc-500">
                    {row.categoria ? String(row.categoria) : "—"} · {String(row.genere)}
                  </div>

                  <div className="mt-4">
                    {row.prezzo_promozionale !== null ? (
                      <>
                        <span className="text-xl font-bold text-zinc-950">
                          € {Number(row.prezzo_promozionale).toFixed(2)}
                        </span>
                        <span className="ml-2 text-sm text-zinc-400 line-through">
                          € {Number(row.prezzo).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-zinc-950">
                        € {Number(row.prezzo).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
