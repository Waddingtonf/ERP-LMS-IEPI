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
        className="py-20 lg:py-28"
        style={{ backgroundColor: "var(--iepi-bg-deep)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — copy */}
            <div>
              {/* badge */}
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
                style={{ backgroundColor: "rgba(4,157,191,0.12)", border: "1px solid rgba(4,157,191,0.3)", color: "var(--iepi-cyan)" }}>
                15 anos formando líderes em saúde
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                O melhor do ensino em saúde{" "}
                <span style={{ color: "var(--iepi-pink)" }}>você encontra aqui.</span>
              </h1>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                Venha viver através do corpo docente que sabe o que faz! O melhor campo prático do
                estado do Rio Grande do Norte e abertura para as melhores oportunidades de mercado.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[["12k+","Alunos formados"],["98%","Satisfação"],["200+","Docentes"]].map(([v,l]) => (
                  <div key={l} className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--iepi-bg-surface)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xl font-extrabold text-white">{v}</p>
                    <p className="text-white/50 text-[11px] mt-0.5">{l}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/cursos"
                  className="px-7 py-3 text-white font-bold rounded-lg transition-colors text-sm uppercase tracking-wide"
                  style={{ backgroundColor: "var(--iepi-orange)" }}
                >
                  Inscreva&#8209;se Agora
                </Link>
                <Link
                  href="/cursos"
                  className="px-7 py-3 font-bold rounded-lg text-sm uppercase tracking-wide transition-colors text-white"
                  style={{ backgroundColor: "var(--iepi-purple)" }}
                >
                  Ver todos os cursos
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop"
                alt="Estudantes de saúde"
                className="w-full rounded-2xl object-cover shadow-2xl"
                style={{ maxHeight: 420 }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* ══════════════════════════ CURSOS EM DESTAQUE ═══════════════════════ */}
      <section className="py-16" id="cursos"
        style={{ backgroundColor: "var(--iepi-bg)" }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--iepi-cyan)" }}>Matrículas abertas</p>
              <h2 className="text-2xl font-extrabold text-white">Cursos em Destaque</h2>
            </div>
            <Link href="/cursos" className="text-xs font-medium text-white/50 hover:text-white transition-colors">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/checkout/${c.id}`}
                className="card-lift flex flex-col rounded-xl overflow-hidden"
                style={{ backgroundColor: "var(--iepi-bg-surface)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* thumb */}
                <div className="h-10 w-full flex items-center justify-start px-3 gap-2"
                  style={{ backgroundColor: "var(--iepi-purple)" }}>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-wide">{c.type}</span>
                </div>

                {/* image */}
                <div className="h-28 w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8" style={{ color: "rgba(255,255,255,0.1)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"/>
                    </svg>
                  </div>
                </div>

                {/* info */}
                <div className="flex flex-col gap-1.5 p-3 text-white/60 text-xs flex-1">
                  <p className="font-bold text-white text-sm leading-tight mb-1">{c.title}</p>
                  <div className="flex items-center gap-1"><IconClock />{c.hours}</div>
                  <div className="flex items-center gap-1"><IconCalendar />{c.start}</div>
                  <div className="flex items-center gap-1"><IconCalendar />{c.end}</div>
                  <div className="flex items-center gap-1"><IconBook />{c.modality}</div>
                  <div className="flex items-center gap-1"><IconBook />{c.instructor}</div>
                </div>

                {/* cta */}
                <div className="p-3 pt-0">
                  <span className="block w-full text-center py-2 text-white text-xs font-bold rounded-lg transition-colors"
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
            <div className="w-1 h-6 rounded-sm" style={{ backgroundColor: "var(--iepi-purple)" }} />
            <h2 className="text-2xl font-extrabold text-white">O que você pode esperar?</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Image carousel (static visual) */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2532&auto=format&fit=crop"
                alt="Estrutura do IEPI"
                className="w-full object-cover"
                style={{ height: 340 }}
              />
              <button className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i===0 ? "var(--iepi-pink)" : "rgba(255,255,255,0.3)" }}/>
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
                className="inline-block px-7 py-3 text-white font-bold rounded-lg transition-colors text-sm uppercase tracking-wide"
                style={{ backgroundColor: "var(--iepi-purple)" }}
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
        style={{ backgroundColor: "var(--iepi-bg-deep)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-sm" style={{ backgroundColor: "var(--iepi-pink)" }} />
              <h2 className="text-2xl font-extrabold text-white">Notícias</h2>
            </div>
            <a href="#" className="text-xs font-medium text-white/50 hover:text-white transition-colors">Ver todas →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((n) => (
              <article
                key={n.id}
                className="card-lift rounded-xl overflow-hidden"
                style={{ backgroundColor: "var(--iepi-bg-surface)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="h-28 flex items-center justify-center text-xs font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.15)" }}>
                  Imagem
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--iepi-cyan)" }}>{n.date}</span>
                  <h3 className="text-white font-bold text-sm mb-2 mt-1">{n.title}</h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "rgba(255,255,255,0.55)" }}>{n.summary}</p>
                  <a href="#" className="inline-block mt-3 text-xs font-semibold transition-colors" style={{ color: "var(--iepi-cyan)" }}>
                    Saber mais →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button className="w-8 h-8 rounded flex items-center justify-center text-white text-xs transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>‹</button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "var(--iepi-purple)" }}>1</button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-white text-xs transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>›</button>
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
            <div className="w-1 h-6 rounded-sm" style={{ backgroundColor: "var(--iepi-orange)" }} />
            <h2 className="text-2xl font-extrabold text-white">Eventos</h2>
          </div>

          {/* Event banner */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--iepi-bg-surface)",
              border: "1px solid rgba(255,255,255,0.08)",
              minHeight: 260,
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
              {/* Left */}
              <div>
                <p className="font-semibold text-sm uppercase tracking-widest mb-2" style={{ color: "var(--iepi-cyan)" }}>8º</p>
                <h3 className="text-4xl md:text-6xl font-extrabold text-white leading-none uppercase">
                  CON<br/>GRES<br/>SO
                  <span style={{ color: "var(--iepi-orange)" }}> +</span>
                  <br/>
                  <span className="text-xl text-white/60">DA LIGA</span>
                </h3>
                <p className="text-xs mt-3 uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>Acesso, Gestão, Educação e Precisão em Saúde</p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-white font-bold text-lg uppercase tracking-widest">NATAL/RN</p>
                <p className="text-sm uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Centro de Convenções</p>
                <p className="text-white font-extrabold text-xl mb-5">05, 06 E 07 | JUNHO 2025</p>
                <Link
                  href="https://congressodaliga.com.br"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm uppercase tracking-wide transition-colors"
                  style={{ backgroundColor: "var(--iepi-orange)" }}
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
            <div className="w-1 h-6 rounded-sm" style={{ backgroundColor: "var(--iepi-cyan)" }} />
            <h2 className="text-2xl font-extrabold text-white">Depoimentos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-lift rounded-xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--iepi-bg-surface)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ backgroundColor: "var(--iepi-purple)" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--iepi-cyan)" }}>{t.course}</p>
                  </div>
                </div>
                {/* Quote */}
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
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
        className="py-20"
        style={{ backgroundColor: "var(--iepi-bg-deep)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--iepi-pink)" }}>Vagas Limitadas</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Pronto para dar o próximo passo?<br/>
            <span style={{ color: "rgba(255,255,255,0.75)" }}>Sua carreira começa aqui.</span>
          </h2>
          <p className="mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Garanta sua vaga em um dos melhores institutos de educação em saúde do Nordeste.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/cursos"
              className="px-8 py-3.5 font-bold text-sm uppercase tracking-wide rounded-lg transition-colors text-white"
              style={{ backgroundColor: "var(--iepi-orange)" }}
            >
              Ver todos os cursos
            </Link>
            <Link
              href="/contato"
              className="px-8 py-3.5 font-bold text-sm uppercase tracking-wide rounded-lg transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}


