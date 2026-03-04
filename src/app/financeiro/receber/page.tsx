import { getContasReceber } from "@/lms/actions/financeiroActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
    Pago: { icon: CheckCircle, className: "bg-green-50 text-green-700 border-green-200" },
    Pendente: { icon: Clock, className: "bg-blue-50 text-blue-700 border-blue-200" },
    "Em atraso": { icon: AlertCircle, className: "bg-red-50 text-red-700 border-red-200" },
    Cancelado: { icon: AlertCircle, className: "bg-slate-50 text-slate-500 border-slate-200" },
};

function formatCurrency(centavos: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

export default async function ContasReceberPage() {
    const contas = await getContasReceber();

    const totalPendente = contas
        .filter((c) => c.status === "Pendente" || c.status === "Em atraso")
        .reduce((acc, c) => acc + c.valor, 0);

    const totalRecebido = contas
        .filter((c) => c.status === "Pago")
        .reduce((acc, c) => acc + c.valor, 0);

    const emAtraso = contas.filter((c) => c.status === "Em atraso").length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Contas a Receber</h2>
                <p className="text-slate-500 mt-1">Mensalidades, matrículas e demais recebimentos.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-emerald-200 bg-emerald-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-emerald-700 font-medium">Total Recebido</CardTitle>
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-800">{formatCurrency(totalRecebido)}</div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-blue-700 font-medium">A Receber</CardTitle>
                        <Clock className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-800">{formatCurrency(totalPendente)}</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-red-700 font-medium">Em Atraso</CardTitle>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-800">{emAtraso} cobranças</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="rounded-lg border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="font-semibold text-slate-700 min-w-[160px]">Aluno</TableHead>
                                    <TableHead className="font-semibold text-slate-700 min-w-[180px]">Curso</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-right min-w-[100px]">Valor</TableHead>
                                    <TableHead className="font-semibold text-slate-700 min-w-[110px]">Vencimento</TableHead>
                                    <TableHead className="font-semibold text-slate-700 min-w-[120px]">Método</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-center min-w-[100px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contas.map((conta) => {
                                    const config = STATUS_CONFIG[conta.status] ?? STATUS_CONFIG.Pendente;
                                    return (
                                        <TableRow key={conta.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-slate-800">{conta.aluno}</TableCell>
                                            <TableCell className="text-slate-600">{conta.curso}</TableCell>
                                            <TableCell className="text-right font-semibold text-slate-800">
                                                {formatCurrency(conta.valor)}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
                                            </TableCell>
                                            <TableCell className="text-slate-600">{conta.metodoPagamento}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={`text-xs ${config.className}`}>
                                                    {conta.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
