// -------------------------------------------------------------------
// ConciliacaoRepository — ERP domain
// -------------------------------------------------------------------

export type ConciliacaoStatus = 'Pendente' | 'Conciliado' | 'Divergente' | 'Ignorado';

export interface TransacaoExtrato {
    id: string;
    data: string;
    descricao: string;
    valor: number;            // positivo = crédito, negativo = débito
    tipo: 'Credito' | 'Debito';
    banco: string;
    agencia: string;
    conta: string;
    status: ConciliacaoStatus;
    pagamentoId: string | null; // vinculado após conciliação
}

export interface ItemConciliacao {
    id: string;
    transacaoId: string;
    pagamentoId: string;
    alunoNome: string;
    valorExtrato: number;
    valorSistema: number;
    diferenca: number;
    conciliadoEm: string;
    conciliadoPor: string;
}

export interface IConciliacaoRepository {
    getPendentes(): Promise<TransacaoExtrato[]>;
    getHistorico(mes: number, ano: number): Promise<ItemConciliacao[]>;
    importarExtrato(transacoes: Omit<TransacaoExtrato, 'id' | 'status' | 'pagamentoId'>[]): Promise<{ importadas: number; duplicadas: number }>;
    conciliar(transacaoId: string, pagamentoId: string, userId: string): Promise<ItemConciliacao>;
    ignorar(transacaoId: string): Promise<void>;
    marcarDivergente(transacaoId: string, observacao: string): Promise<void>;
}
