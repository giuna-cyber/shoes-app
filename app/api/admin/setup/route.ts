import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await sql`
      SELECT COUNT(*) AS totale
      FROM utenti_admin
    `;

    const totale = Number(rows[0]?.totale ?? 0);

    return NextResponse.json({
      ok: true,
      setupDisponibile: totale === 0,
    });
  } catch (error) {
    console.error("Errore verifica setup admin:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore durante la verifica del setup",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rows = await sql`
      SELECT COUNT(*) AS totale
      FROM utenti_admin
    `;

    const totale = Number(rows[0]?.totale ?? 0);

    if (totale > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Setup già completato",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const nome =
      typeof body.nome === "string"
        ? body.nome.trim()
        : "";

    const cognome =
      typeof body.cognome === "string"
        ? body.cognome.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!nome || !email || !password) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nome, email e password sono obbligatori",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error: "La password deve contenere almeno 8 caratteri",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await sql`
      INSERT INTO utenti_admin (
        nome,
        cognome,
        email,
        password_hash,
        ruolo,
        attivo
      )
      VALUES (
        ${nome},
        ${cognome || null},
        ${email},
        ${passwordHash},
        'admin',
        TRUE
      )
      RETURNING
        id,
        nome,
        cognome,
        email,
        ruolo
    `;

    const admin = result[0];

    return NextResponse.json({
      ok: true,
      message: "Primo amministratore creato correttamente",
      admin: {
        id: Number(admin.id),
        nome: String(admin.nome),
        cognome:
          admin.cognome !== null
            ? String(admin.cognome)
            : null,
        email: String(admin.email),
        ruolo: String(admin.ruolo),
      },
    });
  } catch (error) {
    console.error("Errore setup admin:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore durante la creazione dell'amministratore",
      },
      { status: 500 }
    );
  }
}