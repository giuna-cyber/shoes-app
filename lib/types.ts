export type GenereScarpa =
  | "uomo"
  | "donna"
  | "unisex"
  | "bambino"
  | "bambina";

export type StatoOrdine =
  | "nuovo"
  | "confermato"
  | "in_preparazione"
  | "spedito"
  | "consegnato"
  | "annullato";

export type StatoSpedizione =
  | "da_preparare"
  | "preparato"
  | "affidato_corriere"
  | "in_transito"
  | "consegnato";

export interface VarianteScarpa {
  id: number;
  articolo_id: number;
  sku: string;
  taglia: string;
  colore: string;
  quantita_disponibile: number;
  prezzo?: number | null;
  prezzo_promozionale?: number | null;
  attiva: boolean;
}

export interface Scarpa {
  id: number;
  marca_id?: number | null;
  categoria_id?: number | null;
  marca: string;
  modello: string;
  slug: string;
  categoria: string;
  genere: GenereScarpa;
  descrizione?: string | null;
  descrizione_breve?: string | null;
  prezzo: number;
  prezzo_promozionale?: number | null;
  codice?: string | null;
  sku_base?: string | null;
  attiva: boolean;
  in_evidenza?: boolean;
  immagine_principale?: string | null;
  varianti?: VarianteScarpa[];
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
  error?: string;
}
