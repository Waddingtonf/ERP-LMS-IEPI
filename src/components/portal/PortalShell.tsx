"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, LogOut, ChevronRight } from "lucide-react"
import { logoutAction } from "@/lms/actions/authActions"

export interface PortalNavItem {
    href: string
    label: string
    icon: React.ReactNode
    exact?: boolean
}

interface PortalShellProps {
    navItems: PortalNavItem[]
    brandColor: string       // hex / CSS value — e.g. "#6d28d9"
    brandInitials: string
    portalName: string
    headerTitle: string
    userName: string
    userRole: string
    userInitial: string
    userColor: string        // hex / CSS value for the avatar
    children: React.ReactNode
}

export default function PortalShell({
    navItems,
    brandColor,
    brandInitials,
    portalName,
    headerTitle,
    userName,
    userRole,
    userInitial,
    userColor,
    children,
}: PortalShellProps) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Close sidebar on route change (navigation)
    useEffect(() => { setSidebarOpen(false) }, [pathname])

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href)

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* ── Mobile overlay ────────────────────────────────────────── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside
                className={[
                    "fixed lg:static inset-y-0 left-0 z-50 lg:z-auto",
                    "w-64 shrink-0 flex flex-col",
                    "bg-slate-900 text-white",
                    "border-r border-slate-800/80",
                    "transition-transform duration-300 ease-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    "shadow-2xl lg:shadow-none",
                ].join(" ")}
            >
                {/* Brand */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800 shrink-0">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner"
                        style={{ backgroundColor: brandColor }}
                    >
                        {brandInitials}
                    </div>
                    <span className="font-semibold text-[15px] leading-tight flex-1 truncate">{portalName}</span>
                    {/* X button — mobile only */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        aria-label="Fechar menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                                    "transition-colors duration-150",
                                    active
                                        ? "bg-slate-800 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                ].join(" ")}
                            >
                                {/* Active accent bar */}
                                {active && (
                                    <span
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                        style={{ backgroundColor: brandColor }}
                                    />
                                )}
                                <span className="shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>
                                <span className="flex-1">{item.label}</span>
                                {active && <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-slate-800 shrink-0">
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            Sair do Portal
                        </button>
                    </form>
                </div>
            </aside>

            {/* ── Main area ─────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6 shrink-0 sticky top-0 z-30">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        aria-label="Abrir menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <h1 className="text-base sm:text-lg font-semibold text-slate-800 flex-1 truncate">
                        {headerTitle}
                    </h1>

                    {/* User chip */}
                    <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 shrink-0">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ backgroundColor: userColor }}
                        >
                            {userInitial}
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-medium text-slate-700 leading-tight">{userName}</div>
                            <div className="text-xs text-slate-400 leading-tight">{userRole}</div>
                        </div>
                    </div>
                </header>

                {/* Scrollable page content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    )
}
