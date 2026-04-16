import { getStudentDashboardData } from "@/lms/actions/studentActions";
import { getMinhasFrequencias } from "@/lms/actions/frequenciaActions";
import { getAulasByTurma } from "@/lms/actions/turmaActions";
import { CalendarCheck, CheckCircle2, XCircle, Clock, AlertCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AlunoFrequenciaPage() {
    const dashboard = await getStudentDashboardData();
    const matriculasAtivas = dashboard.enrollments.filter(e => e.status === 'Ativo' || e.status === 'Concluido');

    // Enrich with frequencia data
    const freqData = await Promise.all(
        matriculasAtivas.filter(m => m.turmaId).map(async (mat) => {
            const turmaId = mat.turmaId!;
            const freq = await getMinhasFrequencias(turmaId);
            const aulas = await getAulasByTurma(turmaId);

            // Merge registros with aula details
            const registrosComAula = freq.registros.map(r => {
                const aulaInfo = aulas.find(a => a.id === r.aulaId);
                return {
                    ...r,
                    aulaTitulo: aulaInfo?.title ?? 'Aula',
                    aulaData: aulaInfo?.date ?? r.registradoEm.split('T')[0],
                };
            }).sort((a, b) => new Date(b.aulaData).getTime() - new Date(a.aulaData).getTime());

            return {
                ...mat,
                frequencia: freq,
                registros: registrosComAula
            };
        })
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Frequência Escolar</h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Acompanhe sua assiduidade e histórico de faltas por disciplina.
                </p>
            </div>

            {freqData.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhuma Turma Ativa</h3>
                    <p className="text-slate-500 text-sm">
                        O seu controle de frequência estará disponível quando você for matriculado em turmas regulares.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {freqData.map(mat => {
                        const freq = mat.frequencia;
                        const isUnderRisk = freq.total > 0 && freq.percentual < 75;

                        return (
                            <div key={mat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                {/* Header */}
                                <div className={`p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${isUnderRisk ? 'bg-rose-50/50' : 'bg-violet-50/30'}`}>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{mat.turmaId}</div>
                                        <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{mat.title}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200 gap-1 rounded-sm">
                                                <BookOpen className="w-3 h-3 text-violet-500" />
                                                {mat.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Stats block */}
                                    <div className="flex items-center gap-4 sm:gap-6 bg-white p-3 rounded-xl shadow-sm border border-slate-200 shrink-0 w-full sm:w-auto">
                                        <div className="text-center px-2">
                                            <div className="text-xs font-semibold text-slate-500 uppercase">Presente</div>
                                            <div className="text-xl font-bold text-emerald-600">{freq.presentes}</div>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100"></div>
                                        <div className="text-center px-2">
                                            <div className="text-xs font-semibold text-slate-500 uppercase">Faltas</div>
                                            <div className="text-xl font-bold text-rose-600">{freq.total - freq.presentes}</div>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100"></div>
                                        <div className="text-center pl-2">
                                            <div className="text-xs font-semibold text-slate-500 uppercase">Freq. %</div>
                                            <div className={`text-xl font-bold ${isUnderRisk ? 'text-rose-600' : 'text-violet-700'}`}>
                                                {freq.percentual}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isUnderRisk && (
                                    <div className="bg-rose-50 px-6 py-3 border-b border-rose-100 flex items-center justify-center gap-2 text-rose-700 text-sm font-medium">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        Atenção: Sua frequência está abaixo de 75%. Risco de reprovação por faltas.
                                    </div>
                                )}

                                {/* List of classes/registros */}
                                <div className="p-0 sm:p-2 divide-y divide-slate-50">
                                    {mat.registros.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500 text-sm">
                                            Nenhum registro de aula lançado pelo docente nesta turma ainda.
                                        </div>
                                    ) : (
                                        mat.registros.map(r => (
                                            <div key={r.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                                                <div className="flex items-start gap-4">
                                                    {r.presente ? (
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                                                            <XCircle className="w-5 h-5 text-rose-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">{r.aulaTitulo}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> Data: {r.aulaData}
                                                            </span>
                                                        </div>
                                                        {r.observacao && !r.presente && (
                                                            <div className="mt-1.5 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded inline-block max-w-full">
                                                                Nota do Docente: {r.observacao}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <span className={`inline-flex font-bold text-sm px-2.5 py-1 rounded-full ${r.presente ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                        {r.presente ? 'Presente' : 'Falta'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
