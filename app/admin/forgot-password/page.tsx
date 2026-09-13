"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errore, setErrore] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrore("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrore(data.error ?? "Richiesta non riuscita");
        return;
      }

      setMessage(data.message);
    } catch {
      setErrore("Impossibile comunicare con il server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-bold text-zinc-950">Password dimenticata</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Inserisci l'email amministratore.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
            {loading ? "Invio..." : "Invia link di recupero"}
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
