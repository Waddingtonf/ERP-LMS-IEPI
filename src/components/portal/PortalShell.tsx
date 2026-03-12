"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { Menu, X, LogOut, ChevronRight, PanelLeftClose, PanelLeftOpen, Search, Settings, User } from "lucide-react"
import { logoutAction } from "@/lms/actions/authActions"
import { useUIStore } from "@/lib/stores/useUIStore"

export interface PortalNavItem {
    href: string
    label: string
    icon: React.ReactNode
    exact?: boolean
    children?: PortalNavItem[]
}

export type PortalType = 'admin' | 'docente' | 'financeiro' | 'aluno' | 'pedagogico'

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
    portal?: PortalType      // enables data-portal attribute for brand CSS tokens
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
    portal,
    children,
}: PortalShellProps) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { sidebarCollapsed, toggleSidebar, setCommandPaletteOpen } = useUIStore()

    // Close mobile sidebar on route change
    useEffect(() => { setSidebarOpen(false) }, [pathname])

    // Keyboard shortcut: Cmd/Ctrl+K opens command palette
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault()
            setCommandPaletteOpen(true)
        }
    }, [setCommandPaletteOpen])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href)

    // Auto-generate breadcrumbs from current path
    const breadcrumbs = pathname
        .split('/')
        .filter(Boolean)
        .map((segment, i, arr) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            href: '/' + arr.slice(0, i + 1).join('/'),
            isCurrent: i === arr.length - 1,
        }))

    const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64'

    return (
        <div className="min-h-screen bg-slate-50 flex" data-portal={portal ?? undefined}>

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
                    sidebarWidth,
                    "shrink-0 flex flex-col",
                    "bg-slate-900 text-white",
                    "border-r border-slate-800/80",
                    "transition-all duration-300 ease-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    "shadow-2xl lg:shadow-none",
                ].join(" ")}
            >
                {/* Brand */}
                <div className="h-16 flex items-center gap-3 px-3 border-b border-slate-800 shrink-0 overflow-hidden">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner"
                        style={{ backgroundColor: brandColor }}
                    >
                        {brandInitials}
                    </div>
                    {!sidebarCollapsed && (
                        <span className="font-semibold text-[15px] leading-tight flex-1 truncate">{portalName}</span>
                    )}
                    {/* X button — mobile only */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
                        aria-label="Fechar menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={sidebarCollapsed ? item.label : undefined}
                                className={[
                                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                                    "transition-colors duration-150",
                                    sidebarCollapsed ? "justify-center" : "",
                                    active
                                        ? "bg-slate-800 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                ].join(" ")}
                            >
                                {/* Active accent bar */}
                                {active && (
                                    <span
                                        className="sidebar-active-bar absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                        style={{ backgroundColor: brandColor }}
                                    />
                                )}
                                <span className="shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>
                                {!sidebarCollapsed && (
                                    <>
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {active && <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />}
                                    </>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User menu + logout in footer */}
                <div className="p-2 border-t border-slate-800 shrink-0 space-y-1">
                    {/* Collapse toggle — desktop only */}
                    <button
                        onClick={toggleSidebar}
                        title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
                        className="hidden lg:flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        {sidebarCollapsed
                            ? <PanelLeftOpen className="w-4 h-4 shrink-0" />
                            : <><PanelLeftClose className="w-4 h-4 shrink-0" />{!sidebarCollapsed && <span className="truncate">Recolher</span>}</>
                        }
                    </button>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen((v) => !v)}
                            title={sidebarCollapsed ? userName : undefined}
                            className={[
                                "flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors",
                                sidebarCollapsed ? "justify-center" : "",
                            ].join(" ")}
                        >
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ backgroundColor: userColor }}
                            >
                                {userInitial}
                            </div>
                            {!sidebarCollapsed && (
                                <div className="flex-1 text-left min-w-0">
                                    <div className="text-sm font-medium leading-tight truncate">{userName}</div>
                                    <div className="text-xs text-slate-400 leading-tight">{userRole}</div>
                                </div>
                            )}
                        </button>

                        {/* Dropdown */}
                        {userMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                <div className={[
                                    "absolute bottom-full mb-1 z-20 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 text-sm",
                                    sidebarCollapsed ? "left-10" : "left-0",
                                ].join(" ")}>
                                    <div className="px-3 py-2 border-b border-slate-700">
                                        <div className="font-medium text-white truncate">{userName}</div>
                                        <div className="text-xs text-slate-400">{userRole}</div>
                                    </div>
                                    <Link href="#perfil" className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>
                                        <User className="w-3.5 h-3.5" /> Meu Perfil
                                    </Link>
                                    <Link href="#configuracoes" className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" onClick={() => setUserMenuOpen(false)}>
                                        <Settings className="w-3.5 h-3.5" /> Configurações
                                    </Link>
                                    <div className="border-t border-slate-700 mt-1" />
                                    <form action={logoutAction}>
                                        <button type="submit" className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors">
                                            <LogOut className="w-3.5 h-3.5" /> Sair
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
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

                    {/* Title + breadcrumbs */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base sm:text-lg font-semibold text-slate-800 leading-tight truncate">
                            {headerTitle}
                        </h1>
                        {breadcrumbs.length > 1 && (
                            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={crumb.href} className="flex items-center gap-1">
                                        {i > 0 && <ChevronRight className="w-3 h-3" />}
                                        {crumb.isCurrent
                                            ? <span className="text-slate-600 font-medium">{crumb.label}</span>
                                            : <Link href={crumb.href} className="hover:text-slate-600 transition-colors">{crumb.label}</Link>
                                        }
                                    </span>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Command search trigger */}
                    <button
                        onClick={() => setCommandPaletteOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors border border-transparent hover:border-slate-300"
                        title="Busca rápida (Ctrl+K)"
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span>Buscar…</span>
                        <kbd className="ml-1 font-mono opacity-60">⌘K</kbd>
                    </button>

                    {/* User chip — desktop */}
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
