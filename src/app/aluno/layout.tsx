import AlunoNav from "./_components/AlunoNav"
import { NotificacaoDropdown } from "@/components/shared/NotificacaoDropdown"
import { Search } from "lucide-react"

export default function AlunoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#f5f4f8] flex flex-col md:flex-row">
            <AlunoNav />

            {/* Main content area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Sticky Header */}
                <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3 flex-1 max-w-sm ml-10 md:ml-0">
                        <div className="relative flex-1 hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Buscar aulas, materiais, notas..."
                                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <NotificacaoDropdown />

                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 ml-1">
                            <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-violet-200 shadow-sm">
                                <img
                                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-sm font-semibold text-slate-800 leading-tight">João Silva</div>
                                <div className="text-[11px] text-violet-500 font-medium">Aluno ativo</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
