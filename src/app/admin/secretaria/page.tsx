"use client"

import { useState } from "react"
import {
    ClipboardList,
    FileText,
    UserX,
    BookOpenCheck,
    Plus,
    Search,
    CheckCircle,
    Clock,
    XCircle,
    Download,
    Eye,
    AlertCircle,
    GraduationCap,
    CalendarRange,
    BookCopy,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ── Tipos ────────────────────────────────────────────────────────────────────
type Tab = "matriculas" | "documentos" | "trancamentos" | "aproveitamento"
type MatriculaStatus = "ativa" | "pendente" | "cancelada" | "trancada" | "concluída"
type SolicitacaoStatus = "aguardando" | "em_producao" | "pronto" | "entregue"

// ── Dados mock ────────────────────────────────────────────────────────────────
const MATRICULAS = [
    { id: "M2024-001", aluno: "Maria Fernanda Costa",    cpf: "032.xxx.xxx-12", curso: "Pós-Graduação em UTI", turma: "2024.2",   ingresso: "01/08/2024", status: "ativa"    as MatriculaStatus },
    { id: "M2024-002", aluno: "João Paulo Rodrigues",    cpf: "041.xxx.xxx-87", curso: "Especialização Pediatria", turma: "2024.1", ingresso: "01/03/2024", status: "ativa"    as MatriculaStatus },
    { id: "M2024-003", aluno: "Ana Clara Oliveira",      cpf: "055.xxx.xxx-31", curso: "Curso Livre: Urgência",  turma: "2024.2",  ingresso: "15/08/2024", status: "pendente" as MatriculaStatus },
    { id: "M2024-004", aluno: "Rodrigo Alves Souza",     cpf: "061.xxx.xxx-09", curso: "Pós-Graduação em UTI",  turma: "2023.2",  ingresso: "01/08/2023", status: "concluída" as MatriculaStatus },
    { id: "M2024-005", aluno: "Camila Bezerra Nóbrega",  cpf: "077.xxx.xxx-44", curso: "Residência Cirúrgica",  turma: "2024.1",  ingresso: "01/03/2024", status: "trancada" as MatriculaStatus },
    { id: "M2024-006", aluno: "Felipe Dantas Melo",      cpf: "099.xxx.xxx-55", curso: "Especialização Pediatria", turma: "2023.1", ingresso: "01/03/2023", status: "cancelada" as MatriculaStatus },
]

const SOLICITACOES = [
    { id: "SOL-001", aluno: "Maria Fernanda Costa", tipo: "Histórico Escolar", solicitado: "10/11/2024", prazo: "17/11/2024", status: "em_producao" as SolicitacaoStatus },
    { id: "SOL-002", aluno: "João Paulo Rodrigues",  tipo: "Declaração de Matrícula", solicitado: "08/11/2024", prazo: "15/11/2024", status: "pronto" as SolicitacaoStatus },
    { id: "SOL-003", aluno: "Ana Clara Oliveira",    tipo: "Atestado de Frequência", solicitado: "05/11/2024", prazo: "12/11/2024", status: "entregue" as SolicitacaoStatus },
    { id: "SOL-004", aluno: "Beatriz Lemos",         tipo: "Certificado de Conclusão", solicitado: "12/11/2024", prazo: "19/11/2024", status: "aguardando" as SolicitacaoStatus },
    { id: "SOL-005", aluno: "Lucas Carvalho",        tipo: "Histórico Escolar", solicitado: "12/11/2024", prazo: "19/11/2024", status: "aguardando" as SolicitacaoStatus },
]

const TRANCAMENTOS = [
    { id: "TR-001", aluno: "Camila Bezerra Nóbrega", curso: "Residência Cirúrgica", motivo: "Licença médica", solicitado: "01/09/2024", periodos: 1, status: "aprovado" },
    { id: "TR-002", aluno: "Gabriel Monteiro",         curso: "Pós-Graduação em UTI",  motivo: "Dificuldade financeira", solicitado: "15/10/2024", periodos: 2, status: "em_analise" },
    { id: "TR-003", aluno: "Priscila Alencar",          curso: "Especialização Pediatria", motivo: "Transferência de trabalho", solicitado: "20/10/2024", periodos: 1, status: "em_analise" },
]

const APROVEITAMENTOS = [
    { id: "AP-001", aluno: "Rafael Siqueira",    disciplina: "Anatomia Humana",      ch: 60,  creditos: 4, origem: "UFC — Medicina", comprovante: "histórico_ufc.pdf", status: "deferido" },
    { id: "AP-002", aluno: "Tatiane Freitas",    disciplina: "Bioestatística",        ch: 40,  creditos: 3, origem: "UFRN — Enfermagem", comprovante: "hist_ufrn.pdf", status: "em_analise" },
    { id: "AP-003", aluno: "Jorge Vasconcelos",  disciplina: "Ética Profissional",    ch: 30,  creditos: 2, origem: "UNIFACEX — Fisio", comprovante: "cert_unifacex.pdf", status: "indeferido" },
    { id: "AP-004", aluno: "Natalia Duarte",     disciplina: "Farmacologia Básica",   ch: 60,  creditos: 4, origem: "UERN — Farmácia", comprovante: "hist_uern.pdf", status: "em_analise" },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function MatriculaBadge({ status }: { status: MatriculaStatus }) {
    const map: Record<MatriculaStatus, { label: string; cls: string }> = {
        ativa:     { label: "Ativa",     cls: "bg-green-100 text-green-700 border-green-200" },
        pendente:  { label: "Pendente",  cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
        trancada:  { label: "Trancada",  cls: "bg-blue-100 text-blue-700 border-blue-200" },
        cancelada: { label: "Cancelada", cls: "bg-red-100 text-red-700 border-red-200" },
        "concluída": { label: "Concluída", cls: "bg-purple-100 text-purple-700 border-purple-200" },
    }
    const { label, cls } = map[status]
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>{label}</span>
}

function SolBadge({ status }: { status: SolicitacaoStatus }) {
    const map: Record<SolicitacaoStatus, { label: string; icon: React.ReactNode; cls: string }> = {
        aguardando:   { label: "Aguardando",   icon: <Clock className="w-3 h-3" />,        cls: "bg-slate-100 text-slate-600 border-slate-200" },
        em_producao:  { label: "Em produção",  icon: <AlertCircle className="w-3 h-3" />,  cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
        pronto:       { label: "Pronto",       icon: <CheckCircle className="w-3 h-3" />,  cls: "bg-green-100 text-green-700 border-green-200" },
        entregue:     { label: "Entregue",     icon: <CheckCircle className="w-3 h-3" />,  cls: "bg-blue-100 text-blue-700 border-blue-200" },
    }
    const { label, icon, cls } = map[status]
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
            {icon}{label}
        </span>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === "aprovado" || status === "deferido")
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200"><CheckCircle className="w-3 h-3" />Deferido</span>
    if (status === "em_analise")
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200"><Clock className="w-3 h-3" />Em análise</span>
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200"><XCircle className="w-3 h-3" />Indeferido</span>
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color }: {
    icon: React.ReactNode; label: string; value: number | string; sub: string; color: string
}) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-start gap-4">
                <div className="rounded-xl p-2.5 shrink-0" style={{ background: `${color}18` }}>
                    <div style={{ color }}>{icon}</div>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    <p className="text-sm font-medium text-slate-600">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
            </CardContent>
        </Card>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SecretariaPage() {
    const [tab, setTab] = useState<Tab>("matriculas")
    const [matriculaSearch, setMatriculaSearch] = useState("")
    const [docSearch, setDocSearch] = useState("")

    const filteredMatriculas = MATRICULAS.filter(m =>
        m.aluno.toLowerCase().includes(matriculaSearch.toLowerCase()) ||
        m.curso.toLowerCase().includes(matriculaSearch.toLowerCase()) ||
        m.id.toLowerCase().includes(matriculaSearch.toLowerCase())
    )

    const filteredDocs = SOLICITACOES.filter(s =>
        s.aluno.toLowerCase().includes(docSearch.toLowerCase()) ||
        s.tipo.toLowerCase().includes(docSearch.toLowerCase())
    )

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "matriculas",    label: "Matrículas",            icon: <ClipboardList className="w-4 h-4" /> },
        { id: "documentos",    label: "Documentos",            icon: <FileText className="w-4 h-4" /> },
        { id: "trancamentos",  label: "Trancamentos",          icon: <UserX className="w-4 h-4" /> },
        { id: "aproveitamento",label: "Aproveitamento de Estudos", icon: <BookOpenCheck className="w-4 h-4" /> },
    ]

    return (
        <div className="space-y-6">
            {/* ── Cabeçalho ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Secretaria Acadêmica</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Gestão de matrículas, documentos e processos acadêmicos</p>
                </div>
                <Button
                    className="gap-2 text-white"
                    style={{ backgroundColor: "#7c3aed" }}
                >
                    <Plus className="w-4 h-4" /> Nova Matrícula
                </Button>
            </div>

            {/* ── KPIs ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon={<GraduationCap className="w-5 h-5" />} label="Alunos Ativos" value={MATRICULAS.filter(m => m.status === "ativa").length} sub="matrículas vigentes" color="#7c3aed" />
                <KpiCard icon={<ClipboardList className="w-5 h-5" />} label="Pendentes" value={MATRICULAS.filter(m => m.status === "pendente").length} sub="aguardando validação" color="#f59e0b" />
                <KpiCard icon={<FileText className="w-5 h-5" />} label="Documentos" value={SOLICITACOES.filter(s => s.status === "aguardando" || s.status === "em_producao").length} sub="em aberto" color="#0ea5e9" />
                <KpiCard icon={<CalendarRange className="w-5 h-5" />} label="Trancamentos" value={TRANCAMENTOS.filter(t => t.status === "em_analise").length} sub="em análise" color="#ef4444" />
            </div>

            {/* ── Tabs ── */}
            <div className="border-b border-slate-200">
                <div className="flex gap-1 overflow-x-auto pb-px">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                tab === t.id
                                    ? "border-violet-600 text-violet-700"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t.icon}{t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab: Matrículas ── */}
            {tab === "matriculas" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Buscar aluno, curso ou código..."
                                className="pl-9"
                                value={matriculaSearch}
                                onChange={e => setMatriculaSearch(e.target.value)}
                            />
                        </div>
                        <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
                            <option value="">Todos os status</option>
                            <option value="ativa">Ativa</option>
                            <option value="pendente">Pendente</option>
                            <option value="trancada">Trancada</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="concluída">Concluída</option>
                        </select>
                    </div>

                    <Card className="border-0 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead className="min-w-[100px]">Código</TableHead>
                                        <TableHead className="min-w-[200px]">Aluno</TableHead>
                                        <TableHead className="min-w-[240px]">Curso</TableHead>
                                        <TableHead className="min-w-[100px]">Turma</TableHead>
                                        <TableHead className="min-w-[110px]">Ingresso</TableHead>
                                        <TableHead className="min-w-[110px]">Status</TableHead>
                                        <TableHead className="min-w-[100px] text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMatriculas.map(m => (
                                        <TableRow key={m.id} className="hover:bg-slate-50/60">
                                            <TableCell className="font-mono text-xs text-slate-500">{m.id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-slate-800">{m.aluno}</div>
                                                <div className="text-xs text-slate-400">{m.cpf}</div>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{m.curso}</TableCell>
                                            <TableCell className="text-sm text-slate-600">{m.turma}</TableCell>
                                            <TableCell className="text-sm text-slate-500">{m.ingresso}</TableCell>
                                            <TableCell><MatriculaBadge status={m.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button className="p-1.5 text-slate-400 hover:text-violet-600 rounded-lg hover:bg-violet-50 transition-colors" title="Visualizar">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-violet-600 rounded-lg hover:bg-violet-50 transition-colors" title="Gerar documento">
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                    <p className="text-xs text-slate-400 text-right">{filteredMatriculas.length} registros</p>
                </div>
            )}

            {/* ── Tab: Documentos ── */}
            {tab === "documentos" && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Buscar aluno ou tipo de documento..."
                                className="pl-9"
                                value={docSearch}
                                onChange={e => setDocSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="gap-2 shrink-0">
                            <Plus className="w-4 h-4" /> Nova Solicitação
                        </Button>
                    </div>

                    {/* Grid de tipos disponíveis */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Histórico Escolar",      icon: <BookCopy className="w-5 h-5" />,     prazo: "7 dias úteis" },
                            { label: "Declaração de Matrícula", icon: <ClipboardList className="w-5 h-5" />, prazo: "2 dias úteis" },
                            { label: "Atestado de Frequência",  icon: <CheckCircle className="w-5 h-5" />,  prazo: "3 dias úteis" },
                            { label: "Certificado de Conclusão", icon: <GraduationCap className="w-5 h-5" />, prazo: "10 dias úteis" },
                        ].map(doc => (
                            <button
                                key={doc.label}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all text-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                    {doc.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 leading-tight">{doc.label}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.prazo}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-700">Solicitações em Andamento</CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead className="min-w-[90px]">Nº</TableHead>
                                        <TableHead className="min-w-[190px]">Aluno</TableHead>
                                        <TableHead className="min-w-[200px]">Documento</TableHead>
                                        <TableHead className="min-w-[110px]">Solicitado</TableHead>
                                        <TableHead className="min-w-[100px]">Prazo</TableHead>
                                        <TableHead className="min-w-[130px]">Status</TableHead>
                                        <TableHead className="min-w-[90px] text-right">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocs.map(s => (
                                        <TableRow key={s.id} className="hover:bg-slate-50/60">
                                            <TableCell className="font-mono text-xs text-slate-500">{s.id}</TableCell>
                                            <TableCell className="font-medium text-slate-800 text-sm">{s.aluno}</TableCell>
                                            <TableCell className="text-sm text-slate-600">{s.tipo}</TableCell>
                                            <TableCell className="text-sm text-slate-500">{s.solicitado}</TableCell>
                                            <TableCell className="text-sm text-slate-500">{s.prazo}</TableCell>
                                            <TableCell><SolBadge status={s.status} /></TableCell>
                                            <TableCell className="text-right">
                                                {s.status === "pronto" && (
                                                    <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                                                        <Download className="w-3 h-3" /> Baixar
                                                    </button>
                                                )}
                                                {s.status !== "pronto" && (
                                                    <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                                                        <Eye className="w-3 h-3" /> Ver
                                                    </button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            )}

            {/* ── Tab: Trancamentos ── */}
            {tab === "trancamentos" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-slate-500">Solicitações de trancamento e cancelamento de matrícula</p>
                        <Button variant="outline" className="gap-2 shrink-0">
                            <Plus className="w-4 h-4" /> Registrar Solicitação
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {TRANCAMENTOS.map(t => (
                            <Card key={t.id} className="border-0 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                                <UserX className="w-5 h-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="font-semibold text-slate-800">{t.aluno}</span>
                                                    <StatusBadge status={t.status} />
                                                </div>
                                                <p className="text-sm text-slate-600">{t.curso}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Motivo: <span className="text-slate-600">{t.motivo}</span>
                                                    {" · "}Solicitado em {t.solicitado}
                                                    {" · "}{t.periodos} período(s)
                                                </p>
                                            </div>
                                        </div>
                                        {t.status === "em_analise" && (
                                            <div className="flex gap-2 shrink-0">
                                                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors">
                                                    Aprovar
                                                </button>
                                                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">
                                                    Indeferir
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Tab: Aproveitamento ── */}
            {tab === "aproveitamento" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-slate-500">Análise de aproveitamento de estudos anteriores</p>
                        <Button variant="outline" className="gap-2 shrink-0">
                            <Plus className="w-4 h-4" /> Nova Solicitação
                        </Button>
                    </div>

                    <Card className="border-0 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead className="min-w-[80px]">Nº</TableHead>
                                        <TableHead className="min-w-[180px]">Aluno</TableHead>
                                        <TableHead className="min-w-[190px]">Disciplina</TableHead>
                                        <TableHead className="min-w-[60px] text-center">CH</TableHead>
                                        <TableHead className="min-w-[200px]">Instituição de Origem</TableHead>
                                        <TableHead className="min-w-[160px]">Comprovante</TableHead>
                                        <TableHead className="min-w-[120px]">Status</TableHead>
                                        <TableHead className="min-w-[90px] text-right">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {APROVEITAMENTOS.map(a => (
                                        <TableRow key={a.id} className="hover:bg-slate-50/60">
                                            <TableCell className="font-mono text-xs text-slate-500">{a.id}</TableCell>
                                            <TableCell className="font-medium text-slate-800 text-sm">{a.aluno}</TableCell>
                                            <TableCell className="text-sm text-slate-700">{a.disciplina}</TableCell>
                                            <TableCell className="text-center text-sm text-slate-600">{a.ch}h</TableCell>
                                            <TableCell className="text-sm text-slate-500">{a.origem}</TableCell>
                                            <TableCell>
                                                <button className="inline-flex items-center gap-1 text-xs text-violet-600 hover:underline">
                                                    <FileText className="w-3 h-3" />{a.comprovante}
                                                </button>
                                            </TableCell>
                                            <TableCell><StatusBadge status={a.status} /></TableCell>
                                            <TableCell className="text-right">
                                                {a.status === "em_analise" && (
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors" title="Deferir">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Indeferir">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
