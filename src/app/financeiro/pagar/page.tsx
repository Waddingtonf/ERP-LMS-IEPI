import { getContasPagar } from "@/lms/actions/financeiroActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
    Pago: { className: "bg-green-50 text-green-700 border-green-200" },
    Pendente: { className: "bg-blue-50 text-blue-700 border-blue-200" },
    "Em atraso": { className: "bg-red-50 text-red-700 border-red-200" },
};

const CATEGORIA_CONFIG: Record<string, string> = {
    Docente: "bg-violet-50 text-violet-700 border-violet-200",
    Infraestrutura: "bg-slate-100 text-slate-700 border-slate-300",
    Marketing: "bg-pink-50 text-pink-700 border-pink-200",
    Administrativo: "bg-amber-50 text-amber-700 border-amber-200",
    Tecnologia: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

function formatCurrency(centavos: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

export default async function ContasPagarPage() {
    const contas = await getContasPagar();

    const totalPendente = contas
        .filter((c) => c.status === "Pendente")
        .reduce((acc, c) => acc + c.valor, 0);

    const totalPago = contas
        .filter((c) => c.status === "Pago")
        .reduce((acc, c) => acc + c.valor, 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Contas a Pagar</h2>
                <p className="text-slate-500 mt-1">Honorários, aluguéis, fornecedores e obrigações da instituição.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-200">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-slate-600 font-medium">Total Pendente</CardTitle>
                        <Clock className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{formatCurrency(totalPendente)}</div>
                        <p className="text-xs text-slate-400 mt-1">
                            {contas.filter((c) => c.status === "Pendente").length} obrigações
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200 bg-emerald-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-emerald-700 font-medium">Total Pago</CardTitle>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-800">{formatCurrency(totalPago)}</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/30">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-red-700 font-medium">Em Atraso</CardTitle>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-800">
                            {contas.filter((c) => c.status === "Em atraso").length} obrigações
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <CardTitle className="text-lg text-slate-800">Lista de Obrigações</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="font-semibold text-slate-700 min-w-[160px]">Fornecedor</TableHead>
                                    <TableHead className="font-semibold text-slate-700 min-w-[200px]">Descrição</TableHead>
                                    <TableHead className="font-semibold text-slate-700 min-w-[130px]">Categoria</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-right min-w-[100px]">Valor</TableHead>
                                    <TableHead className="font-semibold text-slate-700 min-w-[110px]">Vencimento</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-center min-w-[100px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contas.map((conta) => {
                                    const stConfig = STATUS_CONFIG[conta.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.Pendente;
                                    const catClass = CATEGORIA_CONFIG[conta.categoria] ?? "bg-slate-50 text-slate-600";
                                    return (
                                        <TableRow key={conta.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-slate-800">{conta.fornecedor}</TableCell>
                                            <TableCell className="text-slate-600">{conta.descricao}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-xs ${catClass}`}>{conta.categoria}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-slate-800">
                                                {formatCurrency(conta.valor)}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={`text-xs ${stConfig.className}`}>
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
