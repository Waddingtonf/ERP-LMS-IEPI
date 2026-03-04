// -------------------------------------------------------------------
// EnrollmentRepository — Interface + shared types
// -------------------------------------------------------------------

export type EnrollmentStatus = 'Ativo' | 'Evadido' | 'Concluido' | 'Trancado';

export interface Enrollment {
    id: string;
    alunoId: string;
    alunoName: string;
    alunoEmail: string;
    courseId: string;
    courseName: string;
    /** null when buying the full course bundle */
    moduleId: string | null;
    moduleName: string | null;
    turmaId: string | null;
    paymentTransactionId: string | null;
    status: EnrollmentStatus;
    /** Amount paid in centavos */
    amountPaid: number;
    dataMatricula: string; // "YYYY-MM-DD"
}

export interface IEnrollmentRepository {
    findAll(): Promise<Enrollment[]>;
    findById(id: string): Promise<Enrollment | null>;
    findByAluno(alunoId: string): Promise<Enrollment[]>;
    findByTurma(turmaId: string): Promise<Enrollment[]>;
    findByCourse(courseId: string): Promise<Enrollment[]>;
    create(enrollment: Omit<Enrollment, 'id'>): Promise<Enrollment>;
    updateStatus(id: string, status: EnrollmentStatus): Promise<Enrollment>;
    /** Check if a student is already enrolled in a given course or module */
    isEnrolled(alunoId: string, courseId: string, moduleId?: string): Promise<boolean>;
}
