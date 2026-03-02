import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IEPI — Instituto de Educação e Pesquisa Integrada",
  description: "O melhor do ensino em saúde você encontra aqui. Cursos de Graduação, Pós-graduação e Livres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} min-h-screen flex flex-col`}
        style={{ backgroundColor: "var(--iepi-bg)" }}
      >

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50"
          style={{ backgroundColor: "var(--iepi-bg-deep)", borderBottom: "1px solid rgba(108,30,217,0.35)" }}
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-lg leading-none select-none"
                style={{ background: "var(--g-brand)" }}
              >
                +
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                IEP<span style={{ color: "var(--iepi-pink)" }}>I</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-7">
              {[
                { label: "Ensino",     href: "/cursos"    },
                { label: "Pesquisa",   href: "/sobre"     },
                { label: "Inovação",   href: "/sobre"     },
                { label: "Eventos",    href: "/#eventos"  },
                { label: "Biblioteca", href: "/#noticias" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="iepi-nav-link text-sm font-medium">
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2 rounded-full transition-all hover:scale-105 hover:brightness-110"
              style={{ background: "var(--g-brand)", boxShadow: "0 0 20px rgba(191,31,181,0.35)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span className="hidden sm:inline">Portal do Aluno</span>
              <span className="sm:hidden">Portal</span>
            </Link>
          </div>
        </header>

        {/* ── MAIN ────────────────────────────────────────────────────────── */}
        <main className="flex-1">{children}</main>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer
          className="pt-14 pb-8"
          style={{ backgroundColor: "var(--iepi-bg-deep)", borderTop: "1px solid rgba(108,30,217,0.35)" }}
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-lg" style={{ background: "var(--g-brand)" }}>+</div>
                  <span className="font-extrabold text-xl text-white">IEP<span style={{ color: "var(--iepi-pink)" }}>I</span></span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                  Instituto de Educação e Pesquisa Integrada. Transformando vidas através da educação qualificada, acessível e voltada para o mercado de saúde.
                </p>
                <div className="flex gap-3 mt-5">
                  {[["I","Instagram"],["F","Facebook"],["Y","YouTube"],["Li","LinkedIn"]].map(([abbr, label]) => (
                    <a key={label} href="#" aria-label={label} className="iepi-social">
                      <span className="text-white/75 text-xs font-bold leading-none">{abbr}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Ensino */}
              <div>
                <h4 className="text-white font-semibold mb-4">Ensino</h4>
                <ul className="space-y-2 text-sm">
                  {["Graduação","Pós-Graduação","Cursos Livres","Residência","Extensão","Estágios","Vagas Técnicas"].map(t => (
                    <li key={t}><a href="#" className="iepi-footer-link">{t}</a></li>
                  ))}
                </ul>
              </div>

              {/* Pesquisa */}
              <div>
                <h4 className="text-white font-semibold mb-4">Pesquisa</h4>
                <ul className="space-y-2 text-sm">
                  {["Campus","Comitês","Comitê de Ética","Pesquisa Clínica","PIBIC","Estatística","Mais..."].map(t => (
                    <li key={t}><a href="#" className="iepi-footer-link">{t}</a></li>
                  ))}
                </ul>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-white font-semibold mb-4">Fale Conosco</h4>
                <ul className="space-y-2 text-sm text-white/50">
                  <li>☎ (84) 4009-5108</li>
                  <li>☎ (84) 98416-2808</li>
                  <li className="pt-1 leading-relaxed">Av. Miguel Castro, 1355<br/>Natal-RN, 59082-000</li>
                </ul>
                <div className="mt-5">
                  <h4 className="text-white font-semibold mb-3">Redes Sociais</h4>
                  <ul className="space-y-1 text-sm">
                    {["@institutoiepi","@institutoiepi","@institutoiepi"].map((h,i) => (
                      <li key={i}><a href="#" className="iepi-footer-link-pink">{h}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(108,30,217,0.2)" }}>
              <p className="text-xs text-white/30">© {new Date().getFullYear()} IEPI — Instituto de Educação e Pesquisa Integrada. Todos os direitos reservados.</p>
              <div className="flex gap-4 text-xs">
                <a href="#" className="iepi-footer-link">Termos de Uso</a>
                <a href="#" className="iepi-footer-link">Privacidade</a>
                <a href="#" className="iepi-footer-link">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
