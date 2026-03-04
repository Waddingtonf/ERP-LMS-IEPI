"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    ArrowRight,
    Check,
    BookOpen,
    Calendar,
    UserCheck,
    GraduationCap,
    MapPin,
    Plus,
    Trash2,
    Clock,
    AlertCircle,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// ── Tipos ────────────────────────────────────────────────────────────────────
type DiaSemana = "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sáb" | "Dom"
type Periodo = "Manhã" | "Tarde" | "Noite"

interface AulaSlot {
    dia: DiaSemana
    periodo: Periodo
    horaInicio: string
    horaFim: string
}

interface FormData {
    // Step 1
    cursoId: string
    cursoNome: string
    codigo: string
    semestre: string
    vagas: string
    status: string
    // Step 2
    slots: AulaSlot[]
    localPadrao: string
    modalidade: string
    dataInicio: string
    dataFim: string
    // Step 3
    docentePrincipal: string
    docenteApoio: string
    coordenador: string
    observacoes: string
}

// ── Dados mock ────────────────────────────────────────────────────────────────
const CURSOS = [
    { id: "course-1",  nome: "Oncologia para Técnicos de Enfermagem" },
    { id: "course-2",  nome: "UTI Adulto — Cuidados Intensivos"       },
    { id: "course-3",  nome: "Feridas, Estomias e Incontinências"      },
    { id: "course-4",  nome: "Enfermagem Oncológica"                   },
    { id: "course-5",  nome: "Pediatria e Neonatologia"                },
    { id: "course-10", nome: "Gestão em Saúde e Liderança"             },
]

const DOCENTES = [
    "Prof.ª Dra. Carla Bezerra",
    "Enf.ª Esp. Renata Lima",
    "Enf.ª Dra. Fátima Saraiva",
    "Enf.ª Esp. Jorge Moutinho",
    "Prof. Dr. Marcos Albuquerque",
    "Enf.ª Ms. Beatriz Novais",
]

const DIAS: DiaSemana[] = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
const PERIODOS: Periodo[] = ["Manhã", "Tarde", "Noite"]

const PERIODO_HORARIO: Record<Periodo, { inicio: string; fim: string }> = {
    "Manhã": { inicio: "08:00", fim: "12:00" },
    "Tarde": { inicio: "13:00", fim: "17:00" },
    "Noite": { inicio: "18:00", fim: "22:00" },
}

// ── Step bar ─────────────────────────────────────────────────────────────────
const STEPS = [
    { label: "Identificação",  icon: <BookOpen className="w-4 h-4" /> },
    { label: "Calendário",     icon: <Calendar className="w-4 h-4" /> },
    { label: "Docentes",       icon: <UserCheck className="w-4 h-4" /> },
    { label: "Revisão",        icon: <GraduationCap className="w-4 h-4" /> },
]

function StepBar({ current }: { current: number }) {
    return (
        <div className="flex items-center gap-0 mb-8">
            {STEPS.map((step, idx) => {
                const done   = idx < current
                const active = idx === current
                return (
                    <div key={idx} className="flex items-center flex-1 last:flex-none">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            active ? "bg-violet-100 text-violet-700" :
                            done   ? "text-green-600" :
                            "text-slate-400"
                        }`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                                active ? "bg-violet-600 text-white" :
                                done   ? "bg-green-100 text-green-600" :
                                "bg-slate-100 text-slate-400"
                            }`}>
                                {done ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span className="hidden sm:block">{step.label}</span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={`flex-1 h-px mx-1 ${idx < current ? "bg-green-300" : "bg-slate-200"}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ── Passo 1: Identificação ────────────────────────────────────────────────────
function Step1({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
    return (
        <div className="space-y-5">
            <div className="space-y-1.5">
                <Label htmlFor="curso">Curso *</Label>
                <select
                    id="curso"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={data.cursoId}
                    onChange={e => {
                        const c = CURSOS.find(x => x.id === e.target.value)
                        onChange("cursoId", e.target.value)
                        onChange("cursoNome", c?.nome ?? "")
                    }}
                >
                    <option value="">Selecionar curso...</option>
                    {CURSOS.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="semestre">Semestre Letivo *</Label>
                    <select
                        id="semestre"
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        value={data.semestre}
                        onChange={e => onChange("semestre", e.target.value)}
                    >
                        <option value="">Selecionar...</option>
                        {["2024.2", "2025.1", "2025.2", "2026.1", "2026.2"].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="codigo">Código da Turma *</Label>
                    <Input
                        id="codigo"
                        placeholder="Ex: T-2026-001"
                        value={data.codigo}
                        onChange={e => onChange("codigo", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="vagas" className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Número de Vagas *
                    </Label>
                    <Input
                        id="vagas"
                        type="number"
                        min={1}
                        placeholder="Ex: 35"
                        value={data.vagas}
                        onChange={e => onChange("vagas", e.target.value)}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="status">Status Inicial *</Label>
                    <select
                        id="status"
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        value={data.status}
                        onChange={e => onChange("status", e.target.value)}
                    >
                        <option value="">Selecionar...</option>
                        <option value="Planejada">Planejada</option>
                        <option value="Inscrições abertas">Inscrições abertas</option>
                        <option value="Em andamento">Em andamento</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

// ── Passo 2: Calendário de Aulas ──────────────────────────────────────────────
function Step2({ data, onChange, slots, setSlots }: {
    data: FormData
    onChange: (k: keyof FormData, v: string) => void
    slots: AulaSlot[]
    setSlots: (s: AulaSlot[]) => void
}) {
    const toggle = (dia: DiaSemana, periodo: Periodo) => {
        const exists = slots.find(s => s.dia === dia && s.periodo === periodo)
        if (exists) {
            setSlots(slots.filter(s => !(s.dia === dia && s.periodo === periodo)))
        } else {
            const h = PERIODO_HORARIO[periodo]
            setSlots([...slots, { dia, periodo, horaInicio: h.inicio, horaFim: h.fim }])
        }
    }

    const isSelected = (dia: DiaSemana, periodo: Periodo) =>
        !!slots.find(s => s.dia === dia && s.periodo === periodo)

    const PERIODO_COLOR: Record<Periodo, string> = {
        "Manhã": "bg-amber-100 border-amber-300 text-amber-700",
        "Tarde": "bg-sky-100 border-sky-300 text-sky-700",
        "Noite": "bg-violet-100 border-violet-300 text-violet-700",
    }

    return (
        <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="inicio">Data de Início *</Label>
                    <Input type="date" id="inicio" value={data.dataInicio} onChange={e => onChange("dataInicio", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="fim">Data de Término</Label>
                    <Input type="date" id="fim" value={data.dataFim} onChange={e => onChange("dataFim", e.target.value)} />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <select
                        id="modalidade"
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                        value={data.modalidade}
                        onChange={e => onChange("modalidade", e.target.value)}
                    >
                        <option value="">Selecionar...</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="EAD">EAD</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="local" className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Local / Sala
                    </Label>
                    <Input
                        id="local"
                        placeholder="Ex: Sala 12 — Bloco B"
                        value={data.localPadrao}
                        onChange={e => onChange("localPadrao", e.target.value)}
                    />
                </div>
            </div>

            {/* Grade semanal interativa */}
            <div>
                <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" /> Grade de Horários Semanais
                </p>
                <p className="text-xs text-slate-400 mb-3">Clique nas células para marcar os dias/horários da turma.</p>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] border-separate border-spacing-1">
                        <thead>
                            <tr>
                                <th className="w-24" />
                                {DIAS.map(d => (
                                    <th key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERIODOS.map(p => (
                                <tr key={p}>
                                    <td className="pr-3">
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-slate-600">{p}</p>
                                            <p className="text-[10px] text-slate-400">{PERIODO_HORARIO[p].inicio}–{PERIODO_HORARIO[p].fim}</p>
                                        </div>
                                    </td>
                                    {DIAS.map(d => {
                                        const selected = isSelected(d, p)
                                        return (
                                            <td key={d} className="text-center">
                                                <button
                                                    onClick={() => toggle(d, p)}
                                                    className={`w-full aspect-square rounded-lg border-2 text-xs font-bold transition-all ${
                                                        selected
                                                            ? PERIODO_COLOR[p] + " shadow-sm scale-95"
                                                            : "border-slate-200 text-slate-300 hover:border-violet-300 hover:text-violet-400 bg-white"
                                                    }`}
                                                >
                                                    {selected ? <Check className="w-3.5 h-3.5 mx-auto" /> : ""}
                                                </button>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {slots.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {slots.map((s, i) => (
                            <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${PERIODO_COLOR[s.periodo]}`}>
                                {s.dia} — {s.periodo} ({s.horaInicio}–{s.horaFim})
                                <button onClick={() => setSlots(slots.filter((_, j) => j !== i))} className="ml-0.5 opacity-60 hover:opacity-100">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Passo 3: Docentes e Observações ──────────────────────────────────────────
function Step3({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
    return (
        <div className="space-y-5">
            <div className="space-y-1.5">
                <Label htmlFor="coord">Coordenador(a) de Curso *</Label>
                <select
                    id="coord"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={data.coordenador}
                    onChange={e => onChange("coordenador", e.target.value)}
                >
                    <option value="">Selecionar...</option>
                    {DOCENTES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="doc1">Docente Principal *</Label>
                <select
                    id="doc1"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={data.docentePrincipal}
                    onChange={e => onChange("docentePrincipal", e.target.value)}
                >
                    <option value="">Selecionar...</option>
                    {DOCENTES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="doc2">Docente de Apoio (opcional)</Label>
                <select
                    id="doc2"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={data.docenteApoio}
                    onChange={e => onChange("docenteApoio", e.target.value)}
                >
                    <option value="">Nenhum</option>
                    {DOCENTES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            {/* Distribuição de carga horária por docente */}
            {data.docentePrincipal && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Distribuição de Carga Horária</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-violet-100 overflow-hidden">
                                <div className="h-full rounded-full bg-violet-600" style={{ width: data.docenteApoio ? "70%" : "100%" }} />
                            </div>
                            <div className="w-32 text-right">
                                <p className="text-xs font-semibold text-slate-700 truncate">{data.docentePrincipal.split(" ").slice(-1)[0]}</p>
                                <p className="text-xs text-violet-600">{data.docenteApoio ? "70%" : "100%"}</p>
                            </div>
                        </div>
                        {data.docenteApoio && (
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 rounded-full bg-blue-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-blue-500" style={{ width: "30%" }} />
                                </div>
                                <div className="w-32 text-right">
                                    <p className="text-xs font-semibold text-slate-700 truncate">{data.docenteApoio.split(" ").slice(-1)[0]}</p>
                                    <p className="text-xs text-blue-600">30%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-1.5">
                <Label htmlFor="obs">Observações Internas</Label>
                <textarea
                    id="obs"
                    rows={3}
                    placeholder="Anotações para a equipe acadêmica, sala especial, equipamentos necessários..."
                    value={data.observacoes}
                    onChange={e => onChange("observacoes", e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
            </div>
        </div>
    )
}

// ── Passo 4: Revisão ─────────────────────────────────────────────────────────
function Step4({ data, slots }: { data: FormData; slots: AulaSlot[] }) {
    const fmtDate = (d: string) => d ? new Date(d + "T12:00").toLocaleDateString("pt-BR") : "—"

    return (
        <div className="space-y-5">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                    Confira todos os dados da turma antes de confirmar a criação.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                    { label: "Curso",          value: data.cursoNome || "—" },
                    { label: "Semestre",       value: data.semestre || "—" },
                    { label: "Código",         value: data.codigo || "—" },
                    { label: "Vagas",          value: data.vagas || "—" },
                    { label: "Status",         value: data.status || "—" },
                    { label: "Modalidade",     value: data.modalidade || "—" },
                    { label: "Início",         value: fmtDate(data.dataInicio) },
                    { label: "Término",        value: fmtDate(data.dataFim) },
                    { label: "Local",          value: data.localPadrao || "—" },
                    { label: "Coordenador",    value: data.coordenador || "—" },
                    { label: "Docente Principal", value: data.docentePrincipal || "—" },
                    { label: "Docente de Apoio",  value: data.docenteApoio || "Nenhum" },
                ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-400 font-medium">{label}</span>
                        <span className="text-slate-700 font-medium">{value}</span>
                    </div>
                ))}

                <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 font-medium">Horários Semanais</span>
                    {slots.length === 0 ? (
                        <p className="text-sm text-slate-400 italic mt-1">Nenhum horário selecionado</p>
                    ) : (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {slots.map((s, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                                    {s.dia} {s.periodo} ({s.horaInicio}–{s.horaFim})
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {data.observacoes && (
                    <div className="sm:col-span-2">
                        <span className="text-xs text-slate-400 font-medium">Observações</span>
                        <p className="text-sm text-slate-600 mt-0.5">{data.observacoes}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function NovaTurmaPage() {
    const [step,      setStep]      = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [slots,     setSlots]     = useState<AulaSlot[]>([])
    const [form, setForm] = useState<FormData>({
        cursoId: "", cursoNome: "", codigo: "", semestre: "", vagas: "", status: "",
        slots: [], localPadrao: "", modalidade: "", dataInicio: "", dataFim: "",
        docentePrincipal: "", docenteApoio: "", coordenador: "", observacoes: "",
    })

    const onChange = (k: keyof FormData, v: string) =>
        setForm(f => ({ ...f, [k]: v }))

    const canNext = () => {
        if (step === 0) return !!form.cursoId && !!form.semestre && !!form.codigo && !!form.vagas && !!form.status
        if (step === 1) return !!form.dataInicio && !!form.modalidade
        if (step === 2) return !!form.coordenador && !!form.docentePrincipal
        return true
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 space-y-5">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Turma criada com sucesso!</h2>
                <p className="text-sm text-slate-500 text-center max-w-sm">
                    <strong className="text-slate-700">{form.cursoNome}</strong> · Turma <strong className="text-slate-700">{form.codigo}</strong> ({form.semestre}) foi cadastrada com {form.vagas} vagas.
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/admin/turmas">Ver Turmas</Link>
                    </Button>
                    <Button className="text-white gap-2" style={{ backgroundColor: "#7c3aed" }} asChild>
                        <Link href="/admin/turmas/nova">
                            <Plus className="w-4 h-4" /> Criar Outra
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/turmas"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Nova Turma</h1>
                    <p className="text-sm text-slate-500">Passo {step + 1} de {STEPS.length}</p>
                </div>
            </div>

            {/* Step indicator */}
            <StepBar current={step} />

            {/* Step card */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
                        {STEPS[step].icon}
                        {STEPS[step].label}
                    </h2>

                    {step === 0 && <Step1 data={form} onChange={onChange} />}
                    {step === 1 && <Step2 data={form} onChange={onChange} slots={slots} setSlots={setSlots} />}
                    {step === 2 && <Step3 data={form} onChange={onChange} />}
                    {step === 3 && <Step4 data={form} slots={slots} />}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 0}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Anterior
                </Button>

                {step < STEPS.length - 1 ? (
                    <Button
                        onClick={() => setStep(s => s + 1)}
                        disabled={!canNext()}
                        className="gap-2 text-white"
                        style={{ backgroundColor: "#7c3aed" }}
                    >
                        Próximo <ArrowRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => setSubmitted(true)}
                        className="gap-2 text-white"
                        style={{ backgroundColor: "#16a34a" }}
                    >
                        <Check className="w-4 h-4" /> Criar Turma
                    </Button>
                )}
            </div>
        </div>
    )
}
