import { getHistoricoAcademico } from "@/lms/actions/notaActions";
import { getTurmaRepository } from "@/lms/repositories";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Award, AlertCircle, CheckCircle, Clock } from "lucide-react";

const SITUACAO_CONFIG = {
    'Aprovado':     { label: 'Aprovado',      color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-500' },
    'Reprovado':    { label: 'Reprovado',      color: 'bg-red-100 text-red-700 border-red-200',             icon: AlertCircle, iconColor: 'text-red-500' },
    'Recuperacao':  { label: 'Recuperação',    color: 'bg-amber-100 text-amber-700 border-amber-200',       icon: AlertCircle, iconColor: 'text-amber-500' },
    'Em Andamento': { label: 'Em Andamento',   color: 'bg-blue-100 text-blue-700 border-blue-200',          icon: Clock,       iconColor: 'text-blue-500' },
} as const;

function notaColor(nota: number | null): string {
    if (nota === null) return 'text-slate-400';
    if (nota >= 7) return 'text-emerald-600 font-bold';
    if (nota >= 5) return 'text-amber-600 font-bold';
    return 'text-red-600 font-bold';
}

export default async function AlunoNotasPage() {
    const historico = await getHistoricoAcademico();
    const turmaRepo = getTurmaRepository();

    const historicoEnriquecido = await Promise.all(
        historico.map(async h => {
            const turma = await turmaRepo.findById(h.turmaId);
            return { ...h, turmaNome: turma?.courseName ?? h.turmaId, turmaCodigo: turma?.code ?? '' };
        })
    );

    const totalDisciplinas = historicoEnriquecido.reduce((a, h) => a + h.notas.length, 0);
    const aprovadas = historicoEnriquecido.reduce((a, h) => a + h.notas.filter(n => n.situacao === 'Aprovado').length, 0);
    const emAndamento = historicoEnriquecido.reduce((a, h) => a + h.notas.filter(n => n.situacao === 'Em Andamento').length, 0);
    const mediasValidas = historicoEnriquecido.flatMap(h => h.notas.map(n => n.media)).filter((m): m is number => m !== null);
    const mediaGeral = mediasValidas.length > 0 ? (mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length).toFixed(1) : '—';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Boletim Acadêmico</h1>
                <p className="text-slate-500 mt-1 text-sm">Acompanhe suas notas e situação por disciplina em cada turma.</p>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Média Geral', value: mediaGeral, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
                    { label: 'Aprovações', value: aprovadas, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Em Andamento', value: emAndamento, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Disciplinas', value: totalDisciplinas, icon: BookOpen, color: 'text-slate-600', bg: 'bg-slate-100' },
                ].map(k => (
                    <div key={k.label} className={`rounded-2xl ${k.bg} p-5 flex items-center gap-4`}>
                        <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                            <k.icon className={`w-5 h-5 ${k.color}`} />
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                            <div className="text-xs text-slate-500 font-medium">{k.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Boletins por turma */}
            <div className="space-y-6">
                {historicoEnriquecido.map(h => (
                    <div key={h.turmaId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Turma Header */}
                        <div className="bg-gradient-to-r from-violet-700 to-indigo-700 px-6 py-4 flex items-center justify-between">
                            <div>
                                <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">{h.turmaCodigo}</div>
                                <h2 className="text-white font-bold text-lg leading-tight">{h.turmaNome}</h2>
                            </div>
                            <div className="text-right">
                                <div className="text-white/70 text-xs">Frequência</div>
                                <div className={`text-xl font-bold ${h.frequenciaPercentual >= 75 ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {h.frequenciaPercentual}%
                                </div>
                            </div>
                        </div>

                        {/* Notas table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Disciplina</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">AV1</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">AV2</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Trab.</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Média</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Situação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {h.notas.map(nota => {
                                        const cfg = SITUACAO_CONFIG[nota.situacao];
                                        return (
                                            <tr key={nota.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-800">{nota.disciplina}</td>
                                                <td className={`px-4 py-4 text-center ${notaColor(nota.av1)}`}>{nota.av1 ?? '—'}</td>
                                                <td className={`px-4 py-4 text-center ${notaColor(nota.av2)}`}>{nota.av2 ?? '—'}</td>
                                                <td className={`px-4 py-4 text-center ${notaColor(nota.trabalho)}`}>{nota.trabalho ?? '—'}</td>
                                                <td className={`px-4 py-4 text-center text-base ${notaColor(nota.media)}`}>{nota.media ?? '—'}</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                                                        <cfg.icon className={`w-3 h-3 ${cfg.iconColor}`} />
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
