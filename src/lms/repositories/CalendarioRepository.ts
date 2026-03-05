// -------------------------------------------------------------------
// CalendarioRepository — Interface + shared types
// -------------------------------------------------------------------

export type EventoTipo = 'Prova' | 'Entrega' | 'Aula' | 'Feriado' | 'Evento' | 'Recesso' | 'MatriculaAberta' | 'Formatura';

export interface EventoCalendario {
    id: string;
    titulo: string;
    descricao: string;
    tipo: EventoTipo;
    dataInicio: string;  // YYYY-MM-DD
    dataFim: string;     // YYYY-MM-DD
    horaInicio: string | null; // HH:MM
    horaFim: string | null;
    turmaId: string | null;   // null = evento global
    turmaNome: string | null;
    local: string | null;
    cor: string; // hex para UI
    allDay: boolean;
    criadoPor: string;
}

export interface ICalendarioRepository {
    findAll(): Promise<EventoCalendario[]>;
    findByTurma(turmaId: string): Promise<EventoCalendario[]>;
    findByMes(ano: number, mes: number): Promise<EventoCalendario[]>;
    findById(id: string): Promise<EventoCalendario | null>;
    create(evento: Omit<EventoCalendario, 'id'>): Promise<EventoCalendario>;
    update(id: string, data: Partial<Omit<EventoCalendario, 'id'>>): Promise<EventoCalendario>;
    delete(id: string): Promise<void>;
}
