import { getCourses } from "@/lms/actions/adminCourseActions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, MoreHorizontal, Copy, Trash2, GraduationCap, Clock } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function CursosAdminPage() {
    // Fetch courses from our mock repository via server action
    const courses = await getCourses()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gestão de Cursos</h2>
                    <p className="text-slate-500 mt-1">Crie, edite e gerencie a grade curricular e valores dos cursos do LMS.</p>
                </div>
                <Link href="/admin/cursos/novo">
                    <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
                        <GraduationCap className="w-5 h-5" /> Novo Curso
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Curso</TableHead>
                            <TableHead>Modalidade / Duração</TableHead>
                            <TableHead>Estrutura</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>
                                    <div className="font-semibold text-slate-900">{course.title}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">{course.id}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-slate-700 flex items-center gap-1.5 font-medium">
                                        Online
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> N/A
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">
                                    <div className="flex items-center gap-4">
                                        <span title="Matriculados">👥 0</span>
                                        <span title="Módulos">📚 {course.modules.length}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm font-semibold text-slate-800">
                                    R$ {course.price.toFixed(2).replace('.', ',')}
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-medium">
                                        Ativo
                                    </Badge>
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
                                            <DropdownMenuLabel>Ações do Curso</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/cursos/${course.id}`} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" /> Editar Estrutura
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Copy className="mr-2 h-4 w-4" /> Duplicar Curso
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50">
                                                <Trash2 className="mr-2 h-4 w-4" /> Arquivar Curso
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {courses.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Nenhum curso encontrado com estes filtros.</div>
                )}
            </div>
        </div>
    )
}
