import { IFrequenciaRepository, Frequencia, FrequenciaResumo } from './FrequenciaRepository';

// Seed: alunos da turma-1 para as aulas aula-1 e aula-2
const ALUNOS_TURMA1 = [
    { alunoId: 'student-1', alunoName: 'Joao Silva' },
    { alunoId: 'student-2', alunoName: 'Maria Almeida' },
    { alunoId: 'student-3', alunoName: 'Pedro Alves' },
    { alunoId: 'student-4', alunoName: 'Ana Santos' },
    { alunoId: 'student-5', alunoName: 'Carlos Eduardo' },
];

const ALUNOS_TURMA2 = [
    { alunoId: 'student-1', alunoName: 'Joao Silva' },
    { alunoId: 'student-6', alunoName: 'Fernanda Rocha' },
    { alunoId: 'student-7', alunoName: 'Ricardo Mendes' },
];

function seedRecords(): Frequencia[] {
    const records: Frequencia[] = [];
    let idx = 1;

    // turma-1 / aula-1
    const pres1 = [true, true, false, true, true];
    ALUNOS_TURMA1.forEach((a, i) => {
        records.push({ id: `freq-${idx++}`, aulaId: 'aula-1', ...a, presente: pres1[i], registradoEm: '2026-03-02T10:00:00Z' });
    });

    // turma-1 / aula-2
    const pres2 = [true, false, true, true, false];
    ALUNOS_TURMA1.forEach((a, i) => {
        records.push({ id: `freq-${idx++}`, aulaId: 'aula-2', ...a, presente: pres2[i], registradoEm: '2026-03-04T10:00:00Z' });
    });

    // turma-2 / aula-4
    const pres3 = [true, true, false];
    ALUNOS_TURMA2.forEach((a, i) => {
        records.push({ id: `freq-${idx++}`, aulaId: 'aula-4', ...a, presente: pres3[i], registradoEm: '2026-03-03T15:00:00Z' });
    });

    return records;
}

// turmaId  → list of students in that turma
const TURMA_STUDENTS: Record<string, typeof ALUNOS_TURMA1> = {
    'turma-1': ALUNOS_TURMA1,
    'turma-2': ALUNOS_TURMA2,
};

// aulaId → turmaId (for reverse-lookup when doing resume)
const AULA_TURMA: Record<string, string> = {
    'aula-1': 'turma-1',
    'aula-2': 'turma-1',
    'aula-3': 'turma-1',
    'aula-4': 'turma-2',
    'aula-5': 'turma-2',
};

export class MockFrequenciaRepository implements IFrequenciaRepository {
    private records: Frequencia[] = seedRecords();

    async findByAula(aulaId: string): Promise<Frequencia[]> {
        return this.records.filter(r => r.aulaId === aulaId);
    }

    async findByAlunoTurma(alunoId: string, turmaId: string): Promise<Frequencia[]> {
        const turmaAulaIds = Object.entries(AULA_TURMA)
            .filter(([, tid]) => tid === turmaId)
            .map(([aid]) => aid);
        return this.records.filter(r => r.alunoId === alunoId && turmaAulaIds.includes(r.aulaId));
    }

    async getResumoTurma(turmaId: string): Promise<FrequenciaResumo[]> {
        const turmaAulaIds = Object.entries(AULA_TURMA)
            .filter(([, tid]) => tid === turmaId)
            .map(([aid]) => aid);

        const students = TURMA_STUDENTS[turmaId] ?? [];
        return students.map(s => {
            const myRecords = this.records.filter(r => r.alunoId === s.alunoId && turmaAulaIds.includes(r.aulaId));
            const presentes = myRecords.filter(r => r.presente).length;
            const totalAulas = turmaAulaIds.length;
            return {
                alunoId: s.alunoId,
                alunoName: s.alunoName,
                totalAulas,
                presentes,
                percentual: totalAulas === 0 ? 0 : Math.round((presentes / totalAulas) * 100),
            };
        });
    }

    async bulkUpsert(
        aulaId: string,
        records: { alunoId: string; alunoName: string; presente: boolean; observacao?: string }[]
    ): Promise<Frequencia[]> {
        const now = new Date().toISOString();
        const result: Frequencia[] = [];
        for (const rec of records) {
            const existing = this.records.find(r => r.aulaId === aulaId && r.alunoId === rec.alunoId);
            if (existing) {
                existing.presente   = rec.presente;
                existing.observacao = rec.observacao;
                result.push(existing);
            } else {
                const newRec: Frequencia = {
                    id: `freq-${Date.now()}-${rec.alunoId}`,
                    aulaId,
                    alunoId: rec.alunoId,
                    alunoName: rec.alunoName,
                    presente: rec.presente,
                    observacao: rec.observacao,
                    registradoEm: now,
                };
                this.records.push(newRec);
                result.push(newRec);
            }
        }
        return result;
    }

    reset() { this.records = seedRecords(); }
}
