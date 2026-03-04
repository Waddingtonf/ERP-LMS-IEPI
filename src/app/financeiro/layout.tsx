import { DollarSign, FileText, AlertTriangle, PieChart, LayoutDashboard } from "lucide-react"
import PortalShell, { PortalNavItem } from "@/components/portal/PortalShell"

const navItems: PortalNavItem[] = [
    { href: "/financeiro",                label: "Visão Geral",       icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { href: "/financeiro/receber",        label: "Contas a Receber",  icon: <DollarSign className="w-4 h-4" /> },
    { href: "/financeiro/pagar",          label: "Contas a Pagar",    icon: <FileText className="w-4 h-4" /> },
    { href: "/financeiro/inadimplencia",  label: "Inadimplência",     icon: <AlertTriangle className="w-4 h-4" /> },
    { href: "/financeiro/relatorios",     label: "Relatórios",        icon: <PieChart className="w-4 h-4" /> },
]

export default function FinanceiroLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalShell
            navItems={navItems}
            brandColor="#059669"
            brandInitials="IE"
            portalName="Portal Financeiro"
            headerTitle="Gestão Financeira"
            userName="Analista Financeiro"
            userRole="Financeiro"
            userInitial="F"
            userColor="#059669"
        >
            {children}
        </PortalShell>
    )
}
