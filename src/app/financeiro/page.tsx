import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { FINANCEIRO_RESUMO_MOCK } from "@/erp/mocks/financeiroDashboardMock"

export default function FinanceiroDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Painel Executivo</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Receita Mensal (MRR)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{FINANCEIRO_RESUMO_MOCK.mrrLabel}</div>
                        <p className="text-xs text-emerald-500 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> {FINANCEIRO_RESUMO_MOCK.mrrDeltaLabel}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contas a Receber (Hoje)</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{FINANCEIRO_RESUMO_MOCK.contasReceberHojeLabel}</div>
                        <p className="text-xs text-slate-500 mt-1">{FINANCEIRO_RESUMO_MOCK.boletosPendentesLabel}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{FINANCEIRO_RESUMO_MOCK.contasPagarLabel}</div>
                        <p className="text-xs text-slate-500 mt-1">{FINANCEIRO_RESUMO_MOCK.contasPagarHorizonLabel}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Inadimplência</CardTitle>
                        <Activity className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{FINANCEIRO_RESUMO_MOCK.inadimplenciaLabel}</div>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> {FINANCEIRO_RESUMO_MOCK.inadimplenciaDeltaLabel}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
