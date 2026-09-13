import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { Resend } from "resend";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const genericResponse = NextResponse.json({
      ok: true,
      message:
        "Se l'indirizzo è associato a un amministratore, riceverai un'email con le istruzioni.",
    });

    if (!email) {
      return genericResponse;
    }

    const admins = await sql`
      SELECT id, email, nome
      FROM utenti_admin
      WHERE LOWER(email) = ${email}
        AND attivo = TRUE
      LIMIT 1
    `;

    if (admins.length === 0) {
      return genericResponse;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const mailFrom = process.env.MAIL_FROM;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://shoes.xcodelab.it";

    if (!resendApiKey || !mailFrom) {
      throw new Error("Servizio email non configurato");
    }

    const admin = admins[0];
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    await sql`
      UPDATE admin_password_reset
      SET used = TRUE
      WHERE admin_id = ${Number(admin.id)}
        AND used = FALSE
    `;

    await sql`
      INSERT INTO admin_password_reset (
        admin_id,
        token_hash,
        expires_at,
        used
      )
      VALUES (
        ${Number(admin.id)},
        ${tokenHash},
        NOW() + INTERVAL '30 minutes',
        FALSE
      )
    `;

    const resetUrl =
      `${appUrl}/admin/reset-password?token=${encodeURIComponent(token)}`;

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: mailFrom,
      to: String(admin.email),
      subject: "Recupero password Shoes Admin",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Recupero password Shoes Admin</h2>
          <p>Ciao ${String(admin.nome)},</p>
          <p>hai richiesto di impostare una nuova password.</p>
          <p>
            <a href="${resetUrl}">
              Imposta una nuova password
            </a>
          </p>
          <p>Il link scade tra 30 minuti e può essere usato una sola volta.</p>
          <p>Se non hai richiesto il reset, ignora questa email.</p>
        </div>
      `,
    });

    return genericResponse;
  } catch (error) {
    console.error("Errore forgot password:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Impossibile completare la richiesta in questo momento",
      },
      { status: 500 }
    );
  }
}
