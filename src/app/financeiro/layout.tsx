import { DollarSign, FileText, AlertTriangle, PieChart, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"

export default function FinanceiroLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold">
                        IE
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Portal Financeiro</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/financeiro" className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg text-sm font-medium transition-colors hover:bg-slate-700">
                        <LayoutDashboard className="w-5 h-5 text-slate-300" />
                        Visão Geral
                    </Link>
                    <Link href="/financeiro/receber" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <DollarSign className="w-5 h-5 text-slate-400" />
                        Contas a Receber
                    </Link>
                    <Link href="/financeiro/pagar" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <FileText className="w-5 h-5 text-slate-400" />
                        Contas a Pagar
                    </Link>
                    <Link href="/financeiro/inadimplencia" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <AlertTriangle className="w-5 h-5 text-slate-400" />
                        Inadimplência
                    </Link>
                    <Link href="/financeiro/relatorios" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <PieChart className="w-5 h-5 text-slate-400" />
                        Relatórios
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-red-400 hover:text-red-300">
                        <LogOut className="w-5 h-5" />
                        Sair do Portal
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-semibold text-slate-800">Gestão Financeira</h1>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                            F
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-medium text-slate-700">Analista Financeiro</div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
