"use client"

import { useState } from "react"
import { PlayCircle, CheckCircle, Lock, BookOpen, ChevronDown, ChevronUp, Clock, SkipForward, FileDown, MessageSquare, ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const courseData = {
    id: "1",
    title: "Gestão Estratégica em RH",
    totalLessons: 5,
    completedLessons: 2,
    modules: [
        {
            id: "m1",
            title: "Módulo 1: Fundamentos do RH",
            lessons: [
                { id: "l1", title: "Introdução à Gestão de Pessoas", duration: "15:00", blocked: false, completed: true, videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
                { id: "l2", title: "Evolução Histórica do RH", duration: "22:30", blocked: false, completed: true, videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
                { id: "l3", title: "Desafios Contemporâneos", duration: "18:45", blocked: false, completed: false, videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
            ]
        },
        {
            id: "m2",
            title: "Módulo 2: Recrutamento Inteligente",
            lessons: [
                { id: "l4", title: "Planejamento de Vagas", duration: "25:10", blocked: true, completed: false, videoUrl: "" },
                { id: "l5", title: "Entrevistas por Competência", duration: "30:00", blocked: true, completed: false, videoUrl: "" },
            ]
        }
    ]
}

export default function ClassroomPage({ params }: { params: { aulaId: string } }) {
    const [activeLesson, setActiveLesson] = useState(courseData.modules[0].lessons[2])
    const [expandedModules, setExpandedModules] = useState<string[]>(["m1", "m2"])
    const [completedLocally, setCompletedLocally] = useState<Set<string>>(new Set(["l1", "l2"]))
    const [justCompleted, setJustCompleted] = useState(false)

    const toggleModule = (id: string) => {
        setExpandedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    const markComplete = () => {
        setCompletedLocally(prev => new Set([...prev, activeLesson.id]))
        setJustCompleted(true)
        setTimeout(() => setJustCompleted(false), 3000)
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

                    {/* Materials */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <FileDown className="w-4 h-4 text-violet-500" /> Materiais da Aula
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: "Apostila da Aula", type: "PDF" },
                                    { label: "Slides da Apresentação", type: "PDF" },
                                ].map(m => (
                                    <a
                                        key={m.label}
                                        href="#"
                                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-bold text-red-600 uppercase">{m.type}</span>
                                        </div>
                                        <span className="text-sm text-slate-700 group-hover:text-violet-700 font-medium flex-1 truncate">{m.label}</span>
                                        <FileDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-violet-500" /> Sobre esta Aula
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Nesta aula abordaremos os conceitos fundamentais do tópico, explorando casos práticos e aplicação no cotidiano corporativo. Assista até o final para registrar o progresso e liberar o próximo bloco.
                            </p>
                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                                <Lock className="w-3 h-3" /> O progresso exige 90% de visualização do vídeo.
                            </p>
                        </div>
                    </div>
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
                                                        className={`w-full text-left px-4 py-3 flex gap-3 text-sm transition-all ${
                                                            isActive
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


// MOCK DATA structure for lessons
const courseData = {
    id: "1",
    title: "Gestão Estratégica em RH",
    modules: [
        {
            id: "m1",
            title: "Módulo 1: Fundamentos do RH",
            lessons: [
                { id: "l1", title: "Introdução à Gestão de Pessoas", duration: "15:00", blocked: false, completed: true, videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
                { id: "l2", title: "Evolução Histórica do RH", duration: "22:30", blocked: false, completed: true, videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
                { id: "l3", title: "Desafios Contemporâneos", duration: "18:45", blocked: false, completed: false, videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
            ]
        },
        {
            id: "m2",
            title: "Módulo 2: Recrutamento Inteligente",
            lessons: [
                { id: "l4", title: "Planejamento de Vagas", duration: "25:10", blocked: true, completed: false, videoUrl: "" },
                { id: "l5", title: "Entrevistas por Competência", duration: "30:00", blocked: true, completed: false, videoUrl: "" },
            ]
        }
    ]
}

export default function ClassroomPage({ params }: { params: { aulaId: string } }) {
    // Setup state for the active lesson
    const [activeLesson, setActiveLesson] = useState(courseData.modules[0].lessons[2])

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full pb-10">

            {/* Player de Vídeo e Material */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-black aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-800 relative">
                    {activeLesson.videoUrl ? (
                        <iframe
                            src={activeLesson.videoUrl}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-900">
                            <div className="text-center">
                                <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Esta aula está bloqueada.</p>
                                <p className="text-sm mt-2 opacity-75">Conclua as aulas anteriores para liberar.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeLesson.title}</h2>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                {courseData.title} • Progresso para proxima aula exige assistir 90%
                            </p>
                        </div>

                        {!activeLesson.blocked && !activeLesson.completed && (
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors">
                                <CheckCircle className="w-4 h-4" /> Marcar como Concluída
                            </button>
                        )}
                        {activeLesson.completed && (
                            <span className="text-emerald-600 px-4 py-2 text-sm font-semibold flex items-center gap-2 bg-emerald-50 rounded-lg">
                                <CheckCircle className="w-4 h-4" /> Concluída
                            </span>
                        )}
                    </div>

                    <div className="prose prose-slate max-w-none text-sm text-slate-600">
                        <h3 className="text-slate-800">Materiais Complementares</h3>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><a href="#" className="text-violet-600 hover:underline">Apostila da Aula (PDF)</a></li>
                            <li><a href="#" className="text-violet-600 hover:underline">Slides da Apresentação (PDF)</a></li>
                        </ul>

                        <h3 className="text-slate-800 mt-8">Descrição da Aula</h3>
                        <p className="mt-4 leading-relaxed">
                            Nesta aula abordaremos os conceitos que fundamentam o tópico atual, explorando casos práticos
                            e a aplicação teórica no cotidiano corporativo. Assista o conteúdo até o final para contabilizar
                            seu progresso na matriz curricular e liberar o próximo bloco.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lista de Aulas Sidebar */}
            <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col shrink-0">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">Conteúdo do Curso</h3>
                    <p className="text-xs text-slate-500 mt-1">2 de 5 aulas concluídas</p>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-4">
                        {courseData.modules.map((module) => (
                            <div key={module.id} className="space-y-1">
                                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {module.title}
                                </div>

                                {module.lessons.map((lesson) => {
                                    const isActive = activeLesson.id === lesson.id;

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => !lesson.blocked && setActiveLesson(lesson)}
                                            disabled={lesson.blocked}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg flex gap-3 text-sm transition-colors group ${isActive
                                                    ? 'bg-violet-100 text-violet-900 border border-violet-200'
                                                    : lesson.blocked
                                                        ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
                                                        : 'hover:bg-slate-50 text-slate-700'
                                                }`}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {lesson.completed ? (
                                                    <CheckCircle className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-emerald-500'}`} />
                                                ) : lesson.blocked ? (
                                                    <Lock className="w-4 h-4 text-slate-400" />
                                                ) : (
                                                    <PlayCircle className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-violet-500'}`} />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className={`font-medium truncate ${isActive ? 'font-semibold' : ''}`}>
                                                    {lesson.title}
                                                </div>
                                                <div className={`text-[10px] mt-1 ${isActive ? 'text-violet-600' : 'text-slate-400'}`}>
                                                    Duração: {lesson.duration}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

        </div>
    )
}
