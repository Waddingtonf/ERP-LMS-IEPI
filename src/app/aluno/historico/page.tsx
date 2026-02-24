import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Star } from "lucide-react"

const history = [
    {
        course: "Pós-Graduação: Gestão Estratégica em RH",
        status: "Em Andamento",
        progress: 35,
        modules: [
            { name: "Fundamentos do RH", grade: 9.5, status: "completed" },
            { name: "Recrutamento Inteligente", grade: null, status: "current" },
            { name: "Avaliação de Desempenho", grade: null, status: "pending" },
        ]
    },
    {
        course: "Curso Livre: Excelência em Atendimento",
        status: "Concluído",
        progress: 100,
        modules: [
            { name: "Empatia e Comunicação", grade: 10.0, status: "completed" },
            { name: "Gestão de Crises", grade: 9.0, status: "completed" },
        ]
    }
]

export default function HistoricoPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Histórico Escolar</h2>
                <p className="text-slate-500 mt-1">Consulte suas notas, frequência e baixe seus certificados.</p>
            </div>

            <div className="space-y-8 mt-8">
                {history.map((record, index) => (
                    <Card key={index} className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg text-slate-900">{record.course}</CardTitle>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                    <Badge variant={record.status === 'Concluído' ? 'default' : 'secondary'} className={record.status === 'Concluído' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-violet-100 text-violet-700 hover:bg-violet-100 border-none'}>
                                        {record.status}
                                    </Badge>
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4" /> {record.progress}% Concluído
                                    </span>
                                </div>
                            </div>

                            {record.status === 'Concluído' && (
                                <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                                    <Award className="w-4 h-4 text-emerald-400" /> Baixar Certificado
                                </button>
                            )}
                        </CardHeader>
                        <CardContent className="pt-6">
                            <h4 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">Desempenho por Módulo</h4>
                            <div className="space-y-3">
                                {record.modules.map((mod, modIdx) => (
                                    <div key={modIdx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${mod.status === 'completed' ? 'bg-emerald-500' : mod.status === 'current' ? 'bg-violet-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                            <span className={`text-sm font-medium ${mod.status === 'pending' ? 'text-slate-500' : 'text-slate-900'}`}>{mod.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {mod.grade !== null ? (
                                                <div className="flex items-center gap-2">
                                                    <Star className={`w-4 h-4 ${mod.grade >= 7 ? 'text-amber-400 fill-amber-400' : 'text-rose-400'}`} />
                                                    <span className="font-bold text-slate-900 tabular-nums">{mod.grade.toFixed(1)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-md">-- / --</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {record.status === 'Concluído' && (
                                <div className="mt-6 pt-4 border-t border-slate-100 sm:hidden">
                                    <button className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800">
                                        <Award className="w-4 h-4 text-emerald-400" /> Certificado
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
