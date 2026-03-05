import { getLeadsByFunil, updateLeadStatusAction } from "@/crm/actions/leadActions";
import type { Lead, LeadStatus } from "@/crm/repositories/LeadRepository";
import { User, Phone, Mail, ArrowRight } from "lucide-react";

const FUNIL: { status: LeadStatus; label: string; color: string; bg: string; border: string }[] = [
    { status: 'Novo',         label: 'Novos',          color: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-200' },
    { status: 'Contato',      label: 'Em Contato',     color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
    { status: 'Interessado',  label: 'Interessados',   color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
    { status: 'Proposta',     label: 'Proposta',       color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
    { status: 'Convertido',   label: 'Convertidos',    color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200' },
    { status: 'Perdido',      label: 'Perdidos',       color: 'text-rose-700',   bg: 'bg-rose-50',   border: 'border-rose-200' },
];

async function KanbanColumn({ status, label, color, bg, border }: typeof FUNIL[number]) {
    const leads = await getLeadsByFunil(status);
    return (
        <div className={`rounded-2xl border ${border} ${bg} p-4 min-w-[200px] flex-1`}>
            <div className={`flex items-center justify-between mb-3`}>
                <span className={`text-xs font-bold uppercase tracking-wide ${color}`}>{label}</span>
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-white ${bg.replace('bg-', 'bg-').replace('50', '500')}`} style={{backgroundColor: 'currentColor'}}>
                    <span className={color}>{leads.length}</span>
                </span>
            </div>
            <div className="space-y-2">
                {leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
                {leads.length === 0 && <div className="text-center text-xs text-slate-400 py-6">Vazio</div>}
            </div>
        </div>
    );
}

function LeadCard({ lead }: { lead: Lead }) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-800 truncate flex-1">{lead.nome}</span>
            </div>
            {lead.cursoInteresse && (
                <div className="text-xs text-slate-500 mb-2 truncate">{lead.cursoInteresse}</div>
            )}
            <div className="flex items-center gap-2">
                {lead.email && <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-violet-600 transition-colors"><Mail className="w-3.5 h-3.5" /></a>}
                {lead.telefone && <a href={`tel:${lead.telefone}`} className="text-slate-400 hover:text-violet-600 transition-colors"><Phone className="w-3.5 h-3.5" /></a>}
                <span className="ml-auto text-xs text-slate-400">{lead.origem}</span>
            </div>
        </div>
    );
}

export default async function AdminCRMPage() {
    const funilData = await Promise.all(FUNIL.map(f => getLeadsByFunil(f.status)));
    const totalLeads = funilData.reduce((a, b) => a + b.length, 0);
    const convertidos = funilData[4].length;
    const taxaConversao = totalLeads > 0 ? ((convertidos / totalLeads) * 100).toFixed(0) : '0';

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">CRM · Funil de Vendas</h1>
                    <p className="text-slate-500 mt-1 text-sm">{totalLeads} leads ativos · Taxa de conversão {taxaConversao}%</p>
                </div>
                <a href="/admin/crm/leads" className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
                    Todos os Leads <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {FUNIL.map(col => (
                    <KanbanColumn key={col.status} {...col} />
                ))}
            </div>
        </div>
    );
}
