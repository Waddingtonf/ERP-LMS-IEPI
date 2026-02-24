import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, Clock, Users } from "lucide-react"
import Link from "next/link"

const allCourses = [
    ...Array.from({ length: 6 }).map((_, i) => ({
        id: `${i + 1}`,
        title: ["Gestão de RH", "Atendimento", "Administração", "Análise de Dados", "Marketing Digital", "Pedagogia"][i],
        description: "Curso completo preparado com as necessidades do mercado atual.",
        type: ["Pós-Graduação", "Curso Livre", "Graduação", "Curso Livre", "Pós-Graduação", "Graduação"][i],
        duration: ["360h", "40h", "4 anos", "120h", "360h", "4 anos"][i],
        price: [1599, 299, 350, 499, 1899, 299][i],
        installments: [12, 3, 48, 6, 12, 48][i],
        imageUrl: `https://images.unsplash.com/photo-${[
            "1542744173-8e7e53415bb0", "1556742049-0cfed4f6a45d", "1522071820081-009f0129c71c",
            "1551288049-bebda4e38f71", "1432888496621-0a56208a8a25", "1509062522246-37559e35bbdb"
        ][i]}?q=80&w=600&auto=format&fit=crop`
    }))
]

export default function CursosPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            <section className="bg-white border-b border-slate-200 py-12">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Escolha seu próximo passo</h1>
                    <p className="text-slate-600 mb-8">
                        Explore nossa grade completa e encontre a formação perfeita para impulsionar sua carreira.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <Input placeholder="Buscar por nome do curso..." className="pl-10 h-12 text-base" />
                        </div>
                        <div className="w-full sm:w-48 shrink-0">
                            <Select defaultValue="all">
                                <SelectTrigger className="h-12 bg-slate-50">
                                    <SelectValue placeholder="Modalidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os tipos</SelectItem>
                                    <SelectItem value="grad">Graduação</SelectItem>
                                    <SelectItem value="pos">Pós-Graduação</SelectItem>
                                    <SelectItem value="livre"> Cursos Livres</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-4 flex-1">
                <div className="container mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allCourses.map((course) => (
                            <Card key={course.id} className="overflow-hidden border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
                                <div className="h-40 relative w-full shrink-0">
                                    <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full" />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                                            {course.type}
                                        </span>
                                    </div>
                                </div>

                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg text-slate-900 leading-tight">{course.title}</CardTitle>
                                    <CardDescription className="text-xs line-clamp-2 mt-1">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-4 pt-2 flex-1">
                                    <div className="space-y-2 text-xs text-slate-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-violet-500" />
                                            {course.duration}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                                            EaD 100% Online
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0 flex flex-col gap-3 mt-auto">
                                    <div className="flex justify-between items-end w-full border-t border-slate-100 pt-3">
                                        <span className="text-[10px] text-slate-500 font-semibold uppercase">
                                            {course.installments > 1 ? `${course.installments}x Sem Juros` : 'À Vista'}
                                        </span>
                                        <span className="text-lg font-bold text-violet-700">
                                            R$ {(course.price / course.installments).toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                    <Link href={`/checkout/${course.id}`} className="w-full">
                                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm" size="sm">
                                            Detalhes da Matrícula
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </div>
            </section>

        </div>
    )
}
