"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
    BookOpen,
    GraduationCap,
    CreditCard,
    User,
    LogOut,
    LayoutDashboard,
    Menu,
    X,
    Shield,
    ChevronRight,
} from "lucide-react"
import { logoutAction } from "@/lms/actions/authActions"

const navItems = [
    {
        href: "/aluno",
        label: "Início",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        href: "/aluno/historico",
        label: "Histórico Escolar",
        icon: GraduationCap,
    },
    {
        href: "/aluno/financeiro",
        label: "Financeiro",
        icon: CreditCard,
    },
    {
        href: "/aluno/perfil",
        label: "Meu Perfil",
        icon: User,
    },
]

export default function AlunoNav() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href
        return pathname.startsWith(href)
    }

    const NavContent = () => (
        <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => {
                const active = isActive(item.href, item.exact)
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                            group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                            transition-all duration-200 overflow-hidden
                            ${active
                                ? "bg-white/15 text-white shadow-sm"
                                : "text-violet-200 hover:bg-white/10 hover:text-white"
                            }
                        `}
                    >
                        {active && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-300 rounded-r-full" />
                        )}
                        <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 ${active ? "text-violet-200" : "text-violet-400 group-hover:text-violet-200 group-hover:scale-110"}`} />
                        <span className="flex-1">{item.label}</span>
                        {active && <ChevronRight className="w-3.5 h-3.5 text-violet-300 opacity-60" />}
                    </Link>
                )
            })}
        </nav>
    )

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-violet-800 text-white p-2.5 rounded-xl shadow-lg transition-all active:scale-95"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:relative inset-y-0 left-0 z-40 md:z-auto
                    w-72 md:w-64 shrink-0 flex flex-col
                    bg-gradient-to-b from-violet-950 via-violet-900 to-violet-950
                    border-r border-violet-800/50
                    transition-transform duration-300 ease-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    shadow-2xl md:shadow-none
                `}
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-3 border-b border-violet-800/50">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center font-bold text-white shadow-inner shrink-0">
                        IE
                    </div>
                    <div>
                        <span className="font-bold text-white text-base leading-tight block">Portal do Aluno</span>
                        <span className="text-violet-400 text-[10px] font-medium uppercase tracking-wider">IEPI · 2026</span>
                    </div>
                </div>

                {/* Nav Items */}
                <NavContent />

                {/* Security Badge */}
                <div className="mx-3 mb-3 px-4 py-3 rounded-xl bg-violet-800/40 border border-violet-700/30 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                        <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Conexão Segura</p>
                        <p className="text-[10px] text-violet-400">SSL 256-bit · TLS 1.3</p>
                    </div>
                </div>

                {/* Logout */}
                <div className="p-3 border-t border-violet-800/50">
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium transition-all hover:bg-red-500/15 text-violet-300 hover:text-red-300 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            Sair da Conta
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}
