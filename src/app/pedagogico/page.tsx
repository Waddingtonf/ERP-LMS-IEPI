"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
    Users, AlertCircle, MessageSquareWarning, ArrowDownRight, Search,
    TrendingUp, Bell, Phone, Mail, Eye, Clock, ChevronRight, ShieldAlert, UserMinus
} from "lucide-react"

const AT_RISK = [
    { name: "Fernanda Rocha",    course: "Feridas, Estomias",             turma: "2026.1", attendance: 62, grade: 5.8, lastAccess: "12 dias",  risk: "critical", reason: "Freq. crítica + Nota baixa" },
    { name: "Ricardo Menezes",   course: "Oncologia Técnicos",           turma: "2025.2", attendance: 68, grade: 6.3, lastAccess: "8 dias",   risk: "critical", reason: "Freq. abaixo de 75%"        },
    { name: "Luana Cavalcante",  course: "Gestão em Saúde",              turma: "2026.1", attendance: 72, grade: 6.9, lastAccess: "5 dias",   risk: "high",    reason: "Freq. limite"             },
    { name: "Carlos Eduardo",    course: "Enfermagem Oncológica",        turma: "2025.2", attendance: 74, grade: 7.2, lastAccess: "3 dias",   risk: "medium",  reason: "Atenção preventiva"      },
    { name: "Beatriz Ferreira",  course: "Gestão em Saúde",              turma: "2026.1", attendance: 66, grade: 7.8, lastAccess: "15 dias",  risk: "critical", reason: "Inativas há +10 dias"    },
    { name: "Paulo Henrique",    course: "Feridas, Estomias",             turma: "2026.1", attendance: 75, grade: 5.5, lastAccess: "2 dias",   risk: "high",    reason: "Nota média abaixo de 7"  },
]

const OCCURRENCES = [
    { id: "OC-041", student: "Fernanda Rocha",   type: "Infrequência",     date: "2026-02-28", sla: "Vencido",   priority: "high",   status: "Aberta"  },
    { id: "OC-040", student: "Ricardo Menezes",  type: "Dificuldade Acadêmica", date: "2026-02-26", sla: "Vencido",priority: "high",   status: "Aberta"  },
    { id: "OC-039", student: "Paulo Henrique",   type: "Nota Baixa",         date: "2026-03-01", sla: "2 dias",  priority: "medium", status: "Aberta"  },
    { id: "OC-038", student: "Luana Cavalcante", type: "Infrequência",     date: "2026-03-02", sla: "3 dias",  priority: "medium", status: "Em Andamento" },
    { id: "OC-037", student: "Ana Clara Souza",  type: "Solicitação Especial", date: "2026-02-25", sla: "Vencido",priority: "low",    status: "Resolvida" },
]

const EVASION_WATCH = [
    { name: "Beatriz Ferreira",  course: "Gestão em Saúde",  daysInactive: 15, risk: "critical" },
    { name: "Márcio Andrade",    course: "Oncologia Av.",     daysInactive: 11, risk: "high"    },
    { name: "Vinícius Torres",   course: "Feridas",           daysInactive: 9,  risk: "high"    },
]

export default function PedagogicoDashboard() {
    const [activeTab, setActiveTab] = useState<"risco" | "ocorrencias" | "evasao">("risco")
    const [searchRisk, setSearchRisk] = useState("")

    const filteredRisk = AT_RISK.filter(s =>
        s.name.toLowerCase().includes(searchRisk.toLowerCase()) ||
        s.course.toLowerCase().includes(searchRisk.toLowerCase())
    )
    const critical = AT_RISK.filter(s => s.risk === "critical").length
    const openOcc  = OCCURRENCES.filter(o => o.status !== "Resolvida").length
    const slaBreached = OCCURRENCES.filter(o => o.sla === "Vencido" && o.status !== "Resolvida").length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-0.5">Setor Pedagógico</p>
                    <h2 className="text-2xl font-bold text-slate-900">Painel de Monitoramento</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Quarta-feira, 04 de março de 2026 · {critical} aluno(s) em situação crítica.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 text-sm">
                        <Bell className="w-4 h-4" /> Notificações
                        {slaBreached > 0 && (
                            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{slaBreached}</span>
                        )}
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 gap-2 text-sm">
                        <ShieldAlert className="w-4 h-4" /> Plano de Retenção
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Alunos Ativos",      value: "1.248", sub: "Regularmente matriculados",      color: "bg-slate-50 border-slate-200",   icon: Users            },
                    { label: "Em Risco / Crítico", value: AT_RISK.length, sub: `${critical} críticos imediatos`, color: "bg-rose-50 border-rose-200",     icon: AlertCircle      },
                    { label: "Ocorrências Abertas",value: openOcc, sub: `${slaBreached} com SLA vencido`,   color: slaBreached>0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-100", icon: MessageSquareWarning },
                    { label: "Taxa de Evasão",    value: "2.1%", sub: "No último semestre",              color: "bg-orange-50 border-orange-200",  icon: ArrowDownRight   },
                ].map(kpi => (
                    <div key={kpi.label} className={`${kpi.color} border rounded-xl p-4 flex flex-col gap-1`}>
                        <kpi.icon className="w-4 h-4 text-slate-400 mb-1" />
                        <p className="text-2xl font-extrabold text-slate-900">{kpi.value}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">{kpi.label}</p>
                        <p className="text-[11px] text-slate-400">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {(["risco", "ocorrencias", "evasao"] as const).map(tab => {
                    const counts: Record<string, number | null> = { risco: AT_RISK.length, ocorrencias: openOcc, evasao: EVASION_WATCH.length }
                    const labels: Record<string, string> = { risco: "Alunos em Risco", ocorrencias: "Ocorrências (SLA)", evasao: "Vigilância de Evasão" }
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {labels[tab]}
                            {counts[tab] !== null && counts[tab]! > 0 && (
                                <span className={`w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                                    tab === "ocorrencias" && slaBreached > 0 ? "bg-rose-500" : "bg-orange-400"
                                }`}>{counts[tab]}</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab: Alunos em Risco */}
            {activeTab === "risco" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            Monitoramento de Risco Acadêmico
                        </p>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                className="pl-9 h-8 text-sm"
                                placeholder="Buscar aluno ou curso…"
                                value={searchRisk}
                                onChange={e => setSearchRisk(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {filteredRisk.map((s, i) => (
                            <div key={i} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${
                                s.risk === "critical" ? "border-l-4 border-l-rose-400" : ""
                            }`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                    s.risk === "critical" ? "bg-rose-100 text-rose-700" :
                                    s.risk === "high"     ? "bg-amber-100 text-amber-700" :
                                    "bg-slate-100 text-slate-600"
                                }`}>
                                    {s.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.course} · Turma {s.turma}</p>
                                </div>
                                <div className="text-center min-w-[56px]">
                                    <p className={`text-sm font-bold ${
                                        s.attendance < 75 ? "text-rose-600" : "text-amber-600"
                                    }`}>{s.attendance}%</p>
                                    <p className="text-[10px] text-slate-400">Freq.</p>
                                </div>
                                <div className="text-center min-w-[40px]">
                                    <p className={`text-sm font-bold ${
                                        s.grade < 7 ? "text-rose-600" : "text-slate-700"
                                    }`}>{s.grade.toFixed(1)}</p>
                                    <p className="text-[10px] text-slate-400">Média</p>
                                </div>
                                <div className="text-center min-w-[56px]">
                                    <p className="text-xs font-semibold text-slate-500">{s.lastAccess}</p>
                                    <p className="text-[10px] text-slate-400">Sem acesso</p>
                                </div>
                                <Badge className={`border-none shrink-0 ${
                                    s.risk === "critical" ? "bg-rose-100 text-rose-700" :
                                    s.risk === "high"     ? "bg-amber-100 text-amber-700" :
                                    "bg-slate-100 text-slate-600"
                                }`}>
                                    {s.risk === "critical" ? "Crítico" : s.risk === "high" ? "Alto" : "Médio"}
                                </Badge>
                                <p className="text-[11px] text-slate-400 min-w-[140px] hidden sm:block">{s.reason}</p>
                                <div className="flex gap-1 shrink-0">
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Ligar">
                                        <Phone className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="E-mail">
                                        <Mail className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                                        <Eye className="w-3 h-3" /> Ver
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab: Ocorrências */}
            {activeTab === "ocorrencias" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-700">Ocorrências em Aberto — SLA de Atendimento</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {OCCURRENCES.map(occ => (
                            <div key={occ.id} className={`flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 ${
                                occ.sla === "Vencido" && occ.status !== "Resolvida" ? "border-l-4 border-l-rose-400" : ""
                            }`}>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-slate-400 w-16 shrink-0">{occ.id}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{occ.student}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {occ.type} · {new Date(occ.date + "T12:00").toLocaleDateString("pt-BR")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-1 text-xs font-semibold ${
                                        occ.sla === "Vencido" ? "text-rose-600" : "text-slate-500"
                                    }`}>
                                        <Clock className="w-3 h-3" />
                                        SLA: {occ.sla}
                                    </div>
                                    <Badge className={`border-none text-xs ${
                                        occ.status === "Resolvida" ? "bg-emerald-100 text-emerald-700" :
                                        occ.status === "Em Andamento" ? "bg-blue-100 text-blue-700" :
                                        "bg-slate-100 text-slate-600"
                                    }`}>{occ.status}</Badge>
                                    <Button size="sm" variant="outline" className="text-xs gap-1 h-7">
                                        Atender <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab: Evasão */}
            {activeTab === "evasao" && (
                <div className="space-y-4">
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
                        <p className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-3">
                            <UserMinus className="w-4 h-4" /> Alunos sem acesso há mais de 7 dias consecutivos
                        </p>
                        <div className="space-y-2">
                            {EVASION_WATCH.map((s, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 border border-rose-100">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs shrink-0">
                                        {s.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                                        <p className="text-xs text-slate-500">{s.course}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-rose-600">{s.daysInactive} dias</p>
                                        <p className="text-[10px] text-slate-400">Inativo</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                                            <Mail className="w-3 h-3" /> Contatar
                                        </Button>
                                        <Button size="sm" className="text-xs h-7 bg-rose-600 hover:bg-rose-700 gap-1">
                                            <TrendingUp className="w-3 h-3" /> Salvar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Evasion stats */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            { label: "Evasão 2026.1",     value: "1.8%", trend: "-0.3% vs 2025.2", up: false },
                            { label: "Retenção Histórica", value: "97.9%", trend: "+0.5% melhora",   up: true  },
                            { label: "Intervenciones OK",  value: "83%",  trend: "dos casos tratados", up: true },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                                <p className={`text-xs mt-1 flex items-center gap-1 ${
                                    s.up ? "text-emerald-600" : "text-rose-600"
                                }`}>
                                    <TrendingUp className="w-3 h-3" />{s.trend}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
