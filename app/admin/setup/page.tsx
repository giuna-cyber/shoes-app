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
      } catch (error) {
        console.error("Errore verifica setup:", error);
        setErrore("Impossibile verificare lo stato del setup");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cognome,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrore(data.error ?? "Impossibile creare l'amministratore");
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Errore creazione admin:", error);
      setErrore("Impossibile comunicare con il server");
    } finally {
      setLoading(false);
    }
  }

  if (loadingCheck) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100">
        <div className="text-sm text-zinc-500">
          Verifica configurazione...
        </div>
      </main>
    );
  }

  if (!setupDisponibile) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div className="mb-8 text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              XCodeLab
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
              Configurazione Admin
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Crea il primo amministratore della Shoes App.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Nome
                </label>

                <input
                  id="nome"
                  type="text"
                  required
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                />
              </div>

              <div>
                <label
                  htmlFor="cognome"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Cognome
                </label>

                <input
                  id="cognome"
                  type="text"
                  value={cognome}
                  onChange={(event) => setCognome(event.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
            </div>

            <div>
              <label
                htmlFor="password2"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Ripeti password
              </label>

              <input
                id="password2"
                type="password"
                required
                autoComplete="new-password"
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
            </div>

            {errore && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errore}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creazione..." : "Crea amministratore"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}