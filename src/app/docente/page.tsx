import { PageHeader, PageSection } from "@/components/layout"
import { AcademicPlanCard, CommunicationCard, EduKpiGrid, LearningPathCard } from "@/components/educacional/dashboard-kit"
import { BookOpen, CalendarDays, CheckSquare, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocenteDashboard() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Painel do Docente"
                description="Acompanhe turmas, plano de aula, avaliações e comunicação acadêmica."
            />

            <EduKpiGrid
                items={[
                    { label: "Turmas Ativas", value: 3, hint: "Semestre 2026.1", icon: <Users className="w-4 h-4 text-blue-600" />, tone: "brand" },
                    { label: "Alunos", value: 80, hint: "Distribuídos em 3 turmas", icon: <BookOpen className="w-4 h-4 text-violet-600" />, tone: "neutral" },
                    { label: "Notas Pendentes", value: 3, hint: "Fechamento AV1 em 5 dias", icon: <CheckSquare className="w-4 h-4 text-amber-600" />, tone: "warning" },
                    { label: "Aulas na Semana", value: 4, hint: "2 práticas e 2 teóricas", icon: <CalendarDays className="w-4 h-4 text-emerald-600" />, tone: "success" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <LearningPathCard
                    title="Trilha da turma (macro)"
                    modules={[
                        { id: "d1", title: "Módulo I - Fundamentos", progress: 100, status: "Concluído" },
                        { id: "d2", title: "Módulo II - Aplicações", progress: 64, status: "Em andamento" },
                        { id: "d3", title: "Módulo III - Projeto", progress: 10, status: "Pendente" },
                    ]}
                />
                <AcademicPlanCard
                    events={[
                        { id: "de1", title: "Aula prática laboratório", dateLabel: "Qui · 14:00", type: "Plano de aula" },
                        { id: "de2", title: "Lançamento de frequência", dateLabel: "Após cada aula", type: "Registro" },
                        { id: "de3", title: "Fechamento parcial de notas", dateLabel: "18/03", type: "Avaliação" },
                    ]}
                />
                <CommunicationCard
                    items={[
                        { id: "dc1", channel: "Mensagem", title: "5 dúvidas pendentes no fórum", meta: "Turma T001" },
                        { id: "dc2", channel: "Aviso", title: "Mudança de sala para aula prática", meta: "Secretaria" },
                        { id: "dc3", channel: "Ocorrência", title: "2 alunos com baixa frequência", meta: "Pedagógico" },
                    ]}
                />
            </div>

            <PageSection title="Ações pedagógicas" description="Prioridades para manter engajamento e desempenho">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-slate-200">
                        <CardHeader><CardTitle className="text-base">Checklist semanal</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-600">
                            <p>• Atualizar plano de aula da semana</p>
                            <p>• Consolidar frequência por turma</p>
                            <p>• Publicar feedback de avaliação</p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200">
                        <CardHeader><CardTitle className="text-base">Risco acadêmico</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-600">
                            <p>• 2 alunos com frequência abaixo de 75%</p>
                            <p>• 1 aluno com média inferior a 7,0</p>
                            <p>• Encaminhamento pedagógico sugerido</p>
                        </CardContent>
                    </Card>
                </div>
            </PageSection>
        </div>
    )
}
