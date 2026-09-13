import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { sql } from "@/lib/db";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET non configurata");
  }

  return new TextEncoder().encode(secret);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email e password sono obbligatorie" },
        { status: 400 }
      );
    }

    const rows = await sql`
      SELECT
        id,
        nome,
        cognome,
        email,
        password_hash,
        ruolo,
        attivo
      FROM utenti_admin
      WHERE LOWER(email) = ${email}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Credenziali non valide" },
        { status: 401 }
      );
    }

    const admin = rows[0];

    if (!admin.attivo) {
      return NextResponse.json(
        { ok: false, error: "Utente amministratore disabilitato" },
        { status: 403 }
      );
    }

    const passwordValida = await bcrypt.compare(
      password,
      String(admin.password_hash)
    );

    if (!passwordValida) {
      return NextResponse.json(
        { ok: false, error: "Credenziali non valide" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      id: Number(admin.id),
      nome: String(admin.nome),
      cognome: admin.cognome !== null ? String(admin.cognome) : null,
      email: String(admin.email),
      ruolo: String(admin.ruolo),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(getJwtSecret());

    const response = NextResponse.json({
      ok: true,
      admin: {
        id: Number(admin.id),
        nome: String(admin.nome),
        cognome: admin.cognome !== null ? String(admin.cognome) : null,
        email: String(admin.email),
        ruolo: String(admin.ruolo),
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Errore login admin:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore durante il login",
      },
      { status: 500 }
    );
  }
}
