import { PageHeader } from "@/components/layout"
import { EduKpiGrid, CommunicationCard } from "@/components/educacional/dashboard-kit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEnrollments } from "@/lms/actions/enrollmentActions"
import { BookOpen, UserCheck, UserMinus, Users } from "lucide-react"

export default async function AlunosPage() {
    const enrollments = await getEnrollments()

    const byStudent = new Map<string, {
        alunoId: string
        alunoName: string
        alunoEmail: string
        statuses: Set<string>
        matriculas: number
        ultimaMatricula: string
    }>()

    for (const e of enrollments) {
        const prev = byStudent.get(e.alunoId)
        if (prev) {
            prev.statuses.add(e.status)
            prev.matriculas += 1
            if (e.dataMatricula > prev.ultimaMatricula) prev.ultimaMatricula = e.dataMatricula
        } else {
            byStudent.set(e.alunoId, {
                alunoId: e.alunoId,
                alunoName: e.alunoName,
                alunoEmail: e.alunoEmail,
                statuses: new Set([e.status]),
                matriculas: 1,
                ultimaMatricula: e.dataMatricula,
            })
        }
    }

    const students = Array.from(byStudent.values()).sort((a, b) => b.ultimaMatricula.localeCompare(a.ultimaMatricula))
    const ativos = students.filter((s) => s.statuses.has("Ativo")).length
    const risco = students.filter((s) => s.statuses.has("Evadido") || s.statuses.has("Trancado")).length

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestão de alunos"
                description="Visão consolidada de matrículas, risco acadêmico e acompanhamento de retenção."
            />

            <EduKpiGrid
                items={[
                    { label: "Alunos únicos", value: students.length, hint: "Base ativa no LMS", icon: <Users className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Alunos ativos", value: ativos, hint: "Com matrícula vigente", icon: <UserCheck className="w-4 h-4 text-emerald-600" />, tone: "success" },
                    { label: "Risco / evasão", value: risco, hint: "Necessitam intervenção", icon: <UserMinus className="w-4 h-4 text-rose-600" />, tone: "danger" },
                    { label: "Matrículas", value: enrollments.length, hint: "Total no período", icon: <BookOpen className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-slate-200 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Painel de acompanhamento por aluno</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {students.slice(0, 12).map((s) => {
                            const status = s.statuses.has("Evadido")
                                ? { label: "Evadido", cls: "bg-rose-100 text-rose-700" }
                                : s.statuses.has("Trancado")
                                ? { label: "Trancado", cls: "bg-amber-100 text-amber-700" }
                                : { label: "Ativo", cls: "bg-emerald-100 text-emerald-700" }
                            return (
                                <div key={s.alunoId} className="rounded-lg border border-slate-200 px-3 py-2 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">{s.alunoName}</p>
                                        <p className="text-xs text-slate-500 truncate">{s.alunoEmail}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <p className="text-xs text-slate-500">{s.matriculas} matrícula(s)</p>
                                        <Badge className={status.cls}>{status.label}</Badge>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <CommunicationCard
                    items={[
                        { id: "ad1", channel: "Aviso", title: "12 pendências de triagem documental", meta: "Secretaria · hoje" },
                        { id: "ad2", channel: "Ocorrência", title: "3 alunos sem acesso > 10 dias", meta: "Pedagógico" },
                        { id: "ad3", channel: "Mensagem", title: "Solicitação de revisão de matrícula", meta: "Financeiro" },
                    ]}
                />
            </div>
        </div>
    )
}
