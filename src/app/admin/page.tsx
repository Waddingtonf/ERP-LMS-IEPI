"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, GraduationCap, DollarSign, Activity } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Geral</h2>
                <p className="text-slate-500 mt-1">Visão completa da operação acadêmica e financeira.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">1,245</div>
                        <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
                            +12% mês anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Turmas Ativas</CardTitle>
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">42</div>
                        <p className="text-xs text-slate-500 mt-1">Em 8 cursos diferentes</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Receita do Mês</CardTitle>
                        <DollarSign className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">R$ 154.300</div>
                        <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
                            +8% mês anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Taxa de Conclusão</CardTitle>
                        <Activity className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">68%</div>
                        <p className="text-xs text-slate-500 mt-1">Média entre todos os cursos</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Últimas Matrículas</CardTitle>
                        <CardDescription>Fluxo recente de entrada pela vitrine.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm">
                                        {["JS", "MA", "PA"][i - 1]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{["João Silva", "Maria Almeida", "Pedro Alves"][i - 1]}</p>
                                        <p className="text-xs text-slate-500">{["Gestão em RH", "Atendimento", "Administração"][i - 1]}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 rounded-md">Pago</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Há {i * 2} horas</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Avisos e Pendências</CardTitle>
                        <CardDescription>Ações que precisam da sua atenção.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg h-fit">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-amber-900 text-sm">Triagem de Documentos</h4>
                                <p className="text-xs text-amber-700/80 mt-1">Há 12 alunos aguardando validação de RG e histórico escolar para liberação plena do portal.</p>
                                <button className="text-xs font-semibold text-amber-800 underline mt-2 hover:text-amber-900">
                                    Acessar Fila de Triagem
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 border border-rose-200 bg-rose-50 rounded-lg">
                            <div className="bg-rose-100 text-rose-600 p-2 rounded-lg h-fit">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-rose-900 text-sm">Falhas de Conciliação Cielo</h4>
                                <p className="text-xs text-rose-700/80 mt-1">2 transações constam como pagas na operadora mas pendentes no sistema.</p>
                                <button className="text-xs font-semibold text-rose-800 underline mt-2 hover:text-rose-900">
                                    Verificar Divergências
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
