import { getAlunosAcompanhamento } from "@/lms/actions/pedagogicoActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, AlertCircle, CheckCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
    Regular: { badge: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
    "Em risco": { badge: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
    Crítico: { badge: "bg-red-100 text-red-700 border-red-300", icon: AlertCircle },
    Reprovado: { badge: "bg-slate-100 text-slate-600 border-slate-300", icon: AlertCircle },
};

export default async function AcompanhamentoPage() {
    const alunos = await getAlunosAcompanhamento();

    const emRisco = alunos.filter((a) => a.status === "Em risco" || a.status === "Crítico").length;
    const regulares = alunos.filter((a) => a.status === "Regular").length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Acompanhamento de Alunos</h2>
                <p className="text-slate-500 mt-1">Monitoramento individual de frequência, notas e progresso.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-slate-600">Total Monitorado</CardTitle>
                        <Users className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{alunos.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-green-700">Regulares</CardTitle>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-800">{regulares}</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-red-700">Em Risco / Crítico</CardTitle>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-800">{emRisco}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                {alunos.map((aluno) => {
                    const config = STATUS_CONFIG[aluno.status] ?? STATUS_CONFIG.Regular;
                    const progressoPct = Math.round((aluno.modulosCompletos / aluno.totalModulos) * 100);

                    return (
                        <Card key={aluno.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="py-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 shrink-0 text-sm">
                                            {aluno.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{aluno.nome}</p>
                                            <p className="text-xs text-slate-400">
                                                {aluno.curso} · Turma {aluno.turma}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Progresso: {aluno.modulosCompletos}/{aluno.totalModulos} módulos</span>
                                            <span>{progressoPct}%</span>
                                        </div>
                                        <Progress value={progressoPct} className="h-2 bg-slate-100" />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400">Média</p>
                                            <p className={`font-bold text-lg ${
                                                aluno.mediaGeral >= 7 ? "text-green-600" :
                                                aluno.mediaGeral >= 5 ? "text-amber-600" : "text-red-600"
                                            }`}>
                                                {aluno.mediaGeral.toFixed(1)}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400">Freq.</p>
                                            <p className={`font-bold text-lg ${
                                                aluno.frequencia >= 75 ? "text-green-600" : "text-red-600"
                                            }`}>
                                                {aluno.frequencia}%
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Último Acesso
                                            </p>
                                            <p className="text-xs font-medium text-slate-700">
                                                {new Date(aluno.ultimoAcesso).toLocaleDateString("pt-BR")}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className={`text-xs ${config.badge}`}>
                                            {aluno.status}
                                        </Badge>
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
