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
    if (statuses.includes('Evadido'))   return <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100">Evadido</Badge>
    if (statuses.includes('Trancado'))  return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Trancado</Badge>
    if (statuses.includes('Ativo'))     return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Ativo</Badge>
    if (statuses.includes('Concluido')) return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">ConcluÃ­do</Badge>
    return <Badge variant="outline">â€”</Badge>
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">GestÃ£o de Alunos</h2>
                    <p className="text-slate-500 mt-1">Gerencie os cadastros, matrÃ­culas e acessos dos estudantes.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por nome, e-mail ou ID..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500 shrink-0">
                    {filtered.length} aluno(s) encontrado(s)
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="min-w-[160px]">Aluno</TableHead>
                                <TableHead className="min-w-[200px]">Contato</TableHead>
                                <TableHead className="min-w-[140px]">Ãšltima MatrÃ­cula</TableHead>
                                <TableHead className="min-w-[100px]">SituaÃ§Ã£o</TableHead>
                                <TableHead className="text-right min-w-[80px]">AÃ§Ãµes</TableHead>
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
                                        <div className="text-sm text-slate-700 break-all">{student.email}</div>
                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                            <BookOpen className="w-3 h-3 shrink-0" /> {student.enrollments} matrÃ­cula(s)
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
                                                <DropdownMenuLabel>AÃ§Ãµes</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/alunos/${student.id}`} className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" /> Ver Perfil
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50">
                                                    <UserX className="mr-2 h-4 w-4" /> Registrar EvasÃ£o
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        {students.length === 0 ? 'Carregando matrÃ­culas...' : 'Nenhum aluno encontrado.'}
                    </div>
                )}
            </div>
        </div>
    )
}
