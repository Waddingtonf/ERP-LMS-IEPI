"use client"

import { useState } from "react"
import { PlayCircle, CheckCircle, Lock, BookOpen } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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
