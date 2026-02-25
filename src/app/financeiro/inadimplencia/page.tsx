import { getAlunosInadimplentes } from "@/lms/actions/financeiroActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, Mail, TrendingDown } from "lucide-react";

function formatCurrency(centavos: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

function getRiskLevel(diasAtraso: number): { label: string; className: string } {
    if (diasAtraso > 30) return { label: "Crítico", className: "bg-red-100 text-red-700 border-red-300" };
    if (diasAtraso > 15) return { label: "Alto", className: "bg-orange-50 text-orange-700 border-orange-200" };
    return { label: "Médio", className: "bg-amber-50 text-amber-700 border-amber-200" };
}

export default async function InadimplenciaPage() {
    const inadimplentes = await getAlunosInadimplentes();
    const totalDevido = inadimplentes.reduce((acc, a) => acc + a.valorDevido, 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Inadimplência</h2>
                <p className="text-slate-500 mt-1">Alunos com pagamentos atrasados e gestão de cobranças.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-red-200 bg-red-50/40">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-red-700 font-medium">Total Inadimplente</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-800">{formatCurrency(totalDevido)}</div>
                        <p className="text-xs text-red-600 mt-1">{inadimplentes.length} alunos</p>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-amber-700 font-medium">Média de Atraso</CardTitle>
                        <TrendingDown className="w-4 h-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-800">
                            {Math.round(inadimplentes.reduce((a, i) => a + i.diasAtraso, 0) / (inadimplentes.length || 1))} dias
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-slate-600 font-medium">Casos Críticos (&gt;30d)</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {inadimplentes.filter((i) => i.diasAtraso > 30).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                {inadimplentes.map((aluno) => {
                    const risk = getRiskLevel(aluno.diasAtraso);
                    return (
                        <Card key={aluno.id} className={`border shadow-sm ${aluno.diasAtraso > 30 ? "border-red-200" : "border-amber-200"}`}>
                            <CardContent className="py-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                                            {aluno.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{aluno.nome}</p>
                                            <p className="text-sm text-slate-500">{aluno.curso}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {aluno.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400">Valor Devido</p>
                                            <p className="font-bold text-red-700">{formatCurrency(aluno.valorDevido)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400">Dias em Atraso</p>
                                            <p className="font-bold text-slate-800">{aluno.diasAtraso}d</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400">Contatos</p>
                                            <p className="font-bold text-slate-800">{aluno.tentativasContato}x</p>
                                        </div>
                                        <Badge variant="outline" className={`text-xs ${risk.className}`}>
                                            {risk.label}
                                        </Badge>
                                        <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors">
                                            <Phone className="w-3.5 h-3.5" />
                                            Registrar Contato
                                        </button>
                                    </div>
                                </div>
                                {aluno.ultimoContato && (
                                    <p className="text-xs text-slate-400 mt-3 border-t border-slate-100 pt-3">
                                        Último contato: {new Date(aluno.ultimoContato).toLocaleDateString("pt-BR")}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
