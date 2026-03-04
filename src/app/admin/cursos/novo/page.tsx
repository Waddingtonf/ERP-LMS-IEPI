"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCourseAction } from "@/lms/actions/adminCourseActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, GraduationCap, Save, BookOpen, DollarSign, Settings, CheckCircle, LayoutList, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

const STEPS = [
    { id: 1, label: "Identificação",  icon: Settings   },
    { id: 2, label: "Conteúdo",       icon: BookOpen   },
    { id: 3, label: "Grade Curricular", icon: LayoutList },
    { id: 4, label: "Comercial",      icon: DollarSign },
    { id: 5, label: "Revisão",        icon: CheckCircle },
]

const COURSE_TYPES = [
    "Curso Livre",
    "Pós-Graduação",
    "Especialização",
    "Graduação",
    "Residência",
    "Extensão",
    "Capacitação",
]

const SCHEDULES = [
    "Matutino (08h–12h)",
    "Vespertino (13h–17h)",
    "Noturno (18h–22h)",
    "Matutino e Vespertino",
    "Sábados (08h–17h)",
    "EAD — Assíncrono",
    "Híbrido",
]

interface Modulo {
    id: string
    nome: string
    cargaHoraria: number
    disciplinas: string[]
}

type FormState = {
    title: string
    type: string
    description: string
    instructor: string
    hours: string
    schedule: string
    startDate: string
    endDate: string
    corenRequired: boolean
    price: string
    maxInstallments: string
    imageUrl: string
    vagas: string
    bolsas: string
    percentualBolsa: string
}

const EMPTY: FormState = {
    title: "", type: "", description: "",
    instructor: "", hours: "", schedule: "",
    startDate: "", endDate: "",
    corenRequired: false,
    price: "", maxInstallments: "12", imageUrl: "",
    vagas: "", bolsas: "0", percentualBolsa: "50",
}

export default function NovoCursoPage() {
    const router = useRouter()
    const [step, setStep]     = useState(1)
    const [form, setForm]     = useState<FormState>(EMPTY)
    const [modulos, setModulos] = useState<Modulo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError]   = useState<string | null>(null)

    const addModulo = () => setModulos(m => [...m, { id: `m${Date.now()}`, nome: "", cargaHoraria: 0, disciplinas: [""] }])
    const removeModulo = (id: string) => setModulos(m => m.filter(x => x.id !== id))
    const updateModulo = (id: string, field: keyof Modulo, value: string | number | string[]) =>
        setModulos(m => m.map(x => x.id === id ? { ...x, [field]: value } : x))
    const addDisciplina = (mid: string) => {
        const mo = modulos.find(x => x.id === mid)!;
        updateModulo(mid, "disciplinas", [...mo.disciplinas, ""])
    }
    const removeDisciplina = (mid: string, idx: number) => {
        const mo = modulos.find(x => x.id === mid)!;
        updateModulo(mid, "disciplinas", mo.disciplinas.filter((_, i) => i !== idx))
    }
    const updateDisciplina = (mid: string, idx: number, val: string) => {
        const mo = modulos.find(x => x.id === mid)!;
        const discs = [...mo.disciplinas]; discs[idx] = val;
        updateModulo(mid, "disciplinas", discs)
    }

    const set = (k: keyof FormState) => (v: string | boolean) =>
        setForm(f => ({ ...f, [k]: v }))

    const fieldStr = (k: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k)(e.target.value)

    async function handleSubmit() {
        setLoading(true)
        setError(null)
        try {
            const fd = new FormData()
            Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)))
            await createCourseAction(fd)
            router.push("/admin/cursos")
        } catch {
            setError("Não foi possível criar o curso. Tente novamente.")
            setLoading(false)
        }
    }

    const canProceed = () => {
        if (step === 1) return !!form.title && !!form.type
        if (step === 2) return !!form.instructor && !!form.hours && !!form.schedule && !!form.startDate
        if (step === 4) return !!form.price && !!form.vagas
        return true
    }

    const priceNum = parseFloat(form.price) || 0
    const installNum = parseInt(form.maxInstallments) || 1
    const installValue = installNum > 0 ? priceNum / installNum : priceNum

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/cursos">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <GraduationCap className="w-7 h-7 text-violet-600" />
                        Novo Curso
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Preencha todas as informações do curso. Módulos e materiais serão adicionados após a criação.
                    </p>
                </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-0">
                {STEPS.map((s, i) => {
                    const Icon = s.icon
                    const active   = step === s.id
                    const complete  = step > s.id
                    return (
                        <div key={s.id} className="flex items-center flex-1 last:flex-none">
                            <button
                                onClick={() => complete && setStep(s.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                    active   ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                                    : complete ? "text-violet-600 cursor-pointer hover:bg-violet-50"
                                    : "text-slate-400 cursor-default"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5 shrink-0" />
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-px mx-1 ${step > s.id ? "bg-violet-300" : "bg-slate-200"}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Step content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                {/* ─── STEP 1: Identificação ─────────────────────────────── */}
                {step === 1 && (
                    <div className="p-8 space-y-6">
                        <div className="pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Identificação do Curso</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Dados básicos que identificam o curso no sistema e na vitrine.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="font-semibold text-slate-700">
                                Título do Curso <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title" value={form.title} onChange={fieldStr("title")}
                                placeholder="Ex.: Pós-Graduação em Gestão Hospitalar"
                                className="focus-visible:ring-violet-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type" className="font-semibold text-slate-700">
                                Tipo / Modalidade <span className="text-red-500">*</span>
                            </Label>
                            <Select value={form.type} onValueChange={set("type")}>
                                <SelectTrigger id="type" className="focus:ring-violet-500">
                                    <SelectValue placeholder="Selecione o tipo de curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COURSE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-semibold text-slate-700">Descrição (vitrine)</Label>
                            <Textarea
                                id="description" value={form.description} onChange={fieldStr("description")}
                                placeholder="Descreva objetivos, público-alvo, diferenciais e resultados esperados…"
                                rows={5} className="resize-none focus-visible:ring-violet-500"
                            />
                            <p className="text-xs text-slate-400">{form.description.length}/800 caracteres</p>
                        </div>
                    </div>
                )}

                {/* ─── STEP 2: Conteúdo / Estrutura Acadêmica ───────────── */}
                {step === 2 && (
                    <div className="p-8 space-y-6">
                        <div className="pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Estrutura Acadêmica</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Informações pedagógicas, docente responsável e calendário.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructor" className="font-semibold text-slate-700">
                                Docente / Coordenador Responsável <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="instructor" value={form.instructor} onChange={fieldStr("instructor")}
                                placeholder="Ex.: Enf.ª Dra. Ana Paula Costa"
                                className="focus-visible:ring-violet-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hours" className="font-semibold text-slate-700">
                                    Carga Horária Total <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="hours" value={form.hours} onChange={fieldStr("hours")}
                                    placeholder="Ex.: 360h"
                                    className="focus-visible:ring-violet-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schedule" className="font-semibold text-slate-700">
                                    Turno / Horário <span className="text-red-500">*</span>
                                </Label>
                                <Select value={form.schedule} onValueChange={set("schedule")}>
                                    <SelectTrigger id="schedule">
                                        <SelectValue placeholder="Selecione o turno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCHEDULES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="font-semibold text-slate-700">
                                    Data de Início <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="startDate" type="date" value={form.startDate} onChange={fieldStr("startDate")}
                                    className="focus-visible:ring-violet-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="font-semibold text-slate-700">Previsão de Término</Label>
                                <Input
                                    id="endDate" type="date" value={form.endDate} onChange={fieldStr("endDate")}
                                    className="focus-visible:ring-violet-500"
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.corenRequired}
                                    onChange={e => set("corenRequired")(e.target.checked)}
                                    className="mt-1 accent-violet-600 w-4 h-4"
                                />
                                <div>
                                    <span className="font-semibold text-slate-800 text-sm">
                                        Exige inscrição ativa no COREN
                                    </span>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Marque se o curso destina-se exclusivamente a profissionais com registro no Conselho Regional de Enfermagem. O número do COREN será solicitado na matrícula.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {/* ─── STEP 3: Grade Curricular ──────────────────────────── */}
                {step === 3 && (
                    <div className="p-8 space-y-5">
                        <div className="pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Grade Curricular</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Organize o curso em módulos e liste as disciplinas de cada um.</p>
                        </div>

                        {modulos.length === 0 && (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                                <LayoutList className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">Nenhum módulo adicionado ainda.</p>
                                <p className="text-slate-400 text-xs mt-1">Clique em "Adicionar Módulo" para começar.</p>
                            </div>
                        )}

                        {modulos.map((modulo, mIdx) => (
                            <div key={modulo.id} className="rounded-xl border border-slate-200 p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                                        {mIdx + 1}
                                    </div>
                                    <input
                                        placeholder="Nome do módulo"
                                        value={modulo.nome}
                                        onChange={e => updateModulo(modulo.id, "nome", e.target.value)}
                                        className="flex-1 h-9 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                                    />
                                    <input
                                        type="number" min={0} placeholder="CH"
                                        value={modulo.cargaHoraria || ""}
                                        onChange={e => updateModulo(modulo.id, "cargaHoraria", Number(e.target.value))}
                                        className="w-20 h-9 rounded-md border border-slate-200 px-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                                    />
                                    <span className="text-xs text-slate-400">h</span>
                                    <button onClick={() => removeModulo(modulo.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="pl-10 space-y-1.5">
                                    <p className="text-xs font-semibold text-slate-400 uppercase">Disciplinas</p>
                                    {modulo.disciplinas.map((d, dIdx) => (
                                        <div key={dIdx} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-violet-300 ml-1 shrink-0" />
                                            <input
                                                placeholder={`Disciplina ${dIdx + 1}`}
                                                value={d}
                                                onChange={e => updateDisciplina(modulo.id, dIdx, e.target.value)}
                                                className="flex-1 h-8 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                                            />
                                            <button onClick={() => removeDisciplina(modulo.id, dIdx)} className="p-1 text-slate-300 hover:text-red-400 rounded">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addDisciplina(modulo.id)} className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 mt-1">
                                        <Plus className="w-3 h-3" /> Adicionar disciplina
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addModulo}
                            className="w-full py-2.5 rounded-xl border-2 border-dashed border-violet-300 text-violet-600 text-sm font-medium hover:bg-violet-50 hover:border-violet-400 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Adicionar Módulo
                        </button>
                    </div>
                )}

                {/* ─── STEP 4: Comercial / Precificação ─────────────────── */}
                {step === 4 && (
                    <div className="p-8 space-y-6">
                        <div className="pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Configuração Comercial</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Precificação, parcelamento e imagem de capa para a vitrine.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="font-semibold text-slate-700">
                                    Valor Total (R$) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">R$</span>
                                    <Input
                                        id="price" type="number" min="0" step="0.01"
                                        value={form.price} onChange={fieldStr("price")}
                                        placeholder="1599.00"
                                        className="pl-9 focus-visible:ring-violet-500 font-semibold text-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxInstallments" className="font-semibold text-slate-700">
                                    Máximo de Parcelas
                                </Label>
                                <Select value={form.maxInstallments} onValueChange={set("maxInstallments")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 6, 8, 10, 12, 18, 24, 36, 48].map(n => (
                                            <SelectItem key={n} value={String(n)}>
                                                {n === 1 ? "Apenas à vista" : `Em até ${n}x`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Installment preview */}
                        {priceNum > 0 && (
                            <div className="rounded-lg bg-violet-50 border border-violet-100 p-4">
                                <p className="text-xs font-bold text-violet-700 uppercase tracking-widest mb-3">
                                    Preview de Parcelamento na Vitrine
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 6, 10, 12, 18, 24, 36, 48]
                                        .filter(n => n <= installNum)
                                        .slice(-4)
                                        .map(n => (
                                            <div key={n} className={`flex-1 min-w-[8rem] rounded-lg border p-3 text-center ${n === installNum ? "bg-violet-600 border-transparent text-white" : "bg-white border-violet-200 text-slate-700"}`}>
                                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">
                                                    {n === 1 ? "À vista" : `${n}x`}
                                                </p>
                                                <p className="text-base font-extrabold">
                                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceNum / n)}
                                                </p>
                                                {n > 1 && <p className="text-[9px] opacity-60 mt-0.5">sem juros</p>}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {/* Vagas e Bolsas */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vagas" className="font-semibold text-slate-700">Vagas <span className="text-red-500">*</span></Label>
                                <input
                                    id="vagas" type="number" min={1} placeholder="Ex: 35"
                                    value={form.vagas} onChange={e => setForm(f => ({ ...f, vagas: e.target.value }))}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bolsas" className="font-semibold text-slate-700">Bolsas Disponíveis</Label>
                                <input
                                    id="bolsas" type="number" min={0} placeholder="Ex: 5"
                                    value={form.bolsas} onChange={e => setForm(f => ({ ...f, bolsas: e.target.value }))}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pctBolsa" className="font-semibold text-slate-700">% Desconto Bolsa</Label>
                                <input
                                    id="pctBolsa" type="number" min={0} max={100} placeholder="Ex: 50"
                                    value={form.percentualBolsa} onChange={e => setForm(f => ({ ...f, percentualBolsa: e.target.value }))}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl" className="font-semibold text-slate-700">
                                URL da Imagem de Capa
                            </Label>
                            <Input
                                id="imageUrl" type="url" value={form.imageUrl} onChange={fieldStr("imageUrl")}
                                placeholder="https://example.com/imagem-capa.jpg"
                                className="focus-visible:ring-violet-500"
                            />
                            <p className="text-xs text-slate-400">
                                Dimensões recomendadas: 1200×630 px. Formatos: JPG, PNG, WebP.
                            </p>
                            {form.imageUrl && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 aspect-video w-52">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── STEP 5: Revisão ──────────────────────────────────── */}
                {step === 5 && (
                    <div className="p-8 space-y-6">
                        <div className="pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">Revisão Final</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Confira todos os dados antes de criar o curso.</p>
                        </div>

                        {[
                            { label: "Título",           value: form.title },
                            { label: "Tipo",             value: form.type },
                            { label: "Docente",          value: form.instructor },
                            { label: "Carga horária",    value: form.hours },
                            { label: "Turno",            value: form.schedule },
                            { label: "Início",           value: form.startDate ? new Date(form.startDate + "T12:00").toLocaleDateString("pt-BR") : "—" },
                            { label: "Término",          value: form.endDate   ? new Date(form.endDate   + "T12:00").toLocaleDateString("pt-BR") : "—" },
                            { label: "COREN obrigatório", value: form.corenRequired ? "Sim" : "Não" },
                            { label: "Valor total",      value: priceNum ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceNum) : "—" },
                            { label: "Parcelamento",     value: installNum === 1 ? "À vista" : `Em até ${installNum}x de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(installValue)}` },
                        ].map(row => (
                            <div key={row.label} className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-none">
                                <span className="text-sm font-semibold text-slate-500 w-44 shrink-0">{row.label}</span>
                                <span className="text-sm text-slate-800 text-right">{row.value || <span className="text-slate-400 italic">Não informado</span>}</span>
                            </div>
                        ))}

                        {form.description && (
                            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Descrição</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{form.description}</p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between gap-3">
                    <div>
                        {step > 1 && (
                            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> Anterior
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/cursos">
                            <Button variant="ghost" className="text-slate-400 text-xs">Cancelar</Button>
                        </Link>
                        {step < 5 ? (
                            <Button
                                onClick={() => setStep(s => s + 1)}
                                disabled={!canProceed()}
                                className="bg-violet-600 hover:bg-violet-700 gap-2"
                            >
                                Próximo <ArrowRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-6"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? "Criando…" : "Criar Curso"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
