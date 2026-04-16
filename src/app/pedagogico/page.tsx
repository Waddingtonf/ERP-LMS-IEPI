import { PageHeader, PageSection } from "@/components/layout"
import { AcademicPlanCard, CommunicationCard, EduKpiGrid } from "@/components/educacional/dashboard-kit"
import { AlertCircle, MessageSquareWarning, TrendingUp, UserMinus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const riskRows = [
    { nome: "Fernanda Rocha", curso: "Feridas e Estomias", freq: 62, media: 5.8, risco: "Crítico" },
    { nome: "Ricardo Menezes", curso: "Oncologia Técnicos", freq: 68, media: 6.3, risco: "Crítico" },
    { nome: "Luana Cavalcante", curso: "Gestão em Saúde", freq: 72, media: 6.9, risco: "Alto" },
]

export default function PedagogicoDashboard() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Painel Pedagógico"
                description="Monitoramento de engajamento, risco de evasão e plano de intervenção educacional."
            />

            <EduKpiGrid
                items={[
                    { label: "Alunos em Risco", value: 6, hint: "3 casos críticos", icon: <AlertCircle className="w-4 h-4 text-rose-600" />, tone: "danger" },
                    { label: "Ocorrências Abertas", value: 4, hint: "2 SLA vencidos", icon: <MessageSquareWarning className="w-4 h-4 text-amber-600" />, tone: "warning" },
                    { label: "Taxa de Retenção", value: "97,9%", hint: "Semestre vigente", icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, tone: "success" },
                    { label: "Vigilância de Evasão", value: 3, hint: "inativos > 7 dias", icon: <UserMinus className="w-4 h-4 text-orange-600" />, tone: "neutral" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <AcademicPlanCard
                    events={[
                        { id: "p1", title: "Revisão de plano de recuperação", dateLabel: "15/03", type: "Intervenção" },
                        { id: "p2", title: "Reunião com docentes de risco", dateLabel: "16/03 · 10:00", type: "Governança" },
                        { id: "p3", title: "Envio de plano individual", dateLabel: "17/03", type: "Acompanhamento" },
                    ]}
                />
                <CommunicationCard
                    items={[
                        { id: "pc1", channel: "Ocorrência", title: "Infrequência recorrente na turma 2026.1", meta: "SLA vencido" },
                        { id: "pc2", channel: "Mensagem", title: "Docente solicitou apoio para 2 alunos", meta: "Hoje · 08:40" },
                        { id: "pc3", channel: "Aviso", title: "Ação de retenção iniciada", meta: "Coordenação" },
                    ]}
                />
            </div>

            <PageSection title="Mapa de risco acadêmico" description="Alunos com prioridade de atuação">
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base">Prioridade de acompanhamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {riskRows.map((row) => (
                            <div key={row.nome} className="rounded-lg border border-slate-200 px-3 py-2 flex items-center justify-between gap-3 text-sm">
                                <div>
                                    <p className="font-medium text-slate-800">{row.nome}</p>
                                    <p className="text-xs text-slate-500">{row.curso}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Freq. {row.freq}% · Média {row.media}</p>
                                    <p className="text-xs font-semibold text-rose-600">Risco {row.risco}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </PageSection>
        </div>
    )
}
