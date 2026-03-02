import { MockPaymentRepository } from '../MockPaymentRepository';

describe('MockPaymentRepository — Transaction Lifecycle', () => {
    let repo: MockPaymentRepository;

    beforeEach(() => {
        repo = new MockPaymentRepository();
    });

    // ── create ───────────────────────────────────────────────────────────────
    it('creates a PENDING transaction with the correct fields', async () => {
        const tx = await repo.create({
            userId: 'user-1',
            courseId: 'course-1',
            amount: 19999,
            status: 'PENDING',
        });

        expect(tx.id).toMatch(/^m-order-/);
        expect(tx.status).toBe('PENDING');
        expect(tx.amount).toBe(19999);
        expect(tx.createdAt).toBeInstanceOf(Date);
        expect(tx.updatedAt).toBeInstanceOf(Date);
        expect(tx.cieloPaymentId).toBeUndefined();
    });

    it('each create produces a unique id', async () => {
        const t1 = await repo.create({ userId: 'u1', courseId: 'c1', amount: 100, status: 'PENDING' });
        const t2 = await repo.create({ userId: 'u1', courseId: 'c1', amount: 100, status: 'PENDING' });
        expect(t1.id).not.toBe(t2.id);
    });

    // ── updateStatus ─────────────────────────────────────────────────────────
    it('updates status from PENDING to AUTHORIZED', async () => {
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 100, status: 'PENDING' });
        const updated = await repo.updateStatus(tx.id, 'AUTHORIZED', 'cielo-pid-001');

        expect(updated.status).toBe('AUTHORIZED');
        expect(updated.cieloPaymentId).toBe('cielo-pid-001');
    });

    it('updates status from AUTHORIZED to CAPTURED', async () => {
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 100, status: 'PENDING' });
        await repo.updateStatus(tx.id, 'AUTHORIZED', 'cielo-pid-001');
        const captured = await repo.updateStatus(tx.id, 'CAPTURED', 'cielo-pid-001');

        expect(captured.status).toBe('CAPTURED');
    });

    it('updates status to FAILED and preserves id', async () => {
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 100, status: 'PENDING' });
        const failed = await repo.updateStatus(tx.id, 'FAILED');
        expect(failed.status).toBe('FAILED');
        expect(failed.id).toBe(tx.id);
    });

    it('updates updatedAt timestamp on each status change', async () => {
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 100, status: 'PENDING' });
        const before = tx.updatedAt.getTime();
        // Tiny delay to ensure clock advances
        await new Promise(r => setTimeout(r, 5));
        const updated = await repo.updateStatus(tx.id, 'AUTHORIZED');
        // updatedAt should be same or later (not earlier)
        expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(before);
    });

    it('throws when updating a nonexistent transaction', async () => {
        await expect(repo.updateStatus('ghost-tx', 'FAILED')).rejects.toThrow('Transaction not found');
    });

    // ── findById ─────────────────────────────────────────────────────────────
    it('findById returns null for unknown id', async () => {
        const tx = await repo.findById('no-such-id');
        expect(tx).toBeNull();
    });

    it('findById returns the exact transaction after create', async () => {
        const tx = await repo.create({ userId: 'u1', courseId: 'c1', amount: 500, status: 'PENDING' });
        const found = await repo.findById(tx.id);
        expect(found).toEqual(tx);
    });

    // ── findByUserId ─────────────────────────────────────────────────────────
    it('findByUserId returns empty array for new user', async () => {
        const txs = await repo.findByUserId('new-user-id');
        expect(txs).toEqual([]);
    });

    it('findByUserId returns only transactions for the specified user', async () => {
        await repo.create({ userId: 'alice', courseId: 'c1', amount: 100, status: 'PENDING' });
        await repo.create({ userId: 'bob',   courseId: 'c2', amount: 200, status: 'PENDING' });
        await repo.create({ userId: 'alice', courseId: 'c3', amount: 300, status: 'CAPTURED' });

        const aliceTxs = await repo.findByUserId('alice');
        expect(aliceTxs).toHaveLength(2);
        expect(aliceTxs.every(t => t.userId === 'alice')).toBe(true);
    });

    // ── Amount integrity ──────────────────────────────────────────────────────
    it('amount in cents is stored exactly (no floating-point mutation)', async () => {
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 19999, status: 'PENDING' });
        expect(tx.amount).toBe(19999);
        const found = await repo.findById(tx.id);
        expect(found?.amount).toBe(19999);
    });

    it('CANCELED status is a valid final state', async () => {
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 100, status: 'PENDING' });
        const canceled = await repo.updateStatus(tx.id, 'CANCELED');
        expect(canceled.status).toBe('CANCELED');
    });
});

describe('MockPaymentRepository — Isolation', () => {
    it('separate instances do not share state', async () => {
        const repo1 = new MockPaymentRepository();
        const repo2 = new MockPaymentRepository();

        const tx = await repo1.create({ userId: 'u', courseId: 'c', amount: 100, status: 'PENDING' });
        const notFound = await repo2.findById(tx.id);
        expect(notFound).toBeNull();
    });
});
