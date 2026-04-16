import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface EduKpiItem {
    label: string
    value: string | number
    hint?: string
    icon?: React.ReactNode
    tone?: "neutral" | "brand" | "success" | "warning" | "danger"
}

const toneClass: Record<NonNullable<EduKpiItem["tone"]>, string> = {
    neutral: "bg-slate-50 border-slate-200",
    brand: "bg-violet-50 border-violet-200",
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
    danger: "bg-rose-50 border-rose-200",
}

export function EduKpiGrid({ items, cols = 4 }: { items: EduKpiItem[]; cols?: 2 | 3 | 4 }) {
    const gridClass = {
        2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
        3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        4: "grid grid-cols-2 lg:grid-cols-4 gap-4",
    }[cols]

    return (
        <div className={gridClass}>
            {items.map((item) => (
                <Card key={item.label} className={cn("border", toneClass[item.tone ?? "neutral"])}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
                        <CardTitle className="text-sm font-medium text-slate-600">{item.label}</CardTitle>
                        {item.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                        {item.hint && <p className="text-xs text-slate-500 mt-1">{item.hint}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export interface LearningPathModule {
    id: string
    title: string
    progress: number
    status: "Concluído" | "Em andamento" | "Pendente"
}

export function LearningPathCard({ title = "Trilha de aprendizagem", modules }: { title?: string; modules: LearningPathModule[] }) {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Progresso por módulo e próximos passos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {modules.map((module) => (
                    <div key={module.id} className="rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-sm font-medium text-slate-800">{module.title}</p>
                            <Badge variant="outline" className="text-xs">{module.status}</Badge>
                        </div>
                        <Progress value={module.progress} className="h-2 bg-slate-100" />
                        <p className="text-[11px] text-slate-500 mt-1">{module.progress}% concluído</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export interface AcademicEvent {
    id: string
    title: string
    dateLabel: string
    type: string
}

export function AcademicPlanCard({ events }: { events: AcademicEvent[] }) {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>Plano de aula e calendário</CardTitle>
                <CardDescription>Eventos acadêmicos relevantes do período</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {events.map((event) => (
                    <div key={event.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-sm font-medium text-slate-800">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.dateLabel} · {event.type}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export interface CommunicationItem {
    id: string
    channel: "Aviso" | "Mensagem" | "Ocorrência"
    title: string
    meta: string
}

export function CommunicationCard({ items }: { items: CommunicationItem[] }) {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>Comunicação acadêmica</CardTitle>
                <CardDescription>Avisos e mensagens por turma/curso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                        <div>
                            <p className="text-sm font-medium text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.meta}</p>
                        </div>
                        <Badge variant="outline" className="text-[11px]">{item.channel}</Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
