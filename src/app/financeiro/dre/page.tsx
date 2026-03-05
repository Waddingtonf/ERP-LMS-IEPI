import { getDRE } from "@/erp/actions/relatorioActions";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";

function fmtMoeda(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); }
function fmtPct(n: number) { return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`; }

const TIPO_LABELS: Record<string, { label: string; indent: number; bold: boolean; separator?: boolean }> = {
    'RECEITA_BRUTA':          { label: '(+) Receita Bruta',             indent: 0, bold: true },
    'DEDUCAO_RECEITA':        { label: '(-) Deduções da Receita',       indent: 1, bold: false },
    'RECEITA_LIQUIDA':        { label: '(=) Receita Líquida',           indent: 0, bold: true, separator: true },
    'CUSTO_SERVICOS':         { label: '(-) Custo dos Serviços (CPV)',  indent: 1, bold: false },
    'LUCRO_BRUTO':            { label: '(=) Lucro Bruto',               indent: 0, bold: true, separator: true },
    'DESPESA_PESSOAL':        { label: '(-) Despesas com Pessoal',      indent: 1, bold: false },
    'DESPESA_MARKETING':      { label: '(-) Marketing & Captação',       indent: 1, bold: false },
    'DESPESA_ADMIN':          { label: '(-) Despesas Administrativas',  indent: 1, bold: false },
    'DESPESA_TECNOLOGIA':     { label: '(-) Tecnologia & Plataformas',  indent: 1, bold: false },
    'DESPESA_TOTAL':          { label: '(=) Total de Despesas',         indent: 0, bold: true, separator: true },
    'EBITDA':                 { label: '(=) EBITDA',                    indent: 0, bold: true, separator: true },
    'DEPRECIACAO':            { label: '(-) Depreciação',               indent: 1, bold: false },
    'RESULTADO_FINANCEIRO':   { label: '(+/-) Resultado Financeiro',    indent: 1, bold: false },
    'LUCRO_ANTES_IR':         { label: '(=) Lucro Antes do IR',         indent: 0, bold: true, separator: true },
    'IMPOSTOS':               { label: '(-) Impostos e Contribuições',  indent: 1, bold: false },
    'LUCRO_LIQUIDO':          { label: '(=) Lucro Líquido',             indent: 0, bold: true, separator: true },
};

export default async function FinanceiroDREPage() {
    const dre = await getDRE();

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">DRE — Demonstrativo de Resultados</h1>
                    <p className="text-slate-500 mt-1 text-sm">Período: {dre.periodoLabel}</p>
                </div>
                <button className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
                    <FileText className="w-4 h-4" /> Exportar PDF
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-violet-700 to-indigo-700 text-white">
                    <h2 className="font-bold">Demonstrativo de Resultados do Exercício</h2>
                    <div className="text-white/70 text-sm">{dre.periodoLabel} · Valores em BRL</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Conta</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Período Atual</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Período Anterior</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Variação</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">% Receita</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dre.linhas.map(linha => {
                                const cfg = TIPO_LABELS[linha.tipo] ?? { label: linha.descricao, indent: 0, bold: false };
                                const variacao = linha.valorAnterior > 0 ? ((linha.valorAtual - linha.valorAnterior) / linha.valorAnterior) * 100 : null;
                                const receitaBruta = dre.linhas.find(l => l.tipo === 'RECEITA_BRUTA')?.valorAtual ?? 1;
                                const pctReceita = ((linha.valorAtual / receitaBruta) * 100).toFixed(1);
                                const isNegative = ['DEDUCAO_RECEITA','CUSTO_SERVICOS','DESPESA_PESSOAL','DESPESA_MARKETING','DESPESA_ADMIN','DESPESA_TECNOLOGIA','DESPESA_TOTAL','DEPRECIACAO','IMPOSTOS'].includes(linha.tipo);
                                const isLucro = linha.tipo === 'LUCRO_LIQUIDO';
                                return (
                                    <tr key={linha.tipo} className={`${cfg.separator ? 'border-t-2 border-slate-300' : ''} ${cfg.bold ? 'bg-slate-50/80' : 'hover:bg-slate-50/40'} transition-colors`}>
                                        <td className={`px-6 py-3 ${cfg.bold ? 'font-bold text-slate-900' : 'text-slate-700'}`} style={{ paddingLeft: `${24 + cfg.indent * 20}px` }}>
                                            {cfg.label}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-${cfg.bold ? 'bold' : 'medium'} ${isLucro ? (linha.valorAtual >= 0 ? 'text-emerald-700 text-base' : 'text-rose-700 text-base') : isNegative ? 'text-rose-700' : 'text-slate-800'}`}>
                                            {fmtMoeda(linha.valorAtual)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-400">{fmtMoeda(linha.valorAnterior)}</td>
                                        <td className={`px-4 py-3 text-right text-xs font-semibold ${variacao === null ? 'text-slate-300' : variacao >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {variacao !== null ? (
                                                <span className="flex items-center justify-end gap-1">
                                                    {variacao >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {fmtPct(variacao)}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-4 py-3 pr-6 text-right text-xs text-slate-400">{pctReceita}%</td>
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
