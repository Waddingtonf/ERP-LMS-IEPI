"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, DollarSign, TrendingUp, AlertCircle, CheckCircle2, ArrowRightLeft } from "lucide-react"

const transactions = [
    { id: "TRX-8392", date: "2026-02-21", student: "João Silva", course: "Pós RH", amount: 1599.00, method: "Cartão em 12x", status: "cleared", tid: "5839029384" },
    { id: "TRX-8391", date: "2026-02-20", student: "Maria Almeida", course: "Extensão", amount: 299.00, method: "PIX", status: "cleared", tid: "PIX-90022" },
    { id: "TRX-8390", date: "2026-02-20", student: "Pedro Alves", course: "Direito", amount: 2500.00, method: "Boleto", status: "pending", tid: "BOL-99283" },
    { id: "TRX-8389", date: "2026-02-19", student: "Ana Santos", course: "Pós RH", amount: 1599.00, method: "Cartão em 6x", status: "failed", tid: "5839029381" },
]

export default function ConciliacaoPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Conciliação Financeira</h2>
                    <p className="text-slate-500 mt-1">Acompanhe recebimentos, reconciliação com a Cielo e exporte relatórios.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <Download className="w-4 h-4" /> Exportar CSV
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-slate-200">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase">Receita Líquida (Mês)</CardTitle>
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">R$ 48.590,00</div>
                        <p className="text-xs flex items-center gap-1 text-emerald-600 mt-1 font-medium">
                            <TrendingUp className="w-3 h-3" /> +12% vs. mês anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase">Aprovados Cielo</CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">142</div>
                        <p className="text-xs text-slate-500 mt-1">Transações concluídas</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase">Aguardando Boleto</CardTitle>
                        <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">18</div>
                        <p className="text-xs text-slate-500 mt-1">Pendentes de compensação</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase">Falhas / Chargeback</CardTitle>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-600">3</div>
                        <p className="text-xs text-slate-500 mt-1">Requerem atenção</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 flex-1">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input placeholder="Buscar TID, Aluno ou ID..." className="pl-9 bg-slate-50 h-9" />
                    </div>

                    <Select defaultValue="all">
                        <SelectTrigger className="w-[160px] h-9">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="cleared">Compensado</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="failed">Falhou</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="today">
                        <SelectTrigger className="w-[160px] h-9">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hoje</SelectItem>
                            <SelectItem value="week">Esta Semana</SelectItem>
                            <SelectItem value="month">Este Mês</SelectItem>
                            <SelectItem value="all">Todo o Histórico</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Transação (ID do Pedido)</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Aluno / Curso</TableHead>
                            <TableHead>Método</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>TID Cielo</TableHead>
                            <TableHead className="text-right">Status da Reconciliação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((trx) => (
                            <TableRow key={trx.id}>
                                <TableCell className="font-mono text-xs font-semibold text-slate-700">{trx.id}</TableCell>
                                <TableCell className="text-sm text-slate-600">{new Date(trx.date).toLocaleDateString('pt-BR')}</TableCell>
                                <TableCell>
                                    <div className="font-medium text-slate-900 text-sm">{trx.student}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{trx.course}</div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">{trx.method}</TableCell>
                                <TableCell className="font-semibold text-slate-900">R$ {trx.amount.toFixed(2).replace('.', ',')}</TableCell>
                                <TableCell>
                                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">{trx.tid}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {trx.status === 'cleared' && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Creditado</Badge>}
                                    {trx.status === 'pending' && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">Aguardando Pagamento</Badge>}
                                    {trx.status === 'failed' && <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-none">Recusado</Badge>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}
