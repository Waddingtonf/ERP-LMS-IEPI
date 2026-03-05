import { getCampanhasComMetricas } from "@/crm/actions/campanhaActions";
import { TrendingUp, Users, Target, DollarSign, BarChart2, Plus } from "lucide-react";

const TIPO_COLOR: Record<string, string> = {
    'MetaAds':    'bg-blue-100 text-blue-700',
    'GoogleAds':  'bg-amber-100 text-amber-700',
    'Email':      'bg-emerald-100 text-emerald-700',
    'WhatsApp':   'bg-green-100 text-green-700',
    'Organico':   'bg-slate-100 text-slate-600',
    'Indicacao':  'bg-purple-100 text-purple-700',
};

const STATUS_COLOR: Record<string, string> = {
    'Ativa':     'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Pausada':   'bg-amber-100 text-amber-700 border-amber-200',
    'Encerrada': 'bg-slate-100 text-slate-500 border-slate-200',
    'Rascunho':  'bg-slate-50 text-slate-400 border-slate-100',
};

function fmt(n: number) { return new Intl.NumberFormat('pt-BR').format(n); }
function fmtMoeda(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); }

export default async function AdminCampanhasPage() {
    const campanhas = await getCampanhasComMetricas();

    const totalInvestido = campanhas.reduce((a, c) => a + (c.metricas?.gasto ?? 0), 0);
    const totalConversoes = campanhas.reduce((a, c) => a + (c.metricas?.conversoes ?? 0), 0);
    const totalLeads = campanhas.reduce((a, c) => a + (c.metricas?.leads ?? 0), 0);
    const mediaCPL = totalLeads > 0 ? totalInvestido / totalLeads : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Campanhas de Marketing</h1>
                    <p className="text-slate-500 mt-1 text-sm">{campanhas.length} campanhas · ROI médio monitorado por canal</p>
                </div>
                <button className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
                    <Plus className="w-4 h-4" /> Nova Campanha
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Investido', value: fmtMoeda(totalInvestido), icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50' },
                    { label: 'Leads Gerados', value: fmt(totalLeads), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Conversões', value: fmt(totalConversoes), icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'CPL Médio', value: fmtMoeda(mediaCPL), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map(k => (
                    <div key={k.label} className={`${k.bg} rounded-2xl p-5 flex items-center gap-4`}>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <k.icon className={`w-5 h-5 ${k.color}`} />
                        </div>
                        <div>
                            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
                            <div className="text-xs text-slate-500">{k.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cards de Campanhas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {campanhas.map(camp => (
                    <div key={camp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">{camp.nome}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIPO_COLOR[camp.tipo] ?? 'bg-slate-100 text-slate-600'}`}>{camp.tipo}</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLOR[camp.status] ?? 'bg-slate-50 text-slate-400 border-slate-100'}`}>{camp.status}</span>
                                </div>
                            </div>
                            <BarChart2 className="w-6 h-6 text-slate-300" />
                        </div>
                        {camp.metricas && (
                            <div className="px-6 py-4 grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-slate-800">{fmt(camp.metricas.leads)}</div>
                                    <div className="text-xs text-slate-400">Leads</div>
                                </div>
                                <div className="text-center border-x border-slate-100">
                                    <div className="text-lg font-bold text-slate-800">{camp.metricas.cpl !== null ? fmtMoeda(camp.metricas.cpl) : '—'}</div>
                                    <div className="text-xs text-slate-400">CPL</div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-lg font-bold ${camp.metricas.roi !== null && camp.metricas.roi > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {camp.metricas.roi !== null ? `${camp.metricas.roi.toFixed(0)}%` : '—'}
                                    </div>
                                    <div className="text-xs text-slate-400">ROI</div>
                                </div>
                            </div>
                        )}
                        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span>{camp.dataInicio} → {camp.dataFim ?? 'Em aberto'}</span>
                            <span>Orçamento: {camp.orcamento ? fmtMoeda(camp.orcamento) : '—'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
