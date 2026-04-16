import Link from "next/link"
import { getCourses } from "@/lms/actions/adminCourseActions"
import { PageHeader } from "@/components/layout"
import { EduKpiGrid, LearningPathCard } from "@/components/educacional/dashboard-kit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Layers, PlusCircle } from "lucide-react"

export default async function CursosAdminPage() {
    const courses = await getCourses()

    const gratuitos = courses.filter((c) => c.tipo === "Gratuito").length
    const pagos = courses.filter((c) => (c.tipo ?? "Pago") === "Pago").length
    const totalModulos = courses.reduce((acc, c) => acc + c.modules.length, 0)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestão de cursos"
                description="Estrutura curricular, trilhas e modelo de oferta educacional."
                actions={
                    <Link href="/admin/cursos/novo">
                        <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
                            <PlusCircle className="w-4 h-4" /> Novo curso
                        </Button>
                    </Link>
                }
            />

            <EduKpiGrid
                items={[
                    { label: "Cursos", value: courses.length, hint: "Portfólio ativo", icon: <GraduationCap className="w-4 h-4 text-violet-600" />, tone: "brand" },
                    { label: "Cursos pagos", value: pagos, hint: "Com checkout", icon: <BookOpen className="w-4 h-4 text-blue-600" />, tone: "neutral" },
                    { label: "Cursos gratuitos", value: gratuitos, hint: "Captação e entrada", icon: <BookOpen className="w-4 h-4 text-emerald-600" />, tone: "success" },
                    { label: "Módulos", value: totalModulos, hint: "Carga curricular total", icon: <Layers className="w-4 h-4 text-amber-600" />, tone: "warning" },
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-slate-200 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Catálogo acadêmico</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {courses.map((course) => (
                            <div key={course.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{course.title}</p>
                                    <p className="text-xs text-slate-500">{course.modules.length} módulo(s) · R$ {course.price.toFixed(2).replace(".", ",")}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Badge variant="outline">{course.tipo ?? "Pago"}</Badge>
                                    <Link href={`/admin/cursos/${course.id}`} className="text-xs font-medium text-violet-600 hover:text-violet-700">Editar</Link>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <LearningPathCard
                    title="Estratégia de trilhas"
                    modules={[
                        { id: "ca1", title: "Fundamentos (entrada)", progress: 100, status: "Concluído" },
                        { id: "ca2", title: "Trilhas técnicas", progress: 70, status: "Em andamento" },
                        { id: "ca3", title: "Projetos finais", progress: 30, status: "Pendente" },
                    ]}
                />
            </div>
        </div>
    )
}
