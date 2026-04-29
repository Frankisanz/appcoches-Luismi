import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Vehículos Premium | Automóviles Luismi",
  description: "Descubre nuestra selección exclusiva de vehículos de importación. BMW, Audi, Mercedes y Porsche con entrega inmediata, garantía oficial y el mejor precio del mercado.",
  openGraph: {
    title: "Catálogo de Vehículos Premium | Automóviles Luismi",
    description: "Coches de importación alemana garantizados. Descubre tu próximo vehículo exclusivo en Automóviles Luismi.",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function VehiculosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
