"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { CATALOG, formatPrice, type CatalogCourse, type CourseType } from "@/lms/data/catalog"

/* ── constants ────────────────────────────────────────────────────────── */
const PAGE_SIZE = 10
const TYPE_FILTERS: Array<CourseType | "Todos"> = [
    "Todos", "Curso Livre", "Especialização", "Pós-Graduação", "Graduação", "Residência",
]
const INSTRUCTOR_FILTERS = ["Todos", "Técnicos de Enfermagem", "Enfermeiros", "Enfermeiros e Enfermandos"]

/* ── tiny svg icon helper ─────────────────────────────────────────────── */
function Ico({ d, cls = "w-3.5 h-3.5 shrink-0" }: { d: string; cls?: string }) {
    return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    )
}
const P = {
    clock:    "M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
    users:    "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    cal:      "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    sun:      "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
    check:    "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    search:   "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
    chevL:    "M15.75 19.5 8.25 12l7.5-7.5",
    chevR:    "M8.25 4.5l7.5 7.5-7.5 7.5",
}

/* ── course card ───────────────────────────────────────────────────────── */
function CourseCard({ c }: { c: CatalogCourse }) {
    return (
        <div
            className="card-lift flex flex-col rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
            {/* Orange header */}
            <div className="bg-orange-500 p-4 min-h-[76px] flex items-start">
                <h3 className="text-white font-extrabold text-sm leading-snug">{c.title}</h3>
            </div>

            {/* Image placeholder */}
            <div className="h-28 flex items-center justify-center overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <svg className="w-10 h-10" style={{ color: "rgba(255,255,255,0.12)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                    </svg>
                )}
            </div>

            {/* Metadata rows */}
            <div className="flex flex-col gap-2 px-4 pt-4 pb-2 text-xs flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                <div className="flex items-center gap-2"><Ico d={P.clock} />{c.hours}</div>
                <div className="flex items-center gap-2"><Ico d={P.users} />{c.instructor}</div>
                <div className="flex items-center gap-2"><Ico d={P.cal} />{c.startDate} – {c.endDate}</div>
                <div className="flex items-center gap-2"><Ico d={P.sun} />{c.schedule}</div>
                {c.corenRequired && (
                    <div className="flex items-center gap-2 text-green-400">
                        <Ico d={P.check} />COREN Ativo
                    </div>
                )}
            </div>

            {/* Price + CTA */}
            <div className="px-4 pb-4 pt-2">
                <p className="text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {c.maxInstallments}x de {formatPrice(Math.round(c.price / c.maxInstallments))} sem juros
                </p>
                <Link
                    href={`/cursos/${c.id}`}
                    className="block w-full text-center py-2.5 text-xs font-extrabold text-white rounded-lg uppercase tracking-wide transition-colors hover:bg-orange-500"
                    style={{ backgroundColor: "var(--iepi-navy-dark)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                    Inscreva&#8209;se
                </Link>
            </div>
        </div>
    )
}

/* ── page ─────────────────────────────────────────────────────────────── */
export default function CursosPage() {
    const [search, setSearch]               = useState("")
    const [typeFilter, setTypeFilter]       = useState<CourseType | "Todos">("Todos")
    const [instrFilter, setInstrFilter]     = useState("Todos")
    const [page, setPage]                   = useState(1)

    const filtered = useMemo(() => CATALOG.filter(c => {
        const q = search.toLowerCase()
        return (
            (c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)) &&
            (typeFilter === "Todos" || c.type === typeFilter) &&
            (instrFilter === "Todos" || c.instructor === instrFilter)
        )
    }), [search, typeFilter, instrFilter])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    function go(p: number) {
        setPage(Math.min(Math.max(1, p), totalPages))
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function reset() {
        setSearch(""); setTypeFilter("Todos"); setInstrFilter("Todos"); setPage(1)
    }

    const dirty = search || typeFilter !== "Todos" || instrFilter !== "Todos"

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--iepi-navy)" }}>

            {/* ── Sticky toolbar ──────────────────────────────────────── */}
            <div
                className="sticky top-16 z-40 px-4 py-4 border-b border-white/10 shadow-lg"
                style={{ backgroundColor: "var(--iepi-navy-dark)" }}
            >
                <div className="container mx-auto max-w-7xl">
                    <h1 className="text-2xl font-extrabold text-white mb-4">Cursos</h1>

                    <div className="flex flex-wrap items-center gap-2">

                        {/* Search */}
                        <div className="relative flex-1 min-w-[175px] max-w-xs">
                            <Ico d={P.search} cls="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                            <input
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1) }}
                                placeholder="Buscar curso..."
                                className="w-full pl-9 pr-3 py-2 text-xs text-white placeholder-white/35 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                            />
                        </div>

                        {/* Type */}
                        <select
                            value={typeFilter}
                            onChange={e => { setTypeFilter(e.target.value as CourseType | "Todos"); setPage(1) }}
                            className="px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                            {TYPE_FILTERS.map(f => <option key={f} value={f}>{f === "Todos" ? "Tipo de Curso" : f}</option>)}
                        </select>

                        {/* Target audience */}
                        <select
                            value={instrFilter}
                            onChange={e => { setInstrFilter(e.target.value); setPage(1) }}
                            className="px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                            {INSTRUCTOR_FILTERS.map(f => <option key={f} value={f}>{f === "Todos" ? "Público-Alvo" : f}</option>)}
                        </select>

                        {/* Pill shortcuts (lg+) */}
                        {TYPE_FILTERS.filter(f => f !== "Todos").map(f => (
                            <button
                                key={f}
                                onClick={() => { setTypeFilter(typeFilter === f ? "Todos" : f as CourseType); setPage(1) }}
                                className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                                style={{
                                    backgroundColor: typeFilter === f ? "#f97316" : "rgba(255,255,255,0.07)",
                                    color: typeFilter === f ? "#fff" : "rgba(255,255,255,0.5)",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                }}
                            >
                                {f}
                            </button>
                        ))}

                        {dirty && (
                            <button
                                onClick={reset}
                                className="ml-auto text-xs underline underline-offset-2 transition-colors"
                                style={{ color: "rgba(255,255,255,0.45)" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Grid ─────────────────────────────────────────────────── */}
            <section className="flex-1 py-10 px-4">
                <div className="container mx-auto max-w-7xl">

                    <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.38)" }}>
                        {filtered.length} {filtered.length === 1 ? "curso encontrado" : "cursos encontrados"}
                        {typeFilter !== "Todos" && <> para <span className="text-orange-400 font-semibold">"{typeFilter}"</span></>}
                    </p>

                    {paginated.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-lg" style={{ color: "rgba(255,255,255,0.35)" }}>Nenhum curso encontrado.</p>
                            <button onClick={reset} className="mt-4 text-sm text-orange-400 hover:text-orange-300 underline">Limpar filtros</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                            {paginated.map(c => <CourseCard key={c.id} c={c} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-12">
                            <button
                                onClick={() => go(page - 1)} disabled={page === 1}
                                className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-25 transition-colors text-white hover:bg-orange-500"
                                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                            >
                                <Ico d={P.chevL} cls="w-3.5 h-3.5" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p} onClick={() => go(p)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    style={{
                                        backgroundColor: p === page ? "#f97316" : "transparent",
                                        color: p === page ? "#fff" : "rgba(255,255,255,0.45)",
                                        border: "1px solid rgba(255,255,255,0.15)"
                                    }}
                                >{p}</button>
                            ))}

                            <button
                                onClick={() => go(page + 1)} disabled={page === totalPages}
                                className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-25 transition-colors text-white hover:bg-orange-500"
                                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                            >
                                <Ico d={P.chevR} cls="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

        </div>
    )
}
