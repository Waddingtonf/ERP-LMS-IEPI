"use client"

import { useState, useRef, useEffect } from "react"
import { PlayCircle, CheckCircle, Lock, BookOpen, ChevronDown, ChevronUp, Clock, SkipForward, FileDown, MessageSquare, ArrowLeft, PenLine, ExternalLink, FileText, Video, Save, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { marcarAulaConcluidaAction } from "@/lms/actions/progressoActions"

type CourseDataProps = {
    id: string;
    title: string;
    totalLessons: number;
    completedLessons: number;
    modules: {
        id: string;
        title: string;
        lessons: {
            id: string;
            title: string;
            duration: string;
            blocked: boolean;
            completed: boolean;
            videoUrl: string;
        }[];
    }[];
};

export default function ClassroomClient({ courseData, turmaId, courseId }: { courseData: CourseDataProps, turmaId: string, courseId: string }) {
    const [activeLesson, setActiveLesson] = useState(() => {
        // Try to find the first uncompleted lesson
        for (const m of courseData.modules) {
            for (const l of m.lessons) {
                if (!l.completed && !l.blocked) return l;
            }
        }
        return courseData.modules[0].lessons[0];
    })
    const [expandedModules, setExpandedModules] = useState<string[]>(courseData.modules.map(m => m.id))
    const [completedLocally, setCompletedLocally] = useState<Set<string>>(() => {
        const set = new Set<string>()
        courseData.modules.forEach(m => m.lessons.forEach(l => {
            if (l.completed) set.add(l.id)
        }))
        return set
    })
    const [justCompleted, setJustCompleted] = useState(false)
    const [activeInfoTab, setActiveInfoTab] = useState<"sobre" | "anotacoes" | "materiais">("sobre")
    const [notes, setNotes] = useState<Record<string, string[]>>({}) // lessonId -> saved notes
    const [noteInput, setNoteInput] = useState("")
    const notesEndRef = useRef<HTMLDivElement>(null)

    const MATERIALS: Record<string, { label: string; type: "PDF" | "PPT" | "VIDEO" | "LINK"; size?: string; url: string }[]> = {
        default: [
            { label: "Apostila da Aula", type: "PDF", size: "2.4 MB", url: "#" },
            { label: "Slides da Apresentação", type: "PPT", size: "4.1 MB", url: "#" },
            { label: "Video Complementar", type: "VIDEO", size: "45 min", url: "#" },
            { label: "Leitura Recomendada (OMS)", type: "LINK", url: "https://www.who.int" },
            { label: "Ficha de Atividade Prática", type: "PDF", size: "320 KB", url: "#" },
        ]
    }
    const lessonMaterials = MATERIALS[activeLesson.id] ?? MATERIALS.default

    const savedNotes = notes[activeLesson.id] ?? []

    const saveNote = () => {
        const text = noteInput.trim()
        if (!text) return
        setNotes(prev => ({ ...prev, [activeLesson.id]: [...(prev[activeLesson.id] ?? []), text] }))
        setNoteInput("")
        setTimeout(() => notesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }

    const deleteNote = (idx: number) => {
        setNotes(prev => ({ ...prev, [activeLesson.id]: (prev[activeLesson.id] ?? []).filter((_, i) => i !== idx) }))
    }

    const MAT_STYLE: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
        PDF: { bg: "bg-red-50 border-red-100", text: "text-red-600", icon: FileText },
        PPT: { bg: "bg-orange-50 border-orange-100", text: "text-orange-600", icon: FileText },
        VIDEO: { bg: "bg-blue-50 border-blue-100", text: "text-blue-600", icon: Video },
        LINK: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", icon: ExternalLink },
    }

    const toggleModule = (id: string) => {
        setExpandedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    const markComplete = async () => {
        setCompletedLocally(prev => new Set([...Array.from(prev), activeLesson.id]))
        setJustCompleted(true)
        setTimeout(() => setJustCompleted(false), 3000)
        await marcarAulaConcluidaAction(courseId, activeLesson.id)
    }

    const totalDone = completedLocally.size
    const progress = Math.round((totalDone / courseData.totalLessons) * 100)
    const isCompleted = completedLocally.has(activeLesson.id)

    return (
        <div className="flex flex-col lg:flex-row gap-5 min-h-[calc(100vh-8rem)]">
            {/* Left: Player + Info */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Back Link */}
                <Link href="/aluno" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 transition-colors w-fit mb-1">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Portal
                </Link>

                {/* Video player */}
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                    <div className="aspect-video">
                        {activeLesson.videoUrl ? (
                            <iframe
                                src={activeLesson.videoUrl}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={activeLesson.title}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-white font-semibold text-lg mb-1">Aula Bloqueada</p>
                                    <p className="text-slate-400 text-sm">Conclua as aulas anteriores para liberar.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Completion banner */}
                    {justCompleted && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-500/90 to-transparent px-6 pt-8 pb-4 text-white text-center">
                            <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                            <p className="font-semibold text-sm">Aula marcada como concluída! 🎉</p>
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4 shadow-sm">
                    <div className="flex-1">
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                            <span>Progresso do Curso</span>
                            <span className="text-violet-600">{totalDone}/{courseData.totalLessons} aulas · {progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-indigo-500 [&>div]:transition-all [&>div]:duration-700" />
                    </div>
                </div>

                {/* Lesson info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-1.5">{activeLesson.title}</h2>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 shrink-0" />
                                {courseData.title}
                                <span className="text-slate-300">·</span>
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                {activeLesson.duration}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {isCompleted ? (
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                                    <CheckCircle className="w-4 h-4" /> Concluída
                                </span>
                            ) : !activeLesson.blocked && (
                                <button
                                    onClick={markComplete}
                                    className="inline-flex items-center gap-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-200"
                                >
                                    <CheckCircle className="w-4 h-4" /> Marcar Concluída
                                </button>
                            )}
                            <button className="p-2.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all" title="Próxima aula">
                                <SkipForward className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs navigation */}
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                        {([
                            { id: "sobre", label: "Sobre a Aula", icon: MessageSquare },
                            { id: "anotacoes", label: "Minhas Anotações", icon: PenLine, count: savedNotes.length },
                            { id: "materiais", label: "Materiais", icon: FileDown, count: lessonMaterials.length },
                        ] as const).map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveInfoTab(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeInfoTab === tab.id
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                                {"count" in tab && tab.count > 0 && (
                                    <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab: Sobre */}
                    {activeInfoTab === "sobre" && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Nesta aula abordaremos os conceitos fundamentais do tópico, explorando casos práticos e
                                aplicação no cotidiano profissional de saúde. Assista até o final para registrar o progresso
                                e liberar o próximo bloco de conteúdo.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Duração: {activeLesson.duration}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                                    <BookOpen className="w-3.5 h-3.5" /> {courseData.title}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                                    <Lock className="w-3 h-3" /> Exige 90% de visualização
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Anotações */}
                    {activeInfoTab === "anotacoes" && (
                        <div className="space-y-4">
                            {/* Input */}
                            <div className="space-y-2">
                                <textarea
                                    value={noteInput}
                                    onChange={e => setNoteInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveNote() }}
                                    rows={3}
                                    placeholder="Digite sua anotação sobre esta aula… (Ctrl+Enter para salvar)"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white resize-none"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={saveNote}
                                        disabled={!noteInput.trim()}
                                        className="flex items-center gap-2 text-xs font-semibold bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl transition-all"
                                    >
                                        <Save className="w-3.5 h-3.5" /> Salvar Nota
                                    </button>
                                </div>
                            </div>
                            {/* Saved notes */}
                            {savedNotes.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {savedNotes.length} anotação{savedNotes.length !== 1 ? "ões" : ""} nesta aula
                                    </p>
                                    {savedNotes.map((note, i) => (
                                        <div key={i} className="flex gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 group">
                                            <PenLine className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-slate-700 flex-1 leading-relaxed whitespace-pre-wrap">{note}</p>
                                            <button
                                                onClick={() => deleteNote(i)}
                                                className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <div ref={notesEndRef} />
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <PenLine className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">Nenhuma anotação ainda. Comece a digitar acima!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Materiais */}
                    {activeInfoTab === "materiais" && (
                        <div className="grid sm:grid-cols-2 gap-2">
                            {lessonMaterials.map(m => {
                                const style = MAT_STYLE[m.type]
                                const Icon = style.icon
                                const isExternal = m.type === "LINK"
                                return (
                                    <a
                                        key={m.label}
                                        href={m.url}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                                    >
                                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${style.bg}`}>
                                            <Icon className={`w-4 h-4 ${style.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-700 group-hover:text-violet-700 font-medium truncate">{m.label}</p>
                                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                <span className={`font-bold uppercase ${style.text}`}>{m.type}</span>
                                                {m.size && <span>· {m.size}</span>}
                                            </p>
                                        </div>
                                        {isExternal
                                            ? <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 shrink-0" />
                                            : <FileDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 shrink-0" />
                                        }
                                    </a>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Course Index */}
            <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col shrink-0">
                <div className="p-4 bg-gradient-to-r from-violet-700 to-violet-800 text-white">
                    <h3 className="font-bold text-sm">Conteúdo do Curso</h3>
                    <p className="text-xs text-violet-300 mt-0.5">{totalDone} de {courseData.totalLessons} aulas concluídas</p>
                    <Progress
                        value={progress}
                        className="h-1.5 mt-2.5 bg-violet-600 [&>div]:bg-violet-200"
                    />
                </div>

                <ScrollArea className="flex-1">
                    <div className="divide-y divide-slate-100">
                        {courseData.modules.map(module => {
                            const isExpanded = expandedModules.includes(module.id)
                            const doneLessons = module.lessons.filter(l => completedLocally.has(l.id)).length

                            return (
                                <div key={module.id}>
                                    <button
                                        onClick={() => toggleModule(module.id)}
                                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 leading-tight">{module.title}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{doneLessons}/{module.lessons.length} aulas</p>
                                        </div>
                                        {isExpanded
                                            ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                                            : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                        }
                                    </button>

                                    {isExpanded && (
                                        <div className="bg-slate-50/50">
                                            {module.lessons.map(lesson => {
                                                const isActive = activeLesson.id === lesson.id
                                                const isDone = completedLocally.has(lesson.id)

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => !lesson.blocked && setActiveLesson(lesson)}
                                                        disabled={lesson.blocked}
                                                        className={`w-full text-left px-4 py-3 flex gap-3 text-sm transition-all ${isActive
                                                                ? "bg-violet-50 border-r-2 border-violet-500"
                                                                : lesson.blocked
                                                                    ? "opacity-40 cursor-not-allowed"
                                                                    : "hover:bg-white cursor-pointer"
                                                            }`}
                                                    >
                                                        <div className="mt-0.5 shrink-0">
                                                            {isDone ? (
                                                                <CheckCircle className={`w-4 h-4 ${isActive ? "text-violet-600" : "text-emerald-500"}`} />
                                                            ) : lesson.blocked ? (
                                                                <Lock className="w-4 h-4 text-slate-400" />
                                                            ) : (
                                                                <PlayCircle className={`w-4 h-4 ${isActive ? "text-violet-600" : "text-slate-400"}`} />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`truncate text-xs font-medium leading-snug ${isActive ? "text-violet-900 font-semibold" : "text-slate-700"}`}>
                                                                {lesson.title}
                                                            </p>
                                                            <p className={`text-[11px] mt-0.5 ${isActive ? "text-violet-500" : "text-slate-400"}`}>
                                                                {lesson.duration}
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
