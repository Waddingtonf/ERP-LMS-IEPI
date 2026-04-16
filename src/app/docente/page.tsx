/**
 * Docente Dashboard — live turma data from repositories.
 * Uses correct Turma types: status 'Em Andamento', enrolledCount.
 */

import { PageHeader, PageSection } from '@/components/layout';
import { EduKpiGrid, AcademicPlanCard, CommunicationCard, LearningPathCard } from '@/components/educacional/dashboard-kit';
import type { LearningPathModule, CommunicationItem } from '@/components/educacional/dashboard-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CalendarDays, CheckSquare, Users, AlertTriangle } from 'lucide-react';
import { getTurmaRepository, getNotaRepository, getOcorrenciaRepository } from '@/lms/repositories';
import Link from 'next/link';

export default async function DocenteDashboard() {
    const turmaRepo = await getTurmaRepository();
    const notaRepo = await getNotaRepository();
    const ocorrRepo = await getOcorrenciaRepository();

    const [turmas, ocorrDevidas] = await Promise.all([
        turmaRepo.findAll(),
        ocorrRepo.findByStatus('ABERTA'),
    ]);

    // Active turmas (Em Andamento)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const turmasAtivas = turmas.filter((t: any) => t.status === 'Em Andamento');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalAlunos = turmasAtivas.reduce((a: number, t: any) => a + t.enrolledCount, 0);

    // Notas per active turma
    const todasNotas = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await Promise.all(turmasAtivas.map((t: any) => notaRepo.findByTurma(t.id)))
    ).flat();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notasPending = todasNotas.filter((n: any) => n.av1 === null && n.av2 === null).length;

    // Academic ocorrências
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ocorrAcad = ocorrDevidas.filter((o: any) => o.tipo === 'ACADEMICA' || o.tipo === 'DISCIPLINAR');

    // Build typed modules
    const STATUS_MAP = ['Concluído', 'Em andamento', 'Pendente'] as const;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modules: LearningPathModule[] = turmasAtivas.slice(0, 3).map((t: any, i: number) => ({
        id: t.id,
        title: t.courseName,
        progress: i === 0 ? 78 : i === 1 ? 42 : 10,
        status: (STATUS_MAP[i] ?? 'Pendente') as LearningPathModule['status'],
    }));

    // Build typed communication items from ocorrências
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commItems: CommunicationItem[] = ocorrAcad.slice(0, 3).map((oc: any) => ({
        id: oc.id,
        channel: 'Ocorrência' as CommunicationItem['channel'],
        title: oc.titulo,
        meta: `${oc.prioridade} · ${oc.alunoNome ?? 'Sistema'}`,
    }));

    if (commItems.length === 0) {
        commItems.push({ id: 'ok', channel: 'Aviso' as const, title: 'Nenhuma ocorrência acadêmica aberta.', meta: 'Sistema' });
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Painel do Docente"
                description="Acompanhe turmas, plano de aula, avaliações e ocorrências acadêmicas."
            />

            <EduKpiGrid
                items={[
                    {
                        label: 'Turmas Ativas',
                        value: turmasAtivas.length,
                        hint: 'em andamento',
                        icon: <Users className="w-4 h-4 text-blue-600" />,
                        tone: 'brand',
                    },
                    {
                        label: 'Alunos',
                        value: totalAlunos,
                        hint: `distribuídos em ${turmasAtivas.length} turma(s)`,
                        icon: <BookOpen className="w-4 h-4 text-violet-600" />,
                        tone: 'neutral',
                    },
                    {
                        label: 'Notas Pendentes',
                        value: notasPending,
                        hint: 'alunos sem nota lançada',
                        icon: <CheckSquare className="w-4 h-4 text-amber-600" />,
                        tone: 'warning' as const,
                    },
                    {
                        label: 'Ocorrências',
                        value: ocorrAcad.length,
                        hint: 'acadêmicas/disciplinares abertas',
                        icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
                        tone: ocorrAcad.length > 0 ? ('danger' as const) : 'success',
                    },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <LearningPathCard
                    modules={
                        modules.length > 0
                            ? modules
                            : [{ id: 'none', title: 'Sem turmas ativas', progress: 0, status: 'Pendente' as const }]
                    }
                />
                <AcademicPlanCard
                    events={
                        turmasAtivas.length > 0
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? turmasAtivas.slice(0, 3).map((t: any) => ({
                                id: t.id,
                                title: `Aula: ${t.courseName}`,
                                dateLabel: t.schedule,
                                type: 'Diário de classe',
                            }))
                            : [{ id: 'empty', title: 'Sem aulas agendadas', dateLabel: '—', type: 'Calendário' }]
                    }
                />
                <CommunicationCard items={commItems} />
            </div>

            <PageSection title="Ações pedagógicas" description="Prioridades para manter engajamento e desempenho">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" /> Minhas Turmas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {turmasAtivas.length === 0 && (
                                <p className="text-sm text-slate-400">Nenhuma turma ativa no momento.</p>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {turmasAtivas.slice(0, 5).map((t: any) => (
                                <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{t.courseName}</p>
                                        <p className="text-xs text-slate-500">{t.code} · {t.enrolledCount} alunos</p>
                                    </div>
                                    <Link
                                        href={`/docente/diario?turmaId=${t.id}`}
                                        className="text-xs font-medium text-violet-600 hover:underline"
                                    >
                                        Diário →
                                    </Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-500" /> Alerta Acadêmico
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-600">
                            {ocorrAcad.length === 0 ? (
                                <p className="text-emerald-600 font-medium">✓ Nenhuma ocorrência acadêmica em aberto.</p>
                            ) : (
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                ocorrAcad.slice(0, 4).map((oc: any) => (
                                    <p key={oc.id} className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
                                        {oc.titulo}
                                    </p>
                                ))
                            )}
                            {notasPending > 0 && (
                                <p className="flex items-center gap-2 text-amber-700">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0" />
                                    {notasPending} aluno(s) sem nota lançada — verifique o diário
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageSection>
        </div>
    );
}
