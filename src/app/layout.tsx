import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IEPI  Instituto de Educação e Pesquisa Integrada",
  description: "Cursos de Graduação, Pós-graduação e Livres na área da saúde. O melhor ensino em saúde você encontra no IEPI.",
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

        {/* HEADER */}
        <header
          className="sticky top-0 z-50"
          style={{ backgroundColor: "var(--iepi-bg-deep)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl" style={{ height: 68 }}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-base leading-none select-none"
                style={{ backgroundColor: "var(--iepi-orange)" }}
              >
                +
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-black text-white text-lg tracking-tight leading-none">IEPI</span>
                <span className="text-[9px] font-medium tracking-widest uppercase hidden sm:block" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Instituto de Educação e Pesquisa
                </span>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {[
                { label: "Cursos",   href: "/cursos"    },
                { label: "Sobre",    href: "/sobre"     },
                { label: "Pesquisa", href: "/sobre"     },
                { label: "Eventos",  href: "/#eventos"  },
                { label: "Noticias", href: "/#noticias" },
                { label: "Contato",  href: "/contato"   },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="iepi-nav-link text-sm font-medium">
                  {label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium transition-colors iepi-nav-link"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Area do aluno
              </Link>
              <Link
                href="/cursos"
                className="inline-flex items-center text-sm font-bold text-white px-5 py-2.5 rounded transition-colors"
                style={{ backgroundColor: "var(--iepi-orange)" }}
              >
                Inscreva-se
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1">{children}</main>

        {/* FOOTER */}
        <footer style={{ backgroundColor: "var(--iepi-bg-deep)", borderTop: "3px solid var(--iepi-purple)" }}>
          <div className="container mx-auto px-6 max-w-7xl py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

              {/* Brand */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-base" style={{ backgroundColor: "var(--iepi-orange)" }}>+</div>
                  <div className="flex flex-col leading-none gap-0.5">
                    <span className="font-black text-white text-lg tracking-tight">IEPI</span>
                    <span className="text-[9px] font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Instituto de Educacao e Pesquisa</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.42)" }}>
                  Transformando vidas por meio da educacao qualificada e voltada para o mercado de saude no Nordeste ha mais de 15 anos.
                </p>
                <div className="flex gap-2">
                  {["Instagram","Facebook","YouTube","LinkedIn"].map((label) => (
                    <a key={label} href="#" aria-label={label} className="iepi-social" title={label}>
                      <span className="text-white/55 text-[10px] font-bold">{label[0]}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Cursos */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 pb-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Cursos</h4>
                <ul className="space-y-2.5">
                  {["Graduação","Pos-Graduação","Especializacao","Residencia","Cursos Livres","Extensao"].map(t => (
                    <li key={t}><a href="/cursos" className="iepi-footer-link text-sm">{t}</a></li>
                  ))}
                </ul>
              </div>

              {/* Institucional */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 pb-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Institucional</h4>
                <ul className="space-y-2.5">
                  {["Sobre o IEPI","Corpo Docente","Pesquisa","Estagios","Comite de Etica","PIBIC"].map(t => (
                    <li key={t}><a href="/sobre" className="iepi-footer-link text-sm">{t}</a></li>
                  ))}
                </ul>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 pb-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Fale Conosco</h4>
                <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 mt-0.5" style={{ color: "var(--iepi-orange)" }}>Tel.</span>
                    <span>(84) 4009-5108 | (84) 98416-2808</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 mt-0.5" style={{ color: "var(--iepi-orange)" }}>E-mail</span>
                    <a href="mailto:atendimento@iepi.edu.br" className="iepi-footer-link-pink">atendimento@iepi.edu.br</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 mt-0.5" style={{ color: "var(--iepi-orange)" }}>End.</span>
                    <span>Av. Miguel Castro, 1355, Natal-RN</span>
                  </li>
                  <li className="text-xs pt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                    Seg-Sex 08h-20h | Sab 08h-14h
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="container mx-auto px-6 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
                {` ${new Date().getFullYear()} IEPI  Instituto de Educação e Pesquisa Integrada. Todos os direitos reservados.`}
              </p>
              <div className="flex gap-5 text-xs">
                <a href="#" className="iepi-footer-link">Termos de Uso</a>
                <a href="#" className="iepi-footer-link">Privacidade</a>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}