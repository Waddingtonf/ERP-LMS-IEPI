import Link from "next/link"

/* ── Mock data ───────────────────────────────────────────────────────────── */
const courses = [
  { id: "1", title: "Tecnolog. em Gestão Pública", type: "Pós-Grad.", hours: "360h", start: "02/10/2025", end: "10/12/2025", modality: "EaD / Presencial", instructor: "Técnico de Enfermagem" },
  { id: "2", title: "Tecnolog. em Gestão Pública", type: "Pós-Grad.", hours: "360h", start: "02/10/2025", end: "10/12/2025", modality: "EaD / Presencial", instructor: "Técnico de Enfermagem" },
  { id: "3", title: "Tecnolog. em Gestão Pública", type: "Pós-Grad.", hours: "360h", start: "02/10/2025", end: "10/12/2025", modality: "EaD / Presencial", instructor: "Técnico de Enfermagem" },
  { id: "4", title: "Tecnolog. em Gestão Pública", type: "Pós-Grad.", hours: "360h", start: "02/10/2025", end: "10/12/2025", modality: "EaD / Presencial", instructor: "Técnico de Enfermagem" },
  { id: "5", title: "Tecnolog. em Gestão Pública", type: "Pós-Grad.", hours: "360h", start: "02/10/2025", end: "10/12/2025", modality: "EaD / Presencial", instructor: "Técnico de Enfermagem" },
]

const news = [
  { id: "1", title: "Título", date: "01/03/2026", summary: "Lorem ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido..." },
  { id: "2", title: "Título", date: "01/03/2026", summary: "Lorem ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido..." },
  { id: "3", title: "Título", date: "01/03/2026", summary: "Lorem ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido..." },
  { id: "4", title: "Título", date: "01/03/2026", summary: "Lorem ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido..." },
  { id: "5", title: "Título", date: "01/03/2026", summary: "Lorem ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido..." },
  { id: "6", title: "Título", date: "01/03/2026", summary: "Lorem ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido..." },
]

const testimonials = [
  { name: "Nome", course: "Aluna do Curso", text: "Depoimento XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXX", img: "" },
  { name: "Nome", course: "Aluna do Curso", text: "Depoimento XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXX", img: "" },
  { name: "Nome", course: "Aluna do Curso", text: "Depoimento XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXX", img: "" },
]

/* ── Icons ───────────────────────────────────────────────────────────────── */
function IconClock() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  )
}
function IconBook() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ═══════════════════════════════════ HERO ════════════════════════════ */}
      <section
        className="relative overflow-hidden py-20 lg:py-32"
        style={{ background: "var(--g-hero)" }}
      >
        {/* grid dots overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #BF1FB5 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* top glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6C1ED9, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #049DBF, transparent)" }} />

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — copy */}
            <div>
              {/* badge */}
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: "rgba(4,157,191,0.15)", border: "1px solid rgba(4,157,191,0.4)", color: "#049DBF" }}>
                ✦ 15 anos formando líderes em saúde
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
                O MELHOR DO ENSINO EM SAÚDE{" "}
                <span className="iepi-text-gradient">VOCÊ ENCONTRA AQUI!</span>
              </h1>
              <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                Venha viver através do corpo docente que sabe o que faz! O melhor campo prático do
                estado do Rio Grande do Norte e abertura para as melhores oportunidades de mercado.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[["12k+","Alunos formados"],["98%","Satisfação"],["200+","Docentes"]].map(([v,l]) => (
                  <div key={l} className="text-center p-3 rounded-xl" style={{ background: "rgba(108,30,217,0.2)", border: "1px solid rgba(108,30,217,0.3)" }}>
                    <p className="text-xl font-extrabold iepi-text-gradient">{v}</p>
                    <p className="text-white/50 text-[11px] mt-0.5">{l}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/cursos"
                  className="px-7 py-3 text-white font-bold rounded-lg transition-all hover:scale-105 text-sm uppercase tracking-wide iepi-glow-orange"
                  style={{ backgroundColor: "var(--iepi-orange)" }}
                >
                  Inscreva&#8209;se Agora
                </Link>
                <Link
                  href="/cursos"
                  className="px-7 py-3 font-bold rounded-lg text-sm uppercase tracking-wide transition-all hover:scale-105 text-white"
                  style={{ background: "var(--g-brand)", boxShadow: "0 0 20px rgba(191,31,181,0.3)" }}
                >
                  Ver todos os cursos
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
                style={{ background: "radial-gradient(ellipse, #6C1ED9 0%, transparent 70%)" }} />
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop"
                alt="Estudantes de saúde"
                className="relative z-10 w-full rounded-2xl object-cover shadow-2xl"
                style={{ maxHeight: 420, border: "2px solid rgba(108,30,217,0.4)" }}
              />
              {/* floating badge */}
              <div className="absolute -bottom-4 -right-4 z-20 px-4 py-3 rounded-xl text-white text-xs font-bold"
                style={{ background: "var(--g-brand)", boxShadow: "0 8px 24px rgba(191,31,181,0.5)" }}>
                🏆 Melhor Instituto do RN
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ══════════════════════════ CURSOS EM DESTAQUE ═══════════════════════ */}
      <section className="py-16" id="cursos"
        style={{ background: "linear-gradient(135deg, #1e0e60 0%, #6C1ED9 60%, #BF1FB5 100%)" }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Matrículas abertas</p>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">Cursos em Destaque</h2>
            </div>
            <Link href="/cursos" className="text-xs font-semibold text-white/60 hover:text-white transition-colors underline underline-offset-2">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/checkout/${c.id}`}
                className="card-lift flex flex-col rounded-xl overflow-hidden"
                style={{ backgroundColor: "var(--iepi-bg)", border: "1px solid rgba(108,30,217,0.35)" }}
              >
                {/* thumb */}
                <div className="h-32 w-full relative flex items-center justify-center overflow-hidden"
                  style={{ background: "linear-gradient(135deg, rgba(108,30,217,0.5), rgba(4,157,191,0.3))" }}>
                  <span className="relative z-10 px-2 py-0.5 text-[10px] font-bold text-white rounded uppercase tracking-wide"
                    style={{ background: "var(--iepi-orange)" }}>
                    {c.type}
                  </span>
                </div>

                {/* info */}
                <div className="flex flex-col gap-1.5 p-3 text-white/70 text-xs flex-1">
                  <p className="font-bold text-white text-sm leading-tight mb-1">{c.title}</p>
                  <div className="flex items-center gap-1"><IconClock />{c.hours}</div>
                  <div className="flex items-center gap-1"><IconCalendar />{c.start}</div>
                  <div className="flex items-center gap-1"><IconCalendar />{c.end}</div>
                  <div className="flex items-center gap-1"><IconBook />{c.modality}</div>
                  <div className="flex items-center gap-1"><IconBook />{c.instructor}</div>
                </div>

                {/* cta */}
                <div className="p-3 pt-0">
                  <span className="block w-full text-center py-2 text-white text-xs font-bold rounded-lg transition-all"
                    style={{ backgroundColor: "var(--iepi-orange)" }}>
                    Inscreva&#8209;se
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ O QUE VOCÊ PODE ESPERAR? ════════════════════════ */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--iepi-bg)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 rounded-full" style={{ background: "var(--g-cool)" }} />
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">O que você pode esperar?</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Image carousel (static visual) */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ border: "2px solid rgba(108,30,217,0.35)" }}>
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2532&auto=format&fit=crop"
                alt="Estrutura do IEPI"
                className="w-full object-cover"
                style={{ height: 340 }}
              />
              <button className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors" style={{ background: "rgba(108,30,217,0.7)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors" style={{ background: "rgba(108,30,217,0.7)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i===0 ? "#BF1FB5" : "rgba(255,255,255,0.35)" }}/>
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Estrutura de Excelência</h3>
              <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
                Venha viver através do corpo docente que sabe o que faz! O melhor campo prático do
                estado do Rio Grande do Norte e abertura para as melhores oportunidades de mercado.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
                Infraestrutura moderna, laboratórios equipados e ambiente colaborativo para acelerar
                sua evolução profissional.
              </p>
              <Link
                href="/sobre"
                className="inline-block px-7 py-3 text-white font-bold rounded-lg transition-all hover:scale-105 text-sm uppercase tracking-wide"
                style={{ background: "var(--g-cool)", boxShadow: "0 0 20px rgba(4,157,191,0.35)" }}
              >
                Conheça o IEPI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ NOTÍCIAS ═════════════════════════════════ */}
      <section
        className="py-16"
        id="noticias"
        style={{ background: "linear-gradient(180deg, var(--iepi-bg-deep) 0%, var(--iepi-bg) 100%)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ background: "var(--g-section)" }} />
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">Notícias</h2>
            </div>
            <a href="#" className="text-xs font-semibold transition-colors underline underline-offset-2" style={{ color: "rgba(255,255,255,0.5)" }}>Ver todas →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((n) => (
              <article
                key={n.id}
                className="card-lift rounded-xl overflow-hidden iepi-card"
              >
                <div className="h-28 flex items-center justify-center text-xs font-bold uppercase"
                  style={{ background: "linear-gradient(135deg, rgba(108,30,217,0.4), rgba(4,157,191,0.2))", color: "rgba(255,255,255,0.2)" }}>
                  Imagem
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--iepi-cyan)" }}>{n.date}</span>
                  <h3 className="text-white font-bold text-sm mb-2 mt-1">{n.title}</h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "rgba(255,255,255,0.5)" }}>{n.summary}</p>
                  <a href="#" className="inline-block mt-3 text-xs font-semibold transition-colors" style={{ color: "var(--iepi-pink)" }}>
                    Saber mais →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs transition-all" style={{ background: "rgba(108,30,217,0.3)", border: "1px solid rgba(108,30,217,0.4)" }}>‹</button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--g-brand)" }}>1</button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs transition-all" style={{ background: "rgba(108,30,217,0.3)", border: "1px solid rgba(108,30,217,0.4)" }}>›</button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ EVENTOS ══════════════════════════════════ */}
      <section
        id="eventos"
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: "var(--iepi-bg-deep)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full" style={{ background: "var(--g-brand)" }} />
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">Eventos</h2>
          </div>

          {/* Event banner */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d0525 0%, #1e0e60 40%, #6C1ED9 100%)",
              minHeight: 260,
              border: "1px solid rgba(108,30,217,0.5)",
            }}
          >
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #BF1FB5 0%, transparent 60%)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
              {/* Left */}
              <div>
                <p className="font-bold text-sm uppercase tracking-widest mb-2" style={{ color: "var(--iepi-cyan)" }}>8º</p>
                <h3 className="text-4xl md:text-6xl font-extrabold text-white leading-none uppercase">
                  CON<br/>GRES<br/>SO
                  <span style={{ color: "var(--iepi-orange)" }}> +</span>
                  <br/>
                  <span className="text-xl text-white/70">DA LIGA</span>
                </h3>
                <p className="text-xs mt-3 uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.5)" }}>Acesso, Gestão, Educação e Precisão em Saúde</p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-white font-bold text-lg uppercase tracking-widest">NATAL/RN</p>
                <p className="text-sm uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Centro de Convenções</p>
                <p className="text-white font-extrabold text-xl mb-5">05, 06 E 07 | JUNHO 2025</p>
                <Link
                  href="https://congressodaliga.com.br"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm uppercase tracking-wide transition-all hover:scale-105"
                  style={{ background: "var(--g-warm)", boxShadow: "0 0 20px rgba(217,103,4,0.4)" }}
                >
                  INSCREVA‑SE
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                  </svg>
                </Link>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>congressodaliga.com.br</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ DEPOIMENTOS ══════════════════════════════ */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--iepi-bg)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full" style={{ background: "var(--g-cool)" }} />
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide">Depoimentos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-lift rounded-xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--iepi-bg-surface)", border: "1px solid rgba(108,30,217,0.3)" }}
              >
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ background: "var(--g-brand)", boxShadow: "0 0 16px rgba(191,31,181,0.4)" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--iepi-cyan)" }}>{t.course}</p>
                  </div>
                </div>
                {/* Quote */}
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--iepi-orange)" }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CTA FINAL ════════════════════════════════ */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "var(--g-section)" }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 75% 50%, #049DBF, transparent 60%)" }} />
        <div className="container relative z-10 mx-auto px-4 max-w-7xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>Vagas Limitadas</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Pronto para dar o próximo passo?<br/>
            <span style={{ color: "rgba(255,255,255,0.75)" }}>Sua carreira começa aqui.</span>
          </h2>
          <p className="mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Garanta sua vaga em um dos melhores institutos de educação em saúde do Nordeste.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/cursos"
              className="px-8 py-3.5 font-bold text-sm uppercase tracking-wide rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: "var(--iepi-orange)", color: "#fff", boxShadow: "0 0 24px rgba(217,103,4,0.5)" }}
            >
              Ver todos os cursos
            </Link>
            <Link
              href="/contato"
              className="px-8 py-3.5 font-bold text-sm uppercase tracking-wide rounded-xl transition-all hover:scale-105 text-white"
              style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}


