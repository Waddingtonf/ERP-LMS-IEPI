'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPlanoEnsinoByTurma } from '@/lms/actions/planoEnsinoActions';
import type { PlanoEnsino } from '@/lms/repositories/PlanoEnsinoRepository';

const STATUS_COLORS: Record<string, string> = {
  Rascunho:   'bg-gray-100 text-gray-600',
  Publicado:  'bg-blue-100 text-blue-700',
  Revisado:   'bg-yellow-100 text-yellow-700',
  Homologado: 'bg-green-100 text-green-700',
};

// For demo use turma-1; in production derive from enrolled turmas
const TURMA_ID = 'turma-1';

export default function PlanoEnsinoPage() {
  const [plano, setPlano] = useState<PlanoEnsino | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('ementa');

  useEffect(() => {
    getPlanoEnsinoByTurma(TURMA_ID).then(data => setPlano(data));
  }, []);

  function toggle(sec: string) {
    setOpenSection(prev => (prev === sec ? null : sec));
  }

  if (!plano) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Plano de Ensino</h1>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Plano de ensino não disponível para esta turma.
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = [
    { id: 'ementa', label: 'Ementa', content: <p className="text-sm whitespace-pre-wrap">{plano.ementa}</p> },
    {
      id: 'objetivos',
      label: 'Objetivos',
      content: (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium mb-1">Objetivo Geral</p>
            <p>{plano.objetivoGeral}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Objetivos Específicos</p>
            <ul className="list-disc ml-5 space-y-1">
              {plano.objetivosEspecificos.map((o, i) => (
                <li key={i}>{o.descricao}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'conteudo',
      label: 'Conteúdo Programático',
      content: (
        <div className="space-y-4 text-sm">
          {plano.conteudoProgramatico.map(c => (
            <div key={c.semana} className="border rounded p-3">
              <p className="font-medium">Semana {c.semana} — {c.cargaHoraria}h · {c.topico}</p>
              {c.subtopicos.length > 0 && (
                <ul className="list-disc ml-5 mt-1 space-y-0.5 text-muted-foreground">
                  {c.subtopicos.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'metodologias',
      label: 'Metodologias',
      content: (
        <ul className="list-disc ml-5 space-y-1 text-sm">
          {plano.metodologias.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      ),
    },
    {
      id: 'avaliacao',
      label: 'Critérios de Avaliação',
      content: (
        <ul className="list-disc ml-5 space-y-1 text-sm">
          {plano.criteriosAvaliacao.map((c, i) => <li key={i}>{c.descricao} ({c.peso}%)</li>)}
        </ul>
      ),
    },
    {
      id: 'bibliografia',
      label: 'Bibliografia',
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold mb-2">Básica</p>
            <ul className="list-disc ml-5 space-y-1">
              {plano.bibliografiaBasica.map((b, i) => (
                <li key={i}>{b.titulo}{b.autores ? ` — ${b.autores}` : ''}{b.ano ? ` (${b.ano})` : ''}</li>
              ))}
            </ul>
          </div>
          {plano.bibliografiaComplementar.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Complementar</p>
              <ul className="list-disc ml-5 space-y-1">
                {plano.bibliografiaComplementar.map((b, i) => (
                  <li key={i}>{b.titulo}{b.autores ? ` — ${b.autores}` : ''}{b.ano ? ` (${b.ano})` : ''}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plano de Ensino</h1>
        <p className="text-sm text-muted-foreground">{plano.turmaNome} · {plano.cursoNome}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Instrutor: <strong>{plano.instructorNome}</strong></span>
        <Badge className={STATUS_COLORS[plano.status]}>{plano.status}</Badge>
      </div>

      <div className="space-y-2">
        {sections.map(sec => (
          <Card key={sec.id} className="overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 flex justify-between items-center font-medium hover:bg-muted/50 transition-colors"
              onClick={() => toggle(sec.id)}
            >
              {sec.label}
              <span className="text-muted-foreground">{openSection === sec.id ? '▲' : '▼'}</span>
            </button>
            {openSection === sec.id && (
              <CardContent className="pt-0 pb-4 text-sm">{sec.content}</CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
