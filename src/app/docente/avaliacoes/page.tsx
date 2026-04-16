import { getAvaliacoesByTurma, criarAvaliacaoAction, publicarAvaliacao, encerrarAvaliacao } from "@/lms/actions/avaliacaoActions";
import { getNotasByAvaliacao } from "@/lms/actions/avaliacaoActions";
import { getTurmaRepository } from "@/lms/repositories";
import { ClipboardList, Plus, Users, CheckCircle } from "lucide-react";

export default async function DocenteAvaliacoesPage({ searchParams }: { searchParams: Promise<{turmaId?: string}> }) {
    const { turmaId } = await searchParams;
    const turmaRepo = await getTurmaRepository();
    const turmas = await turmaRepo.findAll?.() ?? [];
    const selectedId = turmaId ?? turmas[0]?.id;

    const avaliacoes = selectedId ? await getAvaliacoesByTurma(selectedId) : [];

    const publicadas = avaliacoes.filter(a => a.status === 'Publicada').length;
    const encerradas = avaliacoes.filter(a => a.status === 'Encerrada').length;

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">AvaliaÃ§Ãµes</h1>
                    <p className="text-slate-500 mt-1 text-sm">Crie, aplique e lance notas das avaliaÃ§Ãµes por turma.</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors">
                    <Plus className="w-4 h-4" /> Nova AvaliaÃ§Ã£o
                </button>
            </div>

            {/* Seletor de Turma */}
            <div className="flex items-center gap-3 flex-wrap">
                {turmas.map(t => (
                    <a key={t.id} href={`/docente/avaliacoes?turmaId=${t.id}`}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${t.id === selectedId ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700'}`}>
                        {t.courseName}
                    </a>
                ))}
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                    <ClipboardList className="w-8 h-8 text-blue-500" />
                    <div><div className="text-2xl font-bold text-blue-600">{avaliacoes.length}</div><div className="text-xs text-slate-500">Total</div></div>
                </div>
                <div className="bg-teal-50 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-teal-500" />
                    <div><div className="text-2xl font-bold text-teal-600">{publicadas}</div><div className="text-xs text-slate-500">Publicadas</div></div>
                </div>
                <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <Users className="w-8 h-8 text-slate-400" />
                    <div><div className="text-2xl font-bold text-slate-600">{encerradas}</div><div className="text-xs text-slate-500">Encerradas</div></div>
                </div>
            </div>

            {/* Lista */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/70 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">TÃ­tulo</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Nota MÃ¡x.</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">AÃ§Ãµes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {avaliacoes.map(av => (
                                <tr key={av.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{av.titulo}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{av.tipo}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500">{av.dataAplicacao}</td>
                                    <td className="px-6 py-4 text-center font-semibold text-slate-700">{av.notaMaxima}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                            av.status === 'Encerrada' ? 'bg-slate-100 text-slate-500' :
                                            av.status === 'Publicada' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>{av.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href={`/docente/avaliacoes/${av.id}/notas`} className="text-teal-600 hover:underline text-xs font-semibold">LanÃ§ar Notas</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {avaliacoes.length === 0 && (
                        <div className="py-12 text-center text-slate-400">Nenhuma avaliaÃ§Ã£o para esta turma.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
