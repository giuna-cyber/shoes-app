import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CatalogoRow = {
  id: number;
  modello: string;
  slug: string;
  genere: string;
  descrizione: string | null;
  descrizione_breve: string | null;
  prezzo: string;
  prezzo_promozionale: string | null;
  codice: string | null;
  sku_base: string | null;
  attiva: boolean;
  in_evidenza: boolean;

  marca_id: number | null;
  marca: string | null;

  categoria_id: number | null;
  categoria: string | null;

  immagine_principale: string | null;

  quantita_totale: string;
  varianti_disponibili: string;
};

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
            WHERE v.articolo_id = a.id
              AND v.attiva = TRUE
          ),
          0
        ) AS quantita_totale,

        COALESCE(
          (
            SELECT COUNT(*)
            FROM varianti v
            WHERE v.articolo_id = a.id
              AND v.attiva = TRUE
              AND v.quantita_disponibile > 0
          ),
          0
        ) AS varianti_disponibili

      FROM articoli a

      LEFT JOIN marche m
        ON m.id = a.marca_id

      LEFT JOIN categorie c
        ON c.id = a.categoria_id

      WHERE a.attiva = TRUE

      ORDER BY
        a.in_evidenza DESC,
        a.created_at DESC
    `;

    const articoli = (rows as CatalogoRow[]).map((row) => ({
      id: Number(row.id),

      modello: row.modello,
      slug: row.slug,
      genere: row.genere,

      descrizione: row.descrizione,
      descrizione_breve: row.descrizione_breve,

      prezzo: Number(row.prezzo),

      prezzo_promozionale:
        row.prezzo_promozionale !== null
          ? Number(row.prezzo_promozionale)
          : null,

      codice: row.codice,
      sku_base: row.sku_base,

      attiva: row.attiva,
      in_evidenza: row.in_evidenza,

      marca_id:
        row.marca_id !== null
          ? Number(row.marca_id)
          : null,

      marca: row.marca,

      categoria_id:
        row.categoria_id !== null
          ? Number(row.categoria_id)
          : null,

      categoria: row.categoria,

      immagine_principale: row.immagine_principale,

      quantita_totale: Number(row.quantita_totale),

      varianti_disponibili: Number(row.varianti_disponibili),

      disponibile: Number(row.quantita_totale) > 0,
    }));

    return NextResponse.json({
      ok: true,
      data: articoli,
      total: articoli.length,
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
      {
        status: 500,
      }
    );
  }
}