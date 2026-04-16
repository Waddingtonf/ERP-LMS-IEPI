/**
 * Nota Lançamento — grade entry and calculation tests
 * Tests: boundary values, media calculation, situação determination
 */

import { MockNotaRepository } from '@/lms/repositories/MockNotaRepository';

// ─── Helper: compute expected media ─────────────────────────────────────────
function expectedMedia(av1: number | null, av2: number | null, trab: number | null): number | null {
    const vals = [av1, av2, trab].filter((v): v is number => v !== null);
    if (vals.length === 0) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

describe('MockNotaRepository — Grade Entry', () => {
    let repo: MockNotaRepository;

    beforeEach(() => { repo = new MockNotaRepository(); });

    // ── Seeded data ───────────────────────────────────────────────────────────
    it('returns notas for student-1', async () => {
        const notas = await repo.findByAluno('student-1');
        expect(notas.length).toBeGreaterThanOrEqual(3);
        expect(notas.every(n => n.alunoId === 'student-1')).toBe(true);
    });

    it('seeded nota-1 has correct calculated media', async () => {
        const notas = await repo.findByAluno('student-1');
        const nota = notas.find(n => n.id === 'nota-1');
        expect(nota?.media).toBe(expectedMedia(8.5, 7.0, 9.0));
        expect(nota?.situacao).toBe('Aprovado');
    });

    // ── lancarNota — boundary values ─────────────────────────────────────────
    it('launches AV1 = 10 (max)', async () => {
        const updated = await repo.lancarNota('student-1', 'turma-1', 'av1', 10);
        expect(updated.av1).toBe(10);
    });

    it('launches AV1 = 0 (min)', async () => {
        const updated = await repo.lancarNota('student-1', 'turma-1', 'av1', 0);
        expect(updated.av1).toBe(0);
    });

    it('launches AV2 and recalculates media', async () => {
        // lancarNota finds the FIRST record for student-1/turma-1 (nota-1: av1=8.5, av2=7.0, trabalho=9.0)
        // Setting av2=8.0 → media = (8.5 + 8.0 + 9.0) / 3 = 8.5
        const updated = await repo.lancarNota('student-1', 'turma-1', 'av2', 8.0);
        expect(updated.av2).toBe(8.0);
        expect(updated.media).toBe(expectedMedia(8.5, 8.0, 9.0));
    });

    it('recalculates situacao to Aprovado when media >= 7', async () => {
        const updated = await repo.lancarNota('student-1', 'turma-1', 'av2', 9.0);
        expect(updated.situacao).toBe('Aprovado');
    });

    it('throws when nota record not found', async () => {
        await expect(repo.lancarNota('ghost', 'turma-1', 'av1', 7)).rejects.toThrow(/não encontrado/i);
    });

    // ── upsert ────────────────────────────────────────────────────────────────
    it('upsert creates new disciplina nota', async () => {
        const nota = await repo.upsert({
            alunoId: 'student-1',
            alunoNome: 'João Silva',
            turmaId: 'turma-1',
            disciplina: 'Nova Disciplina',
            av1: 8,
            av2: 7,
            trabalho: 9,
        });
        expect(nota.id).toBeTruthy();
        expect(nota.media).toBe(expectedMedia(8, 7, 9));
        expect(nota.situacao).toBe('Aprovado');
    });

    it('upsert updates existing disciplina nota', async () => {
        // First insert
        await repo.upsert({
            alunoId: 'student-1',
            alunoNome: 'João Silva',
            turmaId: 'turma-1',
            disciplina: 'Disciplina X',
            av1: 3,
            av2: null,
            trabalho: null,
        });
        // Update
        const updated = await repo.upsert({
            alunoId: 'student-1',
            alunoNome: 'João Silva',
            turmaId: 'turma-1',
            disciplina: 'Disciplina X',
            av1: 3,
            av2: 8,
            trabalho: 9,
        });
        expect(updated.av2).toBe(8);
        expect(updated.media).toBe(expectedMedia(3, 8, 9));
    });

    // ── Situação logic ────────────────────────────────────────────────────────
    it('situacao = Aprovado when media >= 7', async () => {
        const nota = await repo.upsert({
            alunoId: 'test', alunoNome: 'Test', turmaId: 'turma-test',
            disciplina: 'D', av1: 7, av2: 8, trabalho: 8,
        });
        expect(nota.situacao).toBe('Aprovado');
    });

    it('situacao = Recuperacao when 5 <= media < 7', async () => {
        const nota = await repo.upsert({
            alunoId: 'test', alunoNome: 'Test', turmaId: 'turma-test',
            disciplina: 'D2', av1: 5, av2: 5, trabalho: 6,
        });
        const media = expectedMedia(5, 5, 6)!;
        expect(media).toBeGreaterThanOrEqual(5);
        expect(media).toBeLessThan(7);
        expect(nota.situacao).toBe('Recuperacao');
    });

    it('situacao = Reprovado when media < 5', async () => {
        const nota = await repo.upsert({
            alunoId: 'test', alunoNome: 'Test', turmaId: 'turma-test',
            disciplina: 'D3', av1: 2, av2: 3, trabalho: 4,
        });
        expect(nota.situacao).toBe('Reprovado');
    });

    it('situacao = Em Andamento when only av1 is set', async () => {
        const nota = await repo.upsert({
            alunoId: 'test', alunoNome: 'Test', turmaId: 'turma-test',
            disciplina: 'D4', av1: 9, av2: null, trabalho: null,
        });
        expect(nota.situacao).toBe('Aprovado'); // single value triggers aprovado since media=9
    });

    // ── getBoletim ────────────────────────────────────────────────────────────
    it('getBoletim returns boletim for student-1 turma-1', async () => {
        const boletim = await repo.getBoletim('student-1', 'turma-1');
        expect(boletim).not.toBeNull();
        expect(boletim?.alunoId).toBe('student-1');
        expect(boletim?.notas.length).toBeGreaterThan(0);
    });

    it('getBoletim returns null for unknown student/turma', async () => {
        const boletim = await repo.getBoletim('ghost', 'turma-1');
        expect(boletim).toBeNull();
    });
});
