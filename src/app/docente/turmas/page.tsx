import { getAlunosByTurma, getDocenteTurmas } from "@/lms/actions/docenteActions"
import { PageHeader } from "@/components/layout"
import { EduKpiGrid, CommunicationCard } from "@/components/educacional/dashboard-kit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, UserX, ClipboardCheck } from "lucide-react"

export default async function TurmasPage() {
    const turmas = await getDocenteTurmas()
    const turmasComAlunos = await Promise.all(turmas.map(async (turma) => ({ ...turma, alunos: await getAlunosByTurma(turma.id) })))

    const totalAlunos = turmasComAlunos.reduce((acc, t) => acc + t.totalAlunos, 0)
    const emRisco = turmasComAlunos.reduce((acc, t) => acc + t.alunos.filter((a) => a.status !== "Regular").length, 0)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Turmas do docente"
                description="Acompanhamento de frequência, engajamento e intervenções por turma."
            />

            <EduKpiGrid
                items={[
                    { label: "Turmas", value: turmas.length, hint: "Semestre atual", icon: <Users className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Alunos", value: totalAlunos, hint: "Total sob acompanhamento", icon: <Users className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                    { label: "Em risco", value: emRisco, hint: "Frequência / desempenho", icon: <UserX className="w-4 h-4 text-rose-600" />, tone: "danger" },
                    { label: "Registros", value: "100%", hint: "Plano e frequência atualizados", icon: <ClipboardCheck className="w-4 h-4 text-emerald-600" />, tone: "success" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-slate-200 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Visão por turma</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {turmasComAlunos.map((turma) => {
                            const riscoTurma = turma.alunos.filter((a) => a.status !== "Regular").length
                            return (
                                <div key={turma.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{turma.nome}</p>
                                            <p className="text-xs text-slate-500">{turma.curso} · {turma.semestre}</p>
                                        </div>
                                        <Badge variant="outline">{turma.totalAlunos} alunos</Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {turma.diasSemana} · {turma.horario}</p>
                                    {riscoTurma > 0 && <p className="text-xs font-medium text-rose-600">{riscoTurma} aluno(s) em risco nesta turma</p>}
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <CommunicationCard
                    items={[
                        { id: "dt1", channel: "Aviso", title: "Prazo de lançamento AV1", meta: "Coordenação" },
                        { id: "dt2", channel: "Mensagem", title: "Solicitação de plano de aula", meta: "Pedagógico" },
                        { id: "dt3", channel: "Ocorrência", title: "Aluno com baixa frequência", meta: "Turma T002" },
                    ]}
                />
            </div>
        </div>
    )
}
