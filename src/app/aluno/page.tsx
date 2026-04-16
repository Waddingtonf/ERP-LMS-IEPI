import Link from "next/link"
import { PageHeader, PageSection } from "@/components/layout"
import { AcademicPlanCard, CommunicationCard, EduKpiGrid, LearningPathCard } from "@/components/educacional/dashboard-kit"
import type { LearningPathModule } from "@/components/educacional/dashboard-kit"
import { getStudentDashboardData } from "@/lms/actions/studentActions"
import { getCalendarioAcademico } from "@/lms/actions/calendarioActions"
import { getNotasByAluno } from "@/lms/actions/notaActions"
import { getCertificadosAluno } from "@/lms/actions/certificadoActions"
import { Award, BookOpen, CalendarDays, PlayCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function StudentDashboard() {
    const [{ user, enrollments }, eventos, notas, certificados] = await Promise.all([
        getStudentDashboardData(),
        getCalendarioAcademico(),
        getNotasByAluno(),
        getCertificadosAluno(),
    ])

    const completed = enrollments.filter((e) => e.progress === 100).length
    const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length
    const nextCourse = enrollments.find((e) => e.progress < 100)
    const certEmitidos = certificados.filter((c) => c.status === "Emitido").length

    const modules: LearningPathModule[] = enrollments.slice(0, 3).map((e, idx) => ({
        id: e.id,
        title: e.title,
        progress: e.progress,
        status: e.progress === 100 ? "Concluído" : idx === 0 ? "Em andamento" : "Pendente",
    }))

    const upcomingEvents = eventos.slice(0, 3).map((ev) => ({
        id: ev.id,
        title: ev.titulo,
        dateLabel: ev.dataInicio,
        type: ev.tipo,
    }))

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Olá, ${user.name.split(" ")[0]} 👋`}
                description="Seu painel educacional com trilha de aprendizagem, calendário e comunicação."
                actions={
                    nextCourse ? (
                        <Link href={`/aluno/aulas/${nextCourse.courseId}`} className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                            <PlayCircle className="w-4 h-4" /> Continuar aula
                        </Link>
                    ) : null
                }
            />

            <EduKpiGrid
                items={[
                    { label: "Matrículas", value: enrollments.length, hint: "Cursos ativos no portal", icon: <BookOpen className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Em andamento", value: inProgress, hint: "Trilhas em execução", icon: <PlayCircle className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                    { label: "Concluídos", value: completed, hint: "Módulos finalizados", icon: <Award className="w-4 h-4 text-emerald-600" />, tone: "success" },
                    { label: "Certificados", value: certEmitidos, hint: "Disponíveis para download", icon: <Award className="w-4 h-4 text-amber-600" />, tone: "warning" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <LearningPathCard modules={modules.length > 0 ? modules : [{ id: "none", title: "Sem trilhas no momento", progress: 0, status: "Pendente" }]} />
                <AcademicPlanCard events={upcomingEvents.length > 0 ? upcomingEvents : [{ id: "vazio", title: "Sem eventos próximos", dateLabel: "—", type: "Calendário" }]} />
                <CommunicationCard
                    items={[
                        { id: "a1", channel: "Aviso", title: "Publicação do plano da próxima aula", meta: "Docente · hoje" },
                        { id: "a2", channel: "Mensagem", title: "Feedback de avaliação liberado", meta: "Turma · há 1 dia" },
                        { id: "a3", channel: "Aviso", title: "Prazo de atividade até sexta", meta: "Coordenação" },
                    ]}
                />
            </div>

            <PageSection title="Desempenho recente" description="Resumo acadêmico rápido por notas e atividades">
                <Card className="border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Últimas notas lançadas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {notas.slice(0, 4).map((n) => {
                            const media = n.media ?? ((n.av1 ?? 0) + (n.av2 ?? 0) + (n.trabalho ?? 0)) / 3
                            return (
                                <div key={n.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 flex items-center justify-between text-sm">
                                    <p className="font-medium text-slate-800">{n.disciplina}</p>
                                    <p className="text-slate-600">Média: <span className="font-semibold text-slate-900">{media.toFixed(1)}</span></p>
                                </div>
                            )
                        })}
                        {notas.length === 0 && <p className="text-sm text-slate-500">Nenhuma nota lançada no momento.</p>}
                    </CardContent>
                </Card>
            </PageSection>
        </div>
    )
}
