import { notFound } from "next/navigation"
import Link from "next/link"
import { CATALOG, formatPrice } from "@/lms/data/catalog"

interface Props { params: Promise<{ cursoId: string }> }

function IconClock()    { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg> }
function IconCalendar() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg> }
function IconSun()      { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg> }
function IconUser()     { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"/></svg> }
function IconCheck()    { return <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg> }
function IconBadge()    { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg> }

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 py-3.5" style={{ borderBottom: "1px solid var(--border-light)" }}>
            <span className="shrink-0 mt-0.5" style={{ color: "var(--iepi-purple)" }}>{icon}</span>
            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    {label}
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
                    {value}
                </span>
            </div>
        </div>
    )
}

export default async function CourseDetailPage({ params }: Props) {
    const { cursoId } = await params
    const course = CATALOG.find(c => c.id === cursoId)
    if (!course) notFound()

    const installmentPrice = formatPrice(Math.round(course.price / course.maxInstallments))
    const totalPrice       = formatPrice(course.price)

    const INCLUDED = [
        "Material didático exclusivo em PDF",
        "Videoaulas gravadas + aulas ao vivo",
        "Acesso por 12 meses após o término",
        "Certificado reconhecido pelo COREN",
        "Suporte direto com o docente",
        "Plataforma 100% online",
    ]

    return (
        <div style={{ backgroundColor: "var(--iepi-light-alt)" }}>

            {/* HERO */}
            <section style={{ backgroundColor: "var(--iepi-dark)", borderBottom: "3px solid var(--iepi-purple)" }}>
                <div className="container mx-auto max-w-5xl px-6 py-14">
                    <nav className="flex items-center gap-2 text-xs mb-7 flex-wrap" style={{ color: "rgba(255,255,255,0.38)" }}>
                        <Link href="/" className="hover:text-white transition-colors">Início</Link>
                        <span>/</span>
                        <Link href="/cursos" className="hover:text-white transition-colors">Cursos</Link>
                        <span>/</span>
                        <span className="font-semibold" style={{ color: "var(--iepi-pink)" }}>{course.title}</span>
                    </nav>

                    <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span
                            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
                            style={{ backgroundColor: "var(--iepi-purple)", color: "#fff" }}
                        >
                            {course.type}
                        </span>
                        {course.corenRequired && (
                            <span
                                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
                                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.15)" }}
                            >
                                COREN Ativo exigido
                            </span>
                        )}
                    </div>

                    <h1
                        className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        {course.title}
                    </h1>
                    <p className="text-base max-w-2xl" style={{ color: "var(--text-on-dark-muted)" }}>
                        {course.description}
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-14">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* Left */}
                        <div className="lg:col-span-2 flex flex-col gap-6">

                            {/* Image */}
                            <div
                                className="w-full rounded-xl overflow-hidden flex items-center justify-center"
                                style={{ aspectRatio: "16/9", backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}
                            >
                                {course.imageUrl ? (
                                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-10 h-10" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                                        </svg>
                                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Imagem em breve</span>
                                    </div>
                                )}
                            </div>

                            {/* Sobre */}
                            <div className="rounded-xl p-6" style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}>
                                <h2 className="text-lg font-extrabold mb-3" style={{ color: "var(--text-heading)" }}>Sobre o curso</h2>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>{course.description}</p>
                            </div>

                            {/* Detalhes */}
                            <div className="rounded-xl p-6" style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}>
                                <h2 className="text-lg font-extrabold mb-1" style={{ color: "var(--text-heading)" }}>Informações do curso</h2>
                                <MetaItem icon={<IconClock />}    label="Carga Horária" value={course.hours} />
                                <MetaItem icon={<IconUser />}     label="Público-Alvo"  value={course.instructor} />
                                <MetaItem icon={<IconCalendar />} label="Início"        value={course.startDate} />
                                <MetaItem icon={<IconCalendar />} label="Término"       value={course.endDate} />
                                <MetaItem icon={<IconSun />}      label="Turno"         value={course.schedule} />
                                <MetaItem icon={<IconBadge />}    label="Modalidade"    value={course.type} />
                            </div>

                            {/* Incluídos */}
                            <div className="rounded-xl p-6" style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}>
                                <h2 className="text-lg font-extrabold mb-4" style={{ color: "var(--text-heading)" }}>O que você terá acesso</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                                    {INCLUDED.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-body)" }}>
                                            <span style={{ color: "var(--iepi-purple)" }}><IconCheck /></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right sticky card */}
                        <aside className="lg:col-span-1">
                            <div
                                className="rounded-xl p-6 sticky top-24"
                                style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                            >
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Investimento</p>
                                <p className="text-3xl font-extrabold mb-0.5" style={{ color: "var(--text-heading)", letterSpacing: "-0.02em" }}>{totalPrice}</p>
                                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                                    ou {course.maxInstallments}x de {installmentPrice} sem juros
                                </p>

                                <hr style={{ borderColor: "var(--border-light)", marginBottom: "1.25rem" }} />

                                <ul className="space-y-3 mb-6">
                                    {[
                                        { icon: <IconClock />,    label: course.hours           },
                                        { icon: <IconCalendar />, label: `Início ${course.startDate}` },
                                        { icon: <IconSun />,      label: course.schedule        },
                                        { icon: <IconUser />,     label: course.instructor      },
                                    ].map(({ icon, label }) => (
                                        <li key={label} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-body)" }}>
                                            <span style={{ color: "var(--iepi-purple)" }}>{icon}</span>
                                            {label}
                                        </li>
                                    ))}
                                    {course.corenRequired && (
                                        <li className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-body)" }}>
                                            <span style={{ color: "var(--iepi-pink)" }}><IconBadge /></span>
                                            COREN Ativo exigido
                                        </li>
                                    )}
                                </ul>

                                <Link
                                    href={`/checkout/${course.id}`}
                                    className="block w-full text-center py-3.5 font-extrabold text-white rounded-xl text-sm tracking-wide transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: "var(--iepi-orange-light)" }}
                                >
                                    Quero me matricular
                                </Link>

                                <Link
                                    href="/cursos"
                                    className="block w-full text-center mt-3 text-xs py-2 rounded-lg transition-colors"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    ← Ver todos os cursos
                                </Link>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>

        </div>
    )
}
