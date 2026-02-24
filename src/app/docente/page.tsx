import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileDiff, CheckSquare, CalendarDays } from "lucide-react"

export default function DocenteDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-slate-500">Semestre 2024.1</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Próxima Aula</CardTitle>
                        <CalendarDays className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Hoje</div>
                        <p className="text-xs text-slate-500">19:00 - Programação Web</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Notas Pendentes</CardTitle>
                        <FileDiff className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">2 Turmas</div>
                        <p className="text-xs text-slate-500">Prazo: 05/03</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Frequência</CardTitle>
                        <CheckSquare className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Atualizada</div>
                        <p className="text-xs text-slate-500">Último lançamento há 2h</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
