// -------------------------------------------------------------------
// CampanhaRepository — CRM domain
// -------------------------------------------------------------------

export type CampanhaTipo = 'Email Marketing' | 'WhatsApp' | 'SMS' | 'Google Ads' | 'Meta Ads' | 'Evento';
export type CampanhaStatus = 'Rascunho' | 'Agendada' | 'Ativa' | 'Pausada' | 'Encerrada';

export interface Campanha {
    id: string;
    nome: string;
    tipo: CampanhaTipo;
    status: CampanhaStatus;
    objetivo: string;
    cursoAlvo: string | null;
    orcamento: number;
    gastoAtual: number;
    dataInicio: string;
    dataFim: string | null;
    criadoPor: string;
    descricao: string;
    publicoAlvo: string;
}

export interface MetricasCampanha {
    campanhaId: string;
    impressoes: number;
    cliques: number;
    leads: number;
    matriculas: number;
    ctr: number;   // cliques/impressoes
    cpl: number;   // custo por lead
    cpa: number;   // custo por aquisição
    roi: number;   // retorno sobre investimento %
    roas: number;  // receita gerada / gasto
}

export interface ICampanhaRepository {
    findAll(status?: CampanhaStatus): Promise<Campanha[]>;
    findById(id: string): Promise<Campanha | null>;
    create(campanha: Omit<Campanha, 'id' | 'gastoAtual'>): Promise<Campanha>;
    update(id: string, data: Partial<Omit<Campanha, 'id'>>): Promise<Campanha>;
    encerrar(id: string): Promise<void>;
    getMetricas(campanhaId: string): Promise<MetricasCampanha>;
}
