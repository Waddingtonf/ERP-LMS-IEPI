import { getFluxoCaixa } from "@/erp/actions/relatorioActions";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

function fmtMoeda(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); }

const TIPO_COLOR: Record<string, { dot: string; row: string; icon: React.ElementType; iconColor: string }> = {
    'ENTRADA': { dot: 'bg-emerald-500', row: 'hover:bg-emerald-50/40', icon: ArrowUp,   iconColor: 'text-emerald-600' },
    'SAIDA':   { dot: 'bg-rose-500',    row: 'hover:bg-rose-50/20',    icon: ArrowDown, iconColor: 'text-rose-600' },
};

export default async function FinanceiroFluxoCaixaPage() {
    const fluxo = await getFluxoCaixa();

    const totalEntradas = fluxo.itens.filter(i => i.tipo === 'ENTRADA').reduce((a, i) => a + i.valor, 0);
    const totalSaidas   = fluxo.itens.filter(i => i.tipo === 'SAIDA').reduce((a, i) => a + i.valor, 0);
    const saldoFinal    = fluxo.saldoInicial + totalEntradas - totalSaidas;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Fluxo de Caixa</h1>
                <p className="text-slate-500 mt-1 text-sm">Período: {fluxo.periodoLabel} · Saldo inicial: {fmtMoeda(fluxo.saldoInicial)}</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
                    <div><div className="text-xl font-bold text-emerald-600">{fmtMoeda(totalEntradas)}</div><div className="text-xs text-slate-500">Total Entradas</div></div>
                </div>
                <div className="bg-rose-50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><TrendingDown className="w-5 h-5 text-rose-500" /></div>
                    <div><div className="text-xl font-bold text-rose-600">{fmtMoeda(totalSaidas)}</div><div className="text-xs text-slate-500">Total Saídas</div></div>
                </div>
                <div className={`${saldoFinal >= 0 ? 'bg-violet-50' : 'bg-rose-100'} rounded-2xl p-5 flex items-center gap-4`}>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        {saldoFinal >= 0 ? <TrendingUp className="w-5 h-5 text-violet-500" /> : <TrendingDown className="w-5 h-5 text-rose-500" />}
                    </div>
                    <div>
                        <div className={`text-xl font-bold ${saldoFinal >= 0 ? 'text-violet-600' : 'text-rose-700'}`}>{fmtMoeda(saldoFinal)}</div>
                        <div className="text-xs text-slate-500">Saldo Final</div>
                    </div>
                </div>
            </div>

            {/* Extrato */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">Movimentações</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/70 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {fluxo.itens.map(item => {
                                const cfg = TIPO_COLOR[item.tipo];
                                return (
                                    <tr key={item.id} className={`transition-colors ${cfg.row}`}>
                                        <td className="px-6 py-3 text-slate-500 text-xs">{item.data}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
                                                <span className="font-medium text-slate-900">{item.descricao}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.categoria}</span>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-semibold ${item.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            <span className="flex items-center justify-end gap-1">
                                                <cfg.icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                                                {fmtMoeda(item.valor)}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 pr-6 text-right font-medium ${item.saldoAcumulado >= 0 ? 'text-slate-700' : 'text-rose-600'}`}>
                                            {fmtMoeda(item.saldoAcumulado)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
