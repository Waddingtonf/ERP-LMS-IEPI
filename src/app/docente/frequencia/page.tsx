"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { getDocenteTurmas, type TurmaUI as Turma } from "@/lms/actions/docenteActions"
import { getAulasByTurma, marcarAulaRealizadaAction } from "@/lms/actions/turmaActions"
import { getFrequenciaAula, salvarFrequenciaAction, getResumoTurma } from "@/lms/actions/frequenciaActions"
import { getEnrollmentsByTurma } from "@/lms/actions/enrollmentActions"
import type { Aula } from "@/lms/repositories/TurmaRepository"
import type { Frequencia, FrequenciaResumo } from "@/lms/repositories/FrequenciaRepository"
import type { Enrollment } from "@/lms/repositories/EnrollmentRepository"
import {
    Users, CalendarDays, CheckCircle2, XCircle,
    Save, AlertTriangle, BookOpen, ChevronRight
} from "lucide-react"
import { toast } from "sonner"

const DOCENTE_ID = 'docente-1'

// ─── Local state for each student row ──────────────────────────────────────

interface AttendanceRow {
    alunoId: string
    alunoName: string
    presente: boolean
    observacao: string
}

// ─── Inner component uses useSearchParams ───────────────────────────────────

function FrequenciaContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const paramTurmaId = searchParams.get('turmaId') ?? ''
    const paramAulaId = searchParams.get('aulaId') ?? ''

    const [turmas, setTurmas] = useState<Turma[]>([])
    const [selectedTurma, setSelectedTurma] = useState<string>(paramTurmaId)
    const [aulas, setAulas] = useState<Aula[]>([])
    const [selectedAula, setSelectedAula] = useState<string>(paramAulaId)
    const [enrollments, setEnrollments] = useState<Enrollment[]>([])
    const [resumo, setResumo] = useState<FrequenciaResumo[]>([])
    const [rows, setRows] = useState<AttendanceRow[]>([])
    const [saving, setSaving] = useState(false)

    // Load turmas on mount
    useEffect(() => {
        getDocenteTurmas().then(setTurmas)
    }, [])

    // Load aulas when turma changes
    const loadAulas = useCallback(async (turmaId: string) => {
        const loaded = await getAulasByTurma(turmaId)
        setAulas(loaded.sort((a, b) => a.date.localeCompare(b.date)))
        const enrs = await getEnrollmentsByTurma(turmaId)
        setEnrollments(enrs)
        const res = await getResumoTurma(turmaId)
        setResumo(res)
    }, [])

    useEffect(() => {
        if (selectedTurma) loadAulas(selectedTurma)
    }, [selectedTurma, loadAulas])

    // Load attendance when aula changes
    const loadFrequencia = useCallback(async (aulaId: string) => {
        const freq: Frequencia[] = await getFrequenciaAula(aulaId)
        const freqMap = new Map(freq.map(f => [f.alunoId, f]))

        // Build rows from enrollments (fallback: from freq records)
        const alunoSet = new Map<string, string>()
        enrollments.forEach(e => alunoSet.set(e.alunoId, e.alunoName))
        freq.forEach(f => alunoSet.set(f.alunoId, f.alunoName))

        const newRows: AttendanceRow[] = Array.from(alunoSet.entries()).map(([id, name]) => ({
            alunoId: id,
            alunoName: name,
            presente: freqMap.get(id)?.presente ?? false,
            observacao: freqMap.get(id)?.observacao ?? '',
        }))
        setRows(newRows)
    }, [enrollments])

    useEffect(() => {
        if (selectedAula) loadFrequencia(selectedAula)
    }, [selectedAula, loadFrequencia])

    // Sync URL params
    function selectTurma(id: string) {
        setSelectedTurma(id)
        setSelectedAula('')
        setRows([])
        router.replace(`/docente/frequencia?turmaId=${id}`, { scroll: false })
    }

    function selectAula(id: string) {
        setSelectedAula(id)
        router.replace(`/docente/frequencia?turmaId=${selectedTurma}&aulaId=${id}`, { scroll: false })
    }

    function togglePresenca(alunoId: string) {
        setRows(prev => prev.map(r => r.alunoId === alunoId ? { ...r, presente: !r.presente } : r))
    }

    function setObs(alunoId: string, obs: string) {
        setRows(prev => prev.map(r => r.alunoId === alunoId ? { ...r, observacao: obs } : r))
    }

    async function handleSave() {
        if (!selectedAula) return
        setSaving(true)
        try {
            const presencas = rows.map(r => ({
                alunoId: r.alunoId,
                alunoName: r.alunoName,
                presente: r.presente,
                observacao: r.observacao,
            }))
            const result = await salvarFrequenciaAction(selectedAula, presencas)
            toast.success(`Frequência salva! ${result.saved} registro(s) atualizados.`)
            if (selectedTurma) {
                const res = await getResumoTurma(selectedTurma)
                setResumo(res)
            }
        } finally {
            setSaving(false)
        }
    }

    async function handleMarkDone(aulaId: string) {
        await marcarAulaRealizadaAction(aulaId)
        if (selectedTurma) loadAulas(selectedTurma)
        toast.success('Aula marcada como realizada.')
    }

    const presentes = rows.filter(r => r.presente).length
    const total = rows.length
    const pctPresentes = total > 0 ? Math.round((presentes / total) * 100) : 0

    const selectedAulaObj = aulas.find(a => a.id === selectedAula)
    const alunosAbaixo = resumo.filter(r => r.percentual < 75)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Lista de Frequência</h2>
                <p className="text-slate-500 mt-1">Registre a presença dos alunos por aula de cada turma.</p>
            </div>

            {/* Alerts */}
            {alunosAbaixo.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-800">
                            {alunosAbaixo.length} aluno(s) com frequência abaixo de 75%
                        </p>
                        <p className="text-amber-700 mt-0.5">
                            {alunosAbaixo.map(a => `${a.alunoName} (${a.percentual}%)`).join(' · ')}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                {/* Turma selector */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">Turmas</p>
                    {turmas.map(t => (
                        <button
                            key={t.id}
                            onClick={() => selectTurma(t.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-all ${selectedTurma === t.id
                                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            <p className="font-medium leading-tight">{t.nome}</p>
                            <p className={`text-xs mt-0.5 ${selectedTurma === t.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                {t.curso}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Aula selector */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">Aulas</p>
                    {!selectedTurma ? (
                        <p className="text-xs text-slate-400 px-1">Selecione uma turma</p>
                    ) : aulas.length === 0 ? (
                        <p className="text-xs text-slate-400 px-1">Nenhuma aula cadastrada</p>
                    ) : (
                        aulas.map(a => (
                            <button
                                key={a.id}
                                onClick={() => selectAula(a.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-all ${selectedAula === a.id
                                        ? 'bg-blue-600 text-white border-blue-600 font-medium'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                <p className="font-medium leading-tight text-xs">{a.title}</p>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className={`text-xs ${selectedAula === a.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {new Date(a.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    </p>
                                    <Badge className={`text-[10px] border-none py-0 ${a.status === 'Realizada' ? 'bg-emerald-100 text-emerald-700' :
                                            a.status === 'Cancelada' ? 'bg-rose-100 text-rose-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>{a.status}</Badge>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Attendance sheet */}
                <div className="lg:col-span-2">
                    {!selectedAula ? (
                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
                            <BookOpen className="w-8 h-8 mb-2 opacity-30" />
                            <p className="text-sm">Selecione uma aula para registrar presença</p>
                        </div>
                    ) : (
                        <Card className="border-slate-200">
                            <CardHeader className="pb-3 border-b border-slate-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-semibold text-slate-800">
                                            {selectedAulaObj?.title ?? selectedAula}
                                        </CardTitle>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {selectedAulaObj
                                                ? `${new Date(selectedAulaObj.date + 'T00:00:00').toLocaleDateString('pt-BR')} — ${selectedAulaObj.startTime}`
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-800">{pctPresentes}%</p>
                                        <p className="text-xs text-slate-500">{presentes}/{total} presentes</p>
                                    </div>
                                </div>
                                <Progress
                                    value={pctPresentes}
                                    className={`h-2 mt-2 ${pctPresentes < 75 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                                />
                            </CardHeader>

                            <CardContent className="pt-4">
                                {rows.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">Nenhum aluno matriculado nesta turma.</p>
                                ) : (
                                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                        {rows.map(row => (
                                            <div
                                                key={row.alunoId}
                                                className={`p-3 rounded-lg border transition-all ${row.presente
                                                        ? 'border-emerald-200 bg-emerald-50'
                                                        : 'border-slate-200 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-800 truncate">{row.alunoName}</p>
                                                        {/* Resumo de freq total */}
                                                        {(() => {
                                                            const r = resumo.find(r => r.alunoId === row.alunoId)
                                                            if (!r) return null
                                                            return (
                                                                <p className={`text-xs mt-0.5 ${r.percentual < 75 ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
                                                                    Freq. geral: {r.percentual}% ({r.presentes}/{r.totalAulas})
                                                                    {r.percentual < 75 && ' ⚠'}
                                                                </p>
                                                            )
                                                        })()}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            onClick={() => togglePresenca(row.alunoId)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${row.presente
                                                                    ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'
                                                                    : 'bg-white text-slate-500 border-slate-300 hover:border-rose-400 hover:text-rose-600'
                                                                }`}
                                                        >
                                                            {row.presente
                                                                ? <><CheckCircle2 className="w-3.5 h-3.5" /> Presente</>
                                                                : <><XCircle className="w-3.5 h-3.5" /> Ausente</>
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                                {!row.presente && (
                                                    <Textarea
                                                        placeholder="Observação (opcional)"
                                                        value={row.observacao}
                                                        onChange={e => setObs(row.alunoId, e.target.value)}
                                                        className="mt-2 text-xs h-14 resize-none border-slate-200"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                                    {selectedAulaObj?.status === 'Agendada' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => handleMarkDone(selectedAula)}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Marcar Realizada
                                        </Button>
                                    )}
                                    <Button
                                        disabled={saving || rows.length === 0}
                                        onClick={handleSave}
                                        className="gap-1.5 bg-blue-600 hover:bg-blue-700 ml-auto"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Salvando...' : 'Salvar Frequência'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Resumo geral de frequência da turma */}
                    {selectedTurma && resumo.length > 0 && (
                        <Card className="border-slate-200 mt-4">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-slate-700 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Resumo da Turma
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {resumo.sort((a, b) => a.percentual - b.percentual).map(r => (
                                        <div key={r.alunoId} className="flex items-center gap-3 text-xs">
                                            <span className="flex-1 truncate text-slate-700">{r.alunoName}</span>
                                            <span className={`font-semibold w-10 text-right ${r.percentual < 75 ? 'text-amber-600' : 'text-emerald-700'}`}>
                                                {r.percentual}%
                                            </span>
                                            <div className="w-20">
                                                <Progress
                                                    value={r.percentual}
                                                    className={`h-1.5 ${r.percentual < 75 ? '[&>div]:bg-amber-400' : '[&>div]:bg-emerald-500'}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Page wrapper (Suspense required for useSearchParams in Next.js 15) ──────

export default function DocenteFrequenciaPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-32 text-slate-400">
                <CalendarDays className="w-6 h-6 animate-pulse mr-2" />
                Carregando...
            </div>
        }>
            <FrequenciaContent />
        </Suspense>
    )
}
