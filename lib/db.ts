import { sql } from "@vercel/postgres";

export { sql };

export async function testDatabaseConnection() {
  try {
    const result = await sql`
      SELECT NOW() AS current_time
    `;

    return {
      ok: true,
      currentTime: result.rows[0]?.current_time ?? null,
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