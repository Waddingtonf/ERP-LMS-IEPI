'use client';

import { useState, useTransition } from 'react';
import {
    ClipboardList, FileText, UserX, BookOpenCheck,
    Search, CheckCircle, Clock, XCircle, AlertCircle,
    GraduationCap, CalendarRange, Plus, Download, Eye,
    BookCopy, MessageSquareWarning,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { resolverOcorrencia } from '@/lms/actions/ocorrenciaActions';
import type { Ocorrencia } from '@/lms/repositories/OcorrenciaRepository';
import type { Enrollment } from '@/lms/repositories/EnrollmentRepository';
import { OcorrenciaStatusBadge, PrioridadeBadge } from '@/components/shared/StatusBadge';

// ── Static tabs ───────────────────────────────────────────────────────────────
type Tab = 'ocorrencias' | 'matriculas' | 'documentos' | 'trancamentos';

// ── Static mock data (for tabs not yet migrated to real data) ─────────────────
const STATIC_SOLICITACOES = [
    { id: 'SOL-001', aluno: 'Maria Fernanda Costa', tipo: 'Histórico Escolar', solicitado: '10/11/2024', prazo: '17/11/2024', status: 'em_producao' as const },
    { id: 'SOL-002', aluno: 'João Paulo Rodrigues', tipo: 'Declaração de Matrícula', solicitado: '08/11/2024', prazo: '15/11/2024', status: 'pronto' as const },
    { id: 'SOL-003', aluno: 'Beatriz Lemos', tipo: 'Certificado de Conclusão', solicitado: '12/11/2024', prazo: '19/11/2024', status: 'aguardando' as const },
];

const STATIC_TRANCAMENTOS = [
    { id: 'TR-001', aluno: 'Camila Bezerra Nóbrega', curso: 'Residência Cirúrgica', motivo: 'Licença médica', status: 'aprovado' },
    { id: 'TR-002', aluno: 'Gabriel Monteiro', curso: 'Pós-Graduação em UTI', motivo: 'Dificuldade financeira', status: 'em_analise' },
];

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number | string; sub: string; color: string }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-start gap-4">
                <div className="rounded-xl p-2.5 shrink-0" style={{ background: `${color}18` }}>
                    <div style={{ color }}>{icon}</div>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    <p className="text-sm font-medium text-slate-600">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Tipo badge ────────────────────────────────────────────────────────────────
const TIPO_COLORS: Record<string, string> = {
    TRIAGEM: 'bg-amber-100 text-amber-700 border-amber-200',
    ACADEMICA: 'bg-blue-100 text-blue-700 border-blue-200',
    FINANCEIRA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    DISCIPLINAR: 'bg-red-100 text-red-700 border-red-200',
    SISTEMA: 'bg-slate-100 text-slate-600 border-slate-200',
    REQUERIMENTO: 'bg-violet-100 text-violet-700 border-violet-200',
};

interface Props {
    ocorrencias: Ocorrencia[];
    enrollments: Enrollment[];
}

export default function SecretariaClient({ ocorrencias: initialOcorrencias, enrollments }: Props) {
    const [tab, setTab] = useState<Tab>('ocorrencias');
    const [ocorrencias, setOcorrencias] = useState(initialOcorrencias);
    const [tipoFiltro, setTipoFiltro] = useState<string>('TODOS');
    const [statusFiltro, setStatusFiltro] = useState<string>('TODOS');
    const [resolvendo, setResolvendo] = useState<Ocorrencia | null>(null);
    const [resolucaoTexto, setResolucaoTexto] = useState('');
    const [isPending, startTransition] = useTransition();

    // KPIs — cast to string to accommodate any mock status values
    const ativas = enrollments.filter(e => e.status === 'Ativo').length;
    const pendentes = enrollments.filter(e => (e.status as string) === 'Pendente').length;
    const abertas = ocorrencias.filter(o => o.status === 'ABERTA' || o.status === 'EM_ANALISE').length;

    // Filtered ocorrências
    const filtered = ocorrencias.filter(o => {
        const tipoOk = tipoFiltro === 'TODOS' || o.tipo === tipoFiltro;
        const statusOk = statusFiltro === 'TODOS' || o.status === statusFiltro;
        return tipoOk && statusOk;
    });

    function handleResolver(status: 'RESOLVIDA' | 'CANCELADA') {
        if (!resolvendo) return;
        startTransition(async () => {
            const result = await resolverOcorrencia(resolvendo.id, resolucaoTexto || 'Resolvido pela secretaria.', status);
            if (result.success) {
                setOcorrencias(prev => prev.map(o => o.id === result.ocorrencia.id ? result.ocorrencia : o));
            }
            setResolvendo(null);
            setResolucaoTexto('');
        });
    }

    const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'ocorrencias', label: 'Ocorrências', icon: <MessageSquareWarning className="w-4 h-4" /> },
        { id: 'matriculas', label: 'Matrículas', icon: <ClipboardList className="w-4 h-4" /> },
        { id: 'documentos', label: 'Documentos', icon: <FileText className="w-4 h-4" /> },
        { id: 'trancamentos', label: 'Trancamentos', icon: <UserX className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Secretaria Acadêmica</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Gestão de matrículas, ocorrências e processos acadêmicos</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon={<GraduationCap className="w-5 h-5" />} label="Alunos Ativos" value={ativas} sub="matrículas vigentes" color="#7c3aed" />
                <KpiCard icon={<ClipboardList className="w-5 h-5" />} label="Pendentes" value={pendentes} sub="aguardando validação" color="#f59e0b" />
                <KpiCard icon={<AlertCircle className="w-5 h-5" />} label="Ocorrências Abertas" value={abertas} sub="requerem atenção" color="#ef4444" />
                <KpiCard icon={<CalendarRange className="w-5 h-5" />} label="Trancamentos" value={STATIC_TRANCAMENTOS.filter(t => t.status === 'em_analise').length} sub="em análise" color="#0ea5e9" />
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-1 overflow-x-auto pb-px">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id
                                ? 'border-violet-600 text-violet-700'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {t.icon}{t.label}
                            {t.id === 'ocorrencias' && abertas > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">{abertas}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab: Ocorrências (REAL DATA) ── */}
            {tab === 'ocorrencias' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            value={tipoFiltro}
                            onChange={e => setTipoFiltro(e.target.value)}
                        >
                            <option value="TODOS">Todos os tipos</option>
                            {['TRIAGEM', 'ACADEMICA', 'FINANCEIRA', 'DISCIPLINAR', 'SISTEMA', 'REQUERIMENTO'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <select
                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            value={statusFiltro}
                            onChange={e => setStatusFiltro(e.target.value)}
                        >
                            <option value="TODOS">Todos os status</option>
                            {['ABERTA', 'EM_ANALISE', 'RESOLVIDA', 'CANCELADA'].map(s => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} resultado(s)</span>
                    </div>

                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Prioridade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aluno</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                                            Nenhuma ocorrência encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map(oc => (
                                    <TableRow key={oc.id} className="hover:bg-slate-50/60">
                                        <TableCell className="font-medium text-slate-800 max-w-[220px] truncate">{oc.titulo}</TableCell>
                                        <TableCell>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${TIPO_COLORS[oc.tipo] ?? 'bg-slate-100 text-slate-600'}`}>
                                                {oc.tipo}
                                            </span>
                                        </TableCell>
                                        <TableCell><PrioridadeBadge prioridade={oc.prioridade} /></TableCell>
                                        <TableCell><OcorrenciaStatusBadge status={oc.status} /></TableCell>
                                        <TableCell className="text-sm text-slate-600">{oc.alunoNome ?? '—'}</TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {new Date(oc.criadoEm).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(oc.status === 'ABERTA' || oc.status === 'EM_ANALISE') ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={() => setResolvendo(oc)}
                                                >
                                                    Resolver
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-slate-400">{oc.status === 'RESOLVIDA' ? '✓ Resolvida' : 'Cancelada'}</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* ── Tab: Matrículas ── */}
            {tab === 'matriculas' && (
                <div className="space-y-4">
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Aluno</TableHead>
                                    <TableHead>Curso</TableHead>
                                    <TableHead>Turma</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrollments.slice(0, 10).map(e => (
                                    <TableRow key={e.id} className="hover:bg-slate-50/60">
                                        <TableCell className="font-medium text-slate-800">{e.alunoName}</TableCell>
                                        <TableCell className="text-sm text-slate-600">{e.courseName}</TableCell>
                                        <TableCell className="text-sm text-slate-500 font-mono">{e.turmaId ?? '—'}</TableCell>
                                        <TableCell className="text-sm text-slate-500">{e.dataMatricula}</TableCell>
                                        <TableCell>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${e.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    (e.status as string) === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>{e.status}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <p className="text-xs text-slate-400 text-right">{enrollments.length} matrículas no total</p>
                </div>
            )}

            {/* ── Tab: Documentos (static) ── */}
            {tab === 'documentos' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Histórico Escolar', icon: <BookCopy className="w-5 h-5" />, prazo: '7 dias úteis' },
                            { label: 'Declaração de Matrícula', icon: <ClipboardList className="w-5 h-5" />, prazo: '2 dias úteis' },
                            { label: 'Atestado de Frequência', icon: <CheckCircle className="w-5 h-5" />, prazo: '3 dias úteis' },
                            { label: 'Certificado de Conclusão', icon: <GraduationCap className="w-5 h-5" />, prazo: '10 dias úteis' },
                        ].map(doc => (
                            <button key={doc.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all text-center">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">{doc.icon}</div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 leading-tight">{doc.label}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.prazo}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-slate-700">Solicitações em Andamento</CardTitle></CardHeader>
                        <Table>
                            <TableHeader><TableRow className="bg-slate-50">
                                <TableHead>Nº</TableHead><TableHead>Aluno</TableHead>
                                <TableHead>Documento</TableHead><TableHead>Prazo</TableHead>
                                <TableHead>Status</TableHead><TableHead className="text-right">Ação</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {STATIC_SOLICITACOES.map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-mono text-xs text-slate-500">{s.id}</TableCell>
                                        <TableCell className="font-medium text-sm">{s.aluno}</TableCell>
                                        <TableCell className="text-sm text-slate-600">{s.tipo}</TableCell>
                                        <TableCell className="text-sm text-slate-500">{s.prazo}</TableCell>
                                        <TableCell>
                                            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${s.status === 'pronto' ? 'bg-green-50 text-green-700 border-green-200' :
                                                s.status === 'em_producao' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>{s.status.replace('_', ' ')}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {s.status === 'pronto' && (
                                                <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100">
                                                    <Download className="w-3 h-3" /> Baixar
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            )}

            {/* ── Tab: Trancamentos (static) ── */}
            {tab === 'trancamentos' && (
                <div className="grid gap-3">
                    {STATIC_TRANCAMENTOS.map(t => (
                        <Card key={t.id} className="border-0 shadow-sm">
                            <CardContent className="p-5 flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-slate-800">{t.aluno}</p>
                                    <p className="text-sm text-slate-600">{t.curso}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Motivo: {t.motivo}</p>
                                </div>
                                {t.status === 'em_analise' && (
                                    <div className="flex gap-2 shrink-0">
                                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">Aprovar</button>
                                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">Indeferir</button>
                                    </div>
                                )}
                                {t.status === 'aprovado' && (
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">✓ Aprovado</span>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ── Resolver Dialog ── */}
            <Dialog open={!!resolvendo} onOpenChange={() => { setResolvendo(null); setResolucaoTexto(''); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Resolver Ocorrência</DialogTitle>
                    </DialogHeader>
                    {resolvendo && (
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-lg p-3 text-sm">
                                <p className="font-semibold text-slate-800">{resolvendo.titulo}</p>
                                <p className="text-slate-500 text-xs mt-1">{resolvendo.descricao}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Resolução / Parecer</Label>
                                <Textarea
                                    value={resolucaoTexto}
                                    onChange={e => setResolucaoTexto(e.target.value)}
                                    placeholder="Descreva a resolução tomada..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" onClick={() => { setResolvendo(null); setResolucaoTexto(''); }}>
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={isPending}
                                    onClick={() => handleResolver('CANCELADA')}
                                >
                                    Cancelar Ocorrência
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    disabled={isPending || resolucaoTexto.length < 10}
                                    onClick={() => handleResolver('RESOLVIDA')}
                                >
                                    {isPending ? 'Salvando...' : 'Marcar Resolvida'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
