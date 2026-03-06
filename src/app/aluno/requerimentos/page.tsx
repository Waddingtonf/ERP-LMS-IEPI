'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  getRequerimentosByAluno,
  criarRequerimento,
} from '@/lms/actions/requerimentoActions';
import type { Requerimento, RequerimentoTipo } from '@/lms/repositories/RequerimentoRepository';

const STATUS_COLORS: Record<string, string> = {
  Rascunho:              'bg-gray-100 text-gray-700',
  Enviado:               'bg-amber-100 text-amber-700',
  'Em Analise':          'bg-blue-100 text-blue-700',
  'Aguardando Documentos': 'bg-orange-100 text-orange-700',
  Deferido:              'bg-green-100 text-green-700',
  Indeferido:            'bg-red-100 text-red-700',
  Cancelado:             'bg-gray-100 text-gray-500',
};

const TIPOS: RequerimentoTipo[] = [
  'Revisao de Nota',
  'Trancamento de Matricula',
  'Declaracao de Matricula',
  'Historico Escolar',
  'Aproveitamento de Estudos',
  'Dispensa de Componente',
  'Alteracao de Turma',
  'Segunda Chamada',
  'Encerramento de Periodo',
  'Outros',
];

export default function RequerimentosPage() {
  const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
  const [selected, setSelected] = useState<Requerimento | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [tipo, setTipo] = useState<RequerimentoTipo>('Revisao de Nota');
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');

  const ALUNO_ID = 'aluno-1';

  useEffect(() => {
    getRequerimentosByAluno(ALUNO_ID).then(data => setRequerimentos(data));
  }, []);

  function handleSubmit() {
    startTransition(async () => {
      const novo = await criarRequerimento({
        alunoId: ALUNO_ID,
        alunoNome: 'Aluno Demo',
        matricula: '2024001',
        tipo,
        assunto,
        descricao,
      });
      setRequerimentos(prev => [novo, ...prev]);
      setOpenNew(false);
      setAssunto('');
      setDescricao('');
    });
  }

  function daysLeft(prazo?: string | null) {
    if (!prazo) return null;
    const diff = Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000);
    return diff;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Requerimentos</h1>
          <p className="text-muted-foreground text-sm">Acompanhe e solicite requerimentos acadêmicos</p>
        </div>
        <Button onClick={() => setOpenNew(true)}>+ Novo Requerimento</Button>
      </div>

      <div className="space-y-3">
        {requerimentos.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum requerimento encontrado.
            </CardContent>
          </Card>
        )}
        {requerimentos.map(req => {
          const days = daysLeft(req.prazoResposta);
          return (
            <Card
              key={req.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelected(req)}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{req.tipo}</span>
                    <Badge className={STATUS_COLORS[req.status]}>{req.status}</Badge>
                    {req.prazoResposta && days !== null && days >= 0 && (
                      <span className="text-xs text-muted-foreground">
                        Prazo: {days}d restante{days !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{req.assunto}</p>
                  <p className="text-xs text-muted-foreground">
                    Criado em {new Date(req.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.tipo}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge className={STATUS_COLORS[selected.status]}>{selected.status}</Badge>
              </div>
              <div>
                <p className="font-medium">Assunto</p>
                <p className="text-muted-foreground">{selected.assunto}</p>
              </div>
              <div>
                <p className="font-medium">Descrição</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{selected.descricao}</p>
              </div>
              {selected.parecerAdmin && (
                <div className="border rounded p-3 bg-muted/40">
                  <p className="font-medium">Parecer da Secretaria</p>
                  <p className="text-muted-foreground">{selected.parecerAdmin}</p>
                </div>
              )}
              {selected.parecerInstrutor && (
                <div className="border rounded p-3 bg-muted/40">
                  <p className="font-medium">Parecer do Instrutor</p>
                  <p className="text-muted-foreground">{selected.parecerInstrutor}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Requerimento Dialog */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Requerimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={v => setTipo(v as RequerimentoTipo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Assunto</Label>
              <Input value={assunto} onChange={e => setAssunto(e.target.value)} placeholder="Descreva brevemente" />
            </div>
            <div className="space-y-1">
              <Label>Descrição</Label>
              <Textarea
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Descreva com detalhes o seu requerimento..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenNew(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={isPending || !assunto || !descricao}>
                {isPending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
