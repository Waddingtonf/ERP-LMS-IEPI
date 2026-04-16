import { getTurmaRepository } from "@/lms/repositories"
import { PageHeader } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, Users, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const MOCK_STUDENT_ID = "student-1"

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

const MOCK_AULAS: AulaData[] = [
    {
        id: "aula-1",
        titulo: "Princípios de Farmacoterapia",
        disciplina: "Farmacologia Aplicada",
        turma: "T2024-FA-001",
        instrutor: "Prof. Dra. Marina Costa",
        duracao: 45,
        dataInicio: "2026-02-01",
        status: "Em progresso",
        progresso: 65,
        totalAulaS: 12,
        aulasAssistidas: 8,
        alunos: 28,
    },
    {
        id: "aula-2",
        titulo: "Protocolos de Quimioterapia",
        disciplina: "Oncologia Clínica",
        turma: "T2024-OC-002",
        instrutor: "Prof. Dr. Marcos Oliveira",
        duracao: 60,
        dataInicio: "2026-02-15",
        status: "Não iniciado",
        progresso: 0,
        totalAulaS: 10,
        aulasAssistidas: 0,
        alunos: 35,
    },
    {
        id: "aula-3",
        titulo: "Fundamentos de Patologia",
        disciplina: "Patologia Clínica",
        turma: "T2024-PC-003",
        instrutor: "Prof. Dr. Ricardo Silva",
        duracao: 50,
        dataInicio: "2026-01-10",
        status: "Concluído",
        progresso: 100,
        totalAulaS: 15,
        aulasAssistidas: 15,
        alunos: 32,
    },
    {
        id: "aula-4",
        titulo: "Gestão Hospitalar e Compliance",
        disciplina: "Administração em Saúde",
        turma: "T2024-AS-004",
        instrutor: "Prof. Dra. Juliana Rocha",
        duracao: 55,
        dataInicio: "2026-02-10",
        status: "Em progresso",
        progresso: 40,
        totalAulaS: 8,
        aulasAssistidas: 3,
        alunos: 29,
    },
]

function getStatusConfig(status: AulaData["status"]) {
    const configs: Record<AulaData["status"], { icon: React.ElementType; color: string; label: string }> = {
        "Não iniciado": { icon: AlertCircle, color: "bg-slate-100 text-slate-600 border-slate-200", label: "Não iniciado" },
        "Em progresso": { icon: PlayCircle, color: "bg-blue-100 text-blue-600 border-blue-200", label: "Em andamento" },
        Concluído: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-600 border-emerald-200", label: "Concluído" },
    }
    return configs[status]
}

export default async function MinhasAulasPage() {
    const aulas = MOCK_AULAS

    const totais = {
        total: aulas.length,
        emProgresso: aulas.filter((a) => a.status === "Em progresso").length,
        concluidas: aulas.filter((a) => a.status === "Concluído").length,
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Minhas Aulas"
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
