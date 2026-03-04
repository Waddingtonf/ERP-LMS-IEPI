import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicShell from "./_components/PublicShell";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}