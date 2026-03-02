"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, CheckCircle2, Clock, AlertCircle, QrCode, Shield, TrendingDown, Wallet } from "lucide-react"
import { useState } from "react"

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
    const [showQR, setShowQR] = useState(false)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Financeiro</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Gerencie seus pagamentos, boletos e notas fiscais.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Shield className="w-3.5 h-3.5" /> Pagamento Seguro · SSL 256-bit
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 text-white p-6 shadow-md">
                    <p className="text-violet-300 text-xs font-medium uppercase tracking-wider mb-3">Próximo Vencimento</p>
                    <div className="text-3xl font-bold mb-1">R$ 133,25</div>
                    <div className="flex items-center gap-2 text-violet-200 text-sm">
                        <Clock className="w-3.5 h-3.5" /> 10 Fev 2026
                    </div>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Total Pago (Ano)</p>
                    <div className="text-2xl font-bold text-slate-900">R$ 133,25</div>
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium mt-2">
                        <TrendingDown className="w-3.5 h-3.5" /> 1 parcela quitada
                    </div>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Saldo Restante</p>
                    <div className="text-2xl font-bold text-slate-900">R$ 266,50</div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mt-2">
                        <Wallet className="w-3.5 h-3.5" /> 2 parcelas restantes
                    </div>
                </div>
            </div>

            {/* Payment actions */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-800 mb-1">Formas de Pagamento</h3>
                <p className="text-sm text-slate-500 mb-5">O PIX é confirmado instantaneamente · Boleto em até 3 dias úteis.</p>

                {showQR ? (
                    <div className="flex flex-col items-center py-4 gap-4">
                        <div className="w-40 h-40 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
                            <QrCode className="w-20 h-20 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Escaneie o QR Code no seu app bancário</p>
                        <p className="text-xs text-slate-400">Prazo: 10 min · Ambiente Sandbox</p>
                        <button onClick={() => setShowQR(false)} className="text-xs text-violet-600 hover:underline">Cancelar</button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => setShowQR(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] font-semibold gap-2 rounded-xl transition-all shadow-sm shadow-emerald-200"
                        >
                            <QrCode className="w-4 h-4" /> Pagar com PIX
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-xl hover:border-violet-300 hover:text-violet-700 transition-all">
                            <Download className="w-4 h-4" /> Baixar Boleto
                        </Button>
                    </div>
                )}
            </div>

            {/* Invoice history */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Histórico de Faturas</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {invoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors gap-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                    invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-600' :
                                    invoice.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                    'bg-slate-100 text-slate-400'
                                }`}>
                                    {invoice.status === 'paid'
                                        ? <CheckCircle2 className="w-5 h-5" />
                                        : invoice.status === 'pending'
                                            ? <AlertCircle className="w-5 h-5" />
                                            : <FileText className="w-5 h-5" />
                                    }
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm leading-snug">{invoice.description}</p>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span>Venc.: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</span>
                                        {invoice.status === 'paid' && (
                                            <span className="text-emerald-600 font-medium">
                                                · Pago em {new Date(invoice.paidAt!).toLocaleDateString('pt-BR')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 ml-14 sm:ml-0">
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">R$ {invoice.amount.toFixed(2).replace('.', ',')}</p>
                                    <div className="mt-1">
                                        {invoice.status === 'paid' && (
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-xs">Pago</Badge>
                                        )}
                                        {invoice.status === 'pending' && (
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-xs">Em Aberto</Badge>
                                        )}
                                        {invoice.status === 'upcoming' && (
                                            <Badge variant="outline" className="text-slate-400 border-slate-200 text-xs">A vencer</Badge>
                                        )}
                                    </div>
                                </div>
                                {invoice.status !== 'upcoming' && (
                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                                        <Download className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
