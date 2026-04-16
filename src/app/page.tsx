"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Building2, CalendarDays, GraduationCap, ShieldCheck, Users, Target, Zap, BookOpen } from "lucide-react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const indicadores = [
  { label: "Alunos ativos", value: "1.245+", hint: "presencial, híbrido e EAD", icon: Users },
  { label: "Corpo docente", value: "100%", hint: "especializados", icon: GraduationCap },
  { label: "Parcerias", value: "40+", hint: "hospitais e unidades de saúde", icon: Building2 },
  { label: "Empregabilidade", value: "87%", hint: "egressos em atuação", icon: BarChart3 },
]

const pilares = [
  {
    title: "Trilhas educacionais por competência",
    desc: "Estrutura modular com progressão clara, métricas de evolução e alinhamento com as demandas do setor de saúde.",
    icon: BookOpen,
  },
  {
    title: "Governança acadêmica e compliance",
    desc: "Processos padronizados de avaliação, frequência, certificação e auditoria institucional para decisões seguras.",
    icon: ShieldCheck,
  },
  {
    title: "Integração pedagógica e financeira",
    desc: "Gestão unificada entre matrícula, retenção, desempenho e sustentabilidade operacional do ecossistema educacional.",
    icon: Zap,
  },
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const pilarsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Hero fade-in
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll("span, h1, p, .enterprise-btn, .stat-card-animate"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      )
    }

    // Stat cards stagger
    const statCards = document.querySelectorAll(".stat-card-animate")
    if (statCards.length) {
      gsap.fromTo(
        statCards,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, delay: 0.5, ease: "back.out" }
      )
    }

    // Pilars scroll trigger
    pilarsRef.current?.forEach((el, idx) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              markers: false,
            },
          }
        )
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="enterprise-home-v2">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-container">
        <div className="hero-bg-gradient" />
        
        <div className="container mx-auto max-w-7xl px-6 py-24 lg:py-32 relative z-10">

          <h1 className="hero-title mt-8 max-w-5xl">
            Formação orientada a
            <span className="hero-highlight"> resultados expeditos</span> com
            <span className="hero-highlight"> visão empresarial</span>
          </h1>

          <p className="hero-subtitle mt-7 max-w-2xl">
            O IEPI conecta excelência acadêmica, prática clínica e gestão estratégica para preparar profissionais capazes de transformar realidades institucionais.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/cursos" className="hero-btn hero-btn-primary">
              Explore o portfólio <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contato" className="hero-btn hero-btn-secondary">
              Falar com consultoria
            </Link>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {indicadores.map(({ label, value, hint, icon: Icon }) => (
              <div key={label} className="stat-card-animate stat-card group">
                <div className="flex items-start justify-between mb-2">
                  <p className="stat-label">{label}</p>
                  <Icon className="stat-icon group-hover:scale-110 transition-transform" />
                </div>
                <p className="stat-value">{value}</p>
                <p className="stat-hint">{hint}</p>
                <div className="stat-accent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilars Section */}
      <section className="pilars-section">
        <div className="container mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
              Estrutura educacional para crescimento sustentável
            </h2>
            <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
              Um modelo acadêmico orientado por dados, eficiência operacional e impacto permanente.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pilares.map((pilar, idx) => {
              const IconComponent = pilar.icon
              return (
                <div
                  key={pilar.title}
                  ref={(el) => {
                    if (el) pilarsRef.current[idx] = el
                  }}
                  className="pilar-card group"
                >
                  <div className="pilar-accent" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-slate-700" />
                    </div>
                    <h3 className="pilar-title">{pilar.title}</h3>
                    <p className="pilar-desc">{pilar.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Governance & Events Section */}
      <section className="governance-section">
        <div className="container mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Governance Card */}
            <div className="governance-card">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <p className="text-xs font-semibold text-purple-600 tracking-wide">GOVERNANÇA ACADÊMICA</p>
              </div>
              <h3 className="governance-title">Decisão baseada em indicadores reais</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span className="text-slate-700">Controle de frequência e desempenho por turma</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span className="text-slate-700">Gestão integrada entre áreas pedagógica e financeira</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span className="text-slate-700">Planejamento acadêmico com visão trimestral</span>
                </li>
              </ul>
            </div>

            {/* Events Card */}
            <div className="governance-card">
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="w-5 h-5 text-orange-600" />
                <p className="text-xs font-semibold text-orange-600 tracking-wide">AGENDA INSTITUCIONAL</p>
              </div>
              <h3 className="governance-title">Próximos marcos estratégicos</h3>
              <div className="mt-6 space-y-3">
                {[
                  { titulo: "Conselho pedagógico", data: "14/03 · 09:00" },
                  { titulo: "Fechamento de AV1", data: "18/03 · 23:59" },
                  { titulo: "Comitê de retenção", data: "22/03 · 10:30" },
                ].map((evento) => (
                  <div key={evento.titulo} className="event-item group">
                    <p className="event-title">{evento.titulo}</p>
                    <p className="event-time">{evento.data}</p>
                    <div className="event-line" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container mx-auto max-w-2xl px-6 py-16 lg:py-20">
          <div className="cta-card">
            <h3 className="cta-title">Modernizar sua jornada educacional agora?</h3>
            <p className="cta-subtitle">
              Conheça os programas do IEPI e implemente uma experiência acadêmica com padrão estratégico.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/cursos" className="hero-btn hero-btn-primary">
                Explorar cursos
              </Link>
              <Link href="/login" className="hero-btn hero-btn-secondary">
                Acessar portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
