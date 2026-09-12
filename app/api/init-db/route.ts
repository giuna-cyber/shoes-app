import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // =========================================================
    // IMPOSTAZIONI NEGOZIO
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS impostazioni_negozio (
        id BIGSERIAL PRIMARY KEY,

        nome_negozio VARCHAR(150) NOT NULL DEFAULT 'Shoes',
        logo_url TEXT,
        favicon_url TEXT,

        colore_primario VARCHAR(20) NOT NULL DEFAULT '#111111',
        colore_secondario VARCHAR(20) NOT NULL DEFAULT '#ffffff',
        colore_sfondo VARCHAR(20) NOT NULL DEFAULT '#ffffff',
        colore_testo VARCHAR(20) NOT NULL DEFAULT '#111111',

        email VARCHAR(190),
        telefono VARCHAR(50),

        indirizzo VARCHAR(255),
        citta VARCHAR(120),
        cap VARCHAR(20),
        provincia VARCHAR(10),
        nazione VARCHAR(80) DEFAULT 'Italia',

        sito_web TEXT,
        instagram TEXT,
        facebook TEXT,

        costo_spedizione NUMERIC(10,2) NOT NULL DEFAULT 0,
        spedizione_gratuita_da NUMERIC(10,2),

        valuta VARCHAR(10) NOT NULL DEFAULT 'EUR',

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // CATEGORIE
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS categorie (
        id BIGSERIAL PRIMARY KEY,

        nome VARCHAR(120) NOT NULL,
        slug VARCHAR(150) NOT NULL UNIQUE,

        descrizione TEXT,

        attiva BOOLEAN NOT NULL DEFAULT TRUE,
        ordinamento INTEGER NOT NULL DEFAULT 0,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // MARCHE
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS marche (
        id BIGSERIAL PRIMARY KEY,

        nome VARCHAR(120) NOT NULL,
        slug VARCHAR(150) NOT NULL UNIQUE,

        logo_url TEXT,

        attiva BOOLEAN NOT NULL DEFAULT TRUE,
        ordinamento INTEGER NOT NULL DEFAULT 0,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // COLORI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS colori (
        id BIGSERIAL PRIMARY KEY,

        nome VARCHAR(100) NOT NULL UNIQUE,
        codice_hex VARCHAR(20),

        attivo BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // TAGLIE
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS taglie (
        id BIGSERIAL PRIMARY KEY,

        valore VARCHAR(20) NOT NULL UNIQUE,
        ordinamento INTEGER NOT NULL DEFAULT 0,

        attiva BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // ARTICOLI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS articoli (
        id BIGSERIAL PRIMARY KEY,

        marca_id BIGINT REFERENCES marche(id) ON DELETE SET NULL,
        categoria_id BIGINT REFERENCES categorie(id) ON DELETE SET NULL,

        modello VARCHAR(180) NOT NULL,
        slug VARCHAR(220) NOT NULL UNIQUE,

        genere VARCHAR(30) NOT NULL,

        descrizione TEXT,
        descrizione_breve TEXT,

        prezzo NUMERIC(10,2) NOT NULL DEFAULT 0,
        prezzo_promozionale NUMERIC(10,2),

        codice VARCHAR(100),
        sku_base VARCHAR(100),

        attiva BOOLEAN NOT NULL DEFAULT TRUE,
        in_evidenza BOOLEAN NOT NULL DEFAULT FALSE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_articoli_marca
      ON articoli(marca_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_articoli_categoria
      ON articoli(categoria_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_articoli_genere
      ON articoli(genere)
    `;

    // =========================================================
    // VARIANTI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS varianti (
        id BIGSERIAL PRIMARY KEY,

        articolo_id BIGINT NOT NULL
          REFERENCES articoli(id)
          ON DELETE CASCADE,

        taglia_id BIGINT
          REFERENCES taglie(id)
          ON DELETE SET NULL,

        colore_id BIGINT
          REFERENCES colori(id)
          ON DELETE SET NULL,

        sku VARCHAR(120) NOT NULL UNIQUE,

        quantita_disponibile INTEGER NOT NULL DEFAULT 0
          CHECK (quantita_disponibile >= 0),

        prezzo NUMERIC(10,2),
        prezzo_promozionale NUMERIC(10,2),

        attiva BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        UNIQUE (articolo_id, taglia_id, colore_id)
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_varianti_articolo
      ON varianti(articolo_id)
    `;

    // =========================================================
    // IMMAGINI ARTICOLI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS immagini_articoli (
        id BIGSERIAL PRIMARY KEY,

        articolo_id BIGINT NOT NULL
          REFERENCES articoli(id)
          ON DELETE CASCADE,

        url TEXT NOT NULL,
        alt VARCHAR(255),

        principale BOOLEAN NOT NULL DEFAULT FALSE,
        ordinamento INTEGER NOT NULL DEFAULT 0,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_immagini_articolo
      ON immagini_articoli(articolo_id)
    `;

    // =========================================================
    // CLIENTI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS clienti (
        id BIGSERIAL PRIMARY KEY,

        nome VARCHAR(120) NOT NULL,
        cognome VARCHAR(120) NOT NULL,

        email VARCHAR(190) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,

        telefono VARCHAR(50),
        data_nascita DATE,

        indirizzo VARCHAR(255),
        civico VARCHAR(30),
        cap VARCHAR(20),
        citta VARCHAR(120),
        provincia VARCHAR(10),
        nazione VARCHAR(80) DEFAULT 'Italia',

        attivo BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // INDIRIZZI CLIENTI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS indirizzi_clienti (
        id BIGSERIAL PRIMARY KEY,

        cliente_id BIGINT NOT NULL
          REFERENCES clienti(id)
          ON DELETE CASCADE,

        nome VARCHAR(120),
        cognome VARCHAR(120),

        indirizzo VARCHAR(255) NOT NULL,
        civico VARCHAR(30),

        cap VARCHAR(20) NOT NULL,
        citta VARCHAR(120) NOT NULL,
        provincia VARCHAR(10),
        nazione VARCHAR(80) NOT NULL DEFAULT 'Italia',

        telefono VARCHAR(50),

        predefinito BOOLEAN NOT NULL DEFAULT FALSE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_indirizzi_clienti_cliente
      ON indirizzi_clienti(cliente_id)
    `;

    // =========================================================
    // PROMOZIONI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS promozioni (
        id BIGSERIAL PRIMARY KEY,

        titolo VARCHAR(180) NOT NULL,
        descrizione TEXT,

        tipo VARCHAR(30) NOT NULL
          CHECK (tipo IN ('percentuale', 'prezzo_fisso')),

        valore NUMERIC(10,2) NOT NULL,

        data_inizio TIMESTAMPTZ,
        data_fine TIMESTAMPTZ,

        attiva BOOLEAN NOT NULL DEFAULT TRUE,

        immagine_url TEXT,

        articolo_id BIGINT
          REFERENCES articoli(id)
          ON DELETE CASCADE,

        categoria_id BIGINT
          REFERENCES categorie(id)
          ON DELETE CASCADE,

        marca_id BIGINT
          REFERENCES marche(id)
          ON DELETE CASCADE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // UTENTI ADMIN
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS utenti_admin (
        id BIGSERIAL PRIMARY KEY,

        nome VARCHAR(120) NOT NULL,
        cognome VARCHAR(120),

        email VARCHAR(190) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,

        ruolo VARCHAR(30) NOT NULL DEFAULT 'admin'
          CHECK (ruolo IN ('admin', 'operatore')),

        attivo BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // ORDINI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS ordini (
        id BIGSERIAL PRIMARY KEY,

        numero_ordine VARCHAR(50) NOT NULL UNIQUE,

        cliente_id BIGINT NOT NULL
          REFERENCES clienti(id)
          ON DELETE RESTRICT,

        stato VARCHAR(40) NOT NULL DEFAULT 'nuovo'
          CHECK (
            stato IN (
              'nuovo',
              'confermato',
              'in_preparazione',
              'spedito',
              'consegnato',
              'annullato'
            )
          ),

        totale_articoli NUMERIC(10,2) NOT NULL DEFAULT 0,
        costo_spedizione NUMERIC(10,2) NOT NULL DEFAULT 0,
        sconto NUMERIC(10,2) NOT NULL DEFAULT 0,
        totale NUMERIC(10,2) NOT NULL DEFAULT 0,

        metodo_pagamento VARCHAR(80),
        stato_pagamento VARCHAR(50),

        nome_spedizione VARCHAR(120) NOT NULL,
        cognome_spedizione VARCHAR(120) NOT NULL,

        indirizzo_spedizione VARCHAR(255) NOT NULL,
        civico_spedizione VARCHAR(30),

        cap_spedizione VARCHAR(20) NOT NULL,
        citta_spedizione VARCHAR(120) NOT NULL,
        provincia_spedizione VARCHAR(10),
        nazione_spedizione VARCHAR(80) NOT NULL DEFAULT 'Italia',

        telefono_spedizione VARCHAR(50),

        note_cliente TEXT,
        note_admin TEXT,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_ordini_cliente
      ON ordini(cliente_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_ordini_stato
      ON ordini(stato)
    `;

    // =========================================================
    // RIGHE ORDINI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS righe_ordini (
        id BIGSERIAL PRIMARY KEY,

        ordine_id BIGINT NOT NULL
          REFERENCES ordini(id)
          ON DELETE CASCADE,

        articolo_id BIGINT
          REFERENCES articoli(id)
          ON DELETE SET NULL,

        variante_id BIGINT
          REFERENCES varianti(id)
          ON DELETE SET NULL,

        marca VARCHAR(120) NOT NULL,
        modello VARCHAR(180) NOT NULL,

        taglia VARCHAR(20),
        colore VARCHAR(100),

        sku VARCHAR(120),

        quantita INTEGER NOT NULL DEFAULT 1
          CHECK (quantita > 0),

        prezzo_unitario NUMERIC(10,2) NOT NULL,
        totale_riga NUMERIC(10,2) NOT NULL,

        immagine TEXT,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_righe_ordini_ordine
      ON righe_ordini(ordine_id)
    `;

    // =========================================================
    // SPEDIZIONI
    // =========================================================

    await sql`
      CREATE TABLE IF NOT EXISTS spedizioni (
        id BIGSERIAL PRIMARY KEY,

        ordine_id BIGINT NOT NULL UNIQUE
          REFERENCES ordini(id)
          ON DELETE CASCADE,

        stato VARCHAR(40) NOT NULL DEFAULT 'da_preparare'
          CHECK (
            stato IN (
              'da_preparare',
              'preparato',
              'affidato_corriere',
              'in_transito',
              'consegnato'
            )
          ),

        corriere VARCHAR(120),
        tracking VARCHAR(180),

        data_spedizione TIMESTAMPTZ,
        data_consegna TIMESTAMPTZ,

        note TEXT,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // =========================================================
    // DATI INIZIALI - IMPOSTAZIONI
    // =========================================================

    await sql`
      INSERT INTO impostazioni_negozio (
        nome_negozio,
        colore_primario,
        colore_secondario,
        colore_sfondo,
        colore_testo,
        valuta
      )
      SELECT
        'Shoes',
        '#111111',
        '#ffffff',
        '#ffffff',
        '#111111',
        'EUR'
      WHERE NOT EXISTS (
        SELECT 1
        FROM impostazioni_negozio
      )
    `;

    // =========================================================
    // DATI INIZIALI - CATEGORIE
    // =========================================================

    await sql`
      INSERT INTO categorie (
        nome,
        slug,
        ordinamento
      )
      VALUES
        ('Sneakers', 'sneakers', 10),
        ('Running', 'running', 20),
        ('Eleganti', 'eleganti', 30),
        ('Casual', 'casual', 40),
        ('Sandali', 'sandali', 50),
        ('Stivali', 'stivali', 60)
      ON CONFLICT (slug) DO NOTHING
    `;

    // =========================================================
    // DATI INIZIALI - COLORI
    // =========================================================

    await sql`
      INSERT INTO colori (
        nome,
        codice_hex
      )
      VALUES
        ('Nero', '#000000'),
        ('Bianco', '#FFFFFF'),
        ('Grigio', '#808080'),
        ('Blu', '#0000FF'),
        ('Rosso', '#FF0000'),
        ('Verde', '#008000'),
        ('Beige', '#F5F5DC'),
        ('Marrone', '#8B4513')
      ON CONFLICT (nome) DO NOTHING
    `;

    // =========================================================
    // DATI INIZIALI - TAGLIE
    // =========================================================

    await sql`
      INSERT INTO taglie (
        valore,
        ordinamento
      )
      VALUES
        ('35', 350),
        ('36', 360),
        ('36.5', 365),
        ('37', 370),
        ('37.5', 375),
        ('38', 380),
        ('38.5', 385),
        ('39', 390),
        ('39.5', 395),
        ('40', 400),
        ('40.5', 405),
        ('41', 410),
        ('41.5', 415),
        ('42', 420),
        ('42.5', 425),
        ('43', 430),
        ('43.5', 435),
        ('44', 440),
        ('44.5', 445),
        ('45', 450),
        ('45.5', 455),
        ('46', 460),
        ('47', 470),
        ('48', 480)
      ON CONFLICT (valore) DO NOTHING
    `;

    return NextResponse.json({
      ok: true,
      message: "Database Shoes inizializzato correttamente",
      tables: [
        "impostazioni_negozio",
        "categorie",
        "marche",
        "colori",
        "taglie",
        "articoli",
        "varianti",
        "immagini_articoli",
        "clienti",
        "indirizzi_clienti",
        "promozioni",
        "utenti_admin",
        "ordini",
        "righe_ordini",
        "spedizioni",
      ],
    });
  } catch (error) {
    console.error("Errore init-db:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto durante l'inizializzazione del database",
      },
      {
        status: 500,
      }
    );
  }
}