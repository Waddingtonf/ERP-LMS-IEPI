import { getDocenteTurmas, getAlunosByTurma, type Turma } from "@/lms/actions/docenteActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, Clock } from "lucide-react";

export default async function TurmasPage() {
    const turmas = await getDocenteTurmas();

    // Carregar alunos de cada turma
    const turmasComAlunos = await Promise.all(
        turmas.map(async (turma) => ({
            ...turma,
            alunos: await getAlunosByTurma(turma.id),
        }))
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Minhas Turmas</h2>
                <p className="text-slate-500 mt-1">Gerencie suas turmas e acompanhe os alunos.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {turmasComAlunos.map((turma) => {
                    const alunosEmRisco = turma.alunos.filter(
                        (a) => a.status === "Em risco" || a.status === "Reprovado"
                    ).length;

                    return (
                        <Card key={turma.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-slate-800">{turma.nome}</CardTitle>
                                        <CardDescription className="mt-1 font-medium text-slate-600">
                                            {turma.curso}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        {turma.semestre}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        {turma.horario}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {turma.diasSemana}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {turma.sala}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        {turma.totalAlunos} alunos
                                    </div>
                                </div>

                                {alunosEmRisco > 0 && (
                                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                                        <span className="text-amber-600 font-semibold">
                                            ⚠ {alunosEmRisco} aluno(s) em situação de risco
                                        </span>
                                    </div>
                                )}

                                {turma.alunos.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                                            Lista de Alunos
                                        </p>
                                        <div className="space-y-2 max-h-48 overflow-auto">
                                            {turma.alunos.map((aluno) => (
                                                <div
                                                    key={aluno.id}
                                                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">{aluno.nome}</p>
                                                        <p className="text-xs text-slate-400">{aluno.email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-right">
                                                        <div className="text-xs text-slate-500">
                                                            <span className="font-semibold text-slate-700">{aluno.frequencia}%</span> freq.
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${
                                                                aluno.status === "Regular"
                                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                                    : aluno.status === "Em risco"
                                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                    : "bg-red-50 text-red-700 border-red-200"
                                                            }`}
                                                        >
                                                            {aluno.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
