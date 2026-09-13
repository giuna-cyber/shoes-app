import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "shoes_admin_session";

export type AdminSession = {
  id: number;
  nome: string;
  cognome: string | null;
  email: string;
  ruolo: string;
};

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET non configurata");
  }

  return new TextEncoder().encode(secret);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, getJwtSecret());

    if (
      typeof payload.id !== "number" ||
      typeof payload.nome !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.ruolo !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      nome: payload.nome,
      cognome:
        typeof payload.cognome === "string"
          ? payload.cognome
          : null,
      email: payload.email,
      ruolo: payload.ruolo,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
