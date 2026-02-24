"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const invoices = [
    {
        id: "FAT-001",
        description: "Mensalidade 01/12 - Pós-Graduação em RH",
        dueDate: "2026-01-10",
        amount: 133.25,
        status: "paid",
        paidAt: "2026-01-08"
    },
    {
        id: "FAT-002",
        description: "Mensalidade 02/12 - Pós-Graduação em RH",
        dueDate: "2026-02-10",
        amount: 133.25,
        status: "pending",
        paidAt: null
    },
    {
        id: "FAT-003",
        description: "Mensalidade 03/12 - Pós-Graduação em RH",
        dueDate: "2026-03-10",
        amount: 133.25,
        status: "upcoming",
        paidAt: null
    }
]

export default function FinanceiroPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Financeiro</h2>
                <p className="text-slate-500 mt-1">Gerencie seus pagamentos, boletos e notas fiscais.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-violet-600 text-white border-none shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-violet-100 uppercase tracking-wider">Próximo Vencimento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">R$ 133,25</div>
                        <p className="text-sm text-violet-200 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Vence em 10 Fev 2026
                        </p>
                    </CardContent>
                </Card>

                <Card className="col-span-2 border-slate-200">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
                        <CardDescription>O pagamento via PIX é confirmado na mesma hora.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-semibold gap-2">
                            Pagar com PIX Agora
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" /> Baixar Boleto
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm mt-8">
                <CardHeader>
                    <CardTitle className="text-xl">Histórico de Faturas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {invoices.map((invoice) => (
                            <div key={invoice.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors gap-4">

                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full mt-1 ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-600' :
                                            invoice.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {invoice.status === 'paid' ? <CheckCircle2 className="w-5 h-5" /> :
                                            invoice.status === 'pending' ? <AlertCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{invoice.description}</h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                            <span>Vencimento: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</span>
                                            {invoice.status === 'paid' && (
                                                <span className="text-emerald-600 font-medium border-l border-slate-200 pl-3">
                                                    Pago em {new Date(invoice.paidAt!).toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-4">
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900 text-lg">
                                            R$ {invoice.amount.toFixed(2).replace('.', ',')}
                                        </div>
                                        <div>
                                            {invoice.status === 'paid' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Pago</Badge>}
                                            {invoice.status === 'pending' && <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Em Aberto</Badge>}
                                            {invoice.status === 'upcoming' && <Badge variant="outline" className="text-slate-500 border-slate-200">A Vencer</Badge>}
                                        </div>
                                    </div>

                                    {invoice.status !== 'upcoming' && (
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-violet-600">
                                            <Download className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
