import { Eye, TrendingUp, UserMinus, MessageSquare, LayoutDashboard } from "lucide-react"
import PortalShell, { PortalNavItem } from "@/components/portal/PortalShell"

const navItems: PortalNavItem[] = [
    { href: "/pedagogico",                 label: "Visão Geral",       icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { href: "/pedagogico/acompanhamento",  label: "Acompanhamento",    icon: <Eye className="w-4 h-4" /> },
    { href: "/pedagogico/desempenho",      label: "Desempenho Geral",  icon: <TrendingUp className="w-4 h-4" /> },
    { href: "/pedagogico/retencao",        label: "Retenção/Evasão",   icon: <UserMinus className="w-4 h-4" /> },
    { href: "/pedagogico/ocorrencias",     label: "Ocorrências (SLA)", icon: <MessageSquare className="w-4 h-4" /> },
]

export default function PedagogicoLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalShell
            navItems={navItems}
            brandColor="#ea580c"
            brandInitials="IE"
            portalName="Setor Pedagógico"
            headerTitle="Monitoramento Pedagógico"
            userName="Coordenador(a) Pedagógico"
            userRole="Pedagógico"
            userInitial="P"
            userColor="#ea580c"
            portal="pedagogico"
        >
            {children}
        </PortalShell>
    )
}
