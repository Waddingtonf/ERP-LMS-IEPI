"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, GraduationCap, ChevronRight } from "lucide-react"

const NAV_LINKS = [
    { label: "Cursos",       href: "/cursos"   },
    { label: "Sobre o IEPI", href: "/sobre"    },
    { label: "Eventos",      href: "/#eventos" },
    { label: "Contato",      href: "/contato"  },
]

export default function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // Close on route change
    useEffect(() => { setOpen(false) }, [pathname])

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    return (
        <>
            {/* Hamburger trigger */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden p-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Abrir menu de navegação"
                aria-expanded={open}
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={[
                    "fixed top-0 right-0 h-full w-72 max-w-[85vw] z-[60] lg:hidden",
                    "bg-[#0d0525] border-l border-white/10",
                    "flex flex-col shadow-2xl",
                    "transition-transform duration-300 ease-out",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded flex items-center justify-center font-black text-white text-sm bg-[#D96704]">+</div>
                        <span className="font-black text-white text-base tracking-tight">IEPI</span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Fechar menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="flex items-center justify-between px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
                        >
                            {label}
                            <ChevronRight className="w-4 h-4 opacity-40" />
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-white/10 mt-2 space-y-0.5">
                        <Link
                            href="/login"
                            className="flex items-center justify-between px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                Área do Aluno
                            </span>
                            <ChevronRight className="w-4 h-4 opacity-40" />
                        </Link>
                    </div>
                </nav>

                {/* CTA */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <Link
                        href="/cursos"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-colors"
                        style={{ backgroundColor: "#D96704" }}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Matricular-se agora
                    </Link>
                </div>
            </div>
        </>
    )
}
