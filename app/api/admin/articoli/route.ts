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
        a.created_at,
        a.updated_at,

        m.id AS marca_id,
        m.nome AS marca,

        c.id AS categoria_id,
        c.nome AS categoria,

        (
          SELECT ia.url
          FROM immagini_articoli ia
          WHERE ia.articolo_id = a.id
          ORDER BY
            ia.principale DESC,
            ia.ordinamento ASC,
            ia.id ASC
          LIMIT 1
        ) AS immagine_principale,

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

      ORDER BY
        a.created_at DESC
    `;

    const articoli = rows.map((row) => ({
      id: Number(row.id),

      modello: String(row.modello),

      slug: String(row.slug),

      genere: String(row.genere),

      descrizione:
        row.descrizione !== null
          ? String(row.descrizione)
          : null,

      descrizione_breve:
        row.descrizione_breve !== null
          ? String(row.descrizione_breve)
          : null,

      prezzo: Number(row.prezzo),

      prezzo_promozionale:
        row.prezzo_promozionale !== null
          ? Number(row.prezzo_promozionale)
          : null,

      codice:
        row.codice !== null
          ? String(row.codice)
          : null,

      sku_base:
        row.sku_base !== null
          ? String(row.sku_base)
          : null,

      attiva: Boolean(row.attiva),

      in_evidenza: Boolean(row.in_evidenza),

      marca_id:
        row.marca_id !== null
          ? Number(row.marca_id)
          : null,

      marca:
        row.marca !== null
          ? String(row.marca)
          : null,

      categoria_id:
        row.categoria_id !== null
          ? Number(row.categoria_id)
          : null,

      categoria:
        row.categoria !== null
          ? String(row.categoria)
          : null,

      immagine_principale:
        row.immagine_principale !== null
          ? String(row.immagine_principale)
          : null,

      quantita_totale: Number(row.quantita_totale),

      numero_varianti: Number(row.numero_varianti),

      created_at: row.created_at,

      updated_at: row.updated_at,
    }));

    return NextResponse.json({
      ok: true,
      data: articoli,
      total: articoli.length,
    });
  } catch (error) {
    console.error("Errore API Admin articoli:", error);

    return NextResponse.json(
      {
        ok: false,
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Errore durante il caricamento degli articoli",
      },
      {
        status: 500,
      }
    );
  }
}