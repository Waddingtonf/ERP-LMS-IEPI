// -------------------------------------------------------------------
// NotaRepository — Interface + shared types
// -------------------------------------------------------------------

export type SituacaoAluno = 'Aprovado' | 'Reprovado' | 'Recuperacao' | 'Em Andamento';

export interface Nota {
    id: string;
    alunoId: string;
    alunoNome: string;
    turmaId: string;
    disciplina: string;
    av1: number | null;
    av2: number | null;
    trabalho: number | null;
    media: number | null;
    situacao: SituacaoAluno;
    updatedAt: string;
}

export interface Boletim {
    alunoId: string;
    alunoNome: string;
    turmaId: string;
    turmaNome: string;
    notas: Nota[];
    mediaGeral: number | null;
    situacaoGeral: SituacaoAluno;
    frequenciaPercentual: number;
}

export interface INotaRepository {
    findByAluno(alunoId: string): Promise<Nota[]>;
    findByTurma(turmaId: string): Promise<Nota[]>;
    getBoletim(alunoId: string, turmaId: string): Promise<Boletim | null>;
    lancarNota(alunoId: string, turmaId: string, campo: 'av1' | 'av2' | 'trabalho', valor: number): Promise<Nota>;
    upsert(nota: Omit<Nota, 'id' | 'media' | 'situacao' | 'updatedAt'>): Promise<Nota>;
}
