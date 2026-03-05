import { getIndicadoresExecutivos, getDRE } from "@/erp/actions/relatorioActions";
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

function fmtMoeda(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); }
function fmtPct(n: number) { return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`; }

const ICON_MAP: Record<string, React.ElementType> = {
    'revenue': DollarSign, 'students': Users, 'roa': BarChart2, 'expenses': TrendingDown, 'default': TrendingUp
};

export default async function AdminRelatoriosPage() {
    const [indicadores, dre] = await Promise.all([getIndicadoresExecutivos(), getDRE()]);

    const receita = dre.linhas.find(l => l.tipo === 'RECEITA_BRUTA');
    const lucroLiquido = dre.linhas.find(l => l.tipo === 'LUCRO_LIQUIDO');
    const despesas = dre.linhas.find(l => l.tipo === 'DESPESA_TOTAL');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Relatórios Executivos</h1>
                <p className="text-slate-500 mt-1 text-sm">Visão gerencial consolidada — {dre.periodoLabel}</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {indicadores.map(ind => {
                    const positivo = (ind.variacao ?? 0) >= 0;
                    const Icon = ICON_MAP[ind.tipo] ?? ICON_MAP['default'];
                    return (
                        <div key={ind.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                                    <Icon className="w-4.5 h-4.5 text-violet-600" />
                                </div>
                                {ind.variacao !== undefined && (
                                    <div className={`flex items-center gap-1 text-xs font-semibold ${positivo ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {positivo ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                        {fmtPct(ind.variacao)}
                                    </div>
                                )}
                            </div>
                            <div className="text-xl font-bold text-slate-900">
                                {ind.formato === 'moeda' ? fmtMoeda(ind.valor) : ind.formato === 'percentual' ? `${ind.valor.toFixed(1)}%` : ind.valor.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{ind.titulo}</div>
                            {ind.meta && (
                                <div className="mt-2">
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min(100, (ind.valor / ind.meta) * 100)}%` }} />
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">{((ind.valor / ind.meta) * 100).toFixed(0)}% da meta</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* DRE Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-violet-600" /> Demonstrativo de Resultados (DRE)
                    </h2>
                    <Link href="/financeiro/dre" className="flex items-center gap-1 text-sm text-violet-600 hover:underline font-semibold">
                        Ver completo <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="px-6 py-4 space-y-2">
                    {receita && (
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-sm font-semibold text-slate-700">Receita Bruta</span>
                            <span className="text-sm font-bold text-emerald-600">{fmtMoeda(receita.valorAtual)}</span>
                        </div>
                    )}
                    {despesas && (
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-sm font-semibold text-slate-700">Despesas Totais</span>
                            <span className="text-sm font-bold text-rose-600">{fmtMoeda(despesas.valorAtual)}</span>
                        </div>
                    )}
                    {lucroLiquido && (
                        <div className={`flex items-center justify-between py-3 rounded-xl px-3 ${lucroLiquido.valorAtual >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                            <span className="font-bold text-slate-800">Lucro Líquido</span>
                            <span className={`text-lg font-bold ${lucroLiquido.valorAtual >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{fmtMoeda(lucroLiquido.valorAtual)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Relatórios Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { href: '/financeiro/dre', label: 'DRE Completo', desc: 'Demonstrativo de Resultados', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50' },
                    { href: '/financeiro/fluxo-caixa', label: 'Fluxo de Caixa', desc: 'Entradas e saídas do período', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { href: '/financeiro/bolsas', label: 'Bolsas e Descontos', desc: 'Gestão de benefícios', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map(card => (
                    <Link key={card.href} href={card.href} className={`${card.bg} rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow`}>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div className="flex-1">
                            <div className={`font-bold ${card.color}`}>{card.label}</div>
                            <div className="text-xs text-slate-500">{card.desc}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
