import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full border border-black/10 px-4 py-2 text-sm font-medium">
          XCodeLab · Shoes App
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Shoes
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-black/60 sm:text-lg">
          Catalogo, promozioni, ordini e acquisti per il tuo negozio di scarpe.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalogo"
            className="rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-85"
          >
            Vai al catalogo
          </Link>

          <Link
            href="/admin"
            className="rounded-2xl border border-black/15 px-6 py-3 font-semibold transition hover:bg-black/5"
          >
            Area Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
