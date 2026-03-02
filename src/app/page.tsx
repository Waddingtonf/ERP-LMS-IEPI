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
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ backgroundColor: "var(--iepi-navy)" }}
      >
        {/* bg dots / noise texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
                O MELHOR DO ENSINO EM SAÚDE VOCÊ ENCONTRA{" "}
                <span className="text-orange-400">AQUI!</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                Venha viver através do corpo docente que sabe oque faz! O melhor campo prático do
                estado do Rio Grande do Norte e abertura para as melhores oportunidades de mercado.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/cursos"
                  className="px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md transition-colors text-sm uppercase tracking-wide"
                >
                  Inscreva&#8209;se
                </Link>
                <Link
                  href="/cursos"
                  className="px-7 py-3 text-white/80 hover:text-white font-semibold text-sm underline underline-offset-4 transition-colors"
                >
                  Ver todos os cursos
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-20"
                style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop"
                alt="Estudantes de saúde"
                className="relative z-10 w-full rounded-2xl object-cover shadow-2xl"
                style={{ maxHeight: 420 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CURSOS EM DESTAQUE ═══════════════════════ */}
      <section className="py-16 bg-orange-500" id="cursos">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-extrabold text-white mb-8 uppercase tracking-wide">
            Cursos em Destaque
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/checkout/${c.id}`}
                className="card-lift flex flex-col rounded-xl overflow-hidden"
                style={{ backgroundColor: "var(--iepi-navy)" }}
              >
                {/* thumb */}
                <div className="h-32 w-full relative bg-orange-900/30 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 to-transparent" />
                  <span className="relative z-10 px-2 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded uppercase">
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
                  <span className="block w-full text-center py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-md transition-colors">
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
        style={{ backgroundColor: "var(--iepi-navy)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-extrabold text-white mb-10 uppercase tracking-wide">
            O que você pode esperar?
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Image carousel (static visual) */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2532&auto=format&fit=crop"
                alt="Estrutura do IEPI"
                className="w-full object-cover"
                style={{ height: 340 }}
              />
              {/* Prev/Next arrows */}
              <button className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-orange-500 flex items-center justify-center text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-orange-500 flex items-center justify-center text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              {/* dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className={`w-2 h-2 rounded-full ${i===0 ? "bg-orange-500" : "bg-white/40"}`}/>
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Estrutura</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Venha viver através do corpo docente que sabe oque faz! O melhor campo prático do
                estado do Rio Grande do Norte e abertura para as melhores oportunidades de mercado.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Venha viver através do corpo docente que sabe oque faz! O melhor campo prático do
                estado do Rio Grande do Norte e abertura para as melhores oportunidades de mercado.
              </p>
              <Link
                href="/sobre"
                className="inline-block px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md transition-colors text-sm uppercase tracking-wide"
              >
                Inscreva&#8209;se
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ NOTÍCIAS ═════════════════════════════════ */}
      <section className="py-16 bg-orange-500" id="noticias">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-extrabold text-white mb-8 uppercase tracking-wide">
            Notícias
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((n) => (
              <article
                key={n.id}
                className="card-lift rounded-xl overflow-hidden"
                style={{ backgroundColor: "var(--iepi-navy)" }}
              >
                <div className="h-28 bg-orange-800/30 flex items-center justify-center text-white/20 text-xs font-bold uppercase">
                  Imagem
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-2">{n.title}</h3>
                  <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{n.summary}</p>
                  <a href="#" className="inline-block mt-3 text-orange-400 hover:text-orange-300 text-xs font-semibold transition-colors">
                    Saber mais →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-orange-600 text-white text-xs flex items-center justify-center transition-colors">‹</button>
            <button className="w-8 h-8 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">1</button>
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-orange-600 text-white text-xs flex items-center justify-center transition-colors">›</button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ EVENTOS ══════════════════════════════════ */}
      <section
        id="eventos"
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: "var(--iepi-navy-dark)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-extrabold text-white mb-8 uppercase tracking-wide">
            Eventos
          </h2>

          {/* Event banner */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a0b3d 0%, #2d0f6e 40%, #3b1a7a 100%)",
              minHeight: 260,
            }}
          >
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #6d28d9 0%, transparent 60%)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
              {/* Left */}
              <div>
                <p className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-2">8º</p>
                <h3 className="text-4xl md:text-6xl font-extrabold text-white leading-none uppercase">
                  CON<br/>GRES<br/>SO
                  <span className="text-orange-500"> +</span>
                  <br/>
                  <span className="text-xl text-white/70">DA LIGA</span>
                </h3>
                <p className="text-white/60 text-xs mt-3 uppercase tracking-wide">Acesso, Gestão, Educação e Precisão em Saúde</p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-white font-bold text-lg uppercase tracking-widest">NATAL/RN</p>
                <p className="text-white/60 text-sm uppercase tracking-wide mb-1">Centro de Convenções</p>
                <p className="text-white font-extrabold text-xl mb-4">05, 06 E 07 | JUNHO 2025</p>
                <Link
                  href="https://congressodaliga.com.br"
                  target="_blank"
                  className="flex items-center gap-2 justify-end text-orange-400 hover:text-orange-300 font-bold text-sm transition-colors"
                >
                  INSCREVA‑SE
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                  </svg>
                </Link>
                <p className="text-white/40 text-xs mt-1">congressodaliga.com.br</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ DEPOIMENTOS ══════════════════════════════ */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--iepi-navy)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-extrabold text-white mb-8 uppercase tracking-wide">
            Depoimentos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-lift rounded-xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-600/30 border-2 border-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-orange-400 text-xs">{t.course}</p>
                  </div>
                </div>
                {/* Quote */}
                <p className="text-white/60 text-sm leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
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
      <section className="py-16 bg-orange-500">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Pronto para dar o próximo passo?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Garanta sua vaga em um dos melhores institutos de educação em saúde do Nordeste.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/cursos"
              className="px-8 py-3 font-bold text-sm uppercase tracking-wide rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors"
            >
              Ver todos os cursos
            </Link>
            <Link
              href="/contato"
              className="px-8 py-3 font-bold text-sm uppercase tracking-wide rounded-md text-white border-2 border-white hover:bg-white/10 transition-colors"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}


