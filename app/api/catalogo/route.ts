import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        a.id,
        a.modello,
        a.slug,
        a.genere,
        a.descrizione,
        a.descrizione_breve,
        a.prezzo,
        a.prezzo_promozionale,
        a.codice,
        a.sku_base,
        a.attiva,
        a.in_evidenza,
        m.id AS marca_id,
        m.nome AS marca,
        c.id AS categoria_id,
        c.nome AS categoria,
        (
          SELECT ia.url
          FROM immagini_articoli ia
          WHERE ia.articolo_id = a.id
          ORDER BY ia.principale DESC, ia.ordinamento ASC, ia.id ASC
          LIMIT 1
        ) AS immagine_principale,
        COALESCE(
          (
            SELECT SUM(v.quantita_disponibile)
            FROM varianti v
            WHERE v.articolo_id = a.id AND v.attiva = TRUE
          ),
          0
        ) AS quantita_totale
      FROM articoli a
      LEFT JOIN marche m ON m.id = a.marca_id
      LEFT JOIN categorie c ON c.id = a.categoria_id
      WHERE a.attiva = TRUE
      ORDER BY a.in_evidenza DESC, a.created_at DESC
    `;

    return NextResponse.json({
      ok: true,
      data: rows,
      total: rows.length,
    });
  } catch (error) {
    console.error("Errore API catalogo:", error);

    return NextResponse.json(
      {
        ok: false,
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Errore durante il caricamento del catalogo",
      },
      { status: 500 }
    );
  }
}
