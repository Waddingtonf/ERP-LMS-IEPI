import { IBolsaRepository, Bolsa, BolsaAluno } from './BolsaRepository';

const SEED_BOLSAS: Bolsa[] = [
    { id: 'bolsa-1', nome: 'Bolsa CRM — Indicação', tipo: 'Desconto', percentualDesconto: 15, valorMaximo: 500, descricao: 'Desconto para alunos indicados por ex-alunos.', requisitos: 'Email do ex-aluno indicante + código de indicação.', status: 'Ativa', vagasTotal: 999, vagasOcupadas: 47, dataInicio: '2026-01-01', dataFim: null, cursoIds: [] },
    { id: 'bolsa-2', nome: 'Bolsa Social — PRONATEC Parceiro', tipo: 'Programa Social', percentualDesconto: 80, valorMaximo: 2200, descricao: 'Parceria com programa governamental para profissionais da saúde pública.', requisitos: 'Comprovante de vínculo com SUS + renda familiar até 3 SM.', status: 'Ativa', vagasTotal: 20, vagasOcupadas: 18, dataInicio: '2026-02-01', dataFim: '2026-12-31', cursoIds: ['course-1', 'course-2', 'course-3'] },
    { id: 'bolsa-3', nome: 'Desconto Pagamento Antecipado', tipo: 'Desconto', percentualDesconto: 10, valorMaximo: null, descricao: '10% de desconto para pagamento integral antecipado.', requisitos: 'Pagamento via boleto ou PIX em conta única.', status: 'Ativa', vagasTotal: 999, vagasOcupadas: 132, dataInicio: '2026-01-01', dataFim: null, cursoIds: [] },
    { id: 'bolsa-4', nome: 'Convênio Hospital Santa Cruz', tipo: 'Convenio', percentualDesconto: 25, valorMaximo: 800, descricao: 'Convênio exclusivo para funcionários do Hospital Santa Cruz.', requisitos: 'Carteirinha funcional do hospital + holerite.', status: 'Ativa', vagasTotal: 30, vagasOcupadas: 12, dataInicio: '2026-03-01', dataFim: '2026-12-31', cursoIds: ['course-1', 'course-4'] },
    { id: 'bolsa-5', nome: 'Bolsa Excelência Acadêmica', tipo: 'Parcial', percentualDesconto: 50, valorMaximo: 1500, descricao: 'Para ex-alunos com média geral acima de 9,0.', requisitos: 'Histórico acadêmico do curso anterior com média ≥ 9,0.', status: 'Ativa', vagasTotal: 10, vagasOcupadas: 3, dataInicio: '2026-01-01', dataFim: null, cursoIds: [] },
];

const SEED_ALUNOS: BolsaAluno[] = [
    { id: 'ba-1', bolsaId: 'bolsa-1', bolsaNome: 'Bolsa CRM — Indicação', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', percentualConced: 15, valorOriginal: 1980, valorComDesconto: 1683, dataAplicacao: '2026-03-01', dataVencimento: null, status: 'Ativa', aprovadoPor: 'Ana Rodrigues' },
    { id: 'ba-2', bolsaId: 'bolsa-2', bolsaNome: 'Bolsa Social — PRONATEC Parceiro', alunoId: 'student-3', alunoNome: 'Carlos Eduardo Lima', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', percentualConced: 80, valorOriginal: 1980, valorComDesconto: 396, dataAplicacao: '2026-03-05', dataVencimento: '2026-12-31', status: 'Ativa', aprovadoPor: 'Ana Rodrigues' },
];

export class MockBolsaRepository implements IBolsaRepository {
    private bolsas: Bolsa[] = JSON.parse(JSON.stringify(SEED_BOLSAS));
    private aplicadas: BolsaAluno[] = JSON.parse(JSON.stringify(SEED_ALUNOS));

    async findAll(): Promise<Bolsa[]> { return [...this.bolsas]; }

    async findById(id: string): Promise<Bolsa | null> {
        return this.bolsas.find(b => b.id === id) ?? null;
    }

    async findByAluno(alunoId: string): Promise<BolsaAluno[]> {
        return this.aplicadas.filter(a => a.alunoId === alunoId);
    }

    async create(bolsa: Omit<Bolsa, 'id' | 'vagasOcupadas'>): Promise<Bolsa> {
        const nova = { ...bolsa, id: `bolsa-${Date.now()}`, vagasOcupadas: 0 };
        this.bolsas.push(nova);
        return nova;
    }

    async update(id: string, data: Partial<Omit<Bolsa, 'id'>>): Promise<Bolsa> {
        const idx = this.bolsas.findIndex(b => b.id === id);
        if (idx === -1) throw new Error('Bolsa não encontrada');
        this.bolsas[idx] = { ...this.bolsas[idx], ...data };
        return this.bolsas[idx];
    }

    async aplicar(bolsaId: string, alunoId: string, turmaId: string, valorOriginal: number, aprovadoPor: string): Promise<BolsaAluno> {
        const bolsa = this.bolsas.find(b => b.id === bolsaId);
        if (!bolsa) throw new Error('Bolsa não encontrada');
        if (bolsa.vagasTotal > 0 && bolsa.vagasOcupadas >= bolsa.vagasTotal) throw new Error('Bolsa sem vagas disponíveis');
        const desconto = valorOriginal * (bolsa.percentualDesconto / 100);
        const valorComDesconto = valorOriginal - (bolsa.valorMaximo ? Math.min(desconto, bolsa.valorMaximo) : desconto);
        const aplicada: BolsaAluno = {
            id: `ba-${Date.now()}`, bolsaId, bolsaNome: bolsa.nome, alunoId, alunoNome: 'Aluno',
            turmaId, turmaNome: 'Turma',
            percentualConced: bolsa.percentualDesconto, valorOriginal, valorComDesconto,
            dataAplicacao: new Date().toISOString().split('T')[0], dataVencimento: bolsa.dataFim,
            status: 'Ativa', aprovadoPor,
        };
        bolsa.vagasOcupadas++;
        this.aplicadas.push(aplicada);
        return aplicada;
    }

    async revogar(bolsaAlunoId: string, _motivo: string): Promise<void> {
        const idx = this.aplicadas.findIndex(a => a.id === bolsaAlunoId);
        if (idx !== -1) {
            const bolsaId = this.aplicadas[idx].bolsaId;
            this.aplicadas[idx].status = 'Encerrada';
            const bolsa = this.bolsas.find(b => b.id === bolsaId);
            if (bolsa && bolsa.vagasOcupadas > 0) bolsa.vagasOcupadas--;
        }
    }
}
