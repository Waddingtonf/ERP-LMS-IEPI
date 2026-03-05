import { getCalendarioAcademico } from "@/lms/actions/calendarioActions";
import { Calendar, MapPin, Clock } from "lucide-react";

const TIPO_COLOR: Record<string, string> = {
    'Prova':           'border-l-red-500 bg-red-50',
    'Entrega':         'border-l-orange-500 bg-orange-50',
    'Aula':            'border-l-blue-500 bg-blue-50',
    'Feriado':         'border-l-slate-400 bg-slate-50',
    'Evento':          'border-l-purple-500 bg-purple-50',
    'Recesso':         'border-l-slate-400 bg-slate-100',
    'MatriculaAberta': 'border-l-emerald-500 bg-emerald-50',
    'Formatura':       'border-l-purple-600 bg-purple-50',
};

const TIPO_BADGE: Record<string, string> = {
    'Prova':           'bg-red-100 text-red-700',
    'Entrega':         'bg-orange-100 text-orange-700',
    'Aula':            'bg-blue-100 text-blue-700',
    'Feriado':         'bg-slate-100 text-slate-600',
    'Evento':          'bg-purple-100 text-purple-700',
    'Recesso':         'bg-slate-100 text-slate-600',
    'MatriculaAberta': 'bg-emerald-100 text-emerald-700',
    'Formatura':       'bg-purple-100 text-purple-700',
};

function formatDate(d: string): string {
    const date = new Date(d + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default async function AlunoCalendarioPage() {
    const eventos = await getCalendarioAcademico();
    const hoje = new Date().toISOString().split('T')[0];

    const proximos = eventos
        .filter(e => e.dataInicio >= hoje)
        .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio));

    const passados = eventos
        .filter(e => e.dataFim < hoje)
        .sort((a, b) => b.dataInicio.localeCompare(a.dataInicio))
        .slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Calendário Acadêmico</h1>
                <p className="text-slate-500 mt-1 text-sm">Provas, entregas, eventos e datas importantes da sua turma.</p>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{proximos.filter(e => e.tipo === 'Prova').length}</div>
                    <div className="text-xs text-slate-500 mt-1">Provas Próximas</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{proximos.filter(e => e.tipo === 'Entrega').length}</div>
                    <div className="text-xs text-slate-500 mt-1">Entregas Pendentes</div>
                </div>
                <div className="bg-violet-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-violet-600">{proximos.length}</div>
                    <div className="text-xs text-slate-500 mt-1">Eventos Futuros</div>
                </div>
            </div>

            {/* Próximos Eventos */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-600" /> Próximos Eventos
                </h2>
                <div className="space-y-3">
                    {proximos.length === 0 && (
                        <div className="text-center text-slate-400 py-12 bg-slate-50 rounded-2xl">Nenhum evento próximo.</div>
                    )}
                    {proximos.map(ev => (
                        <div key={ev.id} className={`rounded-2xl border-l-4 p-5 ${TIPO_COLOR[ev.tipo] ?? 'border-l-slate-300 bg-white'} border border-slate-100`}>
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIPO_BADGE[ev.tipo] ?? 'bg-slate-100 text-slate-600'}`}>{ev.tipo}</span>
                                        {ev.turmaNome && <span className="text-xs text-slate-400 font-medium">{ev.turmaNome}</span>}
                                    </div>
                                    <h3 className="font-bold text-slate-900">{ev.titulo}</h3>
                                    {ev.descricao && <p className="text-sm text-slate-500 mt-1">{ev.descricao}</p>}
                                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(ev.dataInicio)}
                                            {ev.dataInicio !== ev.dataFim && ` — ${formatDate(ev.dataFim)}`}
                                            {ev.horaInicio && ` · ${ev.horaInicio}${ev.horaFim ? ` às ${ev.horaFim}` : ''}`}
                                        </div>
                                        {ev.local && (
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <MapPin className="w-3 h-3" /> {ev.local}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right text-xs text-slate-400 whitespace-nowrap">{formatDate(ev.dataInicio)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Eventos passados */}
            {passados.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 text-slate-400">Eventos Recentes</h2>
                    <div className="space-y-2 opacity-60">
                        {passados.map(ev => (
                            <div key={ev.id} className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400">{ev.tipo} · </span>
                                    <span className="text-sm font-medium text-slate-600">{ev.titulo}</span>
                                </div>
                                <div className="text-xs text-slate-400">{formatDate(ev.dataInicio)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
