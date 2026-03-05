// -------------------------------------------------------------------
// AvaliacaoRepository — Interface + shared types
// -------------------------------------------------------------------

export interface Avaliacao {
    id: string;
    turmaId: string;
    turmaNome: string;
    titulo: string;
    tipo: 'Prova' | 'Trabalho' | 'Seminario' | 'Pratica';
    peso: number; // 0-10
    dataAplicacao: string; // YYYY-MM-DD
    dataEntrega: string | null;
    descricao: string;
    status: 'Rascunho' | 'Publicada' | 'Encerrada' | 'Corrigida';
    notaMaxima: number;
}

export interface NotaAvaliacao {
    id: string;
    avaliacaoId: string;
    alunoId: string;
    alunoNome: string;
    nota: number | null;
    entregueEm: string | null;
    observacao: string;
}

export interface IAvaliacaoRepository {
    findByTurma(turmaId: string): Promise<Avaliacao[]>;
    findById(id: string): Promise<Avaliacao | null>;
    create(avaliacao: Omit<Avaliacao, 'id'>): Promise<Avaliacao>;
    update(id: string, data: Partial<Omit<Avaliacao, 'id'>>): Promise<Avaliacao>;
    delete(id: string): Promise<void>;
    getNotasByAvaliacao(avaliacaoId: string): Promise<NotaAvaliacao[]>;
    lancarNotaAvaliacao(avaliacaoId: string, alunoId: string, nota: number, obs?: string): Promise<NotaAvaliacao>;
}
