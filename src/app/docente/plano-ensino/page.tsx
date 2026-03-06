'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  getPlanosByInstructor,
  criarPlanoEnsino,
  publicarPlanoEnsino,
} from '@/lms/actions/planoEnsinoActions';
import type { PlanoEnsino } from '@/lms/repositories/PlanoEnsinoRepository';

const INSTRUTOR_ID = 'instrutor-1';
const INSTRUTOR_NOME = 'Prof. Demo';

const STATUS_COLORS: Record<string, string> = {
  Rascunho:   'bg-gray-100 text-gray-700',
  Publicado:  'bg-blue-100 text-blue-700',
  Revisado:   'bg-yellow-100 text-yellow-700',
  Homologado: 'bg-green-100 text-green-700',
};

export default function DocentePlanoEnsinoPage() {
  const [planos, setPlanos] = useState<PlanoEnsino[]>([]);
  const [selected, setSelected] = useState<PlanoEnsino | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [turmaId, setTurmaId] = useState('');
  const [turmaNome, setTurmaNome] = useState('');
  const [cursoNome, setCursoNome] = useState('');
  const [ementa, setEmenta] = useState('');
  const [objetivoGeral, setObjetivoGeral] = useState('');

  useEffect(() => {
    loadPlanos();
  }, []);

  function loadPlanos() {
    getPlanosByInstructor(INSTRUTOR_ID).then(data => setPlanos(data));
  }

  function handleCreate() {
    startTransition(async () => {
      await criarPlanoEnsino({
        turmaId,
        turmaNome,
        cursoNome,
        instructorId: INSTRUTOR_ID,
        instructorNome: INSTRUTOR_NOME,
        ementa,
        objetivoGeral,
        objetivosEspecificos: [],
        conteudoProgramatico: [],
        metodologias: [],
        criteriosAvaliacao: [],
        bibliografiaBasica: [],
        bibliografiaComplementar: [],
        recursosNecessarios: [],
        status: 'Rascunho',
        observacoes: '',
      });
      setShowForm(false);
      setTurmaId('');
      setTurmaNome('');
      setCursoNome('');
      setEmenta('');
      setObjetivoGeral('');
      loadPlanos();
    });
  }

  function handlePublicar(id: string) {
    startTransition(async () => {
      await publicarPlanoEnsino(id);
      loadPlanos();
    });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planos de Ensino</h1>
          <p className="text-sm text-muted-foreground">Gerencie os planos de ensino das suas turmas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Novo Plano'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Novo Plano de Ensino</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID da Turma</Label>
                <Input value={turmaId} onChange={e => setTurmaId(e.target.value)} placeholder="ex: turma-5" />
              </div>
              <div>
                <Label>Nome da Turma</Label>
                <Input value={turmaNome} onChange={e => setTurmaNome(e.target.value)} placeholder="ex: ENF-ONC-2026A" />
              </div>
            </div>
            <div>
              <Label>Curso</Label>
              <Input value={cursoNome} onChange={e => setCursoNome(e.target.value)} placeholder="Nome do curso" />
            </div>
            <div>
              <Label>Ementa</Label>
              <Textarea value={ementa} onChange={e => setEmenta(e.target.value)} rows={4} placeholder="Descreva a ementa da disciplina..." />
            </div>
            <div>
              <Label>Objetivo Geral</Label>
              <Textarea value={objetivoGeral} onChange={e => setObjetivoGeral(e.target.value)} rows={2} placeholder="Qual o objetivo geral?" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={isPending || !turmaId || !ementa}>
                {isPending ? 'Criando...' : 'Criar Rascunho'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {planos.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum plano de ensino encontrado.
            </CardContent>
          </Card>
        )}
        {planos.map(p => (
          <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(selected?.id === p.id ? null : p)}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.turmaNome}</span>
                  <Badge className={STATUS_COLORS[p.status]}>{p.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{p.cursoNome}</p>
                <p className="text-xs text-muted-foreground">{p.conteudoProgramatico.length} semanas · {p.bibliografiaBasica.length} refs. básicas</p>
              </div>
              {p.status === 'Rascunho' && (
                <Button
                  size="sm"
                  onClick={e => { e.stopPropagation(); handlePublicar(p.id); }}
                  disabled={isPending}
                >
                  Publicar
                </Button>
              )}
            </CardContent>
            {selected?.id === p.id && (
              <CardContent className="pt-0 border-t text-sm space-y-3">
                <p className="font-medium">Ementa</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{p.ementa}</p>
                <p className="font-medium">Objetivo Geral</p>
                <p className="text-muted-foreground">{p.objetivoGeral}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
