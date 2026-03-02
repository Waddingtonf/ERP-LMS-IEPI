import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Star, TrendingUp, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const history = [
    {
        course: "Pós-Graduação: Gestão Estratégica em RH",
        status: "Em Andamento",
        progress: 35,
        modules: [
            { name: "Fundamentos do RH", grade: 9.5, status: "completed" },
            { name: "Recrutamento Inteligente", grade: null, status: "current" },
            { name: "Avaliação de Desempenho", grade: null, status: "pending" },
        ]
    },
    {
        course: "Curso Livre: Excelência em Atendimento",
        status: "Concluído",
        progress: 100,
        modules: [
            { name: "Empatia e Comunicação", grade: 10.0, status: "completed" },
            { name: "Gestão de Crises", grade: 9.0, status: "completed" },
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
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Histórico Escolar</h2>
                <p className="text-slate-500 text-sm mt-0.5">Consulte suas notas, frequência e baixe certificados.</p>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Cursos", value: history.length, icon: BookOpen, color: "violet" },
                    { label: "Concluídos", value: history.filter(h => h.status === 'Concluído').length, icon: CheckCircle, color: "emerald" },
                    { label: "Média Geral", value: "9.5", icon: TrendingUp, color: "amber" },
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
                                    <Badge className={record.status === 'Concluído'
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                                        : 'bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200'
                                    }>
                                        {record.status}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>{record.progress}% concluído</span>
                                    </div>
                                    {avgGrade(record.modules) && (
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Média: {avgGrade(record.modules)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {record.status === 'Concluído' && (
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
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Desempenho por Módulo</p>
                            <div className="space-y-2">
                                {record.modules.map((mod, modIdx) => (
                                    <div
                                        key={modIdx}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                                            mod.status === 'current'
                                                ? 'border-violet-200 bg-violet-50'
                                                : 'border-slate-100 bg-white hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                                mod.status === 'completed' ? 'bg-emerald-500'
                                                : mod.status === 'current' ? 'bg-violet-500 animate-pulse'
                                                : 'bg-slate-300'
                                            }`} />
                                            <span className={`text-sm font-medium ${
                                                mod.status === 'pending' ? 'text-slate-400' :
                                                mod.status === 'current' ? 'text-violet-900' : 'text-slate-800'
                                            }`}>{mod.name}</span>
                                            {mod.status === 'current' && (
                                                <span className="text-[10px] font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">Em andamento</span>
                                            )}
                                        </div>
                                        <div>
                                            {mod.grade !== null ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Star className={`w-3.5 h-3.5 ${mod.grade >= 7 ? 'text-amber-400 fill-amber-400' : 'text-rose-400 fill-rose-400'}`} />
                                                    <span className={`font-bold text-sm tabular-nums ${mod.grade >= 7 ? 'text-slate-900' : 'text-rose-600'}`}>{mod.grade.toFixed(1)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 font-medium">—</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
