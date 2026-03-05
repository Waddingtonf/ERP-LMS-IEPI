import { ICampanhaRepository, Campanha, MetricasCampanha, CampanhaStatus } from './CampanhaRepository';

const SEED: Campanha[] = [
    { id: 'camp-1', nome: 'Oncologia Mar/26 — Instagram Reels', tipo: 'Meta Ads', status: 'Ativa', objetivo: 'Geração de leads para turma ONC-TEC-2026A', cursoAlvo: 'Oncologia para Técnicos', orcamento: 3000, gastoAtual: 1840, dataInicio: '2026-03-01', dataFim: '2026-03-31', criadoPor: 'Ana Rodrigues', descricao: 'Campanha de vídeo no Instagram Reels e Feed, público técnicos de enfermagem 25-45 anos, Ceará e Piauí.', publicoAlvo: 'Técnicos de enfermagem, 25-45 anos, Ceará e Piauí' },
    { id: 'camp-2', nome: 'UTI Adulto — Google Search', tipo: 'Google Ads', status: 'Ativa', objetivo: 'Captura de demanda ativa para curso de UTI', cursoAlvo: 'UTI Adulto', orcamento: 2500, gastoAtual: 1210, dataInicio: '2026-03-01', dataFim: '2026-04-30', criadoPor: 'Ana Rodrigues', descricao: 'Campanha search cobrindo termos como "curso UTI enfermagem", "especialização UTI adulto Fortaleza".', publicoAlvo: 'Enfermeiros em busca ativa, palavras-chave de alta intenção' },
    { id: 'camp-3', nome: 'Email — Base Recuperação Evasão', tipo: 'Email Marketing', status: 'Encerrada', objetivo: 'Reativar ex-alunos que abandonaram antes de concluir', cursoAlvo: null, orcamento: 200, gastoAtual: 200, dataInicio: '2026-02-01', dataFim: '2026-02-28', criadoPor: 'Ana Rodrigues', descricao: 'Sequência de 3 emails para 218 ex-alunos inativos com proposta de retorno com bolsa de 20%.', publicoAlvo: '218 ex-alunos inativos há > 60 dias' },
    { id: 'camp-4', nome: 'WhatsApp — Lembrete Matrícula 2026.2', tipo: 'WhatsApp', status: 'Rascunho', objetivo: 'Reaquecer leads quentes do funil para abertura de vagas 2026.2', cursoAlvo: null, orcamento: 300, gastoAtual: 0, dataInicio: '2026-04-01', dataFim: '2026-04-30', criadoPor: 'Ana Rodrigues', descricao: 'Mensagem + botão CTA para leads com status "Interesse Confirmado" que ainda não matricularam.', publicoAlvo: 'Leads status >= Interesse Confirmado' },
];

const METRICAS: Record<string, MetricasCampanha> = {
    'camp-1': { campanhaId: 'camp-1', impressoes: 84200, cliques: 2180, leads: 47, matriculas: 12, ctr: 2.59, cpl: 39.15, cpa: 153.33, roi: 285, roas: 3.85 },
    'camp-2': { campanhaId: 'camp-2', impressoes: 12400, cliques: 890, leads: 28, matriculas: 8, ctr: 7.18, cpl: 43.21, cpa: 151.25, roi: 318, roas: 4.18 },
    'camp-3': { campanhaId: 'camp-3', impressoes: 218, cliques: 98, leads: 15, matriculas: 7, ctr: 44.95, cpl: 13.33, cpa: 28.57, roi: 1540, roas: 16.4 },
    'camp-4': { campanhaId: 'camp-4', impressoes: 0, cliques: 0, leads: 0, matriculas: 0, ctr: 0, cpl: 0, cpa: 0, roi: 0, roas: 0 },
};

export class MockCampanhaRepository implements ICampanhaRepository {
    private campanhas: Campanha[] = JSON.parse(JSON.stringify(SEED));

    async findAll(status?: CampanhaStatus): Promise<Campanha[]> {
        return status ? this.campanhas.filter(c => c.status === status) : [...this.campanhas];
    }

    async findById(id: string): Promise<Campanha | null> {
        return this.campanhas.find(c => c.id === id) ?? null;
    }

    async create(campanha: Omit<Campanha, 'id' | 'gastoAtual'>): Promise<Campanha> {
        const nova = { ...campanha, id: `camp-${Date.now()}`, gastoAtual: 0 };
        this.campanhas.push(nova);
        return nova;
    }

    async update(id: string, data: Partial<Omit<Campanha, 'id'>>): Promise<Campanha> {
        const idx = this.campanhas.findIndex(c => c.id === id);
        if (idx === -1) throw new Error('Campanha não encontrada');
        this.campanhas[idx] = { ...this.campanhas[idx], ...data };
        return this.campanhas[idx];
    }

    async encerrar(id: string): Promise<void> {
        await this.update(id, { status: 'Encerrada' });
    }

    async getMetricas(campanhaId: string): Promise<MetricasCampanha> {
        return METRICAS[campanhaId] ?? { campanhaId, impressoes: 0, cliques: 0, leads: 0, matriculas: 0, ctr: 0, cpl: 0, cpa: 0, roi: 0, roas: 0 };
    }
}
