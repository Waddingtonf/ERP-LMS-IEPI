import { getMaterialByTurma, deleteMaterialAction, toggleDisponibilidade } from "@/lms/actions/materialActions";
import { getTurmaRepository } from "@/lms/repositories";
import { FileText, Video, Link2, BookOpen, File, ClipboardList, Eye, EyeOff, Trash2, Upload } from "lucide-react";
import type { MaterialTipo } from "@/lms/repositories/MaterialRepository";

const TIPO_CONFIG: Record<MaterialTipo, { label: string; icon: React.ElementType; color: string }> = {
    'APOSTILA':  { label: 'Apostila',   icon: BookOpen,      color: 'text-violet-600' },
    'PDF':       { label: 'PDF',        icon: FileText,      color: 'text-red-600' },
    'VIDEO':     { label: 'Vídeo',      icon: Video,         color: 'text-blue-600' },
    'SLIDE':     { label: 'Slide',      icon: File,          color: 'text-orange-600' },
    'LINK':      { label: 'Link',       icon: Link2,         color: 'text-emerald-600' },
    'EXERCICIO': { label: 'Exercícios', icon: ClipboardList, color: 'text-amber-600' },
};

export default async function DocenteMateriaisPage({ searchParams }: { searchParams: Promise<{turmaId?: string}> }) {
    const { turmaId } = await searchParams;
    const turmaRepo = getTurmaRepository();
    const turmas = await turmaRepo.findAll?.() ?? [];
    const selectedId = turmaId ?? turmas[0]?.id;
    const materiais = selectedId ? await getMaterialByTurma(selectedId) : [];
    const visiveis = materiais.filter(m => m.disponivel).length;

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Material Didático</h1>
                    <p className="text-slate-500 mt-1 text-sm">{materiais.length} arquivos · {visiveis} visíveis para alunos</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors">
                    <Upload className="w-4 h-4" /> Enviar Material
                </button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                {turmas.map(t => (
                    <a key={t.id} href={`/docente/materiais?turmaId=${t.id}`}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${t.id === selectedId ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700'}`}>
                        {t.courseName}
                    </a>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/70 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Material</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Ordem</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Visível</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {materiais.map(mat => {
                                const cfg = TIPO_CONFIG[mat.tipo];
                                return (
                                    <tr key={mat.id} className={`hover:bg-slate-50/60 transition-colors ${!mat.disponivel ? 'opacity-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <cfg.icon className={`w-5 h-5 ${cfg.color} shrink-0`} />
                                                <div>
                                                    <div className="font-medium text-slate-900">{mat.titulo}</div>
                                                    {mat.descricao && <div className="text-xs text-slate-400">{mat.descricao}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{cfg.label}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-500 font-mono">{mat.ordem}</td>
                                        <td className="px-4 py-4 text-center">
                                            {mat.disponivel
                                                ? <Eye className="w-4 h-4 text-emerald-500 mx-auto" />
                                                : <EyeOff className="w-4 h-4 text-slate-300 mx-auto" />}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <form action={toggleDisponibilidade.bind(null, mat.id)}>
                                                    <button className="text-xs text-slate-500 hover:text-teal-600 px-2 py-1 rounded transition-colors">
                                                        {mat.disponivel ? 'Ocultar' : 'Mostrar'}
                                                    </button>
                                                </form>
                                                <form action={deleteMaterialAction.bind(null, mat.id)}>
                                                    <button className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {materiais.length === 0 && <div className="py-12 text-center text-slate-400">Nenhum material enviado para esta turma.</div>}
                </div>
            </div>
        </div>
    );
}
