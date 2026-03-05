"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
    LayoutDashboard,
    PlayCircle,
    FileText,
    ClipboardList,
    Calendar,
    GraduationCap,
    Award,
    CreditCard,
    User,
    LogOut,
    Menu,
    X,
    BookOpen,
} from "lucide-react"
import { logoutAction } from "@/lms/actions/authActions"

type NavItem = { href: string; label: string; icon: React.ElementType; exact?: boolean }

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
    {
        label: "",
        items: [
            { href: "/aluno",           label: "Início",        icon: LayoutDashboard, exact: true },
        ],
    },
    {
        label: "Aprendizado",
        items: [
            { href: "/aluno/aulas",     label: "Minhas Aulas",  icon: PlayCircle },
            { href: "/aluno/materiais", label: "Materiais",     icon: FileText },
            { href: "/aluno/notas",     label: "Notas",         icon: ClipboardList },
            { href: "/aluno/calendario",label: "Calendário",    icon: Calendar },
        ],
    },
    {
        label: "Progressão",
        items: [
            { href: "/aluno/historico",     label: "Histórico",        icon: GraduationCap },
            { href: "/aluno/certificados",  label: "Certificados",     icon: Award },
        ],
    },
    {
        label: "Conta",
        items: [
            { href: "/aluno/financeiro", label: "Financeiro",  icon: CreditCard },
            { href: "/aluno/perfil",     label: "Perfil",      icon: User },
        ],
    },
]

function NavGroup({ group, pathname, onClose }: { group: typeof NAV_GROUPS[number]; pathname: string; onClose: () => void }) {
    const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href)

    return (
        <div className="space-y-0.5">
            {group.label && (
                <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest px-4 pt-4 pb-1.5">
                    {group.label}
                </p>
            )}
            {group.items.map(item => {
                const active = isActive(item.href, item.exact)
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`
                            group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-150
                            ${active
                                ? "bg-violet-600/60 text-white shadow-sm"
                                : "text-violet-300 hover:bg-white/8 hover:text-white"
                            }
                        `}
                    >
                        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-300 rounded-r-full" />}
                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-violet-400 group-hover:text-violet-200"}`} />
                        <span className="flex-1 leading-none">{item.label}</span>
                    </Link>
                )
            })}
        </div>
    )
}

export default function AlunoNav() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-violet-700 text-white p-2.5 rounded-xl shadow-lg active:scale-95"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Menu"
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative inset-y-0 left-0 z-40 md:z-auto
                w-64 shrink-0 flex flex-col
                bg-gradient-to-b from-[#1e0a3c] via-[#250d4a] to-[#1a0836]
                border-r border-violet-800/40
                transition-transform duration-300 ease-out
                ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                shadow-2xl md:shadow-none
            `}>
                {/* Logo */}
                <div className="h-16 px-5 flex items-center gap-3 border-b border-violet-800/40 shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-700 rounded-lg flex items-center justify-center font-extrabold text-white text-xs shadow-inner shrink-0">
                        IE
                    </div>
                    <div>
                        <span className="font-bold text-white text-sm leading-tight block">Portal do Aluno</span>
                        <span className="text-violet-500 text-[10px] font-medium">IEPI · 2026</span>
                    </div>
                </div>

                {/* Nav Groups */}
                <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0">
                    {NAV_GROUPS.map((group, i) => (
                        <NavGroup key={i} group={group} pathname={pathname} onClose={() => setMobileOpen(false)} />
                    ))}
                </nav>

                {/* Bottom: user + logout */}
                <div className="p-3 border-t border-violet-800/40 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-800/30">
                        <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-violet-600 shrink-0">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate leading-tight">João Silva</p>
                            <p className="text-[10px] text-violet-400">Aluno(a)</p>
                        </div>
                    </div>
                    <form action={logoutAction}>
                        <button type="submit" className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-sm text-violet-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group">
                            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            Sair da Conta
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}
