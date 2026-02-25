import { getOcorrencias } from "@/lms/actions/pedagogicoActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertTriangle, Clock, CheckCircle } from "lucide-react";

const STATUS_CONFIG = {
    Aberta: { badge: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
    "Em andamento": { badge: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
    Resolvida: { badge: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
    Escalada: { badge: "bg-orange-50 text-orange-700 border-orange-200", icon: AlertTriangle },
};

const PRIORIDADE_CONFIG = {
    Alta: "bg-red-100 text-red-700",
    Média: "bg-amber-100 text-amber-700",
    Baixa: "bg-slate-100 text-slate-600",
};

function isSLAVencido(prazoSLA: string): boolean {
    return new Date(prazoSLA) < new Date();
}

export default async function OcorrenciasPage() {
    const ocorrencias = await getOcorrencias();

    const abertas = ocorrencias.filter((o) => o.status === "Aberta").length;
    const slaVencido = ocorrencias.filter(
        (o) => o.status !== "Resolvida" && isSLAVencido(o.prazoSLA)
    ).length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Ocorrências (SLA)</h2>
                <p className="text-slate-500 mt-1">Gerenciamento de solicitações, reclamações e sugestões dos alunos.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-slate-600">Total de Ocorrências</CardTitle>
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{ocorrencias.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-red-700">Abertas</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-800">{abertas}</div>
                    </CardContent>
                </Card>
                <Card className="border-orange-200 bg-orange-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-orange-700">SLA Vencido</CardTitle>
                        <Clock className="w-4 h-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-800">{slaVencido}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                {ocorrencias.map((oc) => {
                    const statusConf = STATUS_CONFIG[oc.status] ?? STATUS_CONFIG.Aberta;
                    const prioClass = PRIORIDADE_CONFIG[oc.prioridade] ?? PRIORIDADE_CONFIG.Baixa;
                    const slaVencidoFlag = oc.status !== "Resolvida" && isSLAVencido(oc.prazoSLA);

                    return (
                        <Card
                            key={oc.id}
                            className={`border shadow-sm ${slaVencidoFlag ? "border-orange-300" : "border-slate-200"}`}
                        >
                            <CardContent className="py-5">
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold text-slate-800 text-sm">{oc.aluno}</span>
                                            <span className="text-slate-300">·</span>
                                            <span className="text-xs text-slate-500">{oc.tipo}</span>
                                            {slaVencidoFlag && (
                                                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
                                                    ⏰ SLA Vencido
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-700">{oc.descricao}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                            <span>Aberta em: {new Date(oc.dataAbertura).toLocaleDateString("pt-BR")}</span>
                                            <span>·</span>
                                            <span>Prazo SLA: {new Date(oc.prazoSLA).toLocaleDateString("pt-BR")}</span>
                                            {oc.responsavelAtendimento && (
                                                <>
                                                    <span>·</span>
                                                    <span>Responsável: {oc.responsavelAtendimento}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
                                        <Badge variant="outline" className={`text-xs ${statusConf.badge}`}>
                                            {oc.status}
                                        </Badge>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${prioClass}`}>
                                            {oc.prioridade}
                                        </span>
                                        {!oc.responsavelAtendimento && oc.status === "Aberta" && (
                                            <button className="text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 hover:border-orange-300 px-3 py-1 rounded-lg transition-colors bg-orange-50 hover:bg-orange-100 mt-1">
                                                Assumir Atendimento
                                            </button>
                                        )}
                                        {oc.status !== "Resolvida" && (
                                            <button className="text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1 rounded-lg transition-colors">
                                                Marcar Resolvido
                                            </button>
                                        )}
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
