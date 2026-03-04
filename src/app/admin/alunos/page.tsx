"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, MoreHorizontal, UserX, BookOpen } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getEnrollments } from "@/lms/actions/enrollmentActions"
import type { Enrollment } from "@/lms/repositories/EnrollmentRepository"

// Build a unique student list from enrollment records
interface StudentRow {
    id:             string
    name:           string
    email:          string
    enrollments:    number
    lastEnrollment: string
    statuses:       string[]
}

function buildStudentRows(enrollments: Enrollment[]): StudentRow[] {
    const map = new Map<string, StudentRow>()
    for (const e of enrollments) {
        const existing = map.get(e.alunoId)
        if (existing) {
            existing.enrollments++
            if (!existing.statuses.includes(e.status)) existing.statuses.push(e.status)
            if (e.dataMatricula > existing.lastEnrollment) existing.lastEnrollment = e.dataMatricula
        } else {
            map.set(e.alunoId, {
                id:             e.alunoId,
                name:           e.alunoName,
                email:          e.alunoEmail,
                enrollments:    1,
                lastEnrollment: e.dataMatricula,
                statuses:       [e.status],
            })
        }
    }
    return Array.from(map.values()).sort((a, b) => b.lastEnrollment.localeCompare(a.lastEnrollment))
}

function statusBadge(statuses: string[]) {
    if (statuses.includes('Evadido'))  return <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100">Evadido</Badge>
    if (statuses.includes('Trancado')) return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Trancado</Badge>
    if (statuses.includes('Ativo'))    return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Ativo</Badge>
    if (statuses.includes('Concluido')) return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Concluido</Badge>
    return <Badge variant="outline">—</Badge>
}

export default function AlunosPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [students, setStudents]     = useState<StudentRow[]>([])

    useEffect(() => {
        getEnrollments().then(e => setStudents(buildStudentRows(e)))
    }, [])

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gestão de Alunos</h2>
                    <p className="text-slate-500 mt-1">Gerencie os cadastros, matrículas e acessos dos estudantes.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por nome, e-mail ou ID..."
                        className="pl-9 w-full max-w-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500 flex items-center">
                    {filtered.length} aluno(s)
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Última Matrícula</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <div className="font-medium text-slate-900">{student.name}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">{student.id}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-slate-700">{student.email}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> {student.enrollments} matrícula(s)
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">
                                    {new Date(student.lastEnrollment + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>
                                    {statusBadge(student.statuses)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/alunos/${student.id}`} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" /> Ver Perfil
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50">
                                                <UserX className="mr-2 h-4 w-4" /> Registrar Evasão
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        {students.length === 0 ? 'Carregando...' : 'Nenhum aluno encontrado.'}
                    </div>
                )}
            </div>
        </div>
    )
}

    {
        id: "ALN-002",
        name: "Maria Almeida",
        email: "maria.almeida@email.com",
        cpf: "987.654.321-00",
        status: "blocked",
        enrollments: 1,
        registeredAt: "2026-01-10"
    },
    {
        id: "ALN-003",
        name: "Pedro Alves",
        email: "pedro.alves@email.com",
        cpf: "456.123.789-00",
        status: "active",
        enrollments: 3,
        registeredAt: "2026-01-15"
    }
]

export default function AlunosPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredStudents = mockStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.cpf.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gestão de Alunos</h2>
                    <p className="text-slate-500 mt-1">Gerencie os cadastros, matrículas e acessos dos estudantes.</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700">Novo Aluno Manual</Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por nome, e-mail ou CPF..."
                        className="pl-9 w-full max-w-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-50 bg-emerald-50 text-emerald-700 border-emerald-200">Ativos</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-50">Bloqueados</Badge>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Identificação</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Cadastro</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <div className="font-medium text-slate-900">{student.name}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">{student.cpf} • {student.id}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-slate-700">{student.email}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> {student.enrollments} matrículas
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">
                                    {new Date(student.registeredAt).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>
                                    {student.status === 'active' && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">Ativo</Badge>}
                                    {student.status === 'blocked' && <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200">Bloqueado (Finan/Doc)</Badge>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/alunos/${student.id}`} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50">
                                                <UserX className="mr-2 h-4 w-4" /> Bloquear Acesso
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredStudents.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Nenhum aluno encontrado.</div>
                )}
            </div>
        </div>
    )
}
