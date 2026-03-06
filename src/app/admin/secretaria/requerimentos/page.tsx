'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getRequerimentos,
  analisarRequerimento,
  countRequerimentosByStatus,
} from '@/lms/actions/requerimentoActions';
import type { Requerimento, RequerimentoStatus } from '@/lms/repositories/RequerimentoRepository';

const STATUS_COLORS: Record<string, string> = {
  Rascunho:              'bg-gray-100 text-gray-700',
  Enviado:               'bg-amber-100 text-amber-700',
  'Em Analise':          'bg-blue-100 text-blue-700',
  'Aguardando Documentos': 'bg-orange-100 text-orange-700',
  Deferido:              'bg-green-100 text-green-700',
  Indeferido:            'bg-red-100 text-red-700',
  Cancelado:             'bg-gray-100 text-gray-500',
};

const STATUS_OPTIONS: RequerimentoStatus[] = [
  'Em Analise',
  'Aguardando Documentos',
  'Deferido',
  'Indeferido',
  'Cancelado',
];

export default function AdminRequerimentosPage() {
  const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
  const [filtered, setFiltered] = useState<Requerimento[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Requerimento | null>(null);
  const [novoStatus, setNovoStatus] = useState<RequerimentoStatus>('Em Analise');
  const [parecer, setParecer] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [reqData, countData] = await Promise.all([
      getRequerimentos(),
      countRequerimentosByStatus(),
    ]);
    setRequerimentos(reqData);
    setFiltered(reqData);
    setCounts(countData);
  }

  useEffect(() => {
    let list = requerimentos;
    if (statusFilter !== 'all') list = list.filter(r => r.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.alunoNome.toLowerCase().includes(q) ||
        r.assunto.toLowerCase().includes(q) ||
        r.tipo.toLowerCase().includes(q) ||
        r.matricula.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, statusFilter, requerimentos]);

  function openAnalysis(req: Requerimento) {
    setSelected(req);
    setNovoStatus(req.status as RequerimentoStatus);
    setParecer(req.parecerAdmin ?? '');
  }

  function handleAnalyze() {
    if (!selected) return;
    startTransition(async () => {
      await analisarRequerimento(selected.id, novoStatus, parecer);
      setSelected(null);
      load();
    });
  }

  const KPI_ORDER = ['Enviado', 'Em Analise', 'Aguardando Documentos', 'Deferido', 'Indeferido'];
  const KPI_STYLES: Record<string, string> = {
    Enviado:                'bg-amber-50 border-amber-200',
    'Em Analise':           'bg-blue-50 border-blue-200',
    'Aguardando Documentos': 'bg-orange-50 border-orange-200',
    Deferido:               'bg-green-50 border-green-200',
    Indeferido:             'bg-red-50 border-red-200',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Requerimentos — Secretaria</h1>
        <p className="text-sm text-muted-foreground">Analise e defira/indefira requerimentos acadêmicos dos alunos</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {KPI_ORDER.map(st => (
          <Card key={st} className={`border ${KPI_STYLES[st]}`}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{st}</p>
              <p className="text-3xl font-bold">{counts[st] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input
          className="w-64"
          placeholder="Buscar por aluno, assunto, tipo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {Object.keys(STATUS_COLORS).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Aluno / Matrícula</th>
              <th className="text-left px-4 py-2 font-medium">Tipo</th>
              <th className="text-left px-4 py-2 font-medium">Assunto</th>
              <th className="text-center px-4 py-2 font-medium">Status</th>
              <th className="text-center px-4 py-2 font-medium">Criado em</th>
              <th className="text-center px-4 py-2 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                <td className="px-4 py-2">
                  <p className="font-medium">{r.alunoNome}</p>
                  <p className="text-xs text-muted-foreground">{r.matricula}</p>
                </td>
                <td className="px-4 py-2">{r.tipo}</td>
                <td className="px-4 py-2 max-w-xs truncate">{r.assunto}</td>
                <td className="px-4 py-2 text-center">
                  <Badge className={STATUS_COLORS[r.status]}>{r.status}</Badge>
                </td>
                <td className="px-4 py-2 text-center text-xs text-muted-foreground">
                  {new Date(r.criadoEm).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => openAnalysis(r)}>
                    Analisar
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Nenhum requerimento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Analysis modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Analisar Requerimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="bg-muted/50 rounded p-3 space-y-1">
                <p><span className="font-medium">Aluno:</span> {selected.alunoNome} ({selected.matricula})</p>
                <p><span className="font-medium">Tipo:</span> {selected.tipo}</p>
                <p><span className="font-medium">Assunto:</span> {selected.assunto}</p>
                <p className="text-muted-foreground whitespace-pre-wrap mt-1">{selected.descricao}</p>
              </div>

              <div>
                <Label>Novo Status</Label>
                <Select value={novoStatus} onValueChange={v => setNovoStatus(v as RequerimentoStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Parecer da Secretaria</Label>
                <Textarea
                  value={parecer}
                  onChange={e => setParecer(e.target.value)}
                  rows={4}
                  placeholder="Descreva o parecer ou justificativa..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Cancelar</Button>
                <Button onClick={handleAnalyze} disabled={isPending}>
                  {isPending ? 'Salvando...' : 'Confirmar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
