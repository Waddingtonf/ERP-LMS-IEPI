import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import WhatsAppFloat from "./_components/WhatsAppFloat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IEPI — Instituto de Educação e Pesquisa Integrada",
  description: "Pós-graduações, especializações e cursos livres na área da saúde. COREN ativo. Presencial, híbrido e EAD em Natal-RN.",
};

const NAV_LINKS = [
  { label: "Cursos",        href: "/cursos"    },
  { label: "Sobre o IEPI",  href: "/sobre"     },
  { label: "Eventos",       href: "/#eventos"  },
  { label: "Contato",       href: "/contato"   },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} min-h-screen flex flex-col`}
        style={{ backgroundColor: "var(--iepi-light)", color: "var(--text-body)" }}
      >

        {/* ── TOP URGENCY BAR ─────────────────────── */}
        <div className="iepi-urgency-bar">
          🔥 <strong>Matrículas 2026.1 abertas</strong> — últimas vagas em Pós-Graduação.{" "}
          <a href="/cursos">Garantir minha vaga →</a>
        </div>

        {/* ── HEADER ──────────────────────────────── */}
        <header
          className="sticky top-0 z-50"
          style={{ backgroundColor: "var(--iepi-dark)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="container mx-auto px-6 flex items-center justify-between max-w-7xl"
            style={{ height: 64 }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="IEPI — página inicial">
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-black text-white text-base select-none leading-none"
                style={{ backgroundColor: "var(--iepi-orange-light)" }}
              >
                +
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-black text-white text-[17px] tracking-tight leading-none">IEPI</span>
                <span
                  className="text-[8.5px] font-semibold tracking-[0.14em] uppercase hidden sm:block"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Instituto de Educação e Pesquisa
                </span>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Navegação principal">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className="iepi-nav-link text-sm font-medium">
                  {label}
                </Link>
              ))}
            </nav>

            {/* Ações */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium iepi-nav-link"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Área do aluno
              </Link>
              <Link href="/cursos" className="iepi-header-cta">
                Matricular-se
              </Link>
            </div>
          </div>
        </header>

        {/* ── MAIN ────────────────────────────────── */}
        <main className="flex-1">{children}</main>

        {/* ── FOOTER ──────────────────────────────── */}
        <footer style={{ backgroundColor: "var(--iepi-dark)", borderTop: "3px solid var(--iepi-purple)" }}>
          <div className="container mx-auto px-6 max-w-7xl py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

              {/* Marca */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-sm"
                    style={{ backgroundColor: "var(--iepi-orange-light)" }}>+</div>
                  <div className="flex flex-col leading-none gap-0.5">
                    <span className="font-black text-white text-[17px] tracking-tight">IEPI</span>
                    <span className="text-[8.5px] font-semibold tracking-[0.14em] uppercase"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Instituto de Educação e Pesquisa</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-on-dark-muted)" }}>
                  Transformando vidas por meio da educação qualificada e voltada para o mercado de saúde no Nordeste há mais de 15 anos.
                </p>
                {/* WhatsApp link */}
                <a
                  href="https://wa.me/5584984162808"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold mb-4 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: "#25d366", color: "#fff" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.843L.057 23.428a.5.5 0 0 0 .616.616l5.628-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 0 1-5.034-1.377l-.361-.214-3.74.979.999-3.645-.235-.374A9.867 9.867 0 0 1 2.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                  </svg>
                  (84) 98416-2808
                </a>
                <div className="flex gap-2">
                  {[
                    { label: "Instagram", initial: "Ig" },
                    { label: "Facebook",  initial: "Fb" },
                    { label: "YouTube",   initial: "Yt" },
                    { label: "LinkedIn",  initial: "In" },
                  ].map(({ label, initial }) => (
                    <a key={label} href="#" aria-label={label} className="iepi-social" title={label}>
                      <span className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>{initial}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Cursos */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 pb-2.5"
                  style={{ borderBottom: "1px solid var(--border-dark)" }}>Cursos</h4>
                <ul className="space-y-2.5">
                  {["Graduação","Pós-Graduação","Especialização","Residência","Cursos Livres","Extensão"].map(t => (
                    <li key={t}><a href="/cursos" className="iepi-footer-link text-sm">{t}</a></li>
                  ))}
                </ul>
              </div>

              {/* Institucional */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 pb-2.5"
                  style={{ borderBottom: "1px solid var(--border-dark)" }}>Institucional</h4>
                <ul className="space-y-2.5">
                  {["Sobre o IEPI","Corpo Docente","Pesquisa","Estágios","Comitê de Ética","PIBIC"].map(t => (
                    <li key={t}><a href="/sobre" className="iepi-footer-link text-sm">{t}</a></li>
                  ))}
                </ul>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 pb-2.5"
                  style={{ borderBottom: "1px solid var(--border-dark)" }}>Fale Conosco</h4>
                <ul className="space-y-3 text-sm">
                  {[
                    { label: "Tel.",   value: "(84) 4009-5108 | (84) 98416-2808" },
                    { label: "End.",   value: "Av. Miguel Castro, 1355, Natal-RN" },
                  ].map(({ label, value }) => (
                    <li key={label} className="flex items-start gap-2" style={{ color: "var(--text-on-dark-muted)" }}>
                      <span className="shrink-0 mt-0.5 font-semibold" style={{ color: "var(--iepi-orange-light)" }}>{label}</span>
                      <span>{value}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 font-semibold" style={{ color: "var(--iepi-orange-light)" }}>E-mail</span>
                    <a href="mailto:atendimento@iepi.edu.br" className="iepi-footer-link-pink text-sm">
                      atendimento@iepi.edu.br
                    </a>
                  </li>
                  <li className="text-xs pt-1" style={{ color: "rgba(255,255,255,0.32)" }}>
                    Seg–Sex 08h–20h &nbsp;|&nbsp; Sáb 08h–14h
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Barra inferior */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="container mx-auto px-6 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
                {new Date().getFullYear()} © IEPI — Instituto de Educação e Pesquisa Integrada. Todos os direitos reservados.
              </p>
              <div className="flex gap-5 text-xs">
                <a href="#" className="iepi-footer-link">Termos de Uso</a>
                <a href="#" className="iepi-footer-link">Privacidade</a>
              </div>
            </div>
          </div>
        </footer>

        {/* WhatsApp float */}
        <WhatsAppFloat />

      </body>
    </html>
  );
}
