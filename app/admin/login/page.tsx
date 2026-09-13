"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrore("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrore(data.error ?? "Accesso non riuscito");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setErrore("Impossibile comunicare con il server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div className="mb-8 text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              XCodeLab
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
              Shoes Admin
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3"
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
              className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white"
            >
              {loading ? "Accesso..." : "Accedi"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/admin/forgot-password"
              className="text-sm font-medium text-zinc-600 underline"
            >
              Password dimenticata?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
