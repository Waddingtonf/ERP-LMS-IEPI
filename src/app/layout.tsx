import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cursos e Capacitação | IEPI",
  description: "Plataforma de cursos livres e capacitação profissional pelo IEPI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-slate-50 flex flex-col`}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-2xl text-violet-700 tracking-tight">IEPI</div>
            <nav className="hidden md:flex gap-6">
              <a href="/cursos" className="text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors">Cursos</a>
              <a href="/sobre" className="text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors">Sobre</a>
              <a href="/contato" className="text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors">Contato</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="/login" className="text-sm font-medium text-violet-700 hover:text-violet-800 transition-colors hidden sm:block">Entrar</a>
              <a href="/aluno" className="text-sm font-medium bg-violet-700 text-white px-4 py-2 rounded-full hover:bg-violet-800 transition-colors">
                Portal do Aluno
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-2xl text-white mb-4">IEPI</div>
              <p className="text-sm text-slate-400">
                Instituto de Educação e Pesquisa. Transformando vidas através da educação qualificada e acessível.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dúvidas Frequentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Cursos</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Graduação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pós-Graduação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cursos Livres</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>contato@iepi.edu.br</li>
                <li>(11) 99999-9999</li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
            &copy; {new Date().getFullYear()} IEPI. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
