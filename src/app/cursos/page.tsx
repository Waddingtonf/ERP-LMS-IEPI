"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { CATALOG, formatPrice, type CatalogCourse, type CourseType } from "@/lms/data/catalog"

const PAGE_SIZE = 12
const TYPE_FILTERS: Array<CourseType | "Todos"> = [
    "Todos", "Curso Livre", "Especialização", "Pós-Graduação", "Graduação", "Residência",
]
const INSTRUCTOR_FILTERS = ["Todos", "Técnicos de Enfermagem", "Enfermeiros", "Enfermeiros e Enfermandos"]

/* ── ícone SVG inline ──────────────────────────────────────────────── */
function Ico({ d, cls = "w-4 h-4 shrink-0" }: { d: string; cls?: string }) {
    return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    )
}
const P = {
    clock:   "M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
    users:   "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    cal:     "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    sun:     "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
    check:   "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    search:  "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
    chevL:   "M15.75 19.5 8.25 12l7.5-7.5",
    chevR:   "M8.25 4.5l7.5 7.5-7.5 7.5",
    filter:  "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .707 1.707L13 12.414V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 17v-4.586L3.293 5.707A1 1 0 0 1 3 5V4Z",
}

/* ── badge de tipo ─────────────────────────────────────────────────── */
const TYPE_COLOR: Record<string, string> = {
    "Curso Livre":    "#0280a0",
    "Especialização": "#6C1ED9",
    "Pós-Graduação":  "#BF1FB5",
    "Graduação":      "#bf5800",
    "Residência":     "#1e7d4a",
}

/* ── CourseCard ────────────────────────────────────────────────────── */
function CourseCard({ c }: { c: CatalogCourse }) {
    const accent = TYPE_COLOR[c.type] ?? "#6C1ED9"
    return (
        <Link
            href={`/cursos/${c.id}`}
            className="card-lift flex flex-col rounded-xl overflow-hidden group"
            style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
            {/* Topo colorido com tipo + título */}
            <div className="px-4 pt-4 pb-3 flex flex-col gap-2">
                <span
                    className="self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: accent }}
                >
                    {c.type}
                </span>
                <h3 className="font-extrabold text-sm leading-snug" style={{ color: "var(--text-heading)" }}>
                    {c.title}
                </h3>
            </div>

            {/* Imagem */}
            <div
                className="mx-4 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ height: 100, backgroundColor: "var(--iepi-light-alt)", border: "1px solid var(--border-light)" }}
            >
                {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                ) : (
                    <svg className="w-8 h-8" style={{ color: "#ccc6e0" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                )}
            </div>

            {/* Metadados */}
            <div className="flex flex-col gap-1.5 px-4 pt-3 pb-2 flex-1" style={{ color: "var(--text-muted)" }}>
                <div className="flex items-center gap-2 text-xs"><Ico d={P.clock} cls="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />{c.hours}</div>
                <div className="flex items-center gap-2 text-xs"><Ico d={P.users} cls="w-3.5 h-3.5 shrink-0" />{c.instructor}</div>
                <div className="flex items-center gap-2 text-xs"><Ico d={P.cal} cls="w-3.5 h-3.5 shrink-0" />{c.startDate} – {c.endDate}</div>
                <div className="flex items-center gap-2 text-xs"><Ico d={P.sun} cls="w-3.5 h-3.5 shrink-0" />{c.schedule}</div>
                {c.corenRequired && (
                    <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "#1e7d4a" }}>
                        <Ico d={P.check} cls="w-3.5 h-3.5 shrink-0" />COREN Ativo exigido
                    </div>
                )}
            </div>

            {/* Rodapé: preço + CTA */}
            <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                        {c.maxInstallments}x de {formatPrice(Math.round(c.price / c.maxInstallments))}
                    </p>
                    <p className="text-[10px]" style={{ color: "#c0bad8" }}>sem juros</p>
                </div>
                <span
                    className="inline-flex items-center text-xs font-bold text-white px-3 py-2 rounded-lg transition-opacity group-hover:opacity-90"
                    style={{ backgroundColor: "var(--iepi-orange)" }}
                >
                    Saiba mais →
                </span>
            </div>
        </Link>
    )
}

/* ── page ──────────────────────────────────────────────────────────── */
export default function CursosPage() {
    const [search, setSearch]           = useState("")
    const [typeFilter, setTypeFilter]   = useState<CourseType | "Todos">("Todos")
    const [instrFilter, setInstrFilter] = useState("Todos")
    const [page, setPage]               = useState(1)

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
    const dirty      = !!(search || typeFilter !== "Todos" || instrFilter !== "Todos")

    function go(p: number) {
        setPage(Math.min(Math.max(1, p), totalPages))
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
    function reset() { setSearch(""); setTypeFilter("Todos"); setInstrFilter("Todos"); setPage(1) }

    return (
        <div style={{ backgroundColor: "var(--iepi-light-alt)", minHeight: "100vh" }}>

            {/* ══ HERO / TOOLBAR ══════════════════════════════════════ */}
            <div style={{ backgroundColor: "var(--iepi-dark)", borderBottom: "3px solid var(--iepi-purple)" }}>
                <div className="container mx-auto max-w-7xl px-6 py-10">
                    <p className="section-overline mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Catálogo completo
                    </p>
                    <h1
                        className="text-3xl font-extrabold text-white mb-6"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Cursos disponíveis
                    </h1>

                    {/* Linha de filtros */}
                    <div className="flex flex-wrap items-center gap-3">

                        {/* Busca */}
                        <div className="relative min-w-[220px] flex-1 max-w-sm">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                style={{ color: "#8f84aa" }}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d={P.search} />
                            </svg>
                            <input
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1) }}
                                placeholder="Buscar curso ou público-alvo…"
                                className="iepi-input pl-9"
                            />
                        </div>

                        {/* Tipo de curso */}
                        <select
                            value={typeFilter}
                            onChange={e => { setTypeFilter(e.target.value as CourseType | "Todos"); setPage(1) }}
                            className="iepi-select"
                            style={{ width: "auto", minWidth: 160 }}
                        >
                            {TYPE_FILTERS.map(f => (
                                <option key={f} value={f}>{f === "Todos" ? "Tipo de curso" : f}</option>
                            ))}
                        </select>

                        {/* Público-alvo */}
                        <select
                            value={instrFilter}
                            onChange={e => { setInstrFilter(e.target.value); setPage(1) }}
                            className="iepi-select"
                            style={{ width: "auto", minWidth: 180 }}
                        >
                            {INSTRUCTOR_FILTERS.map(f => (
                                <option key={f} value={f}>{f === "Todos" ? "Público-alvo" : f}</option>
                            ))}
                        </select>

                        {dirty && (
                            <button
                                onClick={reset}
                                className="iepi-pill"
                                style={{ borderColor: "rgba(255,255,255,0.20)", backgroundColor: "transparent", color: "rgba(255,255,255,0.65)" }}
                            >
                                ✕ Limpar filtros
                            </button>
                        )}
                    </div>

                    {/* Pills de atalho por tipo */}
                    <div className="hidden lg:flex flex-wrap gap-2 mt-4">
                        {TYPE_FILTERS.filter(f => f !== "Todos").map(f => (
                            <button
                                key={f}
                                onClick={() => { setTypeFilter(typeFilter === f ? "Todos" : f as CourseType); setPage(1) }}
                                className={"iepi-pill" + (typeFilter === f ? " active" : "")}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ GRID ════════════════════════════════════════════════ */}
            <section className="py-10">
                <div className="container mx-auto max-w-7xl px-6">

                    {/* Contador */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                            <span className="font-bold" style={{ color: "var(--text-heading)" }}>{filtered.length}</span>
                            {" "}{filtered.length === 1 ? "curso encontrado" : "cursos encontrados"}
                            {typeFilter !== "Todos" && (
                                <span> para <span className="font-semibold" style={{ color: "var(--iepi-purple)" }}>"{typeFilter}"</span></span>
                            )}
                        </p>
                        {dirty && (
                            <button onClick={reset} className="text-xs font-semibold" style={{ color: "var(--iepi-orange)" }}>
                                Limpar filtros
                            </button>
                        )}
                    </div>

                    {paginated.length === 0 ? (
                        <div className="text-center py-24 rounded-xl" style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}>
                            <p className="text-base mb-3" style={{ color: "var(--text-muted)" }}>Nenhum curso encontrado.</p>
                            <button
                                onClick={reset}
                                className="text-sm font-bold"
                                style={{ color: "var(--iepi-orange)" }}
                            >
                                Limpar filtros →
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {paginated.map(c => <CourseCard key={c.id} c={c} />)}
                        </div>
                    )}

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-12">
                            <button
                                onClick={() => go(page - 1)}
                                disabled={page === 1}
                                className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
                                style={{ border: "1.5px solid #d0c9e8", color: "var(--text-muted)" }}
                            >
                                <Ico d={P.chevL} cls="w-3.5 h-3.5" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => go(p)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                    style={{
                                        backgroundColor: p === page ? "var(--iepi-purple)" : "var(--iepi-white)",
                                        color: p === page ? "#fff" : "var(--text-muted)",
                                        border: "1.5px solid " + (p === page ? "var(--iepi-purple)" : "#d0c9e8"),
                                    }}
                                >{p}</button>
                            ))}

                            <button
                                onClick={() => go(page + 1)}
                                disabled={page === totalPages}
                                className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
                                style={{ border: "1.5px solid #d0c9e8", color: "var(--text-muted)" }}
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
