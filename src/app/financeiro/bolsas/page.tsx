import { getBolsas, revogarBolsaAction } from "@/erp/actions/bolsaActions";
import { Users, DollarSign, Tag, Plus, Trash2 } from "lucide-react";

function fmtMoeda(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); }

const TIPO_COLOR: Record<string, string> = {
    'CRM':          'bg-blue-100 text-blue-700',
    'Social':       'bg-emerald-100 text-emerald-700',
    'Antecipado':   'bg-amber-100 text-amber-700',
    'Convenio':     'bg-purple-100 text-purple-700',
    'Excelencia':   'bg-violet-100 text-violet-700',
};

const STATUS_COLOR: Record<string, string> = {
    'Ativa':      'bg-emerald-100 text-emerald-700',
    'Suspensa':   'bg-amber-100 text-amber-700',
    'Encerrada':  'bg-slate-100 text-slate-500',
    'Pendente':   'bg-blue-100 text-blue-700',
};

export default async function FinanceiroBolsasPage() {
    const bolsas = await getBolsas();
    const totalAtivas = bolsas.filter(b => b.status === 'Ativa').length;
    const ativaBolsas = bolsas.filter(b => b.status === 'Ativa');
    const mediaDesconto = ativaBolsas.length > 0
        ? ativaBolsas.reduce((acc, b) => acc + b.percentualDesconto, 0) / ativaBolsas.length
        : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bolsas e Descontos</h1>
                    <p className="text-slate-500 mt-1 text-sm">{bolsas.length} bolsas cadastradas · {totalAtivas} ativas</p>
                </div>
                <button className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
                    <Plus className="w-4 h-4" /> Nova Bolsa
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-violet-50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Tag className="w-5 h-5 text-violet-500" /></div>
                    <div><div className="text-2xl font-bold text-violet-600">{totalAtivas}</div><div className="text-xs text-slate-500">Bolsas Ativas</div></div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
                    <div><div className="text-2xl font-bold text-emerald-600">{mediaDesconto.toFixed(0)}%</div><div className="text-xs text-slate-500">Desconto Médio ativo</div></div>
                </div>
                <div className="bg-slate-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Users className="w-5 h-5 text-slate-500" /></div>
                    <div><div className="text-2xl font-bold text-slate-600">{bolsas.length}</div><div className="text-xs text-slate-500">Total Cadastradas</div></div>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/70 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Desconto</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Vagas</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bolsas.map(bolsa => (
                                <tr key={bolsa.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{bolsa.nome}</div>
                                        {bolsa.descricao && <div className="text-xs text-slate-400 mt-0.5">{bolsa.descricao}</div>}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIPO_COLOR[bolsa.tipo] ?? 'bg-slate-100 text-slate-600'}`}>{bolsa.tipo}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center font-bold text-violet-700">
                                        {bolsa.percentualDesconto > 0 ? `${bolsa.percentualDesconto}%` : bolsa.valorMaximo ? fmtMoeda(bolsa.valorMaximo) : '—'}
                                    </td>
                                    <td className="px-4 py-4 text-center text-slate-600">
                                        {`${bolsa.vagasTotal - bolsa.vagasOcupadas}/${bolsa.vagasTotal}`}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[bolsa.status] ?? 'bg-slate-100 text-slate-500'}`}>{bolsa.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="text-violet-600 hover:underline text-xs font-semibold">Aplicar</button>
                                            {bolsa.status === 'Ativa' && (
                                                <form action={revogarBolsaAction.bind(null, bolsa.id, 'Admin')}>
                                                    <button className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
