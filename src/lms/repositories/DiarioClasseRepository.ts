// -------------------------------------------------------------------
// DiarioClasseRepository — SIGAA-inspired class diary
// -------------------------------------------------------------------

export interface RegistroAula {
    id: string;
    turmaId: string;
    aulaId: string;
    data: string;           // YYYY-MM-DD
    horaInicio: string;     // HH:MM
    horaFim: string;
    cargaHoraria: number;   // minutes
    /** Content taught (from teaching plan) */
    conteudoMinistar: string;
    conteudoMiniado: string; // what was actually taught
    metodologia: string;
    observacoes: string;
    situacao: 'Planejada' | 'Realizada' | 'Cancelada' | 'Reposicao';
    instrutorId: string;
    instrutorNome: string;
    /** Was attendance recorded? */
    frequenciaRegistrada: boolean;
}

export interface DiarioClasse {
    id: string;
    turmaId: string;
    turmaNome: string;
    instrutorId: string;
    instrutorNome: string;
    periodoLetivo: string;   // "1/2026"
    cargaHorariaPrevista: number;   // hours
    cargaHorariaRealizada: number;  // hours
    percentualCumprimento: number;  // 0-100
    registros: RegistroAula[];
    status: 'Aberto' | 'Encerrado' | 'Homologado';
    fechadoEm: string | null;
}

export interface IDiarioClasseRepository {
    findByTurma(turmaId: string): Promise<DiarioClasse | null>;
    findByInstructor(instructorId: string): Promise<DiarioClasse[]>;
    getRegistros(turmaId: string): Promise<RegistroAula[]>;
    upsertRegistro(turmaId: string, aula: Omit<RegistroAula, 'id'>): Promise<RegistroAula>;
    encerrarDiario(turmaId: string): Promise<DiarioClasse>;
    create(turmaId: string, instrutorId: string): Promise<DiarioClasse>;
}
