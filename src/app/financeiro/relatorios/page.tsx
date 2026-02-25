import { getResumoFinanceiro, getContasReceber } from "@/lms/actions/financeiroActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Download } from "lucide-react";

function formatCurrency(centavos: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

export default async function RelatoriosPage() {
    const [resumo, contas] = await Promise.all([getResumoFinanceiro(), getContasReceber()]);

    // Distribuição de receita por método de pagamento (mock)
    const porMetodo = contas.reduce<Record<string, number>>((acc, c) => {
        acc[c.metodoPagamento] = (acc[c.metodoPagamento] ?? 0) + c.valor;
        return acc;
    }, {});

    const totalMetodo = Object.values(porMetodo).reduce((a, b) => a + b, 0);

    // Dados simulados mensais
    const meses = ["Set", "Out", "Nov", "Dez", "Jan", "Fev"];
    const receitaMensal = [3210000, 3780000, 4100000, 3950000, 4210000, 4523189];
    const maxReceita = Math.max(...receitaMensal);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Relatórios Financeiros</h2>
                    <p className="text-slate-500 mt-1">Análise consolidada de receitas, despesas e indicadores.</p>
                </div>
                <button className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    Exportar PDF
                </button>
            </div>

            {/* KPIs Consolidados */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-emerald-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-emerald-700">MRR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-800">{formatCurrency(resumo.mrrCentavos)}</div>
                        <p className="text-xs text-emerald-600 mt-1">+{resumo.variMrrPct}% vs. mês ant.</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-blue-700">A Receber</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-800">
                            {formatCurrency(resumo.contasReceberHojeCentavos)}
                        </div>
                        <p className="text-xs text-blue-600 mt-1">{resumo.qtdBoletos} boletos</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-600">A Pagar (7d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {formatCurrency(resumo.contasPagarSemana)}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{resumo.qtdContasPagar} obrigações</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-amber-700">Inadimplência</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-800">{resumo.taxaInadimplencia}%</div>
                        <p className="text-xs text-red-500 mt-1">+{resumo.variInadimplenciaPct}% este mês</p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico de receita mensal (simulado com CSS) */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                        <CardTitle className="text-lg text-slate-800">Receita Mensal (Últimos 6 meses)</CardTitle>
                    </div>
                    <CardDescription>Evolução da receita mensal recorrente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-3 h-40 px-4">
                        {receitaMensal.map((valor, idx) => {
                            const pct = Math.round((valor / maxReceita) * 100);
                            const isLast = idx === receitaMensal.length - 1;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-600">
                                        {formatCurrency(valor).replace("R$\u00a0", "")}
                                    </span>
                                    <div
                                        className={`w-full rounded-t-md transition-all ${isLast ? "bg-emerald-500" : "bg-emerald-200"}`}
                                        style={{ height: `${pct}%` }}
                                    />
                                    <span className="text-xs text-slate-400">{meses[idx]}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Distribuição por Método de Pagamento */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-violet-600" />
                        <CardTitle className="text-lg text-slate-800">Distribuição por Meio de Pagamento</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {Object.entries(porMetodo).map(([metodo, valor]) => {
                            const pct = totalMetodo > 0 ? Math.round((valor / totalMetodo) * 100) : 0;
                            return (
                                <div key={metodo} className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700">{metodo}</span>
                                        <span className="text-slate-500">{formatCurrency(valor)} ({pct}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                                        <div
                                            className="bg-violet-500 h-2.5 rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Indicadores Complementares */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-lg text-slate-800">Indicadores Complementares</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: "Ticket Médio", valor: "R$ 483,20", tendencia: "+5.2%" },
                            { label: "LTV Médio por Aluno", valor: "R$ 2.840,00", tendencia: "+3.1%" },
                            { label: "CAC (Custo de Aquisição)", valor: "R$ 127,50", tendencia: "-2.8%" },
                            { label: "Churn Rate", valor: "2.1%", tendencia: "-0.4%" },
                            { label: "Net Revenue Retention", valor: "108%", tendencia: "+2%" },
                            { label: "Margem Operacional", valor: "38.5%", tendencia: "+1.1%" },
                        ].map((item) => (
                            <div key={item.label} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{item.valor}</p>
                                <p className={`text-xs font-semibold mt-0.5 ${
                                    item.tendencia.startsWith("+") ? "text-emerald-600" : "text-red-500"
                                }`}>{item.tendencia} vs mês ant.</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
