import Link from "next/link"

const allCourses = Array.from({ length: 9 }).map((_, i) => ({
    id: `${i + 1}`,
    title: [
        "Gestão Estratégica em RH", "Técnico em Enfermagem", "Administração de Empresas",
        "Análise de Dados em Saúde", "Gestão Pública", "Pedagogia Hospitalar",
        "Farmácia Clínica", "Fisioterapia Esportiva", "Nutrição Clínica"
    ][i],
    type: ["Pós-Graduação","Curso Livre","Graduação","Pós-Graduação","Pós-Graduação","Curso Livre","Graduação","Pós-Graduação","Curso Livre"][i],
    hours: ["360h","240h","4 anos","360h","360h","120h","5 anos","360h","180h"][i],
    start: "02/10/2025",
    end: "10/12/2025",
    modality: "EaD / Presencial",
}))

const filters = ["Todos", "Graduação", "Pós-Graduação", "Curso Livre"]

export default function CursosPage() {
    return (
        <div className="flex flex-col" style={{ backgroundColor: "var(--iepi-navy)" }}>

            {/* Hero */}
            <section
                className="py-16 px-4 border-b border-white/10"
                style={{ backgroundColor: "var(--iepi-navy-dark)" }}
            >
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase">
                        Todos os <span className="text-orange-400">Cursos</span>
                    </h1>
                    <p className="text-white/60 text-lg mb-8">
                        Encontre a formação ideal para impulsionar sua carreira na área da saúde.
                    </p>

                    {/* Search */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                            </svg>
                            <input
                                placeholder="Buscar por nome do curso..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                            />
                        </div>
                    </div>

                    {/* Filter pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-5">
                        {filters.map((f, i) => (
                            <button
                                key={f}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                    i === 0
                                        ? "bg-orange-500 text-white"
                                        : "text-white/60 hover:text-white hover:bg-white/10 border border-white/15"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {allCourses.map((c) => (
                            <Link
                                key={c.id}
                                href={`/checkout/${c.id}`}
                                className="card-lift flex flex-col rounded-xl overflow-hidden"
                                style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                {/* thumb */}
                                <div className="h-36 relative bg-orange-900/20 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-purple-800/30" />
                                    <span className="relative z-10 px-2.5 py-1 text-[10px] font-bold bg-orange-500 text-white rounded uppercase tracking-wide">
                                        {c.type}
                                    </span>
                                </div>

                                <div className="p-4 flex flex-col gap-1.5 text-xs text-white/60 flex-1">
                                    <p className="font-bold text-white text-sm leading-snug mb-2">{c.title}</p>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg>
                                        {c.hours}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                                        Início: {c.start}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                        {c.modality}
                                    </div>
                                </div>

                                <div className="p-4 pt-0">
                                    <span className="block w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-md transition-colors">
                                        Inscreva&#8209;se
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}
