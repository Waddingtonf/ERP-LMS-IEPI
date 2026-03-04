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
