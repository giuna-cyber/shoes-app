import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Shoes",
    template: "%s | Shoes",
  },
  description: "Catalogo, promozioni e acquisti del tuo negozio di scarpe.",
  applicationName: "Shoes",
  metadataBase: new URL("https://shoes.xcodelab.it"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
