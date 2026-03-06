'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  getAvaliacoesPendentes,
  responderAvaliacaoInstitucional,
} from '@/lms/actions/avaliacaoInstitucionalActions';
import type {
  AvaliacaoInstitucional,
  RespostasAvaliacao,
} from '@/lms/repositories/AvaliacaoInstitucionalRepository';

const ALUNO_ID = 'aluno-1';

export default function AvaliacaoInstitucionalPage() {
  const [pendentes, setPendentes] = useState<AvaliacaoInstitucional[]>([]);
  const [current, setCurrent] = useState<AvaliacaoInstitucional | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string | number>>({});
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    getAvaliacoesPendentes(ALUNO_ID).then(data => setPendentes(data));
  }, []);

  function startAvaliacao(av: AvaliacaoInstitucional) {
    setCurrent(av);
    setRespostas({});
  }

  function setResposta(questaoId: string, value: string | number) {
    setRespostas(prev => ({ ...prev, [questaoId]: value }));
  }

  function handleSubmit() {
    if (!current) return;
    const requiredIds = current.questoes.filter(q => q.obrigatoria).map(q => q.id);
    const allAnswered = requiredIds.every(id => respostas[id] !== undefined && respostas[id] !== '');
    if (!allAnswered) {
      alert('Por favor responda todas as questões obrigatórias.');
      return;
    }
    startTransition(async () => {
      const respostasArray: RespostasAvaliacao[] = current.questoes.map(q => ({
        questaoId: q.id,
        valor: respostas[q.id] ?? '',
      }));
      await responderAvaliacaoInstitucional(current.id, ALUNO_ID, respostasArray, true);
      setDone(prev => [...prev, current.id]);
      setCurrent(null);
      setPendentes(prev => prev.filter(p => p.id !== current.id));
    });
  }

  if (current) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <button className="text-sm text-muted-foreground hover:underline mb-2" onClick={() => setCurrent(null)}>
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold">{current.titulo}</h1>
          <p className="text-sm text-muted-foreground">{current.alvoNome ?? current.periodo}</p>
        </div>

        <div className="space-y-6">
          {current.questoes.map((q, idx) => (
            <Card key={q.id}>
              <CardContent className="pt-4 space-y-3">
                <p className="font-medium text-sm">
                  {idx + 1}. {q.texto}
                  {q.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-xs text-muted-foreground">Categoria: {q.categoria}</p>

                {q.tipo === 'escala' && (
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setResposta(q.id, n)}
                        className={`w-10 h-10 rounded-full border-2 text-sm font-bold transition-colors ${
                          respostas[q.id] === n
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">
                      (1 = Muito Ruim · 5 = Excelente)
                    </span>
                  </div>
                )}

                {q.tipo === 'texto' && (
                  <Textarea
                    value={(respostas[q.id] as string) ?? ''}
                    onChange={e => setResposta(q.id, e.target.value)}
                    placeholder="Escreva sua resposta..."
                    rows={3}
                  />
                )}

                {q.tipo === 'multipla_escolha' && q.opcoes && (
                  <div className="space-y-2">
                    {q.opcoes.map(op => (
                      <label key={op} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={op}
                          checked={respostas[q.id] === op}
                          onChange={() => setResposta(q.id, op)}
                        />
                        <span className="text-sm">{op}</span>
                      </label>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Avaliação Institucional</h1>
        <p className="text-sm text-muted-foreground">
          Avalie suas turmas e disciplinas para contribuir com a melhoria contínua
        </p>
      </div>

      {pendentes.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {done.length > 0
              ? `Você concluiu ${done.length} avaliação(ões). Obrigado por sua participação!`
              : 'Nenhuma avaliação pendente no momento.'}
          </CardContent>
        </Card>
      )}

      {pendentes.map(av => (
        <Card key={av.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{av.titulo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Período: {av.periodo}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{av.questoes.length} questões</span>
              {av.dataFim && (
                <span>Prazo: {new Date(av.dataFim).toLocaleDateString('pt-BR')}</span>
              )}
            </div>
            <Button size="sm" onClick={() => startAvaliacao(av)}>Responder</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
