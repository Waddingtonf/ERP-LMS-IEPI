import { getStudentDashboardData } from "@/lms/actions/studentActions"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, Clock, CheckCircle, BookOpen } from "lucide-react"
import Link from "next/link"

export default async function StudentDashboard() {
    // Fetch mock data using our server action
    const { user, enrollments } = await getStudentDashboardData();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Bem-vindo(a) de volta, {user.name.split(' ')[0]}!</h2>
                <p className="text-slate-500 mt-1">Continue de onde parou e acompanhe seu progresso.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Resumo Financeiro Curto */}
                <Card className="bg-gradient-to-br from-violet-600 to-indigo-800 text-white border-none shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-violet-100 flex justify-between items-center">
                            Próxima Mensalidade
                            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">10 Fev</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2">R$ 0,00</div>
                        <p className="text-violet-200 text-sm mt-1">Sandbox</p>
                    </CardContent>
                    <CardFooter>
                        <button className="w-full bg-white text-violet-900 font-semibold py-2 rounded-lg text-sm hover:bg-slate-100 transition-colors">
                            Código Pix Automático
                        </button>
                    </CardFooter>
                </Card>

                {/* Status Acadêmico */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-700">Mural de Avisos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex gap-4 items-start border-l-2 border-emerald-400 pl-3">
                            <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">Bem-vindo(a) ao Sandbox</p>
                                <p className="text-xs text-slate-500 mt-0.5">Compre um curso na página pública para simular o checkout.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="mt-12">
                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-violet-600" /> Meus Cursos
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {enrollments.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
                            <h4 className="text-lg font-medium text-slate-700 mb-2">Você ainda não tem cursos</h4>
                            <p className="text-slate-500 text-sm mb-6">Acesse a página de compra e matricule-se usando a integração do CIELO.</p>
                            <Link href="/checkout/course-1">
                                <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                                    Simular Compra
                                </button>
                            </Link>
                        </div>
                    )}
                    {enrollments.map((enrollment) => (
                        <Card key={enrollment.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                            <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative">
                                <img src={enrollment.thumbnail} alt={enrollment.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                                    {enrollment.type}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col p-6">
                                <h4 className="font-bold text-lg text-slate-900 leading-tight mb-2">{enrollment.title}</h4>

                                <div className="mt-auto space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                                            <span>Progresso Geral</span>
                                            <span>{enrollment.progress}%</span>
                                        </div>
                                        <Progress value={enrollment.progress} className="h-2 bg-slate-100" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                        <div className="text-sm">
                                            <span className="text-slate-500 block text-xs">Último Acesso</span>
                                            <span className="font-medium text-slate-700 truncate max-w-[200px] block" title={enrollment.lastAccessed}>
                                                {enrollment.lastAccessed}
                                            </span>
                                        </div>

                                        {enrollment.progress < 100 ? (
                                            <Link href={`/aluno/aulas/${enrollment.courseId}`}>
                                                <button className="flex items-center justify-center gap-2 bg-violet-100 hover:bg-violet-200 text-violet-800 px-4 py-2 rounded-md text-sm font-semibold transition-colors w-full sm:w-auto">
                                                    <PlayCircle className="w-4 h-4" />
                                                    Continuar
                                                </button>
                                            </Link>
                                        ) : (
                                            <button className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-md text-sm font-semibold w-full sm:w-auto cursor-default">
                                                <CheckCircle className="w-4 h-4" />
                                                Concluído
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
