"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errore, setErrore] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrore("");
    setMessage("");

    if (!token) {
      setErrore("Token mancante");
      return;
    }

    if (password.length < 8) {
      setErrore("La password deve contenere almeno 8 caratteri");
      return;
    }

    if (password !== password2) {
      setErrore("Le password non coincidono");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrore(data.error ?? "Reset non riuscito");
        return;
      }

      setMessage("Password aggiornata. Ora puoi accedere.");
    } catch {
      setErrore("Impossibile comunicare con il server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-bold text-zinc-950">Nuova password</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nuova password"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <input
            type="password"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Ripeti nuova password"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />

          {message && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {errore && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errore}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white"
          >
            {loading ? "Salvataggio..." : "Salva nuova password"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/admin/login" className="text-sm underline">
            Torna al login
          </Link>
        </div>
      </div>
    </main>
  );
}
