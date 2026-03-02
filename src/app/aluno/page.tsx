import { getStudentDashboardData } from "@/lms/actions/studentActions"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, CheckCircle, BookOpen, Flame, Trophy, Zap, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

export default async function StudentDashboard() {
    const { user, enrollments } = await getStudentDashboardData();
    const firstName = user.name.split(' ')[0];
    const completedCount = enrollments.filter(e => e.progress === 100).length;
    const inProgressCount = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    const nextCourse = enrollments.find(e => e.progress < 100);

    return (
        <div className="space-y-8">
            {/* Hero Greeting */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900 p-8 text-white shadow-xl">
                {/* Decorative blobs */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-violet-300 text-sm font-medium mb-1 tracking-wide uppercase">Área Acadêmica · IEPI</p>
                            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                                Olá, {firstName}! 👋
                            </h1>
                            <p className="text-violet-200 mt-2 text-base font-light">Continue sua jornada de aprendizado hoje.</p>
                        </div>
                        {/* Streak badge */}
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 text-center">
                            <Flame className="w-7 h-7 text-orange-400 mx-auto mb-1" />
                            <div className="text-2xl font-bold">7</div>
                            <div className="text-[11px] text-violet-300 font-medium uppercase tracking-wider">Dias seguidos</div>
                        </div>
                    </div>
                    {/* Quick stats */}
                    <div className="flex flex-wrap gap-6 mt-8">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-violet-200" />
                            </div>
                            <span className="text-violet-200">{enrollments.length} curso{enrollments.length !== 1 ? 's' : ''} matriculado{enrollments.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-violet-200">{completedCount} concluído{completedCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-yellow-300" />
                            </div>
                            <span className="text-violet-200">{inProgressCount} em andamento</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Up + Financial Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Next up card */}
                {nextCourse ? (
                    <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-indigo-500 rounded-l-2xl" />
                        <div className="pl-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                    <Zap className="w-3 h-3" /> Próxima Aula
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">{nextCourse.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">{nextCourse.lastAccessed}</p>
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                                    <span>Progresso</span>
                                    <span className="text-violet-600 font-semibold">{nextCourse.progress}%</span>
                                </div>
                                <Progress value={nextCourse.progress} className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500" />
                            </div>
                        </div>
                        <Link href={`/aluno/aulas/${nextCourse.courseId}`}>
                            <button className="mt-2 w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all duration-200 shadow-sm shadow-violet-200">
                                <PlayCircle className="w-4 h-4" /> Continuar Aprendendo
                                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="md:col-span-2 rounded-2xl border-2 border-dashed border-violet-100 bg-violet-50/50 p-8 flex flex-col items-center justify-center text-center">
                        <BookOpen className="w-10 h-10 text-violet-300 mb-3" />
                        <h3 className="text-base font-semibold text-slate-700 mb-1">Nenhum curso em andamento</h3>
                        <p className="text-sm text-slate-500 mb-4">Explore nosso catálogo e comece sua jornada.</p>
                        <Link href="/cursos">
                            <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors">
                                Ver Cursos
                            </button>
                        </Link>
                    </div>
                )}

                {/* Financial summary */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white flex flex-col justify-between shadow-md">
                    <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Próximo Vencimento</p>
                        <div className="text-2xl font-bold mb-1">R$ 133,25</div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>10 de Fev · 2026</span>
                        </div>
                    </div>
                    <Link href="/aluno/financeiro">
                        <button className="mt-4 w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all">
                            Ver Financeiro
                        </button>
                    </Link>
                </div>
            </div>

            {/* Mural de Avisos */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 flex items-start gap-4 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">Bem-vindo(a) ao Sandbox IEPI</p>
                    <p className="text-sm text-slate-500 mt-0.5">Simule o checkout via CIELO na p\u00e1gina de cursos para testar a matr\u00edcula completa.</p>
                </div>
                <Link href="/cursos" className="ml-auto shrink-0">
                    <button className="text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                        Ver Cursos
                    </button>
                </Link>
            </div>

            {/* Meus Cursos */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-violet-600" /> Meus Cursos
                    </h2>
                    {enrollments.length > 0 && (
                        <span className="text-sm text-slate-500">{enrollments.length} matrícula{enrollments.length !== 1 ? 's' : ''}</span>
                    )}
                </div>

                {enrollments.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-14 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-violet-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Nenhuma matrícula ativa</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-sm">Explore nosso catálogo e adquira seu primeiro curso com pagamento via CIELO Sandbox.</p>
                        <Link href="/checkout/course-1">
                            <button className="bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all shadow-sm shadow-violet-200">
                                Simular Compra
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {enrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row"
                            >
                                <div className="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 overflow-hidden">
                                    <img
                                        src={enrollment.thumbnail}
                                        alt={enrollment.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r" />
                                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        {enrollment.type}
                                    </div>
                                </div>
                                <div className="flex-1 p-5 flex flex-col">
                                    <h4 className="font-bold text-base text-slate-900 leading-snug mb-1 line-clamp-2">{enrollment.title}</h4>
                                    <p className="text-xs text-slate-500 mb-auto">Iniciado: {enrollment.lastAccessed}</p>

                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <div className="flex justify-between items-center text-xs mb-1.5">
                                                <span className="text-slate-500 font-medium">Progresso</span>
                                                <span className="text-violet-600 font-bold">{enrollment.progress}%</span>
                                            </div>
                                            <Progress
                                                value={enrollment.progress}
                                                className="h-1.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500 [&>div]:transition-all [&>div]:duration-700"
                                            />
                                        </div>

                                        {enrollment.progress < 100 ? (
                                            <Link href={`/aluno/aulas/${enrollment.courseId}`} className="block">
                                                <button className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                                                    <PlayCircle className="w-4 h-4" />
                                                    Continuar
                                                </button>
                                            </Link>
                                        ) : (
                                            <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold py-2.5 rounded-xl">
                                                <CheckCircle className="w-4 h-4" />
                                                Concluído
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Achievement Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" /> Conquistas
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: "🎯", label: "Primeiro Login", earned: true },
                        { icon: "🔥", label: "7 dias seguidos", earned: true },
                        { icon: "📚", label: "5 aulas", earned: false },
                        { icon: "🏆", label: "1° Certificado", earned: false },
                    ].map((badge) => (
                        <div
                            key={badge.label}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
                                badge.earned
                                    ? "border-amber-200 bg-amber-50 shadow-sm"
                                    : "border-slate-200 bg-slate-50 opacity-50 grayscale"
                            }`}
                        >
                            <span className="text-2xl">{badge.icon}</span>
                            <span className={`text-xs font-semibold ${
                                badge.earned ? "text-amber-800" : "text-slate-500"
                            }`}>{badge.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}