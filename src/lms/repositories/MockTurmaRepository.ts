import { ITurmaRepository, Turma, Aula } from './TurmaRepository';

const INSTRUCTOR_ID = 'docente-1';

const MOCK_AULAS: Aula[] = [
    { id: 'aula-1', turmaId: 'turma-1', moduleId: 'mod-oncologia-1', moduleName: 'Modulo 1 — Introducao', title: 'Aula 01 — Biologias do Cancer', date: '2026-03-02', startTime: '08:00', durationMinutes: 90, status: 'Realizada' },
    { id: 'aula-2', turmaId: 'turma-1', moduleId: 'mod-oncologia-1', moduleName: 'Modulo 1 — Introducao', title: 'Aula 02 — Estadiamento TNM', date: '2026-03-04', startTime: '08:00', durationMinutes: 90, status: 'Realizada' },
    { id: 'aula-3', turmaId: 'turma-1', moduleId: 'mod-oncologia-1', moduleName: 'Modulo 1 — Introducao', title: 'Aula 03 — Protocolos de Quimioterapia', date: '2026-03-06', startTime: '08:00', durationMinutes: 90, status: 'Agendada' },
    { id: 'aula-4', turmaId: 'turma-2', moduleId: 'mod-feridas-1', moduleName: 'Modulo 1 — Anatomia da Pele', title: 'Aula 01 — Anatomia e Fisiologia Cutanea', date: '2026-03-03', startTime: '14:00', durationMinutes: 120, status: 'Realizada' },
    { id: 'aula-5', turmaId: 'turma-2', moduleId: 'mod-feridas-1', moduleName: 'Modulo 1 — Anatomia da Pele', title: 'Aula 02 — Classificacao de Feridas', date: '2026-03-05', startTime: '14:00', durationMinutes: 120, status: 'Agendada' },
];

const SEED_TURMAS: Turma[] = [
    {
        id: 'turma-1',
        courseId: 'course-1',
        courseName: 'Oncologia para Tecnicos',
        code: 'ONC-TEC-2026A',
        instructorId: INSTRUCTOR_ID,
        instructorName: 'Prof. Marcos Oliveira',
        startDate: '02/03/2026',
        endDate: '30/06/2026',
        schedule: 'Seg/Qua/Sex — 08:00 as 10:00',
        location: 'Sala 12',
        maxStudents: 30,
        enrolledCount: 22,
        status: 'Em Andamento',
    },
    {
        id: 'turma-2',
        courseId: 'course-3',
        courseName: 'Feridas, Estomias e Incontinencias',
        code: 'FER-ESP-2026A',
        instructorId: INSTRUCTOR_ID,
        instructorName: 'Prof. Marcos Oliveira',
        startDate: '10/03/2026',
        endDate: '10/07/2026',
        schedule: 'Ter/Qui — 14:00 as 17:00',
        location: 'Online',
        maxStudents: 40,
        enrolledCount: 35,
        status: 'Em Andamento',
    },
    {
        id: 'turma-3',
        courseId: 'course-4',
        courseName: 'Enfermagem Oncologica',
        code: 'ENF-ONC-2026B',
        instructorId: 'docente-2',
        instructorName: 'Prof.a Dra. Carla Bezerra',
        startDate: '15/04/2026',
        endDate: '30/09/2026',
        schedule: 'Seg a Sex — 08:00 as 12:00',
        location: 'Auditorio Central',
        maxStudents: 25,
        enrolledCount: 18,
        status: 'Planejada',
    },
    {
        id: 'turma-4',
        courseId: 'course-10',
        courseName: 'Gestao em Saude e Lideranca',
        code: 'GST-LDR-2026A',
        instructorId: 'docente-2',
        instructorName: 'Prof.a Dra. Carla Bezerra',
        startDate: '01/02/2026',
        endDate: '28/05/2026',
        schedule: 'Sab — 08:00 as 17:00',
        location: 'Sala 5',
        maxStudents: 50,
        enrolledCount: 47,
        status: 'Em Andamento',
    },
];

export class MockTurmaRepository implements ITurmaRepository {
    private turmas: Turma[] = JSON.parse(JSON.stringify(SEED_TURMAS));
    private aulas: Aula[]   = JSON.parse(JSON.stringify(MOCK_AULAS));

    async findAll(): Promise<Turma[]> { return this.turmas; }

    async findById(id: string): Promise<Turma | null> {
        return this.turmas.find(t => t.id === id) ?? null;
    }

    async findByInstructor(instructorId: string): Promise<Turma[]> {
        return this.turmas.filter(t => t.instructorId === instructorId);
    }

    async create(turma: Omit<Turma, 'id' | 'enrolledCount'>): Promise<Turma> {
        const newTurma: Turma = { ...turma, id: `turma-${Date.now()}`, enrolledCount: 0 };
        this.turmas.push(newTurma);
        return newTurma;
    }

    async update(id: string, data: Partial<Omit<Turma, 'id'>>): Promise<Turma> {
        const idx = this.turmas.findIndex(t => t.id === id);
        if (idx === -1) throw new Error('Turma not found');
        this.turmas[idx] = { ...this.turmas[idx], ...data };
        return this.turmas[idx];
    }

    async getAulas(turmaId: string): Promise<Aula[]> {
        return this.aulas.filter(a => a.turmaId === turmaId);
    }

    async createAula(aula: Omit<Aula, 'id'>): Promise<Aula> {
        const newAula: Aula = { ...aula, id: `aula-${Date.now()}` };
        this.aulas.push(newAula);
        return newAula;
    }

    async updateAula(aulaId: string, data: Partial<Omit<Aula, 'id'>>): Promise<Aula> {
        const idx = this.aulas.findIndex(a => a.id === aulaId);
        if (idx === -1) throw new Error('Aula not found');
        this.aulas[idx] = { ...this.aulas[idx], ...data };
        return this.aulas[idx];
    }

    reset() {
        this.turmas = JSON.parse(JSON.stringify(SEED_TURMAS));
        this.aulas  = JSON.parse(JSON.stringify(MOCK_AULAS));
    }
}
