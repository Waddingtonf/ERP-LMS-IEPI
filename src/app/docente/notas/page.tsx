import { getDocenteTurmas, getAvaliacoesByTurma } from "@/lms/actions/docenteActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardCheck } from "lucide-react";

export default async function NotasPage() {
    const turmas = await getDocenteTurmas();

    const turmasComAvaliacoes = await Promise.all(
        turmas.map(async (turma) => ({
            ...turma,
            avaliacoes: await getAvaliacoesByTurma(turma.id),
        }))
    );

    function getStatusNota(media: number | null): { label: string; className: string } {
        if (media === null) return { label: "Pendente", className: "bg-amber-50 text-amber-700 border-amber-200" };
        if (media >= 7) return { label: "Aprovado", className: "bg-green-50 text-green-700 border-green-200" };
        if (media >= 5) return { label: "Recuperação", className: "bg-orange-50 text-orange-700 border-orange-200" };
        return { label: "Reprovado", className: "bg-red-50 text-red-700 border-red-200" };
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Notas e Frequência</h2>
                <p className="text-slate-500 mt-1">Lançamento e consulta de avaliações por turma.</p>
            </div>

            {turmasComAvaliacoes.map((turma) => (
                <Card key={turma.id} className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <ClipboardCheck className="w-5 h-5 text-blue-600" />
                            <div>
                                <CardTitle className="text-lg text-slate-800">
                                    {turma.nome} — {turma.curso}
                                </CardTitle>
                                <CardDescription>{turma.semestre} · {turma.totalAlunos} alunos</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {turma.avaliacoes.length === 0 ? (
                            <p className="text-sm text-slate-400 italic py-4 text-center">
                                Nenhuma avaliação registrada para esta turma.
                            </p>
                        ) : (
                            <div className="rounded-lg border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="font-semibold text-slate-700 min-w-[160px]">Aluno</TableHead>
                                            <TableHead className="text-center font-semibold text-slate-700 min-w-[60px]">AV1</TableHead>
                                            <TableHead className="text-center font-semibold text-slate-700 min-w-[60px]">AV2</TableHead>
                                            <TableHead className="text-center font-semibold text-slate-700 min-w-[90px]">Trabalho</TableHead>
                                            <TableHead className="text-center font-semibold text-slate-700 min-w-[70px]">Freq.</TableHead>
                                            <TableHead className="text-center font-semibold text-slate-700 min-w-[70px]">Média</TableHead>
                                            <TableHead className="text-center font-semibold text-slate-700 min-w-[110px]">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {turma.avaliacoes.map((av) => {
                                            const status = getStatusNota(av.media);
                                            return (
                                                <TableRow key={av.alunoId} className="hover:bg-slate-50/50">
                                                    <TableCell className="font-medium text-slate-800">
                                                        {av.nome}
                                                    </TableCell>
                                                    <TableCell className="text-center text-slate-600">
                                                        {av.av1 ?? <span className="text-slate-300">—</span>}
                                                    </TableCell>
                                                    <TableCell className="text-center text-slate-600">
                                                        {av.av2 ?? <span className="text-slate-300">—</span>}
                                                    </TableCell>
                                                    <TableCell className="text-center text-slate-600">
                                                        {av.trabalho ?? <span className="text-slate-300">—</span>}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span
                                                            className={`text-sm font-semibold ${
                                                                av.frequencia >= 75 ? "text-green-600" : "text-red-600"
                                                            }`}
                                                        >
                                                            {av.frequencia}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-slate-800">
                                                        {av.media !== null ? av.media.toFixed(1) : <span className="text-slate-300">—</span>}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className={`text-xs ${status.className}`}>
                                                            {status.label}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
