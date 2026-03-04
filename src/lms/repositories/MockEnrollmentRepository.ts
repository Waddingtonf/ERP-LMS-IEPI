import { IEnrollmentRepository, Enrollment, EnrollmentStatus } from './EnrollmentRepository';

const SEED: Enrollment[] = [
    {
        id: 'enroll-1',
        alunoId: 'student-1',
        alunoName: 'Joao Silva',
        alunoEmail: 'joao.silva@aluno.iepi.edu.br',
        courseId: 'course-2',
        courseName: 'Cuidados Paliativos',
        moduleId: null,
        moduleName: null,
        turmaId: 'turma-2',
        paymentTransactionId: 'pmt-1',
        status: 'Ativo',
        amountPaid: 49900,
        dataMatricula: '2025-10-01',
    },
    {
        id: 'enroll-2',
        alunoId: 'student-1',
        alunoName: 'Joao Silva',
        alunoEmail: 'joao.silva@aluno.iepi.edu.br',
        courseId: 'course-3',
        courseName: 'Feridas, Estomias e Incontinencias',
        moduleId: null,
        moduleName: null,
        turmaId: 'turma-2',
        paymentTransactionId: 'pmt-2',
        status: 'Ativo',
        amountPaid: 89900,
        dataMatricula: '2025-10-05',
    },
    {
        id: 'enroll-3',
        alunoId: 'student-2',
        alunoName: 'Maria Almeida',
        alunoEmail: 'maria.almeida@aluno.iepi.edu.br',
        courseId: 'course-1',
        courseName: 'Oncologia para Tecnicos',
        moduleId: null,
        moduleName: null,
        turmaId: 'turma-1',
        paymentTransactionId: 'pmt-3',
        status: 'Ativo',
        amountPaid: 49900,
        dataMatricula: '2025-10-02',
    },
    {
        id: 'enroll-4',
        alunoId: 'student-3',
        alunoName: 'Pedro Alves',
        alunoEmail: 'pedro.alves@aluno.iepi.edu.br',
        courseId: 'course-1',
        courseName: 'Oncologia para Tecnicos',
        moduleId: null,
        moduleName: null,
        turmaId: 'turma-1',
        paymentTransactionId: 'pmt-4',
        status: 'Evadido',
        amountPaid: 49900,
        dataMatricula: '2025-10-01',
    },
    {
        id: 'enroll-5',
        alunoId: 'student-4',
        alunoName: 'Ana Santos',
        alunoEmail: 'ana.santos@aluno.iepi.edu.br',
        courseId: 'course-10',
        courseName: 'Gestao em Saude e Lideranca',
        moduleId: null,
        moduleName: null,
        turmaId: 'turma-4',
        paymentTransactionId: 'pmt-5',
        status: 'Ativo',
        amountPaid: 119900,
        dataMatricula: '2026-02-01',
    },
    {
        id: 'enroll-6',
        alunoId: 'student-5',
        alunoName: 'Carlos Eduardo',
        alunoEmail: 'carlos.eduardo@aluno.iepi.edu.br',
        courseId: 'course-4',
        courseName: 'Enfermagem Oncologica',
        moduleId: 'mod-enf-onco-1',
        moduleName: 'Modulo 1 — Fundamentos de Oncologia',
        turmaId: 'turma-3',
        paymentTransactionId: 'pmt-6',
        status: 'Ativo',
        amountPaid: 32475,
        dataMatricula: '2026-01-15',
    },
];

export class MockEnrollmentRepository implements IEnrollmentRepository {
    private enrollments: Enrollment[] = JSON.parse(JSON.stringify(SEED));

    async findAll(): Promise<Enrollment[]> { return this.enrollments; }

    async findById(id: string): Promise<Enrollment | null> {
        return this.enrollments.find(e => e.id === id) ?? null;
    }

    async findByAluno(alunoId: string): Promise<Enrollment[]> {
        return this.enrollments.filter(e => e.alunoId === alunoId);
    }

    async findByTurma(turmaId: string): Promise<Enrollment[]> {
        return this.enrollments.filter(e => e.turmaId === turmaId);
    }

    async findByCourse(courseId: string): Promise<Enrollment[]> {
        return this.enrollments.filter(e => e.courseId === courseId);
    }

    async create(enrollment: Omit<Enrollment, 'id'>): Promise<Enrollment> {
        const newEnrollment: Enrollment = { ...enrollment, id: `enroll-${Date.now()}` };
        this.enrollments.push(newEnrollment);
        return newEnrollment;
    }

    async updateStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
        const idx = this.enrollments.findIndex(e => e.id === id);
        if (idx === -1) throw new Error('Enrollment not found');
        this.enrollments[idx].status = status;
        return this.enrollments[idx];
    }

    async isEnrolled(alunoId: string, courseId: string, moduleId?: string): Promise<boolean> {
        return this.enrollments.some(e => {
            if (e.alunoId !== alunoId || e.courseId !== courseId) return false;
            if (moduleId) return e.moduleId === moduleId;
            return e.moduleId === null; // full-course enrollment
        });
    }

    reset() { this.enrollments = JSON.parse(JSON.stringify(SEED)); }
}
