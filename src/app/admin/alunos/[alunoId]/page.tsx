"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, CreditCard, Save, ShieldAlert, ArrowLeft } from "lucide-react"
import Link from "next/link"

const student = {
    id: "ALN-001",
    name: "João Silva",
    email: "joao.silva@email.com",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    status: "active",
    registeredAt: "2026-01-05",
    enrollments: [
        { course: "Gestão Estratégica em RH", status: "Ativo", progress: 35 },
        { course: "Excelência em Atendimento", status: "Concluído", progress: 100 }
    ]
}

export default function EditAlunoPage({ params }: { params: Promise<{ alunoId: string }> }) {
    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/alunos">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        {student.name}
                        {student.status === 'active' ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-medium">Ativo</Badge>
                        ) : (
                            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-none font-medium">Bloqueado</Badge>
                        )}
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm">Matrícula: {student.id} • Cadastrado em {new Date(student.registeredAt).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Formulário Principal */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-slate-400" /> Dados Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="nome">Nome Completo</Label>
                                        <Input id="nome" defaultValue={student.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input id="cpf" defaultValue={student.cpf} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nascimento">Data de Nascimento</Label>
                                        <Input id="nascimento" type="date" defaultValue="1990-05-15" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Mail className="w-5 h-5 text-slate-400" /> Contato e Acesso
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="email">E-mail Principal</Label>
                                        <Input id="email" type="email" defaultValue={student.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone">Telefone / Celular</Label>
                                        <Input id="telefone" defaultValue={student.phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status da Conta</Label>
                                        <Select defaultValue={student.status}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Usuário Ativo</SelectItem>
                                                <SelectItem value="blocked">Bloqueado</SelectItem>
                                                <SelectItem value="pending">Aguardando Documentação</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                                    <Button className="bg-violet-600 hover:bg-violet-700 font-semibold gap-2">
                                        <Save className="w-4 h-4" /> Salvar Alterações do Aluno
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base">Métricas Acadêmicas</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {student.enrollments.map((enr, idx) => (
                                <div key={idx} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="text-sm font-medium text-slate-800 leading-tight mb-1">{enr.course}</div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={enr.status === 'Concluído' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>{enr.status}</span>
                                        <span className="text-slate-400">{enr.progress}% Concluído</span>
                                    </div>
                                </div>
                            ))}

                            <Button variant="outline" className="w-full mt-2 text-violet-700 hover:text-violet-800 border-violet-200 bg-violet-50 hover:bg-violet-100">
                                Ver Histórico Completo
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-rose-200 shadow-sm bg-rose-50/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base text-rose-800 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" /> Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-rose-700/80">Ações irreversíveis que afetam o acesso direto do aluno à plataforma.</p>
                            <Button variant="destructive" className="w-full text-xs">Excluir Base de Dados do Aluno</Button>
                            <Button variant="outline" className="w-full text-xs border-rose-200 text-rose-700 hover:bg-rose-100">Forçar Redefinição de Senha</Button>
                        </CardContent>
                    </Card>

                </div>

            </div>

        </div>
    )
}
