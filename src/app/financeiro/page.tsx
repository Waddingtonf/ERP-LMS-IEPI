import { PageHeader } from "@/components/layout"
import { AcademicPlanCard, CommunicationCard, EduKpiGrid } from "@/components/educacional/dashboard-kit"
import { Activity, ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react"
import { FINANCEIRO_RESUMO_MOCK } from "@/erp/mocks/financeiroDashboardMock"

export default function FinanceiroDashboard() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Painel Financeiro Educacional"
                description="Saúde financeira vinculada à operação acadêmica e retenção de alunos."
            />

            <EduKpiGrid
                items={[
                    {
                        label: "MRR Educacional",
                        value: FINANCEIRO_RESUMO_MOCK.mrrLabel,
                        hint: FINANCEIRO_RESUMO_MOCK.mrrDeltaLabel,
                        icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
                        tone: "success",
                    },
                    {
                        label: "Contas a Receber (Hoje)",
                        value: FINANCEIRO_RESUMO_MOCK.contasReceberHojeLabel,
                        hint: FINANCEIRO_RESUMO_MOCK.boletosPendentesLabel,
                        icon: <ArrowUpRight className="w-4 h-4 text-blue-600" />,
                        tone: "brand",
                    },
                    {
                        label: "Contas a Pagar",
                        value: FINANCEIRO_RESUMO_MOCK.contasPagarLabel,
                        hint: FINANCEIRO_RESUMO_MOCK.contasPagarHorizonLabel,
                        icon: <ArrowDownRight className="w-4 h-4 text-rose-600" />,
                        tone: "warning",
                    },
                    {
                        label: "Inadimplência",
                        value: FINANCEIRO_RESUMO_MOCK.inadimplenciaLabel,
                        hint: FINANCEIRO_RESUMO_MOCK.inadimplenciaDeltaLabel,
                        icon: <Activity className="w-4 h-4 text-amber-600" />,
                        tone: "danger",
                    },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <AcademicPlanCard
                    events={[
                        { id: "f1", title: "Fechamento de conciliação semanal", dateLabel: "Sexta · 18:00", type: "Conciliação" },
                        { id: "f2", title: "Virada de boletos de mensalidade", dateLabel: "Todo dia 05", type: "Cobrança" },
                        { id: "f3", title: "Revisão de bolsas e descontos", dateLabel: "Última semana", type: "Política acadêmica" },
                    ]}
                />
                <CommunicationCard
                    items={[
                        { id: "fm1", channel: "Aviso", title: "18 boletos pendentes de compensação", meta: "Financeiro · hoje" },
                        { id: "fm2", channel: "Ocorrência", title: "3 divergências entre gateway e ERP", meta: "Conciliação · hoje" },
                        { id: "fm3", channel: "Mensagem", title: "Coordenação pediu renegociação em lote", meta: "Pedagógico · há 1h" },
                    ]}
                />
            </div>
        </div>
    )
}
