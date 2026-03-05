"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Check, X, Search, FileText, AlertTriangle, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getTriagemDocuments, updateTriagemStatus, TriagemStatus } from "@/crm/actions/triagemActions"

export default function TriagemPage() {
    const [documents, setDocuments] = useState(getTriagemDocuments())
    const [searchTerm, setSearchTerm] = useState("")

    const filteredDocs = documents.filter(doc =>
        doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.cpf.includes(searchTerm) ||
        doc.course.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pendingCount  = documents.filter(d => d.status === "pending").length
    const approvedCount = documents.filter(d => d.status === "approved").length
    const rejectedCount = documents.filter(d => d.status === "rejected").length
    const [statusFilter, setStatusFilter] = useState<"all" | TriagemStatus>("all")

    const displayed = filteredDocs.filter(d => statusFilter === "all" || d.status === statusFilter)

    const handleAction = (id: string, action: Extract<TriagemStatus, "approved" | "rejected">) => {
        setDocuments(docs => updateTriagemStatus(docs, id, action))
        // MOCK: Update Supabase DB 'enrollments' status to action
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Triagem Visual de Documentos</h2>
                    <p className="text-slate-500 mt-1">Valide os documentos (RG e Histórico) enviados pelos alunos no momento da matrícula.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por nome, CPF ou curso..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(["all", "pending", "approved", "rejected"] as const).map(s => {
                        const labels = { all: `Todos (${documents.length})`, pending: `Pendentes (${pendingCount})`, approved: `Aprovados (${approvedCount})`, rejected: `Rejeitados (${rejectedCount})` }
                        return (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                    statusFilter === s
                                        ? "bg-violet-600 border-violet-600 text-white"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-violet-300"
                                }`}
                            >
                                {labels[s]}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Curso / Matrícula</TableHead>
                            <TableHead>Documentos</TableHead>
                            <TableHead>COREN</TableHead>
                            <TableHead>Data de Envio</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayed.map((doc) => {
                            const missingDocs = doc.docs.filter(d => !d.present).length
                            const presentDocs = doc.docs.filter(d => d.present).length
                            return (
                        <TableRow key={doc.id}>
                                <TableCell>
                                    <div className="font-medium text-slate-900">{doc.studentName}</div>
                                    <div className="text-xs text-slate-500">CPF: {doc.cpf}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-slate-700">{doc.course}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">#{doc.id.toUpperCase()}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-xs font-semibold ${
                                            missingDocs > 0 ? "text-rose-600" : "text-emerald-600"
                                        }`}>
                                            {presentDocs}/{doc.docs.length}
                                        </span>
                                        {missingDocs > 0 && (
                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                                                <AlertTriangle className="w-2.5 h-2.5" /> {missingDocs} faltando
                                            </span>
                                        )}
                                        {missingDocs === 0 && (
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        )}
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        {doc.docs.map(d => (
                                            <span key={d.type} className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                                d.present ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-600"
                                            }`}>{d.type}</span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {doc.corenRequired ? (
                                        doc.corenNumber ? (
                                            <div className="text-xs">
                                                <p className="font-semibold text-slate-700">{doc.corenNumber}</p>
                                                <p className="text-slate-400 mt-0.5">Obrigatório ✓</p>
                                            </div>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                                                <AlertTriangle className="w-3 h-3" /> Não informado
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-xs text-slate-400">Não exigido</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">
                                    {new Date(doc.submittedAt + "T12:00").toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>
                                    {doc.status === 'pending'  && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Aguardando Avaliação</Badge>}
                                    {doc.status === 'approved' && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">Aprovado</Badge>}
                                    {doc.status === 'rejected' && <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Rejeitado</Badge>}
                                </TableCell>
                                <TableCell className="text-right">
                                    {doc.status === 'pending' ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:text-violet-800">
                                                    <Eye className="w-4 h-4 mr-2" /> Analisar
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Análise Documental: {doc.studentName}</DialogTitle>
                                                    <DialogDescription className="flex flex-wrap gap-2 mt-1">
                                                        CPF: {doc.cpf} · {doc.course}
                                                        {doc.corenRequired && doc.corenNumber && (
                                                            <span className="font-semibold text-emerald-600"> · {doc.corenNumber}</span>
                                                        )}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {/* Doc chips */}
                                                <div className="flex gap-2 flex-wrap py-2">
                                                    {doc.docs.map(d => (
                                                        <span key={d.type} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                                                            d.present ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-600"
                                                        }`}>
                                                            <FileText className="w-3 h-3" />{d.label}
                                                            {!d.present && " — NÃO ENVIADO"}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                                                    {doc.docs.map(d => (
                                                        <div key={d.type} className="space-y-1.5">
                                                            <h4 className="font-semibold text-sm text-slate-800">{d.label}</h4>
                                                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-[220px] flex items-center justify-center">
                                                                {d.url ? (
                                                                    <img src={d.url} alt={d.label} className="max-w-full max-h-full object-contain" />
                                                                ) : (
                                                                    <div className="text-center p-4">
                                                                        <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${
                                                                            d.present ? "text-slate-300" : "text-rose-400"
                                                                        }`} />
                                                                        <p className={`text-xs font-medium ${
                                                                            d.present ? "text-slate-400" : "text-rose-500"
                                                                        }`}>
                                                                            {d.present ? "Enviado (sem prévia)" : "Não enviado"}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                                                    <Button variant="destructive" onClick={() => handleAction(doc.id, 'rejected')}>
                                                        <X className="w-4 h-4 mr-2" /> Rejeitar Documentação
                                                    </Button>
                                                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(doc.id, 'approved')}>
                                                        <Check className="w-4 h-4 mr-2" /> Aprovar Matrícula
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <Button variant="ghost" size="sm" disabled>Avaliado</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {displayed.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Nenhum documento encontrado.</div>
                )}
            </div>
        </div>
    )
}
