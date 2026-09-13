import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL non configurata. Collega il database Neon al progetto."
  );
}

export const sql = neon(databaseUrl);

export async function testDatabaseConnection() {
  try {
    const result = await sql`
      SELECT NOW() AS current_time
    `;

    return {
      ok: true,
      currentTime: result[0]?.current_time ?? null,
    };
  } catch (error) {
    console.error("Errore connessione database:", error);

    return {
      ok: false,
      currentTime: null,
      error:
        error instanceof Error
          ? error.message
          : "Errore sconosciuto durante la connessione al database",
    };
  }
}
