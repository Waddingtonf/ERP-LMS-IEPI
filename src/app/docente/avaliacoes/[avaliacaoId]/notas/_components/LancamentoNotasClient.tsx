"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { lancarNotaAvaliacaoAction, publicarAvaliacao, encerrarAvaliacao } from "@/lms/actions/avaliacaoActions";
import { toast } from "sonner";
import Link from "next/link";
import type { Avaliacao } from "@/lms/repositories/AvaliacaoRepository";

interface AlunoNota {
    alunoId: string;
    alunoNome: string;
    notaAtual: number | null;
    observacao: string;
}

interface Props {
    avaliacao: Avaliacao;
    alunos: AlunoNota[];
}

export default function LancamentoNotasClient({ avaliacao, alunos: initialAlunos }: Props) {
    const router = useRouter();
    const [alunos, setAlunos] = useState<AlunoNota[]>(initialAlunos);
    const [saving, setSaving] = useState(false);

    const handleNotaChange = (alunoId: string, val: string) => {
        const num = val === "" ? null : Number(val);
        setAlunos(prev => prev.map(a => a.alunoId === alunoId ? { ...a, notaAtual: num } : a));
    };

    const handleObsChange = (alunoId: string, val: string) => {
        setAlunos(prev => prev.map(a => a.alunoId === alunoId ? { ...a, observacao: val } : a));
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // Lança/atualiza notas apenas de quem tem valor não nulo (ou você pode atualizar todos)
            let updatedCount = 0;
            for (const a of alunos) {
                if (a.notaAtual !== null) {
                    await lancarNotaAvaliacaoAction(avaliacao.id, a.alunoId, a.notaAtual, a.observacao);
                    updatedCount++;
                }
            }
            toast.success(`Notas salvas! ${updatedCount} registro(s) atualizados.`);
            router.refresh();
        } catch (err) {
            toast.error('Erro ao salvar as notas.');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        await publicarAvaliacao(avaliacao.id);
        toast.success("Avaliação Publicada aos alunos.");
        router.refresh();
    };

    const handleClose = async () => {
        await encerrarAvaliacao(avaliacao.id);
        toast.success("Avaliação Encerrada.");
        router.refresh();
    };

    const totalLancadas = alunos.filter(a => a.notaAtual !== null).length;
    const mediaTurma = totalLancadas > 0
        ? (alunos.reduce((acc, a) => acc + (a.notaAtual || 0), 0) / totalLancadas).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <Link href="/docente/avaliacoes" className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar para Avaliações
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{avaliacao.titulo}</h1>
                        <p className="text-slate-500 mt-1 text-sm">{avaliacao.turmaNome}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Lateral details */}
                <div className="md:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-3 border-b border-slate-100">
                            <CardTitle className="text-sm">Detalhes da Avaliação</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <Badge className={
                                    avaliacao.status === 'Encerrada' ? 'bg-slate-100 text-slate-500' :
                                        avaliacao.status === 'Publicada' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                }>{avaliacao.status}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tipo</span>
                                <span className="font-medium">{avaliacao.tipo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Nota Máxima</span>
                                <span className="font-bold text-teal-700">{avaliacao.notaMaxima}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Data Ap.</span>
                                <span>{avaliacao.dataAplicacao}</span>
                            </div>
                            <hr className="border-slate-100" />
                            <div className="flex justify-between">
                                <span className="text-slate-500">Média Geral</span>
                                <span className="font-bold">{mediaTurma}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Lançadas</span>
                                <span>{totalLancadas}/{alunos.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-2">
                        {avaliacao.status === 'Rascunho' && (
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handlePublish}>
                                Publicar Avaliação
                            </Button>
                        )}
                        {avaliacao.status === 'Publicada' && (
                            <Button variant="outline" className="w-full" onClick={handleClose}>
                                Encerrar Avaliação
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabela de Notas */}
                <div className="md:col-span-3">
                    <Card>
                        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-5 h-5 text-teal-600" /> Notas dos Alunos
                            </CardTitle>
                            <Button
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700 gap-1.5"
                                onClick={handleSaveAll}
                                disabled={saving || avaliacao.status === 'Encerrada'}
                            >
                                <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar Todas'}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {alunos.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    Nenhum aluno matriculado nesta turma.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {alunos.map(aluno => (
                                        <div key={aluno.alunoId} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800">{aluno.alunoNome}</p>
                                            </div>
                                            <div className="flex gap-2 items-center shrink-0 w-full sm:w-auto">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max={avaliacao.notaMaxima}
                                                    step="0.1"
                                                    placeholder="Nota"
                                                    className="w-24 text-center font-bold"
                                                    value={aluno.notaAtual === null ? '' : aluno.notaAtual}
                                                    onChange={(e) => handleNotaChange(aluno.alunoId, e.target.value)}
                                                    disabled={avaliacao.status === 'Encerrada'}
                                                />
                                                <Textarea
                                                    placeholder="Observação (opcional)"
                                                    className="w-full sm:w-48 h-10 resize-none text-xs"
                                                    value={aluno.observacao}
                                                    onChange={(e) => handleObsChange(aluno.alunoId, e.target.value)}
                                                    disabled={avaliacao.status === 'Encerrada'}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
