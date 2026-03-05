import { getLeads } from "@/crm/actions/leadActions";
import { User, Search, Filter } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
    'Novo':        'bg-sky-100 text-sky-700',
    'Contato':     'bg-blue-100 text-blue-700',
    'Interessado': 'bg-violet-100 text-violet-700',
    'Proposta':    'bg-amber-100 text-amber-700',
    'Convertido':  'bg-emerald-100 text-emerald-700',
    'Perdido':     'bg-rose-100 text-rose-700',
};

export default async function AdminLeadsPage() {
    const leads = await getLeads();

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
                    <p className="text-slate-500 mt-1 text-sm">{leads.length} leads cadastrados</p>
                </div>
                <button className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
                    Novo Lead
                </button>
            </div>

            {/* Full Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">Buscar lead...</span>
                    </div>
                    <button className="flex items-center gap-2 text-slate-600 text-sm px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/70">
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Curso de Interesse</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Origem</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Criado em</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-medium text-slate-900">{lead.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <div className="text-xs">{lead.email}</div>
                                        <div className="text-xs text-slate-400">{lead.telefone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 max-w-[180px] truncate">{lead.cursoInteresse ?? '—'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{lead.origem}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[lead.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-bold text-violet-600">{lead.score ?? '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-slate-400">{lead.criadoEm?.split('T')[0] ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
