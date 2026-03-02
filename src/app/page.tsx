import Link from "next/link";

/*  dados de exemplo  */
const COURSES = [
  { id: "course-10", type: "Pós-Graduação",  title: "Gestão em Saúde e Liderança",           hours: "360h", modality: "Vespertino/Noturno" },
  { id: "course-3",  type: "Especialização", title: "Feridas, Estomias e Incontinências",     hours: "360h", modality: "Mat./Vesp."         },
  { id: "course-1",  type: "Curso Livre",    title: "Oncologia para Técnicos",                hours: "360h", modality: "Mat./Vesp."         },
  { id: "course-4",  type: "Pós-Graduação",  title: "Enfermagem Oncológica",                  hours: "360h", modality: "Mat./Vesp."         },
];

const NEWS = [
  {
    date: "12 Jun 2025",
    title: "IEPI amplia parceria com hospitais da rede pública do RN",
    excerpt: "Acordo garante campo de prática para mais de 400 alunos de cursos de saúde.",
  },
  {
    date: "3 Jun 2025",
    title: "Processo seletivo 2025.2 abre inscrições",
    excerpt: "Vagas em cursos de Enfermagem, Fisioterapia, Nutrição e mais. Confira o edital completo.",
  },
  {
    date: "27 Mai 2025",
    title: "IEPI recebe comissão do MEC para avaliação institucional",
    excerpt: "Instituto aguarda recredenciamento que pode ampliar oferta de cursos de graduação.",
  },
];

const TESTIMONIALS = [
  {
    name: "Juliana Ferreira",
    course: "Especialização em Enfermagem UTI",
    quote: "O nível dos professores e a prática hospitalar que o IEPI proporciona foram essenciais para minha aprovação na residência.",
    initials: "JF",
  },
  {
    name: "Carlos Eduardo Lima",
    course: "MBA Gestão de Saúde",
    quote: "Em menos de seis meses após concluir o MBA consegui uma promoção na clínica onde trabalho. Conteúdo direto ao ponto.",
    initials: "CE",
  },
  {
    name: "Priscila Tavares",
    course: "Curso Livre  SVB",
    quote: "Instrutores certificados, equipamento real de simulação e certificado reconhecido internacionalmente. Nota dez.",
    initials: "PT",
  },
];

const EVENTS = [
  { day: "21", month: "Jun", title: "Semana da Saúde  Palestras e Minicursos", local: "Campus Natal, Bloco C", link: "#" },
  { day: "5",  month: "Jul", title: "Congresso Nordestino de Gestão Hospitalar", local: "Hotel Serhs, Natal-RN",  link: "#" },
];

const STATS = [
  { value: "12 mil+", label: "Alunos formados"   },
  { value: "15 anos", label: "De história"        },
  { value: "98%",     label: "Satisfação geral"   },
  { value: "200+",    label: "Docentes ativos"    },
];

const FEATURES = [
  {
    title: "Corpo Docente",
    text: "Professores mestres e doutores com atuação clínica e hospitalar ativa.",
    accent: "var(--iepi-purple)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.63 48.63 0 0 1 12 20.904a48.63 48.63 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Campo Prático",
    text: "Convênios com hospitais e clínicas para prática supervisionada real.",
    accent: "var(--iepi-pink)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    title: "Certificação",
    text: "Diplomas e certificados reconhecidos pelo MEC e entidades de classe.",
    accent: "var(--iepi-cyan)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    title: "Flexibilidade",
    text: "Modalidades presencial, híbrida e EAD para se adaptar à sua rotina.",
    accent: "var(--iepi-orange-light)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

/*  page  */
export default function Home() {
  return (
    <>

      {/* 
          HERO  fundo escuro
       */}
      <section style={{ backgroundColor: "var(--iepi-dark)" }}>
        <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24">

          {/* Texto */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "var(--iepi-cyan)" }}>
              Matrículas abertas  2025.2
            </p>
            <h1
              className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Educação em saúde que{" "}
              <span style={{ color: "var(--iepi-pink)" }}>transforma</span>{" "}
              carreiras no Nordeste
            </h1>
            <p className="text-base mb-8 max-w-lg" style={{ color: "var(--text-on-dark-muted)" }}>
              Pós-graduações, especializações e cursos livres desenvolvidos por especialistas com
              atuação clínica real. Presencial, híbrido e EAD.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cursos"
                className="inline-flex items-center text-sm font-bold text-white px-7 py-3.5 rounded-lg transition-colors"
                style={{ backgroundColor: "var(--iepi-orange-light)" }}
              >
                Ver cursos disponíveis
              </Link>
              <Link
                href="/sobre"
                className="inline-flex items-center text-sm font-semibold px-7 py-3.5 rounded-lg border transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.72)" }}
              >
                Conhecer o IEPI
              </Link>
            </div>
          </div>

          {/* Placeholder imagem */}
          <div
            className="rounded-2xl w-full hidden lg:flex items-center justify-center"
            style={{
              aspectRatio: "4/3",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>Imagem institucional</p>
          </div>
        </div>
      </section>

      {/* 
          BANDA DE CREDIBILIDADE  roxo
       */}
      <section style={{ backgroundColor: "var(--iepi-purple)" }}>
        <div className="container mx-auto px-6 max-w-7xl py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dt className="text-3xl font-extrabold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
                  {value}
                </dt>
                <dd className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 
          CURSOS EM DESTAQUE  BRANCO (cor terciária)
       */}
      <section style={{ backgroundColor: "var(--iepi-white)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Cabeçalho de seção */}
          <div className="mb-10">
            <p className="section-overline mb-2">Matrículas abertas</p>
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
              Cursos em destaque
            </h2>
            <p className="text-sm max-w-lg" style={{ color: "var(--text-muted)" }}>
              Programas desenvolvidos com base nas demandas reais do mercado de saúde.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {COURSES.map((c) => (
              <Link
                key={c.id}
                href={`/cursos/${c.id}`}
                className="card-lift flex flex-col rounded-xl overflow-hidden group"
                style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
              >
                {/* Foto */}
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16/9", backgroundColor: "var(--iepi-light-alt)" }}
                >
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: "var(--iepi-purple)" }}
                  >
                    {c.type}
                  </span>
                </div>

                {/* Corpo */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm mb-4 leading-snug flex-1" style={{ color: "var(--text-heading)" }}>
                    {c.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {[c.hours, c.modality].map((chip) => (
                      <span
                        key={chip}
                        className="px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{ backgroundColor: "var(--iepi-light-alt)", color: "var(--text-muted)" }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--iepi-orange)" }}>
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
              style={{ borderColor: "var(--border-light)", color: "var(--text-link)" }}
            >
              Ver todos os cursos 
            </Link>
          </div>
        </div>
      </section>

      {/* 
          POR QUE O IEPI?  escuro
       */}
      <section style={{ backgroundColor: "var(--iepi-dark)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--iepi-cyan)" }}>
              Nossos diferenciais
            </p>
            <h2 className="text-3xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
              Por que estudar no IEPI?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ title, text, accent, icon }) => (
              <div
                key={title}
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--iepi-white)", border: "none" }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accent, color: "#fff" }}
                >
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1.5" style={{ color: "var(--text-heading)" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
          NOTÍCIAS  lavanda (iepi-light-alt)
       */}
      <section id="noticias" style={{ backgroundColor: "var(--iepi-light-alt)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="section-overline mb-2">Fique por dentro</p>
              <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
                Últimas notícias
              </h2>
            </div>
            <a href="#" className="text-sm font-bold" style={{ color: "var(--iepi-orange)" }}>
              Ver todas 
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {NEWS.map(({ date, title, excerpt }) => (
              <article
                key={title}
                className="card-lift rounded-xl overflow-hidden flex flex-col"
                style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}
              >
                {/* Foto placeholder */}
                <div className="w-full" style={{ aspectRatio: "16/9", backgroundColor: "var(--iepi-light-alt)" }} />
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-overline)" }}>
                    {date}
                  </p>
                  <h3 className="font-bold text-sm leading-snug mb-2 flex-1" style={{ color: "var(--text-heading)" }}>
                    {title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{excerpt}</p>
                  <a href="#" className="text-sm font-bold mt-auto" style={{ color: "var(--iepi-orange)" }}>
                    Leia mais 
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 
          DEPOIMENTOS  branco
       */}
      <section style={{ backgroundColor: "var(--iepi-white)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-10 text-center">
            <p className="section-overline mb-2">Quem passou pelo IEPI</p>
            <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
              O que nossos alunos falam
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, course, quote, initials }) => (
              <div
                key={name}
                className="p-6 rounded-xl flex flex-col gap-4"
                style={{ backgroundColor: "var(--iepi-light-alt)", border: "1px solid var(--border-light)" }}
              >
                {/* Estrelas */}
                <div className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--iepi-orange-light)" }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-body)" }}>
                  &ldquo;{quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: "var(--iepi-purple)" }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-heading)" }}>{name}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
          EVENTOS  escuro
       */}
      <section id="eventos" style={{ backgroundColor: "var(--iepi-dark)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--iepi-cyan)" }}>
                Agenda
              </p>
              <h2 className="text-3xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
                Próximos eventos
              </h2>
            </div>
            <a href="#" className="text-sm font-bold" style={{ color: "var(--iepi-orange-light)" }}>
              Ver agenda completa 
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {EVENTS.map(({ day, month, title, local, link }) => (
              <div
                key={title}
                className="flex items-center gap-5 p-5 rounded-xl"
                style={{ backgroundColor: "var(--iepi-white)", border: "none" }}
              >
                {/* Bloco de data */}
                <div
                  className="shrink-0 w-14 text-center rounded-lg py-2.5"
                  style={{ backgroundColor: "var(--iepi-purple)" }}
                >
                  <div className="text-2xl font-extrabold text-white leading-none">{day}</div>
                  <div className="text-[9px] font-bold text-white/75 uppercase tracking-widest mt-0.5">{month}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-snug mb-1" style={{ color: "var(--text-heading)" }}>{title}</h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{local}</p>
                </div>

                <a
                  href={link}
                  className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--border-light)", color: "var(--text-link)" }}
                >
                  Saiba mais
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
          CTA FINAL  roxo
       */}
      <section style={{ backgroundColor: "var(--iepi-purple)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Sua carreira na saúde começa aqui
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.70)" }}>
            Consulte nossos cursos, verifique as datas de início e garanta sua vaga antes do encerramento das inscrições.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/cursos"
              className="inline-flex items-center text-sm font-bold text-white px-8 py-4 rounded-lg transition-colors"
              style={{ backgroundColor: "var(--iepi-orange-light)" }}
            >
              Quero me matricular
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center text-sm font-semibold px-8 py-4 rounded-lg border transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.30)", color: "rgba(255,255,255,0.80)" }}
            >
              Falar com um consultor
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}