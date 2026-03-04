import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Star, TrendingUp, CheckCircle, Download, UserCheck, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getEnrollmentsByAluno } from "@/lms/actions/enrollmentActions"
import type { Enrollment } from "@/lms/repositories/EnrollmentRepository"

const MOCK_STUDENT_ID = 'student-1'

const STATUS_STYLE: Record<string, string> = {
    'Ativo':     'bg-violet-100 text-violet-700 border-violet-200',
    'Concluido': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Evadido':   'bg-rose-100 text-rose-700 border-rose-200',
    'Trancado':  'bg-amber-100 text-amber-700 border-amber-200',
}

export default async function HistoricoPage() {
    const enrollments: Enrollment[] = await getEnrollmentsByAluno(MOCK_STUDENT_ID)

    const concluded = enrollments.filter(e => e.status === 'Concluido').length
    const avgPaid    = enrollments.length
        ? (enrollments.reduce((a, e) => a + e.amountPaid, 0) / enrollments.length / 100).toFixed(0)
        : '0'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Histórico Escolar</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Consulte suas matrículas, notas e certificados.</p>
                </div>
                <button className="flex items-center gap-2 text-sm text-violet-600 font-semibold bg-violet-50 hover:bg-violet-100 border border-violet-200 px-4 py-2 rounded-xl transition-colors">
                    <FileText className="w-4 h-4" /> Baixar Histórico Completo
                </button>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Matrículas",   value: enrollments.length,    icon: BookOpen,   color: "violet"  },
                    { label: "Concluídos",   value: concluded,              icon: CheckCircle, color: "emerald" },
                    { label: "Ticket Médio", value: `R$ ${avgPaid}`,        icon: TrendingUp, color: "amber"   },
                    { label: "Em Andamento", value: enrollments.filter(e => e.status === 'Ativo').length, icon: UserCheck, color: "blue" },
                ].map(stat => (
                    <div key={stat.label} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm text-center">
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Enrollment list */}
            {enrollments.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Nenhuma matrícula encontrada.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-100 bg-slate-50/50">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">{enrollment.courseName}</h3>
                                    {enrollment.moduleName && (
                                        <p className="text-xs text-violet-600 font-medium mt-0.5">Módulo: {enrollment.moduleName}</p>
                                    )}
                                    <div className="flex items-center flex-wrap gap-3 mt-2">
                                        <Badge className={`border hover:${STATUS_STYLE[enrollment.status]} ${STATUS_STYLE[enrollment.status] ?? 'bg-slate-100 text-slate-700'}`}>
                                            {enrollment.status}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span>Matrícula em {new Date(enrollment.dataMatricula + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-semibold">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            Pago: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(enrollment.amountPaid / 100)}
                                        </div>
                                    </div>
                                </div>
                                {enrollment.status === 'Concluido' && (
                                    <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.97] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0">
                                        <Award className="w-4 h-4 text-amber-400" /> Baixar Certificado
                                    </button>
                                )}
                            </div>

                            {/* Progress bar (simulated from status) */}
                            <div className="px-5 pt-4 pb-2">
                                <Progress
                                    value={enrollment.status === 'Concluido' ? 100 : enrollment.status === 'Ativo' ? 45 : 0}
                                    className="h-1.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    {enrollment.status === 'Concluido' ? 'Curso concluído' : enrollment.status === 'Ativo' ? 'Em andamento' : enrollment.status}
                                </p>
                            </div>

                            {/* Footer info */}
                            <div className="px-5 pb-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                {enrollment.turmaId && <span>Turma: {enrollment.turmaId}</span>}
                                {enrollment.paymentTransactionId && <span>· Transação: {enrollment.paymentTransactionId}</span>}
                                <span className="ml-auto">
                                    <Download className="w-3.5 h-3.5 inline mr-1 cursor-pointer hover:text-violet-500 transition-colors" />
                                    Material
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

    {
        course: "PÃ³s-GraduaÃ§Ã£o: GestÃ£o em SaÃºde e LideranÃ§a",
        turma: "2026.1",
        instructor: "Prof.Âª Dra. Carla Bezerra",
        startDate: "2026-03-10",
        status: "Em Andamento",
        progress: 35,
        attendance: 92,
        totalHours: 360,
        hoursCompleted: 126,
        modules: [
            { name: "Fundamentos da GestÃ£o em SaÃºde", grade: 9.5, status: "completed", attendance: 100 },
            { name: "LideranÃ§a e GestÃ£o de Equipes",  grade: 8.5, status: "completed", attendance: 88  },
            { name: "Planejamento EstratÃ©gico em SaÃºde", grade: null, status: "current", attendance: null },
            { name: "Indicadores e Qualidade Hospitalar", grade: null, status: "pending", attendance: null },
            { name: "HumanizaÃ§Ã£o e Ã‰tica Profissional",   grade: null, status: "pending", attendance: null },
        ]
    },
    {
        course: "Curso Livre: ExcelÃªncia em Atendimento",
        turma: "2025.1",
        instructor: "Enf.Âª Esp. Renata Lima",
        startDate: "2025-04-07",
        endDate: "2025-09-19",
        status: "ConcluÃ­do",
        progress: 100,
        attendance: 95,
        totalHours: 80,
        hoursCompleted: 80,
        modules: [
            { name: "Empatia e ComunicaÃ§Ã£o",    grade: 10.0, status: "completed", attendance: 100 },
            { name: "GestÃ£o de Crises",         grade: 9.0,  status: "completed", attendance: 90  },
            { name: "HumanizaÃ§Ã£o no Cuidado",   grade: 9.5,  status: "completed", attendance: 95  },
        ]
    }
]

export default function HistoricoPage() {
    const avgGrade = (modules: typeof history[0]['modules']) => {
        const grades = modules.filter(m => m.grade !== null).map(m => m.grade!)
        if (!grades.length) return null
        return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">HistÃ³rico Escolar</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Consulte suas notas, frequÃªncia e baixe certificados.</p>
                </div>
                <button className="flex items-center gap-2 text-sm text-violet-600 font-semibold bg-violet-50 hover:bg-violet-100 border border-violet-200 px-4 py-2 rounded-xl transition-colors">
                    <FileText className="w-4 h-4" /> Baixar HistÃ³rico Completo
                </button>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Cursos",        value: history.length,                                          icon: BookOpen,   color: "violet" },
                    { label: "ConcluÃ­dos",    value: history.filter(h => h.status === "ConcluÃ­do").length,    icon: CheckCircle, color: "emerald"},
                    { label: "MÃ©dia Geral",   value: "9.4",                                                   icon: TrendingUp, color: "amber" },
                    { label: "Freq. MÃ©dia",   value: `${Math.round(history.reduce((a,h)=>a+h.attendance,0)/history.length)}%`, icon: UserCheck, color: "blue" },
                ].map(stat => (
                    <div key={stat.label} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm text-center">
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-5">
                {history.map((record, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">{record.course}</h3>
                                <div className="flex items-center flex-wrap gap-3 mt-2">
                                    <Badge className={record.status === "ConcluÃ­do"
                                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                                        : "bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200"
                                    }>
                                        {record.status}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>{record.hoursCompleted}/{record.totalHours}h Â· Turma {record.turma}</span>
                                    </div>
                                    {avgGrade(record.modules) && (
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> MÃ©dia: {avgGrade(record.modules)}
                                        </div>
                                    )}
                                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${record.attendance >= 75 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                                        <UserCheck className="w-3 h-3" /> Freq: {record.attendance}%
                                        {record.attendance < 75 && <span className="text-rose-500 ml-1">âš  Abaixo do mÃ­nimo</span>}
                                    </div>
                                </div>
                            </div>
                            {record.status === "ConcluÃ­do" && (
                                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.97] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0">
                                    <Award className="w-4 h-4 text-amber-400" /> Baixar Certificado
                                </button>
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="px-5 pt-4">
                            <Progress
                                value={record.progress}
                                className="h-1.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500"
                            />
                        </div>

                        {/* Module list */}
                        <div className="p-5 pt-4">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Desempenho por MÃ³dulo</p>
                            <div className="space-y-2">
                                {record.modules.map((mod, modIdx) => (
                                    <div
                                        key={modIdx}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                                            mod.status === "current"
                                                ? "border-violet-200 bg-violet-50"
                                                : "border-slate-100 bg-white hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                                mod.status === "completed" ? "bg-emerald-500"
                                                : mod.status === "current" ? "bg-violet-500 animate-pulse"
                                                : "bg-slate-300"
                                            }`} />
                                            <span className={`text-sm font-medium truncate ${
                                                mod.status === "pending" ? "text-slate-400" :
                                                mod.status === "current" ? "text-violet-900" : "text-slate-800"
                                            }`}>{mod.name}</span>
                                            {mod.status === "current" && (
                                                <span className="text-[10px] font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full shrink-0">Em andamento</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            {mod.attendance !== null && (
                                                <div className={`text-xs font-semibold ${mod.attendance >= 75 ? "text-slate-500" : "text-rose-500"}`}>
                                                    <UserCheck className="w-3 h-3 inline mr-1" />{mod.attendance}%
                                                </div>
                                            )}
                                            <div>
                                                {mod.grade !== null ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Star className={`w-3.5 h-3.5 ${mod.grade >= 7 ? "text-amber-400 fill-amber-400" : "text-rose-400 fill-rose-400"}`} />
                                                        <span className={`font-bold text-sm tabular-nums ${mod.grade >= 7 ? "text-slate-900" : "text-rose-600"}`}>{mod.grade.toFixed(1)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-300 font-medium">â€”</span>
                                                )}
                                            </div>
                                            {mod.status === "completed" && (
                                                <button className="text-slate-300 hover:text-violet-600 transition-colors" title="Baixar material">
                                                    <Download className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer info */}
                        <div className="px-5 pb-5 flex items-center gap-4 text-xs text-slate-400">
                            <span>Docente: {record.instructor}</span>
                            <span>Â· InÃ­cio: {new Date(record.startDate + "T12:00").toLocaleDateString("pt-BR")}</span>
                            {"endDate" in record && record.endDate && (
                                <span>Â· ConclusÃ£o: {new Date((record.endDate as string) + "T12:00").toLocaleDateString("pt-BR")}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
