// -------------------------------------------------------------------
// FrequenciaRepository — Interface + shared types
// -------------------------------------------------------------------

export interface Frequencia {
    id: string;
    aulaId: string;
    alunoId: string;
    alunoName: string;
    presente: boolean;
    observacao?: string;
    registradoEm: string; // ISO
}

/** Aggregate per student in a turma */
export interface FrequenciaResumo {
    alunoId: string;
    alunoName: string;
    totalAulas: number;
    presentes: number;
    percentual: number; // 0-100
}

export interface IFrequenciaRepository {
    /** All attendance records for one aula */
    findByAula(aulaId: string): Promise<Frequencia[]>;

    /** All records for a student across all aulas of a turma */
    findByAlunoTurma(alunoId: string, turmaId: string): Promise<Frequencia[]>;

    /** Aggregate attendance summary for every student in a turma */
    getResumoTurma(turmaId: string): Promise<FrequenciaResumo[]>;

    /** Insert or update attendance for a list of students in one aula */
    bulkUpsert(aulaId: string, records: { alunoId: string; alunoName: string; presente: boolean; observacao?: string }[]): Promise<Frequencia[]>;
}
