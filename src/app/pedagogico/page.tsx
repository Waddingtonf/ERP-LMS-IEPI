import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertCircle, MessageSquareWarning, ArrowDownRight } from "lucide-react"

export default function PedagogicoDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Painel de Monitoramento</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.248</div>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                            Regularmente matriculados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Alunos em Risco</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">42</div>
                        <p className="text-xs text-slate-500 mt-1">Frequência crítica ou notas baixas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Ocorrências Abertas</CardTitle>
                        <MessageSquareWarning className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15</div>
                        <p className="text-xs text-slate-500 mt-1">5 com SLA vencido</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Evasão</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.1%</div>
                        <p className="text-xs text-slate-500 mt-1">No último semestre</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Ações Prioritárias</h3>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                    <p className="text-sm text-slate-500">
                        Selecione "Alunos em Risco" para visualizar a lista de contatos prioritários de retenção.
                    </p>
                </div>
            </div>
        </div>
    )
}
