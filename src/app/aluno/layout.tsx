import { Bell, BookOpen, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"

export default function AlunoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-violet-900 text-white flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-violet-800">
                    <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold">
                        IE
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Portal do Aluno</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/aluno" className="flex items-center gap-3 px-4 py-3 bg-violet-800/50 rounded-lg text-sm font-medium transition-colors hover:bg-violet-800">
                        <BookOpen className="w-5 h-5 text-violet-300" />
                        Meus Cursos
                    </Link>
                    <Link href="/aluno/historico" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-violet-800 text-violet-100">
                        <svg className="w-5 h-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Histórico Escolar
                    </Link>
                    <Link href="/aluno/financeiro" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-violet-800 text-violet-100">
                        <Settings className="w-5 h-5 text-violet-300" />
                        Financeiro
                    </Link>
                    <Link href="/aluno/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-violet-800 text-violet-100">
                        <User className="w-5 h-5 text-violet-300" />
                        Meu Perfil
                    </Link>
                </nav>

                <div className="p-4 border-t border-violet-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-colors hover:bg-violet-800 text-red-300 hover:text-red-200">
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-semibold text-slate-800">Área Acadêmica</h1>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:text-violet-700 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Avatar" />
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-sm font-medium text-slate-700">João Silva</div>
                                <div className="text-xs text-slate-500">Aluno(a)</div>
                            </div>
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
