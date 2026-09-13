import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shoes",
    short_name: "Shoes",
    description: "Catalogo e acquisti del tuo negozio di scarpe",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    lang: "it",
  };
}
