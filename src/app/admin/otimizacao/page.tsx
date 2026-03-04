"use client"

import { useState } from "react"
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    DollarSign,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ── Tipos ────────────────────────────────────────────────────────────────────
type ViewTab = "dre" | "budget" | "inadimplencia" | "custos"

// ── Dados mock ────────────────────────────────────────────────────────────────
const MESES = ["Jul", "Ago", "Set", "Out", "Nov", "Dez"]

const RECEITA_MENSAL   = [48200, 52100, 49800, 55400, 53700, 58900]
const DESPESA_MENSAL   = [38100, 39200, 37900, 41000, 40200, 43500]
const RESULTADO_MENSAL = RECEITA_MENSAL.map((r, i) => r - DESPESA_MENSAL[i])

const DRE_ITEMS = [
    { categoria: "RECEITAS OPERACIONAIS",  tipo: "header" as const },
    { categoria: "Mensalidades / Cursos",  valor: 318100, tipo: "receita" as const },
    { categoria: "Taxas de Matrícula",     valor:  14300, tipo: "receita" as const },
    { categoria: "Certificações e Provas", valor:   8900, tipo: "receita" as const },
    { categoria: "Convênios",              valor:  22500, tipo: "receita" as const },
    { categoria: "TOTAL RECEITA BRUTA",    valor: 363800, tipo: "subtotal" as const },
    { categoria: "(-) Descontos e Bolsas", valor: -21200, tipo: "deducao" as const },
    { categoria: "RECEITA LÍQUIDA",        valor: 342600, tipo: "total" as const },
    { categoria: "DESPESAS OPERACIONAIS",  tipo: "header" as const },
    { categoria: "Corpo Docente",          valor: -110400, tipo: "despesa" as const },
    { categoria: "Infraestrutura / Locação", valor: -38000, tipo: "despesa" as const },
    { categoria: "Material Didático",      valor: -12800, tipo: "despesa" as const },
    { categoria: "Tecnologia / Sistemas",  valor: -18600, tipo: "despesa" as const },
    { categoria: "Administrativo",         valor: -45200, tipo: "despesa" as const },
    { categoria: "Marketing",              valor: -16400, tipo: "despesa" as const },
    { categoria: "TOTAL DESPESAS",         valor: -241400, tipo: "subtotal-desp" as const },
    { categoria: "EBITDA",                 valor: 101200, tipo: "ebitda" as const },
    { categoria: "(-) Impostos / Taxas",   valor: -23100, tipo: "deducao" as const },
    { categoria: "RESULTADO LÍQUIDO",      valor: 78100, tipo: "resultado" as const },
]

const BUDGET_ITEMS = [
    { linha: "Receitas Totais",      orcado: 360000, realizado: 342600, variacao: -17400 },
    { linha: "Corpo Docente",        orcado: 105000, realizado: 110400, variacao: -5400  },
    { linha: "Infraestrutura",       orcado: 36000,  realizado: 38000,  variacao: -2000  },
    { linha: "Material Didático",    orcado: 15000,  realizado: 12800,  variacao: 2200   },
    { linha: "Tecnologia",           orcado: 20000,  realizado: 18600,  variacao: 1400   },
    { linha: "Administrativo",       orcado: 42000,  realizado: 45200,  variacao: -3200  },
    { linha: "Marketing",            orcado: 18000,  realizado: 16400,  variacao: 1600   },
    { linha: "Resultado Líquido",    orcado: 85000,  realizado: 78100,  variacao: -6900  },
]

const INADIMPLENTES = [
    { nome: "Pedro Henrique Araújo",  curso: "Pós-Grad. UTI",      atraso: 90,  valor: 1.850, probabilidade: 0.87 },
    { nome: "Fernanda Lima Castro",   curso: "Especializ. Pediatria", atraso: 60, valor: 2.100, probabilidade: 0.62 },
    { nome: "Marcos Aurélio Pessoa",  curso: "Residência Cirúrgica", atraso: 45,  valor: 3.200, probabilidade: 0.48 },
    { nome: "Juliana Pires Matos",    curso: "Curso Livre Urgência", atraso: 30,  valor: 490,   probabilidade: 0.31 },
    { nome: "Anderson Gomes Neto",    curso: "Pós-Grad. UTI",       atraso: 90,  valor: 1.850, probabilidade: 0.85 },
    { nome: "Carla Beatriz Torres",   curso: "Especializ. Pediatria", atraso: 15, valor: 2.100, probabilidade: 0.18 },
]

const CENTROS_CUSTO = [
    { nome: "Coordenação Acadêmica", valor: 45200, perc: 18.7, cor: "#7c3aed" },
    { nome: "Infraestrutura",        valor: 38000, perc: 15.7, cor: "#0ea5e9" },
    { nome: "Corpo Docente",         valor: 110400, perc: 45.8, cor: "#10b981" },
    { nome: "TI / Plataforma",       valor: 18600, perc: 7.7,  cor: "#f59e0b" },
    { nome: "Marketing",             valor: 16400, perc: 6.8,  cor: "#ef4444" },
    { nome: "Administrativo",        valor: 12800, perc: 5.3,  cor: "#8b5cf6" },
]

// ── helpers ──────────────────────────────────────────────────────────────────
const fmtBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

const pct = (real: number, orc: number) => {
    const diff = real - orc
    return ((diff / Math.abs(orc)) * 100).toFixed(1)
}

function BarSimples({ values, labels, max, height = 80 }: {
    values: number[]; labels: string[]; max: number; height?: number
}) {
    return (
        <div className="flex items-end gap-1 w-full" style={{ height }}>
            {values.map((v, i) => {
                const h = Math.round((v / max) * height)
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                            className="w-full rounded-t-sm transition-all"
                            style={{ height: h, backgroundColor: v >= 0 ? "#7c3aed" : "#ef4444", opacity: 0.85 }}
                            title={fmtBRL(v)}
                        />
                        <span className="text-[9px] text-slate-400">{labels[i]}</span>
                    </div>
                )
            })}
        </div>
    )
}

function KpiCard({ icon, label, value, diff, diffLabel, color }: {
    icon: React.ReactNode; label: string; value: string; diff?: number; diffLabel?: string; color: string
}) {
    const up = (diff ?? 0) >= 0
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                        <div style={{ color }}>{icon}</div>
                    </div>
                    {diff !== undefined && (
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5 ${up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(diff)}%
                        </span>
                    )}
                </div>
                <p className="text-xl font-bold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{label}</p>
                {diffLabel && <p className="text-[11px] text-slate-400 mt-0.5">{diffLabel}</p>}
            </CardContent>
        </Card>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OtimizacaoFinanceiraPage() {
    const [tab, setTab] = useState<ViewTab>("dre")

    const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
        { id: "dre",          label: "DRE",               icon: <BarChart3 className="w-4 h-4" /> },
        { id: "budget",       label: "Budget vs Realizado", icon: <TrendingUp className="w-4 h-4" /> },
        { id: "inadimplencia",label: "Inadimplência",       icon: <AlertTriangle className="w-4 h-4" /> },
        { id: "custos",       label: "Centro de Custo",    icon: <PieChart className="w-4 h-4" /> },
    ]

    const totalInadimplente = INADIMPLENTES.reduce((acc, i) => acc + i.valor, 0)
    const riscoBaixo  = INADIMPLENTES.filter(i => i.probabilidade < 0.33).length
    const riscoMedio  = INADIMPLENTES.filter(i => i.probabilidade >= 0.33 && i.probabilidade < 0.66).length
    const riscoAlto   = INADIMPLENTES.filter(i => i.probabilidade >= 0.66).length

    return (
        <div className="space-y-6">
            {/* ── Cabeçalho ── */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Otimização Financeira</h1>
                <p className="text-sm text-slate-500 mt-0.5">Análise econômico-financeira · 2º Semestre 2024</p>
            </div>

            {/* ── KPIs ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon={<DollarSign className="w-5 h-5" />}  label="Receita Líquida"    value="R$ 342.600"    diff={5.2}  diffLabel="vs semestre ant." color="#10b981" />
                <KpiCard icon={<TrendingUp className="w-5 h-5" />}   label="Resultado Líquido"  value="R$ 78.100"     diff={-2.1} diffLabel="abaixo do budget"  color="#7c3aed" />
                <KpiCard icon={<AlertTriangle className="w-5 h-5" />} label="Em inadimplência"  value={fmtBRL(totalInadimplente * 1000)} diff={-8.4} diffLabel="alto risco acumulado" color="#ef4444" />
                <KpiCard icon={<BarChart3 className="w-5 h-5" />}    label="Margem EBITDA"      value="29,5%"         diff={1.3}  diffLabel="acima da meta 28%" color="#0ea5e9" />
            </div>

            {/* ── Tabs ── */}
            <div className="border-b border-slate-200">
                <div className="flex gap-1 overflow-x-auto pb-px">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                tab === t.id
                                    ? "border-violet-600 text-violet-700"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t.icon}{t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── DRE ── */}
            {tab === "dre" && (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Tabela DRE */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold text-slate-800">
                                    Demonstração do Resultado do Exercício
                                    <span className="ml-2 text-xs font-normal text-slate-400">jul–dez 2024</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {DRE_ITEMS.map((item, idx) => {
                                        if (item.tipo === "header") return (
                                            <div key={idx} className="px-5 py-2 bg-slate-50">
                                                <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{item.categoria}</span>
                                            </div>
                                        )
                                        const isTotal   = item.tipo === "total" || item.tipo === "resultado" || item.tipo === "ebitda"
                                        const isDeducao = item.tipo === "deducao"
                                        const isSub     = item.tipo === "subtotal" || item.tipo === "subtotal-desp"
                                        const val = item.valor ?? 0
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex items-center justify-between px-5 py-2.5 ${
                                                    isTotal ? "bg-violet-50" :
                                                    isSub   ? "bg-slate-50/60" : ""
                                                }`}
                                            >
                                                <span className={`text-sm ${isTotal ? "font-bold text-violet-700" : isSub ? "font-semibold text-slate-700" : isDeducao ? "text-slate-500 pl-4" : "text-slate-600 pl-4"}`}>
                                                    {item.categoria}
                                                </span>
                                                <span className={`text-sm font-semibold tabular-nums ${
                                                    item.tipo === "resultado" ? (val >= 0 ? "text-green-600" : "text-red-600") :
                                                    val < 0 ? "text-red-500" :
                                                    isTotal ? "text-violet-700" :
                                                    "text-slate-700"
                                                }`}>
                                                    {fmtBRL(Math.abs(val))}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gráfico de resultado mensal */}
                    <div className="space-y-4">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-slate-700">Resultado Mensal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarSimples
                                    values={RESULTADO_MENSAL}
                                    labels={MESES}
                                    max={Math.max(...RESULTADO_MENSAL)}
                                    height={100}
                                />
                                <div className="mt-4 space-y-2">
                                    {MESES.map((m, i) => (
                                        <div key={m} className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500">{m}</span>
                                            <span className={`font-semibold tabular-nums ${RESULTADO_MENSAL[i] >= 0 ? "text-green-600" : "text-red-500"}`}>
                                                {fmtBRL(RESULTADO_MENSAL[i])}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* ── Budget vs Realizado ── */}
            {tab === "budget" && (
                <div className="space-y-4">
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Budget vs Realizado
                                <span className="ml-2 text-xs font-normal text-slate-400">2º Semestre 2024</span>
                            </CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-y border-slate-100">
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 min-w-[180px]">Linha</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 min-w-[130px]">Orçado</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 min-w-[130px]">Realizado</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 min-w-[110px]">Variação</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 min-w-[140px]">Aderência</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {BUDGET_ITEMS.map((item) => {
                                        const p = Number(pct(item.realizado, item.orcado))
                                        const favorable = (item.linha.includes("Receita") || item.linha.includes("Resultado"))
                                            ? item.variacao >= 0
                                            : item.variacao <= 0
                                        return (
                                            <tr key={item.linha} className="hover:bg-slate-50/60">
                                                <td className="py-3 px-5 text-sm font-medium text-slate-700">{item.linha}</td>
                                                <td className="py-3 px-4 text-right text-sm text-slate-500 tabular-nums">{fmtBRL(item.orcado)}</td>
                                                <td className="py-3 px-4 text-right text-sm text-slate-700 font-medium tabular-nums">{fmtBRL(item.realizado)}</td>
                                                <td className={`py-3 px-4 text-right text-sm font-semibold tabular-nums ${favorable ? "text-green-600" : "text-red-500"}`}>
                                                    <span className="inline-flex items-center gap-0.5">
                                                        {item.variacao > 0 ? <ArrowUpRight className="w-3 h-3" /> :
                                                         item.variacao < 0 ? <ArrowDownRight className="w-3 h-3" /> :
                                                         <Minus className="w-3 h-3" />}
                                                        {fmtBRL(Math.abs(item.variacao))}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${Math.min(100, Math.abs((item.realizado / item.orcado) * 100))}%`,
                                                                    backgroundColor: favorable ? "#10b981" : "#ef4444"
                                                                }}
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-semibold ${favorable ? "text-green-600" : "text-red-500"}`}>
                                                            {Math.abs(p)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* ── Inadimplência ── */}
            {tab === "inadimplencia" && (
                <div className="space-y-5">
                    {/* Resumo */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Risco Baixo",  count: riscoBaixo,  color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle className="w-4 h-4" /> },
                            { label: "Risco Médio",  count: riscoMedio,  color: "text-yellow-600", bg: "bg-yellow-50", icon: <Clock className="w-4 h-4" /> },
                            { label: "Risco Alto",   count: riscoAlto,   color: "text-red-600",   bg: "bg-red-50",   icon: <XCircle className="w-4 h-4" /> },
                        ].map(r => (
                            <Card key={r.label} className="border-0 shadow-sm">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl ${r.bg} flex items-center justify-center ${r.color}`}>
                                        {r.icon}
                                    </div>
                                    <div>
                                        <p className={`text-xl font-bold ${r.color}`}>{r.count}</p>
                                        <p className="text-xs text-slate-500">{r.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                Previsão de Inadimplência — Ranking de Risco
                            </CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-y border-slate-100">
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 min-w-[190px]">Aluno</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 min-w-[200px]">Curso</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 min-w-[80px]">Atraso</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 min-w-[110px]">Valor</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-slate-500 min-w-[170px]">Risco de Perda</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-slate-500 min-w-[100px]">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {INADIMPLENTES.sort((a, b) => b.probabilidade - a.probabilidade).map((al) => {
                                        const p = al.probabilidade
                                        const cor = p >= 0.66 ? "#ef4444" : p >= 0.33 ? "#f59e0b" : "#10b981"
                                        const label = p >= 0.66 ? "Alto" : p >= 0.33 ? "Médio" : "Baixo"
                                        return (
                                            <tr key={al.nome} className="hover:bg-slate-50/60">
                                                <td className="py-3 px-5 font-medium text-slate-800 text-sm">{al.nome}</td>
                                                <td className="py-3 px-4 text-sm text-slate-500">{al.curso}</td>
                                                <td className="py-3 px-4 text-right text-sm font-semibold text-red-500">{al.atraso}d</td>
                                                <td className="py-3 px-4 text-right text-sm font-medium text-slate-700 tabular-nums">
                                                    {fmtBRL(al.valor * 1000)}
                                                </td>
                                                <td className="py-3 px-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                            <div className="h-full rounded-full" style={{ width: `${p * 100}%`, backgroundColor: cor }} />
                                                        </div>
                                                        <span className="text-xs font-bold w-12 text-right" style={{ color: cor }}>
                                                            {Math.round(p * 100)}% {label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button className="text-xs font-medium text-violet-600 hover:underline">
                                                        Contatar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* ── Centro de Custo ── */}
            {tab === "custos" && (
                <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {CENTROS_CUSTO.map(c => (
                            <Card key={c.nome} className="border-0 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <p className="text-sm font-semibold text-slate-700 leading-tight">{c.nome}</p>
                                        <span className="text-xs font-bold rounded-full px-2 py-0.5 text-white" style={{ backgroundColor: c.cor }}>
                                            {c.perc}%
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800 mb-3">{fmtBRL(c.valor)}</p>
                                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${c.perc}%`, backgroundColor: c.cor }} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">{c.perc}% do total de despesas</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Distribuição de Custos</h3>
                            <div className="space-y-3">
                                {CENTROS_CUSTO.sort((a, b) => b.valor - a.valor).map(c => (
                                    <div key={c.nome}>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-slate-600 font-medium">{c.nome}</span>
                                            <span className="text-slate-500 tabular-nums">{fmtBRL(c.valor)}</span>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${c.perc}%`, backgroundColor: c.cor }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between">
                                <span className="text-sm font-semibold text-slate-600">Total Despesas</span>
                                <span className="text-sm font-bold text-slate-800">{fmtBRL(241400)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
