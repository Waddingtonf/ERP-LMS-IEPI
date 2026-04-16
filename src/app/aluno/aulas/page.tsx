import { getStudentDashboardData } from "@/lms/actions/studentActions"
import { getProgressoCurso } from "@/lms/actions/progressoActions"
import { getAulasByTurma } from "@/lms/actions/turmaActions"
import { getTurmaById } from "@/lms/actions/turmaActions"
import { PageHeader } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, Users, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface AulaData {
    id: string
    titulo: string
    disciplina: string
    turma: string
    instrutor: string
    duracao: number
    dataInicio: string
    status: "Não iniciado" | "Em progresso" | "Concluído"
    progresso: number
    totalAulaS: number
    aulasAssistidas: number
    alunos: number
}

function getStatusConfig(status: AulaData["status"]) {
    const configs: Record<AulaData["status"], { icon: React.ElementType; color: string; label: string }> = {
        "Não iniciado": { icon: AlertCircle, color: "bg-slate-100 text-slate-600 border-slate-200", label: "Não iniciado" },
        "Em progresso": { icon: PlayCircle, color: "bg-blue-100 text-blue-600 border-blue-200", label: "Em andamento" },
        Concluído: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-600 border-emerald-200", label: "Concluído" },
    }
    return configs[status]
}

export default async function MinhasAulasPage() {
    const dashboard = await getStudentDashboardData()
    const activeEnrollments = dashboard.enrollments.filter(e => e.status === "Ativo" || e.status === "Concluido")

    const aulas = await Promise.all(
        activeEnrollments.map(async (enr) => {
            const turmaInfo = enr.turmaId ? await getTurmaById(enr.turmaId) : null
            const progressoData = await getProgressoCurso(enr.courseId)
            const aulasDaTurma = enr.turmaId ? await getAulasByTurma(enr.turmaId) : []

            const totalAulas = aulasDaTurma.length
            const assistidas = progressoData.records.length

            let status: AulaData["status"] = "Não iniciado"
            if (assistidas > 0 && assistidas < totalAulas) status = "Em progresso"
            if (totalAulas > 0 && assistidas >= totalAulas) status = "Concluído"

            return {
                id: enr.turmaId ?? enr.courseId,
                titulo: turmaInfo?.courseName ?? enr.title,
                disciplina: enr.moduleName ?? "Disciplina Geral",
                turma: turmaInfo?.code ?? enr.turmaId ?? "Sem Turma",
                instrutor: turmaInfo?.instructorName ?? "EAD",
                duracao: aulasDaTurma.reduce((acc, a) => acc + (a.durationMinutes || 0), 0),
                dataInicio: turmaInfo?.startDate ?? enr.dataMatricula,
                status,
                progresso: progressoData.percentual ?? 0,
                totalAulaS: totalAulas,
                aulasAssistidas: assistidas,
                alunos: turmaInfo?.maxStudents ?? 0,
            } as AulaData
        })
    )

    const totais = {
        total: aulas.length,
        emProgresso: aulas.filter((a) => a.status === "Em progresso").length,
        concluidas: aulas.filter((a) => a.status === "Concluído").length,
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Minhas Turmas"
                description="Acompanhe seu progresso nas disciplinas e acesse o conteúdo das aulas"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-slate-600 font-medium mb-2">Total de Disciplinas</p>
                            <p className="text-3xl font-bold text-violet-600">{totais.total}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-slate-600 font-medium mb-2">Em Andamento</p>
                            <p className="text-3xl font-bold text-blue-600">{totais.emProgresso}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-slate-600 font-medium mb-2">Concluídas</p>
                            <p className="text-3xl font-bold text-emerald-600">{totais.concluidas}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Aulas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aulas.map((aula) => {
                    const statusConfig = getStatusConfig(aula.status)
                    const StatusIcon = statusConfig.icon

                    return (
                        <Link key={aula.id} href={`/aluno/aulas/${aula.id}`}>
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-slate-200/50">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg leading-tight">{aula.titulo}</CardTitle>
                                            <p className="text-sm text-slate-600 mt-1">{aula.disciplina}</p>
                                        </div>
                                        <Badge variant="outline" className={statusConfig.color}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {statusConfig.label}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Instructor and Course Code */}
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-slate-500">Instrutor:</span>{" "}
                                            <span className="font-medium text-slate-700">{aula.instrutor}</span>
                                        </p>
                                        <p>
                                            <span className="text-slate-500">Turma:</span>{" "}
                                            <span className="font-mono text-violet-600 font-semibold">{aula.turma}</span>
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Progresso</span>
                                            <span className="font-semibold text-violet-600">{aula.progresso}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all"
                                                style={{ width: `${aula.progresso}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {aula.aulasAssistidas} de {aula.totalAulaS} aulas assistidas
                                        </p>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{aula.duracao} min</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{aula.alunos} alunos</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="pt-2">
                                        <button className="w-full px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                            {aula.status === "Concluído" ? "Revisar Conteúdo" : "Continuar"}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {aulas.length === 0 && (
                <div className="text-center py-12">
                    <PlayCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Nenhuma aula disponível</p>
                    <p className="text-sm text-slate-500">Você será inscrito em aulas assim que se matricular em um curso.</p>
                </div>
            )}
        </div>
    )
}
