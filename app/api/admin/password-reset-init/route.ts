import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await requireAdmin();

    await sql`
      CREATE TABLE IF NOT EXISTS admin_password_reset (
        id BIGSERIAL PRIMARY KEY,

        admin_id BIGINT NOT NULL
          REFERENCES utenti_admin(id)
          ON DELETE CASCADE,

        token_hash TEXT NOT NULL UNIQUE,

        expires_at TIMESTAMPTZ NOT NULL,

        used BOOLEAN NOT NULL DEFAULT FALSE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_admin_password_reset_admin
      ON admin_password_reset(admin_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_admin_password_reset_expires
      ON admin_password_reset(expires_at)
    `;

    return NextResponse.json({
      ok: true,
      message: "Tabella recupero password creata correttamente",
    });
  } catch (error) {
    console.error("Errore creazione password reset:", error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Accesso non autorizzato",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore durante la creazione della tabella",
      },
      {
        status: 500,
      }
    );
  }
}