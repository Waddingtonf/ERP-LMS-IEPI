import { getEnrollmentsByAluno } from "@/lms/actions/enrollmentActions"
import { PageHeader } from "@/components/layout"
import { EduKpiGrid, AcademicPlanCard } from "@/components/educacional/dashboard-kit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, TrendingUp, UserCheck } from "lucide-react"

const MOCK_STUDENT_ID = "student-1"

export default async function HistoricoPage() {
    const enrollments = await getEnrollmentsByAluno(MOCK_STUDENT_ID)

    const concluidos = enrollments.filter((e) => e.status === "Concluido").length
    const ativos = enrollments.filter((e) => e.status === "Ativo").length
    const mediaPago = enrollments.length
        ? (enrollments.reduce((a, e) => a + e.amountPaid, 0) / enrollments.length / 100).toFixed(0)
        : "0"

    return (
        <div className="space-y-6">
            <PageHeader
                title="Histórico acadêmico"
                description="Evolução das matrículas, progresso por curso e certificados."
            />

            <EduKpiGrid
                items={[
                    { label: "Matrículas", value: enrollments.length, hint: "Histórico completo", icon: <BookOpen className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Concluídos", value: concluidos, hint: "Cursos finalizados", icon: <Award className="w-4 h-4 text-emerald-600" />, tone: "success" },
                    { label: "Ativos", value: ativos, hint: "Em andamento", icon: <UserCheck className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                    { label: "Ticket médio", value: `R$ ${mediaPago}`,
                        hint: "Investimento por matrícula", icon: <TrendingUp className="w-4 h-4 text-amber-600" />, tone: "warning" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-slate-200 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Linha do histórico</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {enrollments.map((enrollment) => (
                            <div key={enrollment.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{enrollment.courseName}</p>
                                    <p className="text-xs text-slate-500">Matrícula em {new Date(enrollment.dataMatricula + "T00:00:00").toLocaleDateString("pt-BR")}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Badge variant="outline">{enrollment.status}</Badge>
                                    <span className="text-xs text-slate-600">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(enrollment.amountPaid / 100)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <AcademicPlanCard
                    events={[
                        { id: "h1", title: "Solicitar certificado", dateLabel: "Após conclusão", type: "Certificação" },
                        { id: "h2", title: "Conferir notas finais", dateLabel: "Fim de módulo", type: "Avaliação" },
                        { id: "h3", title: "Atualizar trilha", dateLabel: "Mensal", type: "Planejamento" },
                    ]}
                />
            </div>
        </div>
    )
}
