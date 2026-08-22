import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plaquisto Admin — Référentiel métier",
  description: "Administration des règles techniques et quantitatifs Plaquisto.",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="fr"><body>{children}</body></html>;
}
