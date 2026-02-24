import { getCourseById } from "@/lms/actions/adminCourseActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, PlusCircle, GripVertical, Trash2, Settings, BookOpen } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditCursoPage({ params }: { params: { cursoId: string } }) {
    const course = await getCourseById(params.cursoId)

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
