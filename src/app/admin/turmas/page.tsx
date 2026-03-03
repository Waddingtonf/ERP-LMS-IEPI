"use client"

import { useState } from "react"
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

/* ── mock data ────────────────────────────────────────────────────────────── */
const COURSES_FOR_SELECT = [
    { id: "course-1",  label: "Oncologia para Técnicos de Enfermagem" },
    { id: "course-3",  label: "Feridas, Estomias e Incontinências"    },
    { id: "course-4",  label: "Enfermagem Oncológica"                 },
    { id: "course-10", label: "Gestão em Saúde e Liderança"           },
]

const MOCK_TURMAS = [
    {
        id: "T001", code: "2026.1", courseId: "course-10", courseName: "Gestão em Saúde e Liderança",
        instructor: "Prof.ª Dra. Carla Bezerra",
        startDate: "2026-03-10", endDate: "2026-11-28",
        schedule: "Noturno (19h–22h)", location: "Sala 12 — Bloco B",
        maxStudents: 35, enrolledCount: 28, completedCount: 0,
        status: "Em andamento", avgAttendance: 91,
    },
    {
        id: "T002", code: "2026.1", courseId: "course-3", courseName: "Feridas, Estomias e Incontinências",
        instructor: "Enf.ª Esp. Renata Lima",
        startDate: "2026-04-07", endDate: "2026-09-19",
        schedule: "Sábados (08h–17h)", location: "Laboratório de Enfermagem",
        maxStudents: 25, enrolledCount: 22, completedCount: 0,
        status: "Inscrições abertas", avgAttendance: null,
    },
    {
        id: "T003", code: "2025.2", courseId: "course-10", courseName: "Gestão em Saúde e Liderança",
        instructor: "Prof.ª Dra. Carla Bezerra",
        startDate: "2025-08-11", endDate: "2026-02-21",
        schedule: "Noturno (19h–22h)", location: "Sala 12 — Bloco B",
        maxStudents: 35, enrolledCount: 35, completedCount: 30,
        status: "Concluída", avgAttendance: 88,
    },
    {
        id: "T004", code: "2025.2", courseId: "course-4", courseName: "Enfermagem Oncológica",
        instructor: "Enf.ª Dra. Fátima Saraiva",
        startDate: "2025-08-04", endDate: "2026-03-20",
        schedule: "Matutino (08h–12h)", location: "Sala 3 — Bloco A",
        maxStudents: 30, enrolledCount: 29, completedCount: 0,
        status: "Em andamento", avgAttendance: 85,
    },
    {
        id: "T005", code: "2026.2", courseId: "course-1", courseName: "Oncologia para Técnicos de Enfermagem",
        instructor: "Enf.ª Esp. Jorge Moutinho",
        startDate: "2026-07-06", endDate: "2026-12-12",
        schedule: "Sábados (08h–13h)", location: "EAD + Presencial Eventual",
        maxStudents: 50, enrolledCount: 0, completedCount: 0,
        status: "Planejada", avgAttendance: null,
    },
]

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
    "Em andamento":     { color: "bg-emerald-100 text-emerald-800 border-none", icon: CheckCircle  },
    "Inscrições abertas": { color: "bg-blue-100 text-blue-800 border-none",     icon: UserCheck    },
    "Planejada":        { color: "bg-amber-100 text-amber-800 border-none",     icon: Clock        },
    "Concluída":        { color: "bg-slate-100 text-slate-600 border-none",     icon: GraduationCap },
    "Suspensa":         { color: "bg-rose-100 text-rose-700 border-none",       icon: AlertCircle  },
}

const EMPTY_TURMA = {
    courseId: "", code: "", instructor: "",
    startDate: "", endDate: "", schedule: "", location: "",
    maxStudents: "30",
}

export default function TurmasPage() {
    const [search, setSearch]   = useState("")
    const [filter, setFilter]   = useState("all")
    const [open, setOpen]       = useState(false)
    const [form, setForm]       = useState(EMPTY_TURMA)
    const [detail, setDetail]   = useState<typeof MOCK_TURMAS[0] | null>(null)

    const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

    const filtered = MOCK_TURMAS.filter(t => {
        const matchSearch = t.courseName.toLowerCase().includes(search.toLowerCase()) ||
            t.instructor.toLowerCase().includes(search.toLowerCase()) ||
            t.code.includes(search)
        const matchFilter = filter === "all" || t.status === filter
        return matchSearch && matchFilter
    })

    const totalActive   = MOCK_TURMAS.filter(t => t.status === "Em andamento").length
    const totalStudents = MOCK_TURMAS.reduce((acc, t) => acc + t.enrolledCount, 0)
    const totalSeats    = MOCK_TURMAS.reduce((acc, t) => acc + t.maxStudents,   0)
    const avgOcup       = totalSeats > 0 ? Math.round((totalStudents / totalSeats) * 100) : 0

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
                <Button onClick={() => setOpen(true)} className="bg-violet-600 hover:bg-violet-700 gap-2 shrink-0">
                    <PlusCircle className="w-4 h-4" /> Nova Turma
                </Button>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Turmas ativas",    value: totalActive,              sub: "Em andamento",       color: "bg-violet-50  border-violet-100" },
                    { label: "Alunos matriculados", value: totalStudents,         sub: "em todas as turmas", color: "bg-blue-50    border-blue-100"   },
                    { label: "Ocupação média",   value: `${avgOcup}%`,            sub: "das vagas preenchidas", color: "bg-amber-50 border-amber-100" },
                    { label: "Turmas planejadas", value: MOCK_TURMAS.filter(t => t.status === "Planejada").length, sub: "Próximas aberturas", color: "bg-emerald-50 border-emerald-100" },
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
                    {["all", "Em andamento", "Inscrições abertas", "Planejada", "Concluída"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                filter === f
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
                                                {t.instructor.split(" ").slice(-1)[0][0]}
                                            </div>
                                            <span className="text-sm text-slate-700">{t.instructor}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-slate-700">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {new Date(t.startDate + "T12:00").toLocaleDateString("pt-BR")}
                                            </div>
                                            <div className="text-slate-400 mt-0.5">até {new Date(t.endDate + "T12:00").toLocaleDateString("pt-BR")}</div>
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
                                        {t.avgAttendance !== null ? (
                                            <div className={`text-sm font-bold ${t.avgAttendance >= 75 ? "text-emerald-600" : "text-rose-600"}`}>
                                                {t.avgAttendance}%
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
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

            {/* ── Modal: Nova Turma ──────────────────────────────────────── */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-violet-600" /> Nova Turma
                        </DialogTitle>
                        <DialogDescription>
                            Preencha as informações abaixo para criar uma nova turma e vinculá-la a um curso.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <Label>Curso <span className="text-red-500">*</span></Label>
                            <Select value={form.courseId} onValueChange={set("courseId")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COURSES_FOR_SELECT.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="code">Código da Turma <span className="text-red-500">*</span></Label>
                                <Input
                                    id="code" value={form.code}
                                    onChange={e => set("code")(e.target.value)}
                                    placeholder="Ex.: 2026.1"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Vagas Máximas</Label>
                                <Select value={form.maxStudents} onValueChange={set("maxStudents")}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[15, 20, 25, 30, 35, 40, 50, 60].map(n => (
                                            <SelectItem key={n} value={String(n)}>{n} alunos</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Docente / Coordenador</Label>
                            <Input
                                value={form.instructor}
                                onChange={e => set("instructor")(e.target.value)}
                                placeholder="Nome completo do responsável pela turma"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="tStartDate">Data de Início <span className="text-red-500">*</span></Label>
                                <Input
                                    id="tStartDate" type="date" value={form.startDate}
                                    onChange={e => set("startDate")(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="tEndDate">Previsão de Término</Label>
                                <Input
                                    id="tEndDate" type="date" value={form.endDate}
                                    onChange={e => set("endDate")(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Turno / Horário</Label>
                                <Select value={form.schedule} onValueChange={set("schedule")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["Matutino (08h–12h)","Vespertino (13h–17h)","Noturno (18h–22h)","Sábados (08h–17h)","EAD — Assíncrono","Híbrido"].map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Local / Sala</Label>
                                <Input
                                    value={form.location}
                                    onChange={e => set("location")(e.target.value)}
                                    placeholder="Ex.: Sala 12 — Bloco B"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button
                                className="bg-violet-600 hover:bg-violet-700 gap-2"
                                disabled={!form.courseId || !form.code || !form.startDate}
                                onClick={() => { setOpen(false); setForm(EMPTY_TURMA) }}
                            >
                                <PlusCircle className="w-4 h-4" /> Criar Turma
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

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
                                        { icon: Users,    label: "Docente",    value: detail.instructor },
                                        { icon: MapPin,   label: "Local",      value: detail.location   },
                                        { icon: Clock,    label: "Turno",      value: detail.schedule   },
                                        { icon: Calendar, label: "Início",     value: new Date(detail.startDate + "T12:00").toLocaleDateString("pt-BR") },
                                        { icon: Calendar, label: "Término",    value: new Date(detail.endDate + "T12:00").toLocaleDateString("pt-BR") },
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
                                        <span>{detail.enrolledCount}/{detail.maxStudents} ({Math.round(detail.enrolledCount/detail.maxStudents*100)}%)</span>
                                    </div>
                                    <div className="h-2.5 bg-violet-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-600 rounded-full" style={{ width: `${detail.enrolledCount/detail.maxStudents*100}%` }} />
                                    </div>
                                </div>

                                {/* Mock students preview */}
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Últimos Alunos Matriculados</p>
                                    <div className="space-y-1.5">
                                        {["Ana Clara Souza","Marcos Vinicius Torres","Juliana Ferreira","Carlos Eduardo Lima"].map(name => (
                                            <div key={name} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                                                    {name.split(" ").map(n => n[0]).slice(0,2).join("")}
                                                </div>
                                                <span className="text-sm text-slate-700">{name}</span>
                                                <Badge className="ml-auto bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px]">Ativo</Badge>
                                            </div>
                                        ))}
                                        {detail.enrolledCount > 4 && (
                                            <p className="text-xs text-slate-400 text-center pt-1">
                                                + {detail.enrolledCount - 4} outros alunos
                                            </p>
                                        )}
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
