import { NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await testDatabaseConnection();

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error ?? "Connessione al database non riuscita",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Connessione a shoes-db riuscita",
    databaseTime: result.currentTime,
  });
}