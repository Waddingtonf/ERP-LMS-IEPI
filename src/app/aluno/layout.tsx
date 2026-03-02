import AlunoNav from "./_components/AlunoNav"
import { Bell, Search } from "lucide-react"

export default function AlunoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50 flex flex-col md:flex-row">
            <AlunoNav />

            {/* Main content area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Sticky Header */}
                <header className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3 flex-1 max-w-md ml-10 md:ml-0">
                        <div className="relative flex-1 hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Buscar aulas, materiais..."
                                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="relative p-2.5 text-slate-500 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all"
                            aria-label="Notificações"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        </button>

                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 ml-1">
                            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-violet-200 shadow-sm">
                                <img
                                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-sm font-semibold text-slate-800 leading-tight">João Silva</div>
                                <div className="text-[11px] text-violet-500 font-medium">Aluno(a)</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
