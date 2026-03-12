import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import PublicShell from "./_components/PublicShell";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "IEPI — Instituto de Educação e Pesquisa Integrada",
  description:
    "Pós-graduações, especializações e cursos livres na área da saúde. COREN ativo. Presencial, híbrido e EAD em Natal-RN.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakarta.variable} ${cormorant.variable} font-sans antialiased relative`}>
        {/* Global CSS noise overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[9999]"
          style={{
            opacity: 0.05,
            mixBlendMode: "overlay",
          }}
        >
          <svg className="absolute inset-0 w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}