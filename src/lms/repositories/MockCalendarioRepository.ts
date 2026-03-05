import { ICalendarioRepository, EventoCalendario } from './CalendarioRepository';

const SEED: EventoCalendario[] = [
    { id: 'ev-1', titulo: 'AV1 — Biologia do Câncer', descricao: 'Primeira avaliação do módulo 1. Prova escrita.', tipo: 'Prova', dataInicio: '2026-03-15', dataFim: '2026-03-15', horaInicio: '08:00', horaFim: '10:00', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', local: 'Sala 12', cor: '#EF4444', allDay: false, criadoPor: 'Prof. Marcos Oliveira' },
    { id: 'ev-2', titulo: 'Entrega — Trabalho Estadiamento TNM', descricao: 'Entrega do trabalho em grupo via portal.', tipo: 'Entrega', dataInicio: '2026-03-25', dataFim: '2026-03-25', horaInicio: '23:59', horaFim: null, turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', local: 'Online', cor: '#F97316', allDay: false, criadoPor: 'Prof. Marcos Oliveira' },
    { id: 'ev-3', titulo: 'Seminário — Classificação de Feridas', descricao: 'Apresentação de revisões integrativas em grupo.', tipo: 'Prova', dataInicio: '2026-03-22', dataFim: '2026-03-22', horaInicio: '14:00', horaFim: '17:00', turmaId: 'turma-2', turmaNome: 'FER-ESP-2026A', local: 'Online', cor: '#EF4444', allDay: false, criadoPor: 'Prof.a Dra. Carla Bezerra' },
    { id: 'ev-4', titulo: 'Recesso de Carnaval', descricao: 'Não haverá aulas presenciais ou online.', tipo: 'Recesso', dataInicio: '2026-03-03', dataFim: '2026-03-05', horaInicio: null, horaFim: null, turmaId: null, turmaNome: null, local: null, cor: '#6B7280', allDay: true, criadoPor: 'Secretaria IEPI' },
    { id: 'ev-5', titulo: 'Abertura de Matrículas — 2026.2', descricao: 'Início do período de matrículas para o segundo semestre letivo.', tipo: 'MatriculaAberta', dataInicio: '2026-04-01', dataFim: '2026-04-30', horaInicio: null, horaFim: null, turmaId: null, turmaNome: null, local: null, cor: '#22C55E', allDay: true, criadoPor: 'Secretaria IEPI' },
    { id: 'ev-6', titulo: 'AV2 — Quimioterapia e Protocolos', descricao: 'Prova prática em laboratório de simulação.', tipo: 'Prova', dataInicio: '2026-04-10', dataFim: '2026-04-10', horaInicio: '08:00', horaFim: '11:00', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', local: 'Lab Simulação', cor: '#EF4444', allDay: false, criadoPor: 'Prof. Marcos Oliveira' },
    { id: 'ev-7', titulo: 'Formatura — Turmas 2025.2', descricao: 'Solenidade de colação de grau das turmas concluintes do segundo semestre de 2025.', tipo: 'Formatura', dataInicio: '2026-03-28', dataFim: '2026-03-28', horaInicio: '19:00', horaFim: '22:00', turmaId: null, turmaNome: null, local: 'Auditório Central', cor: '#8B5CF6', allDay: false, criadoPor: 'Coordenação IEPI' },
    { id: 'ev-8', titulo: 'Feriado — Tiradentes', descricao: '', tipo: 'Feriado', dataInicio: '2026-04-21', dataFim: '2026-04-21', horaInicio: null, horaFim: null, turmaId: null, turmaNome: null, local: null, cor: '#6B7280', allDay: true, criadoPor: 'Sistema' },
];

export class MockCalendarioRepository implements ICalendarioRepository {
    private eventos: EventoCalendario[] = JSON.parse(JSON.stringify(SEED));

    async findAll(): Promise<EventoCalendario[]> { return [...this.eventos]; }

    async findByTurma(turmaId: string): Promise<EventoCalendario[]> {
        return this.eventos.filter(e => e.turmaId === null || e.turmaId === turmaId);
    }

    async findByMes(ano: number, mes: number): Promise<EventoCalendario[]> {
        return this.eventos.filter(e => {
            const d = new Date(e.dataInicio);
            return d.getFullYear() === ano && d.getMonth() + 1 === mes;
        });
    }

    async findById(id: string): Promise<EventoCalendario | null> {
        return this.eventos.find(e => e.id === id) ?? null;
    }

    async create(evento: Omit<EventoCalendario, 'id'>): Promise<EventoCalendario> {
        const novo = { ...evento, id: `ev-${Date.now()}` };
        this.eventos.push(novo);
        return novo;
    }

    async update(id: string, data: Partial<Omit<EventoCalendario, 'id'>>): Promise<EventoCalendario> {
        const idx = this.eventos.findIndex(e => e.id === id);
        if (idx === -1) throw new Error('Evento não encontrado');
        this.eventos[idx] = { ...this.eventos[idx], ...data };
        return this.eventos[idx];
    }

    async delete(id: string): Promise<void> {
        const idx = this.eventos.findIndex(e => e.id === id);
        if (idx !== -1) this.eventos.splice(idx, 1);
    }
}
