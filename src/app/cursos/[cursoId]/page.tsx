import { notFound } from "next/navigation"
import Link from "next/link"
import { CATALOG, formatPrice } from "@/lms/data/catalog"

/* ── types ───────────────────────────────────────────────────────────── */
interface Props { params: Promise<{ cursoId: string }> }

/* ── helpers ─────────────────────────────────────────────────────────── */
function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-white/8">
            <span className="mt-0.5 text-base leading-none" style={{ color: "var(--iepi-cyan)" }}>{icon}</span>
            <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {label}
                </p>
                <p className="text-sm text-white font-medium">{value}</p>
            </div>
        </div>
    )
}

/* ── page ─────────────────────────────────────────────────────────────── */
export default async function CourseDetailPage({ params }: Props) {
    const { cursoId } = await params
    const course = CATALOG.find(c => c.id === cursoId)
    if (!course) notFound()

    const installmentPrice = formatPrice(Math.round(course.price / course.maxInstallments))
    const totalPrice       = formatPrice(course.price)

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--iepi-navy)" }}>

            {/* ── Hero ───────────────────────────────────────────────── */}
            <section
                className="py-16 px-4 border-b border-white/10"
                style={{ backgroundColor: "var(--iepi-navy-dark)" }}
            >
                <div className="container mx-auto max-w-5xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <Link href="/" className="hover:text-white transition-colors">Início</Link>
                        <span>/</span>
                        <Link href="/cursos" className="hover:text-white transition-colors">Cursos</Link>
                        <span>/</span>
                        <span className="font-semibold truncate max-w-[200px]" style={{ color: "var(--iepi-pink)" }}>{course.title}</span>
                    </nav>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                            style={{ backgroundColor: "rgba(108,30,217,0.2)", color: "var(--iepi-pink)", border: "1px solid rgba(108,30,217,0.3)" }}
                        >
                            {course.type}
                        </span>
                        {course.corenRequired && (
                            <span
                                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                                style={{ backgroundColor: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}
                            >
                                COREN Ativo
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                        {course.title}
                    </h1>
                    <p className="text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>{course.description}</p>
                </div>
            </section>

            {/* ── Content ────────────────────────────────────────────── */}
            <section className="flex-1 py-12 px-4">
                <div className="container mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Thumbnail placeholder */}
                        <div
                            className="w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden"
                            style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            {course.imageUrl ? (
                                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-70" />
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-12 h-12" style={{ color: "rgba(255,255,255,0.1)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                                    </svg>
                                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Imagem em breve</span>
                                </div>
                            )}
                        </div>

                        {/* Sobre o curso */}
                        <div
                            className="rounded-2xl p-6"
                            style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <h2 className="text-lg font-extrabold text-white mb-4">Sobre o curso</h2>
                            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                                {course.description}
                            </p>
                        </div>

                        {/* Recursos */}
                        <div
                            className="rounded-2xl p-6"
                            style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <h2 className="text-lg font-extrabold text-white mb-4">O que você terá acesso</h2>
                            <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                                {[
                                    "Material didático exclusivo em PDF",
                                    "Videoaulas gravadas + aulas ao vivo",
                                    "Acesso por 12 meses após o término",
                                    "Certificado reconhecido pelo COREN",
                                    "Suporte direto com o docente",
                                    "Plataforma 100% online",
                                ].map(item => (
                                    <li key={item} className="flex items-center gap-2">
                                        <svg className="w-4 h-4 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: sticky card */}
                    <aside className="lg:col-span-1">
                        <div
                            className="rounded-2xl p-6 sticky top-24"
                            style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            {/* Price */}
                            <div className="mb-5">
                                <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Investimento</p>
                                <p className="text-3xl font-extrabold" style={{ color: "var(--iepi-pink)" }}>{totalPrice}</p>
                                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                                    ou {course.maxInstallments}x de {installmentPrice} sem juros
                                </p>
                            </div>

                            {/* Meta rows */}
                            <div className="mb-6">
                                <Row icon="⏱" label="Carga Horária" value={course.hours} />
                                <Row icon="👥" label="Público-Alvo" value={course.instructor} />
                                <Row icon="📅" label="Período" value={`${course.startDate} – ${course.endDate}`} />
                                <Row icon="🌅" label="Turno" value={course.schedule} />
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/checkout/${course.id}`}
                                className="block w-full text-center py-3.5 font-extrabold text-white rounded-xl text-sm uppercase tracking-wide transition-all hover:scale-[1.02] hover:shadow-lg"
                                style={{ background: "var(--g-brand)" }}
                            >
                                Inscreva-se agora
                            </Link>

                            <Link
                                href="/cursos"
                                className="block w-full text-center mt-3 text-xs py-2 rounded-lg transition-colors hover:text-white"
                                style={{ color: "rgba(255,255,255,0.4)" }}
                            >
                                ← Voltar aos cursos
                            </Link>
                        </div>
                    </aside>

                </div>
            </section>
        </div>
    )
}
