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
          <a
            href="/catalogo"
            className="rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:opacity-85"
          >
            Vai al catalogo
          </a>

          <a
            href="/admin"
            className="rounded-2xl border border-black/15 px-6 py-3 font-semibold transition hover:bg-black/5"
          >
            Area Admin
          </a>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/10 p-6">
            <h2 className="text-lg font-semibold">Catalogo</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Marche, modelli, taglie, colori e disponibilità per variante.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 p-6">
            <h2 className="text-lg font-semibold">Ordini</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Acquisti, spedizioni, stato ordine e storico cliente.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 p-6">
            <h2 className="text-lg font-semibold">White-label</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Logo, colori e impostazioni personalizzabili per ogni negozio.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}