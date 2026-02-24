"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Check, X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data
const mockDocuments = [
    {
        id: "doc-1",
        studentName: "João Silva",
        cpf: "123.456.789-00",
        course: "Gestão Estratégica em RH",
        submittedAt: "2026-02-18",
        status: "pending",
        rgUrl: "https://images.unsplash.com/photo-1621844697921-289b4f526019?q=80&w=600&auto=format&fit=crop", // fake doc image
        historicoUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "doc-2",
        studentName: "Maria Souza",
        cpf: "987.654.321-00",
        course: "Excelência em Atendimento",
        submittedAt: "2026-02-19",
        status: "approved",
        rgUrl: "",
        historicoUrl: ""
    },
    {
        id: "doc-3",
        studentName: "Pedro Alves",
        cpf: "456.123.789-00",
        course: "Administração de Empresas",
        submittedAt: "2026-02-20",
        status: "pending",
        rgUrl: "https://images.unsplash.com/photo-1621844697921-289b4f526019?q=80&w=600&auto=format&fit=crop",
        historicoUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop"
    }
]

export default function TriagemPage() {
    const [documents, setDocuments] = useState(mockDocuments)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredDocs = documents.filter(doc =>
        doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.cpf.includes(searchTerm)
    )

    const handleAction = (id: string, action: 'approved' | 'rejected') => {
        setDocuments(docs => docs.map(d => d.id === id ? { ...d, status: action } : d))
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

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por nome ou CPF do aluno..."
                        className="pl-9 w-full max-w-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-50">Pendentes (2)</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-50">Aprovados (1)</Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-50">Rejeitados (0)</Badge>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Curso / Matrícula</TableHead>
                            <TableHead>Data de Envio</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocs.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell>
                                    <div className="font-medium text-slate-900">{doc.studentName}</div>
                                    <div className="text-xs text-slate-500">CPF: {doc.cpf}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-slate-700">{doc.course}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">#{doc.id.toUpperCase()}</div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600">
                                    {new Date(doc.submittedAt).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>
                                    {doc.status === 'pending' && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Aguardando Avaliação</Badge>}
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
                                                    <DialogDescription>
                                                        Verifique a legibilidade e veracidade dos documentos enviados.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid grid-cols-2 gap-6 py-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-slate-800">Cópia do RG</h4>
                                                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 h-[400px] flex items-center justify-center">
                                                            {doc.rgUrl ? (
                                                                <img src={doc.rgUrl} alt="RG" className="max-w-full max-h-full object-contain" />
                                                            ) : (<span className="text-slate-400">Não enviado</span>)}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-slate-800">Histórico Escolar / Diploma</h4>
                                                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 h-[400px] flex items-center justify-center">
                                                            {doc.historicoUrl ? (
                                                                <img src={doc.historicoUrl} alt="Histórico" className="max-w-full max-h-full object-contain" />
                                                            ) : (<span className="text-slate-400">Não enviado</span>)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
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
                        ))}
                    </TableBody>
                </Table>
                {filteredDocs.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Nenhum documento encontrado.</div>
                )}
            </div>
        </div>
    )
}
