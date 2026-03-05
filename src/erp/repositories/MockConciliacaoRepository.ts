import { IConciliacaoRepository, TransacaoExtrato, ItemConciliacao } from './ConciliacaoRepository';

const SEED_TRANSACOES: TransacaoExtrato[] = [
    { id: 'tx-1', data: '2026-03-03', descricao: 'TED RECEBIDA JOAO SILVA', valor: 1683, tipo: 'Credito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Pendente', pagamentoId: null },
    { id: 'tx-2', data: '2026-03-05', descricao: 'TED RECEBIDA MARIA F COSTA', valor: 2490, tipo: 'Credito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Pendente', pagamentoId: null },
    { id: 'tx-3', data: '2026-03-07', descricao: 'PAGTO FATURA CARTAO CIELO', valor: -12400, tipo: 'Debito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Conciliado', pagamentoId: 'pag-cielo-fev26' },
    { id: 'tx-4', data: '2026-03-10', descricao: 'DOC RECEBIDO CARLOS E LIMA', valor: 396, tipo: 'Credito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Pendente', pagamentoId: null },
    { id: 'tx-5', data: '2026-03-12', descricao: 'PIX RECEBIDO ANA PAULA FERREIRA', valor: 1980, tipo: 'Credito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Pendente', pagamentoId: null },
    { id: 'tx-6', data: '2026-03-14', descricao: 'TED RECEBIDA BRUNO CARVALHO', valor: 1850, tipo: 'Credito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Divergente', pagamentoId: null },
    { id: 'tx-7', data: '2026-03-15', descricao: 'DEBITO AUTOMATICO ALUGUEL SEDE', valor: -21000, tipo: 'Debito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Conciliado', pagamentoId: 'pag-aluguel-mar26' },
    { id: 'tx-8', data: '2026-03-18', descricao: 'PIX RECEBIDO LUCIA MENDES', valor: 2190, tipo: 'Credito', banco: 'Bradesco', agencia: '1234', conta: '98765-4', status: 'Pendente', pagamentoId: null },
];

const SEED_CONCIL: ItemConciliacao[] = [
    { id: 'ic-1', transacaoId: 'tx-3', pagamentoId: 'pag-cielo-fev26', alunoNome: 'Cielo — Cartões Fev/26', valorExtrato: 12400, valorSistema: 12400, diferenca: 0, conciliadoEm: '2026-03-07', conciliadoPor: 'Ana Rodrigues' },
    { id: 'ic-2', transacaoId: 'tx-7', pagamentoId: 'pag-aluguel-mar26', alunoNome: 'Aluguel Sede', valorExtrato: 21000, valorSistema: 21000, diferenca: 0, conciliadoEm: '2026-03-15', conciliadoPor: 'Ana Rodrigues' },
];

export class MockConciliacaoRepository implements IConciliacaoRepository {
    private transacoes: TransacaoExtrato[] = JSON.parse(JSON.stringify(SEED_TRANSACOES));
    private conciliacoes: ItemConciliacao[] = JSON.parse(JSON.stringify(SEED_CONCIL));

    async getPendentes(): Promise<TransacaoExtrato[]> {
        return this.transacoes.filter(t => t.status === 'Pendente' || t.status === 'Divergente');
    }

    async getHistorico(mes: number, ano: number): Promise<ItemConciliacao[]> {
        return this.conciliacoes.filter(c => {
            const d = new Date(c.conciliadoEm);
            return d.getFullYear() === ano && d.getMonth() + 1 === mes;
        });
    }

    async importarExtrato(transacoes: Omit<TransacaoExtrato, 'id' | 'status' | 'pagamentoId'>[]): Promise<{ importadas: number; duplicadas: number }> {
        let importadas = 0; let duplicadas = 0;
        for (const t of transacoes) {
            const dup = this.transacoes.find(ex => ex.data === t.data && ex.descricao === t.descricao && ex.valor === t.valor);
            if (dup) { duplicadas++; continue; }
            this.transacoes.push({ ...t, id: `tx-${Date.now()}-${importadas}`, status: 'Pendente', pagamentoId: null });
            importadas++;
        }
        return { importadas, duplicadas };
    }

    async conciliar(transacaoId: string, pagamentoId: string, userId: string): Promise<ItemConciliacao> {
        const tx = this.transacoes.find(t => t.id === transacaoId);
        if (!tx) throw new Error('Transação não encontrada');
        tx.status = 'Conciliado';
        tx.pagamentoId = pagamentoId;
        const item: ItemConciliacao = {
            id: `ic-${Date.now()}`, transacaoId, pagamentoId, alunoNome: tx.descricao,
            valorExtrato: Math.abs(tx.valor), valorSistema: Math.abs(tx.valor), diferenca: 0,
            conciliadoEm: new Date().toISOString().split('T')[0], conciliadoPor: userId,
        };
        this.conciliacoes.push(item);
        return item;
    }

    async ignorar(transacaoId: string): Promise<void> {
        const tx = this.transacoes.find(t => t.id === transacaoId);
        if (tx) tx.status = 'Ignorado';
    }

    async marcarDivergente(transacaoId: string, _observacao: string): Promise<void> {
        const tx = this.transacoes.find(t => t.id === transacaoId);
        if (tx) tx.status = 'Divergente';
    }
}
