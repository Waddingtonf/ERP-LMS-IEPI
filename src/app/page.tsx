import Link from "next/link";

/*  dummy data  */
const COURSES = [
  { id: "1", type: "Pos-Graduacao",  title: "MBA em Gestao de Saude e Hospitalar",     hours: "360 h",  modality: "EAD"         },
  { id: "2", type: "Especializacao", title: "Especializacao em Enfermagem UTI Adulto",  hours: "480 h",  modality: "Hibrido"     },
  { id: "3", type: "Curso Livre",    title: "Suporte Basico de Vida  Urgencias",       hours: "80 h",   modality: "Presencial"  },
  { id: "4", type: "Graduacao",      title: "Licenciatura em Ciencias Biologicas",      hours: "3200 h", modality: "Presencial"  },
];

const NEWS = [
  {
    date: "12 Jun 2025",
    title: "IEPI amplia parceria com hospitais da rede publica do RN",
    excerpt: "Acordo garante campo de pratica para mais de 400 alunos de cursos de saude.",
  },
  {
    date: "3 Jun 2025",
    title: "Processo seletivo Para-Sempre 2025.2 abre inscricoes",
    excerpt: "Vagas em cursos de Enfermagem, Fisioterapia, Nutricao e mais. Confira o edital completo.",
  },
  {
    date: "27 Mai 2025",
    title: "IEPI recebe comissao do MEC para avaliacao institucional",
    excerpt: "Instituto aguarda recredenciamento que pode ampliar oferta de cursos de graduacao.",
  },
];

const TESTIMONIALS = [
  {
    name: "Juliana Ferreira",
    course: "Especializacao em Enfermagem UTI",
    quote: "O nivel dos professores e a pratica hospitalar que o IEPI proporciona foram essenciais para minha aprovacao na residencia.",
    initials: "JF",
  },
  {
    name: "Carlos Eduardo Lima",
    course: "MBA Gestao de Saude",
    quote: "Em menos de seis meses apos concluir o MBA consegui uma promocao na clinica onde trabalho. Conteudo direto ao ponto.",
    initials: "CE",
  },
  {
    name: "Priscila Tavares",
    course: "Curso Livre  SVB",
    quote: "Instrutores certificados, equipamento real de simulacao e certificado reconhecido internacionalmente. Nota dez.",
    initials: "PT",
  },
];

const EVENTS = [
  { day: "21", month: "Jun", title: "Semana da Saude  Palestras e Minicursos", local: "Campus Natal, Bloco C", link: "#" },
  { day: "5",  month: "Jul", title: "Congresso Nordestino de Gestao Hospitalar", local: "Hotel Serhs, Natal-RN",  link: "#" },
];

const STATS = [
  { value: "12 mil+",  label: "Alunos formados"    },
  { value: "15 anos",  label: "De historia"         },
  { value: "98%",      label: "Satisfacao geral"    },
  { value: "200+",     label: "Docentes ativos"     },
];

const FEATURES = [
  { icon: "", title: "Corpo Docente",    text: "Professores mestres e doutores com atuacao clínica e hospitalar ativa." },
  { icon: "", title: "Campo Pratico",    text: "Convenios com hospitais e clinicas para pratica supervisionada." },
  { icon: "", title: "Certificacao",     text: "Diplomas e certificados reconhecidos pelo MEC e entidades de classe." },
  { icon: "", title: "Flexibilidade",    text: "Modalidades presencial, hibrida e EAD para se adaptar a sua rotina." },
];

/*  page  */
export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section style={{ backgroundColor: "var(--iepi-bg-deep)" }}>
        <div
          className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20"
        >
          {/* Copy */}
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: "var(--iepi-cyan)" }}
            >
              Matriculas abertas  2025.2
            </p>
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Educacao em saude que{" "}
              <span style={{ color: "var(--iepi-pink)" }}>transforma</span>{" "}
              carreiras no Nordeste
            </h1>
            <p className="text-base mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.52)" }}>
              Pos-graduacoes, especializacoes e cursos livres desenvolvidos por
              especialistas com atuacao clínica real. Presencial, hibrido e EAD.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cursos"
                className="inline-flex items-center text-sm font-bold text-white px-7 py-3.5 rounded-lg transition-colors"
                style={{ backgroundColor: "var(--iepi-orange)" }}
              >
                Ver cursos disponíveis
              </Link>
              <Link
                href="/sobre"
                className="inline-flex items-center text-sm font-semibold px-7 py-3.5 rounded-lg border transition-colors"
                style={{
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.65)",
                  backgroundColor: "transparent",
                }}
              >
                Conhecer o IEPI
              </Link>
            </div>
          </div>

          {/* Photo placeholder */}
          <div
            className="rounded-2xl w-full hidden lg:block"
            style={{
              aspectRatio: "4/3",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="w-full h-full rounded-2xl flex items-end p-6">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
                Imagem institucional
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CREDIBILITY BAND ===== */}
      <section style={{ backgroundColor: "var(--iepi-purple)" }}>
        <div className="container mx-auto px-6 max-w-7xl py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dt
                  className="text-3xl font-extrabold text-white mb-1"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {value}
                </dt>
                <dd className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== CURSOS EM DESTAQUE ===== */}
      <section style={{ backgroundColor: "var(--iepi-bg)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Section header */}
          <div className="mb-10">
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--iepi-cyan)" }}>
              Matriculas abertas
            </p>
            <h2
              className="text-3xl font-extrabold text-white mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Cursos em destaque
            </h2>
            <p className="text-sm max-w-lg" style={{ color: "rgba(255,255,255,0.45)" }}>
              Programas desenvolvidos com base nas demandas reais do mercado de saude no Brasil.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {COURSES.map((c) => (
              <Link
                key={c.id}
                href={`/checkout/${c.id}`}
                className="card-lift flex flex-col rounded-xl overflow-hidden group"
                style={{
                  backgroundColor: "var(--iepi-bg-surface)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Photo */}
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16/9", backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <span
                    className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: "var(--iepi-purple)" }}
                  >
                    {c.type}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-white text-sm mb-4 leading-snug flex-1">
                    {c.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {[`${c.hours}`, c.modality].map((chip) => (
                      <span
                        key={chip}
                        className="px-2 py-0.5 rounded text-[11px]"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.52)",
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <span
                    className="text-sm font-semibold transition-colors"
                    style={{ color: "var(--iepi-orange)" }}
                  >
                    Saiba mais 
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/cursos"
              className="inline-flex items-center text-sm font-semibold px-8 py-3 rounded-lg border transition-colors"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Ver todos os cursos
            </Link>
          </div>
        </div>
      </section>

      {/* ===== POR QUE O IEPI? ===== */}
      <section style={{ backgroundColor: "var(--iepi-bg-deep)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--iepi-cyan)" }}>
              Nossos diferenciais
            </p>
            <h2
              className="text-3xl font-extrabold text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Por que estudar no IEPI?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon, title, text }) => (
              <div
                key={title}
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="text-2xl mb-4 w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(108,30,217,0.18)", color: "var(--iepi-purple)" }}
                >
                  {icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOTICIAS ===== */}
      <section id="noticias" style={{ backgroundColor: "var(--iepi-bg)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--iepi-cyan)" }}>
                Fique por dentro
              </p>
              <h2
                className="text-3xl font-extrabold text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                Ultimas noticias
              </h2>
            </div>
            <a
              href="#"
              className="text-sm font-semibold"
              style={{ color: "var(--iepi-orange)" }}
            >
              Ver todas 
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {NEWS.map(({ date, title, excerpt }) => (
              <article
                key={title}
                className="card-lift rounded-xl overflow-hidden flex flex-col"
                style={{
                  backgroundColor: "var(--iepi-bg-surface)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Photo placeholder */}
                <div
                  className="w-full"
                  style={{ aspectRatio: "16/9", backgroundColor: "rgba(255,255,255,0.04)" }}
                />
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--iepi-cyan)" }}>
                    {date}
                  </p>
                  <h3 className="font-bold text-white text-sm leading-snug mb-2 flex-1">{title}</h3>
                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>{excerpt}</p>
                  <a
                    href="#"
                    className="text-sm font-semibold mt-auto"
                    style={{ color: "var(--iepi-orange)" }}
                  >
                    Leia mais 
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section style={{ backgroundColor: "var(--iepi-bg-surface)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--iepi-cyan)" }}>
              Quem passou pelo IEPI
            </p>
            <h2
              className="text-3xl font-extrabold text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              O que nossos alunos falam
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, course, quote, initials }) => (
              <div
                key={name}
                className="p-6 rounded-xl flex flex-col gap-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Stars */}
                <div className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--iepi-orange)" }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                  &ldquo;{quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: "var(--iepi-purple)" }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{name}</p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENTOS ===== */}
      <section id="eventos" style={{ backgroundColor: "var(--iepi-bg-deep)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--iepi-cyan)" }}>
                Agenda
              </p>
              <h2
                className="text-3xl font-extrabold text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                Proximos eventos
              </h2>
            </div>
            <a href="#" className="text-sm font-semibold" style={{ color: "var(--iepi-orange)" }}>
              Ver agenda completa 
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {EVENTS.map(({ day, month, title, local, link }) => (
              <div
                key={title}
                className="flex items-center gap-5 p-5 rounded-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Date block */}
                <div
                  className="shrink-0 w-14 text-center rounded-lg py-2"
                  style={{ backgroundColor: "var(--iepi-purple)" }}
                >
                  <div className="text-2xl font-extrabold text-white leading-none">{day}</div>
                  <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{month}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm leading-snug mb-1">{title}</h3>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{local}</p>
                </div>

                <a
                  href={link}
                  className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.55)" }}
                >
                  Saiba mais
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section style={{ backgroundColor: "var(--iepi-purple)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Sua carreira na saude começa aqui
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.62)" }}>
            Consulte nossos cursos, verifique as datas de inicio e garanta sua vaga antes do encerramento das inscricoes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/cursos"
              className="inline-flex items-center text-sm font-bold text-white px-8 py-4 rounded-lg transition-colors"
              style={{ backgroundColor: "var(--iepi-orange)" }}
            >
              Quero me matricular
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center text-sm font-semibold px-8 py-4 rounded-lg border transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.75)" }}
            >
              Falar com um consultor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}