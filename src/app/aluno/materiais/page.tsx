import { getMaterialByTurma } from "@/lms/actions/materialActions";
import { getEnrollmentRepository } from "@/lms/repositories";
import { FileText, Video, Link2, BookOpen, File, ClipboardList, Download, ExternalLink } from "lucide-react";
import type { Material, MaterialTipo } from "@/lms/repositories/MaterialRepository";

const TIPO_CONFIG: Record<MaterialTipo, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    'APOSTILA':  { label: 'Apostila',  icon: BookOpen,      color: 'text-violet-600',  bg: 'bg-violet-50' },
    'PDF':       { label: 'PDF',       icon: FileText,      color: 'text-red-600',     bg: 'bg-red-50' },
    'VIDEO':     { label: 'VÃ­deo',     icon: Video,         color: 'text-blue-600',    bg: 'bg-blue-50' },
    'SLIDE':     { label: 'Slide',     icon: File,          color: 'text-orange-600',  bg: 'bg-orange-50' },
    'LINK':      { label: 'Link',      icon: Link2,         color: 'text-emerald-600', bg: 'bg-emerald-50' },
    'EXERCICIO': { label: 'ExercÃ­cios',icon: ClipboardList, color: 'text-amber-600',   bg: 'bg-amber-50' },
};

function formatTamanho(kb: number | null): string {
    if (kb === null) return '';
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb} KB`;
}

export default async function AlunoMateriaisPage() {
    const enrollmentRepo = await getEnrollmentRepository();
    // Em mock: pega turmas do aluno fixo
    const matriculas = await enrollmentRepo.findByAluno('student-1');
    const turmaIds = [...new Set(matriculas.map(m => m.turmaId).filter(Boolean))] as string[];

    type TurmaAgrupada = { turmaId: string; turmaNome: string; materiais: Material[] };
    const porTurma: TurmaAgrupada[] = await Promise.all(
        turmaIds.map(async turmaId => {
            const materiais = await getMaterialByTurma(turmaId);
            const mat = matriculas.find(m => m.turmaId === turmaId);
            return { turmaId, turmaNome: mat?.courseName ?? turmaId, materiais: materiais.filter(m => m.disponivel) };
        })
    );

    const totalMateriais = porTurma.reduce((a, t) => a + t.materiais.length, 0);

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Material DidÃ¡tico</h1>
                    <p className="text-slate-500 mt-1 text-sm">{totalMateriais} arquivo{totalMateriais !== 1 ? 's' : ''} disponÃ­vel{totalMateriais !== 1 ? 'is' : ''} em {porTurma.length} turma{porTurma.length !== 1 ? 's' : ''}.</p>
                </div>
            </div>

            {porTurma.map(({ turmaId, turmaNome, materiais }) => (
                <div key={turmaId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-700 to-indigo-700 px-6 py-4">
                        <h2 className="text-white font-bold">{turmaNome}</h2>
                        <div className="text-white/60 text-xs">{materiais.length} material{materiais.length !== 1 ? 'is' : ''}</div>
                    </div>

                    {materiais.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-sm">Nenhum material publicado ainda.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {materiais.map(mat => {
                                const cfg = TIPO_CONFIG[mat.tipo];
                                const isExternal = mat.tipo === 'LINK' || mat.tipo === 'VIDEO';
                                return (
                                    <div key={mat.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                                                <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 text-sm">{mat.titulo}</div>
                                                {mat.descricao && <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mat.descricao}</div>}
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                                                    {mat.tamanhoKb && <span className="text-xs text-slate-400">{formatTamanho(mat.tamanhoKb)}</span>}
                                                    <span className="text-xs text-slate-400">{mat.uploadedBy}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            href={mat.url}
                                            target={isExternal ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
                                        >
                                            {isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                                            {isExternal ? 'Abrir' : 'Baixar'}
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
