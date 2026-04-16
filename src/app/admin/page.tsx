import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader, PageSection } from "@/components/layout"
import { AcademicPlanCard, CommunicationCard, EduKpiGrid, LearningPathCard } from "@/components/educacional/dashboard-kit"
import { Activity, CalendarDays, DollarSign, GraduationCap, Users } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard Educacional"
                description="Visão integrada de operação acadêmica, trilhas e financeiro institucional."
            />

            <EduKpiGrid
                items={[
                    { label: "Alunos Ativos", value: "1.245", hint: "+12% no mês", icon: <Users className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Turmas Ativas", value: "42", hint: "8 cursos em execução", icon: <GraduationCap className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                    { label: "Receita do Mês", value: "R$ 154.300", hint: "Meta: R$ 160.000", icon: <DollarSign className="w-4 h-4 text-emerald-600" />, tone: "success" },
                    { label: "Conclusão Média", value: "68%", hint: "Meta pedagógica 75%", icon: <Activity className="w-4 h-4 text-amber-600" />, tone: "warning" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <LearningPathCard
                    modules={[
                        { id: "m1", title: "Trilha Base IEPI", progress: 100, status: "Concluído" },
                        { id: "m2", title: "Trilha Técnica", progress: 72, status: "Em andamento" },
                        { id: "m3", title: "Projeto Integrador", progress: 25, status: "Pendente" },
                    ]}
                />
                <AcademicPlanCard
                    events={[
                        { id: "e1", title: "Conselho pedagógico", dateLabel: "14/03 · 09:00", type: "Governança" },
                        { id: "e2", title: "Fechamento AV1", dateLabel: "18/03", type: "Avaliação" },
                        { id: "e3", title: "Virada de módulo", dateLabel: "22/03", type: "Calendário" },
                    ]}
                />
                <CommunicationCard
                    items={[
                        { id: "c1", channel: "Aviso", title: "12 alunos aguardando triagem documental", meta: "Secretaria · há 2h" },
                        { id: "c2", channel: "Ocorrência", title: "2 divergências na conciliação Cielo", meta: "Financeiro · há 4h" },
                        { id: "c3", channel: "Mensagem", title: "Coordenação solicitou ajuste de trilha", meta: "Pedagógico · hoje" },
                    ]}
                />
            </div>

            <PageSection title="Operação acadêmica" description="Acompanhamento rápido de frentes críticas">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base">Últimas matrículas</CardTitle>
                            <CardDescription>Entrada recente de alunos por curso</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {["João Silva", "Maria Almeida", "Pedro Alves"].map((nome, idx) => (
                                <div key={nome} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{nome}</p>
                                        <p className="text-xs text-slate-500">{["Gestão em RH", "Atendimento", "Administração"][idx]}</p>
                                    </div>
                                    <span className="text-xs text-emerald-700 font-semibold">Pago</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Pendências prioritárias</CardTitle>
                            <CardDescription>Itens com impacto direto em retenção e receita</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-600">
                            <p>• Triagem documental com 12 cadastros aguardando validação</p>
                            <p>• Conciliação com 2 transações divergentes</p>
                            <p>• 1 turma com frequência média abaixo de 75%</p>
                        </CardContent>
                    </Card>
                </div>
            </PageSection>
        </div>
    )
}
