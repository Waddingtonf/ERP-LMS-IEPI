import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader, PageSection } from "@/components/layout"
import { AcademicPlanCard, CommunicationCard, EduKpiGrid, LearningPathCard } from "@/components/educacional/dashboard-kit"
import { Activity, CalendarDays, GraduationCap, Users } from "lucide-react"
import { getEnrollments } from "@/lms/actions/enrollmentActions"
import { getCalendarioAcademico } from "@/lms/actions/calendarioActions"
import { getOcorrenciasAbertas } from "@/lms/actions/ocorrenciaActions"
import { OcorrenciaStatusBadge, PrioridadeBadge, EnrollmentStatusBadge } from "@/components/shared/StatusBadge"

export default async function AdminDashboard() {
    const [enrollments, eventos, ocorrencias] = await Promise.all([
        getEnrollments(),
        getCalendarioAcademico(),
        getOcorrenciasAbertas(),
    ])

    // Compute KPIs from real data
    const alunosAtivos = new Set(enrollments.filter(e => e.status === 'Ativo').map(e => e.alunoId)).size
    const turmasAtivas = new Set(enrollments.filter(e => e.turmaId).map(e => e.turmaId)).size
    const evadidos = enrollments.filter(e => e.status === 'Evadido').length
    const taxaEvasao = enrollments.length > 0 ? Math.round((evadidos / enrollments.length) * 100) : 0
    const concludedCount = enrollments.filter(e => e.status === 'Concluido').length
    const taxaConclusao = enrollments.length > 0 ? Math.round((concludedCount / enrollments.length) * 100) : 0

    // Latest 3 enrollments for dashboard
    const latestEnrollments = [...enrollments]
        .sort((a, b) => b.dataMatricula.localeCompare(a.dataMatricula))
        .slice(0, 3)

    // Upcoming calendar events
    const upcomingEvents = eventos.slice(0, 3).map(ev => ({
        id: ev.id,
        title: ev.titulo,
        dateLabel: ev.dataInicio,
        type: ev.tipo,
    }))

    // Learning path using distinct courses from active enrollments
    const uniqueCourses = [...new Map(enrollments.map(e => [e.courseId, e])).values()]
    const STATUS_LIST = ['Concluído', 'Em andamento', 'Pendente'] as const
    const modules = uniqueCourses.slice(0, 3).map((e, idx) => ({
        id: e.id,
        title: e.courseName,
        progress: idx === 0 ? 100 : idx === 1 ? 72 : 25,
        status: STATUS_LIST[idx] ?? ('Pendente' as const),
    }))

    // Open ocorrências as communication items
    const commItems = ocorrencias.slice(0, 3).map(oc => ({
        id: oc.id,
        channel: 'Ocorrência' as const,
        title: oc.titulo,
        meta: `${oc.prioridade} · há pouco`,
    }))

    // Pendências summary
    const triagemPendentes = ocorrencias.filter(o => o.tipo === 'TRIAGEM').length
    const academicasPendentes = ocorrencias.filter(o => o.tipo === 'ACADEMICA').length

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard Educacional"
                description="Visão integrada de operação acadêmica, trilhas e financeiro institucional."
            />

            <EduKpiGrid
                items={[
                    { label: "Alunos Ativos", value: alunosAtivos, hint: `${taxaEvasao}% taxa de evasão`, icon: <Users className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Turmas Ativas", value: turmasAtivas, hint: "com matrículas vigentes", icon: <GraduationCap className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                    { label: "Ocorrências Abertas", value: ocorrencias.length, hint: "requerem atenção", icon: <Activity className="w-4 h-4 text-rose-600" />, tone: "danger" as const },
                    { label: "Taxa de Conclusão", value: `${taxaConclusao}%`, hint: "dos alunos matriculados", icon: <GraduationCap className="w-4 h-4 text-emerald-600" />, tone: "success" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <LearningPathCard
                    modules={modules.length > 0 ? modules : [{ id: "none", title: "Sem cursos ativos", progress: 0, status: "Pendente" }]}
                />
                <AcademicPlanCard
                    events={upcomingEvents.length > 0 ? upcomingEvents : [{ id: "vazio", title: "Sem eventos próximos", dateLabel: "—", type: "Calendário" }]}
                />
                <CommunicationCard
                    items={commItems.length > 0 ? commItems : [
                        { id: "ok", channel: "Aviso", title: "Sem ocorrências abertas no momento", meta: "Sistema" },
                    ]}
                />
            </div>

            <PageSection title="Operação acadêmica" description="Acompanhamento rápido de frentes críticas">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base">Últimas matrículas</CardTitle>
                            <CardDescription>Entrada recente de alunos por curso</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {latestEnrollments.map((e) => (
                                <div key={e.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{e.alunoName}</p>
                                        <p className="text-xs text-slate-500">{e.courseName} · {e.dataMatricula}</p>
                                    </div>
                                    <EnrollmentStatusBadge status={e.status} />
                                </div>
                            ))}
                            {latestEnrollments.length === 0 && (
                                <p className="text-sm text-slate-400">Nenhuma matrícula recente.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Pendências prioritárias</CardTitle>
                            <CardDescription>Itens com impacto direto em retenção e operação</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-600">
                            {triagemPendentes > 0 && (
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                                    {triagemPendentes} ocorrência(s) de triagem documental aguardando resolução
                                </p>
                            )}
                            {academicasPendentes > 0 && (
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                                    {academicasPendentes} ocorrência(s) acadêmica(s) em aberto
                                </p>
                            )}
                            {ocorrencias.length === 0 && (
                                <p className="text-emerald-600 font-medium">✓ Nenhuma pendência crítica no momento.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageSection>
        </div>
    )
}
