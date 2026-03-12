/**
 * MockProgressoRepository — in-memory progress tracking.
 */
import { IProgressoRepository, ProgressoAula } from './ProgressoRepository';
import { getCourseRepository } from './index';

export class MockProgressoRepository implements IProgressoRepository {
    private records: ProgressoAula[] = [];

    async findByCurso(alunoId: string, cursoId: string): Promise<ProgressoAula[]> {
        const existing = this.records.filter(r => r.alunoId === alunoId && r.cursoId === cursoId);
        if (existing.length > 0) return existing;

        // Bootstrap: create un-completed records for every material in the course
        const courseRepo = await getCourseRepository();
        const course = await courseRepo.findById(cursoId);
        if (!course) return [];

        const bootstrapped: ProgressoAula[] = [];
        for (const mod of course.modules) {
            for (const mat of mod.materials) {
                const rec: ProgressoAula = {
                    id: `prog-${alunoId}-${mat.id}`,
                    alunoId,
                    cursoId,
                    aulaId: mat.id,
                    modulo: mod.title,
                    concluida: false,
                    concluidaEm: null,
                };
                bootstrapped.push(rec);
            }
        }
        this.records.push(...bootstrapped);
        return bootstrapped;
    }

    async marcarConcluida(alunoId: string, cursoId: string, aulaId: string): Promise<ProgressoAula> {
        await this.findByCurso(alunoId, cursoId); // ensure bootstrapped
        const idx = this.records.findIndex(
            r => r.alunoId === alunoId && r.cursoId === cursoId && r.aulaId === aulaId,
        );
        if (idx === -1) throw new Error('Aula não encontrada no progresso');
        this.records[idx] = {
            ...this.records[idx],
            concluida: true,
            concluidaEm: new Date().toISOString(),
        };
        return this.records[idx];
    }

    async getPercentual(alunoId: string, cursoId: string): Promise<number> {
        const all = await this.findByCurso(alunoId, cursoId);
        if (all.length === 0) return 0;
        const done = all.filter(r => r.concluida).length;
        return Math.round((done / all.length) * 100);
    }
}
