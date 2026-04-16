'use client';

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Users, PlusCircle, Search, MoreHorizontal, GraduationCap, Calendar,
    BookOpen, MapPin, UserCheck, AlertCircle, CheckCircle, Clock, Eye
} from "lucide-react"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Turma } from "@/lms/repositories/TurmaRepository";

const COURSES_FOR_SELECT = [
    { id: "course-1", label: "Oncologia para Técnicos de Enfermagem" },
    { id: "course-3", label: "Feridas, Estomias e Incontinências" },
    { id: "course-4", label: "Enfermagem Oncológica" },
    { id: "course-10", label: "Gestão em Saúde e Liderança" },
]

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
    "Em Andamento": { color: "bg-emerald-100 text-emerald-800 border-none", icon: CheckCircle },
    "Planejada": { color: "bg-amber-100 text-amber-800 border-none", icon: Clock },
    "Concluida": { color: "bg-slate-100 text-slate-600 border-none", icon: GraduationCap },
    "Cancelada": { color: "bg-rose-100 text-rose-700 border-none", icon: AlertCircle },
}

const EMPTY_TURMA = {
    courseId: "", code: "", instructor: "",
    startDate: "", endDate: "", schedule: "", location: "",
    maxStudents: "30",
}

interface Props {
    turmas: Turma[];
}

export default function TurmasClient({ turmas }: Props) {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("all")
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState(EMPTY_TURMA)
    const [detail, setDetail] = useState<Turma | null>(null)

    const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

    const filtered = turmas.filter(t => {
        const matchSearch = t.courseName.toLowerCase().includes(search.toLowerCase()) ||
            t.instructorName.toLowerCase().includes(search.toLowerCase()) ||
            t.code.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === "all" || t.status === filter
        return matchSearch && matchFilter
    })

    const totalActive = turmas.filter(t => t.status === "Em Andamento").length
    const totalStudents = turmas.reduce((acc, t) => acc + (t.enrolledCount ?? 0), 0)
    const totalSeats = turmas.reduce((acc, t) => acc + (t.maxStudents ?? 0), 0)
    const avgOcup = totalSeats > 0 ? Math.round((totalStudents / totalSeats) * 100) : 0

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gestão de Turmas</h2>
                    <p className="text-slate-500 mt-1 text-sm">
                        Gerencie turmas, alocações, calendário e alunos matriculados em cada oferta.
                    </p>
                </div>
                <Link href="/admin/turmas/nova">
                    <Button className="bg-violet-600 hover:bg-violet-700 gap-2 shrink-0">
                        <PlusCircle className="w-4 h-4" /> Nova Turma
                    </Button>
                </Link>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Turmas ativas", value: totalActive, sub: "Em Andamento", color: "bg-violet-50 border-violet-100" },
                    { label: "Alunos matriculados", value: totalStudents, sub: "em todas as turmas", color: "bg-blue-50 border-blue-100" },
                    { label: "Ocupação média", value: `${avgOcup}%`, sub: "das vagas preenchidas", color: "bg-amber-50 border-amber-100" },
                    { label: "Turmas planejadas", value: turmas.filter(t => t.status === "Planejada").length, sub: "Próximas aberturas", color: "bg-emerald-50 border-emerald-100" },
                ].map(kpi => (
                    <div key={kpi.label} className={`${kpi.color} border rounded-xl p-4`}>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                        <p className="text-2xl font-extrabold text-slate-900">{kpi.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        className="pl-9" value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por curso, docente ou código de turma…"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {["all", "Em Andamento", "Planejada", "Concluida", "Cancelada"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${filter === f
                                    ? "bg-violet-600 border-violet-600 text-white"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-violet-300"
                                }`}
                        >
                            {f === "all" ? "Todas" : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Turma / Curso</TableHead>
                            <TableHead>Docente</TableHead>
                            <TableHead>Calendário</TableHead>
                            <TableHead>Alunos</TableHead>
                            <TableHead>Frequência</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map(t => {
                            const occupation = Math.round((t.enrolledCount / t.maxStudents) * 100)
                            const Cfg = STATUS_CONFIG[t.status] ?? STATUS_CONFIG["Planejada"]
                            const StatusIcon = Cfg.icon
                            return (
                                <TableRow key={t.id} className="hover:bg-slate-50/80">
                                    <TableCell>
                                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                                            <span className="inline-block bg-violet-100 text-violet-700 text-[11px] font-bold px-2 py-0.5 rounded">
                                                {t.code}
                                            </span>
                                            {t.courseName}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {t.location} · <Clock className="w-3 h-3" /> {t.schedule}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold shrink-0">
                                                {t.instructorName?.split(" ").slice(-1)[0][0] || "?"}
                                            </div>
                                            <span className="text-sm text-slate-700">{t.instructorName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-slate-700">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {t.startDate}
                                            </div>
                                            <div className="text-slate-400 mt-0.5">até {t.endDate}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                                                    <span>{t.enrolledCount}/{t.maxStudents}</span>
                                                    <span>{occupation}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${occupation >= 90 ? "bg-rose-500" : occupation >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                                                        style={{ width: `${occupation}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-slate-400">—</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${Cfg.color} gap-1`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost" size="icon" className="h-8 w-8"
                                                onClick={() => setDetail(t)} title="Ver detalhes"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações da Turma</DropdownMenuLabel>
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <BookOpen className="w-4 h-4" /> Ver Diário de Aulas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <Users className="w-4 h-4" /> Lista de Alunos
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <GraduationCap className="w-4 h-4" /> Lançar Notas / Faltas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                                        <Calendar className="w-4 h-4" /> Editar Calendário
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-rose-600 cursor-pointer gap-2 focus:text-rose-600 focus:bg-rose-50">
                                                        <AlertCircle className="w-4 h-4" /> Cancelar Turma
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {filtered.length === 0 && (
                    <div className="p-10 text-center text-slate-500 text-sm">Nenhuma turma encontrada.</div>
                )}
            </div>

            {/* ── Modal: Detalhe da Turma ────────────────────────────────── */}
            <Dialog open={!!detail} onOpenChange={v => !v && setDetail(null)}>
                <DialogContent className="sm:max-w-lg">
                    {detail && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-violet-600" />
                                    Turma {detail.code} — {detail.courseName}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-2">
                                    <Badge className={STATUS_CONFIG[detail.status]?.color ?? ""}>
                                        {detail.status}
                                    </Badge>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-2">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {[
                                        { icon: Users, label: "Docente", value: detail.instructorName },
                                        { icon: MapPin, label: "Local", value: detail.location },
                                        { icon: Clock, label: "Turno", value: detail.schedule },
                                        { icon: Calendar, label: "Início", value: detail.startDate },
                                        { icon: Calendar, label: "Término", value: detail.endDate },
                                    ].map(row => (
                                        <div key={row.label} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                                            <row.icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</p>
                                                <p className="text-slate-800 font-medium">{row.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Occupation */}
                                <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
                                    <div className="flex justify-between text-sm font-semibold text-violet-700 mb-2">
                                        <span>Ocupação das Vagas</span>
                                        <span>{detail.enrolledCount}/{detail.maxStudents} ({Math.round(detail.enrolledCount / detail.maxStudents * 100)}%)</span>
                                    </div>
                                    <div className="h-2.5 bg-violet-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-600 rounded-full" style={{ width: `${detail.enrolledCount / detail.maxStudents * 100}%` }} />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-sm gap-2">
                                        <BookOpen className="w-4 h-4" /> Diário de Aulas
                                    </Button>
                                    <Button variant="outline" className="flex-1 text-sm gap-2">
                                        <GraduationCap className="w-4 h-4" /> Lançar Notas
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}
