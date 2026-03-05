import { ILeadRepository, Lead, LeadStatus, LeadOrigem, MetricasFunil } from './LeadRepository';

const SEED: Lead[] = [
    { id: 'lead-1', nome: 'Priscila Rocha', email: 'priscila.rocha@gmail.com', telefone: '(85) 99871-4422', cursoInteresse: 'Oncologia para Técnicos', cursoId: 'course-1', origem: 'Instagram', status: 'Novo', score: 62, observacoes: 'Viu o anúncio de reels. Tecnica de enf. há 3 anos.', responsavelId: null, responsavelNome: null, criadoEm: '2026-03-05', ultimoContato: null, proximoContato: '2026-03-06', utmSource: 'instagram', utmCampaign: 'campanha-oncologia-mar26' },
    { id: 'lead-2', nome: 'Rafael Pinheiro', email: 'rafael.pin@hotmail.com', telefone: '(85) 98846-3311', cursoInteresse: 'UTI Adulto e Cuidados Intensivos', cursoId: 'course-3', origem: 'WhatsApp', status: 'Contato Feito', score: 78, observacoes: 'Entrou em contato pelo WhatsApp. Quer iniciar em abril.', responsavelId: 'admin-1', responsavelNome: 'Ana Rodrigues', criadoEm: '2026-03-03', ultimoContato: '2026-03-04', proximoContato: '2026-03-08', utmSource: null, utmCampaign: null },
    { id: 'lead-3', nome: 'Fernanda Lopes', email: 'ferlopes@gmail.com', telefone: '(85) 99312-7788', cursoInteresse: 'Feridas, Estomias e Incontinências', cursoId: 'course-2', origem: 'Google Ads', status: 'Interesse Confirmado', score: 85, observacoes: 'Demostrou alto interesse. Pediu proposta de bolsa.', responsavelId: 'admin-1', responsavelNome: 'Ana Rodrigues', criadoEm: '2026-03-01', ultimoContato: '2026-03-04', proximoContato: '2026-03-07', utmSource: 'google', utmCampaign: 'search-feridas-geral' },
    { id: 'lead-4', nome: 'Thiago Arruda', email: 'thiarruda@outlook.com', telefone: '(85) 98234-6690', cursoInteresse: 'MBA Gestão em Saúde', cursoId: 'course-6', origem: 'Site', status: 'Em Triagem', score: 91, observacoes: 'Documentação enviada. Aguardando validação COREN.', responsavelId: 'admin-1', responsavelNome: 'Ana Rodrigues', criadoEm: '2026-02-25', ultimoContato: '2026-03-05', proximoContato: null, utmSource: 'organico', utmCampaign: null },
    { id: 'lead-5', nome: 'Camila Braga', email: 'camilabraga.enf@gmail.com', telefone: '(85) 99467-2214', cursoInteresse: 'Enfermagem Oncológica', cursoId: 'course-4', origem: 'Indicação', status: 'Matriculado', score: 95, observacoes: 'Indicada pela ex-aluna Joana Melo. Matriculada turma ONC-2026A.', responsavelId: 'admin-1', responsavelNome: 'Ana Rodrigues', criadoEm: '2026-02-20', ultimoContato: '2026-03-02', proximoContato: null, utmSource: null, utmCampaign: null },
    { id: 'lead-6', nome: 'Diego Santos', email: 'diego.s@gmail.com', telefone: '(85) 98111-9900', cursoInteresse: 'Oncologia para Técnicos', cursoId: 'course-1', origem: 'Facebook', status: 'Perdido', score: 35, observacoes: 'Não respondeu ao terceiro contato. Marcado como inativo.', responsavelId: null, responsavelNome: null, criadoEm: '2026-02-15', ultimoContato: '2026-02-28', proximoContato: null, utmSource: 'facebook', utmCampaign: 'campanha-fev26' },
    { id: 'lead-7', nome: 'Juliana Mota', email: 'jumota.enf@gmail.com', telefone: '(85) 99678-5544', cursoInteresse: 'Centro Cirúrgico e CME', cursoId: 'course-5', origem: 'WhatsApp', status: 'Novo', score: 58, observacoes: 'Mensagem recebida hoje. Trabalha em CC há 2 anos.', responsavelId: null, responsavelNome: null, criadoEm: '2026-03-05', ultimoContato: null, proximoContato: '2026-03-06', utmSource: null, utmCampaign: null },
    { id: 'lead-8', nome: 'Leonardo Castro', email: 'leo.castro@proton.me', telefone: '(85) 98342-1123', cursoInteresse: 'UTI Adulto', cursoId: 'course-3', origem: 'Evento', status: 'Contato Feito', score: 72, observacoes: 'Conhecido no evento SOENF 2026. Pediu mais informações.', responsavelId: 'admin-1', responsavelNome: 'Ana Rodrigues', criadoEm: '2026-03-04', ultimoContato: '2026-03-05', proximoContato: '2026-03-10', utmSource: 'evento', utmCampaign: 'soenf-2026' },
];

const ORDEM_STATUS: LeadStatus[] = ['Novo', 'Contato Feito', 'Interesse Confirmado', 'Em Triagem', 'Matriculado', 'Perdido'];

export class MockLeadRepository implements ILeadRepository {
    private leads: Lead[] = JSON.parse(JSON.stringify(SEED));

    async findAll(filtros?: { status?: LeadStatus; origem?: LeadOrigem; responsavelId?: string }): Promise<Lead[]> {
        let result = [...this.leads];
        if (filtros?.status) result = result.filter(l => l.status === filtros.status);
        if (filtros?.origem) result = result.filter(l => l.origem === filtros.origem);
        if (filtros?.responsavelId) result = result.filter(l => l.responsavelId === filtros.responsavelId);
        return result.sort((a, b) => b.score - a.score);
    }

    async findByFunil(): Promise<Record<LeadStatus, Lead[]>> {
        const funil = {} as Record<LeadStatus, Lead[]>;
        for (const s of ORDEM_STATUS) funil[s] = this.leads.filter(l => l.status === s);
        return funil;
    }

    async findById(id: string): Promise<Lead | null> {
        return this.leads.find(l => l.id === id) ?? null;
    }

    async create(lead: Omit<Lead, 'id' | 'criadoEm' | 'score'>): Promise<Lead> {
        const novo: Lead = { ...lead, id: `lead-${Date.now()}`, criadoEm: new Date().toISOString().split('T')[0], score: 50 };
        this.leads.push(novo);
        return novo;
    }

    async updateStatus(id: string, status: LeadStatus, obs?: string): Promise<Lead> {
        const lead = this.leads.find(l => l.id === id);
        if (!lead) throw new Error('Lead não encontrado');
        lead.status = status;
        lead.ultimoContato = new Date().toISOString().split('T')[0];
        if (obs) lead.observacoes = obs;
        return lead;
    }

    async update(id: string, data: Partial<Omit<Lead, 'id' | 'criadoEm'>>): Promise<Lead> {
        const idx = this.leads.findIndex(l => l.id === id);
        if (idx === -1) throw new Error('Lead não encontrado');
        this.leads[idx] = { ...this.leads[idx], ...data };
        return this.leads[idx];
    }

    async converter(leadId: string): Promise<{ alunoId: string }> {
        await this.updateStatus(leadId, 'Matriculado');
        return { alunoId: `student-${Date.now()}` };
    }

    async getMetricasFunil(): Promise<MetricasFunil> {
        const total = this.leads.length;
        const porStatus = {} as Record<LeadStatus, number>;
        for (const s of ORDEM_STATUS) porStatus[s] = this.leads.filter(l => l.status === s).length;
        const taxaConversao = total > 0 ? Math.round((porStatus['Matriculado'] / total) * 100) : 0;
        return { total, porStatus, taxaConversao, ticketMedioEstimado: 2180, tempoMedioConversaoDias: 12 };
    }
}
