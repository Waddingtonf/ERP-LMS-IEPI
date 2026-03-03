import Link from "next/link";
import LeadForm from "./_components/LeadForm";

/* ── dados ──────────────────────────────────────────────────────────── */
const COURSES = [
  {
    id: "course-10", type: "Pós-Graduação",  color: "#6C1ED9",
    title: "Gestão em Saúde e Liderança",
    hours: "360h", modality: "Noturno", start: "Mar/2026",
    price: 1599, installments: 12, urgency: "Últimas vagas",
  },
  {
    id: "course-3",  type: "Especialização", color: "#BF1FB5",
    title: "Feridas, Estomias e Incontinências",
    hours: "360h", modality: "Mat./Vesp.", start: "Abr/2026",
    price: 1299, installments: 10, urgency: "Turma quase cheia",
  },
  {
    id: "course-1",  type: "Curso Livre",    color: "#0280a0",
    title: "Oncologia para Técnicos de Enfermagem",
    hours: "180h", modality: "Sábados", start: "Mar/2026",
    price: 699,  installments: 6,  urgency: null,
  },
  {
    id: "course-4",  type: "Pós-Graduação",  color: "#6C1ED9",
    title: "Enfermagem Oncológica",
    hours: "360h", modality: "Noturno", start: "Abr/2026",
    price: 1599, installments: 12, urgency: "Últimas vagas",
  },
];

const STATS = [
  { value: "12 mil+", label: "Alunos formados",  sub: "e empregados no mercado" },
  { value: "15 anos", label: "De história",       sub: "no ensino em saúde no RN" },
  { value: "98%",     label: "Satisfação geral",  sub: "pesquisa com egressos 2024" },
  { value: "200+",    label: "Docentes ativos",   sub: "mestres e doutores" },
];

const FEATURES = [
  {
    title: "Corpo Docente de élite",
    text: "Professores mestres e doutores com atuação clínica ativa em hospitais de referência.",
    accent: "#6C1ED9",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.63 48.63 0 0 1 12 20.904a48.63 48.63 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  },
  {
    title: "Campo prático real",
    text: "Convênios com o Hospital Universitário, UPAs e clínicas privadas para prática supervisionada.",
    accent: "#BF1FB5",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  },
  {
    title: "Certificados reconhecidos",
    text: "Diplomas e certificados reconhecidos pelo MEC, COREN e CFE para valorização imediata.",
    accent: "#0280a0",
    icon: "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z",
  },
  {
    title: "Flexibilidade total",
    text: "Presencial, híbrido e EAD. Turmas matutinas, vespertinas e noturnas para sua rotina.",
    accent: "#bf5800",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
];

const TESTIMONIALS = [
  {
    name: "Juliana Ferreira",
    role: "Especialização em Enfermagem UTI",
    before: "Técnica de enfermagem sem especialização",
    after: "Aprovada na residência do Hospital Universitário",
    quote: "O nível dos professores e a prática hospitalar que o IEPI proporciona foram essenciais para minha aprovação na residência.",
    initials: "JF",
    color: "#6C1ED9",
  },
  {
    name: "Carlos Eduardo Lima",
    role: "MBA Gestão de Saúde",
    before: "Enfermeiro assistencial sem gestão",
    after: "Promovido a coordenador de UTI em 6 meses",
    quote: "Em menos de seis meses após concluir o MBA consegui uma promoção na clínica onde trabalho. Conteúdo direto ao ponto.",
    initials: "CE",
    color: "#BF1FB5",
  },
  {
    name: "Priscila Tavares",
    role: "Curso Livre — SVB & ACLS",
    before: "Enfermeira sem certificação em emergências",
    after: "Instrutora certificada internacionalmente",
    quote: "Instrutores certificados, equipamento real de simulação e certificado reconhecido internacionalmente. Nota dez.",
    initials: "PT",
    color: "#0280a0",
  },
];

const EVENTS = [
  { day: "21", month: "Jun", title: "Semana da Saúde — Palestras e Minicursos gratuitos", local: "Campus Natal, Bloco C · entrada franca", link: "#" },
  { day: "5",  month: "Jul", title: "Congresso Nordestino de Gestão Hospitalar",            local: "Hotel Serhs, Natal-RN · certificado reconhecido",  link: "#" },
];

const WA_MSG = encodeURIComponent("Olá! Quero saber mais sobre os cursos do IEPI.");

function fmt(price: number, n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    .format(Math.round(price / n));
}

/* ── page ───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>

      {/* ══════════════════════════════════════════════════════════════
          HERO — captação + lead form
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--iepi-dark)" }}>
        <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">

          {/* Texto persuasivo */}
          <div>
            {/* Urgency badge */}
            <div className="iepi-badge-urgency mb-5 w-fit">
              🔥 Matrículas 2026.1 abertas — vagas limitadas
            </div>

            <h1
              className="text-4xl sm:text-5xl font-extrabold leading-[1.1] mb-5 text-white"
              style={{ letterSpacing: "-0.025em" }}
            >
              Sua carreira na saúde merece a{" "}
              <span style={{ color: "var(--iepi-pink)" }}>melhor formação</span>{" "}
              do Nordeste
            </h1>

            <p className="text-base leading-relaxed mb-7 max-w-lg" style={{ color: "var(--text-on-dark-muted)" }}>
              Pós-graduações, especializações e cursos livres ministrados por especialistas
              com atuação clínica real — presencial, híbrido e EAD em Natal-RN.
            </p>

            {/* Trust seals */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["✓ Reconhecido pelo MEC","✓ COREN ativo","✓ 15 anos de história","✓ 12 mil+ egressos"].map(s => (
                <span key={s} className="iepi-trust-chip">{s}</span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cursos"
                className="inline-flex items-center text-sm font-bold text-white px-8 py-4 rounded-lg transition-colors"
                style={{ backgroundColor: "var(--iepi-orange-light)" }}
              >
                Ver cursos disponíveis
              </Link>
              <a
                href={`https://wa.me/5584984162808?text=${WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 rounded-lg border transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.80)" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#25d366" }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.843L.057 23.428a.5.5 0 0 0 .616.616l5.628-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 0 1-5.034-1.377l-.361-.214-3.74.979.999-3.645-.235-.374A9.867 9.867 0 0 1 2.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                </svg>
                Falar pelo WhatsApp
              </a>
            </div>
          </div>

          {/* Lead form */}
          <div className="lg:pl-6">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS BAND — credibilidade
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--iepi-purple)" }}>
        <div className="container mx-auto px-6 max-w-7xl py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label, sub }) => (
              <div key={label} className="flex flex-col items-center">
                <dt className="text-3xl font-extrabold text-white mb-0.5" style={{ letterSpacing: "-0.02em" }}>
                  {value}
                </dt>
                <dd className="text-xs font-bold uppercase tracking-widest text-white/70 leading-tight">
                  {label}
                </dd>
                <dd className="text-[10px] text-white/45 mt-0.5 max-w-[10rem]">{sub}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CURSOS EM DESTAQUE — conversão com preço + urgência
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--iepi-white)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-overline mb-2">Matrículas abertas agora</p>
              <h2 className="text-3xl font-extrabold mb-1" style={{ color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
                Cursos em destaque
              </h2>
              <p className="text-sm max-w-lg" style={{ color: "var(--text-muted)" }}>
                Programas desenvolvidos com base nas demandas reais do mercado de saúde.
              </p>
            </div>
            <Link href="/cursos" className="shrink-0 text-sm font-bold" style={{ color: "var(--iepi-orange)" }}>
              Ver todos os cursos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {COURSES.map((c) => (
              <Link
                key={c.id}
                href={`/cursos/${c.id}`}
                className="card-lift flex flex-col rounded-xl overflow-hidden group"
                style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
              >
                {/* Topo colorido */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: c.color }}
                />

                <div className="p-4 flex flex-col flex-1">
                  {/* Urgency + type */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.type}
                    </span>
                    {c.urgency && (
                      <span
                        className="text-[9.5px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--iepi-orange)" }}
                      >
                        🔥 {c.urgency}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm leading-snug mb-3 flex-1" style={{ color: "var(--text-heading)" }}>
                    {c.title}
                  </h3>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {[c.hours, c.modality, `Início ${c.start}`].map(chip => (
                      <span
                        key={chip}
                        className="px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{ backgroundColor: "var(--iepi-light-alt)", color: "var(--text-muted)" }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid var(--border-light)" }}
                  >
                    <div>
                      <p className="text-[10.5px]" style={{ color: "var(--text-muted)" }}>a partir de</p>
                      <p className="font-extrabold text-sm" style={{ color: "var(--text-heading)" }}>
                        {c.installments}x de {fmt(c.price, c.installments)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-2 rounded-lg text-white transition-opacity group-hover:opacity-90"
                      style={{ backgroundColor: "var(--iepi-orange)" }}
                    >
                      Garantir vaga
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary CTA */}
          <div className="text-center">
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-lg border-2 transition-colors"
              style={{ borderColor: "var(--iepi-purple)", color: "var(--iepi-purple)" }}
            >
              Ver todos os 20+ cursos disponíveis
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CONSULTORIA STRIP — WhatsApp + ação imediata
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--iepi-dark-mid)" }}>
        <div className="container mx-auto px-6 max-w-7xl py-9">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(37,211,102,0.15)", border: "1.5px solid rgba(37,211,102,0.30)" }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25d366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.843L.057 23.428a.5.5 0 0 0 .616.616l5.628-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 0 1-5.034-1.377l-.361-.214-3.74.979.999-3.645-.235-.374A9.867 9.867 0 0 1 2.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-white text-base">Dúvida sobre qual curso escolher?</p>
                <p className="text-sm" style={{ color: "var(--text-on-dark-muted)" }}>
                  Nossos consultores atendem agora — Seg–Sex 08h–20h &nbsp;|&nbsp; Sáb 08h–14h
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="https://wa.me/5584984162808"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm"
                style={{ backgroundColor: "#25d366" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.843L.057 23.428a.5.5 0 0 0 .616.616l5.628-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 0 1-5.034-1.377l-.361-.214-3.74.979.999-3.645-.235-.374A9.867 9.867 0 0 1 2.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                </svg>
                (84) 98416-2808
              </a>
              <a
                href="tel:+558440095108"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm border"
                style={{ borderColor: "rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.80)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
                </svg>
                (84) 4009-5108
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          POR QUE O IEPI — diferenciais com prova específica
      ══════════════════════════════════════════════════════════════ */}
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
                style={{ backgroundColor: "var(--iepi-white)" }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accent, color: "#fff" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1.5" style={{ color: "var(--text-heading)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRANSFORMAÇÕES — social proof com resultado concreto
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--iepi-light-alt)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-10 text-center">
            <p className="section-overline mb-2">Resultados reais</p>
            <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
              O que nossos alunos conquistaram
            </h2>
            <p className="text-sm max-w-md mx-auto mt-2" style={{ color: "var(--text-muted)" }}>
              Mais de 12 mil profissionais de saúde já transformaram suas carreiras aqui.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, before, after, quote, initials, color }) => (
              <div
                key={name}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}
              >
                {/* Transformation header */}
                <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span
                      className="px-2 py-1 rounded font-semibold"
                      style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#b91c1c" }}
                    >
                      Antes: {before}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="px-2 py-1 rounded font-semibold"
                      style={{ backgroundColor: "rgba(22,163,74,0.08)", color: "#15803d" }}
                    >
                      ✓ Hoje: {after}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Stars */}
                  <div className="flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"
                        style={{ color: "var(--iepi-orange-light)" }}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-body)" }}>
                    &ldquo;{quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid var(--border-light)" }}>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-heading)" }}>{name}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          EVENTOS — agrega urgência e calendário
      ══════════════════════════════════════════════════════════════ */}
      <section id="eventos" style={{ backgroundColor: "var(--iepi-dark)" }} className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--iepi-cyan)" }}>
                Agenda
              </p>
              <h2 className="text-2xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
                Próximos eventos
              </h2>
            </div>
            <a href="#" className="text-sm font-bold" style={{ color: "var(--iepi-orange-light)" }}>
              Ver agenda completa →
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {EVENTS.map(({ day, month, title, local, link }) => (
              <div
                key={title}
                className="flex items-center gap-5 p-5 rounded-xl"
                style={{ backgroundColor: "var(--iepi-white)" }}
              >
                <div
                  className="shrink-0 w-14 text-center rounded-lg py-2.5"
                  style={{ backgroundColor: "var(--iepi-purple)" }}
                >
                  <div className="text-2xl font-extrabold text-white leading-none">{day}</div>
                  <div className="text-[9px] font-bold text-white/75 uppercase tracking-widest mt-0.5">{month}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-snug mb-0.5" style={{ color: "var(--text-heading)" }}>{title}</h3>
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

      {/* ══════════════════════════════════════════════════════════════
          CTA FINAL — decisão de compra
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--iepi-purple)" }} className="py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            12 mil+ profissionais já escolheram o IEPI
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Sua próxima conquista começa com uma decisão
          </h2>
          <p className="text-base mb-3 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>
            As vagas para 2026.1 são limitadas. Matricule-se agora ou fale com um consultor
            e escolha o curso ideal para a sua carreira.
          </p>
          <p className="text-sm font-semibold mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            ⏳ Inscrições encerram em breve para alguns programas
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/cursos"
              className="inline-flex items-center text-sm font-bold text-white px-8 py-4 rounded-lg transition-colors"
              style={{ backgroundColor: "var(--iepi-orange-light)" }}
            >
              Quero me matricular agora
            </Link>
            <a
              href="https://wa.me/5584984162808"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 rounded-lg border transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.30)", color: "rgba(255,255,255,0.80)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.843L.057 23.428a.5.5 0 0 0 .616.616l5.628-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 0 1-5.034-1.377l-.361-.214-3.74.979.999-3.645-.235-.374A9.867 9.867 0 0 1 2.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
              </svg>
              Falar com um consultor
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
