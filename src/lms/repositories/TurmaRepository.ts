// -------------------------------------------------------------------
// TurmaRepository — Interface + shared types
// -------------------------------------------------------------------

export interface Turma {
    id: string;
    courseId: string;
    courseName: string;
    code: string;           // e.g. "ENF-ONC-2026A"
    instructorId: string;
    instructorName: string;
    startDate: string;      // "DD/MM/YYYY"
    endDate: string;
    schedule: string;       // "Matutino — Seg/Qua/Sex"
    location: string;       // sala ou "Online"
    maxStudents: number;
    enrolledCount: number;
    status: 'Planejada' | 'Em Andamento' | 'Concluida' | 'Cancelada';
}

export interface Aula {
    id: string;
    turmaId: string;
    moduleId: string | null;
    moduleName: string | null;
    title: string;
    date: string;           // "YYYY-MM-DD"
    startTime: string;      // "HH:MM"
    durationMinutes: number;
    status: 'Agendada' | 'Realizada' | 'Cancelada';
}

export interface ITurmaRepository {
    findAll(): Promise<Turma[]>;
    findById(id: string): Promise<Turma | null>;
    findByInstructor(instructorId: string): Promise<Turma[]>;
    create(turma: Omit<Turma, 'id' | 'enrolledCount'>): Promise<Turma>;
    update(id: string, data: Partial<Omit<Turma, 'id'>>): Promise<Turma>;

    // Aulas
    getAulas(turmaId: string): Promise<Aula[]>;
    createAula(aula: Omit<Aula, 'id'>): Promise<Aula>;
    updateAula(aulaId: string, data: Partial<Omit<Aula, 'id'>>): Promise<Aula>;
}
