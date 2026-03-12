"use client"

import Link from "next/link"
import React, { useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

/* Custom word-splitter for the animation */
function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden mr-[0.22em]">
      <span className="word-inner inline-block">{word}</span>
    </span>
  ))
}

/* ── B. HERO SECTION (A Cena de Abertura) ──────────────────────────── */
function HeroSection() {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(".hero-elem", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2
    })
  }, { scope: container })

  return (
    <section
      ref={container}
      className="relative min-h-[100dvh] flex items-end pb-32 pt-32 overflow-hidden"
      style={{ backgroundColor: "var(--iepi-dark)" }}
    >
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2960&auto=format&fit=crop')", // floresta escura, laboratório
          backgroundPosition: "center 20%"
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[var(--iepi-dark)] via-[#0d0525]/80 to-transparent" />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="max-w-3xl">
          <p className="hero-elem font-sans font-bold text-white text-xl sm:text-2xl mb-2 tracking-tight">
            A verdadeira excelência clínica é a
          </p>
          <h1 className="hero-elem font-serif italic text-7xl sm:text-[9rem] leading-[0.9] text-white mb-8 tracking-tighter pr-4">
            Prática.
          </h1>
          <p className="hero-elem font-sans text-base sm:text-lg mb-10 max-w-lg text-[#F2F0E9]/80 leading-relaxed font-light">
            O IEPI conecta o conhecimento acadêmico avançado à realidade hospitalar. Pós-graduações e cursos de extensão com professores que respiram o dia a dia clínico.
          </p>

          <div className="hero-elem flex flex-wrap gap-4">
            <Link
              href="/cursos"
              className="inline-flex items-center text-sm font-bold px-8 py-4 rounded-[2rem] text-white transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "#CC5833", transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
            >
              Conhecer a Metodologia
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── C. FEATURES SECTION (Artefatos Funcionais Interativos) ──────────── */

function FeatureCard1() {
  const [items, setItems] = useState([
    { id: 1, text: "100% Mestres e Doutores" },
    { id: 2, text: "Atuação Hospitalar Ativa" },
    { id: 3, text: "Pesquisadores Publicados" },
  ])

  useEffect(() => {
    const int = setInterval(() => {
      setItems(prev => {
        const next = [...prev]
        const last = next.pop()
        if (last) next.unshift(last)
        return next
      })
    }, 3000)
    return () => clearInterval(int)
  }, [])

  return (
    <div className="h-full bg-[var(--iepi-white)] rounded-[2rem] p-8 border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300">
      <h3 className="font-sans font-bold text-xl mb-3 text-[var(--iepi-dark)] tracking-tight">Corpo Docente de Elite</h3>
      <p className="text-sm text-[var(--iepi-dark)]/60 mb-8 font-light leading-relaxed">Não apenas ensinamos; praticamos. Mestres e doutores com atuação clínica real em hospitais.</p>

      <div className="relative h-40">
        {items.map((item, i) => {
          const isTop = i === 0
          const scale = 1 - i * 0.05
          const y = i * 16
          const opacity = 1 - i * 0.3
          return (
            <div
              key={item.id}
              className="absolute top-0 left-0 w-full p-4 rounded-[1.25rem] font-mono text-[11px] flex items-center justify-between"
              style={{
                backgroundColor: isTop ? "var(--iepi-dark)" : "#f5f3fb",
                color: isTop ? "#fff" : "var(--iepi-dark)",
                border: isTop ? "none" : "1px solid rgba(0,0,0,0.05)",
                transform: `translateY(${y}px) scale(${scale})`,
                opacity: opacity,
                zIndex: 10 - i,
                transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
            >
              <span>{item.text}</span>
              {isTop && <span className="w-2 h-2 rounded-full bg-[#CC5833]" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FeatureCard2() {
  const [text, setText] = useState("")
  const fullText = "> Iniciando estágio supervisionado...\n> Conectando ao Hospital Universitário...\n> Protocolo clínico: ATIVO\n> Acesso a alas de alta complexidade: PERMITIDO"

  useEffect(() => {
    let index = 0
    let timer: any

    const startTyping = () => {
      setText("")
      index = 0
      timer = setInterval(() => {
        setText(fullText.slice(0, index))
        index++
        if (index > fullText.length) {
          clearInterval(timer)
          setTimeout(startTyping, 4000)
        }
      }, 40)
    }

    startTyping()
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-full bg-[var(--iepi-white)] rounded-[2rem] p-8 border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans font-bold text-xl text-[var(--iepi-dark)] tracking-tight">Campo Prático Real</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#CC5833] animate-pulse" />
          <span className="font-mono text-[10px] text-[#CC5833] uppercase">Live Feed</span>
        </div>
      </div>
      <p className="text-sm text-[var(--iepi-dark)]/60 mb-6 font-light leading-relaxed">Convênios exclusivos com UPAs e referências privadas para uma imersão completa.</p>

      <div className="bg-[#1A1A1A] mt-auto rounded-[1.25rem] p-4 h-36 font-mono text-[10px] sm:text-xs text-[#F2F0E9] whitespace-pre-wrap flex flex-col justify-end overflow-hidden shadow-inner">
        <span>{text}<span className="inline-block w-1.5 h-3 bg-[#CC5833] animate-pulse align-middle ml-1" /></span>
      </div>
    </div>
  )
}

function FeatureCard3() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
    tl.to(".fake-cursor", { x: 45, y: 30, duration: 1, ease: "power2.inOut" })
      .to(".day-cell-2", { scale: 0.9, duration: 0.1 })
      .to(".day-cell-2", { backgroundColor: "#CC5833", color: "#fff", borderColor: "#CC5833", scale: 1, duration: 0.1 })
      .to(".fake-cursor", { x: 140, y: 30, duration: 0.8, ease: "power2.inOut" })
      .to(".day-cell-5", { scale: 0.9, duration: 0.1 })
      .to(".day-cell-5", { backgroundColor: "#CC5833", color: "#fff", borderColor: "#CC5833", scale: 1, duration: 0.1 })
      .to(".fake-cursor", { x: 90, y: 95, duration: 0.8, ease: "power2.inOut" })
      .to(".save-btn", { scale: 0.97, duration: 0.1 })
      .to(".save-btn", { scale: 1, duration: 0.1 })
      .to(".day-cell-2, .day-cell-5", { backgroundColor: "#FFF", borderColor: "rgba(0,0,0,0.05)", color: "var(--iepi-dark)", duration: 0.5, delay: 1 })
      .to(".fake-cursor", { x: 0, y: 0, duration: 0.5, opacity: 0 }, "-=0.5")
      .to(".fake-cursor", { opacity: 1, duration: 0.1 })
  }, { scope: container })

  const days = ["D", "S", "T", "Q", "Q", "S", "S"]

  return (
    <div className="h-full bg-[var(--iepi-white)] rounded-[2rem] p-8 border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <h3 className="font-sans font-bold text-xl mb-3 text-[var(--iepi-dark)] tracking-tight">Agenda Híbrida</h3>
      <p className="text-sm text-[var(--iepi-dark)]/60 mb-6 font-light leading-relaxed">Turmas matutinas, vespertinas ou noturnas adaptadas à sua escala de plantões e rotina.</p>

      <div ref={container} className="relative mt-auto h-40 bg-[#f5f3fb] rounded-[1.25rem] p-4 overflow-hidden border border-black/5 shadow-inner">
        <div className="grid grid-cols-7 gap-[2px] sm:gap-1.5 mb-4">
          {days.map((d, i) => (
            <div key={i} className={`day-cell-${i} aspect-square rounded bg-white border border-black/5 flex items-center justify-center font-mono text-[9px] sm:text-[10px] text-[var(--iepi-dark)]`}>
              {d}
            </div>
          ))}
        </div>
        <div className="save-btn w-full bg-[var(--iepi-dark)] text-white font-mono text-[10px] py-2.5 rounded-lg text-center uppercase tracking-widest shadow-md">
          Confirmar Grade
        </div>

        {/* Fake Cursor SVG */}
        <div className="fake-cursor absolute top-[5px] left-[5px] z-10 will-change-transform" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3L18.5 10L12 12.5L9.5 20L5.5 3Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section className="py-32 bg-[#F2F0E9] rounded-t-[3rem] -mt-8 relative z-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FeatureCard1 />
          <FeatureCard2 />
          <FeatureCard3 />
        </div>
      </div>
    </section>
  )
}

/* ── D. FILOSOFIA (O Manifesto) ──────────────────────────────────────── */
function FilosofiaSection() {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.to(".parallax-bg", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    gsap.from(".reveal-neutral .word-inner", {
      yPercent: 100,
      opacity: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".reveal-neutral",
        start: "top 80%",
      }
    })

    gsap.from(".reveal-drama .word-inner", {
      yPercent: 100,
      opacity: 0,
      stagger: 0.04,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".reveal-drama",
        start: "top 75%",
      }
    })

  }, { scope: container })

  return (
    <section ref={container} className="relative py-40 sm:py-56 overflow-hidden bg-[#1A1A1A] rounded-t-[3rem] -mt-8 z-30">
      <div
        className="parallax-bg absolute inset-[-15%] z-0 bg-cover bg-center opacity-[0.15] mix-blend-luminosity"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614935151651-0bea6508ab53?q=80&w=2600&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#1A1A1A]/80 via-transparent to-[#1A1A1A]/90" />

      <div className="container relative z-20 mx-auto px-6 max-w-4xl text-center">
        <p className="reveal-neutral font-sans text-xl sm:text-2xl text-[#F2F0E9]/60 font-light mb-6 tracking-tight leading-relaxed">
          {splitWords("A maioria das instituições foca apenas em emitir um certificado para colocar na parede.")}
        </p>
        <h2 className="reveal-drama font-serif italic text-5xl sm:text-7xl md:text-[6rem] text-[#F2F0E9] leading-none tracking-tighter">
          {splitWords("Nós focamos em construir a sua ")}
          <span className="text-[#CC5833] inline-block overflow-hidden pb-2"><span className="word-inner inline-block">Autoridade.</span></span>
        </h2>
      </div>
    </section>
  )
}

/* ── E. PROTOCOLO (Arquivo Empilhável Sticky) ────────────────────────── */
function ProtocoloSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      num: "01",
      title: "Fundamentação Teórica Exata",
      desc: "Análise profunda das diretrizes de saúde atualizadas pelos Conselhos Internacionais e Ministério da Saúde.",
      bg: "#2E4036", color: "#F2F0E9"
    },
    {
      num: "02",
      title: "Simulação Realística",
      desc: "Treinamento intensivo utilizando robôs de alta fidelidade e discussão de casos complexos para reflexo neuromuscular.",
      bg: "#1d2922", color: "#F2F0E9"
    },
    {
      num: "03",
      title: "Atuação em Estágio Clínico",
      desc: "Validação da conduta técnica dentro dos maiores hospitais da região. Você assumindo o controle da situação médica.",
      bg: "#101612", color: "#F2F0E9"
    }
  ]

  useGSAP(() => {
    const cards = gsap.utils.toArray(".protocol-card")

    cards.forEach((card: any, i: number) => {
      if (i === cards.length - 1) return;

      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: cards[i + 1] as Element,
        end: "top top",
        scrub: true,
        animation: gsap.to(card, {
          scale: 0.92,
          opacity: 0.3,
          filter: "blur(12px)",
          ease: "none",
          transformOrigin: "top center"
        })
      });
    });
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="bg-[#1A1A1A] pb-40">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="pt-20 pb-16 text-center sm:text-left">
          <p className="font-mono text-[#CC5833] text-xs font-bold uppercase tracking-[0.2em] mb-4">Sistemática do IEPI</p>
          <h2 className="font-sans font-bold text-4xl sm:text-5xl text-[#F2F0E9] tracking-tight">O Protocolo de Evolução</h2>
        </div>

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="protocol-card min-h-[75vh] flex items-center sticky top-0"
              style={{
                backgroundColor: step.bg,
                color: step.color,
                borderRadius: "3rem",
                marginTop: i === 0 ? "0" : "2rem",
                top: `${(i + 1) * 1.5}rem`,
                boxShadow: "0 -30px 60px rgba(0,0,0,0.4)"
              }}
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 p-10 sm:p-16 lg:p-24 items-center">
                <div className="order-2 md:order-1">
                  <span className="font-mono text-7xl lg:text-[7rem] opacity-20 font-bold mb-6 block leading-none tracking-tighter">{step.num}</span>
                  <h3 className="font-serif italic text-4xl lg:text-5xl mb-6 leading-[1.1]">{step.title}</h3>
                  <p className="font-sans text-base lg:text-lg font-light opacity-80 max-w-md leading-relaxed">{step.desc}</p>
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 border-[1.5px] border-white/20 rounded-full flex items-center justify-center animate-[spin_24s_linear_infinite]">
                    <div className="w-3/4 h-3/4 border-[1.5px] border-white/30 rounded-full flex items-center justify-center animate-[spin_16s_linear_infinite_reverse]">
                      <div className="w-1/2 h-1/2 bg-[#CC5833] rounded-full blur-[40px] opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── F. PLANOS / CURSOS ──────────────────────────────────────────────── */
function CursosSection() {
  return (
    <section className="py-32 sm:py-48 bg-[#F2F0E9] rounded-t-[4rem] relative z-40 -mt-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center mb-24 text-center">
          <h2 className="font-sans font-bold text-4xl sm:text-5xl text-[var(--iepi-dark)] mb-4 tracking-tight">Seu Próximo Passo</h2>
          <p className="font-serif text-2xl sm:text-3xl text-[var(--iepi-dark)]/70 italic">O nível ideal de aprofundamento para sua carreira.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] p-10 border border-black/5 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="font-sans font-bold text-2xl mb-2 text-[var(--iepi-dark)] tracking-tight">Cursos Livres</h3>
            <p className="text-sm font-light text-[var(--iepi-dark)]/60 mb-12 max-w-[200px] leading-relaxed">Capacitações rápidas e objetivas em emergência e rotina clínica.</p>
            <div className="mt-auto mb-10">
              <span className="font-mono text-[10px] text-[var(--iepi-dark)]/50 uppercase tracking-widest block mb-1">A partir de</span>
              <span className="font-sans text-4xl font-bold tracking-tighter text-[var(--iepi-dark)]">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(699 / 6)}
              </span>
              <span className="text-xs text-[var(--iepi-dark)]/50 ml-1">/mês</span>
            </div>
            <Link href="/cursos" className="w-full border border-[var(--iepi-dark)]/20 hover:border-[#CC5833] hover:text-[#CC5833] text-[var(--iepi-dark)] text-sm font-bold text-center py-4 rounded-[2rem] transition-colors">
              Ver Catálogo
            </Link>
          </div>

          {/* Card 2 - Highlight */}
          <div className="bg-[var(--iepi-dark)] rounded-[2.5rem] p-10 shadow-2xl flex flex-col md:-mt-8 md:mb-8 relative overflow-hidden ring-4 ring-black/5 z-10 transition-all duration-300 hover:shadow-3xl hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#CC5833] blur-[120px] opacity-40 rounded-full translate-x-1/3 -translate-y-1/4" />
            <span className="absolute top-6 right-8 px-4 py-1.5 bg-[#CC5833]/20 text-[#CC5833] rounded-[2rem] text-[9.5px] font-bold uppercase tracking-widest backdrop-blur-md">
              Mais Procurado
            </span>
            <h3 className="font-sans font-bold text-3xl mb-3 text-white relative z-10 tracking-tight">Pós-Graduação</h3>
            <p className="text-base font-light text-white/70 mb-12 max-w-[240px] relative z-10 leading-relaxed">Especializações completas para liderar em hospitais de alta complexidade.</p>
            <div className="mt-auto mb-10 relative z-10">
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-1">12 ou 18 meses</span>
              <span className="font-sans text-5xl font-bold tracking-tighter text-white">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(1599 / 12)}
              </span>
              <span className="text-xs text-white/50 ml-1">/mês</span>
            </div>
            <Link href="/cursos" className="w-full bg-[#CC5833] hover:bg-[#b04a29] text-white text-sm font-bold text-center py-5 rounded-[2.5rem] transition-all relative z-10 shadow-lg shadow-[#CC5833]/20 hover:shadow-[#CC5833]/40">
              Explorar Especializações
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-10 border border-black/5 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="font-sans font-bold text-2xl mb-2 text-[var(--iepi-dark)] tracking-tight">MBA Executivo</h3>
            <p className="text-sm font-light text-[var(--iepi-dark)]/60 mb-12 max-w-[200px] leading-relaxed">Para gestão de clínicas, hospitais e unidades prisionais de ponta.</p>
            <div className="mt-auto mb-10">
              <span className="font-mono text-[10px] text-[var(--iepi-dark)]/50 uppercase tracking-widest block mb-1">Acesso Direto</span>
              <span className="font-sans text-4xl font-bold tracking-tighter text-[var(--iepi-dark)]">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(1999 / 12)}
              </span>
              <span className="text-xs text-[var(--iepi-dark)]/50 ml-1">/mês</span>
            </div>
            <Link href="/cursos" className="w-full border border-[var(--iepi-dark)]/20 hover:border-[#CC5833] hover:text-[#CC5833] text-[var(--iepi-dark)] text-sm font-bold text-center py-4 rounded-[2rem] transition-colors">
              Detalhes do MBA
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PAGE EXPORT ─────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FilosofiaSection />
      <ProtocoloSection />
      <CursosSection />
    </>
  )
}
