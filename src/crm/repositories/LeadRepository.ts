// -------------------------------------------------------------------
// LeadRepository — CRM domain
// -------------------------------------------------------------------

export type LeadStatus = 'Novo' | 'Contato Feito' | 'Interesse Confirmado' | 'Em Triagem' | 'Matriculado' | 'Perdido';
export type LeadOrigem = 'Site' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Indicação' | 'Google Ads' | 'Evento' | 'Outro';

export interface Lead {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cursoInteresse: string;
    cursoId: string | null;
    origem: LeadOrigem;
    status: LeadStatus;
    score: number;            // 0-100 lead scoring
    observacoes: string;
    responsavelId: string | null;
    responsavelNome: string | null;
    criadoEm: string;
    ultimoContato: string | null;
    proximoContato: string | null;
    utmSource: string | null;
    utmCampaign: string | null;
}

export interface MetricasFunil {
    total: number;
    porStatus: Record<LeadStatus, number>;
    taxaConversao: number;    // % Novo → Matriculado
    ticketMedioEstimado: number;
    tempoMedioConversaoDias: number;
}

export interface ILeadRepository {
    findAll(filtros?: { status?: LeadStatus; origem?: LeadOrigem; responsavelId?: string }): Promise<Lead[]>;
    findByFunil(): Promise<Record<LeadStatus, Lead[]>>;
    findById(id: string): Promise<Lead | null>;
    create(lead: Omit<Lead, 'id' | 'criadoEm' | 'score'>): Promise<Lead>;
    updateStatus(id: string, status: LeadStatus, obs?: string): Promise<Lead>;
    update(id: string, data: Partial<Omit<Lead, 'id' | 'criadoEm'>>): Promise<Lead>;
    converter(leadId: string): Promise<{ alunoId: string }>;
    getMetricasFunil(): Promise<MetricasFunil>;
}
