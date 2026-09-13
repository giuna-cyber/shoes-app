import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!token || !password) {
      return NextResponse.json(
        { ok: false, error: "Token e nuova password sono obbligatori" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "La password deve contenere almeno 8 caratteri" },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const rows = await sql`
      SELECT id, admin_id
      FROM admin_password_reset
      WHERE token_hash = ${tokenHash}
        AND used = FALSE
        AND expires_at > NOW()
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Link non valido o scaduto" },
        { status: 400 }
      );
    }

    const reset = rows[0];
    const passwordHash = await bcrypt.hash(password, 12);

    await sql`
      UPDATE utenti_admin
      SET
        password_hash = ${passwordHash},
        updated_at = NOW()
      WHERE id = ${Number(reset.admin_id)}
    `;

    await sql`
      UPDATE admin_password_reset
      SET used = TRUE
      WHERE id = ${Number(reset.id)}
    `;

    return NextResponse.json({
      ok: true,
      message: "Password aggiornata correttamente",
    });
  } catch (error) {
    console.error("Errore reset password:", error);

    return NextResponse.json(
      { ok: false, error: "Errore durante il reset della password" },
      { status: 500 }
    );
  }
}
