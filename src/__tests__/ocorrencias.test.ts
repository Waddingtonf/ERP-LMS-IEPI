/**
 * Ocorrências — event lifecycle tests
 * Tests: CRUD, status transitions, edge cases
 */

import { MockOcorrenciaRepository } from '@/lms/repositories/MockOcorrenciaRepository';
import type { Ocorrencia } from '@/lms/repositories/OcorrenciaRepository';

describe('MockOcorrenciaRepository — CRUD', () => {
    let repo: MockOcorrenciaRepository;

    beforeEach(() => {
        repo = new MockOcorrenciaRepository();
    });

    // ── findAll ──────────────────────────────────────────────────────────────
    it('returns seeded ocorrências (>= 6)', async () => {
        const list = await repo.findAll();
        expect(list.length).toBeGreaterThanOrEqual(6);
    });

    // ── findByStatus ─────────────────────────────────────────────────────────
    it('findByStatus ABERTA returns only open ocorrências', async () => {
        const abertas = await repo.findByStatus('ABERTA');
        expect(abertas.every(o => o.status === 'ABERTA')).toBe(true);
    });

    it('findByStatus RESOLVIDA returns only resolved ocorrências', async () => {
        const resolvidas = await repo.findByStatus('RESOLVIDA');
        expect(resolvidas.every(o => o.status === 'RESOLVIDA')).toBe(true);
    });

    // ── findByTipo ───────────────────────────────────────────────────────────
    it('findByTipo TRIAGEM returns only triagem ocorrências', async () => {
        const triagem = await repo.findByTipo('TRIAGEM');
        expect(triagem.every(o => o.tipo === 'TRIAGEM')).toBe(true);
    });

    // ── findByAluno ──────────────────────────────────────────────────────────
    it('findByAluno returns ocorrências for specific student', async () => {
        const ocorrencias = await repo.findByAluno('student-1');
        expect(ocorrencias.every(o => o.alunoId === 'student-1')).toBe(true);
    });

    it('findByAluno returns empty for unknown student', async () => {
        const ocorrencias = await repo.findByAluno('ghost-student');
        expect(ocorrencias).toHaveLength(0);
    });

    // ── create ───────────────────────────────────────────────────────────────
    it('creates a new ocorrência with status ABERTA', async () => {
        const created = await repo.create({
            tipo: 'ACADEMICA',
            prioridade: 'ALTA',
            titulo: 'Aluno sem acesso ao material',
            descricao: 'O aluno relatou que não consegue acessar o material PDF do módulo 3.',
            alunoId: 'student-99',
        });

        expect(created.id).toMatch(/^oc-/);
        expect(created.status).toBe('ABERTA');
        expect(created.tipo).toBe('ACADEMICA');
        expect(created.prioridade).toBe('ALTA');
        expect(created.resolvidoEm).toBeUndefined();
    });

    it('creates two ocorrências with different ids', async () => {
        const oc1 = await repo.create({ tipo: 'SISTEMA', prioridade: 'BAIXA', titulo: 'A', descricao: 'Teste 1' });
        const oc2 = await repo.create({ tipo: 'SISTEMA', prioridade: 'BAIXA', titulo: 'B', descricao: 'Teste 2' });
        expect(oc1.id).not.toBe(oc2.id);
    });

    it('created ocorrência appears in findAll', async () => {
        const beforeCount = (await repo.findAll()).length;
        await repo.create({ tipo: 'DISCIPLINAR', prioridade: 'MEDIA', titulo: 'Nova', descricao: 'Descrição nova' });
        const afterCount = (await repo.findAll()).length;
        expect(afterCount).toBe(beforeCount + 1);
    });

    // ── updateStatus ─────────────────────────────────────────────────────────
    it('updates ABERTA → RESOLVIDA with resolucao', async () => {
        const created = await repo.create({ tipo: 'TRIAGEM', prioridade: 'ALTA', titulo: 'Doc faltando', descricao: 'RG não enviado' });
        const resolved = await repo.updateStatus(created.id, 'RESOLVIDA', 'Aluno enviou o RG por email.');

        expect(resolved.status).toBe('RESOLVIDA');
        expect(resolved.resolucao).toBe('Aluno enviou o RG por email.');
        expect(resolved.resolvidoEm).toBeDefined();
    });

    it('updates ABERTA → EM_ANALISE', async () => {
        const created = await repo.create({ tipo: 'REQUERIMENTO', prioridade: 'MEDIA', titulo: 'Declaração', descricao: 'Precisa de declaração' });
        const inProgress = await repo.updateStatus(created.id, 'EM_ANALISE');
        expect(inProgress.status).toBe('EM_ANALISE');
        expect(inProgress.resolvidoEm).toBeUndefined();
    });

    it('updates → CANCELADA sets resolvidoEm', async () => {
        const created = await repo.create({ tipo: 'FINANCEIRA', prioridade: 'BAIXA', titulo: 'Boleto', descricao: 'Dúvida sobre boleto' });
        const cancelled = await repo.updateStatus(created.id, 'CANCELADA');
        expect(cancelled.resolvidoEm).toBeDefined();
    });

    it('throws when updating non-existent ocorrência', async () => {
        await expect(repo.updateStatus('ghost-oc', 'RESOLVIDA')).rejects.toThrow(/não encontrada/i);
    });

    // ── atribuir ─────────────────────────────────────────────────────────────
    it('assigns an ocorrência and changes status to EM_ANALISE', async () => {
        const created = await repo.create({ tipo: 'ACADEMICA', prioridade: 'ALTA', titulo: 'Nota errada', descricao: 'AV1 com nota incorreta' });
        const assigned = await repo.atribuir(created.id, 'coord-1', 'Coordenação Pedagógica');

        expect(assigned.atribuidoParaId).toBe('coord-1');
        expect(assigned.atribuidoParaNome).toBe('Coordenação Pedagógica');
        expect(assigned.status).toBe('EM_ANALISE');
    });

    it('throws when assigning non-existent ocorrência', async () => {
        await expect(repo.atribuir('ghost', 'user-1', 'Test')).rejects.toThrow(/não encontrada/i);
    });
});

describe('MockOcorrenciaRepository — Full Lifecycle', () => {
    it('ABERTA → EM_ANALISE → RESOLVIDA full flow', async () => {
        const repo = new MockOcorrenciaRepository();

        const oc = await repo.create({
            tipo: 'TRIAGEM',
            prioridade: 'ALTA',
            titulo: 'Documentação pendente',
            descricao: 'Diploma de ensino médio não enviado.',
            alunoId: 'student-new',
        });
        expect(oc.status).toBe('ABERTA');

        const assigned = await repo.atribuir(oc.id, 'sec-1', 'Secretaria');
        expect(assigned.status).toBe('EM_ANALISE');

        const resolved = await repo.updateStatus(oc.id, 'RESOLVIDA', 'Aluno apresentou diploma presencialmente.');
        expect(resolved.status).toBe('RESOLVIDA');
        expect(resolved.resolucao).toContain('diploma');
        expect(resolved.resolvidoEm).toBeDefined();

        // Verify it persists correctly in store
        const found = await repo.findById(oc.id);
        expect(found?.status).toBe('RESOLVIDA');
    });

    it('handles 50 concurrent ocorrência creates', async () => {
        const repo = new MockOcorrenciaRepository();
        const tasks = Array.from({ length: 50 }, (_, i) =>
            repo.create({ tipo: 'SISTEMA', prioridade: 'BAIXA', titulo: `Ocorrência ${i}`, descricao: `Desc ${i}` })
        );
        const results = await Promise.all(tasks);
        const ids = new Set(results.map(o => o.id));
        expect(ids.size).toBe(50); // all unique ids
    });
});
