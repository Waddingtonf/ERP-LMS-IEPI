import { getDesempenhoPorTurma } from "@/lms/actions/pedagogicoActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, BarChart3 } from "lucide-react";

export default async function DesempenhoPage() {
    const turmas = await getDesempenhoPorTurma();

    const mediaGeral = turmas.reduce((acc, t) => acc + t.mediaGeral, 0) / (turmas.length || 1);
    const mediaAprovacao = turmas.reduce((acc, t) => acc + t.taxaAprovacao, 0) / (turmas.length || 1);
    const mediaEvasao = turmas.reduce((acc, t) => acc + t.taxaEvasao, 0) / (turmas.length || 1);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Desempenho Geral</h2>
                <p className="text-slate-500 mt-1">Análise de performance acadêmica por turma e curso.</p>
            </div>

            {/* KPIs Globais */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-orange-200 bg-orange-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-orange-700 font-medium">Média Geral</CardTitle>
                        <BarChart3 className="w-4 h-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-800">{mediaGeral.toFixed(1)}</div>
                        <p className="text-xs text-orange-600 mt-1">Entre todos os cursos</p>
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-green-700 font-medium">Aprovação Média</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-800">{mediaAprovacao.toFixed(1)}%</div>
                        <p className="text-xs text-green-600 mt-1">Taxa de aprovação consolidada</p>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-red-700 font-medium">Evasão Média</CardTitle>
                        <Users className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-800">{mediaEvasao.toFixed(1)}%</div>
                        <p className="text-xs text-red-600 mt-1">Taxa média de evasão</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabela de Turmas */}
            <div className="space-y-4">
                {turmas.map((turma) => (
                    <Card key={turma.turma} className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base text-slate-800">{turma.turma}</CardTitle>
                            <CardDescription>{turma.curso} · {turma.totalAlunos} alunos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-6">
                                {/* Média Geral */}
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Média Geral</p>
                                    <div className="flex items-end gap-2">
                                        <span className={`text-2xl font-bold ${
                                            turma.mediaGeral >= 7 ? "text-green-600" :
                                            turma.mediaGeral >= 5 ? "text-amber-600" : "text-red-600"
                                        }`}>{turma.mediaGeral.toFixed(1)}</span>
                                        <span className="text-xs text-slate-400 mb-1">/ 10</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                                        <div
                                            className={`h-2 rounded-full ${turma.mediaGeral >= 7 ? "bg-green-400" : turma.mediaGeral >= 5 ? "bg-amber-400" : "bg-red-400"}`}
                                            style={{ width: `${(turma.mediaGeral / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Taxa de Aprovação */}
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Taxa de Aprovação</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-bold text-green-600">{turma.taxaAprovacao}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-green-400 h-2 rounded-full"
                                            style={{ width: `${turma.taxaAprovacao}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Taxa de Evasão */}
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Taxa de Evasão</p>
                                    <div className="flex items-end gap-2">
                                        <span className={`text-2xl font-bold ${turma.taxaEvasao > 5 ? "text-red-600" : "text-slate-700"}`}>
                                            {turma.taxaEvasao}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                                        <div
                                            className={`h-2 rounded-full ${turma.taxaEvasao > 5 ? "bg-red-400" : "bg-slate-300"}`}
                                            style={{ width: `${Math.min(turma.taxaEvasao * 5, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
