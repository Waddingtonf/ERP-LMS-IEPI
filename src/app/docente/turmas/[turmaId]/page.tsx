import { getTurmaRepository } from "@/lms/repositories";
import { getAvaliacoesByTurma } from "@/lms/actions/avaliacaoActions";
import { getMaterialByTurma } from "@/lms/actions/materialActions";
import { Users, BookOpen, ClipboardList, ArrowLeft, FileText, Video } from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ turmaId: string }> };

export default async function DocenteTurmaDetailPage({ params }: Props) {
    const { turmaId } = await params;

    const turmaRepo = await getTurmaRepository();
    const [turma, avaliacoes, materiais] = await Promise.all([
        turmaRepo.findById(turmaId),
        getAvaliacoesByTurma(turmaId),
        getMaterialByTurma(turmaId),
    ]);

    if (!turma) return (
        <div className="text-center py-16 text-slate-400">
            <p>Turma não encontrada.</p>
            <Link href="/docente/turmas" className="text-teal-600 hover:underline text-sm mt-2 inline-block">Voltar</Link>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <Link href="/docente/turmas" className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Minhas Turmas
                </Link>
                <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl px-8 py-6 text-white">
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">{turma.code}</div>
                    <h1 className="text-2xl font-bold">{turma.courseName}</h1>
                    <div className="flex gap-6 mt-3 text-sm text-white/80">
                        <div className="flex items-center gap-1.5"><Users className="w-4 h-4" />{turma.enrolledCount}/{turma.maxStudents} alunos</div>
                        <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{turma.schedule}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Avaliações */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-teal-600" />Avaliações</h2>
                        <Link href={`/docente/avaliacoes?turmaId=${turmaId}`} className="text-xs font-semibold text-teal-600 hover:underline">Gerenciar</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {avaliacoes.slice(0, 5).map((av: any) => (
                            <div key={av.id} className="px-6 py-3 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-slate-800">{av.titulo}</div>
                                    <div className="text-xs text-slate-400">{av.tipo} · {av.dataAplicacao}</div>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${av.status === 'Encerrada' ? 'bg-slate-100 text-slate-500' : av.status === 'Publicada' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {av.status}
                                </span>
                            </div>
                        ))}
                        {avaliacoes.length === 0 && <div className="px-6 py-8 text-center text-slate-400 text-sm">Nenhuma avaliação criada.</div>}
                    </div>
                </div>

                {/* Materiais */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2"><FileText className="w-5 h-5 text-teal-600" />Materiais</h2>
                        <Link href={`/docente/materiais?turmaId=${turmaId}`} className="text-xs font-semibold text-teal-600 hover:underline">Gerenciar</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {materiais.slice(0, 5).map((mat: any) => (
                            <div key={mat.id} className="px-6 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                    {mat.tipo === 'VIDEO' ? <Video className="w-4 h-4 text-teal-600" /> : <FileText className="w-4 h-4 text-teal-600" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-slate-800 truncate">{mat.titulo}</div>
                                    <div className="text-xs text-slate-400">{mat.tipo}</div>
                                </div>
                                {!mat.disponivel && <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Oculto</span>}
                            </div>
                        ))}
                        {materiais.length === 0 && <div className="px-6 py-8 text-center text-slate-400 text-sm">Nenhum material enviado.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
