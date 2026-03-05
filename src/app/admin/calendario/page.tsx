import { getCalendarioAcademico, criarEventoAction, deleteEventoAction } from "@/lms/actions/calendarioActions";
import { Calendar, Plus, Trash2, MapPin, Clock } from "lucide-react";

const TIPO_COLOR: Record<string, string> = {
    'Prova':           'border-l-red-500',
    'Entrega':         'border-l-orange-500',
    'Aula':            'border-l-blue-500',
    'Feriado':         'border-l-slate-400',
    'Evento':          'border-l-purple-500',
    'Recesso':         'border-l-slate-300',
    'MatriculaAberta': 'border-l-emerald-500',
    'Formatura':       'border-l-purple-600',
};

const TIPO_BADGE: Record<string, string> = {
    'Prova':           'bg-red-100 text-red-700',
    'Entrega':         'bg-orange-100 text-orange-700',
    'Aula':            'bg-blue-100 text-blue-700',
    'Feriado':         'bg-slate-100 text-slate-600',
    'Evento':          'bg-purple-100 text-purple-700',
    'Recesso':         'bg-slate-100 text-slate-500',
    'MatriculaAberta': 'bg-emerald-100 text-emerald-700',
    'Formatura':       'bg-purple-100 text-purple-700',
};

function formatDate(d: string): string {
    return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function AdminCalendarioPage() {
    const eventos = await getCalendarioAcademico();
    const hoje = new Date().toISOString().split('T')[0];
    const proximos = eventos.filter(e => e.dataInicio >= hoje).sort((a, b) => a.dataInicio.localeCompare(b.dataInicio));
    const passados = eventos.filter(e => e.dataFim < hoje).sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Calendário Acadêmico</h1>
                    <p className="text-slate-500 mt-1 text-sm">{eventos.length} eventos cadastrados · {proximos.length} futuros</p>
                </div>
                <button className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
                    <Plus className="w-4 h-4" /> Novo Evento
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                {(['Prova','Entrega','Evento','Feriado'] as const).map(tipo => (
                    <div key={tipo} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                        <div className="text-2xl font-bold text-slate-800">{eventos.filter(e => e.tipo === tipo).length}</div>
                        <div className="text-xs text-slate-500 mt-1">{tipo}s</div>
                    </div>
                ))}
            </div>

            {/* Próximos */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-violet-600" />Próximos Eventos</h2>
                <div className="space-y-3">
                    {proximos.map(ev => (
                        <div key={ev.id} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${TIPO_COLOR[ev.tipo] ?? 'border-l-slate-300'} p-5 flex items-start justify-between gap-4`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIPO_BADGE[ev.tipo] ?? 'bg-slate-100 text-slate-600'}`}>{ev.tipo}</span>
                                    {ev.turmaNome && <span className="text-xs text-slate-400">{ev.turmaNome}</span>}
                                </div>
                                <h3 className="font-bold text-slate-900">{ev.titulo}</h3>
                                {ev.descricao && <p className="text-sm text-slate-500 mt-1">{ev.descricao}</p>}
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(ev.dataInicio)}{ev.dataInicio !== ev.dataFim && ` → ${formatDate(ev.dataFim)}`}</div>
                                    {ev.local && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.local}</div>}
                                </div>
                            </div>
                            <form action={deleteEventoAction.bind(null, ev.id)}>
                                <button className="text-rose-300 hover:text-rose-500 transition-colors p-1 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>

            {/* Passados */}
            {passados.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-400 mb-4">Eventos Passados</h2>
                    <div className="space-y-2 opacity-60">
                        {passados.map(ev => (
                            <div key={ev.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${TIPO_BADGE[ev.tipo] ?? 'bg-slate-100 text-slate-500'}`}>{ev.tipo}</span>
                                    <span className="text-sm text-slate-600">{ev.titulo}</span>
                                </div>
                                <span className="text-xs text-slate-400">{formatDate(ev.dataInicio)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
