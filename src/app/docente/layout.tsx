import { Users, ClipboardCheck, LayoutDashboard, FileText, CalendarCheck } from "lucide-react"
import PortalShell, { PortalNavItem } from "@/components/portal/PortalShell"

const navItems: PortalNavItem[] = [
    { href: "/docente",           label: "Painel",              icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { href: "/docente/turmas",    label: "Minhas Turmas",       icon: <Users className="w-4 h-4" /> },
    { href: "/docente/frequencia",label: "Lista de Frequência", icon: <CalendarCheck className="w-4 h-4" /> },
    { href: "/docente/notas",     label: "Notas",               icon: <ClipboardCheck className="w-4 h-4" /> },
    { href: "/docente/materiais", label: "Materiais Opcionais", icon: <FileText className="w-4 h-4" /> },
]

export default function DocenteLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalShell
            navItems={navItems}
            brandColor="#2563eb"
            brandInitials="IE"
            portalName="Portal do Docente"
            headerTitle="Área do Professor"
            userName="Professor(a)"
            userRole="Docente"
            userInitial="D"
            userColor="#2563eb"
        >
            {children}
        </PortalShell>
    )
}
