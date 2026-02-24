import { LayoutDashboard, Users, BookOpen, FileCheck, DollarSign, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold">
                        IE
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Admin Backoffice</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg text-sm font-medium transition-colors hover:bg-slate-700">
                        <LayoutDashboard className="w-5 h-5 text-slate-300" />
                        Dashboard
                    </Link>
                    <Link href="/admin/cursos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        Cursos e Matrizes
                    </Link>
                    <Link href="/admin/alunos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Alunos
                    </Link>
                    <Link href="/admin/triagem" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <FileCheck className="w-5 h-5 text-slate-400" />
                        Triagem Documental
                    </Link>
                    <Link href="/admin/conciliacao" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300">
                        <DollarSign className="w-5 h-5 text-slate-400" />
                        Conciliação Financeira
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-red-400 hover:text-red-300">
                        <LogOut className="w-5 h-5" />
                        Sair do Painel
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-semibold text-slate-800">Sistema de Gestão IEPI</h1>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
                            A
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-medium text-slate-700">Administrador</div>
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
