import { getCourseById } from "@/lms/actions/adminCourseActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, PlusCircle, GripVertical, Trash2, Settings, BookOpen, Users, Calendar, DollarSign, Image, ExternalLink, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const COURSE_TYPES = ["Curso Livre","Pós-Graduação","Especialização","Graduação","Residência","Extensão","Capacitação"]
const SCHEDULES    = ["Matutino (08h–12h)","Vespertino (13h–17h)","Noturno (18h–22h)","Matutino e Vespertino","Sábados (08h–17h)","EAD — Assíncrono","Híbrido"]

export default async function EditCursoPage({ params }: { params: Promise<{ cursoId: string }> }) {
    const { cursoId } = await params
    const course = await getCourseById(cursoId)

    if (!course) {
        notFound()
    }

    const installmentPreviews = [1, 3, 6, 10, 12, course.maxInstallments]
        .filter((n, i, arr) => n <= course.maxInstallments && arr.indexOf(n) === i)
        .slice(-4)

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cursos">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-0.5">
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Editar Curso</h2>
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-medium">Publicado</Badge>
                            {course.corenRequired && (
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-medium gap-1">
                                    <AlertTriangle className="w-3 h-3" /> COREN Obrigatório
                                </Badge>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm font-mono">{course.id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href={`/cursos/${course.id}`} target="_blank">
                            <ExternalLink className="w-4 h-4" /> Ver Vitrine
                        </Link>
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 font-semibold gap-2">
                        <Save className="w-4 h-4" /> Salvar Alterações
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Coluna principal ─────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Configurações Gerais */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Settings className="w-4 h-4 text-slate-400" /> Configurações Gerais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">

                            <div className="space-y-2">
                                <Label htmlFor="title">Nome do Curso</Label>
                                <Input id="title" defaultValue={course.title} className="focus-visible:ring-violet-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo / Modalidade</Label>
                                    <Select defaultValue={course.type || "Curso Livre"}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {COURSE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hours">Carga Horária</Label>
                                    <Input id="hours" defaultValue={course.hours} placeholder="Ex.: 360h" className="focus-visible:ring-violet-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição (vitrine)</Label>
                                <Textarea
                                    id="description" defaultValue={course.description}
                                    rows={4} className="resize-none focus-visible:ring-violet-500"
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* Dados Acadêmicos */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" /> Dados Acadêmicos & Calendário
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">

                            <div className="space-y-2">
                                <Label htmlFor="instructor">Docente / Coordenador Responsável</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="instructor" defaultValue={course.instructor}
                                        placeholder="Ex.: Enf.ª Dra. Ana Paula Costa"
                                        className="pl-9 focus-visible:ring-violet-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Turno / Horário</Label>
                                <Select defaultValue={course.schedule || SCHEDULES[0]}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {SCHEDULES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Data de Início</Label>
                                    <Input id="startDate" type="date" defaultValue={course.startDate} className="focus-visible:ring-violet-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Previsão de Término</Label>
                                    <Input id="endDate" type="date" defaultValue={course.endDate} className="focus-visible:ring-violet-500" />
                                </div>
                            </div>

                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked={course.corenRequired}
                                        className="mt-1 accent-violet-600 w-4 h-4"
                                    />
                                    <div>
                                        <span className="font-semibold text-slate-800 text-sm">Exige inscrição ativa no COREN</span>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Se marcado, o número de registro COREN será solicitado e validado na matrícula.
                                        </p>
                                    </div>
                                </label>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Grade Curricular */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-400" /> Grade Curricular
                            </CardTitle>
                            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs font-semibold">
                                <PlusCircle className="w-3.5 h-3.5" /> Adicionar Módulo
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {course.modules.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 font-medium">Nenhum módulo cadastrado.</p>
                                    <p className="text-xs text-slate-400 mt-1">Adicione módulos para estruturar o conteúdo do curso.</p>
                                </div>
                            )}
                            <div className="space-y-3">
                                {course.modules.map((mod, modIdx) => (
                                    <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                        {/* Mod header */}
                                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                                            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab shrink-0" />
                                            <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">
                                                {modIdx + 1}
                                            </div>
                                            <span className="flex-1 font-semibold text-slate-800 text-sm">{mod.title}</span>
                                            <span className="text-xs text-slate-400">{mod.materials.length} material(is)</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        {/* Materials */}
                                        <div className="p-3 space-y-2 bg-white">
                                            {mod.materials.map(mat => (
                                                <div key={mat.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:border-violet-200 transition-colors group">
                                                    <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 text-[10px] font-bold 
                                                        ${mat.type === "PDF"   ? "bg-red-50 text-red-600 border border-red-100"
                                                        : mat.type === "VIDEO" ? "bg-blue-50 text-blue-600 border border-blue-100"
                                                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                                                        {mat.type === "VIDEO" ? "▶" : mat.type}
                                                    </div>
                                                    <span className="flex-1 text-sm text-slate-700 truncate">{mat.title}</span>
                                                    <a href={mat.url} target="_blank" rel="noreferrer" className="text-xs text-violet-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Abrir</a>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-rose-500 shrink-0">
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-slate-500 w-full justify-start border border-dashed border-slate-200 hover:border-violet-300 hover:text-violet-600 mt-1">
                                                <PlusCircle className="w-3.5 h-3.5" /> Adicionar Vídeo / PDF / Link
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Turmas cadastradas */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-400" /> Turmas deste Curso
                            </CardTitle>
                            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs font-semibold" asChild>
                                <Link href="/admin/turmas">
                                    <PlusCircle className="w-3.5 h-3.5" /> Ver / Criar Turmas
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="space-y-2">
                                {[
                                    { code: "2026.1", students: 28, start: "10/03/2026", status: "Em andamento" },
                                    { code: "2025.2", students: 34, start: "15/08/2025", status: "Concluída"     },
                                ].map(t => (
                                    <div key={t.code} className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">Turma {t.code}</p>
                                                <p className="text-xs text-slate-500">Início: {t.start} · {t.students} alunos</p>
                                            </div>
                                        </div>
                                        <Badge className={t.status === "Em andamento"
                                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-none"}>
                                            {t.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* ── Sidebar ───────────────────────────────────────────── */}
                <div className="space-y-5">

                    {/* Precificação */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-slate-400" /> Precificação
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="price">Valor Total (R$)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">R$</span>
                                    <Input id="price" type="number" step="0.01" defaultValue={course.price}
                                        className="pl-9 font-bold text-lg py-5 focus-visible:ring-violet-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Máximo de Parcelas</Label>
                                <Select defaultValue={String(course.maxInstallments || 12)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 6, 8, 10, 12, 18, 24, 36, 48].map(n => (
                                            <SelectItem key={n} value={String(n)}>
                                                {n === 1 ? "Apenas à vista" : `Em até ${n}x`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Preview parcelas */}
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Preview Vitrine</p>
                                <div className="space-y-1">
                                    {installmentPreviews.map(n => (
                                        <div key={n} className={`flex justify-between text-xs px-2.5 py-1.5 rounded ${n === course.maxInstallments ? "bg-violet-50 font-bold text-violet-700" : "text-slate-600"}`}>
                                            <span>{n === 1 ? "À vista" : `${n}x`}</span>
                                            <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(course.price / n)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Imagem de Capa */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Image className="w-4 h-4 text-slate-400" /> Imagem de Capa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {course.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={course.imageUrl} alt="Capa" className="w-full aspect-video object-cover rounded-lg border border-slate-200" />
                            ) : (
                                <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-violet-400 hover:bg-violet-50/30 transition-colors cursor-pointer group">
                                    <Image className="w-7 h-7 mb-1.5 group-hover:text-violet-500" />
                                    <span className="text-xs font-medium">Clique para enviar capa</span>
                                    <span className="text-[10px] mt-0.5">1200×630 px recomendado</span>
                                </div>
                            )}
                            <div className="space-y-1">
                                <Label htmlFor="imageUrl" className="text-xs">URL da imagem</Label>
                                <Input
                                    id="imageUrl" type="url" defaultValue={course.imageUrl ?? ""}
                                    placeholder="https://…"
                                    className="text-xs focus-visible:ring-violet-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Publicação */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Settings className="w-4 h-4 text-slate-400" /> Publicação
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 font-medium">Status</span>
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Publicado</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 font-medium">Matrículas</span>
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Abertas</Badge>
                            </div>
                            <div className="pt-2 space-y-2">
                                <Button className="w-full bg-violet-600 hover:bg-violet-700 gap-2 font-semibold">
                                    <Save className="w-4 h-4" /> Salvar Alterações
                                </Button>
                                <Button variant="outline" className="w-full text-xs text-slate-500 gap-1">
                                    <Trash2 className="w-3.5 h-3.5" /> Arquivar Curso
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, PlusCircle, GripVertical, Trash2, Settings, BookOpen } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditCursoPage({ params }: { params: Promise<{ cursoId: string }> }) {
    const { cursoId } = await params
    const course = await getCourseById(cursoId)

    if (!course) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cursos">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            Editar Curso
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-medium">Publicado</Badge>
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">ID: {course.id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Ver Prévida na Vitrine</Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 font-semibold gap-2">
                        <Save className="w-4 h-4" /> Salvar Curso
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulário Principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-slate-400" /> Configurações Gerais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Nome do Curso</Label>
                                <Input id="title" defaultValue={course.title} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Modalidade</Label>
                                    <Select defaultValue="livre">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="grad">Graduação</SelectItem>
                                            <SelectItem value="pos">Pós-Graduação</SelectItem>
                                            <SelectItem value="livre">Curso Livre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duração Carga Horária</Label>
                                    <Input id="duration" defaultValue="N/A" placeholder="Ex: 360h ou 4 anos" />
                                </div>
                            </div>

                            <div className="space-y-2 pb-4">
                                <Label htmlFor="description">Descrição Curta (Vitrine)</Label>
                                <Textarea
                                    id="description"
                                    defaultValue={course.description}
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-slate-400" /> Grade Curricular
                            </CardTitle>
                            <Button variant="outline" size="sm" className="gap-2 h-8 text-xs font-semibold">
                                <PlusCircle className="w-4 h-4" /> Adicionar Módulo
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {course.modules.length === 0 && (
                                    <p className="text-sm text-slate-500 text-center py-4">Nenhum módulo cadastrado. Adicione um módulo para começar a inserir materiais.</p>
                                )}
                                {course.modules.map((mod) => (
                                    <div key={mod.id} className="flex flex-col gap-2 p-3 border border-slate-200 rounded-lg bg-white group hover:border-violet-300 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="cursor-grab text-slate-300 hover:text-slate-500">
                                                <GripVertical className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 font-semibold text-slate-800">
                                                {mod.title}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {/* Materiais do Módulo */}
                                        <div className="pl-9 space-y-2 mt-2">
                                            {mod.materials && mod.materials.map(mat => (
                                                <div key={mat.id} className="text-sm flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100">
                                                    <span className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px]">{mat.type}</Badge>
                                                        {mat.title}
                                                    </span>
                                                    <a href={mat.url} target="_blank" rel="noreferrer" className="text-xs text-violet-600 hover:underline">Ver</a>
                                                </div>
                                            ))}
                                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-slate-500 w-full justify-start mt-1">
                                                <PlusCircle className="w-3 h-3" /> Adicionar Material (Vídeo/PDF)
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info Financeiro e Imagem */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base">Precificação</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Valor Total (R$)</Label>
                                <Input id="price" type="number" defaultValue={course.price} className="font-semibold text-lg py-6" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="installments">Máximo de Parcelas Permitidas</Label>
                                <Select defaultValue="12">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">À Vista</SelectItem>
                                        <SelectItem value="6">Em até 6x</SelectItem>
                                        <SelectItem value="12">Em até 12x</SelectItem>
                                        <SelectItem value="24">Em até 24x</SelectItem>
                                        <SelectItem value="48">Em até 48x (Graduação)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base">Imagem de Capa</CardTitle>
                        </CardHeader>
                        <div className="p-4">
                            <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-violet-400 transition-colors cursor-pointer group">
                                <PlusCircle className="w-8 h-8 text-slate-400 group-hover:text-violet-500 mb-2" />
                                <span className="text-xs font-medium">Clique para trocar a capa</span>
                                <span className="text-[10px] text-slate-400 mt-1">1200x630px recomendado</span>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    )
}
