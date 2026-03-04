import { LayoutDashboard, BookOpen, FileCheck, DollarSign, CalendarDays, ClipboardList, TrendingUp } from "lucide-react"
import PortalShell, { PortalNavItem } from "@/components/portal/PortalShell"

const navItems: PortalNavItem[] = [
    { href: "/admin",              label: "Dashboard",              icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { href: "/admin/secretaria",   label: "Secretaria",             icon: <ClipboardList className="w-4 h-4" /> },
    { href: "/admin/cursos",       label: "Cursos e Matrizes",      icon: <BookOpen className="w-4 h-4" /> },
    { href: "/admin/turmas",       label: "Turmas",                 icon: <CalendarDays className="w-4 h-4" /> },
    { href: "/admin/alunos",       label: "Alunos",                 icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { href: "/admin/triagem",      label: "Triagem Documental",     icon: <FileCheck className="w-4 h-4" /> },
    { href: "/admin/conciliacao",  label: "Conciliação Financeira", icon: <DollarSign className="w-4 h-4" /> },
    { href: "/admin/otimizacao",   label: "Otimização Financeira",  icon: <TrendingUp className="w-4 h-4" /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalShell
            navItems={navItems}
            brandColor="#7c3aed"
            brandInitials="IE"
            portalName="Admin Backoffice"
            headerTitle="Sistema de Gestão IEPI"
            userName="Administrador"
            userRole="Admin"
            userInitial="A"
            userColor="#7c3aed"
        >
            {children}
        </PortalShell>
    )
}
