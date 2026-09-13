import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

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
        ) AS quantita_totale
      FROM articoli a
      LEFT JOIN marche m ON m.id = a.marca_id
      LEFT JOIN categorie c ON c.id = a.categoria_id
      ORDER BY a.created_at DESC
    `;

    return NextResponse.json({
      ok: true,
      data: rows,
      total: rows.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { ok: false, error: "Accesso non autorizzato" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore durante il caricamento degli articoli",
      },
      { status: 500 }
    );
  }
}
