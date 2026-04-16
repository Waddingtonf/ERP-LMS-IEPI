import { getAvaliacoesByTurma, getDocenteTurmas } from "@/lms/actions/docenteActions"
import { PageHeader } from "@/components/layout"
import { EduKpiGrid, AcademicPlanCard } from "@/components/educacional/dashboard-kit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ClipboardCheck, FileText, TrendingUp } from "lucide-react"

export default async function NotasPage() {
    const turmas = await getDocenteTurmas()
    const turmasComAvaliacoes = await Promise.all(
        turmas.map(async (turma) => ({ ...turma, avaliacoes: await getAvaliacoesByTurma(turma.id) })),
    )

    const totalAvaliacoes = turmasComAvaliacoes.reduce((acc, t) => acc + t.avaliacoes.length, 0)
    const medias = turmasComAvaliacoes.flatMap((t) => t.avaliacoes.map((a) => a.media).filter((m): m is number => m !== null))
    const mediaGeral = medias.length ? (medias.reduce((a, b) => a + b, 0) / medias.length).toFixed(1) : "0.0"
    const pendentes = turmasComAvaliacoes.reduce((acc, t) => acc + t.avaliacoes.filter((a) => a.media === null).length, 0)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Notas e avaliações"
                description="Lançamento acadêmico por turma com visão de desempenho e pendências."
            />

            <EduKpiGrid
                items={[
                    { label: "Avaliações", value: totalAvaliacoes, hint: "Registros no período", icon: <ClipboardCheck className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Média geral", value: mediaGeral, hint: "Consolidação por turma", icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, tone: "success" },
                    { label: "Pendências", value: pendentes, hint: "Lançamento em aberto", icon: <FileText className="w-4 h-4 text-amber-600" />, tone: "warning" },
                    { label: "Status", value: "Operacional", hint: "Fluxo acadêmico ativo", icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-slate-200 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Resumo por turma</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {turmasComAvaliacoes.map((turma) => {
                            const total = turma.avaliacoes.length
                            const pend = turma.avaliacoes.filter((a) => a.media === null).length
                            const mediaTurmaValores = turma.avaliacoes.map((a) => a.media).filter((m): m is number => m !== null)
                            const mediaTurma = mediaTurmaValores.length
                                ? (mediaTurmaValores.reduce((a, b) => a + b, 0) / mediaTurmaValores.length).toFixed(1)
                                : "0.0"

                            return (
                                <div key={turma.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{turma.nome} · {turma.curso}</p>
                                        <p className="text-xs text-slate-500">{total} avaliação(ões) · média {mediaTurma}</p>
                                    </div>
                                    <Badge variant="outline" className={pend > 0 ? "text-amber-700 border-amber-300" : "text-emerald-700 border-emerald-300"}>
                                        {pend > 0 ? `${pend} pendente(s)` : "Completo"}
                                    </Badge>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <AcademicPlanCard
                    events={[
                        { id: "dn1", title: "Fechar AV1", dateLabel: "18/03", type: "Avaliação" },
                        { id: "dn2", title: "Conselho de notas", dateLabel: "22/03", type: "Governança" },
                        { id: "dn3", title: "Publicar feedback", dateLabel: "Após fechamento", type: "Comunicação" },
                    ]}
                />
            </div>
        </div>
    )
}
