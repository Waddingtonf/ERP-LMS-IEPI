import { getStudentDashboardData } from "@/lms/actions/studentActions"
import { getCalendarioAcademico } from "@/lms/actions/calendarioActions"
import { getNotasByAluno } from "@/lms/actions/notaActions"
import { getCertificadosAluno } from "@/lms/actions/certificadoActions"
import { Progress } from "@/components/ui/progress"
import {
    PlayCircle, CheckCircle, BookOpen, Flame, Trophy, Zap, ArrowRight, Clock,
    CalendarDays, FileText, Award, CreditCard, User, LayoutGrid,
    ChevronRight, GraduationCap, Paperclip, Star,
} from "lucide-react"
import Link from "next/link"

/* ─── helpers ─────────────────────────────────────────────── */
const TIPO_COLOR: Record<string, string> = {
    Prova:      "bg-red-100 text-red-700",
    Entrega:    "bg-amber-100 text-amber-700",
    Aula:       "bg-blue-100 text-blue-700",
    Feriado:    "bg-slate-100 text-slate-600",
    Evento:     "bg-violet-100 text-violet-700",
    default:    "bg-slate-100 text-slate-600",
};
function tipoClass(tipo: string) { return TIPO_COLOR[tipo] ?? TIPO_COLOR.default; }

function gradeColor(media: number) {
    if (media >= 7) return "text-emerald-600";
    if (media >= 5) return "text-amber-600";
    return "text-red-600";
}

/* ─── quick-access section config ────────────────────────── */
const QUICK_LINKS = [
    { href: "/aluno/aulas", icon: PlayCircle,    label: "Minhas Aulas",  desc: "Acesse o conteúdo",    color: "text-violet-600", bg: "bg-violet-50" },
    { href: "/aluno/materiais", icon: Paperclip, label: "Materiais",     desc: "PDFs & recursos",      color: "text-blue-600",   bg: "bg-blue-50"   },
    { href: "/aluno/notas", icon: Star,          label: "Notas",         desc: "Boletim & avaliações", color: "text-amber-600",  bg: "bg-amber-50"  },
    { href: "/aluno/calendario", icon: CalendarDays, label: "Calendário", desc: "Provas & eventos",    color: "text-teal-600",   bg: "bg-teal-50"   },
    { href: "/aluno/historico", icon: GraduationCap, label: "Histórico", desc: "Matrículas & grades",  color: "text-indigo-600", bg: "bg-indigo-50" },
    { href: "/aluno/certificados", icon: Award,  label: "Certificados",  desc: "Emitir & baixar",      color: "text-emerald-600", bg: "bg-emerald-50"},
    { href: "/aluno/financeiro", icon: CreditCard, label: "Financeiro",  desc: "Parcelas & boletos",   color: "text-rose-600",   bg: "bg-rose-50"   },
    { href: "/aluno/perfil", icon: User,         label: "Meu Perfil",    desc: "Dados cadastrais",     color: "text-slate-600",  bg: "bg-slate-100" },
];

/* ─── page ────────────────────────────────────────────────── */
export default async function StudentDashboard() {
    const [
        { user, enrollments },
        eventos,
        todasNotas,
        certificados,
    ] = await Promise.all([
        getStudentDashboardData(),
        getCalendarioAcademico(),
        getNotasByAluno(),
        getCertificadosAluno(),
    ]);

    const firstName        = user.name.split(' ')[0];
    const completedCount   = enrollments.filter(e => e.progress === 100).length;
    const inProgressCount  = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    const nextCourse       = enrollments.find(e => e.progress < 100);
    const certEmitidos     = certificados.filter(c => c.status === "Emitido").length;

    const today      = new Date();
    today.setHours(0,0,0,0);
    const proximosEventos = eventos
        .filter(e => new Date(e.dataInicio + "T00:00:00") >= today)
        .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
        .slice(0, 4);

    /* latest nota per turma (most recent 3) */
    const notasPreview = todasNotas.slice(0, 3);

    return (
        <div className="space-y-7">

            {/* ═══════════════════════════════════════════════════════
                HERO — gradient banner with personalised stats strip
            ═══════════════════════════════════════════════════════ */}
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

                    {/* Stats strip — 4 metric tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        {[
                            { icon: BookOpen,  value: enrollments.length, label: "Matrículas",   color: "text-violet-200" },
                            { icon: Zap,       value: inProgressCount,    label: "Em andamento", color: "text-yellow-300" },
                            { icon: Trophy,    value: completedCount,     label: "Concluídos",   color: "text-amber-300"  },
                            { icon: Award,     value: certEmitidos,       label: "Certificados", color: "text-emerald-300"},
                        ].map(({ icon: Icon, value, label, color }) => (
                            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white/10">
                                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <Icon className={`w-4 h-4 ${color}`} />
                                </div>
                                <div>
                                    <div className="text-xl font-bold leading-tight">{value}</div>
                                    <div className="text-[11px] text-violet-300 font-medium">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* ═══ CONTINUE STUDYING ═══════════════════════════════ */}
            {nextCourse ? (
                <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-indigo-500 rounded-l-2xl" />
                    <div className="pl-2 flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="flex-1">
                            <span className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-3">
                                <PlayCircle className="w-3 h-3" /> Continuar estudando
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">{nextCourse.title}</h3>
                            <p className="text-sm text-slate-500 mb-3">{nextCourse.lastAccessed}</p>
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                                    <span>Progresso geral</span>
                                    <span className="text-violet-600 font-semibold">{nextCourse.progress}%</span>
                                </div>
                                <Progress value={nextCourse.progress} className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500" />
                            </div>
                        </div>
                        <Link href={`/aluno/aulas/${nextCourse.courseId}`} className="shrink-0">
                            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-3 px-7 rounded-xl text-sm transition-all shadow-sm shadow-violet-200 whitespace-nowrap">
                                <PlayCircle className="w-4 h-4" /> Acessar Aula
                                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border-2 border-dashed border-violet-100 bg-violet-50/50 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6 text-violet-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-700">Nenhum curso em andamento</h3>
                            <p className="text-sm text-slate-500">Explore nosso catálogo e comece sua jornada.</p>
                        </div>
                    </div>
                    <Link href="/cursos" className="shrink-0">
                        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors">
                            Ver Cursos
                        </button>
                    </Link>
                </div>
            )}


            {/* ═══ QUICK ACCESS ════════════════════════════════════ */}
            <div>
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                    <LayoutGrid className="w-4 h-4 text-slate-400" /> Acesso Rápido
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {QUICK_LINKS.map(({ href, icon: Icon, label, desc, color, bg }) => (
                        <Link key={href} href={href} className="group">
                            <div className="h-full rounded-xl border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col gap-3">
                                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors leading-tight">{label}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ═══ EVENTS + NOTES ══════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Upcoming events */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-teal-500" /> Proximos Eventos
                        </h3>
                        <Link href="/aluno/calendario" className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1">
                            Ver todos <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {proximosEventos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CalendarDays className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-sm text-slate-500">Nenhum evento proximo</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {proximosEventos.map(ev => (
                                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                                    <div className="shrink-0 text-center bg-white rounded-lg border border-slate-200 px-2.5 py-1.5 min-w-[46px]">
                                        <div className="text-[10px] text-slate-500 uppercase font-semibold leading-tight">
                                            {new Date(ev.dataInicio + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                                        </div>
                                        <div className="text-lg font-bold text-slate-800 leading-tight">
                                            {new Date(ev.dataInicio + "T00:00:00").getDate()}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 leading-tight truncate">{ev.titulo}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tipoClass(ev.tipo)}`}>
                                                {ev.tipo}
                                            </span>
                                            {ev.horaInicio && (
                                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />{ev.horaInicio}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes preview */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-500" /> Ultimas Notas
                        </h3>
                        <Link href="/aluno/notas" className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1">
                            Ver boletim <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {notasPreview.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <FileText className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-sm text-slate-500">Nenhuma nota lancada</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {notasPreview.map(nota => {
                                const media = nota.media ?? ((nota.av1 ?? 0) + (nota.av2 ?? 0) + (nota.trabalho ?? 0)) / 3;
                                return (
                                    <div key={nota.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                            <Star className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{nota.disciplina ?? `Turma ${nota.turmaId}`}</p>
                                            <p className="text-[11px] text-slate-500">
                                                AV1: {nota.av1 ?? "—"} AV2: {nota.av2 ?? "—"} Trab: {nota.trabalho ?? "—"}
                                            </p>
                                        </div>
                                        <div className={`text-base font-bold ${gradeColor(media)}`}>
                                            {media.toFixed(1)}
                                        </div>
                                    </div>
                                );
                            })}
                            <Link href="/aluno/notas" className="block">
                                <div className="flex items-center justify-center gap-1.5 text-xs text-violet-600 font-semibold py-2 hover:bg-violet-50 rounded-xl transition-colors">
                                    Ver boletim completo <ArrowRight className="w-3 h-3" />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ MEUS CURSOS ══════════════════════════════════════ */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-500" /> Meus Cursos
                        {enrollments.length > 0 && (
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{enrollments.length}</span>
                        )}
                    </h2>
                    <Link href="/cursos" className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1">
                        Explorar catalogo <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {enrollments.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                            <BookOpen className="w-7 h-7 text-violet-400" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 mb-1">Nenhuma matricula ativa</h3>
                        <p className="text-slate-500 text-sm mb-5 max-w-xs">Explore nosso catalogo e adquira seu primeiro curso com pagamento via CIELO Sandbox.</p>
                        <Link href="/checkout/course-1">
                            <button className="bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all shadow-sm shadow-violet-200">
                                Simular Compra
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {enrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row"
                            >
                                <div className="relative w-full sm:w-40 h-36 sm:h-auto shrink-0 overflow-hidden">
                                    <img
                                        src={enrollment.thumbnail}
                                        alt={enrollment.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:bg-gradient-to-r" />
                                    <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {enrollment.type}
                                    </div>
                                </div>
                                <div className="flex-1 p-4 flex flex-col">
                                    <h4 className="font-bold text-sm text-slate-900 leading-snug mb-0.5 line-clamp-2">{enrollment.title}</h4>
                                    <p className="text-xs text-slate-500 mb-auto">{enrollment.lastAccessed}</p>

                                    <div className="mt-3 space-y-2.5">
                                        <div>
                                            <div className="flex justify-between items-center text-xs mb-1">
                                                <span className="text-slate-500">Progresso</span>
                                                <span className="text-violet-600 font-bold">{enrollment.progress}%</span>
                                            </div>
                                            <Progress
                                                value={enrollment.progress}
                                                className="h-1.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500"
                                            />
                                        </div>

                                        {enrollment.progress < 100 ? (
                                            <Link href={`/aluno/aulas/${enrollment.courseId}`} className="block">
                                                <button className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-xs font-semibold py-2 rounded-lg transition-all">
                                                    <PlayCircle className="w-3.5 h-3.5" />
                                                    Continuar
                                                </button>
                                            </Link>
                                        ) : (
                                            <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold py-2 rounded-lg">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Concluido
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" /> Conquistas
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: "🎯", label: "Primeiro Login",  earned: true  },
                        { icon: "🔥", label: "7 dias seguidos", earned: true  },
                        { icon: "📚", label: "5 aulas",         earned: false },
                        { icon: "🏆", label: "1 Certificado",   earned: certEmitidos > 0 },
                    ].map((badge) => (
                        <div
                            key={badge.label}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
                                badge.earned
                                    ? "border-amber-200 bg-amber-50 shadow-sm"
                                    : "border-slate-200 bg-slate-50 opacity-40 grayscale"
                            }`}
                        >
                            <span className="text-2xl">{badge.icon}</span>
                            <span className={`text-xs font-semibold ${badge.earned ? "text-amber-800" : "text-slate-500"}`}>
                                {badge.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}