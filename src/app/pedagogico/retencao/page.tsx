import { getDadosRetencao } from "@/lms/actions/pedagogicoActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserMinus, UserCheck, TrendingDown } from "lucide-react";

export default async function RetencaoPage() {
    const retencao = await getDadosRetencao();

    const totalInicial = retencao.reduce((a, r) => a + r.totalInicial, 0);
    const totalAtivos = retencao.reduce((a, r) => a + r.ativos, 0);
    const totalEvadidos = retencao.reduce((a, r) => a + r.evadidos, 0);
    const taxaGeral = ((totalAtivos / totalInicial) * 100).toFixed(1);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Retenção e Evasão</h2>
                <p className="text-slate-500 mt-1">Análise do índice de permanência dos alunos por turma.</p>
            </div>

            {/* KPIs Globais */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-green-700">Taxa Geral de Retenção</CardTitle>
                        <UserCheck className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-800">{taxaGeral}%</div>
                        <p className="text-xs text-green-600 mt-1">{totalAtivos} de {totalInicial} alunos ativos</p>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-red-700">Total de Evasões</CardTitle>
                        <UserMinus className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-800">{totalEvadidos}</div>
                        <p className="text-xs text-red-600 mt-1">Em todas as turmas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-slate-600">Turmas com Maior Evasão</CardTitle>
                        <TrendingDown className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-slate-800">
                            {retencao.sort((a, b) => b.evadidos - a.evadidos)[0]?.turma ?? "—"}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {retencao.sort((a, b) => b.evadidos - a.evadidos)[0]?.evadidos ?? 0} evasões
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Cards por turma */}
            <div className="grid gap-6 md:grid-cols-2">
                {retencao.map((r) => {
                    const retencaoPct = Math.round(r.taxaRetencao);
                    const color =
                        retencaoPct >= 90 ? "bg-green-500" :
                        retencaoPct >= 80 ? "bg-amber-400" : "bg-red-500";

                    return (
                        <Card key={r.turma} className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-slate-800">{r.turma}</CardTitle>
                                <CardDescription>
                                    {r.curso} · Início: {new Date(r.inicioTurma).toLocaleDateString("pt-BR")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Taxa de Retenção</span>
                                    <span className={`font-bold ${retencaoPct >= 90 ? "text-green-600" : retencaoPct >= 80 ? "text-amber-600" : "text-red-600"}`}>
                                        {r.taxaRetencao.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3">
                                    <div className={`h-3 rounded-full ${color}`} style={{ width: `${r.taxaRetencao}%` }} />
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                                    <div>
                                        <p className="text-xs text-slate-400">Início</p>
                                        <p className="font-bold text-slate-700">{r.totalInicial}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Ativos</p>
                                        <p className="font-bold text-green-600">{r.ativos}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Evadidos</p>
                                        <p className="font-bold text-red-600">{r.evadidos}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
