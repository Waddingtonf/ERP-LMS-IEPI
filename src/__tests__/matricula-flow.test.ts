/**
 * Matrícula Flow — event-driven enrollment lifecycle tests
 * Tests: create → status transition → enrollment validation
 */

import { MockEnrollmentRepository } from '@/lms/repositories/MockEnrollmentRepository';
import type { Enrollment } from '@/lms/repositories/EnrollmentRepository';

const newEnrollment = (overrides: Partial<Omit<Enrollment, 'id'>> = {}): Omit<Enrollment, 'id'> => ({
    alunoId: 'test-student',
    alunoName: 'Test Student',
    alunoEmail: 'test@aluno.iepi.edu.br',
    courseId: 'course-new',
    courseName: 'Curso de Teste',
    moduleId: null,
    moduleName: null,
    turmaId: 'turma-test',
    paymentTransactionId: null,
    status: 'Ativo',
    amountPaid: 0,
    dataMatricula: '2026-04-14',
    ...overrides,
});

describe('MockEnrollmentRepository — Lifecycle', () => {
    let repo: MockEnrollmentRepository;

    beforeEach(() => { repo = new MockEnrollmentRepository(); });

    // ── findAll ──────────────────────────────────────────────────────────────
    it('returns seeded enrollments', async () => {
        const all = await repo.findAll();
        expect(all.length).toBeGreaterThanOrEqual(6);
    });

    // ── findByAluno ──────────────────────────────────────────────────────────
    it('finds enrollments for student-1', async () => {
        const enrolls = await repo.findByAluno('student-1');
        expect(enrolls.length).toBeGreaterThanOrEqual(2);
        expect(enrolls.every(e => e.alunoId === 'student-1')).toBe(true);
    });

    it('returns empty for unknown student', async () => {
        const enrolls = await repo.findByAluno('ghost');
        expect(enrolls).toHaveLength(0);
    });

    // ── isEnrolled ───────────────────────────────────────────────────────────
    it('isEnrolled returns true for an existing enrollment', async () => {
        const enrolled = await repo.isEnrolled('student-1', 'course-2');
        expect(enrolled).toBe(true);
    });

    it('isEnrolled returns false for unknown student/course', async () => {
        const enrolled = await repo.isEnrolled('ghost', 'course-2');
        expect(enrolled).toBe(false);
    });

    // ── create ───────────────────────────────────────────────────────────────
    it('creates a new enrollment and persists it', async () => {
        const created = await repo.create(newEnrollment());
        expect(created.id).toBeTruthy();
        const found = await repo.findById(created.id);
        expect(found).toBeDefined();
        expect(found?.alunoId).toBe('test-student');
    });

    it('creates with Ativo status by default', async () => {
        const created = await repo.create(newEnrollment());
        expect(created.status).toBe('Ativo');
    });

    // ── updateStatus ─────────────────────────────────────────────────────────
    it('Ativo → Trancado transition', async () => {
        const created = await repo.create(newEnrollment());
        const updated = await repo.updateStatus(created.id, 'Trancado');
        expect(updated.status).toBe('Trancado');
    });

    it('Ativo → Evadido transition', async () => {
        const created = await repo.create(newEnrollment());
        const updated = await repo.updateStatus(created.id, 'Evadido');
        expect(updated.status).toBe('Evadido');
    });

    it('Ativo → Concluido transition', async () => {
        const created = await repo.create(newEnrollment());
        const updated = await repo.updateStatus(created.id, 'Concluido');
        expect(updated.status).toBe('Concluido');
    });

    it('throws when updating non-existent enrollment', async () => {
        await expect(repo.updateStatus('ghost-id', 'Ativo')).rejects.toThrow(/not found/i);
    });

    // ── Full flow: matrícula → triagem aprovação ──────────────────────────────
    it('Full flow: new student enrollment → approve → active', async () => {
        // 1. Student enrolls — initially "Ativo" (pending triagem)
        const enrollment = await repo.create(newEnrollment({ status: 'Ativo' }));
        expect(enrollment.status).toBe('Ativo');

        // 2. Triagem: finds the enrollment and validates
        const found = await repo.findById(enrollment.id);
        expect(found?.alunoEmail).toContain('@aluno.iepi.edu.br');

        // 3. After document approval, status confirmed as Ativo
        const confirmed = await repo.updateStatus(enrollment.id, 'Ativo');
        expect(confirmed.status).toBe('Ativo');
    });

    // ── findByCourse ─────────────────────────────────────────────────────────
    it('findByCourse returns enrollments for a course', async () => {
        const enrolls = await repo.findByCourse('course-1');
        expect(enrolls.every(e => e.courseId === 'course-1')).toBe(true);
    });

    // ── findByTurma ──────────────────────────────────────────────────────────
    it('findByTurma returns enrollments for a turma', async () => {
        const enrolls = await repo.findByTurma('turma-1');
        expect(enrolls.every(e => e.turmaId === 'turma-1')).toBe(true);
    });
});
