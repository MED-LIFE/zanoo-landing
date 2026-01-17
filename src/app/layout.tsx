import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zanoo | Inteligencia Sanitaria para Centros de Salud",
  description: "Orden operativo, historia clínica y gestión de pacientes para el sistema de salud público. Reduce esperas y ausentismo. Gratis para salitas.",
  openGraph: {
    title: "Zanoo | Inteligencia Sanitaria",
    description: "Ordená la atención de tu centro de salud. Gratis para salitas.",
    url: "https://zanoo.com.ar", // Placeholder URL, best practice
    siteName: "Zanoo",
    images: [
      {
        url: "/shots/inicio-paciente.png", // Using an existing attractive shot
        width: 1200,
        height: 630,
        alt: "Zanoo App Preview",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased text-white accent-blue-500 selection:bg-blue-500/30 selection:text-blue-200 bg-white`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
