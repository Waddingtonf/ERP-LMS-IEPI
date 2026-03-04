"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Users, FileDiff, CheckSquare, CalendarDays, BookOpen, Clock,
    ChevronRight, AlertTriangle, ClipboardList, BarChart3, UserCheck,
    Bell, FileText
} from "lucide-react"

const MY_TURMAS = [
    {
        id: "T001", code: "2026.1", course: "Gestão em Saúde e Liderança",
        schedule: "Seg/Qua/Sex — 19h às 22h", nextClass: "Hoje, 19:00",
        students: 28, maxStudents: 35, avgAttendance: 91, avgGrade: 9.1,
        pendingGrades: 1, pendingAttendance: false, status: "Em andamento",
    },
    {
        id: "T002", code: "2026.1", course: "Feridas, Estomias e Incontinências",
        schedule: "Sáb — 08h às 17h", nextClass: "Sáb 07/03, 08:00",
        students: 22, maxStudents: 25, avgAttendance: 85, avgGrade: 8.7,
        pendingGrades: 2, pendingAttendance: true, status: "Em andamento",
    },
    {
        id: "T003", code: "2025.2", course: "Oncologia para Técnicos",
        schedule: "Ter/Qui — 14h às 17h", nextClass: "Qui 05/03, 14:00",
        students: 30, maxStudents: 30, avgAttendance: 78, avgGrade: 7.8,
        pendingGrades: 0, pendingAttendance: false, status: "Concluindo",
    },
]

const AGENDA = [
    { day: "Hoje (Qua 04/03)",  time: "19:00–22:00", turma: "T001", subject: "Planejamento Estratégico em Saúde",      location: "Sala 12 — Bloco B", type: "Aula Teórica"  },
    { day: "Qui 05/03",          time: "14:00–17:00", turma: "T003", subject: "Aplicação Clínica em Oncologia — Revisão", location: "Lab Enfermagem",  type: "Aula Prática"  },
    { day: "Sex 06/03",          time: "19:00–22:00", turma: "T001", subject: "Indicadores Hospitalares",               location: "Sala 12 — Bloco B", type: "Seminário"     },
    { day: "Sáb 07/03",          time: "08:00–17:00", turma: "T002", subject: "Módulo III — Estomias Intestinais",       location: "Lab Enfermagem",  type: "Aula Prática"  },
]

const AT_RISK_STUDENTS = [
    { name: "Fernanda Rocha",    turma: "T002", attendance: 68, grade: 6.5, risk: "high"   },
    { name: "Ricardo Menezes",   turma: "T003", attendance: 71, grade: 7.1, risk: "medium" },
    { name: "Luana Cavalcante",  turma: "T001", attendance: 73, grade: 8.0, risk: "medium" },
]

export default function DocenteDashboard() {
    const [activeTab, setActiveTab] = useState<"turmas" | "agenda" | "risco">("turmas")

    const totalStudents  = MY_TURMAS.reduce((a, t) => a + t.students, 0)
    const pendingGrades  = MY_TURMAS.reduce((a, t) => a + t.pendingGrades, 0)
    const pendingFreq    = MY_TURMAS.filter(t => t.pendingAttendance).length
    const todayClasses   = AGENDA.filter(a => a.day.startsWith("Hoje"))

    return (
        <div className="space-y-6">
            {/* Welcome header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">Portal do Docente</p>
                    <h2 className="text-2xl font-bold text-slate-900">Bom dia, Prof.ª Dra. Carla Bezerra 👋</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Quarta-feira, 04 de março de 2026 · Você tem {todayClasses.length} aula(s) hoje.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 text-sm">
                        <Bell className="w-4 h-4" /> Avisos
                        {(pendingGrades > 0 || pendingFreq > 0) && (
                            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {pendingGrades + pendingFreq}
                            </span>
                        )}
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2 text-sm">
                        <ClipboardList className="w-4 h-4" /> Lançar Notas
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Turmas Ativas",     value: MY_TURMAS.filter(t=>t.status!=="Concluindo").length, sub: "Semestre 2026.1",         color: "bg-blue-50 border-blue-100",    icon: Users       },
                    { label: "Alunos no Total",   value: totalStudents, sub: "em todas as turmas",             color: "bg-violet-50 border-violet-100", icon: BookOpen    },
                    { label: "Notas Pendentes",   value: pendingGrades, sub: `${pendingFreq} freq. em atraso`, color: pendingGrades>0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-100", icon: FileDiff },
                    { label: "Freq. Média Geral", value: `${Math.round(MY_TURMAS.reduce((a,t)=>a+t.avgAttendance,0)/MY_TURMAS.length)}%`, sub: "das turmas ativas", color: "bg-emerald-50 border-emerald-100", icon: CheckSquare },
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
                {(["turmas", "agenda", "risco"] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === tab
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {tab === "turmas" && "Minhas Turmas"}
                        {tab === "agenda" && "Agenda da Semana"}
                        {tab === "risco"  && (
                            <span className="flex items-center gap-1.5">
                                Alunos em Risco
                                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    {AT_RISK_STUDENTS.length}
                                </span>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab: Minhas Turmas */}
            {activeTab === "turmas" && (
                <div className="space-y-3">
                    {MY_TURMAS.map(t => (
                        <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{t.code}</span>
                                        <h3 className="font-bold text-slate-900">{t.course}</h3>
                                        <Badge className={`text-[10px] border-none ${
                                            t.status === "Em andamento" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                        }`}>{t.status}</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Clock  className="w-3 h-3" /> {t.schedule}</span>
                                        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Próxima: {t.nextClass}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.students}/{t.maxStudents} alunos</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {(t.pendingGrades > 0 || t.pendingAttendance) && (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                                            <AlertTriangle className="w-3 h-3" />
                                            {t.pendingGrades > 0 ? `${t.pendingGrades} nota(s)` : "Freq. pendente"}
                                        </span>
                                    )}
                                    <Button size="sm" variant="outline" className="text-xs gap-1.5">
                                        <BarChart3 className="w-3.5 h-3.5" /> Notas
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs gap-1.5">
                                        <UserCheck className="w-3.5 h-3.5" /> Frequência
                                    </Button>
                                    <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 gap-1.5">
                                        <FileText className="w-3.5 h-3.5" /> Diário
                                        <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Vagas Ocupadas</p>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={(t.students / t.maxStudents) * 100}
                                            className="h-1.5 flex-1 bg-slate-100 [&>div]:bg-blue-500"
                                        />
                                        <span className="text-xs font-bold text-slate-700 tabular-nums">
                                            {Math.round((t.students / t.maxStudents) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Freq. Média</p>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={t.avgAttendance}
                                            className={`h-1.5 flex-1 bg-slate-100 ${
                                                t.avgAttendance >= 75 ? "[&>div]:bg-emerald-500" : "[&>div]:bg-rose-500"
                                            }`}
                                        />
                                        <span className={`text-xs font-bold tabular-nums ${
                                            t.avgAttendance >= 75 ? "text-emerald-700" : "text-rose-600"
                                        }`}>{t.avgAttendance}%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Média de Notas</p>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={(t.avgGrade / 10) * 100}
                                            className="h-1.5 flex-1 bg-slate-100 [&>div]:bg-violet-500"
                                        />
                                        <span className="text-xs font-bold text-slate-700 tabular-nums">{t.avgGrade.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: Agenda */}
            {activeTab === "agenda" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {AGENDA.map((item, i) => {
                            const isToday = item.day.startsWith("Hoje")
                            const typeColor: Record<string, string> = {
                                "Aula Teórica": "bg-blue-100 text-blue-700",
                                "Aula Prática": "bg-emerald-100 text-emerald-700",
                                "Seminário":    "bg-violet-100 text-violet-700",
                            }
                            return (
                                <div key={i} className={`flex gap-4 px-5 py-4 ${
                                    isToday ? "bg-blue-50/60 border-l-4 border-l-blue-500" : "hover:bg-slate-50"
                                }`}>
                                    <div className="shrink-0 w-24 text-right">
                                        <p className={`text-xs font-bold ${
                                            isToday ? "text-blue-700" : "text-slate-500"
                                        }`}>{item.day}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                                            <Clock className="w-3 h-3" />{item.time}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 text-sm">{item.subject}</p>
                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                                <Users className="w-3 h-3" />{item.turma}
                                            </span>
                                            <span className="text-[11px] text-slate-500">· {item.location}</span>
                                            <Badge className={`text-[10px] border-none ${typeColor[item.type] ?? "bg-slate-100 text-slate-600"}`}>
                                                {item.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    {isToday && (
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs shrink-0 self-center">
                                            Iniciar Chamada
                                        </Button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Tab: Alunos em Risco */}
            {activeTab === "risco" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 bg-rose-50/50">
                        <p className="text-sm font-bold text-rose-700 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Alunos com frequência abaixo de 75% ou nota média abaixo de 7.0
                        </p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {AT_RISK_STUDENTS.map((s, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm shrink-0">
                                    {s.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                                    <p className="text-xs text-slate-500">Turma {s.turma}</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-sm font-bold ${
                                        s.attendance < 75 ? "text-rose-600" : "text-amber-600"
                                    }`}>{s.attendance}%</p>
                                    <p className="text-[10px] text-slate-400">Freq.</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-sm font-bold ${
                                        s.grade < 7 ? "text-rose-600" : "text-slate-700"
                                    }`}>{s.grade.toFixed(1)}</p>
                                    <p className="text-[10px] text-slate-400">Média</p>
                                </div>
                                <Badge className={`shrink-0 border-none ${
                                    s.risk === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                                }`}>
                                    {s.risk === "high" ? "Crítico" : "Atenção"}
                                </Badge>
                                <Button size="sm" variant="outline" className="text-xs shrink-0">
                                    Contatar
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
