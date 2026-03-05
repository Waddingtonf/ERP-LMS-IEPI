// -------------------------------------------------------------------
// BolsaRepository — ERP domain
// -------------------------------------------------------------------

export type BolsaTipo = 'Integral' | 'Parcial' | 'Desconto' | 'Programa Social' | 'Convenio';
export type BolsaStatus = 'Ativa' | 'Suspensa' | 'Encerrada' | 'Pendente';

export interface Bolsa {
    id: string;
    nome: string;
    tipo: BolsaTipo;
    percentualDesconto: number;
    valorMaximo: number | null;
    descricao: string;
    requisitos: string;
    status: BolsaStatus;
    vagasTotal: number;
    vagasOcupadas: number;
    dataInicio: string;
    dataFim: string | null;
    cursoIds: string[]; // quais cursos se aplicam; [] = todos
}

export interface BolsaAluno {
    id: string;
    bolsaId: string;
    bolsaNome: string;
    alunoId: string;
    alunoNome: string;
    turmaId: string;
    turmaNome: string;
    percentualConced: number;
    valorOriginal: number;
    valorComDesconto: number;
    dataAplicacao: string;
    dataVencimento: string | null;
    status: BolsaStatus;
    aprovadoPor: string;
}

export interface IBolsaRepository {
    findAll(): Promise<Bolsa[]>;
    findById(id: string): Promise<Bolsa | null>;
    findByAluno(alunoId: string): Promise<BolsaAluno[]>;
    create(bolsa: Omit<Bolsa, 'id' | 'vagasOcupadas'>): Promise<Bolsa>;
    update(id: string, data: Partial<Omit<Bolsa, 'id'>>): Promise<Bolsa>;
    aplicar(bolsaId: string, alunoId: string, turmaId: string, valorOriginal: number, aprovadoPor: string): Promise<BolsaAluno>;
    revogar(bolsaAlunoId: string, motivo: string): Promise<void>;
}
