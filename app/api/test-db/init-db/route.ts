import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS impostazioni_negozio (
        id BIGSERIAL PRIMARY KEY,
        nome_negozio VARCHAR(150) NOT NULL DEFAULT 'Shoes',
        logo_url TEXT,
        favicon_url TEXT,
        colore_primario VARCHAR(20) NOT NULL DEFAULT '#111111',
        colore_secondario VARCHAR(20) NOT NULL DEFAULT '#ffffff',
        colore_sfondo VARCHAR(20) NOT NULL DEFAULT '#ffffff',
        colore_testo VARCHAR(20) NOT NULL DEFAULT '#111111',
        email VARCHAR(190),
        telefono VARCHAR(50),
        indirizzo VARCHAR(255),
        citta VARCHAR(120),
        cap VARCHAR(20),
        provincia VARCHAR(10),
        nazione VARCHAR(80) DEFAULT 'Italia',
        sito_web TEXT,
        instagram TEXT,
        facebook TEXT,
        costo_spedizione NUMERIC(10,2) NOT NULL DEFAULT 0,
        spedizione_gratuita_da NUMERIC(10,2),
        valuta VARCHAR(10) NOT NULL DEFAULT 'EUR',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    return NextResponse.json({
      ok: true,
      message: "Tabella impostazioni_negozio creata correttamente",
    });
  } catch (error) {
    console.error("Errore init-db:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto durante la creazione della tabella",
      },
      {
        status: 500,
      }
    );
  }
}