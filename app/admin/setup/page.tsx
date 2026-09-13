"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const router = useRouter();
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [setupDisponibile, setSetupDisponibile] = useState(false);
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    async function verificaSetup() {
      try {
        const response = await fetch("/api/admin/setup", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          setErrore(data.error ?? "Errore durante la verifica del setup");
          return;
        }

        if (!data.setupDisponibile) {
          router.replace("/admin/login");
          return;
        }

        setSetupDisponibile(true);
      } finally {
        setLoadingCheck(false);
      }
    }

    verificaSetup();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrore("");

    if (password.length < 8) {
      setErrore("La password deve contenere almeno 8 caratteri");
      return;
    }

    if (password !== password2) {
      setErrore("Le due password non coincidono");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cognome, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrore(data.error ?? "Impossibile creare l'amministratore");
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (loadingCheck) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100">
        <div className="text-sm text-zinc-500">Verifica configurazione...</div>
      </main>
    );
  }

  if (!setupDisponibile) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-bold text-zinc-950">
          Configurazione Admin
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            placeholder="Nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <input
            placeholder="Cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <input
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <input
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <input
            placeholder="Ripeti password"
            type="password"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />

          {errore && <div className="text-sm text-red-700">{errore}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white"
          >
            {loading ? "Creazione..." : "Crea amministratore"}
          </button>
        </form>
      </div>
    </main>
  );
}
