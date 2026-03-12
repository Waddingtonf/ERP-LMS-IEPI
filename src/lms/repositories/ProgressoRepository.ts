/**
 * ProgressoRepository — tracks per-student lesson completion.
 */

export interface ProgressoAula {
    id: string;
    alunoId: string;
    cursoId: string;
    aulaId: string;      // material/video id
    modulo: string;      // module title (for display)
    concluida: boolean;
    concluidaEm: string | null; // ISO date
}

export interface IProgressoRepository {
    findByCurso(alunoId: string, cursoId: string): Promise<ProgressoAula[]>;
    marcarConcluida(alunoId: string, cursoId: string, aulaId: string): Promise<ProgressoAula>;
    getPercentual(alunoId: string, cursoId: string): Promise<number>;
}
